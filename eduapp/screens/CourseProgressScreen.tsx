import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  ScrollView,
} from "react-native";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { Picker } from "@react-native-picker/picker";
import FontSize from "../constants/FontSize";
import { Ionicons } from "@expo/vector-icons";
import { courseData, CourseData } from "../data/yearlydata";

const screenHeight = Dimensions.get("window").height;
const headerHeightPercentage = 10;
const headerHeight = (screenHeight * headerHeightPercentage) / 100;

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const YearlyPlanScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const handleSubjectSelection = (itemValue: string) => {
    setSelectedSubject(itemValue);
  };

  const subjects: string[] = [
    "Choose a Subject",
    "Math",
    "Science",
    "English",
    "History",
    "Art",
    "Physics",
    "Biology",
    "Chemistry",
  ];

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
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedSubject}
            onValueChange={(itemValue) => handleSubjectSelection(itemValue)}
            style={styles.picker}
          >
            {subjects.map((subject, index) => (
              <Picker.Item label={subject} value={subject} key={index} />
            ))}
          </Picker>
        </View>
        {selectedSubject && (
          <View style={styles.courseListContainer}>
            <Text style={styles.subtitle}>Courses for {selectedSubject}</Text>
            {courseData[selectedSubject]?.yearlyPlan.map((item, index) => (
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
});

export default YearlyPlanScreen;
