import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
  ImageBackground,
} from 'react-native';

import {
  BoldText,
  CustomButton,
  FieldWrapper,
  FormInput,
  FormView,
  IconWrapper,
  LightText,
  TransparentView,
  View,
  Text,
} from '../components/CustomStyled';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import Constants from 'expo-constants';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

type SignInScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'SignIn'
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
    //nema nav samo mijenjaj stanje isloggedin.
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
        <ImageBackground
          source={require('../assets/images/1-op.jpg')}
          style={{ width: width, height: height + statusBarHeight }}
        >
          <FormView style={{ justifyContent: 'center', flex: 1 }}>
            <BoldText
              style={{ fontSize: 30, alignSelf: 'center', paddingBottom: 15 }}
            >
              Welcome back
            </BoldText>
            <FieldWrapper>
              <IconWrapper>
                <MaterialCommunityIcons
                  name='email-outline'
                  size={22}
                  color='#999'
                />
              </IconWrapper>
              <Controller
                control={control}
                rules={{
                  required: true,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    placeholder='Email'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name='email'
              />
            </FieldWrapper>
            {errors.email && (
              <Text style={{ fontSize: 11 }}>
                Please enter a valid email address.
              </Text>
            )}
            <FieldWrapper>
              <IconWrapper>
                <MaterialIcons name='lock-outline' size={22} color='#999' />
              </IconWrapper>
              <Controller
                control={control}
                rules={{
                  maxLength: 100,
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    secureTextEntry={true}
                    placeholder='Password'
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
                name='password'
              />
            </FieldWrapper>
            {errors.password && (
              <Text style={{ fontSize: 11 }}>
                Please enter a password.
              </Text>
            )}
            <TransparentView
              style={{ paddingTop: 5, width: '40%', alignSelf: 'center' }}
            >
              <CustomButton onPress={handleSubmit(onSubmit)}>
                <BoldText>Sign in</BoldText>
              </CustomButton>
            </TransparentView>
            <LightText
              style={{ fontSize: 13, padding: 5, alignSelf: 'center' }}
            >
              Don't have an account? Sign up.
            </LightText>
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
