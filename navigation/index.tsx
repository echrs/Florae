import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TasksScreen';
import PlantsScreen from '../screens/PlantsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { RootStackParamList, RootTabParamList } from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Pressable } from 'react-native';
import Fonts from '../constants/Fonts';

export default function Navigation() {
  return (
    // <NavigationContainer linking={LinkingConfiguration}>
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Tabs'
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          headerTitle: '',
          headerTitleStyle: { color: Colors.text },
          headerShown: true,
          headerTransparent: true,
          headerShadowVisible: false,
          headerTintColor: '#ffffff',
        }}
      />
    </Stack.Navigator>
  );
}

const Tab = createBottomTabNavigator<RootTabParamList>();

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
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitle: 'Home',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='home-outline' size={25} color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <AntDesign
                name='user'
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
        component={TaskScreen}
        options={({ navigation }) => ({
          headerTitle: 'Plant tasks',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name='book-open-outline' size={25} color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('Profile')}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <AntDesign
                name='user'
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
        component={PlantsScreen}
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
              <AntDesign
                name='user'
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
