import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useWindowDimensions, StyleSheet, ScrollView, ImageBackground, TouchableOpacity, ActivityIndicator } from 'react-native';
import { BoldText, FieldWrapper, FormInput, FormView, IconWrapper, LightText, TransparentView, View, Text, SemiBoldText, SignInUpButton } from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { login } from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Context } from '../Context';
import { Colors } from '../constants/Constants';

type SignInScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

export default function SignInScreen({ navigation, route }: SignInScreenNavigationProp) {
  const statusBarHeight = Constants.statusBarHeight;
  const { height, width } = useWindowDimensions();
  const { userCtx } = useContext(Context);
  const [user, setUser] = userCtx;
  const { control, handleSubmit, formState } = useForm();
  const [valMsg, setValMsg] = useState('');
  const { isSubmitting } = formState;

  const onSubmit = (formData: any) => {
    login(formData).then(
      async (response) => {
        await AsyncStorage.setItem('userCredentials', JSON.stringify(response.data));
        setUser(response.data);
      },
      (error) => {
        setValMsg('Error: ' + error.response.data);
      }
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <ImageBackground source={require('../assets/images/1-op.jpg')} style={{ width: width, height: height + statusBarHeight }}>
          <FormView style={{ justifyContent: 'center', flex: 1 }}>
            <BoldText style={{ fontSize: 30, alignSelf: 'center', paddingBottom: 15 }}>Welcome back</BoldText>
            <FieldWrapper>
              <Controller
                control={control}
                rules={{
                  required: 'Please enter a valid email address.',
                }}
                name='email'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TransparentView style={{ width: '100%' }}>
                    <IconWrapper>
                      <MaterialCommunityIcons name='email-outline' size={22} color='#999' />
                    </IconWrapper>
                    <FormInput selectionColor={Colors.button} placeholder='Email' onBlur={onBlur} onChangeText={onChange} value={value} />
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
                }}
                name='password'
                render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                  <TransparentView style={{ width: '100%' }}>
                    <IconWrapper>
                      <MaterialIcons name='lock-outline' size={22} color='#999' />
                    </IconWrapper>
                    <FormInput selectionColor={Colors.buttonShade}secureTextEntry placeholder='Password' onBlur={onBlur} onChangeText={onChange} value={value} />
                    {error && <Text style={{ fontSize: 11 }}>{error.message || 'Error'}</Text>}
                  </TransparentView>
                )}
              />
            </FieldWrapper>
            {valMsg.length > 0 && <SemiBoldText style={{ alignSelf: 'center' }}>{valMsg}</SemiBoldText>}
            <TransparentView style={{ paddingTop: 5, width: '40%', alignSelf: 'center' }}>
              {!isSubmitting ? (
                <SignInUpButton onPress={handleSubmit(onSubmit)}>
                  <BoldText>Sign in</BoldText>
                </SignInUpButton>
              ) : (
                <SignInUpButton>
                  <ActivityIndicator size={30} color='white' />
                </SignInUpButton>
              )}
            </TransparentView>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SignUp');
              }}
            >
              <LightText style={{ fontSize: 13, padding: 5, alignSelf: 'center' }}>Don't have an account? Sign up.</LightText>
            </TouchableOpacity>
          </FormView>
        </ImageBackground>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
});
