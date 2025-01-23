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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { io, Socket } from "socket.io-client";

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
  const { name, teacherId, userid } = route.params;
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={35} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image
            source={require("../assets/images/teacher.jpeg")}
            style={styles.avatar}
          />
          <Text style={styles.title}>{name}</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.chatContainer}
        keyboardShouldPersistTaps="handled"
      >
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, idx) => {
            const isSentByParent = msg.senderid === userid;
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
                </Text>
              </View>
            );
          })
        ) : (
          <Text>No messages yet.</Text>
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
  container: { flex: 1, paddingHorizontal: 20, marginTop: 30 },
  header: { flexDirection: "row", alignItems: "center" },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
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
  },
  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
    marginLeft: 10,
    width: "50%",
  },
  messageText: { fontSize: 16 },
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
});

export default PChat;
