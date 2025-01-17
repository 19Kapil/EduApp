import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { v4 as uuidv4 } from "uuid";
import * as ImagePicker from "expo-image-picker";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import Spacing from "../constants/Spacing";

type Props = {
  navigation: any;
  route: any;
};

const ClassRoutineScreen: React.FC<Props> = ({ navigation, route }) => {
  const { teacherClass } = route.params;
  const { childclass } = route.params;
  const classToFetch = teacherClass || childclass;
  const [routineUrl, setRoutineUrl] = useState<string | undefined>(undefined);
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission required", "Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleAddRoutine = async () => {
    if (!image) {
      Alert.alert("Error", "Please provide an image for the routine!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: image,
        name: `post-image-${uuidv4()}.jpg`,
        type: "image/jpeg",
      } as any);
      formData.append("teacherClass", classToFetch);

      const response = await fetch(
        `http://192.168.1.64:5000/api/addRoutine?teacherClass=${classToFetch}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Routine added successfully!");
        setImage(null);
      } else {
        Alert.alert("Error", result.message || "Failed to add the routine. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to save the routine. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await fetch(
          `http://192.168.1.64:5000/api/routine?teacherClass=${classToFetch}`
        );
        if (!response.ok) throw new Error("Failed to fetch routine");
        const data = await response.json();

        if (data && data[0] && data[0].routine) {
          setRoutineUrl(`data:image/jpeg;base64,${data[0].routine}`);
        }
      } catch (error) {
        console.error("Error fetching routine:", error);
      }
    };

    fetchRoutine(); // Initial fetch
    const interval = setInterval(fetchRoutine, 2000); // Fetch every 2 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [classToFetch]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={30} color="black" />
          
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Class Routine</Text>
        
      </View>

      <View style={styles.imageContainer}>
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : routineUrl ? (
          <Image source={{ uri: routineUrl }} style={styles.image} />
        ) : (
          <Text style={styles.errorText}>Routine not available.</Text>
        )}
      </View>

      {teacherClass && (
        <View style={styles.imageUploadContainer}>
          {image ? (
            <TouchableOpacity onPress={() => {}}>
              <Image source={{ uri: image }} style={styles.uploadedImage} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
              <Text>Upload</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={handleAddRoutine} style={styles.addPostButton}>
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.addPostButtonText}>Set</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
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
    marginBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    marginLeft: 10,
  },
  imageContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    marginBottom: 200,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-regular"],
  },
  imageUploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  uploadedImage: {
    width: 70,
    height: 70,
    resizeMode: "cover",
    borderRadius: 10,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 100,
    height: 50,
    justifyContent: "center",
  },
  addPostButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 100,
    height: 50,
    justifyContent: "center",
  },
  addPostButtonText: {
    color: "black",
    textAlign: "center",
    fontSize: 18,
  },
});

export default ClassRoutineScreen;
