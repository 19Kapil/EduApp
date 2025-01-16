import React, { useState, useEffect } from "react";
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput, Button, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import axios from "axios";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";


type Activity = {
  ActivityID: number;
  Activity: string;
  Status: string;
  first_place: string;
  second_place: string;
  third_place: string;
};

type Props = {
  navigation: any;
  route: any;
};

const CCAScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass } = route.params; 
  const { childclass } = route.params;
  const classToFetch = teacherClass || childclass;
  const [activities, setActivities] = useState<Activity[]>([]);
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async (): Promise<void> => {
    try {
      const response = await axios.get<Activity[]>(
        `http://192.168.1.64:5000/api/activities/${classToFetch}`
      );
      const updatedActivities = response.data.map((activity) => ({
        ...activity,
        Status: activity.Status || "Incomplete",
      }));
      setActivities(updatedActivities);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      if (error) {
        Alert.alert('Error', `Failed to fetch activities. Status:`);
      } else {
        Alert.alert('Error', 'Failed to fetch activities. Please check your connection or server.');
      }
    }
  };

  const toggleActivity = (activity: string) => {
    setExpandedActivity(expandedActivity === activity ? null : activity);
  };

  const startEditing = (activity: Activity) => {
    setEditingActivity({
      ActivityID: activity.ActivityID,
      Activity: activity.Activity || "",
      Status: activity.Status || "Incomplete",
      first_place: activity.first_place || "",
      second_place: activity.second_place || "",
      third_place: activity.third_place || "",
    });
  };

  const updateActivity = async (updatedActivity: Activity) => {
    try {
      if (!updatedActivity.Status) {
        Alert.alert("Error", "Please select a status for the activity.");
        return;
      }
      const response = await axios.put(
        `http://192.168.1.64:5000/api/activities/${updatedActivity.ActivityID}`,
        {
          Status: updatedActivity.Status,
          first_place: updatedActivity.first_place || "",
          second_place: updatedActivity.second_place || "",
          third_place: updatedActivity.third_place || "",
        }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Activity updated successfully!");
        fetchActivities(); // Refetch activities to update the UI
        setEditingActivity(null); // Stop editing
      }
    } catch (error) {
      Alert.alert(`Error`, `Failed to update activity.`);
      console.error(error);
    }
  };

  const renderCompletedButton = (activity: Activity) => (
    <View
      style={[
        styles.button,
        { backgroundColor: activity.Status === "Completed" ? Colors.lightgreen : Colors.red },
      ]}
    >
      <Text style={styles.buttonText}>{activity.Status}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Co-Curricular Activities</Text>
        </View>

        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          activities.map((activity, index) => (
            <View key={index} style={styles.activityContainer}>
              <TouchableOpacity
                style={styles.activityHeader}
                onPress={() => toggleActivity(activity.Activity)}
              >
                <Text style={styles.activityHeaderText}>{activity.Activity}</Text>
                {renderCompletedButton(activity)}
              </TouchableOpacity>

              {expandedActivity === activity.Activity && (
                <View style={styles.activityDetails}>
                  <Text style={styles.activityDetailText}>
                    <Text style={styles.boldText}>First Place:</Text> {activity.first_place || "N/A"}
                  </Text>
                  <Text style={styles.activityDetailText}>
                    <Text style={styles.boldText}>Second Place:</Text> {activity.second_place || "N/A"}
                  </Text>
                  <Text style={styles.activityDetailText}>
                    <Text style={styles.boldText}>Third Place:</Text> {activity.third_place || "N/A"}
                  </Text>

                  {/* Show editable fields only if teacher */}
                  {teacherClass && editingActivity?.ActivityID === activity.ActivityID && (
                    <View style={styles.editFields}>
                      <Picker
                        selectedValue={editingActivity?.Status || "Incomplete"} 
                        onValueChange={(itemValue) => setEditingActivity(prevState => prevState ? { ...prevState, Status: itemValue } : null)}
                      >
                        <Picker.Item label="Completed" value="Completed" />
                        <Picker.Item label="Incomplete" value="Incomplete" />
                      </Picker>

                      <TextInput
                        style={styles.input}
                        placeholder="First Place"
                        value={editingActivity.first_place}
                        onChangeText={(text) => setEditingActivity({ ...editingActivity, first_place: text })}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Second Place"
                        value={editingActivity.second_place}
                        onChangeText={(text) => setEditingActivity({ ...editingActivity, second_place: text })}
                      />
                      <TextInput
                        style={styles.input}
                        placeholder="Third Place"
                        value={editingActivity.third_place}
                        onChangeText={(text) => setEditingActivity({ ...editingActivity, third_place: text })}
                      />
                      <Button title="Update" onPress={() => updateActivity(editingActivity)} />
                    </View>
                  )}

                  {/* Show edit button only if teacher */}
                  {teacherClass && (
                    <TouchableOpacity onPress={() => startEditing(activity)} style={styles.editButton}>
                      <Text style={styles.editButtonText}>Edit</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          ))
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
    paddingTop: 40,
  },
  boldText: {
    fontFamily: Font["poppins-bold"],
    fontWeight: "bold",
    color: Colors.primary,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    marginLeft: 10,
  },
  activityContainer: {
    marginBottom: 15,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  activityHeaderText: {
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  activityDetails: {
    backgroundColor: Colors.gray,
    padding: 10,
    borderRadius: 6,
    marginTop: 5,
  },
  activityDetailText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  button: {
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginBottom: 10,
    borderRadius: 5,
  },
  editButton: {
    marginTop: 10,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  editButtonText: {
    color: Colors.white,
    fontFamily: Font["poppins-bold"],
  },
  editFields: {
    marginTop: 20,
  },
});

export default CCAScreen;
