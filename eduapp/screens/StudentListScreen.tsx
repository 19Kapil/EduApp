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
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FontSize from "../constants/FontSize";
import Font from "../constants/Font";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import DefaultAvatar from "../assets/images/student.jpeg";
import axios from "axios";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  age: number;
  class: string;
  rollNo: number;
  section: string;
  fatherName: string;
  motherName: string;
  address: string;
  registration_number: number;
}

type RootStackParamList = {
  StudentListScreen: { teacherClass: number };
  StudentsIndiScreen: { name: string; details: Student };
  
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "StudentListScreen">;
};

const StudentListScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass } = route.params;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

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
        age: item.age,
        class: teacherClass,
        rollNo: item.roll_number,
        section: item.section,
        fatherName: item.father_name,
        motherName: item.mother_name,
        address: item.address,
        registration_number: item.registration_number,
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

  const handleNavigate = (screen: string) => {
    setModalVisible(false);
    if (screen === "Attendance") {
      navigation.navigate("AttendanceScreen", { teacherClass, registration_number: students[0].registration_number, name: students[0].name });
    }
  };

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
        <Text style={styles.headerText}>Class {teacherClass}</Text>

        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.dotsButton}
        >
          <Ionicons name="ellipsis-horizontal" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        {students.map((student) => (
          <TouchableOpacity
            key={student.id}
            onPress={() =>
              navigation.navigate("StudentsIndiScreen", {
                name: student.name,
                details: student,
              })
            }
          >
            <View style={styles.textContainer}>
              <Image
                source={student.avatar ? { uri: student.avatar } : DefaultAvatar}
                style={styles.avatar}
              />
              <Text style={styles.studentName}>{student.name}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal transparent={true} visible={isModalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              style={styles.modalOption}
              onPress={() => handleNavigate("Attendance")}
            >
              <Text>Go to Attendance</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalOption, styles.cancelOption]}
              onPress={() => setModalVisible(false)}
            >
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
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
  dotsButton: {
    marginRight: 10,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  cancelOption: {
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
});

export default StudentListScreen;