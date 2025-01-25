import React, { useState,useCallback } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontSize from "../constants/FontSize";
import Font from "../constants/Font";
import { useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import DefaultAvatar from "../assets/images/teacher.jpeg";
import axios from "axios";


type RootStackParamList = {
  ParentChatScreen: { userid: string; childclass: number; teacherId: number };
  PChat: {
    name: string;
    teacherId: number;
    userid: string;
  };
};

interface Teacher {
  teacherName: string;
  avatar?: string;
  teacherClass: number;
  teacherId: number;
  unreadCount?: number; // Add unreadCount to the Teacher interface
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "ParentChatScreen">;
};

const ParentChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userid, childclass, teacherId } = route.params;
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch unread message count for a specific teacher
  const fetchUnreadCount = async (teacherId: number) => {
    try {
      const response = await axios.get(
        `http://192.168.1.64:5000/api/unreadcount/${teacherId}/${userid}`
      );
      return response.data.unread_count || 0;
    } catch (err) {
      console.error("Error fetching unread count:", err);
      return 0;
    }
  };

  // Fetch all teachers for the child's class
  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://192.168.1.64:5000/api/teachers?class=${childclass}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch teachers");
      }

      const data = response.data;

      // Fetch unread counts for each teacher
      const teacherList: Teacher[] = await Promise.all(
        data.map(async (item: any) => {
          const unreadCount = await fetchUnreadCount(item.teacherId);
          return {
            teacherName: item.teacherName,
            avatar: item.avatar || null,
            teacherClass: item.teacherClass,
            teacherId: item.teacherId,
            unreadCount, // Add unreadCount to the teacher object
          };
        })
      );

      setTeachers(teacherList);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  // Mark messages as read when a parent opens a chat with a teacher
  const markMessagesAsRead = async (teacherId: number) => {
    try {
      await axios.put(
        `http://192.168.1.64:5000/api/markasread/${teacherId}/${userid}`
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

    // Reload data when the screen comes into focus
    useFocusEffect(
      useCallback(() => {
        fetchTeachers(); // Fetch teachers when the screen is focused
      }, [childclass]) // Add dependencies if needed
    );
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text>Loading Teachers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
        <TouchableOpacity onPress={fetchTeachers}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Chat</Text>
      </View>
      <ScrollView>
        {teachers.map((teacher) => (
          <TouchableOpacity
            key={teacher.teacherId}
            onPress={() => {
              markMessagesAsRead(teacher.teacherId); // Mark messages as read
              navigation.navigate("PChat", {
                name: teacher.teacherName,
                teacherId: teacher.teacherId,
                userid: userid,
              });
            }}
          >
            <View style={styles.textContainer}>
              <Image
                source={
                  teacher.avatar ? { uri: teacher.avatar } : DefaultAvatar
                }
                style={styles.avatar}
              />
              <Text style={styles.studentName}>
                {`${teacher.teacherName} --- class ${childclass}`}
              </Text>
              {(teacher.unreadCount || 0) > 0 && (
                <View style={styles.unreadCountContainer}>
                  <Text style={styles.unreadCountText}>
                    {teacher.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
  },
  textContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
  },
  studentName: {
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
    marginLeft: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 25,
  },
  retryText: {
    marginTop: 10,
    color: "blue",
    textDecorationLine: "underline",
  },
  unreadCountContainer: {
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 10,
  },
  unreadCountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
});

export default ParentChatScreen;
