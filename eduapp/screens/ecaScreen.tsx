import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NavigationProp } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { EcaData } from "../data/ecaData";
import { RootStackParamList } from "../types";

// Define Props type before using it in the component
type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const EcaScreen: React.FC<Props> = ({ navigation }) => {
  const [expandedActivity, setExpandedActivity] = useState<string | null>(null);

  const toggleActivity = (activity: string) => {
    if (expandedActivity === activity) {
      setExpandedActivity(null);
    } else {
      setExpandedActivity(activity);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={30} color="black" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Extra-Curricular Activities</Text>
        </View>
        {Object.keys(EcaData).map((activity, index) => (
          <View key={index}>
            <TouchableOpacity
              style={styles.activityHeader}
              onPress={() => toggleActivity(activity)}
            >
              <Text style={styles.activityHeaderText}>{activity}</Text>
              <Ionicons
                name={
                  expandedActivity === activity ? "chevron-up" : "chevron-down"
                }
                size={24}
                color={Colors.primary}
              />
            </TouchableOpacity>
            {expandedActivity === activity && (
              <View style={styles.activityDetails}>
                <View style={styles.row}>
                  <Text style={styles.label}>Description:</Text>
                  <Text style={styles.value}>
                    {EcaData[activity].description}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Instructor:</Text>
                  <Text style={styles.value}>
                    {EcaData[activity].instructor}
                  </Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Time:</Text>
                  <Text style={styles.value}>{EcaData[activity].time}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Duration:</Text>
                  <Text style={styles.value}>{EcaData[activity].duration}</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.label}>Key Points:</Text>
                  <Text style={styles.value}>
                    {EcaData[activity].keyPoints}
                  </Text>
                </View>
              </View>
            )}
          </View>
        ))}
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
  boldText: {
    fontFamily: Font["poppins-bold"],
    fontWeight: "bold",
    color: Colors.primary,
  },
  activityHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityHeaderText: {
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },

  activityDetailText: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  activityDetails: {
    backgroundColor: Colors.gray,
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 5,
  },
  label: {
    flex: 1,
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
  value: {
    flex: 2,
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    color: Colors.primary,
  },
});

export default EcaScreen;
