import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, Modal } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import DefaultAvatar from "../assets/images/student.jpeg";
import { useFocusEffect } from "@react-navigation/native";

// Define route params types
type RootStackParamList = {
  ChildProfileScreen: {
    userid: string; 
    childclass: string;
    name: string;
    avatar: string; 
    details: {
      address: string;
      age: number;
      hobbies: string;
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

type ChildProfileScreenRouteProp = RouteProp<RootStackParamList, "ChildProfileScreen">;

interface ChildProfileScreenProps {
  route: ChildProfileScreenRouteProp;
  navigation: any;
}

type DetailItemProps = {
  label: string;
  value: string | number;
};

const ChildProfileScreen: React.FC<ChildProfileScreenProps> = ({ route, navigation }) => {
  const { name, avatar, userid } = route.params || {};
  const [isModalVisible, setModalVisible] = useState(false);
  const [childDetails, setChildDetails] = useState<any | null>(null);
  

   useFocusEffect(
      React.useCallback(() => {
        setModalVisible(false);
      }, [])
    );


  if (!userid) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Error: Missing data</Text>
      </SafeAreaView>
    );
  }

  

  useEffect(() => {
    const fetchChildDetails = async () => {
      try {
        const userResponse = await fetch(`http://192.168.1.64:5000/api/users?userid=${userid}`);
        if (!userResponse.ok) throw new Error("Failed to fetch user data");
        const userData = await userResponse.json();

        if (userData.childregno && userData.childclass) {
          const childResponse = await fetch(
            `http://192.168.1.64:5000/api/class?class=${userData.childclass}&registration_number=${userData.childregno}`
          );
          if (!childResponse.ok) throw new Error("Failed to fetch child details");
          const childData = await childResponse.json();
          setChildDetails(childData);
        } else {
          throw new Error("Invalid child data");
        }
      } catch (error) {
        console.error("Error fetching child details:");
        setChildDetails(null);
      }
    };

    fetchChildDetails();
  }, [userid]);

  if (!childDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{childDetails.name}'s Profile</Text>
        <TouchableOpacity
                          onPress={() => setModalVisible(true)}
                          style={styles.dotsButton}
                        >
                          <Ionicons name="ellipsis-horizontal" size={30} color="black" />
                        </TouchableOpacity>
        
      </View>

      <View style={styles.head}>
        <Image source={avatar ? { uri: avatar } : DefaultAvatar} style={styles.avatar} />
        <Text style={styles.studentName}>{childDetails.name}</Text>
      </View>

      <TouchableOpacity
        style={styles.reportIcon}
        onPress={() => navigation.navigate("ReportCardScreen", { studentName: childDetails.name, studentRollNo: childDetails.roll_number, teacherClass: childDetails.class })}
      >
        <Ionicons name="document" color={"black"} size={20} />
      </TouchableOpacity>

      <View style={styles.profileContainer}>
        <ScrollView style={styles.detailsScroll}>
          <View style={styles.detailsContainer}>
          <DetailItem label="Registration No." value={childDetails.registration_number} />
            <DetailItem label="Age" value={ childDetails.age} />
            <DetailItem label="Class" value={childDetails.class} />
            <DetailItem label="Roll No." value={childDetails.roll_number} />
            <DetailItem label="Section" value={childDetails.section} />
            <DetailItem label="Father's Name" value={childDetails.father_name} />
            <DetailItem label="Mother's Name" value={childDetails.mother_name} />
            <DetailItem label="Address" value={childDetails.address} />

          </View>
        </ScrollView>
        <Modal transparent={true} visible={isModalVisible} animationType="fade">
                        <View style={styles.modalOverlay}>
                          <View style={styles.modalContainer}>
                            <TouchableOpacity
                              style={styles.modalOption}
                              onPress={() => navigation.navigate("AttendanceReportScreen", {  registration_number: childDetails.registration_number, name: childDetails.name })}
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
    <Text style={styles.detailValue}>{value || "Not Available"}</Text>
  </View>
);

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
    marginLeft: 10,
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
  dotsButton: {
    marginLeft: 10,
    
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

export default ChildProfileScreen;
