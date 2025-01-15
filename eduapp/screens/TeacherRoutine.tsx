import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import FontSize from "../constants/FontSize";
import Font from "../constants/Font";
import { RootStackParamList } from "../types";
import { NavigationContainer } from "@react-navigation/native";
import { ScrollView } from "react-native";
type Props = NativeStackScreenProps<RootStackParamList, "TeacherRoutineScreen">;

const TeacherRoutineScreen: React.FC<Props> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState("General");

  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  const subjectsData = [
    { name: "Computer", time: "9:00 AM - 10:00 AM", days: "Mon, Wed, Fri" },
    { name: "Maths", time: "10:30 AM - 11:30 AM", days: "Tue, Thu" },
    { name: "Science", time: "12:00 PM - 1:00 PM", days: "Mon, Thu" },
    { name: "Social", time: "1:30 PM - 2:30 PM", days: "Tue, Fri" },
    { name: "English", time: "3:00 PM - 4:00 PM", days: "Wed, Fri" },
    { name: "Nepali", time: "4:30 PM - 5:30 PM", days: "Mon, Wed" },
  ];
  const ecaData = [
    { name: "Music", teacher: "" },
    { name: "Coding", teacher: "" },
    { name: "Robotics", teacher: "" },
    { name: "Table Tennis", teacher: "" },
    { name: "Football", teacher: "" },
    { name: "Badminton", teacher: "" },
    { name: "Basketball", teacher: "" },
  ];
  const renderSubjects = () => {
    return subjectsData.map((subject, index) => (
      <View key={index} style={styles.subjectBox}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.subjectTime}>{subject.time}</Text>
      </View>
    ));
  };
  const renderECA = () => {
    return ecaData.map((eca, index) => (
      <View key={index} style={styles.ecaBox}>
        <Text style={styles.ecaName}>{eca.name}</Text>
        <Text style={styles.ecaTeacher}>{eca.teacher}</Text>
      </View>
    ));
  };
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
          Routine
        </Text>
        <TouchableOpacity style={styles.editIconContainer}>
          <Ionicons name="pencil" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "General" && styles.activeTab]}
          onPress={() => handleTabClick("General")}
        >
          <Text style={activeTab === "General" && styles.activeText}>
            General
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "ECA" && styles.activeTab]}
          onPress={() => handleTabClick("ECA")}
        >
          <Text style={activeTab === "ECA" && styles.activeText}>ECA</Text>
        </TouchableOpacity>
      </View>

      {activeTab === "General" && (
        <View style={styles.subjectsContainer}>{renderSubjects()}</View>
      )}
      {activeTab === "ECA" && (
        <View style={styles.ECAcontainer}>{renderECA()}</View>
      )}
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  editIconContainer: {
    marginLeft: "auto",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 10,
  },

  activeTab: {
    backgroundColor: Colors.primary,
  },
  tab: {
    flex: 1,
    paddingVertical: 20, // Increase the padding to make the tabs larger
    alignItems: "center",
    borderRadius: 8,
  },
  generalTab: {
    backgroundColor: Colors.primary, // Customize the color for the General tab
  },
  ecaTab: {
    backgroundColor: Colors.onPrimary, // Customize the color for the ECA tab
  },
  ecaBox: {
    backgroundColor: "#ECECEC",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    fontFamily: Font["poppins-bold"],
  },
  ecaName: {
    fontFamily: Font["poppins-bold"],
    marginBottom: 5,
    fontSize: FontSize.medium,
  },
  ecaTeacher: {
    fontStyle: "italic",
  },
  activeText: {
    textDecorationColor: "white",
    textDecorationStyle: "solid",
    color: "white",
    fontFamily: Font["poppins-bold"],
  },
  subjectsContainer: {
    marginTop: 20,
  },
  ECAcontainer: {
    marginTop: 20,
  },
  subjectBox: {
    backgroundColor: "#ECECEC", // Modify as needed
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  subjectName: {
    fontFamily: Font["poppins-bold"],
    marginBottom: 5,
    fontSize: FontSize.medium,
  },
  subjectTime: {
    marginBottom: 5,
    fontFamily: Font["poppins-semiBold"],
    fontSize: FontSize.small,
  },
  subjectDays: {
    fontStyle: "italic",
  },
});

export default TeacherRoutineScreen;
