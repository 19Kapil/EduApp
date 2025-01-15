import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp, RouteProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { ImageSourcePropType } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "CallScreen"> & {
    params: { teacher: { name: string; avatar: ImageSourcePropType } };
  };
};

const CallScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacher } = route.params;
  const [timer, setTimer] = useState<number>(0);
  const [callEndTime, setCallEndTime] = useState<number | null>(null);

  // Increment timer every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer + 1);
    }, 1000);

    // Clear interval on unmount to prevent memory leaks
    return () => clearInterval(interval);
  }, []);

  // Format the timer to display minutes and seconds
  const formatTimer = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? "0" + minutes : minutes}:${
      remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds
    }`;
  };

  const endCall = async () => {
    setCallEndTime(timer);
    try {
      await AsyncStorage.setItem("callEndTime", timer.toString());
    } catch (error) {
      console.error("Error saving call end time:", error);
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        {/* Timer */}
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>{formatTimer(timer)}</Text>
        </View>

        {/* End Call Button */}
        <TouchableOpacity style={styles.endCallButton} onPress={endCall}>
          <View style={styles.endCallIcon}>
            <Text style={styles.endCallText}>End Call</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={teacher.avatar} style={styles.avatar} />
        <Text style={styles.teacherName}>{teacher.name}</Text>
      </View>

      {/* Call Controls */}
      <View style={styles.callControls}>
        <TouchableOpacity style={styles.muteButton}>
          <Ionicons name="mic-off" size={40} color="white" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.speakerButton}>
          <Ionicons name="volume-high" size={40} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 30 : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
  },
  timerContainer: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  timerText: {
    color: "white",
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
  },
  endCallButton: {
    backgroundColor: "#F44336",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  endCallIcon: {
    flexDirection: "row",
    alignItems: "center",
  },
  endCallText: {
    color: "white",
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
  },
  avatarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
  },
  teacherName: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    color: Colors.primary,
  },
  callControls: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  muteButton: {
    backgroundColor: "#F44336",
    padding: 20,
    borderRadius: 50,
    marginRight: 30,
  },
  speakerButton: {
    backgroundColor: "#4CAF50",
    padding: 20,
    borderRadius: 50,
  },
});

export default CallScreen;
