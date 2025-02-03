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
import { courseData } from "../data/yearlydata";

const screenHeight = Dimensions.get("window").height;
const headerHeightPercentage = 10; // Adjust this percentage as needed
const headerHeight = (screenHeight * headerHeightPercentage) / 100;

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const YearlyPlanScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const handleSubjectSelection = (itemValue: string) => {
    setSelectedSubject(itemValue);
  };
  const yearlyPlanData = selectedSubject
    ? courseData[selectedSubject]?.yearlyPlan
    : [];

  const renderItem = ({ item }: { item: { month: string; task: string } }) => (
    <View style={styles.tableRow}>
      <Text style={styles.tableCell}>{item.month}</Text>
      <Text style={styles.tableCell}>{item.task}</Text>
    </View>
  );
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
        <Text style={styles.headerTitle}>Course Plan</Text>
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
          <View style={styles.monthlyPlanContainer}>
            <Text style={styles.subtitle}>
              Yearly Plan for {selectedSubject}
            </Text>
            <View style={styles.tableContainer}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                  Month
                </Text>
                <Text style={[styles.tableCell, styles.tableHeaderCell]}>
                  Task
                </Text>
              </View>
              <FlatList
                data={yearlyPlanData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
              />
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  progressBarBackground: {
    height: 10,
    backgroundColor: Colors.gray,
    borderRadius: 5,
    flex: 1,
  },
  progressBar: {
    height: 10,
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
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
  monthlyPlanContainer: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-bold"],
    marginBottom: 10,
    color: Colors.primary,
  },
  monthlyPlanText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    textAlign: "justify",
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  // progressBar: {
  //   height: 10,
  //   backgroundColor: Colors.primary,
  //   borderRadius: 5,
  //   flex: 1,
  // },
  progressText: {
    marginLeft: 10,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  tableContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: Colors.lightPrimary,
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightPrimary,
  },
  tableCell: {
    flex: 1,
    padding: 10,
    color: Colors.darkText,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  tableHeaderCell: {
    fontWeight: "bold",
    backgroundColor: Colors.primary,
    color: "white",
  },
});

export default YearlyPlanScreen;
