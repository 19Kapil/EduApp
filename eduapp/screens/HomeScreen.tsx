import React, { useState, useEffect, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  FlatList,
  TextInput,
  Dimensions,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
 //import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import PBottomNavigator from "../components/PBottomNavigator";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Sidebar from "../components/SIdebar";
import Font from "../constants/Font";
import Colors from "../constants/Colors";

type Props ={
  navigation:NativeStackNavigationProp<RootStackParamList>;
  route: any;
}

interface Post {
  id: string;
  image: string;
  description: string;
}

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { width } = Dimensions.get("window");
  const { userid, childclass } = route.params;
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // For refresh animation
  const animatedValue = useRef(new Animated.Value(0)).current;
  const rotationValue = useRef(new Animated.Value(0)).current;

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

  const loadPosts = async () => {
    setLoading(true);
    startLoadingAnimation();
    try {
      const response = await axios.get<Post[]>("http://192.168.1.64:5000/api/posts");
      setPosts(response.data);
      setError(null);
    } catch {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
      stopLoadingAnimation();
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleTouch = () => {
    if (!loading) loadPosts();
  };

  const sidebarTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.8, 0],
  });

  const rotation = rotationValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const renderPosts = () => (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.post}>
          <Image source={{ uri: `data:image/png;base64,${item.image}` }} style={styles.postImage} />
          <Text style={styles.postDescription}>{item.description}</Text>
        </View>
      )}
      ListEmptyComponent={
        <Text style={styles.noPostsText}>{error || "No posts available."}</Text>
      }
    />
  );

  return (
    <TouchableWithoutFeedback onPress={handleTouch} onPressOut={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Animated.View style={[styles.sidebar, { transform: [{ translateX: sidebarTranslateX }] }]}>
          {isSidebarOpen && (
            <Sidebar
              toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
              userRole="parent"
              userid={userid}
              teacherClass=""
              childclass={childclass}
            />
          )}
        </Animated.View>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => setSidebarOpen(!isSidebarOpen)}>
            <Ionicons name="menu" size={30} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Events</Text>
          <TouchableOpacity onPress={() => setSearchOpen(!isSearchOpen)}>
            <Ionicons name="search" size={30} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {isSearchOpen && (
          <View style={styles.searchContainer}>
            <TextInput style={styles.searchInput} placeholder="Search..." />
            <TouchableOpacity onPress={() => setSearchOpen(false)}>
              <Ionicons name="close" size={24} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        )}

        {loading && (
          <View style={styles.loaderContainer}>
            <Animated.View
              style={[
                styles.loader,
                {
                  transform: [{ rotate: rotation }],
                  shadowOpacity: 0.3,
                  shadowRadius: 5,
                  shadowColor: Colors.primary,
                },
              ]}
            />
          </View>
        )}

        {renderPosts()}

        <PBottomNavigator userid={userid} childclass={childclass} navigation={navigation} />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
  },
  headerText: { fontSize: 24, fontFamily: Font["poppins-bold"], color: Colors.primary },
  sidebar: {
    position: "absolute",
    width: "80%",
    height: "100%",
    backgroundColor: "#fff",
    zIndex: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 20,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  post: {
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    backgroundColor: "#fff",
  },
  postImage: { width: "100%", height: 200, borderRadius: 8 },
  postDescription: { marginTop: 10, fontSize: 14, color: "#333" },
  noPostsText: { textAlign: "center", margin: 20, color: Colors.text },
  loaderContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  loader: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 5,
    borderColor: Colors.primary,
    borderTopColor: "transparent",
    backgroundColor: "transparent",
  },
});

export default HomeScreen;
