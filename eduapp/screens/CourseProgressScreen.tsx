import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import Colors from "../constants/Colors";
import FontSize from "../constants/FontSize";
import Font from "../constants/Font";

type Props = {
  navigation: any;
  route: any;
};

interface Subject {
  id: string;
  subject_name: string;
}

interface Chapter {
  id: number;
  chapter_name: string;
  status: string;
}

const CourseProgressScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass } = route.params;
  const { childclass } = route.params;
  const classToFetch = teacherClass || childclass;
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState<boolean>(false);
  const [loadingChapters, setLoadingChapters] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  // Fetch subjects based on class
  useEffect(() => {
    if (!classToFetch) {
      setError("Class not found.");
      return;
    }

    const fetchSubjects = async () => {
      setLoadingSubjects(true);
      try {
        const response = await fetch(
          `http://192.168.1.64:5000/api/subjects/${classToFetch}`
        );
        const data: Subject[] = await response.json();
        setSubjects(data);
      } catch (error) {
        console.error("Error fetching subjects:", error);
        setError("Error fetching subjects. Please try again later.");
      }
      setLoadingSubjects(false);
    };

    fetchSubjects();
  }, [classToFetch]);

  // Fetch chapters when a subject is selected
  useEffect(() => {
    if (!selectedSubject) return;

    const fetchChapters = async () => {
      setLoadingChapters(true);
      try {
        const response = await fetch(
          `http://192.168.1.64:5000/api/chapters/${selectedSubject}`
        );
        const data: Chapter[] = await response.json();
        setChapters(data);
      } catch (error) {
        console.error("Error fetching chapters:", error);
        setError("Error fetching chapters.");
      }
      setLoadingChapters(false);
    };

    fetchChapters();
  }, [selectedSubject]);

  const updateChapterStatus = async (chapterId: number, newStatus: string) => {
    if (!teacherClass) {
      alert("Only teachers can update chapter status.");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.1.64:5000/api/chapters/${chapterId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus, teacherClass }), // Only allow if teacherClass exists
        }
      );
      const result = await response.json();

      if (response.ok) {
        setChapters((prevChapters) =>
          prevChapters.map((chapter) =>
            chapter.id === chapterId
              ? { ...chapter, status: newStatus }
              : chapter
          )
        );
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error updating chapter status:", error);
      alert("Failed to update chapter status.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Course Progress</Text>
      </View>

      <ScrollView>
        {/* Subject Picker */}
        <Text style={styles.title}>Choose a Subject</Text>

        {loadingSubjects ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedSubject}
              onValueChange={(itemValue) => setSelectedSubject(itemValue)}
              style={styles.picker}
            >
             {!selectedSubject && <Picker.Item label="Select a subject" value="placeholder"  enabled={true}/>}
              {subjects.length === 0 ? (
                <Picker.Item label="No subjects available" value="" />
              ) : (
                subjects.map((subject) => (
                  <Picker.Item
                    label={subject.subject_name}
                    value={subject.id}
                    key={subject.id}
                  />
                ))
              )}
            </Picker>
          </View>
        )}

        {/* Display Chapters */}
        {selectedSubject && (
          <>
            <Text style={styles.title}>
              {subjects.find(subject => subject.id === selectedSubject)
                ?.subject_name === "नेपाली"
                ? "पाठहरु"
                : "Chapters"}
            </Text>

            {loadingChapters ? (
              <ActivityIndicator size="large" color={Colors.primary} />
            ) : error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : chapters.length === 0 ? (
              <Text style={styles.notAvailable}>Not available at this momment !!!</Text>
            ) : (
              chapters.map((chapter) => (
                <View key={chapter.id} style={styles.chapterItem}>
                  <Text style={styles.chapterName}>{chapter.chapter_name}</Text>
                  {teacherClass ? (
                    <TouchableOpacity
                      onPress={() =>
                        updateChapterStatus(
                          chapter.id,
                          chapter.status === "Complete" ? "Pending" : "Complete"
                        )
                      }
                    >
                      <Ionicons
                        name={
                          chapter.status === "Complete"
                            ? "checkmark-done"
                            : "hourglass"
                        }
                        size={24}
                        color={
                          chapter.status === "Complete" ? "green" : "orange"
                        }
                      />
                    </TouchableOpacity>
                  ) : (
                    <Ionicons
                      name={
                        chapter.status === "Complete"
                          ? "checkmark-done"
                          : "hourglass"
                      }
                      size={24}
                      color={chapter.status === "Complete" ? "green" : "orange"}
                    />
                  )}

                </View>
              ))
            )}
          </>
          
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles
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
  chapterItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightPrimary,
    paddingVertical: 10,
  },
  chapterName: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.darkText,
  },
  errorText: {
    color: "red",
    fontSize: FontSize.medium,
    textAlign: "center",
  },
  notAvailable: {
    textAlign: "center",
    fontSize: FontSize.medium,
    color: "red",
    fontFamily: Font["poppins-regular"],
    marginTop: 5,
  },
  
});

export default CourseProgressScreen;
