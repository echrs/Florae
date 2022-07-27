import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BoldText, TransparentView, Text, SafeAreaView } from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabParamList, TabsParamList } from '../types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

import type { CompositeScreenProps } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { Colors } from '../constants/Constants';

type HomeScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<HomeTabParamList, 'Home'>, BottomTabScreenProps<TabsParamList>>;

export default function HomeScreen({ navigation, route }: HomeScreenNavigationProp) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    navigation.addListener('focus', () => {
      getTime();
    });
    async function getTime() {
      var time = new Date();
      let hour = time.getHours();
      switch (true) {
        case hour < 6:
          setTimeStr('night');
          break;
        case hour < 12:
          setTimeStr('morning');
          break;
        case hour < 18:
          setTimeStr('afternoon');
          break;
        case hour < 21:
          setTimeStr('evening');
          break;
        case hour < 23:
          setTimeStr('night');
          break;
      }
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TransparentView style={{ width: '90%' }}>
          <BoldText style={{ alignSelf: 'flex-start', paddingBottom: 20, fontSize: 36 }}>Good {timeStr}!</BoldText>
          <TouchableOpacity
            style={styles.tasks}
            onPress={() => {
              navigation.jumpTo('TasksTab');
            }}
          >
            <BoldText style={{ fontSize: 20 }}>Plant tasks</BoldText>
            <Text style={{ paddingTop: 5 }}>Are your plants happy?</Text>
            <BoldText style={{ paddingTop: 30 }}>100%</BoldText>
            <ProgressBar style={{ marginBottom: 5 }} progress={1} color={Colors.button} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.plants}
            onPress={() => {
              navigation.jumpTo('PlantsTab');
            }}
          >
            <BoldText style={{ fontSize: 20 }}>Latest plants</BoldText>
            <TransparentView style={{ flexDirection: 'row', paddingTop: 5 }}>
              <Text>There are currently none!</Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('NewPlant');
                }}
              >
                <BoldText style={{ paddingLeft: 5 }}>Add one now.</BoldText>
              </TouchableOpacity>
            </TransparentView>
          </TouchableOpacity>
        </TransparentView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  tasks: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 15,
  },
  plants: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
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
