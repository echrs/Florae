import React from 'react';
import { StyleSheet, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { BoldText, View } from '../components/Themed';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabParamList, TabsParamList } from '../types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { CompositeScreenProps } from '@react-navigation/native';

type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<HomeTabParamList, 'Home'>,
  BottomTabScreenProps<TabsParamList>
>;

export default function HomeScreen({ navigation, route }: HomeScreenNavigationProp) {
  return (
    <View style={styles.container}>
      <BoldText>Home</BoldText>

      <Button
        title='Go to Tasks'
        onPress={() => navigation.jumpTo('TasksTab')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
