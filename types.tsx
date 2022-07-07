import { NavigatorScreenParams } from '@react-navigation/native';

export type NO_PARAMS = undefined;

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | NO_PARAMS;
  Profile: NO_PARAMS;
};

export type RootTabParamList = {
  HomeTab: NO_PARAMS;
  TasksTab: NO_PARAMS;
  PlantsTab: NO_PARAMS;
};

export type HomeTabParamList = {
  Home: NO_PARAMS;
  Tasks: NO_PARAMS;
  Profile: NO_PARAMS;
};
