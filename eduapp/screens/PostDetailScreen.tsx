import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import { Ionicons } from "@expo/vector-icons";
import Autolink from "react-native-autolink";

type PostDetailScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "PostDetailScreen"
>;
type PostDetailScreenRouteProp = RouteProp<
  RootStackParamList,
  "PostDetailScreen"
>;

const PostDetailScreen: React.FC = () => {
  const route = useRoute<PostDetailScreenRouteProp>();
  const navigation = useNavigation<PostDetailScreenNavigationProp>();
  const { post } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.closeButton}
      >
        <Ionicons name="close" size={30} color="black" />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.descriptionContainer}>
          <Autolink
            style={styles.description}
            text={post.description}
            linkStyle={{ color: "blue" }}
          />
        </View>

        <View style={styles.imageContainer}>
          <Image
            source={{ uri: `data:image/jpg;base64,${post.image}` }}
            style={styles.fullImage}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffe6",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingBottom: 20,
  },
  descriptionContainer: {
    marginTop: 50,
    padding: 20,
    
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  description: {
    color: "black",
    fontSize: 18,
  },
  imageContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  fullImage: {
    width: "100%",
    height: 350,
    resizeMode: "contain",
  },
});

export default PostDetailScreen;
