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
  AddPostScreen: {teacherClass: string};
  AddUser:{teacherClass: string};
  CodeScreen: undefined;
  ClassRoutineScreen: { teacherClass: string, childclass: number };
  YearlyPlanScreen: undefined;
  HomeScreen: { userid: string, childclass: number };
  TeacherHomeScreen: { teacherClass: string, teacherId: number };
  AddScreen: { userid: string };
  TeacherChatScreen: undefined;
  //ParentsChatScreen: undefined;
  ParentsRoutineScreen: undefined;
  StudentListScreen: { teacherClass: string }; 
  ChildProfileScreen: {userid: string};
  Chat: { name: string; registration_number: number };
  TChatScreen: {teacherClass: string, teacherId: number};
  StudentsIndiScreen:{ teacherClass: string};
  CcaScreen: {teacherClass: string, childclass: number};
  CallScreen: undefined;
  TCallScreen: undefined;
  ecaScreen: undefined;
  CourseProgressScreen: undefined;
  ReportCardScreen: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
