import { FontAwesome, AntDesign } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import TaskScreen from '../screens/TasksScreen';
import PlantsScreen from '../screens/PlantsScreen';
import {
  RootStackParamList,
  RootTabParamList,
} from '../types';
import LinkingConfiguration from './LinkingConfiguration';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Pressable } from 'react-native';
import Fonts from '../constants/Fonts';

export default function Navigation() {
  return (
    <NavigationContainer linking={LinkingConfiguration}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name='Root'
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

const BottomTab = createBottomTabNavigator<RootTabParamList>();

function BottomTabNavigator() {
  return (
    <BottomTab.Navigator
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
      <BottomTab.Screen
        name='HomeTab'
        component={HomeScreen}
        options={({ navigation }) => ({
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => <TabBarIcon name='home' color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('ProfileScreen')}
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
      <BottomTab.Screen
        name='TasksTab'
        component={TaskScreen}
        options={({ navigation }) => ({
          headerTitle: 'Plant tasks',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => (
            <TabBarIcon name='pluscircleo' color={color} />
          ),
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('ProfileScreen')}
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
      <BottomTab.Screen
        name='PlantsTab'
        component={PlantsScreen}
        options={({ navigation }) => ({
          headerTitle: 'Plant library',
          headerTitleStyle: { color: Colors.text, fontFamily: Fonts.bold },
          tabBarActiveTintColor: Colors.text,
          tabBarIcon: ({ color }) => <TabBarIcon name='book' color={color} />,
          headerRight: () => (
            <Pressable
              onPress={() => navigation.navigate('ProfileScreen')}
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
    </BottomTab.Navigator>
  );
}

function TabBarIcon(props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
}) {
  return <AntDesign size={25} {...props} />;
}
