import React, { useContext } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BoldText, TransparentView, Text } from '../components/CustomStyled';
import { Foundation, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { getDaysLeft } from '../utils';
import { Context } from '../Context';

export const TaskSection = ({ navigation, taskArr, taskName, taskDone, taskSnooze }: any) => {
  const { colorsCtx } = useContext(Context);
  const [Colors] = colorsCtx;

  const setTaskDone = (task: any) => {
    taskDone(task);
  };

  const setTaskSnooze = (task: any) => {
    taskSnooze(task);
  };

  return (
    <TransparentView style={styles(Colors).taskSection}>
      <TransparentView style={{ flexDirection: 'row' }}>
        <BoldText color={{ Colors }} style={{ fontSize: 18, paddingLeft: 5, textTransform: 'uppercase' }}>
          {taskName}
        </BoldText>
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
            <TouchableOpacity onPress={() => {
                navigation.navigate('Plant', { plantId: task.plantId });
              }}
            >
              <TransparentView style={{ flexDirection: 'row' }}>
                {task.plantImg ? (
                  <Image source={{ uri: task.plantImg }} style={styles(Colors).img} />
                ) : (
                  <Image source={require('../assets/images/1-op.jpg')} style={styles(Colors).img} />
                )}

                <TransparentView style={{ alignSelf: 'center' }}>
                  {taskName === 'Custom' ? (
                    <Text color={{ Colors }} adjustsFontSizeToFit={true} style={{ width: '100%', paddingLeft: 5, alignSelf: 'center', fontSize: 15 }}>
                      {task.taskName + ' ~ ' + task.plantName}
                    </Text>
                  ) : (
                    <Text color={{ Colors }} adjustsFontSizeToFit={true} style={{ width: '100%', paddingLeft: 5, alignSelf: 'center', fontSize: 15 }}>
                      {task.plantName}
                    </Text>
                  )}
                  {getDaysLeft(task.taskDate) > 0 ? (
                    <Text color={{ Colors }} style={{ paddingLeft: 5, fontSize: 13, color: '#5a5a5a' }}>
                      {'(In ' + getDaysLeft(task.taskDate) + ' days)'}
                    </Text>
                  ) : (
                    <Text color={{ Colors }} style={{ paddingLeft: 5, fontSize: 13, color: '#5a5a5a' }}>
                      {'(Now)'}
                    </Text>
                  )}
                </TransparentView>
              </TransparentView>
            </TouchableOpacity>
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

const styles = (Colors: any) =>
  StyleSheet.create({
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
