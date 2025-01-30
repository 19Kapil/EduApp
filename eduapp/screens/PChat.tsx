import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { io, Socket } from "socket.io-client";
import { Linking } from "react-native";
import moment from "moment";

interface ChatMessage {
  message: string;
  senderid: string;
  receiverid: string;
  date: string;
  isSentByParent?: boolean;
  room?: string;
}

interface Props {
  route: {
    params: {
      name: string;
      teacherId: string;
      userid: string;
      teacherPhNo: string;
    };
  };
  navigation: any;
}

interface ServerToClientEvents {
  newMessage: (message: ChatMessage) => void;
}

interface ClientToServerEvents {
  sendMessage: (message: ChatMessage) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

const PChat: React.FC<Props> = ({ route, navigation }) => {
  const { name, teacherId, userid, teacherPhNo } = route.params;
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const socket: Socket<ServerToClientEvents, ClientToServerEvents> = useRef(
    io("http://192.168.1.64:5000")
  ).current;

  useEffect(() => {
    const fetchChatMessages = async () => {
      setLoading(true);
      try {
        const {
          data,
        }: { data: { success: boolean; messages: ChatMessage[] } } =
          await axios.get(
            `http://192.168.1.64:5000/api/messages/${userid}/${teacherId}`
          );

        if (data.success) {
          setChatMessages(
            data.messages.map((msg) => ({
              ...msg,
              isSentByParent: msg.senderid === userid,
              date: msg.date,
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching chat messages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();

    const room = [userid, teacherId].sort().join("-");
    socket.emit("joinRoom", room);

    socket.on("newMessage", (newMessage: ChatMessage) => {
      setChatMessages((prevMessages) => {
        return [
          ...prevMessages,
          { ...newMessage, isSentByParent: newMessage.senderid == userid },
        ];
      });
    });

    return () => {
      socket.emit("leaveRoom", room);
      socket.off("newMessage");
    };
  }, [teacherId, userid]);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        message: message.trim(),
        senderid: userid,
        receiverid: teacherId,
        date: new Date().toISOString(),
        room: `${[userid, teacherId].sort().join("-")}`,
      };

      try {
        await axios.post(
          `http://192.168.1.64:5000/api/sendmessage/${userid}/${teacherId}`,
          newMessage
        );

        socket.emit("sendMessage", newMessage);

        setMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [chatMessages]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text>Loading chat...</Text>
      </View>
    );
  }

  const formatTime = (timestamp: string) => {
    return moment(timestamp).format("hh:mm A");
  };

  // Make Phone Call
  const makePhoneCall = (teacherPhNo: string) => {
    const url = `tel:${teacherPhNo}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert("Error", "Phone dialer not supported on this device");
        }
      })
      .catch((err) => console.error("Error opening dialer", err));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={50}
            marginLeft={12}
            color="black"
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image
            source={require("../assets/images/teacher.jpeg")}
            style={styles.avatar}
          />
          <Text style={styles.title}>{name}</Text>
        </View>
        {!error && (
          <TouchableOpacity onPress={() => makePhoneCall(`${teacherPhNo}`)}>
            <Ionicons
              name="call"
              size={30}
              color="blue"
              style={styles.phoneIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
        keyboardShouldPersistTaps="handled"
      >
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, idx) => {
            const isSentByParent = msg.senderid == userid;
            return (
              <View
                key={idx}
                style={[
                  styles.messageContainer,
                  isSentByParent ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    { color: isSentByParent ? "white" : "black" },
                  ]}
                >
                  {msg.message}
                  <Text style={styles.timestamp}>
                    {"\t \t"}
                    {formatTime(msg.date)}
                  </Text>
                </Text>
              </View>
            );
          })
        ) : (
          <Text style={styles.noMessagesText}>No messages yet.</Text>
        )}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, marginTop: 10 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 50,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatContainer: { flexGrow: 1, paddingBottom: 20 },
  messageContainer: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    maxWidth: "80%",
  },
  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    marginRight: 13,
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    marginLeft: 15,
  },
  messageText: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },

  timestamp: {
    fontSize: 9,
  },

  input: {
    flex: 1,
    marginRight: 10,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: "#ccc",
  },
  sendButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
  sendButton: {
    backgroundColor: "blue",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // errorText: {  fontSize: 18,color: "red", marginVertical: 10, textAlign: "center"  },
  noMessagesText: {
    fontSize: 20,
    color: "black",
    marginVertical: 250,
    textAlign: "center",
  },
  phoneIcon: { marginLeft: 30, marginTop: 5 },
});

export default PChat;
