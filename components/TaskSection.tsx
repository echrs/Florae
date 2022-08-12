import React from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BoldText, TransparentView, Text } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { Foundation, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

export const TaskSection = ({ taskArr, taskName }: any) => {
  const getDaysLeft = (date: string) => {
    let taskDate = new Date(date);
    let today = new Date();
    return Math.round((taskDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const setTaskDone = (fieldName: string) => {};

  return (
    <TransparentView style={styles.taskSection}>
      <TransparentView style={{ flexDirection: 'row' }}>
        <BoldText style={{ fontSize: 18, paddingBottom: 7, paddingLeft: 5, textTransform: 'uppercase' }}>{taskName}</BoldText>
        {taskName === 'Water' && <MaterialCommunityIcons style={{ paddingLeft: 2 }} name='watering-can-outline' size={18} color={Colors.text} />}
        {taskName === 'Feed' && <MaterialCommunityIcons style={{ paddingTop: 2 }} name='lightning-bolt' size={15} color='white' />}
        {taskName === 'Custom' && <Foundation style={{ paddingTop: 3, paddingLeft: 3 }} name='asterisk' size={15} color='white' />}
      </TransparentView>
      <TransparentView>
        {taskArr?.map((task: any) => (
          <TransparentView
            style={{ marginBottom: 5, flexDirection: 'row', justifyContent: 'space-between' }}
            key={task.taskFieldname + task.plantId}
          >
            <TouchableOpacity onPress={() => {}}>
              <TransparentView style={{ flexDirection: 'row' }}>
                {task.plantImg ? (
                  <Image source={{ uri: task.plantImg }} style={styles.img} />
                ) : (
                  <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                )}
                <Text style={{ paddingLeft: 5, alignSelf: 'center', fontSize: 15 }}>{task.plantName}</Text>
                {getDaysLeft(task.taskDate) > 0 && (
                  <Text style={{ paddingLeft: 2, alignSelf: 'center', fontSize: 15, color: '#5a5a5a' }}>
                    {'(in ' + getDaysLeft(task.taskDate) + ' days)'}
                  </Text>
                )}
              </TransparentView>
            </TouchableOpacity>
            <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getDaysLeft(task.taskDate) > 0 ? (
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                  <MaterialIcons name='check-circle' size={25} color='#5a5a5a' />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => {}}>
                  <MaterialIcons name='check-circle' size={25} color='#ffffff' />
                </TouchableOpacity>
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
    width: 30,
    height: 30,
    borderRadius: 100,
  },
  taskSection: {
    backgroundColor: '#3D3D3D',
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
  },
});
