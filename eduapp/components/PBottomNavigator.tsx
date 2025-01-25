import React from "react";
import { View, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type PBottomNavigatorProps = {
  navigation:NativeStackNavigationProp<RootStackParamList>;
  userid: string;
  childclass: string;
  teacherId: number;
};

const PBottomNavigator: React.FC<PBottomNavigatorProps> = ({
  navigation,
  userid,
  childclass,
  teacherId,
}) => {
  const navigateTo = (screen: keyof RootStackParamList) => {
    switch (screen) {
      case "ParentChatScreen":
        navigation.navigate("ParentChatScreen", { userid, childclass, teacherId });
        break;
      case "ClassRoutineScreen":
        navigation.navigate("ClassRoutineScreen", { userid, childclass });
        break;
      case "ChildProfileScreen":
        navigation.navigate("ChildProfileScreen", { userid });
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
        <TouchableOpacity onPress={() => navigateTo("ParentChatScreen")}>
          <Ionicons name="chatbubbles" size={35} color={iconColor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigateTo("ClassRoutineScreen")}>
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
