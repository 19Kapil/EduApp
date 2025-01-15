import React from "react";
import { View, TouchableOpacity, StyleSheet, Image, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
type SidebarProps = {
  toggleSidebar: () => void;
  navigation: any;
};
const LSidebar: React.FC<SidebarProps> = ({ navigation, toggleSidebar }) => {
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

        <TouchableOpacity
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            shadowColor: Colors.primary,
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
          onPress={() => navigation.navigate("Login")}
        >
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: Colors.onPrimary,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Login to continue
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sidebar: {
    backgroundColor: "white",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    zIndex: 1,
    width: "100%",
    paddingHorizontal: 30,
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
    fontSize: 16,
    marginTop: 8,
    color: Colors.primary,
  },
});

export default LSidebar;
