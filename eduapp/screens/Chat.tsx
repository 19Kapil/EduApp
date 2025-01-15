import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { StatusBar } from "expo-status-bar";
import FontSize from "../constants/FontSize";
import Font from "../constants/Font";
import { ImageSourcePropType } from "react-native";
import Colors from "../constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
type Teacher = {
  name: string;
  avatar: ImageSourcePropType | null;
};

type ChatScreenProps = NativeStackScreenProps<RootStackParamList, "ChatScreen">;

const ChatScreen: React.FC<ChatScreenProps> = ({ route, navigation }) => {
  const { teacher } = route.params ?? { teacher: { name: "", avatar: null } };
  const [message, setMessage] = useState<string>("");
  const [chatMessages, setChatMessages] = useState([
    { content: "Hello!", sender: "You" },
    { content: "Hi there!", sender: teacher.name },
  ]);

  const avatarSource = teacher.avatar
    ? teacher.avatar
    : require("../assets/images/teacher1.jpg");

  const sendMessage = async () => {
    if (message.trim() !== "") {
      const newMessage = { content: message.trim(), sender: "You" };
      const updatedMessages = [...chatMessages, newMessage];
      setChatMessages(updatedMessages);
      setMessage("");

      try {
        // Save messages to AsyncStorage
        await AsyncStorage.setItem(
          "chatMessages",
          JSON.stringify(updatedMessages)
        );
      } catch (error) {
        console.error("Error saving messages:", error);
      }
    }
  };
  const [callEndTime, setCallEndTime] = useState<string | null>(null);

  // Load call end time from AsyncStorage
  useEffect(() => {
    const loadCallEndTime = async () => {
      try {
        const endTime = await AsyncStorage.getItem("callEndTime");
        setCallEndTime(endTime);
      } catch (error) {
        console.error("Error loading call end time:", error);
      }
    };

    loadCallEndTime();
  }, []);

  // Function to display call end time in a box
  const renderCallEndTimeBox = () => {
    if (callEndTime) {
      return (
        <View style={styles.callEndTimeBox}>
          <Text>Call ended at: {callEndTime}</Text>
        </View>
      );
    }
    return null;
  };
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const savedMessages = await AsyncStorage.getItem("chatMessages");
        if (savedMessages !== null) {
          setChatMessages(JSON.parse(savedMessages));
        }
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    };

    loadMessages();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons
            name="chevron-back"
            size={45}
            style={{ color: Colors.primary }}
          />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Image source={avatarSource} style={styles.avatar} />
          <Text style={styles.title}>{teacher.name}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("CallScreen", { teacher })}
        >
          <Ionicons name="call" size={30} style={{ color: Colors.primary }} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.chatContainer}>
        {chatMessages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageContainer,
              message.sender === "You"
                ? styles.sentMessage
                : styles.receivedMessage,
            ]}
          >
            <Text
              style={[
                styles.messageText,
                message.sender === "You" && { color: "white" },
              ]}
            >
              {message.content}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TouchableOpacity>
          <Ionicons
            name="image"
            size={30}
            style={{ color: Colors.primary, marginRight: 10 }}
          />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage}>
          <View style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Send</Text>
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
      {renderCallEndTimeBox()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sentMessage: {
    backgroundColor: "blue",
    alignSelf: "flex-end",
  },
  receivedMessage: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    marginLeft: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  chatContainer: {
    flexGrow: 1,
  },
  messageContainer: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignSelf: "flex-start",
    marginVertical: 5,
    maxWidth: "80%",
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
  sendButtonText: {
    color: "white",
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-semiBold"],
  },
  sendButton: {
    backgroundColor: "blue",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
  },
  messageText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: "black",
  },
});

export default ChatScreen;
