import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  ImageBackground,
  Image,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types"; 
import axios from "axios";
import { AxiosError } from 'axios';


type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [userid, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("Parents");
  const [teacherCode, setTeacherCode] = useState("");
  const [teacherClass, setTeacherClass] = useState<string | null>(null); 
  const [userRole, setUserRole] = useState<string | null>(null); 




  const handleParentLogin = async () => {
    try {
      const { data } = await axios.post("http://192.168.1.64:5000/api/login", { userid: userid.trim(), password: password.trim() });
  
      if (data.success) {
        navigation.navigate("HomeScreen", { userid, childclass: data.user.childclass });
        Alert.alert("Login Successful");
      } else {
        Alert.alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      const message = axios.isAxiosError(error) ? error.response?.data?.message || error.message : "An error occurred";
      console.error("Login error:", message);
      Alert.alert(message);
    }
  };
  
  

  const handleTeacherLogin = async () => {
    if (!teacherCode.trim()) {
      return Alert.alert("Please enter the teacher code.");
    }
  
    try {
      const { data } = await axios.post("http://192.168.1.64:5000/api/teacherlogin", {
        teacherCode: teacherCode.trim(),
      });
  
      if (data.success) {
        Alert.alert("Login Successful"); 
        navigation.navigate("TeacherHomeScreen", { teacherClass: data.teacherClass, teacherId: data.teacherId });


        
      } else {
        Alert.alert(data.message || "Invalid credentials");
      } 
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "An error occurred during login.";
      console.error("Login error:", message);
  
      // Ensure `message` is a string
      Alert.alert(typeof message === "string" ? message : "An unknown error occurred.");
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require("../assets/images/2.png")} 
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.loginCard}>
          {/* School Logo */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../assets/images/school.png")} 
              style={styles.logo}
              resizeMode="contain"
            />
          </View>

          {/* Tab Selection */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Parents" && styles.activeTab]}
              onPress={() => setActiveTab("Parents")}
            >
              <Text style={[styles.tabText, activeTab === "Parents" && styles.activeText]}>
                Parents
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "Teacher" && styles.activeTab]}
              onPress={() => setActiveTab("Teacher")}
            >
              <Text style={[styles.tabText, activeTab === "Teacher" && styles.activeText]}>
                Teacher
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {activeTab === "Parents" ? (
            <View>
              <TextInput
                style={styles.input}
                placeholder="User ID"
                placeholderTextColor="#aaa"
                value={userid}
                onChangeText={(text) => setUserID(text)}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#aaa"
                secureTextEntry={true}
                value={password}
                onChangeText={(text) => setPassword(text)}
              />
              <TouchableOpacity
                onPress={handleParentLogin}
                style={styles.loginButton}
              >
                <Text style={styles.buttonText}>Log In</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View>
              <Text style={styles.label}>Enter Teacher Code</Text>
              <TextInput
                style={styles.input}
                placeholder="Code"
                placeholderTextColor="#aaa"
                value={teacherCode}
                onChangeText={(text) => setTeacherCode(text)}
              />
              <TouchableOpacity
                onPress={handleTeacherLogin}
                style={styles.loginButton}
              >
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loginCard: {
    backgroundColor: "rgba(255, 255, 255, 0)", // Slightly transparent background for the login card
    borderRadius: 10,
    padding: 24,
    width: "90%",
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "#F3F4F6",
    marginHorizontal: 5,
  },
  activeTab: {
    backgroundColor: "black",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeText: {
    color: "white",
    fontWeight: "bold",
  },
  input: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 14,
    fontSize: 14,
    color: "black",
    marginBottom: 12,
  },
  loginButton: {
    backgroundColor: "#000000",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
});

export default LoginScreen;
