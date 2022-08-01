import React, { useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BoldText, TransparentView, Text, SafeAreaView } from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabParamList, TabsParamList } from '../types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { Colors } from '../constants/Constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

type HomeScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<HomeTabParamList, 'Home'>, BottomTabScreenProps<TabsParamList>>;

export default function HomeScreen({ navigation, route }: HomeScreenNavigationProp) {
  const [timeStr, setTimeStr] = useState('');
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    navigation.addListener('focus', () => {
      getTime();
      getAndSetPlants();
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
    async function getAndSetPlants() {
      let plantsStorage = await AsyncStorage.getItem('plants');
      setPlants(JSON.parse(plantsStorage));
    }
  }, []);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <TransparentView style={{ width: '90%' }}>
          <ScrollView>
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
            <TransparentView style={styles.plants}>
              <BoldText style={{ fontSize: 20 }}>Latest plants</BoldText>
              {!plants && (
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
              )}
              <TransparentView style={{ flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}>
                {plants &&
                  plants?.slice(Math.max(plants.length - 4, 0)).map(({ _id, nickname, img }) => (
                    <TouchableOpacity key={_id} style={styles.plant} onPress={() => {}}>
                      <TransparentView style={{}}>
                        {img ? (
                          <Image source={{ uri: img }} style={styles.img} />
                        ) : (
                          <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                        )}
                        <Text style={{ fontSize: 15 }}>{nickname}</Text>
                      </TransparentView>
                    </TouchableOpacity>
                  ))}
              </TransparentView>
            </TransparentView>
          </ScrollView>
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
  plant: {
    backgroundColor: '#3D3D3D',
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    marginRight: 5,
    width: '48.4%',
  },
  img: {
    width: '100%',
    height: 100,
  },
  plants: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 50,
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
