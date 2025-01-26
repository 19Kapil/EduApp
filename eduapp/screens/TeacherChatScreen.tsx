import React, { useState, useCallback } from "react";
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
import DefaultAvatar from "../assets/images/student.jpeg";
import axios from "axios";

type RootStackParamList = {
  TeacherChatScreen: {
    teacherClass: number;
    teacherId: number;
    userid: string;
  };
  TChat: {
    name: string;
    registration_number: number;
    teacherId: number;
    userid: string;
  };
};

interface Student {
  id: string;
  name: string;
  avatar?: string;
  registration_number: number;
  userid: string;
  unreadCount?: number;
}

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "TeacherChatScreen">;
};

const TeacherChatScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass, teacherId } = route.params;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

  const fetchUnreadCount = async (userid: string) => {
    try {
      const response = await axios.get(
        `http://192.168.1.64:5000/api/unreadcount/${userid}/${teacherId}`
      );
      return response.data.unread_count || 0;
    } catch (err) {
      console.error("Error fetching unread count:", err);
      return 0;
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `http://192.168.1.64:5000/api/students?class=${teacherClass}`
      );

      if (response.status !== 200) {
        throw new Error("Failed to fetch students");
      }

      const data = response.data;

      // Fetch unread counts for each teacher
      const studentsList: Student[] = await Promise.all(
        data.map(async (item: any) => {
          const unreadCount = await fetchUnreadCount(item.userid);
          return {
            id: item.student_id,
            name: item.name,
            avatar: item.avatar || null,
            registration_number: item.registration_number,
            userid: item.userid || 0,
            unreadCount,
           
          };
        })
      );

      setStudents(studentsList);
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

  const markMessagesAsRead = async (userid: string) => {
    try {
      await axios.put(
        `http://192.168.1.64:5000/api/markasread/${userid}/${teacherId}`
      );
    } catch (err) {
      console.error("Error marking messages as read:", err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchStudents(); 
    }, [teacherClass]) 
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000000" />
        <Text>Loading Students...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
        <TouchableOpacity onPress={fetchStudents}>
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
        {students.map((student) => (
          <TouchableOpacity
            key={student.id}
            onPress={() =>{
              markMessagesAsRead(student.userid);
              navigation.navigate("TChat", {
                name: student.name,
                registration_number: student.registration_number,
                teacherId: teacherId,
                userid: student.userid || "",
              })
            }}
          >
            <View style={styles.textContainer}>
              <Image
                source={
                  student.avatar ? { uri: student.avatar } : DefaultAvatar
                }
                style={styles.avatar}
              />
              <Text style={styles.studentName}>{student.name}'s Parents</Text>
              {(student.unreadCount || 0) > 0 && (
                <View style={styles.unreadCountContainer}>
                  <Text style={styles.unreadCountText}>
                    {student.unreadCount}
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
    borderColor: "#e7e7e4",
    borderRadius: 25,
    backgroundColor: "#f3f3f1",
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

export default TeacherChatScreen;
