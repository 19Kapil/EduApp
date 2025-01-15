import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../types";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Spacing from "../constants/Spacing";
import * as ImagePicker from "expo-image-picker";
import { v4 as uuidv4 } from "uuid";
import 'react-native-get-random-values';

type Props = {
  navigation: NavigationProp<RootStackParamList>;
};

const AddPostScreen: React.FC<Props> = ({ navigation }) => {
  const { width } = Dimensions.get("window");
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState<string>("");
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
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled && pickerResult.assets && pickerResult.assets.length > 0) {
      setImage(pickerResult.assets[0].uri);
    }
  };

  const handleAddPost = async () => {
    if (!description || !image) {
      Alert.alert("Error", "Please provide both a description and an image!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Append image
      formData.append("image", {
        uri: image,
        name: `post-image-${uuidv4()}.jpg`,
        type: "image/jpeg",
      } as any);

      // Append description
      formData.append("description", description);

      // Send POST request
      const response = await fetch("http://192.168.1.64:5000/api/addPost", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Success", "Post added successfully!");
        setImage(null);
        setDescription("");
        navigation.goBack();
      } else {
        Alert.alert("Error", result.message || "Failed to add the post. Please try again.");
      }
    } catch (error) {
      console.error("Error adding post:", error);
      Alert.alert("Error", "Failed to save the post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={45} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Post</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <TextInput
          style={styles.descriptionInput}
          multiline
          placeholder="Write the description..."
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.imageUploadContainer}>
        {image ? (
          <Image source={{ uri: image }} style={styles.uploadedImage} />
        ) : (
          <TouchableOpacity style={styles.uploadButton} onPress={handleImageUpload}>
            <Text style={styles.uploadText}>Upload Image</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={handleAddPost} style={styles.addPostButton}>
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.addPostButtonText}>Add Post</Text>
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
    fontSize: FontSize.large,
    fontFamily: Font["poppins-bold"],
    marginLeft: 10,
  },
  imageUploadContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
  },
  uploadedImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
  },
  uploadButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  uploadText: {
    color: Colors.primary,
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-bold"],
  },
  descriptionContainer: {
    borderWidth: 1,
    borderColor: Colors.gray,
    borderRadius: 10,
    padding: 10,
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: "top",
    fontSize: FontSize.medium,
    fontFamily: Font["poppins-regular"],
  },
  addPostButton: {
    padding: Spacing * 2,
    backgroundColor: Colors.primary,
    marginVertical: Spacing * 3,
    borderRadius: Spacing,
    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: Spacing,
    },
    shadowOpacity: 0.3,
    shadowRadius: Spacing,
    minWidth: 150,
    width: "60%",
    alignSelf: "center",
  },
  addPostButtonText: {
    fontFamily: Font["poppins-bold"],
    color: Colors.onPrimary,
    textAlign: "center",
    fontSize: FontSize.large,
  },
});

export default AddPostScreen;
