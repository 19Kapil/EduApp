import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import { RouteProp } from "@react-navigation/native";

const Spacing = 30;

type Props = {
  navigation: NavigationProp<RootStackParamList>;
  route: RouteProp<RootStackParamList, "AddScreen">;
};

const AddScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userid } = route.params;
  const [childName, setChildName] = useState<string>("");
  const [childRegNo, setChildRegNo] = useState<number | undefined>(undefined); // Keep as number
  const [childClass, setChildClass] = useState<number | undefined>(undefined); // Keep as number

  const handleAddChild = async () => {
    if (!childName || !childRegNo || !childClass) {
      alert("All fields are required!");
      return;
    }

    const childData = {
      childName,
      childRegNo,
      childClass,
    };

    try {
      const response = await fetch(`http://192.168.1.64:5000/api/addchild?userid=${userid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(childData),
      });

      if (response.ok) {
        console.log("Child added successfully");
        navigation.navigate("HomeScreen", { userid });
      } else {
        const errorData = await response.json();
        console.error("Failed to add child:", errorData.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle numeric inputs correctly
  const handleRegNoChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      setChildRegNo(num); // Update childRegNo only if it's a valid number
    } else {
      setChildRegNo(undefined); // Clear the input if it's not a valid number
    }
  };

  const handleClassChange = (text: string) => {
    const num = parseInt(text, 10);
    if (!isNaN(num)) {
      setChildClass(num); // Update childClass only if it's a valid number
    } else {
      setChildClass(undefined); // Clear the input if it's not a valid number
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <Text style={styles.title}>Add Child</Text>
        <TextInput
          style={styles.input}
          placeholder="Child's Name"
          onChangeText={setChildName}
          value={childName}
        />
        <TextInput
          style={styles.input}
          placeholder="Child's Registration Number"
          onChangeText={handleRegNoChange}
          value={childRegNo ? childRegNo.toString() : ""}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Child's Class"
          onChangeText={handleClassChange}
          value={childClass ? childClass.toString() : ""}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddChild}>
          <Text style={styles.buttonText}>Add Child</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.background,
    padding: Spacing,
  },
  formContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: FontSize.xLarge,
    fontFamily: Font["poppins-bold"],
    marginBottom: Spacing,
    color: Colors.primary,
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: Colors.primary,
    fontFamily: Font["poppins-semiBold"],
    borderRadius: 8,
    paddingHorizontal: Spacing,
    marginBottom: Spacing,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginTop: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: Spacing },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
  },
  buttonText: {
    color: Colors.white,
    fontFamily: Font["poppins-bold"],
    fontSize: FontSize.medium,
  },
});

export default AddScreen;
