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
import Colors from "../constants/Colors";
import { ScrollView } from "react-native";
type Props = NativeStackScreenProps<RootStackParamList, "TeacherChatScreen">;
type RootStackParamList = {
  TeacherChatScreen: undefined;
  TChatScreen: { parent: { name: string; avatar: any } };
};

const TeacherChatScreen: React.FC<Props> = ({ navigation }) => {
  const chatData = [
    {
      name: "Parents 1",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 2",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
    },
    {
      name: "Parents 3",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 4",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
    },
    {
      name: "Parents 1",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 5",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
    },
    {
      name: "Parents 1",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 6",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
    },
    {
      name: "Parents 7",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 8",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
    },
    {
      name: "Parents 1",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 9",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
    },
    {
      name: "Parents 1",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hello!", sender: "Parent 1" }],
    },
    {
      name: "Parents 10",
      avatar: require("../assets/images/teacher1.jpg"),
      messages: [{ content: "Hi there!", sender: "Parent 2" }],
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
        {/* <TouchableOpacity>
          <Ionicons name="search" size={30} style={{ color: Colors.primary }} />
        </TouchableOpacity> */}
      </View>

      <View style={styles.chatContainer}>
        <ScrollView>
          {chatData.map((chat, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chatItem}
              onPress={() => {
                navigation.navigate("TChatScreen", {
                  parent: {
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
        </ScrollView>
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
    marginBottom: 50,
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
  // Other styles...
});

export default TeacherChatScreen;
