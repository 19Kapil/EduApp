import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
//import io from "socket.io-client"; // Import Socket.IO client
import Colors from "../constants/Colors";
import Sidebar from "../components/SIdebar";
import BottomNavigator from "../components/BottomNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
  route: any;
};

interface Post {
  id: string;
  image: string;
  description: string;
}

const TeacherHomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const animatedValue = useRef(new Animated.Value(0)).current;
  const teacherClass = route.params?.teacherClass || 0;
  const teacherId = route.params?.teacherId || 0;
  const rotationValue = useRef(new Animated.Value(0)).current;
  
  // const socket = useRef(io("http://192.168.1.64:5000")).current; // Establish the WebSocket connection
  

  useEffect(() => {
      Animated.timing(animatedValue, {
        toValue: isSidebarOpen ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }, [isSidebarOpen]);
  
    const startLoadingAnimation = () => {
      Animated.loop(
        Animated.timing(rotationValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        })
      ).start();
    };
  
    const stopLoadingAnimation = () => {
      rotationValue.setValue(0); // Reset rotation
    };
  // Function to load posts
  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get<Post[]>("http://192.168.1.64:5000/api/posts");
      setPosts(response.data);
    } catch {
      setError("Failed to fetch posts.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle deleting a post
  const deletePost = async () => {
    try {
      await axios.delete(`http://192.168.1.64:5000/api/posts/${selectedPostId}`);
      setPosts((prev) => prev.filter((post) => post.id !== selectedPostId));
      setModalVisible(false);
    } catch {
      setError("Failed to delete post.");
    }
  };

  // Connect to socket on mount
  // useEffect(() => {
  //   socket.on("updateFeed", (newPost: Post) => {
  //     setPosts((prevPosts) => [newPost, ...prevPosts]); // Prepend the new post to the existing posts
  //   });

  //   // Clean up the socket connection when the component unmounts
  //   return () => {
  //     socket.off("updateFeed"); // Unsubscribe from the event
  //   };
  // }, []);


  // Load posts initially
  useEffect(() => {
    loadPosts();
  }, []);

  // Render posts
  const renderPosts = () => {
    if (loading) return <ActivityIndicator size="large" color={Colors.primary} />;
    if (error) return <Text style={styles.errorText}>{error}</Text>;
    if (posts.length === 0) return <Text style={styles.noPostsText}>No posts available.</Text>;

    return (
      <ScrollView>
        {posts.map((post) => (
          <View style={styles.post} key={post.id}>
            <Image source={{ uri: `data:image/jpg;base64,${post.image}` }} style={styles.postImage} />
            <View style={styles.postTextContainer}>
              <Text>{post.description}</Text>
              <TouchableOpacity onPress={() => { setSelectedPostId(post.id); setModalVisible(true); }}>
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: animatedValue.interpolate({ inputRange: [0, 1], outputRange: [-300, 0] }) }] }]}>
        {isSidebarOpen && <Sidebar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} userRole="teacher" teacherClass={teacherClass} userid="" childclass={teacherClass} />}
      </Animated.View>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSidebarOpen(!isSidebarOpen)}>
          <Ionicons name="menu" size={30} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={styles.welcomeText}>Events{teacherId}</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddPostScreen", { teacherClass })}>
          <Ionicons name="add" size={30} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {renderPosts()}

      {isModalVisible && (
        <Modal transparent>
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContainer}>
            <Text>Are you sure you want to delete this post?</Text>
            <TouchableOpacity onPress={deletePost}>
              <Text>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

      <BottomNavigator teacherClass={teacherClass} teacherId={teacherId} navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", marginTop: 30 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 20 },
  welcomeText: { fontSize: 24, color: Colors.primary },
  sidebar: { position: "absolute", top: 0, left: 0, width: 300, height: "100%", backgroundColor: "#fff", zIndex: 10 },
  post: { margin: 10, padding: 10, backgroundColor: "#fff", borderRadius: 8, elevation: 2 },
  postImage: { width: "100%", height: 200, borderRadius: 8 },
  postTextContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" },
  modalContainer: { backgroundColor: "#fff", margin: 50, padding: 20, borderRadius: 8 },
  errorText: { textAlign: "center", color: "red", margin: 10 },
  noPostsText: { textAlign: "center", margin: 20, color: Colors.primary },
});

export default TeacherHomeScreen;