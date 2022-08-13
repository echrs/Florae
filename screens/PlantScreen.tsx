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
import { Colors, Mode } from '../constants/Constants';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { Controller, useForm } from 'react-hook-form';
import { HomeTabParamList, TabsParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { Context } from '../Context';
import { PickImage } from '../components/PickImage';
import * as FileSystem from 'expo-file-system';
import { plantIdentify } from '../api';
import { getDaysLeft, setDaysAndTime } from '../utils';

type PlantScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<HomeTabParamList, 'Plant'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantScreen({ navigation, route }: PlantScreenNavigationProp) {
  var ObjectID = require('bson-objectid');
  const [modalVisible, setModalVisible] = useState(false);
  const { height } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;
  const { control, handleSubmit, getValues, setValue } = useForm();
  const [fieldName, setFieldName] = useState('');
  const [nameField, setNameField] = useState('');
  const [nicknameField, setNicknameField] = useState('Plant' + Math.floor(Math.random() * 1000) + 1);
  const [multiline, setMultiline] = useState(false);
  const [notesField, setNotesField] = useState('');
  const { userCtx } = useContext(Context);
  const [user] = userCtx;
  const { plantsCtx } = useContext(Context);
  const [plants, setPlants] = plantsCtx;
  const [plant, setPlant] = useState({} as any);
  const [mode, setMode] = useState(0);
  const [viewImg, setViewImg] = useState('');
  const [taskList, setTaskList] = useState<{ taskFieldName: string; taskName: any; taskDays: number; taskTime: number; taskDate: any, lastTaskDate: any }[]>([]);
  const [isNewTask, setIsNewTask] = useState(false);
  const [taskName, setTaskName] = useState(false);
  const taskListRef = useRef<{ taskFieldName: string; taskName: any; taskDays: number; taskTime: number; taskDate: any, lastTaskDate: any }[]>([]);
  taskListRef.current = taskList;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (route.params?.plant) {
      let plant = route.params?.plant;
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
            taskDate: setDaysAndTime(7, 12),
            lastTaskDate: '',
            taskFieldName: 'Water',
          },
          {
            taskName: 'Feed',
            taskDays: 28,
            taskTime: 12,
            taskDate: setDaysAndTime(28, 12),
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
              <BoldText>EDIT</BoldText>
            </Pressable>
            <Pressable
              onPress={() => deleteCurrPlant()}
              style={({ pressed }) => ({
                opacity: pressed ? 0.5 : 1,
                marginLeft: 15,
              })}
            >
              <BoldText>DELETE</BoldText>
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
              <BoldText>SAVE</BoldText>
            </Pressable>
          </>
        ),
      });
    }
  }, [mode]);

  const identifyPlant = async () => {
    let uri = getValues().img || plant.img;
    if (uri) {
      setIsLoading(true);
      const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
      return plantIdentify(base64).then(
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
      uTaskList[idx] = { ...task, lastTaskDate: task.taskDate, taskDate: setDaysAndTime(task.taskDays, task.taskTime) };
      setTaskList(uTaskList);
      let p = plants;
      let pIdx = p.findIndex((x: any) => x._id === plant._id);
      p[pIdx] = { ...p[pIdx], tasks: uTaskList };
      setPlants([...p]);
    }
  };

  const deleteCurrPlant = () => {
    let p = plants;
    p = p.filter((x: any) => x._id !== plant._id);
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
    let taskDays = parseInt(getValues(days)) > 0 ? parseInt(getValues(days)) : 7;
    let taskTime = parseInt(getValues(time)) >= 0 && parseInt(getValues(time)) <= 23 ? parseInt(getValues(time)) : 12;
    let obj = {
      taskFieldName: nt,
      taskName: taskName?.length ? taskName : task ? task.taskName : 'Task',
      taskDays: taskDays,
      taskTime: taskTime,
      taskDate: setDaysAndTime(taskDays, taskTime),
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
    };

    if (mode === Mode.new) {
      let p = plants ? plants : [];
      p.push(obj);
      setPlants([...p]);
      navigation.pop();
    } else if (mode === Mode.edit) {
      let p = plants;
      let idx = p.findIndex((el: any) => el._id === plant._id);
      p[idx] = {
        __v: 0,
        _id: plant._id,
        name: obj.name,
        nickname: obj.nickname,
        notes: obj.notes,
        tasks: obj.tasks,
        img: obj.img ? obj.img : p[idx].img,
        userId: obj.userId
      };
      setPlants([...p]);
      setMode(Mode.view);
    }
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
        style={styles.view}
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
              backgroundColor: Colors.modal,
              width: '100%',
              padding: 30,
              borderRadius: 15,
            }}
          >
            {!fieldName.includes('NewTask') && <BoldText style={{ textTransform: 'uppercase' }}>{fieldName}</BoldText>}
            {fieldName.includes('NewTask') && !isNewTask && <BoldText style={{ textTransform: 'uppercase' }}>{taskName}</BoldText>}
            {isNewTask && (
              <Controller
                control={control}
                name={fieldName + 'Name'}
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TextInput
                    multiline={multiline}
                    selectionColor={Colors.button}
                    style={styles.textInputNew}
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
                  <Text style={{ marginTop: 10, marginRight: 10 }}>Every</Text>
                  <Controller
                    control={control}
                    name={fieldName + 'Days'}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <TextInput
                        defaultValue={fieldName.includes('NewTask') && isNewTask ? '7' : ''}
                        selectionColor={Colors.button}
                        keyboardType='numeric'
                        style={styles.numInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={2}
                      />
                    )}
                  />
                  <Text style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}>days @ </Text>
                  <Controller
                    control={control}
                    name={fieldName + 'Time'}
                    render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                      <TextInput
                        defaultValue={fieldName.includes('NewTask') && isNewTask ? '12' : ''}
                        selectionColor={Colors.button}
                        keyboardType='numeric'
                        style={styles.numInput}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        maxLength={2}
                      />
                    )}
                  />
                  <Text style={{ marginTop: 10, marginRight: 10, marginLeft: 10 }}> h </Text>
                </TransparentView>
              ) : (
                <Controller
                  control={control}
                  name={fieldName}
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <TextInput
                      multiline={multiline}
                      selectionColor={Colors.button}
                      style={styles.textInput}
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
                  <MaterialCommunityIcons name='content-save-outline' size={30} color='white' />
                </TouchableOpacity>
                {fieldName.includes('NewTask') && (
                  <TouchableOpacity
                    style={{ marginLeft: 10 }}
                    onPress={() => {
                      deleteCustomTask(fieldName);
                      setModalVisible(false);
                    }}
                  >
                    <MaterialIcons name='clear' size={30} color='white' />
                  </TouchableOpacity>
                )}
              </TransparentView>
            </TransparentView>
          </TransparentView>
        </KeyboardAvoidingView>
      </Modal>
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
          }}
        >
          <Controller
            control={control}
            name='img'
            render={({ field: { onChange, value } }) => <PickImage disabled={mode === 2} viewImg={viewImg} onChange={onChange} value={value} />}
          />
          <TransparentView style={{ width: '90%', marginTop: 20 }}>
            {mode !== Mode.view && (
              <>
                {!isLoading ? (
                  <TouchableOpacity style={styles.buttonSection} onPress={() => identifyPlant()}>
                    <CustomButton>
                      <BoldText>IDENTIFY PLANT</BoldText>
                      <MaterialIcons name='search' size={17} color={Colors.text} />
                    </CustomButton>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={styles.buttonSection} onPress={() => {}}>
                    <CustomButton>
                      <BoldText>IDENTIFY PLANT</BoldText>
                      <ActivityIndicator size={17} color='white' />
                    </CustomButton>
                  </TouchableOpacity>
                )}
              </>
            )}
            <BoldText style={styles.headerText}>GENERAL INFO</BoldText>
            <TouchableOpacity
              disabled={mode === 2}
              style={styles.section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Nickname');
                setMultiline(false);
              }}
            >
              <CustomButton>
                <BoldText>NICKNAME</BoldText>
                <Text>{nicknameField}</Text>
              </CustomButton>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={mode === 2}
              style={styles.section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Name');
                setMultiline(false);
              }}
            >
              <CustomButton>
                <BoldText>NAME</BoldText>
                <Text>{nameField}</Text>
              </CustomButton>
            </TouchableOpacity>
            <BoldText style={styles.headerText}>TASKS</BoldText>
            {mode === Mode.view && (
              <>
                {taskList &&
                  taskList?.map((task) => (
                    <TransparentView key={task.taskFieldName} style={styles.viewSection}>
                      <TransparentView style={{ flexDirection: 'row' }}>
                        <BoldText style={{ paddingLeft: 5, textTransform: 'uppercase' }}>{task.taskName}</BoldText>
                      </TransparentView>
                      <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                        {getDaysLeft(task.taskDate) <= 0 ? (
                          <>
                            <Text style={{ marginRight: 5 }}>Now</Text>
                            <TouchableOpacity
                              style={{ marginLeft: 5 }}
                              onPress={() => {
                                setTaskDone(task.taskFieldName);
                              }}
                            >
                              <MaterialIcons name='check-circle' size={25} color={Colors.text} />
                            </TouchableOpacity>
                          </>
                        ) : (
                          <>
                            <Text style={{ marginRight: 5 }}>In {getDaysLeft(task.taskDate)} days</Text>
                            <MaterialIcons style={{ marginLeft: 5 }} name='check-circle' size={25} color='#474747' />
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
                      style={styles.section}
                      onPress={() => {
                        setModalVisible(true);
                        setFieldName(task.taskFieldName);
                        setTaskName(task.taskName);
                        setMultiline(false);
                      }}
                    >
                      <CustomButton>
                        <BoldText style={{ textTransform: 'uppercase' }}>{task.taskName}</BoldText>
                        <Text>
                          Every {task.taskDays} days @ {task.taskTime}h
                        </Text>
                      </CustomButton>
                    </TouchableOpacity>
                  ))}
                {mode !== Mode.view && (
                  <TouchableOpacity
                    style={styles.buttonSection}
                    onPress={() => {
                      setModalVisible(true);
                      setMultiline(false);
                      setFieldName('NewTask' + taskListRef.current.length);
                      setIsNewTask(true);
                    }}
                  >
                    <CustomButton>
                      <BoldText>ADD TASK</BoldText>
                      <MaterialCommunityIcons name='plus' size={17} color={Colors.text} />
                    </CustomButton>
                  </TouchableOpacity>
                )}
              </>
            )}
            <BoldText style={styles.headerText}>NOTES</BoldText>
            <TouchableOpacity
              disabled={mode === 2}
              style={styles.section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Notes');
                setMultiline(true);
              }}
            >
              <Text style={{ textAlign: 'justify' }}>{notesField ? notesField : 'Currently there are no notes.'}</Text>
            </TouchableOpacity>
          </TransparentView>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  textInputNew: {
    color: '#ffffff',
    width: '70%',
    borderColor: '#ffffff',
    borderBottomWidth: 1,
    fontFamily: 'inter-bold',
  },
  textInput: {
    color: '#ffffff',
    width: '80%',
    borderColor: '#ffffff',
    borderBottomWidth: 1,
  },
  numInput: {
    color: '#ffffff',
    width: '10%',
    borderColor: '#ffffff',
    borderBottomWidth: 1,
    marginVertical: 5,
    textAlign: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  section: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 15,
    marginBottom: 5,
  },
  viewSection: {
    backgroundColor: '#333333',
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonSection: {
    backgroundColor: '#1D4D47',
    padding: 15,
    borderRadius: 15,
    marginBottom: 5,
  },
});
