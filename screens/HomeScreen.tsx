import React, { useContext, useEffect, useState } from 'react';
import { Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BoldText, TransparentView, Text, SafeAreaView } from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabParamList, TabsParamList } from '../types';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';
import { ProgressBar } from 'react-native-paper';
import { Context } from '../Context';
import { getDaysLeft } from '../utils';

type HomeScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<HomeTabParamList, 'Home'>, BottomTabScreenProps<TabsParamList>>;

export default function HomeScreen({ navigation, route }: HomeScreenNavigationProp) {
  const [timeStr, setTimeStr] = useState('');
  const { plantsCtx } = useContext(Context);
  const [plants] = plantsCtx;
  const { colorsCtx } = useContext(Context);
  const [Colors] = colorsCtx;
  const [percentage, setPercentage] = useState(1);
  const [updatedPlants, setUpdatedPlants] = useState([]);

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

  useEffect(() => {
    calcPercentage();

    function calcPercentage() {
      let todayTotalTasks = plants.flatMap((plant: any) => {
        return plant.tasks.filter((task: any) => getDaysLeft(task.taskDate) <= 0 || getDaysLeft(task.lastTaskDate) === 0);
      });
      let todayUndoneTasks = plants.flatMap((plant: any) => {
        return plant.tasks.filter((task: any) => getDaysLeft(task.lastTaskDate) === 0);
      });
      if (todayTotalTasks.length != 0 || todayUndoneTasks.length != 0) setPercentage(todayUndoneTasks.length / todayTotalTasks.length);
    }

    setUpdatedPlants(plants);
  }, [plants]);

  return (
    <>
      <SafeAreaView style={styles(Colors).container}>
        <TransparentView style={{ width: '90%' }}>
          <ScrollView>
            <BoldText color={{ Colors }} style={{ alignSelf: 'flex-start', paddingBottom: 20, fontSize: 36 }}>
              Good {timeStr}!
            </BoldText>
            <TouchableOpacity
              style={styles(Colors).tasks}
              onPress={() => {
                navigation.jumpTo('TasksTab');
              }}
            >
              <BoldText color={{ Colors }} style={{ fontSize: 20 }}>
                Plant tasks
              </BoldText>
              <Text color={{ Colors }} style={{ paddingTop: 5 }}>
                Are your plants happy?
              </Text>
              <BoldText color={{ Colors }} style={{ paddingTop: 30 }}>
                {percentage === 0 ? 0 : (percentage * 100).toFixed(0) || 100}%
              </BoldText>
              <ProgressBar style={{ marginBottom: 5 }} progress={percentage === 0 ? 0 : percentage || 1} color={Colors.button} />
            </TouchableOpacity>
            <TransparentView style={styles(Colors).plants}>
              <BoldText color={{ Colors }} style={{ fontSize: 20 }}>
                Latest plants
              </BoldText>
              {(!updatedPlants || !updatedPlants.length) && (
                <TransparentView style={{ flexDirection: 'row', paddingTop: 5 }}>
                  <Text color={{ Colors }}>There are currently none!</Text>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('Plant');
                    }}
                  >
                    <BoldText color={{ Colors }} style={{ paddingLeft: 5 }}>
                      Add one now.
                    </BoldText>
                  </TouchableOpacity>
                </TransparentView>
              )}
              <TransparentView style={{ flexDirection: 'row', paddingTop: 10, flexWrap: 'wrap' }}>
                {updatedPlants &&
                  updatedPlants?.slice(0, 4).map((plant: any) => (
                    <TouchableOpacity
                      key={plant._id}
                      style={styles(Colors).plant}
                      onPress={() => {
                        navigation.navigate('Plant', { plant: plant });
                      }}
                    >
                      <TransparentView style={{}}>
                        {plant.img ? (
                          <Image source={{ uri: plant.img }} style={styles(Colors).img} />
                        ) : (
                          <Image source={require('../assets/images/1-op.jpg')} style={styles(Colors).img} />
                        )}
                        <Text color={{ Colors }} style={{ fontSize: 15 }}>
                          {plant.nickname}
                        </Text>
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

const styles = (Colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: Colors.background,
      flex: 1,
      alignItems: 'center',
      paddingTop: 60,
    },
    tasks: {
      backgroundColor: Colors.section,
      padding: 20,
      borderRadius: 15,
    },
    plant: {
      backgroundColor: Colors.innerSection,
      padding: 10,
      borderRadius: 15,
      marginBottom: 5,
      marginRight: 5,
      width: '48.4%',
    },
    img: {
      width: '100%',
      height: 100,
      borderRadius: 5,
    },
    plants: {
      backgroundColor: Colors.section,
      padding: 20,
      borderRadius: 15,
      marginTop: 20,
      marginBottom: 50,
    },
  });
