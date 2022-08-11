import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, Text } from '../components/CustomStyled';
import { Context } from '../Context';
import { TabsParamList, TasksTabParamList } from '../types';
import { Colors, Tab } from '../constants/Constants';
import { Foundation, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { TaskSection } from '../components/TaskSection';

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
      console.log('here');
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
                {todayWaterTasks.length > 0 && <TaskSection taskArr={todayWaterTasks} taskName='Water'></TaskSection>}
                {todayFeedTasks.length > 0 && <TaskSection taskArr={todayFeedTasks} taskName='Feed'></TaskSection>}
                {todayCustomTasks.length > 0 && <TaskSection taskArr={todayCustomTasks} taskName='Custom'></TaskSection>}
              </TransparentView>
            )}
            {activeTab === Tab.upcoming && (
              <TransparentView>
                {upcomingWaterTasks.length > 0 && <TaskSection taskArr={upcomingWaterTasks} taskName='Water'></TaskSection>}
                {upcomingFeedTasks.length > 0 && <TaskSection taskArr={upcomingFeedTasks} taskName='Feed'></TaskSection>}
                {upcomingCustomTasks.length > 0 && <TaskSection taskArr={upcomingCustomTasks} taskName='Custom'></TaskSection>}
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
});
