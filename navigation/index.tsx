import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { Colors, Fonts } from '../constants/Constants';
import HomeScreen from '../screens/HomeScreen';
import PlantsScreen from '../screens/PlantsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { AppStackParamList, HomeTabParamList, PlantsTabParamList, RootStackParamList, TabsParamList, TasksTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Pressable } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TasksScreen from '../screens/TasksScreen';
import { useContext } from 'react';
import { Context } from '../Context';
import { logout } from '../api';
import PlantScreen from '../screens/PlantScreen';

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Root = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { userCtx } = useContext(Context);
  const user = userCtx;

  return (
    <Root.Navigator>
      {user[0].userId ? (
        <Root.Screen name='App' component={AppNavigator} options={{ headerShown: false }} />
      ) : (
        <>
          <Root.Screen
            name='Welcome'
            component={WelcomeScreen}
            options={{
              headerTitle: '',
              headerTransparent: true,
              headerShadowVisible: false,
            }}
          />
          <Root.Screen
            name='SignIn'
            component={SignInScreen}
            options={{
              headerTitle: '',
              headerTransparent: true,
              headerShadowVisible: false,
              headerTintColor: '#ffffff',
            }}
          />
          <Root.Screen
            name='SignUp'
            component={SignUpScreen}
            options={{
              headerTitle: '',
              headerTransparent: true,
              headerShadowVisible: false,
              headerTintColor: '#ffffff',
            }}
          />
        </>
      )}
    </Root.Navigator>
  );
}

const App = createNativeStackNavigator<AppStackParamList>();

function AppNavigator() {
  const { userCtx } = useContext(Context);
  const [user, setUser] = userCtx;
  const { plantsCtx } = useContext(Context);
  const [plants, setPlants] = plantsCtx;

  return (
    <App.Navigator>
      <App.Screen name='Tabs' component={TabNavigator} options={{ headerShown: false }} />
      <App.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: '#ffffff',
          headerRight: () => (
            <Pressable
              onPress={() => {
                logout();
                setUser('');
                setPlants('');
              }}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialIcons name='logout' size={25} color={Colors.text} />
            </Pressable>
          ),
        }}
      />
    </App.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabsParamList>();

function TabNavigator() {
  const getTabBarVisibility = (route: any) => {
    const routeName = getFocusedRouteNameFromRoute(route) || '';
    const offScreens = ['Plant'];
    if (offScreens.indexOf(routeName) >= 0) return 'none';
  };
  return (
    <Tab.Navigator
      initialRouteName='HomeTab'
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: Colors.background,
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          display: getTabBarVisibility(route),
        },
        tabBarShowLabel: false,
        headerTransparent: true,
      })}
    >
      <Tab.Screen
        name='HomeTab'
        component={HomeTabNavigator}
        options={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='home-outline' size={25} color={color} />,
        })}
      />
      <Tab.Screen
        name='TasksTab'
        component={TasksTabNavigator}
        options={{
          headerShown: false,
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='book-open-outline' size={25} color={color} />,
        }}
      />
      <Tab.Screen
        name='PlantsTab'
        component={PlantsTabNavigator}
        options={{
          headerShown: false,
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => <MaterialCommunityIcons name='flower-tulip-outline' size={25} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const HomeTab = createNativeStackNavigator<HomeTabParamList>();

function HomeTabNavigator() {
  return (
    <HomeTab.Navigator>
      <HomeTab.Screen
        name='Home'
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerTransparent: true,
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons name='account-outline' size={25} color={Colors.text} />
            </Pressable>
          ),
        })}
      />
      <HomeTab.Screen
        name='Plant'
        component={PlantScreen}
        options={({ navigation }) => ({
          headerTitle: 'New plant',
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: '#ffffff',
        })}
      />
    </HomeTab.Navigator>
  );
}

const TasksTab = createNativeStackNavigator<TasksTabParamList>();

function TasksTabNavigator() {
  return (
    <TasksTab.Navigator>
      <TasksTab.Screen
        name='Tasks'
        component={TasksScreen}
        options={({ navigation }) => ({
          headerTitle: 'Plant tasks',
          headerTransparent: true,
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons name='account-outline' size={25} color={Colors.text} />
            </Pressable>
          ),
        })}
      />
    </TasksTab.Navigator>
  );
}

const PlantsTab = createNativeStackNavigator<PlantsTabParamList>();

function PlantsTabNavigator() {
  return (
    <PlantsTab.Navigator>
      <PlantsTab.Screen
        name='Plants'
        component={PlantsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Plant library',
          headerTransparent: true,
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons name='account-outline' size={25} color={Colors.text} />
            </Pressable>
          ),
        })}
      />
      <PlantsTab.Screen
        name='Plant'
        component={PlantScreen}
        options={({ navigation }) => ({
          headerTitle: 'New plant',
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: '#ffffff',
        })}
      />
    </PlantsTab.Navigator>
  );
}
