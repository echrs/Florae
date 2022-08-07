import { NavigatorScreenParams } from '@react-navigation/native';

export type NO_PARAMS = undefined;

export type RootStackParamList = {
  App: NO_PARAMS;
  SignUp: NO_PARAMS;
  SignIn: NO_PARAMS;
  Welcome: NO_PARAMS;
};

export type AppStackParamList = {
  Tabs: NO_PARAMS;
  Profile: NO_PARAMS;
};

export type TabsParamList = {
  HomeTab: NO_PARAMS;
  TasksTab: NO_PARAMS;
  PlantsTab: NO_PARAMS;
};

export type HomeTabParamList = {
  Home: NO_PARAMS;
  Plant: { plant: { nickname: string; name: string; _id: string; notes: string, img: string, tasks: any } };
};

export type TasksTabParamList = {
  Tasks: NO_PARAMS;
  NewTask: NO_PARAMS;
  ViewTask: NO_PARAMS;
};

export type PlantsTabParamList = {
  Plants: NO_PARAMS;
  Plant: { plant: { nickname: string; name: string; _id: string; notes: string } };
};
