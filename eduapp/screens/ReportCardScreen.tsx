import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, SafeAreaView, TouchableOpacity, ActivityIndicator } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";

type RootStackParamList = {

  ReportCardScreen: {
    studentName: string;
    studentRollNo: number;
    teacherClass: string;
  };
};

const ReportCardScreen: React.FC<{ route: RouteProp<RootStackParamList, "ReportCardScreen"> }> = ({ route }) => {
  const { studentRollNo, studentName, teacherClass } = route.params;
  const navigation = useNavigation();
  const [reportCardUrl, setReportCardUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch the report card data from the database
    const fetchReportCard = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.64:5000/api/report?class=${teacherClass}&roll_number=${studentRollNo}` 
        
        );
        if (!response.ok) {
          throw new Error("Failed to fetch report card");
        }
        const data = await response.json();
  
        if (data && data.report) {
          // If report exists, set the Base64-encoded string as the URL
          setReportCardUrl(`data:image/png;base64,${data.report}`);
        } else {
          console.error("Report card not found.");
        }
      } catch (error) {
        console.error("Error fetching report card:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchReportCard();
  }, [teacherClass, studentRollNo]);
  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>{studentName}'s Report Card</Text>
      </View>

      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : reportCardUrl ? (
          <Image source={{ uri: reportCardUrl }} style={styles.image} />
        ) : (
          <Text style={styles.errorText}>Report card not available.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 50,
  },
  header: {
      flexDirection: "row",
      alignItems: "center",
    },
  headerText: {
      fontSize: FontSize.large,
      fontFamily: Font["poppins-bold"],
      marginLeft: 10,
    },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-regular"],
  },
});

export default ReportCardScreen;
