import React, { useContext, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Image,
  useWindowDimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';

import {
  BoldText,
  CustomButton,
  FieldWrapper,
  FormInput,
  FormView,
  IconWrapper,
  LightText,
  View,
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
        <Image
          source={require('../assets/images/logoimg.jpg')}
          style={{ width: width, height: height / 2 + statusBarHeight }}
          resizeMode='cover'
        />
        <FormView
          style={{ justifyContent: 'center', flex: 1 /*paddingTop: 40*/ }}
        >
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
          {/* {errors.email && <Text>Please enter a valid email address.</Text>} */}
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
          {/* {errors.password && <Text>Please enter a password.</Text>} */}
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
});
