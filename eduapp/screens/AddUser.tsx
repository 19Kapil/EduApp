import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import bcrypt from "react-native-bcrypt";

type AddUserNavigationProp = StackNavigationProp<RootStackParamList, 'TeacherHomeScreen'>;
type Props = {
  navigation: AddUserNavigationProp;
  route: any;
};

const AddUser: React.FC<Props> = ({ navigation,route }) => {
  const {teacherClass } = route.params;
  const [userid, setUserid] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleAddUser = async () => {
    if (!userid || !password) {
      Alert.alert("Error", "Please provide both userid and password!");
      return;
    }
  
    setIsLoading(true);
    setSuccessMessage("");
  
    try {
      // Prepare user data
      const newUser = {
        userid,
        password,
      };
  
      // Send a POST request to the backend
      const response = await fetch("http://192.168.1.64:5000/api/addUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setSuccessMessage("User successfully registered!");
        setUserid("");
        setPassword("");
  
        setTimeout(() => {
          navigation.replace("TeacherHomeScreen",{teacherClass});
        }, 1500); // 1.5 seconds delay for success message display
      } else {
        throw new Error(result.message || "Failed to register user.");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        // Now TypeScript knows that `error` is an instance of Error
        console.error("Error adding user:", error);
        Alert.alert("Error", error.message || "Failed to save the user. Please try again.");
      } else {
        console.error("An unknown error occurred:", error);
        Alert.alert("Error", "An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("TeacherHomeScreen", {teacherClass})}>
          <Ionicons name="chevron-back" size={25} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add User</Text>
      </View>

      {/* Registration Number Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="User ID"
          value={userid}
          onChangeText={setUserid}
        />
      </View>

      {/* Password Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Success Message */}
      {successMessage && (
        <Text style={styles.successMessage}>{successMessage}</Text>
      )}

      {/* Add User Button */}
      <TouchableOpacity
        onPress={handleAddUser}
        style={[styles.addButton, isLoading && { opacity: 0.6 }]}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <Text style={styles.addButtonText}>Add User</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 10,
  },
  inputContainer: {
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  addButton: {
    backgroundColor: "black",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    minWidth: 150,
    width: "60%",
    alignSelf: "center",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  successMessage: {
    color: "green",
    fontSize: 16,
    textAlign: "center",
    marginVertical: 10,
  },
});

export default AddUser;