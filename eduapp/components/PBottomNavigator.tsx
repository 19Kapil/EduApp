import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";

type PBottomNavigatorProps = {
  navigation: NavigationProp<RootStackParamList>;
  userid: string; 
  //childclass: string;
};

const PBottomNavigator: React.FC<PBottomNavigatorProps> = ({ navigation,userid}) => {
  const navigateTo = (screen: keyof RootStackParamList) => {
    switch (screen) {
      case "ParentsChatScreen":
        navigation.navigate("ParentsChatScreen");
        break;
      case "ParentsRoutineScreen":
        navigation.navigate("ParentsRoutineScreen");
        break;
      case "ChildProfileScreen":
        navigation.navigate("ChildProfileScreen", {userid} );
        break;
      default:
        break;
    }
  };

  const iconColor = "black";

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity onPress={() => navigateTo("HomeScreen")}>
          <Ionicons name="home" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("ParentsChatScreen")}>
          <Ionicons name="chatbubbles" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("ParentsRoutineScreen")}>
          <Ionicons name="calendar" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("ChildProfileScreen")}>
          <Ionicons name="person" size={35} color={iconColor} />
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
  },
  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 20,
    height: 50,
  },
});

export default PBottomNavigator;
