import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import DefaultAvatar from "../assets/images/student.jpeg";
import { useFocusEffect } from "@react-navigation/native";

type RootStackParamList = {
  StudentsIndiScreen: {
    name: string;
    avatar: string;
    details: {
      address: string;
      age: number;
      class: string;
      rollNo: number;
      section: string;
      fatherName: string;
      motherName: string;
      registration_number: number;
    };
  };
  ReportCardScreen: {
    studentName: string;
    studentrollNo: number;
  };
};

type StudentsIndiScreenRouteProp = RouteProp<
  RootStackParamList,
  "StudentsIndiScreen"
>;

interface StudentsIndiScreenProps {
  route: StudentsIndiScreenRouteProp;
  navigation: any;
}

type DetailItemProps = {
  label: string;
  value: string | number;
};

const StudentsIndiScreen: React.FC<StudentsIndiScreenProps> = ({
  route,
  navigation,
}) => {
  const { name, avatar, details } = route.params;
  const [isModalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      setModalVisible(false);
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerText}>{name}'s Profile</Text>
        </View>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          
        >
          <Ionicons name="ellipsis-horizontal" size={30} color="black" />
        </TouchableOpacity>
      </View>

      <View style={styles.head}>
        <Image
          source={avatar ? { uri: avatar } : DefaultAvatar}
          style={styles.avatar}
        />
        <Text style={styles.studentName}>{name}</Text>
      </View>
      <TouchableOpacity
        style={styles.reportIcon}
        onPress={() =>
          navigation.navigate("ReportCardScreen", {
            studentName: name,
            studentRollNo: details.rollNo,
            teacherClass: details.class,
          })
        }
      >
        <Ionicons name="document" color={"black"} size={20} />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <ScrollView style={styles.detailsScroll}>
          <View style={styles.detailsContainer}>
            <DetailItem
              label="Registration No."
              value={details.registration_number}
            />
            <DetailItem label="Age" value={details.age} />
            <DetailItem label="Class" value={details.class} />
            <DetailItem label="Roll No." value={details.rollNo} />
            <DetailItem label="Section" value={details.section} />
            <DetailItem label="Father's Name" value={details.fatherName} />
            <DetailItem label="Mother's Name" value={details.motherName} />
            <DetailItem label="Address" value={details.address} />
          </View>
        </ScrollView>
        <Modal transparent={true} visible={isModalVisible} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() =>
                  navigation.navigate("AttendanceReportScreen", {
                    registration_number: details.registration_number,
                    name: name,
                  })
                }
              >
                <Text>View Attendance</Text>
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
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const DetailItem: React.FC<DetailItemProps> = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  
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
  titleContainer: {
    flex: 1, 
    alignItems: "center",
  },
  
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
    position: "relative",
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
  },

  head: {
    alignItems: "center",
    marginTop: 20,
  },

  profileContainer: {},
  studentName: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: "bold",
  },
  detailsScroll: {
    height: "60%",
    marginTop: 20,
  },
  detailsContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  detailItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    color: Colors.darkText,
  },
  detailValue: {
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-bold"],
    color: Colors.text,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 25,
  },
  reportIcon: {
    alignItems: "center",
  },
});

export default StudentsIndiScreen;
