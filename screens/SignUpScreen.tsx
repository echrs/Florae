import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Image, useWindowDimensions, StyleSheet, ScrollView, ImageBackground, TouchableOpacity } from 'react-native';

import { BoldText, CustomButton, FieldWrapper, FormInput, FormView, IconWrapper, LightText, Text, TransparentView, View } from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type SignInScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

export default function SignUpScreen({ navigation, route }: SignInScreenNavigationProp) {
  const statusBarHeight = Constants.statusBarHeight;
  const { height, width } = useWindowDimensions();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: any) => {
    //nema nav samo mijenjaj stanje isloggedin.
    console.log(data);
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
            <BoldText style={{ fontSize: 30, alignSelf: 'center', paddingBottom: 15 }}>Join us</BoldText>
            <FieldWrapper>
              <IconWrapper>
                <MaterialCommunityIcons name='card-account-details-outline' size={22} color='#999' />
              </IconWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => <FormInput placeholder='Name' onBlur={onBlur} onChangeText={onChange} value={value} />}
                name='name'
              />
            </FieldWrapper>
            {errors.name && <Text style={{ fontSize: 11 }}>Please enter a name.</Text>}
            <FieldWrapper>
              <IconWrapper>
                <MaterialCommunityIcons name='email-outline' size={22} color='#999' />
              </IconWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => <FormInput placeholder='Email' onBlur={onBlur} onChangeText={onChange} value={value} />}
                name='email'
              />
            </FieldWrapper>
            {errors.email && <Text style={{ fontSize: 11 }}>Please enter a valid email address.</Text>}
            <FieldWrapper>
              <IconWrapper>
                <MaterialIcons name='lock-outline' size={22} color='#999' />
              </IconWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => <FormInput secureTextEntry={true} placeholder='Password' onBlur={onBlur} onChangeText={onChange} value={value} />}
                name='password'
              />
            </FieldWrapper>
            {errors.password && <Text style={{ fontSize: 10 }}>Please enter a password.</Text>}
            <FieldWrapper>
              <IconWrapper>
                <MaterialIcons name='lock-outline' size={22} color='#999' />
              </IconWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => <FormInput secureTextEntry={true} placeholder='Confirm password' onBlur={onBlur} onChangeText={onChange} value={value} />}
                name='confirmPassword'
              />
            </FieldWrapper>
            {errors.confirmPassword && <Text style={{ fontSize: 11 }}>Please confirm your password.</Text>}
            <TransparentView style={{ paddingTop: 5, width: '40%', alignSelf: 'center' }}>
              <CustomButton onPress={handleSubmit(onSubmit)}>
                <BoldText>Sign up</BoldText>
              </CustomButton>
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
