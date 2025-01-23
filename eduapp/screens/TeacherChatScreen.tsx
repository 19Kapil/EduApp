import React, { useState, useEffect } from "react";
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
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import DefaultAvatar from "../assets/images/student.jpeg";
import axios from "axios";

// Define RootStackParamList with the correct screen names and parameters
type RootStackParamList = {
  TeacherChatScreen: { teacherClass: number; teacherId: number };
  TChat: { name: string; registration_number: number, teacherId: number, userid: string };
};

interface Student {
  id: string;
  name: string;
  avatar?: string;
  registration_number: number;
  userid: string;
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

      const studentsList: Student[] = data.map((item: any) => ({
        id: item.student_id,
        name: item.name,
        avatar: item.avatar || null,
        registration_number: item.registration_number,
        userid: item.userid,
      }));

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

  useEffect(() => {
    fetchStudents();
  }, [teacherClass]);

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
            onPress={() =>
              navigation.navigate("TChat", {
                name: student.name,
                registration_number: student.registration_number,
                teacherId: teacherId,
                userid: student.userid || "",

              })
            }
          >
            <View style={styles.textContainer}>
              <Image
                source={
                  student.avatar ? { uri: student.avatar } : DefaultAvatar
                }
                style={styles.avatar}
              />
              <Text style={styles.studentName}>{student.name}'s Parents</Text>
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
});

export default TeacherChatScreen;
