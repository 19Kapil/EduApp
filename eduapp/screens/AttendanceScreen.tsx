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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import DefaultAvatar from "../assets/images/student.jpeg";

interface Student {
  id: string;
  name: string;
  avatar?: string;
  registration_number: number;
}


type Props = {
  navigation: any;
  route: any;
};

const AttendanceScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass } = route.params;
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attendance, setAttendance] = useState<{ [key: number]: string }>({});
  const [isUploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          `http://192.168.1.64:5000/api/students?class=${teacherClass}`
        );
        const studentsList: Student[] = response.data.map((item: any) => ({
          id: item.student_id,
          name: item.name,
          avatar: item.avatar || null,
          registration_number: item.registration_number,
        }));
        setStudents(studentsList);
      } catch (err) {
        setError("Failed to fetch students");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [teacherClass]);

  const handleAttendanceSelect = (registration_number: number, status: string) => {
    setAttendance((prev) => ({ ...prev, [registration_number]: status }));
  };

  const handleUpdateAttendance = async () => {
    const allStudentsMarked = students.every(
      (student) => attendance[student.registration_number]
    );

    if (!allStudentsMarked) {
      Alert.alert("Error", "Please mark attendance for all students.");
      return;
    }

    Alert.alert("Confirm Update", "Are you sure you want to update attendance?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Update",
        onPress: async () => {
          try {
            setUploading(true);
            const attendance_date = new Date().toISOString().split("T")[0];
            const response = await axios.post(
              "http://192.168.1.64:5000/api/attendance",
              { teacherClass, attendance, attendance_date }
            );
            if (response.status === 200) {
              Alert.alert("Success", "Attendance updated successfully!");
              setAttendance({});
            } else {
              throw new Error("Failed to update attendance");
            }
          } catch {
            Alert.alert("Error", "Failed to update attendance. Please try again.");
          } finally {
            setUploading(false);
          }
        },
      },
    ]);
  };

  if (loading) return <ActivityIndicator size="large" color="#000" />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Attendance - Class {teacherClass}</Text>
      </View>

      <ScrollView>
        {students.map((student) => (
          <View key={student.id} style={styles.studentContainer}>
            <View style={styles.studentInfo}>
              <Image
                source={student.avatar ? { uri: student.avatar } : DefaultAvatar}
                style={styles.avatar}
              />
              <Text style={styles.studentName}>{student.name}</Text>
            </View>
            <View style={styles.radioContainer}>
              {["P", "L", "A"].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.radioButton,
                    attendance[student.registration_number] === status &&
                      styles[`selectedRadio${status}`],
                  ]}
                  onPress={() => handleAttendanceSelect(student.registration_number, status)}
                >
                  <Text style={styles.radioText}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity
        style={styles.updateButton}
        onPress={handleUpdateAttendance}
        disabled={isUploading}
      >
        <Text style={styles.updateButtonText}>
          {isUploading ? "Updating..." : "Update Attendance"}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, marginTop: 30, marginBottom: 30 },
  header: { flexDirection: "row", alignItems: "center" },
  headerText: { fontSize: 18, fontWeight: "bold" },
  studentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginVertical: 5,
  },
  studentInfo: { flexDirection: "row", alignItems: "center", flex: 2 },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  studentName: { fontSize: 16, fontWeight: "bold", marginLeft: 10 },
  radioContainer: { flexDirection: "row", justifyContent: "space-between", flex: 1 },
  radioButton: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: "#ccc", justifyContent: "center", alignItems: "center", marginHorizontal: 5 },
  selectedRadioP: { backgroundColor: "lightgreen", borderColor: "lightgreen" },
  selectedRadioL: { backgroundColor: "yellow", borderColor: "yellow" },
  selectedRadioA: { backgroundColor: "red", borderColor: "red" },
  radioText: { fontSize: 12, fontWeight: "bold" },
  updateButton: { backgroundColor: "black", padding: 12, borderRadius: 10, alignItems: "center", marginTop: 10 },
  updateButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default AttendanceScreen;
