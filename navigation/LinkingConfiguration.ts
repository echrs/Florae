/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/')],
  config: {
    screens: {
      App: {
        screens: {
          Tabs: {
            screens: {
              HomeTab: {
                screens: {
                  HomeScreen: 'home',
                },
              },
              TasksTab: {
                screens: {
                  TasksScreen: 'tasks',
                },
              },
              PlantsTab: {
                screens: {
                  PlantsScreen: 'plants',
                },
              },
            },
          },
          Profile: 'profile',
        },
      },
      Welcome: 'welcome',
      SignIn: 'signin',
      SignUp: 'signup',
    },
  },
};

export default linking;
