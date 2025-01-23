import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Text,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

type SidebarProps = {
  toggleSidebar: () => void;
  userRole: string;
  userid: string;
  teacherClass: string;
  childclass: number;
};

const Sidebar: React.FC<SidebarProps> = ({
  toggleSidebar,
  userRole,
  userid,
  teacherClass,
  childclass,
}) => {
  const navigation = useNavigation();
  const [academiaDropdownOpen, setAcademiaDropdownOpen] = React.useState(false);
  const [ClassRoutineOpen, setClassRoutineOpen] = React.useState(false);
  const [yearlyPlanOpen, setYearlyPlanOpen] = React.useState(false);
  const [monthlyPlanOpen, setMonthlyPlanOpen] = React.useState(false);
  const [ecaDropdownOpen, setEcaDropdownOpen] = React.useState(false);
  const [ccaDropdownOpen, setCcaDropdownOpen] = React.useState(false);
  const [addChildOpen, setAddChildOpen] = React.useState(false);

  if (Platform.OS === "android") {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }

  const toggleAcademiaDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAcademiaDropdownOpen(!academiaDropdownOpen);
  };

  const toggleClassRoutine = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setClassRoutineOpen(!ClassRoutineOpen);
  };

  const toggleYearlyPlan = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setYearlyPlanOpen(!yearlyPlanOpen);
  };

  const toggleMonthlyPlan = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setMonthlyPlanOpen(!monthlyPlanOpen);
  };

  const toggleEcaDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setEcaDropdownOpen(!ecaDropdownOpen);
  };

  const toggleCcaDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCcaDropdownOpen(!ccaDropdownOpen);
  };

  const toggleAddChild = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAddChildOpen(!addChildOpen);
  };

  const handleClassRoutinePress = () => {
    navigation.navigate("ClassRoutineScreen", { teacherClass, childclass });
  };

  const handleYearlyPlanPress = () => {
    navigation.navigate("YearlyPlanScreen");
  };

  const handleCourseProgressPress = () => {
    navigation.navigate("CourseProgressScreen");
  };

  const handleECAPress = () => {
    navigation.navigate("ecaScreen");
  };

  const handleCCAPress = () => {
    navigation.navigate("CcaScreen", { teacherClass, childclass });
  };

  const handleAddPress = () => {
    navigation.navigate("AddScreen", { userid });
  };

  const handleStudentPress = () => {
    navigation.navigate("ChildProfileScreen", { userid });
  };

  const handleAddUser = () => {
    navigation.navigate("AddUser", { teacherClass });
  };

  const handleLogout = () => {
    axios.post(
        "http://192.168.1.64:5000/api/logout",
        {},
        { withCredentials: true }
      )
      .then(() => {
        navigation.reset({ index: 0, routes: [{ name: "Login" }] });
      })
      .catch(() => {
        alert("Logout failed. Please try again.");
      });
  };

  return (
    <View style={styles.sidebar}>
      <TouchableOpacity style={styles.closeButton} onPress={toggleSidebar}>
        <Ionicons name="close" size={30} color={Colors.primary} />
      </TouchableOpacity>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/school.png")}
          style={styles.logo}
        />
        <Text style={styles.schoolName}>Pragati Secondary School</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.menuItems}>
          {/* Academia Section */}
          <TouchableOpacity
            style={styles.sidebarItem}
            onPress={toggleAcademiaDropdown}
          >
            <Ionicons name="school" size={24} color={Colors.primary} />
            <Text style={styles.sidebarItemText}>Academia</Text>
            <Ionicons
              name={academiaDropdownOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
          {academiaDropdownOpen && (
            <View style={styles.subMenu}>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={handleClassRoutinePress}
              >
                <Text style={styles.subMenuItemText}>Class Routine</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={handleYearlyPlanPress}
              >
                <Text style={styles.subMenuItemText}>Yearly Plan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.subMenuItem}
                onPress={handleCourseProgressPress}
              >
                <Text style={styles.subMenuItemText}>Course Progress</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* ECA Section */}
          <TouchableOpacity style={styles.sidebarItem} onPress={handleECAPress}>
            <Ionicons name="school" size={24} color={Colors.primary} />
            <Text style={styles.sidebarItemText}>ECA</Text>
          </TouchableOpacity>

          {/* CCA Section */}
          <TouchableOpacity style={styles.sidebarItem} onPress={handleCCAPress}>
            <Ionicons name="school" size={24} color={Colors.primary} />
            <Text style={styles.sidebarItemText}>CCA</Text>
          </TouchableOpacity>
        </View>

        {/* Conditional Rendering for "add user" */}
        {userRole === "teacher" && (
          <TouchableOpacity style={styles.sidebarItem} onPress={handleAddUser}>
            <Ionicons name="person-add" size={24} color={Colors.primary} />
            <Text style={styles.sidebarItemText}>Add User</Text>
            <Ionicons size={24} color={Colors.primary} />
          </TouchableOpacity>
        )}

        {/* Conditional Rendering for "Your Children" */}

        {userRole === "parent" && (
          <TouchableOpacity style={styles.sidebarItem} onPress={toggleAddChild}>
            <Ionicons name="person-add" size={24} color={Colors.primary} />
            <Text style={styles.sidebarItemText}>Your Children</Text>
            <Ionicons
              name={addChildOpen ? "chevron-up" : "chevron-down"}
              size={24}
              color={Colors.primary}
            />
          </TouchableOpacity>
        )}
        {addChildOpen && userRole === "parent" && (
          <View style={styles.subMenu}>
            <TouchableOpacity
              style={styles.subMenuItem}
              onPress={handleStudentPress}
            ></TouchableOpacity>

            <TouchableOpacity
              style={styles.subMenuItem}
              onPress={handleAddPress}
            >
              <Ionicons name="person-add" size={20} color={Colors.primary} />
              <Text style={styles.subMenuItemText}>Add Child</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
      {/* Logout Button */}
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  subMenu: {
    marginLeft: 20,
    overflow: "hidden",
  },
  subMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  subMenuItemText: {
    fontSize: 14,
    marginLeft: 10,
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
  },
  sidebar: {
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    alignSelf: "flex-end",
  },
  content: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    marginTop: 1,
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 90,
    height: 90,
    borderRadius: 50,
  },
  schoolName: {
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
    marginTop: 8,
    color: Colors.primary,
  },
  menuItems: {
    marginTop: 20,
  },
  sidebarItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
  },
  sidebarItemText: {
    fontSize: FontSize.medium,
    marginLeft: 15,
    color: Colors.primary,
    fontFamily: Font["poppins-bold"],
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginTop: 20,
    backgroundColor: Colors.primary,
    borderRadius: 10,
    marginBottom: 1,
    maxWidth: 100,
  },
  logoutText: {
    fontSize: FontSize.medium,
    marginLeft: 15,
    color: "white",
    fontFamily: Font["poppins-bold"],
  },
});

export default Sidebar;
