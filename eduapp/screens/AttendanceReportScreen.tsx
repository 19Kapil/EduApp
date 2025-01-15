import React, { useState, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from "react-native";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";

type RootStackParamList = {
  AttendanceReportScreen: {
    registration_number: number;
    name: string;
  };
};

const AttendanceReportScreen: React.FC<{ route: RouteProp<RootStackParamList, "AttendanceReportScreen"> }> = ({ route }) => {
  const { registration_number, name } = route.params;
  const navigation = useNavigation();
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAttendanceData = useCallback(async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`http://192.168.1.64:5000/api/attendance/${registration_number}`);
      setAttendanceData(response.data.length ? response.data : []);  // Handle no data
    } catch (error) {
      console.error("Error fetching attendance data:", error);
    } finally {
      setLoading(false);
    }
  }, [registration_number]);

  useEffect(() => {
    fetchAttendanceData();
  }, [fetchAttendanceData]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}/${month}/${day}`;
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={45} color="black" />
              </TouchableOpacity>
              <Text style={styles.headerText}>{name}'s Attendance Sheet</Text>
            </View>

      {attendanceData.length === 0 ? (
        <Text style={styles.noDataText}>No attendance data available.</Text>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Date</Text>
            <Text style={styles.tableHeader}>Status</Text>
          </View>
          {attendanceData.map((record, index) => (
            <View style={styles.tableRow} key={index}>
              <Text style={styles.tableCell}>{formatDate(record.attendance_date)}</Text>
              <Text
                style={[
                  styles.tableCell,
                  {
                    color:
                      record.status === "P" ? "green"  :
                      record.status === "A" ? "red" : "darkorange",
                  },
                ]}
              >
                {record.status === "P" ? "Present" :
                record.status === "A" ? "Absent" : "Late"}
              </Text>

            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 30,
    
  },
  backButton: {
    marginTop: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerText: {
        fontSize: 16,
        fontFamily: Font["poppins-bold"],
        marginLeft: 10,
      },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    alignItems: "center",
  },
  tableHeader: {
    flex: 1,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
  tableCell: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#444",
  },
  noDataText: {
    textAlign: "center",
    fontSize: 18,
    color: "gray",
    marginTop: 20,
  },
});

export default AttendanceReportScreen;
