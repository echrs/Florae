import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Switch,
  KeyboardAvoidingView,
  TextInput,
  useWindowDimensions,
  ActivityIndicator,
} from 'react-native';
import { editUser, logout, syncPlants } from '../api';
import { BoldText, SafeAreaView, TransparentView, Text } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { Context } from '../Context';
import NetInfo from '@react-native-community/netinfo';
import { Controller, useForm } from 'react-hook-form';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { EMAIL_REGEX } from '../utils';
import { PickImage } from '../components/PickImage';

export default function ProfileScreen() {
  const { plantsCtx } = useContext(Context);
  const [plants, setPlants] = plantsCtx;
  const { userCtx } = useContext(Context);
  const [user, setUser] = userCtx;
  const [enableDarkTheme, setEnableDarkTheme] = useState(false);
  const [enableNotif, setEnableNotif] = useState(false);
  const { control, handleSubmit, getValues, watch, reset } = useForm();
  const { height } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;
  const [modalVisible, setModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passChange, setPassChange] = useState(false);
  const pass = watch('password');
  const [viewImg, setViewImg] = useState('');
  const toggleTheme = () => setEnableDarkTheme((previousState) => !previousState);
  const toggleNotifications = () => setEnableNotif((previousState) => !previousState);
  const userRef = useRef('');
  userRef.current = user;

  useEffect(() => {
    if (user.img) {
      setViewImg(user.img);
    }
  }, []);

  const signOut = () => {
    logout();
    setUser('');
    setPlants('');
  };

  const syncWDB = async () => {
    var plants = await AsyncStorage.getItem('plants');
    let netInfo = await NetInfo.fetch();
    if (plants?.length) {
      if (netInfo.isConnected) {
        setIsLoading(true);
        return syncPlants(JSON.parse(plants), user.token).then(
          async (response) => {
            setIsLoading(false);
            return response.data;
          },
          (error) => {
            console.log(error);
            setIsLoading(false);
          }
        );
      } else {
        return JSON.parse(plants);
      }
    }
  };

  const onSubmit = async () => {
    if (passChange) {
      let pass = getValues().Password;
      let confirmPass = getValues().ConfirmPassword;
      if (pass && confirmPass) {
        let netInfo = await NetInfo.fetch();
        if (netInfo.isConnected) {
          return editUser(user.userId, { password: confirmPass }, user.token).then(
            async (response) => {
              setModalVisible(false);
              return response.data;
            },
            (error) => {
              console.log(error);
            }
          );
        }
      }
    } else {
      let name = getValues().Name || user.name;
      let email = getValues().Email || user.email;
      setUser({ ...user, name: name, email: email });
      setModalVisible(false);
    }
    reset();
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
          reset();
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
            <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TransparentView style={{ width: '80%' }}>
                {passChange ? (
                  <>
                    <BoldText style={{ textTransform: 'uppercase' }}>Password</BoldText>
                    <Controller
                      control={control}
                      name='Password'
                      rules={{
                        required: 'Please enter a password.',
                        minLength: {
                          value: 6,
                          message: 'Password should be at least 6 characters long.',
                        },
                        maxLength: {
                          value: 24,
                          message: 'Password should be max 24 characters long.',
                        },
                      }}
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                          <TextInput
                            secureTextEntry
                            placeholder='Enter your new password'
                            placeholderTextColor='#919191'
                            selectionColor={Colors.button}
                            style={styles.textInput}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                          {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                        </>
                      )}
                    />
                    <BoldText style={{ textTransform: 'uppercase', paddingTop: 10 }}>Confirm password</BoldText>
                    <Controller
                      control={control}
                      name='ConfirmPassword'
                      rules={{
                        required: 'Please confirm your password.',
                        validate: (value) => value === pass || 'Passwords do not match.',
                      }}
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                          <TextInput
                            secureTextEntry
                            placeholder='Confirm your password'
                            placeholderTextColor='#919191'
                            selectionColor={Colors.button}
                            style={styles.textInput}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                          />
                          {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                        </>
                      )}
                    />
                  </>
                ) : (
                  <>
                    <BoldText style={{ textTransform: 'uppercase' }}>Name</BoldText>
                    <Controller
                      defaultValue={user.name}
                      control={control}
                      name='Name'
                      rules={{
                        required: 'Please enter a name.',
                        minLength: {
                          value: 2,
                          message: 'Name should be at least 2 characters long.',
                        },
                        maxLength: {
                          value: 15,
                          message: 'Name should be max 15 characters long.',
                        },
                      }}
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                          <TextInput selectionColor={Colors.button} style={styles.textInput} onBlur={onBlur} onChangeText={onChange} value={value} />
                          {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                        </>
                      )}
                    />
                    <BoldText style={{ textTransform: 'uppercase', paddingTop: 10 }}>Email</BoldText>
                    <Controller
                      defaultValue={user.email}
                      control={control}
                      name='Email'
                      rules={{
                        required: 'Please enter a valid email address.',
                        pattern: { value: EMAIL_REGEX, message: 'Email is invalid.' },
                      }}
                      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                        <>
                          <TextInput selectionColor={Colors.button} style={styles.textInput} onBlur={onBlur} onChangeText={onChange} value={value} />
                          {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                        </>
                      )}
                    />
                  </>
                )}
              </TransparentView>
              <TransparentView style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={handleSubmit(onSubmit)}>
                  <MaterialCommunityIcons name='content-save-outline' size={30} color='white' />
                </TouchableOpacity>
              </TransparentView>
            </TransparentView>
          </TransparentView>
        </KeyboardAvoidingView>
      </Modal>
      <SafeAreaView style={styles.container}>
        <TransparentView style={{ width: '90%' }}>
          <ScrollView>
            <TransparentView style={{ alignItems: 'center', marginBottom: 5 }}>
              <Controller
                control={control}
                name='img'
                render={({ field: { onChange, value } }) => <PickImage viewImg={viewImg} isProfile={true} onChange={onChange} value={value} />}
              />
            </TransparentView>
            <TransparentView style={{ alignItems: 'center', marginBottom: 17 }}>
              <BoldText style={{ textTransform: 'capitalize', fontSize: 36 }}>{user.name}</BoldText>
              <Text style={{ fontSize: 14 }}>{user.email}</Text>
            </TransparentView>
            <TransparentView>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setPassChange(false);
                }}
                style={[{ padding: 15, backgroundColor: Colors.other }, styles.section]}
              >
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BoldText>Edit profile</BoldText>
                  <MaterialIcons name='edit' size={20} color={Colors.text} />
                </TransparentView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(true);
                  setPassChange(true);
                }}
                style={[{ padding: 15, backgroundColor: Colors.other }, styles.section]}
              >
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BoldText>Change password</BoldText>
                  <MaterialIcons name='lock-outline' size={20} color={Colors.text} />
                </TransparentView>
              </TouchableOpacity>
              <TransparentView style={[{ paddingLeft: 15, backgroundColor: Colors.other }, styles.section]}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BoldText>Notifications</BoldText>
                  <Switch
                    trackColor={{ false: '#767577', true: '#515151' }}
                    thumbColor={enableNotif ? '#3D3D3D' : '#f4f3f4'}
                    onValueChange={toggleNotifications}
                    value={enableNotif}
                  />
                </TransparentView>
              </TransparentView>
              <TransparentView style={[{ paddingLeft: 15, backgroundColor: Colors.other }, styles.section]}>
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BoldText>Dark mode</BoldText>
                  <Switch
                    trackColor={{ false: '#767577', true: '#515151' }}
                    thumbColor={enableDarkTheme ? '#3D3D3D' : '#f4f3f4'}
                    onValueChange={toggleTheme}
                    value={enableDarkTheme}
                  />
                </TransparentView>
              </TransparentView>
              <TouchableOpacity
                onPress={() => syncWDB()}
                style={[{ paddingHorizontal: 15, paddingVertical: 12, backgroundColor: Colors.other }, styles.section]}
              >
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BoldText>Sync now</BoldText>
                  {isLoading ? <ActivityIndicator size={24} color='white' /> : <MaterialIcons name='sync' size={24} color={Colors.text} />}
                </TransparentView>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => signOut()}
                style={[{ paddingHorizontal: 15, paddingVertical: 12, backgroundColor: Colors.button }, styles.section]}
              >
                <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <BoldText>Sign out</BoldText>
                  <MaterialIcons name='logout' size={24} color={Colors.text} />
                </TransparentView>
              </TouchableOpacity>
            </TransparentView>
          </ScrollView>
        </TransparentView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  textInput: {
    color: '#ffffff',
    borderColor: '#ffffff',
    borderBottomWidth: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  section: {
    borderRadius: 15,
    marginBottom: 5,
  },
});
