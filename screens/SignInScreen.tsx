import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  Text,
  useWindowDimensions,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

import {
  BoldText,
  CustomButton,
  FormView,
  LightText,
  SemiBoldText,
  View,
} from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { HomeTabParamList, RootStackParamList } from '../types';
import Constants from 'expo-constants';
import { CompositeScreenProps } from '@react-navigation/native';

type SignInScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'SignIn'>,
  NativeStackScreenProps<HomeTabParamList, 'Home'>
>;

export default function SignInScreen({
  navigation,
  route,
}: SignInScreenNavigationProp) {
  const statusBarHeight = Constants.statusBarHeight;
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    //fix nav
    navigation.navigate('App');
    setLoading(true);

    setLoading(false);
  };

  const onSignUpPress = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
      >
        <Image
          source={require('../assets/images/logoimg.jpg')}
          style={{ width: width, height: height / 2 + statusBarHeight }}
          resizeMode='cover'
        />
        <FormView
          style={{ justifyContent: 'center', flex: 1 /*paddingTop: 40*/ }}
        >
          {/* <BoldText style={{fontSize: 30}}>Welcome.</BoldText> */}
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                placeholder='Email'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name='email'
          />
          {/* {errors.email && <Text>Please enter a valid email address.</Text>} */}
          <Controller
            control={control}
            rules={{
              maxLength: 100,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                secureTextEntry={true}
                placeholder='Password'
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name='password'
          />
          {/* {errors.email && <Text>Please enter a password.</Text>} */}
          <View style={{ paddingTop: 5, width: '40%', alignSelf: 'center' }}>
            <CustomButton onPress={onSubmit}>
              <BoldText>Sign in</BoldText>
            </CustomButton>
          </View>
          <LightText style={{ fontSize: 13, padding: 5, alignSelf: 'center' }}>
            Don't have an account? Sign up.
          </LightText>
        </FormView>
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
  input: {
    backgroundColor: 'white',
    width: '100%',
    height: 45,
    borderColor: '#ffffff',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginVertical: 5,
  },
});
