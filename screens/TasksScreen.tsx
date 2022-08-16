import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, Text } from '../components/CustomStyled';
import { Context } from '../Context';
import { TabsParamList, TasksTabParamList } from '../types';
import { Colors, Tab } from '../constants/Constants';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TaskSection } from '../components/TaskSection';
import { getDaysLeft, getTodayDate, setDaysAndTime } from '../utils';

type TasksScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<TasksTabParamList, 'Tasks'>, BottomTabScreenProps<TabsParamList>>;

export default function TasksScreen({ navigation, route }: TasksScreenNavigationProp) {
  const { plantsCtx } = useContext(Context);
  const [plants, setPlants] = plantsCtx;
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
    });
  }, []);

  useEffect(() => {
    getAndSetAllTasks();

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
      let upcomingTasks = allTasks.filter((task: any) => getDaysLeft(task.taskDate) > 0 && getDaysLeft(task.taskDate) <= 14);
      setUpcomingTasks(upcomingTasks);
      let upcomingWaterTasks = upcomingTasks.filter((task: any) => task.taskFieldName === 'Water');
      setUpcomingWaterTasks(upcomingWaterTasks);
      let upcomingFeedTasks = upcomingTasks.filter((task: any) => task.taskFieldName === 'Feed');
      setUpcomingFeedTasks(upcomingFeedTasks);
      let upcomingCustomTasks = upcomingTasks.filter((task: any) => task.taskFieldName.includes('NewTask'));
      setUpcomingCustomTasks(upcomingCustomTasks);
    }
  }, [plants]);

  const onDoneTask = (task: any) => {
    let p = plants;
    let plantIdx = p.findIndex((plant: any) => plant._id === task.plantId);
    let taskIdx = p[plantIdx].tasks.findIndex((plantTask: any) => plantTask.taskFieldName === task.taskFieldName);
    let plantTasks = p[plantIdx].tasks;
    let plantTask = plantTasks[taskIdx];
    if (plantTask) {
      plantTasks[taskIdx] = { ...plantTask, lastTaskDate: getTodayDate(), taskDate: setDaysAndTime(task.taskDays, task.taskTime) };
      p[plantIdx] = { ...p[plantIdx], tasks: plantTasks };
      setPlants([...p]);
    }
  };

  const onSnoozeTask = (task: any) => {
    let p = plants;
    let plantIdx = p.findIndex((plant: any) => plant._id === task.plantId);
    let taskIdx = p[plantIdx].tasks.findIndex((plantTask: any) => plantTask.taskFieldName === task.taskFieldName);
    let plantTasks = p[plantIdx].tasks;
    let plantTask = plantTasks[taskIdx];
    if (plantTask) {
      plantTasks[taskIdx] = { ...plantTask, taskDate: setDaysAndTime(1, task.taskTime) };
      p[plantIdx] = { ...p[plantIdx], tasks: plantTasks };
      setPlants([...p]);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TransparentView style={{ width: '90%' }}>
        <ScrollView>
          <TransparentView style={styles.section}>
            <TransparentView style={{ flexDirection: 'row', paddingBottom: 10, justifyContent: 'space-between' }}>
              <TransparentView style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => setActiveTab(Tab.today)}>
                  <BoldText style={[{ fontSize: 20 }, activeTab === Tab.today ? styles.active : styles.inactive]}>Today</BoldText>
                </TouchableOpacity>
                <BoldText style={{ fontSize: 20 }}> / </BoldText>
                <TouchableOpacity onPress={() => setActiveTab(Tab.upcoming)}>
                  <BoldText style={[{ fontSize: 20 }, activeTab === Tab.upcoming ? styles.active : styles.inactive]}>Soon</BoldText>
                </TouchableOpacity>
              </TransparentView>
              <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name='calendar-clock' size={25} color={Colors.text} />
              </TransparentView>
            </TransparentView>
            {activeTab === Tab.today && (
              <TransparentView>
                {todayWaterTasks.length > 0 && (
                  <TaskSection taskDone={onDoneTask} taskSnooze={onSnoozeTask} taskArr={todayWaterTasks} taskName='Water'></TaskSection>
                )}
                {todayFeedTasks.length > 0 && (
                  <TaskSection taskDone={onDoneTask} taskSnooze={onSnoozeTask} taskArr={todayFeedTasks} taskName='Feed'></TaskSection>
                )}
                {todayCustomTasks.length > 0 && (
                  <TaskSection taskDone={onDoneTask} taskSnooze={onSnoozeTask} taskArr={todayCustomTasks} taskName='Custom'></TaskSection>
                )}
              </TransparentView>
            )}
            {activeTab === Tab.upcoming && (
              <TransparentView>
                {upcomingWaterTasks.length > 0 && (
                  <TaskSection taskDone={onDoneTask} taskSnooze={onSnoozeTask} taskArr={upcomingWaterTasks} taskName='Water'></TaskSection>
                )}
                {upcomingFeedTasks.length > 0 && (
                  <TaskSection taskDone={onDoneTask} taskSnooze={onSnoozeTask} taskArr={upcomingFeedTasks} taskName='Feed'></TaskSection>
                )}
                {upcomingCustomTasks.length > 0 && (
                  <TaskSection taskDone={onDoneTask} taskSnooze={onSnoozeTask} taskArr={upcomingCustomTasks} taskName='Custom'></TaskSection>
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
  active: { color: Colors.text },
  inactive: { color: Colors.placeholder },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  section: {
    backgroundColor: Colors.section,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 50,
  },
});
