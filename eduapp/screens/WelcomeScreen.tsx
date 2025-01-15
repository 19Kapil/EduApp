import React, { useEffect, useState } from "react";
import {
  Animated,
  StyleSheet,
  Text,
  View,
  ImageBackground,
  SafeAreaView,
  Easing,
} from "react-native";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { useNavigation } from "@react-navigation/native"; // Importing useNavigation hook
import { NativeStackNavigationProp } from "@react-navigation/native-stack"; // Importing NativeStackNavigationProp
import { RootStackParamList } from "../types"; // Your RootStackParamList type

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>(); // Correctly typed navigation

  const [fadeAnim] = useState(new Animated.Value(0)); // Initial opacity for text and logo
  const [logoAnim] = useState(new Animated.Value(0)); // Initial scale for logo animation

  useEffect(() => {
    // Start animations when the screen is mounted
    Animated.sequence([
      // Fade in the welcome text
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      // Animate logo scale (zoom in effect)
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 1500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to the login screen after animation duration
    setTimeout(() => {
      navigation.replace("Login"); // Now works with replace method
    }, 4000); // Duration in milliseconds (4 seconds)
  }, [fadeAnim, logoAnim, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Background Image */}
      <ImageBackground
        source={require("../assets/images/bg1.jpg")} // Path to your background image
        style={styles.backgroundImage}
      >
        <View style={styles.innerContainer}>
          {/* Logo Animation */}
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <Animated.Image
              source={require("../assets/images/school.png")} // Add your school logo here
              style={[styles.logo, { transform: [{ scale: logoAnim }] }]}
            />
          </Animated.View>

          {/* Welcome Text Animation */}
          <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
            Welcome!!!
          </Animated.Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center", // Center the content
    alignItems: "center", // Center the content
  },
  innerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    marginBottom: Spacing * 3, // Space between logo and text
  },
  logo: {
    width: 150, // Adjust the logo size
    height: 150, // Adjust the logo size
  },
  welcomeText: {
    fontSize: 25,
    color: "#D5006D", // Set the text color
    fontFamily: "ProtestRevolution-regular",
    textAlign: "center",
    marginTop: Spacing * 4,
  },
});

export default WelcomeScreen;
