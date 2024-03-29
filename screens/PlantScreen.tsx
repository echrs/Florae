import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  KeyboardAvoidingView,
  ToastAndroid,
  ActivityIndicator,
} from 'react-native';
import { BoldText, Text, View, TransparentView, CustomButton } from '../components/CustomStyled';
import { Mode } from '../constants/Constants';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { Controller, useForm } from 'react-hook-form';
import { HomeTabParamList, TabsParamList, Plant } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Context } from '../Context';
import { PickImage } from '../components/PickImage';
import * as FileSystem from 'expo-file-system';
import { plantIdentify } from '../api';
import { getDaysLeft, getTodayDate, setDaysAndTime } from '../utils';

type PlantScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<HomeTabParamList, 'Plant'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantScreen({ navigation, route }: PlantScreenNavigationProp) {
  var ObjectID = require('bson-objectid');
  const [modalVisible, setModalVisible] = useState(false);
  const { height } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;
  const { control, handleSubmit, getValues, setValue, reset } = useForm();
  const [fieldName, setFieldName] = useState('');
  const [nameField, setNameField] = useState('');
  const [nicknameField, setNicknameField] = useState('Plant' + Math.floor(Math.random() * 1000) + 1);
  const [multiline, setMultiline] = useState(false);
  const [notesField, setNotesField] = useState('');
  const { userCtx } = useContext(Context);
  const [user] = userCtx;
  const { plantsCtx } = useContext(Context);
  const [plants, setPlants] = plantsCtx;
  const { colorsCtx } = useContext(Context);
  const [Colors] = colorsCtx;
  const [plant, setPlant] = useState<Plant>();
  const [mode, setMode] = useState(0);
  const [viewImg, setViewImg] = useState('');
  const [taskList, setTaskList] = useState<
    { taskFieldName: string; taskName: any; taskDays: number; taskTime: number; taskDate: any; lastTaskDate: any }[]
  >([]);
  const [isNewTask, setIsNewTask] = useState(false);
  const [taskName, setTaskName] = useState(false);
  const taskListRef = useRef<{ taskFieldName: string; taskName: any; taskDays: number; taskTime: number; taskDate: any; lastTaskDate: any }[]>([]);
  taskListRef.current = taskList;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params) {
      let plant = route.params?.plant;
      let plantId = route.params?.plantId;
      if (plantId) {
        plant = plants.find((plant: Plant) => plant._id === plantId);
      }
      if (plant) {
        setPlant(plant);
        setMode(Mode.view);
        setNicknameField(plant.nickname);
        setNameField(plant.name);
        setNotesField(plant.notes);
        setViewImg(plant.img);
        let tasks = plant.tasks;
        setTaskList(tasks);
      }
    } else {
      setMode(Mode.new);
      if (taskListRef.current.length <= 0) {
        setTaskList([
          {
            taskName: 'Water',
            taskDays: 7,
            taskTime: 12,
            taskDate: setDaysAndTime(7, 12, '', ''),
            lastTaskDate: '',
            taskFieldName: 'Water',
          },
          {
            taskName: 'Feed',
            taskDays: 28,
            taskTime: 12,
            taskDate: setDaysAndTime(28, 12, '', ''),
            lastTaskDate: '',
            taskFieldName: 'Feed',
          },
        ]);
      }
    }
  }, []);

  useEffect(() => {
    if (mode === Mode.view) {
      +navigation.setOptions({
        headerRight: () => (
          <>
            <Pressable
              onPress={() => setMode(Mode.edit)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
              })}
            >
              <BoldText style={{ color: Colors.header }}>EDIT</BoldText>
            </Pressable>
            <Pressable
              onPress={() => deleteCurrPlant()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 15,
              })}
            >
              <BoldText style={{ color: Colors.header }}>DELETE</BoldText>
            </Pressable>
          </>
        ),
        headerTitle: '',
      });
    } else if (mode === Mode.edit || mode === Mode.new) {
      +navigation.setOptions({
        headerRight: () => (
          <>
            <Pressable
              onPress={handleSubmit(onSubmit)}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 15,
              })}
            >
              <BoldText style={{ color: Colors.header }}>SAVE</BoldText>
            </Pressable>
          </>
        ),
      });
    }
  }, [mode]);

  const identifyPlant = async () => {
    let uri = getValues().img || plant?.img;
    if (uri) {
      setIsLoading(true);
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      return plantIdentify(base64, user.token).then(
        async (response) => {
          let identifiedPlant = response.data.suggestions[0];
          if (identifiedPlant.probability >= 0.9) {
            let plantName = identifiedPlant.plant_name;
            let plantNickname = identifiedPlant.plant_details.common_names[0];
            let plantDesc = identifiedPlant.plant_details.wiki_description.value;
            setNicknameField(plantNickname);
            setValue('Nickname', plantNickname);
            setNameField(plantName);
            setValue('Name', plantName);
            setNotesField(plantDesc);
            setValue('Notes', plantDesc);
          } else {
            ToastAndroid.show('Sorry, the plant cannot be identified.', ToastAndroid.SHORT);
          }
          setIsLoading(false);
        },
        (error) => {
          console.log(error);
          ToastAndroid.show('An error occurred. Please try again.', ToastAndroid.SHORT);
          setIsLoading(false);
        }
      );
    } else {
      ToastAndroid.show("There's nothing to identify!", ToastAndroid.SHORT);
    }
  };

  const setTaskDone = (fieldName: string) => {
    let uTaskList = [...taskList];
    let idx = taskList.findIndex((task: any) => task.taskFieldName === fieldName);
    let task = uTaskList[idx];
    if (task) {
      uTaskList[idx] = { ...task, lastTaskDate: getTodayDate(), taskDate: setDaysAndTime(task.taskDays, task.taskTime, '', '') };
      setTaskList(uTaskList);
      let p = plants;
      let pIdx = p.findIndex((x: any) => x._id === plant?._id);
      p[pIdx] = { ...p[pIdx], tasks: uTaskList };
      setPlants([...p]);
    }
  };

  const deleteCurrPlant = () => {
    let p = plants;
    p = p.filter((x: any) => x._id !== plant?._id);
    setPlants([...p]);
    navigation.pop();
  };

  const saveCustomTaskInput = (fieldName: string) => {
    let task = taskList.find((x) => x.taskFieldName === fieldName);
    let nt = fieldName;
    let name = nt + 'Name';
    let taskName = '';
    if (fieldName.includes('NewTask')) {
      taskName = getValues(name)
        ?.replace(/[^a-zA-Z0-9 ]/g, '')
        .trim();
    }
    let days = nt + 'Days';
    let time = nt + 'Time';
    let taskDays = parseInt(getValues(days)) ? parseInt(getValues(days)) : 7;
    let taskTime = parseInt(getValues(time)) >= 0 && parseInt(getValues(time)) <= 23 ? parseInt(getValues(time)) : 12;
    let obj = {
      taskFieldName: nt,
      taskName: taskName?.length ? taskName : task ? task.taskName : 'Task',
      taskDays: taskDays,
      taskTime: taskTime,
      taskDate: setDaysAndTime(
        taskDays === task?.taskDays ? 0 : taskDays,
        taskTime === task?.taskTime ? 0 : taskTime,
        task?.taskDate,
        task?.taskDays
      ),
      lastTaskDate: '',
    };
    if (task) {
      let uTaskList = [...taskList];
      let idx = taskList.findIndex((el) => el.taskFieldName === nt);
      uTaskList[idx] = obj;
      setTaskList(uTaskList);
    } else if (fieldName.includes('NewTask')) {
      setTaskList([...taskList, obj]);
      setIsNewTask(false);
    }
  };

  const deleteCustomTask = (fieldName: string) => {
    let filteredTL = taskList.filter((x) => x.taskFieldName !== fieldName);
    setTaskList(filteredTL);
  };

  const onSubmit = () => {
    var taskArr = [...taskListRef.current];
    var obj = {
      _id: ObjectID().toHexString(),
      name: getValues().Name ? getValues().Name : nameField,
      nickname: getValues().Nickname ? getValues().Nickname : nicknameField,
      notes: getValues().Notes ? getValues().Notes : notesField,
      tasks: taskArr,
      img: getValues().img,
      userId: user.userId,
      dateCreated: new Date().toISOString(),
    };

    if (mode === Mode.new) {
      let p = plants ? plants : [];
      p.push(obj);
      setPlants([...p]);
      navigation.pop();
    } else if (mode === Mode.edit) {
      let p = plants;
      let idx = p.findIndex((el: any) => el._id === plant?._id);
      p[idx] = {
        _id: plant?._id,
        name: obj.name,
        nickname: obj.nickname,
        notes: obj.notes,
        tasks: obj.tasks,
        img: obj.img ? obj.img : p[idx].img,
        userId: obj.userId,
        dateCreated: plant?.dateCreated,
      };
      setPlants([...p]);
      setMode(Mode.view);
    }
    reset();
  };

  const saveInput = (fieldName: string) => {
    switch (fieldName) {
      case 'Nickname':
        if (getValues().Nickname) setNicknameField(getValues().Nickname);
        break;
      case 'Name':
        setNameField(getValues().Name);
        break;
      case 'Notes':
        setNotesField(getValues().Notes);
        break;
    }
  };

  return (
    <>
      <Modal
        style={styles(Colors).view}
        statusBarTranslucent
        deviceHeight={height + statusBarHeight + 5}
        isVisible={modalVisible}
        onBackButtonPress={() => {
          setModalVisible(false);
          setIsNewTask(false);
        }}
        hideModalContentWhileAnimating={true}
        backdropOpacity={0.5}
        useNativeDriver
        avoidKeyboard
      >
        <KeyboardAvoidingView behavior='padding'>
          <TransparentView
            style={{
              alignSelf: 'center',
              backgroundColor: Colors.section,
              width: '100%',
              padding: 30,
              borderRadius: 15,
            }}
          >
            {!fieldName.includes('NewTask') && (
              <BoldText color={{ Colors }} style={{ textTransform: 'uppercase' }}>
                {fieldName}
              </BoldText>
            )}
            {fieldName.includes('NewTask') && !isNewTask && (
              <BoldText color={{ Colors }} style={{ textTransform: 'uppercase' }}>
                {taskName}
              </BoldText>
            )}
            {isNewTask && (
              <Controller
                control={control}
                name={fieldName + 'Name'}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TextInput
                    maxLength={10}
                    multiline={multiline}
                    selectionColor={Colors.button}
                    style={styles(Colors).textInputNew}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
            )}
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {fieldName === 'Water' || fieldName === 'Feed' || fieldName.includes('NewTask') ? (
                <TransparentView style={{ flexDirection: 'row' }}>
                  <Text color={{ Colors }} style={{ marginTop: 10, marginRight: 10 }}>
                    Every
                  </Text>
                  <Controller
                    defaultValue={taskList.find((x) => x.taskFieldName === fieldName)?.taskDays?.toString()}
                    control={control}
                    name={fieldName + 'Days'}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <TextInput
                        defaultValue={fieldName.includes('NewTask') && isNewTask ? '7' : ''}
                        selectionColor={Colors.button}
                        keyboardType='numeric'
                        style={styles(Colors).numInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={2}
                      />
                    )}
                  />
                  <Text color={{ Colors }} style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
                    days @{' '}
                  </Text>
                  <Controller
                    defaultValue={taskList.find((x) => x.taskFieldName === fieldName)?.taskTime?.toString()}
                    control={control}
                    name={fieldName + 'Time'}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <TextInput
                        defaultValue={fieldName.includes('NewTask') && isNewTask ? '12' : ''}
                        selectionColor={Colors.button}
                        keyboardType='numeric'
                        style={styles(Colors).numInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={2}
                      />
                    )}
                  />
                  <Text color={{ Colors }} style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>
                    {' '}
                    h{' '}
                  </Text>
                </TransparentView>
              ) : (
                <Controller
                  defaultValue={fieldName === 'Nickname' ? plant?.nickname : fieldName === 'Name' ? plant?.name : plant?.notes}
                  control={control}
                  name={fieldName}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <TextInput
                      maxLength={fieldName === 'Nickname' ? 15 : fieldName === 'Name' ? 20 : 1000}
                      multiline={multiline}
                      selectionColor={Colors.button}
                      style={styles(Colors).textInput}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                  )}
                />
              )}
              <TransparentView style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    saveInput(fieldName);
                    saveCustomTaskInput(fieldName);
                    setModalVisible(false);
                  }}
                >
                  <MaterialCommunityIcons name='content-save-outline' size={30} color={Colors.text} />
                </TouchableOpacity>
                {fieldName.includes('NewTask') && (
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                      deleteCustomTask(fieldName);
                      setModalVisible(false);
                    }}
                  >
                    <MaterialIcons name='clear' size={30} color={Colors.text} />
                  </TouchableOpacity>
                )}
              </TransparentView>
            </TransparentView>
          </TransparentView>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles(Colors).container}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
          <Controller
            control={control}
            name='img'
            render={({ field: { onChange, value } }) => (
              <PickImage disabled={mode === 2} viewImg={viewImg} isProfile={false} onChange={onChange} value={value} />
            )}
          />
          <TransparentView style={{ width: '90%', marginTop: 20 }}>
            {mode !== Mode.view && (
              <>
                {!isLoading ? (
                  <TouchableOpacity style={styles(Colors).buttonSection} onPress={() => identifyPlant()}>
                    <CustomButton>
                      <BoldText color={{ Colors }}>IDENTIFY PLANT</BoldText>
                      <MaterialIcons name='search' size={17} color={Colors.text} />
                    </CustomButton>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles(Colors).buttonSection} onPress={() => {}}>
                    <CustomButton>
                      <BoldText color={{ Colors }}>IDENTIFY PLANT</BoldText>
                      <ActivityIndicator size={17} color={Colors.text} />
                    </CustomButton>
                  </TouchableOpacity>
                )}
              </>
            )}
            <BoldText color={{ Colors }} style={styles(Colors).headerText}>
              GENERAL INFO
            </BoldText>
            <TouchableOpacity
              disabled={mode === 2}
              style={styles(Colors).section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Nickname');
                setMultiline(false);
              }}
            >
              <CustomButton>
                <BoldText color={{ Colors }}>NICKNAME</BoldText>
                <Text color={{ Colors }}>{nicknameField}</Text>
              </CustomButton>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={mode === 2}
              style={styles(Colors).section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Name');
                setMultiline(false);
              }}
            >
              <CustomButton>
                <BoldText color={{ Colors }}>NAME</BoldText>
                <Text color={{ Colors }}>{nameField}</Text>
              </CustomButton>
            </TouchableOpacity>
            <BoldText color={{ Colors }} style={styles(Colors).headerText}>
              TASKS
            </BoldText>
            {mode === Mode.view && (
              <>
                {taskList &&
                  taskList?.map((task) => (
                    <TransparentView key={task.taskFieldName} style={styles(Colors).viewSection}>
                      <TransparentView style={{ flexDirection: 'row' }}>
                        <BoldText color={{ Colors }} style={{ paddingLeft: 5, textTransform: 'uppercase' }}>
                          {task.taskName}
                        </BoldText>
                        {task.lastTaskDate ? (
                          <Text color={{ Colors }} style={{ alignSelf: 'center', paddingLeft: 2, fontSize: 10, color: '#5a5a5a' }}>
                            (Last done: {new Date(task.lastTaskDate).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })})
                          </Text>
                        ) : (
                          <Text color={{ Colors }} style={{ alignSelf: 'center', paddingLeft: 2, fontSize: 10, color: '#5a5a5a' }}>
                            (Last done: Never)
                          </Text>
                        )}
                      </TransparentView>
                      <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {getDaysLeft(task.taskDate) === 0 && (
                          <>
                            <Text color={{ Colors }} style={{ marginRight: 5 }}>
                              Now
                            </Text>
                            <TouchableOpacity
                              style={{ marginLeft: 5 }}
                              onPress={() => {
                                setTaskDone(task.taskFieldName);
                              }}
                            >
                              <MaterialIcons name='check-circle' size={25} color={Colors.checkIconActive} />
                            </TouchableOpacity>
                          </>
                        )}
                        {getDaysLeft(task.taskDate) < 0 && (
                          <>
                            <Text color={{ Colors }} style={{ marginRight: 5 }}>
                              {getDaysLeft(task.taskDate) === -1
                                ? 'Overdue ' + getDaysLeft(task.taskDate) * -1 + ' day'
                                : 'Overdue ' + getDaysLeft(task.taskDate) * -1 + ' days'}
                            </Text>
                            <TouchableOpacity
                              style={{ marginLeft: 5 }}
                              onPress={() => {
                                setTaskDone(task.taskFieldName);
                              }}
                            >
                              <MaterialIcons name='check-circle' size={25} color={Colors.checkIconActive} />
                            </TouchableOpacity>
                          </>
                        )}
                        {getDaysLeft(task.taskDate) > 0 && (
                          <>
                            <Text color={{ Colors }} style={{ marginRight: 5 }}>
                              {getDaysLeft(task.taskDate) === 1
                                ? 'In ' + getDaysLeft(task.taskDate) + ' day'
                                : 'In ' + getDaysLeft(task.taskDate) + ' days'}
                            </Text>
                            <MaterialIcons style={{ marginLeft: 5 }} name='check-circle' size={25} color={Colors.checkIconInactive} />
                          </>
                        )}
                      </TransparentView>
                    </TransparentView>
                  ))}
              </>
            )}
            {mode !== Mode.view && (
              <>
                {taskList &&
                  taskList?.map((task) => (
                    <TouchableOpacity
                      key={task.taskFieldName}
                      style={styles(Colors).section}
                      onPress={() => {
                        setModalVisible(true);
                        setFieldName(task.taskFieldName);
                        setTaskName(task.taskName);
                        setMultiline(false);
                      }}
                    >
                      <CustomButton>
                        <BoldText color={{ Colors }} style={{ textTransform: 'uppercase' }}>
                          {task.taskName}
                        </BoldText>
                        <Text color={{ Colors }}>
                          Every {task.taskDays} days @ {task.taskTime}h
                        </Text>
                      </CustomButton>
                    </TouchableOpacity>
                  ))}
                {mode !== Mode.view && (
                  <TouchableOpacity
                    style={styles(Colors).buttonSection}
                    onPress={() => {
                      setModalVisible(true);
                      setMultiline(false);
                      setFieldName('NewTask' + taskListRef.current.length);
                      setIsNewTask(true);
                    }}
                  >
                    <CustomButton>
                      <BoldText color={{ Colors }}>ADD TASK</BoldText>
                      <MaterialCommunityIcons name='plus' size={17} color={Colors.text} />
                    </CustomButton>
                  </TouchableOpacity>
                )}
              </>
            )}
            <BoldText color={{ Colors }} style={styles(Colors).headerText}>
              NOTES
            </BoldText>
            <TouchableOpacity
              disabled={mode === 2}
              style={styles(Colors).section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Notes');
                setMultiline(true);
              }}
            >
              <Text color={{ Colors }} style={{ textAlign: 'justify' }}>
                {notesField ? notesField : 'Currently there are no notes.'}
              </Text>
            </TouchableOpacity>
          </TransparentView>
        </ScrollView>
      </View>
    </>
  );
}

const styles = (Colors: any) =>
  StyleSheet.create({
    view: {
      justifyContent: 'flex-end',
      margin: 0,
    },
    textInputNew: {
      color: Colors.text,
      width: '70%',
      borderColor: Colors.text,
      borderBottomWidth: 1,
      fontFamily: 'inter-bold',
    },
    textInput: {
      color: Colors.text,
      width: '80%',
      borderColor: Colors.text,
      borderBottomWidth: 1,
    },
    numInput: {
      color: Colors.text,
      width: '10%',
      borderColor: Colors.text,
      borderBottomWidth: 1,
      marginVertical: 5,
      textAlign: 'center',
    },
    container: {
      backgroundColor: Colors.background,
      flex: 1,
      alignItems: 'center',
    },
    headerText: {
      fontSize: 20,
      paddingTop: 10,
      paddingBottom: 5,
    },
    section: {
      backgroundColor: Colors.section,
      padding: 15,
      borderRadius: 15,
      marginBottom: 5,
    },
    viewSection: {
      backgroundColor: Colors.section,
      padding: 10,
      borderRadius: 15,
      marginBottom: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    buttonSection: {
      backgroundColor: Colors.button,
      padding: 15,
      borderRadius: 15,
      marginBottom: 5,
    },
  });
