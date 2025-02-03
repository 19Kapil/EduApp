import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import FontSize from "../constants/FontSize";
import { courseData, CourseData } from "../data/yearlydata";
import Colors from "../constants/Colors";
import Font from "../constants/Font";

type Props = {
  navigation: any;
  route: any;
};

interface Subject {
  id: string;
  subject_name: string;
}

const CourseProgressScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass } = route.params;
  const { childclass } = route.params;
  const classToFetch = teacherClass || childclass;

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>(""); // Initialize with an empty string
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!teacherClass && !childclass) {
      setError("Class not found.");
      return;
    }

    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://192.168.1.64:5000/api/subjects/${classToFetch}`
        );
        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects: ", error);
        setError("Error fetching subjects. Please try again later.");
      }
      setLoading(false);
    };

    fetchSubjects();
  }, [classToFetch]);

  const handleSubjectSelection = (itemValue: string) => {
    setSelectedSubject(itemValue);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Progress</Text>
      </View>
      <ScrollView>
        <Text style={styles.title}>Choose a Subject</Text>

        {loading ? (
          <Text>Loading subjects...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSubject}
              onValueChange={handleSubjectSelection}
              style={styles.picker}
            >
              <Picker.Item label="Select a subject" value="" />

              {subjects.length === 0 ? (
                <Picker.Item label="No subjects available" value="" />
              ) : (
                subjects.map((subject, index) => (
                  <Picker.Item
                    label={subject.subject_name}
                    value={subject.id}
                    key={index}
                  />
                ))
              )}
            </Picker>
          </View>
        )}

        {/* Display courses for the selected subject */}
        {selectedSubject && !loading && !error && courseData[selectedSubject] && (
          <View style={styles.courseListContainer}>
            <Text style={styles.subtitle}>Courses for {selectedSubject}</Text>
            {courseData[selectedSubject]?.yearlyPlan?.map((item, index) => (
              <View key={index} style={styles.courseItem}>
                <Text style={styles.courseName}>{item.task}</Text>
                {item.completed ? (
                  <Ionicons name="checkmark-done" size={24} color="green" />
                ) : (
                  <Ionicons name="hourglass" size={24} color="orange" />
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 50,
  },
  headerTitle: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    marginLeft: 10,
  },
  title: {
    fontSize: FontSize.large,
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
    marginBottom: 10,
    marginTop: 20,
  },
  pickerContainer: {
    backgroundColor: Colors.lightPrimary,
    borderRadius: 10,
    marginBottom: 20,
  },
  picker: {
    height: 50,
    width: "100%",
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-regular"],
    color: Colors.darkText,
  },
  courseListContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-bold"],
    marginBottom: 10,
    color: Colors.primary,
  },
  courseItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightPrimary,
    paddingVertical: 10,
  },
  courseName: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.darkText,
  },
  errorText: {
    color: "red",
    fontSize: FontSize.medium,
    textAlign: "center",
  },
});

export default CourseProgressScreen;
