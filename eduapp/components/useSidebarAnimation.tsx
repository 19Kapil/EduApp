import { useState, useRef, useEffect } from "react";
import { Animated, Dimensions } from "react-native";

const useSidebarAnimation = () => {
  const { width } = Dimensions.get("window");
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isSidebarOpen) {
      Animated.timing(animatedValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const sidebarTranslateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [-width * 0.8, 0],
  });

  return { isSidebarOpen, toggleSidebar, sidebarTranslateX };
};

export default useSidebarAnimation;
