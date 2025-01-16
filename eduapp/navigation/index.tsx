import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import Colors from "../constants/Colors";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import Welcome from "../screens/WelcomeScreen";
import ParentsChatScreen from "../screens/ParentsChat";
import { RootStackParamList } from "../types";
import CodeScreen from "../screens/CodeScreen";
import HomeScreen from "../screens/HomeScreen";
import TeacherHomeScreen from "../screens/TeacherHomeScreen";
import TeacherChatScreen from "../screens/TeacherChatScreen";
import ParentsRoutineScreen from "../screens/ParentsRoutine";
import StudentListScreen from "../screens/StudentListScreen";
import ChildProfileScreen from "../screens/ChildProfileScreen";
// import TeacherRoutineScreen from "../screens/ClassRoutineScreen";
import ChatScreen from "../screens/Chat";
import YearlyPlanScreen from "../screens/YearlyPlan";
import TChatScreen from "../screens/TChat";
import StudentsIndiScreen from "../screens/StudentsIndi";
import AddPostScreen from "../screens/AddPost";
import CallScreen from "../screens/CallScreen";
import TCallScreen from "../screens/TCallScreen";
import CourseProgress from "../screens/CourseProgressScreen";
import ecaScreen from "../screens/ecaScreen";
import CcaScreen from "../screens/ccaScreen";
import AddScreen from "../screens/AddScreen";
import AddUser from "../screens/AddUser";
import ReportCardScreen from "../screens/ReportCardScreen";
import AttendanceScreen from "../screens/AttendanceScreen";
import AttendanceReportScreen from "../screens/AttendanceReportScreen";
import ClassRoutineScreen from "../screens/ClassRoutineScreen";
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={Welcome} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="CodeScreen" component={CodeScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="TeacherHomeScreen" component={TeacherHomeScreen} />
      <Stack.Screen name="TeacherChatScreen" component={TeacherChatScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="TChatScreen" component={TChatScreen} />
      <Stack.Screen name="StudentsIndiScreen" component={StudentsIndiScreen} />
      <Stack.Screen name="ClassRoutineScreen" component={ClassRoutineScreen} /> 
      <Stack.Screen name="YearlyPlanScreen" component={YearlyPlanScreen} />
      <Stack.Screen name="TCallScreen" component={TCallScreen} />
      <Stack.Screen name="CourseProgressScreen" component={CourseProgress} />
      <Stack.Screen name="ecaScreen" component={ecaScreen} />
      <Stack.Screen name="CcaScreen" component={CcaScreen} />
      <Stack.Screen name="AddScreen" component={AddScreen} />
      <Stack.Screen name="ReportCardScreen" component={ReportCardScreen} />
      <Stack.Screen name="AttendanceReportScreen" component={AttendanceReportScreen} />

    

      <Stack.Screen
        name="ChildProfileScreen"
        component={ChildProfileScreen}
      />

      <Stack.Screen
        name="StudentListScreen"
        component={StudentListScreen}
      />
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      <Stack.Screen name="AddUser" component={AddUser} />

      <Stack.Screen
        name="ParentsRoutineScreen"
        component={ParentsRoutineScreen}
      />
      <Stack.Screen name="ParentsChatScreen" component={ParentsChatScreen} />
      <Stack.Screen name="CallScreen" component={CallScreen} />
      <Stack.Screen name="AttendanceScreen" component={AttendanceScreen} />
    </Stack.Navigator>
  );
}
