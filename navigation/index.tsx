import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import {Colors, Fonts} from '../constants/Constants';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TasksScreen';
import PlantsScreen from '../screens/PlantsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import {
  AppStackParamList,
  HomeTabParamList,
  PlantsTabParamList,
  RootStackParamList,
  TabsParamList,
  TasksTabParamList,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { Pressable } from 'react-native';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import TasksScreen from '../screens/TasksScreen';

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Root = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  var isLoggedIn = false;
  return (
    <Root.Navigator>
      {isLoggedIn ? (
        <Root.Screen
          name='App'
          component={AppNavigator}
          options={{ headerShown: false }}
        />
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
            }}
          />
          <Root.Screen
            name='SignUp'
            component={SignUpScreen}
            options={{
              headerTitle: '',
              headerTransparent: true,
              headerShadowVisible: false,
            }}
          />
        </>
      )}
    </Root.Navigator>
  );
}

const App = createNativeStackNavigator<AppStackParamList>();

function AppNavigator() {
  return (
    <App.Navigator>
      <App.Screen
        name='Tabs'
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <App.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerTitle: '',
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: '#ffffff',
        }}
      />
    </App.Navigator>
  );
}

const Tab = createBottomTabNavigator<TabsParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName='HomeTab'
      screenOptions={{
        tabBarStyle: {
          backgroundColor: 'transparent',
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
        },
        tabBarShowLabel: false,
        headerTransparent: true,
      }}
    >
      <Tab.Screen
        name='HomeTab'
        component={HomeTabNavigator}
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='home-outline'
              size={25}
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons
                name='account-outline'
                size={25}
                color={Colors.text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name='TasksTab'
        component={TasksTabNavigator}
        options={({ navigation }) => ({
          headerTitle: 'Plant tasks',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='book-open-outline'
              size={25}
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons
                name='account-outline'
                size={25}
                color={Colors.text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
      />
      <Tab.Screen
        name='PlantsTab'
        component={PlantsTabNavigator}
        options={({ navigation }) => ({
          headerTitle: 'Plant library',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name='flower-tulip-outline'
              size={25}
              color={color}
            />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <MaterialCommunityIcons
                name='account-outline'
                size={25}
                color={Colors.text}
                style={{ marginRight: 15 }}
              />
            </Pressable>
          ),
        })}
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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
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
        options={{ headerShown: false }}
      />
    </PlantsTab.Navigator>
  );
}

