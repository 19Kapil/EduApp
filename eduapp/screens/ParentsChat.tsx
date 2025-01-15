import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import FontSize from "../constants/FontSize";
import Font from "../constants/Font";

type Props = NativeStackScreenProps<RootStackParamList, "ParentsChatScreen">;
type RootStackParamList = {
  ParentsChatScreen: undefined;
  ChatScreen: { teacher: { name: string; avatar: any } };
};

const ParentsChatScreen: React.FC<Props> = ({ navigation }) => {
  const chatData = [
    {
      name: "Suman Karki",
      avatar: require("../assets/images/suman.jpg"),
      messages: [{ content: "Hello!", sender: "Suman Karki" }],
    },
    {
      name: "Ram Poudel",
      avatar: require("../assets/images/ram.jpg"), // Replace with actual image path
      messages: [{ content: "Hi there!", sender: "Ram Poudel" }],
    },
    {
      name: "Dinesh Aryal",
      avatar: require("../assets/images/dinesh.jpg"), // Replace with actual image path
      messages: [{ content: "Hi Sir!", sender: "Dinesh Aryal" }],
    },
    {
      name: "Dolraj Aryal",
      avatar: require("../assets/images/dolraj.jpg"), // Replace with actual image path
      messages: [{ content: "Namaskar!", sender: "Dolraj  Aryal" }],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <Text
          style={{
            fontSize: FontSize.large,
            fontFamily: Font["poppins-bold"],
            marginLeft: 10,
          }}
        >
          Messaging
        </Text>
      </View>

      <View style={styles.chatContainer}>
        {chatData.map((chat, index) => (
          <TouchableOpacity
            key={index}
            style={styles.chatItem}
            onPress={() => {
              navigation.navigate("ChatScreen", {
                teacher: {
                  name: chat.name,
                  avatar: chat.avatar,
                },
              });
            }}
          >
            <Image source={chat.avatar} style={styles.avatar} />
            <View style={styles.textContainer}>
              <Text
                style={{
                  fontFamily: Font["poppins-bold"],
                  fontSize: FontSize.medium,
                }}
              >
                {chat.name}
              </Text>
              <Text
                style={{
                  fontFamily: Font["poppins-semiBold"],
                  fontSize: FontSize.small,
                }}
              >
                {chat.messages.length > 0
                  ? chat.messages[chat.messages.length - 1].content
                  : "Start chatting"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatContainer: {
    marginTop: 30,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
});

export default ParentsChatScreen;
