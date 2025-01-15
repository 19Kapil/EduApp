import { NativeStackScreenProps } from "@react-navigation/native-stack";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  AddPostScreen: undefined;
  AddUser: undefined;
  CodeScreen: undefined;
  YearlyPlanScreen: undefined;
  HomeScreen: { userid: string, childclass: number };
  TeacherHomeScreen: { teacherClass: string };
  AddScreen: { userid: string };
  TeacherChatScreen: undefined;
  ParentsChatScreen: undefined;
  ParentsRoutineScreen: undefined;
  StudentListScreen: { teacherClass: string }; 
  ChildProfileScreen: {userid: string};
  ChatScreen: undefined;
  TeacherRoutineScreen: undefined;
  TChatScreen: undefined;
  StudentsIndiScreen:{ teacherClass: string};
  CcaScreen: undefined;
  CallScreen: undefined;
  TCallScreen: undefined;
  ecaScreen: undefined;
  CourseProgressScreen: undefined;
  ReportCardScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
