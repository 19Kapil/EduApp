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
  isSentByTeacher?: boolean;
  room?: string;
}

interface FetchMessagesResponse {
  success: boolean;
  messages: ChatMessage[];
}

interface ServerToClientEvents {
  newMessage: (message: ChatMessage) => void;
}

interface ClientToServerEvents {
  sendMessage: (message: ChatMessage) => void;
  joinRoom: (room: string) => void;
  leaveRoom: (room: string) => void;
}

interface Props {
  route: {
    params: {
      name: string;
      teacherId: string;
      userid: string;
    };
  };
  navigation: any;
}

const TChat: React.FC<Props> = ({ route, navigation }) => {
  const { name, teacherId, userid } = route.params;
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
      setError(null);
      try {
        const { data }: { data: FetchMessagesResponse } = await axios.get(
          `http://192.168.1.64:5000/api/messages/${teacherId}/${userid}`
        );
        if (data.success) {
          setChatMessages(
            data.messages.map((msg: ChatMessage) => ({
              ...msg,
              isSentByTeacher: msg.senderid === teacherId,
              date: msg.date,
            }))
          );
        }
      } catch (err) {
        setError("USER NOT REGISTERED CHILD  YET !!!.");
        console.error("Error fetching chat messages:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatMessages();

    const room = [userid, teacherId].sort().join("-");
    socket.emit("joinRoom", room);

    socket.on("newMessage", (msg: ChatMessage) => {
      setChatMessages((prevMessages) => {
        return [
          ...prevMessages,
          {
            ...msg,
            isSentByTeacher: msg.senderid == teacherId,  
            date: msg.date,
          },
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
        senderid: teacherId,
        receiverid: userid,
        date: new Date().toISOString(),
        room: `${[teacherId, userid].sort().join("-")}`,
      };
      setMessage("");

      try {
        await axios.post(
          `http://192.168.1.64:5000/api/sendmessage/${teacherId}/${userid}`,
          newMessage
        );

        socket.emit("sendMessage", newMessage);
      } catch (err) {
        setError("User Not Found Yet !!!");
        console.error("Error sending message:", err);
      }
    }
  };

  useEffect(() => {
    if (scrollViewRef.current)
      scrollViewRef.current.scrollToEnd({ animated: true });
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
  const makePhoneCall = (userid: string) => {
    const url = `tel:${userid}`;
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
      {/* Header */}
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
            source={require("../assets/images/student.jpeg")}
            style={styles.avatar}
          />
          <Text style={styles.title}>{name}'s Parent</Text>
        </View>
        {!error && (
          <TouchableOpacity onPress={() => makePhoneCall(`${userid}`)}>
            <Ionicons
              name="call"
              size={30}
              color="blue"
              style={styles.phoneIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Chat Messages */}
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
        keyboardShouldPersistTaps="handled"
      >
        {error && <Text style={styles.errorText}>{error}</Text>}
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, idx) => {
            const isSentByTeacher = msg.senderid == teacherId;
            return (
              <View
                key={idx}
                style={[
                  styles.messageContainer,
                  isSentByTeacher ? styles.sentMessage : styles.receivedMessage,
                ]}
              >
                <View style={styles.messageContent}>
                <Text
                  style={[
                    styles.messageText,
                    { color: isSentByTeacher ? "white" : "black" },
                  ]}
                >
                  {msg.message}
                  <Text style={styles.timestamp}>
                  {"\t   "}
                    {formatTime(msg.date)}</Text>
                </Text>
                </View>
              </View>
            );
          })
        ) : (
          <Text style={styles.noMessagesText}>No messages yet!!!!</Text>
        )}
      </ScrollView>

      {/* Input Field */}
      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Ionicons name="image" size={30} style={styles.icon} />
        </TouchableOpacity>
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
    justifyContent: "space-around",
  },

  messageContent: {
    flexDirection: "row",
    justifyContent: "space-between",
   
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
  messageText: {
    fontSize: 18,
    paddingRight: 10,
    
  },

  timestamp: {
    fontSize: 9,
    
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
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
  icon: { color: "blue", marginRight: 10 },
  sendButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

  sendButton: {
    backgroundColor: "blue",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: {
    fontSize: 18,
    color: "red",
    marginVertical: 10,
    textAlign: "center",
  },
  noMessagesText: {
    fontSize: 20,
    color: "black",
    marginVertical: 250,
    textAlign: "center",
  },
  phoneIcon: { marginLeft: 30, marginTop: 5 },
  
});

export default TChat;
