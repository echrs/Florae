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
  Plant: { plant?: Plant, plantId?: string };
};

export type TasksTabParamList = {
  Tasks: NO_PARAMS;
  Plant: { plant?: Plant, plantId?: string };
};

export type PlantsTabParamList = {
  Plants: NO_PARAMS;
  Plant: { plant?: Plant, plantId?: string };
};

export type Plant = { _id: string, dateCreated: string, name: string, nickname: string, notes: string, tasks: any, userId: string, img: string };