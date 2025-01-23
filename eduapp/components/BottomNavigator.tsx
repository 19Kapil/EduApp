import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types"; // Make sure this is imported from the correct location

// Define the BottomNavigator Props with navigation type
type BottomNavigatorProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  teacherClass: number;
  teacherId: number;
};

const BottomNavigator: React.FC<BottomNavigatorProps> = ({ navigation, teacherClass,teacherId}) => {
  const iconColor = "#000000";

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => navigation.navigate("TeacherHomeScreen")}>
          <Ionicons name="home" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("TeacherChatScreen", { teacherClass,teacherId} )}>
          <Ionicons name="chatbubbles" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ClassRoutineScreen", { teacherClass })}>
          <Ionicons name="calendar" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("StudentListScreen", { teacherClass }) // Pass teacherClass correctly as part of params
          }
        >
          <Ionicons name="people-outline" size={35} color={iconColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    paddingBottom: 10,
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50, // Adjusted height for better appearance
  },
});

export default BottomNavigator;
