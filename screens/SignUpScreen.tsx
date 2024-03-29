import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useWindowDimensions, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator, ToastAndroid } from 'react-native';
import {
  BoldText,
  SignInUpButton,
  FieldWrapper,
  FormInput,
  FormView,
  IconWrapper,
  LightText,
  SemiBoldText,
  Text,
  TransparentView,
} from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { register } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../Context';
import { Colors } from '../constants/Constants';
import { EMAIL_REGEX } from '../utils';
import NetInfo from '@react-native-community/netinfo';

type SignInScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation, route }: SignInScreenNavigationProp) {
  const statusBarHeight = Constants.statusBarHeight;
  const { height, width } = useWindowDimensions();
  const { userCtx } = useContext(Context);
  const [user, setUser] = userCtx;

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm();
  const pass = watch('password');
  const [valMsg, setValMsg] = useState('');

  const onSubmit = async (formData: any) => {
    let netInfo = await NetInfo.fetch();
    if (netInfo.isConnected) {
      return register(formData).then(
        async (response) => {
          await AsyncStorage.setItem('userCredentials', JSON.stringify(response.data));
          setUser(response.data);
        },
        (error) => {
          setValMsg('Error: ' + error.response.data);
        }
      );
    } else {
      ToastAndroid.show('There is no internet connection.', ToastAndroid.SHORT);
    }
  };

  return (
    <TransparentView style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <ImageBackground source={require('../assets/images/1-op.jpg')} style={{ width: width, height: height + statusBarHeight }}>
          <FormView style={{ justifyContent: 'center', flex: 1 }}>
            <BoldText style={{ fontSize: 30, alignSelf: 'center', paddingBottom: 15 }}>Join us</BoldText>
            <FieldWrapper>
              <Controller
                control={control}
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
                name='name'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TransparentView style={{ width: '100%' }}>
                    <IconWrapper>
                      <MaterialCommunityIcons name='card-account-details-outline' size={22} color='#999' />
                    </IconWrapper>
                    <FormInput selectionColor={Colors.buttonShade} placeholder='Name' onBlur={onBlur} onChangeText={onChange} value={value} />
                    {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                  </TransparentView>
                )}
              />
            </FieldWrapper>
            <FieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: 'Please enter a valid email address.',
                  pattern: { value: EMAIL_REGEX, message: 'Email is invalid.' },
                }}
                name='email'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TransparentView style={{ width: '100%' }}>
                    <IconWrapper>
                      <MaterialCommunityIcons name='email-outline' size={22} color='#999' />
                    </IconWrapper>
                    <FormInput selectionColor={Colors.buttonShade} placeholder='Email' onBlur={onBlur} onChangeText={onChange} value={value} />
                    {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                  </TransparentView>
                )}
              />
            </FieldWrapper>
            <FieldWrapper>
              <Controller
                control={control}
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
                name='password'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TransparentView style={{ width: '100%' }}>
                    <IconWrapper>
                      <MaterialIcons name='lock-outline' size={22} color='#999' />
                    </IconWrapper>
                    <FormInput
                      selectionColor={Colors.buttonShade}
                      secureTextEntry
                      placeholder='Password'
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                  </TransparentView>
                )}
              />
            </FieldWrapper>
            <FieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: 'Please confirm your password.',
                  validate: (value) => value === pass || 'Passwords do not match.',
                }}
                name='confirmPassword'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TransparentView style={{ width: '100%' }}>
                    <IconWrapper>
                      <MaterialIcons name='lock-outline' size={22} color='#999' />
                    </IconWrapper>
                    <FormInput
                      selectionColor={Colors.buttonShade}
                      secureTextEntry
                      placeholder='Confirm password'
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                    />
                    {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                  </TransparentView>
                )}
              />
            </FieldWrapper>
            {valMsg.length > 0 && <SemiBoldText style={{ alignSelf: 'center' }}>{valMsg}</SemiBoldText>}
            <TransparentView style={{ paddingTop: 5, width: '40%', alignSelf: 'center' }}>
              {!isSubmitting ? (
                <SignInUpButton onPress={handleSubmit(onSubmit)}>
                  <BoldText>Sign up</BoldText>
                </SignInUpButton>
              ) : (
                <SignInUpButton>
                  <ActivityIndicator size={30} color={Colors.text} />
                </SignInUpButton>
              )}
            </TransparentView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignIn');
              }}
            >
              <LightText style={{ fontSize: 13, padding: 5, alignSelf: 'center' }}>Already have an account? Sign in.</LightText>
            </TouchableOpacity>
          </FormView>
        </ImageBackground>
      </ScrollView>
    </TransparentView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
});
