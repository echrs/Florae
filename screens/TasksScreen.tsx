import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, Text } from '../components/CustomStyled';
import { Context } from '../Context';
import { TabsParamList, TasksTabParamList } from '../types';
import { Colors, Tab } from '../constants/Constants';
import { Fontisto, Foundation, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';

type TasksScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<TasksTabParamList, 'Tasks'>, BottomTabScreenProps<TabsParamList>>;

export default function TasksScreen({ navigation, route }: TasksScreenNavigationProp) {
  const { plantsCtx } = useContext(Context);
  const [plants] = plantsCtx;
  const [todayTasks, setTodayTasks] = useState([]);
  const [todayWaterTasks, setTodayWaterTasks] = useState([]);
  const [todayFeedTasks, setTodayFeedTasks] = useState([]);
  const [todayCustomTasks, setTodayCustomTasks] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);
  const [upcomingWaterTasks, setUpcomingWaterTasks] = useState([]);
  const [upcomingFeedTasks, setUpcomingFeedTasks] = useState([]);
  const [upcomingCustomTasks, setUpcomingCustomTasks] = useState([]);
  const [activeTab, setActiveTab] = useState(Tab.today);

  useEffect(() => {
    navigation.addListener('focus', () => {
      setActiveTab(Tab.today);
      getAndSetAllTasks();
    });

    function getAndSetAllTasks() {
      let allTasks = plants.flatMap((plant: any) => {
        return plant.tasks.map((task: any) => {
          return { plantId: plant._id, plantImg: plant.img, plantName: plant.nickname, ...task };
        });
      });
      let todayTasks = allTasks.filter((task: any) => getDaysLeft(task.taskDate) <= 0);
      setTodayTasks(todayTasks);
      let todayWaterTasks = todayTasks.filter((task: any) => task.taskFieldName === 'Water');
      setTodayWaterTasks(todayWaterTasks);
      let todayFeedTasks = todayTasks.filter((task: any) => task.taskFieldName === 'Feed');
      setTodayFeedTasks(todayFeedTasks);
      let todayCustomTasks = todayTasks.filter((task: any) => task.taskFieldName.includes('NewTask'));
      setTodayCustomTasks(todayCustomTasks);
      let upcomingTasks = allTasks.filter((task: any) => getDaysLeft(task.taskDate) != 0);
      setUpcomingTasks(upcomingTasks);
      let upcomingWaterTasks = upcomingTasks.filter((task: any) => task.taskFieldName === 'Water');
      setUpcomingWaterTasks(upcomingWaterTasks);
      let upcomingFeedTasks = upcomingTasks.filter((task: any) => task.taskFieldName === 'Feed');
      setUpcomingFeedTasks(upcomingFeedTasks);
      let upcomingCustomTasks = upcomingTasks.filter((task: any) => task.taskFieldName.includes('NewTask'));
      setUpcomingCustomTasks(upcomingCustomTasks);
      console.log(upcomingCustomTasks);
    }
  }, []);

  useEffect(() => {
    console.log(activeTab);
  }, [activeTab]);

  const getDaysLeft = (date: string) => {
    let taskDate = new Date(date);
    let today = new Date();
    return Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const setTaskDone = (fieldName: string) => {};

  return (
    <SafeAreaView style={styles.container}>
      <TransparentView style={{ width: '90%' }}>
        <ScrollView>
          <TransparentView style={styles.section}>
            <TransparentView style={{ flexDirection: 'row', marginBottom: 10 }}>
              <TouchableOpacity onPress={() => setActiveTab(Tab.today)}>
                <BoldText style={[{ fontSize: 20 }, activeTab === Tab.today ? styles.active : styles.inactive]}>Today's tasks</BoldText>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setActiveTab(Tab.upcoming)}>
                <BoldText style={[{ fontSize: 20, paddingLeft: 5 }, activeTab === Tab.upcoming ? styles.active : styles.inactive]}>
                  Upcoming tasks
                </BoldText>
              </TouchableOpacity>
            </TransparentView>
            {activeTab === Tab.today && (
              <TransparentView>
                {todayWaterTasks.length > 0 && (
                  <TransparentView style={styles.taskSection}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                      <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5 }}>WATER</BoldText>
                    </TransparentView>
                    <TransparentView>
                      {todayWaterTasks?.map((task: any) => (
                        <TouchableOpacity
                          style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
                          key={task.plantId}
                          onPress={() => {}}
                        >
                          <TransparentView style={{ flexDirection: 'row' }}>
                            {task.plantImg ? (
                              <Image source={{ uri: task.plantImg }} style={styles.img} />
                            ) : (
                              <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                            )}
                            <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                          </TransparentView>
                          <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                              <MaterialIcons name='check-circle' size={25} color='#5a5a5a' />
                            </TouchableOpacity>
                          </TransparentView>
                        </TouchableOpacity>
                      ))}
                    </TransparentView>
                  </TransparentView>
                )}
                {todayFeedTasks.length > 0 && (
                  <TransparentView style={styles.taskSection}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                      <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5 }}>FEED</BoldText>
                    </TransparentView>
                    <TransparentView>
                      {todayFeedTasks?.map((task: any) => (
                        <TouchableOpacity
                          style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
                          key={task.plantId}
                          onPress={() => {}}
                        >
                          <TransparentView style={{ flexDirection: 'row' }}>
                            {task.plantImg ? (
                              <Image source={{ uri: task.plantImg }} style={styles.img} />
                            ) : (
                              <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                            )}
                            <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                          </TransparentView>
                          <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                              <MaterialIcons name='check-circle' size={25} color='#5a5a5a' />
                            </TouchableOpacity>
                          </TransparentView>
                        </TouchableOpacity>
                      ))}
                    </TransparentView>
                  </TransparentView>
                )}
                {todayCustomTasks.length > 0 && (
                  <TransparentView style={styles.taskSection}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                      <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5 }}>CUSTOM</BoldText>
                    </TransparentView>
                    <TransparentView>
                      {todayCustomTasks?.map((task: any) => (
                        <TouchableOpacity
                          style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
                          key={task.taskFieldName}
                          onPress={() => {}}
                        >
                          <TransparentView style={{ flexDirection: 'row' }}>
                            {task.plantImg ? (
                              <Image source={{ uri: task.plantImg }} style={styles.img} />
                            ) : (
                              <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                            )}
                            <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                          </TransparentView>
                          <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                              <MaterialIcons name='check-circle' size={25} color='#5a5a5a' />
                            </TouchableOpacity>
                          </TransparentView>
                        </TouchableOpacity>
                      ))}
                    </TransparentView>
                  </TransparentView>
                )}
              </TransparentView>
            )}
            {activeTab === Tab.upcoming && (
              <TransparentView>
                {upcomingWaterTasks.length > 0 && (
                  <TransparentView style={styles.taskSection}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                      <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5, paddingRight: 2 }}>WATER</BoldText>
                      <MaterialCommunityIcons name='watering-can-outline' size={18} color='white' />
                    </TransparentView>
                    <TransparentView>
                      {upcomingWaterTasks?.map((task: any) => (
                        <TouchableOpacity
                          style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
                          key={task.plantId}
                          onPress={() => {}}
                        >
                          <TransparentView style={{ flexDirection: 'row' }}>
                            {task.plantImg ? (
                              <Image source={{ uri: task.plantImg }} style={styles.img} />
                            ) : (
                              <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                            )}
                            <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                            <Text style={{ paddingLeft: 2, alignSelf: 'center', fontSize: 15, color: '#5a5a5a' }}>
                              {'(in ' + getDaysLeft(task.taskDate) + ' days)'}
                            </Text>
                          </TransparentView>
                          <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                              <MaterialIcons name='check-circle' size={25} color='#5a5a5a' />
                            </TouchableOpacity>
                          </TransparentView>
                        </TouchableOpacity>
                      ))}
                    </TransparentView>
                  </TransparentView>
                )}
                {upcomingFeedTasks.length > 0 && (
                  <TransparentView style={styles.taskSection}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                      <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5 }}>FEED</BoldText>
                      <MaterialCommunityIcons style={{ paddingTop: 2 }} name='lightning-bolt' size={15} color='white' />
                    </TransparentView>
                    <TransparentView>
                      {upcomingFeedTasks?.map((task: any) => (
                        <TouchableOpacity
                          style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
                          key={task.plantId}
                          onPress={() => {}}
                        >
                          <TransparentView style={{ flexDirection: 'row' }}>
                            {task.plantImg ? (
                              <Image source={{ uri: task.plantImg }} style={styles.img} />
                            ) : (
                              <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                            )}
                            <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                            <Text style={{ paddingLeft: 2, alignSelf: 'center', fontSize: 15, color: '#5a5a5a' }}>
                              {'(in ' + getDaysLeft(task.taskDate) + ' days)'}
                            </Text>
                          </TransparentView>
                          <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                              <MaterialIcons name='check-circle' size={25} color='#5a5a5a' />
                            </TouchableOpacity>
                          </TransparentView>
                        </TouchableOpacity>
                      ))}
                    </TransparentView>
                  </TransparentView>
                )}
                {upcomingCustomTasks.length > 0 && (
                  <TransparentView style={styles.taskSection}>
                    <TransparentView style={{ flexDirection: 'row' }}>
                      <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5, paddingRight: 2 }}>CUSTOM</BoldText>
                      <Foundation style={{ paddingTop: 3 }} name='asterisk' size={15} color='white' />
                    </TransparentView>
                    <TransparentView>
                      {upcomingCustomTasks?.map((task: any) => (
                        <TouchableOpacity
                          style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
                          key={task.taskFieldName}
                          onPress={() => {}}
                        >
                          <TransparentView style={{ flexDirection: 'row' }}>
                            {task.plantImg ? (
                              <Image source={{ uri: task.plantImg }} style={styles.img} />
                            ) : (
                              <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                            )}
                            <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                            <Text style={{ paddingLeft: 2, alignSelf: 'center', fontSize: 15, color: '#5a5a5a' }}>
                              {'(in ' + getDaysLeft(task.taskDate) + ' days)'}
                            </Text>
                          </TransparentView>
                          <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                              <MaterialIcons name='check-circle' size={25} color={Colors.text} />
                            </TouchableOpacity>
                          </TransparentView>
                        </TouchableOpacity>
                      ))}
                    </TransparentView>
                  </TransparentView>
                )}
              </TransparentView>
            )}
            {todayTasks.length <= 0 && activeTab === Tab.today && <Text>Awesome! No tasks today.</Text>}
            {!upcomingTasks && activeTab === Tab.upcoming && <Text>No upcoming tasks, great!</Text>}
          </TransparentView>
        </ScrollView>
      </TransparentView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  active: { color: '#ffffff' },
  inactive: { color: '#919191' },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  section: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 50,
  },
  taskSection: {
    backgroundColor: '#3D3D3D',
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
  },
});
