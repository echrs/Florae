import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BoldText, TransparentView, Text } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { Foundation, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getDaysLeft } from '../utils';

export const TaskSection = ({ taskArr, taskName, taskDone, taskSnooze }: any) => {
  const setTaskDone = (task: any) => {
    taskDone(task);
  };

  const setTaskSnooze = (task: any) => {
    taskSnooze(task);
  };

  return (
    <TransparentView style={styles.taskSection}>
      <TransparentView style={{ flexDirection: 'row' }}>
        <BoldText style={{ fontSize: 18, paddingLeft: 5, textTransform: 'uppercase' }}>{taskName}</BoldText>
        {taskName === 'Water' && <MaterialCommunityIcons style={{ paddingLeft: 2 }} name='watering-can-outline' size={18} color={Colors.text} />}
        {taskName === 'Feed' && <MaterialCommunityIcons style={{ paddingTop: 2 }} name='lightning-bolt' size={15} color={Colors.text} />}
        {taskName === 'Custom' && <Foundation style={{ paddingTop: 3, paddingLeft: 3 }} name='asterisk' size={15} color={Colors.text} />}
      </TransparentView>
      <TransparentView>
        {taskArr?.map((task: any) => (
          <TransparentView
            style={{ marginTop: 7, flexDirection: 'row', justifyContent: 'space-between', overflow: 'hidden' }}
            key={task.taskFieldname + task.plantId}
          >
            <>
              <TransparentView style={{ flexDirection: 'row' }}>
                {task.plantImg ? (
                  <Image source={{ uri: task.plantImg }} style={styles.img} />
                ) : (
                  <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                )}

                <TransparentView style={{ alignSelf: 'center' }}>
                  {taskName === 'Custom' ? (
                    <Text adjustsFontSizeToFit={true} style={{ width: '100%', paddingLeft: 5, alignSelf: 'center', fontSize: 15 }}>
                      {task.taskName + ' ~ ' + task.plantName}
                    </Text>
                  ) : (
                    <Text adjustsFontSizeToFit={true} style={{ width: '100%', paddingLeft: 5, alignSelf: 'center', fontSize: 15 }}>
                      {task.plantName}
                    </Text>
                  )}
                  {getDaysLeft(task.taskDate) > 0 ? (
                    <Text style={{ paddingLeft: 5, fontSize: 13, color: '#5a5a5a' }}>{'(In ' + getDaysLeft(task.taskDate) + ' days)'}</Text>
                  ) : (
                    <Text style={{ paddingLeft: 5, fontSize: 13, color: '#5a5a5a' }}>{'(Now)'}</Text>
                  )}
                </TransparentView>
              </TransparentView>
            </>
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getDaysLeft(task.taskDate) > 0 ? (
                <MaterialIcons name='check-circle' size={26} color={Colors.checkIconInactive} />
              ) : (
                <>
                  <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => setTaskSnooze(task)}>
                    <MaterialCommunityIcons name='bell-sleep-outline' size={24} color={Colors.checkIconActive} />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ marginLeft: 3 }} onPress={() => setTaskDone(task)}>
                    <MaterialIcons name='check-circle' size={26} color={Colors.checkIconActive} />
                  </TouchableOpacity>
                </>
              )}
            </TransparentView>
          </TransparentView>
        ))}
      </TransparentView>
    </TransparentView>
  );
};

const styles = StyleSheet.create({
  img: {
    width: 35,
    height: 35,
    borderRadius: 100,
  },
  taskSection: {
    backgroundColor: Colors.innerSection,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
});
