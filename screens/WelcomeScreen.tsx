import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import React from 'react';
import {
  Button,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {
  BoldText,
  CustomButton,
  FormView,
  LightText,
  View,
} from '../components/CustomStyled';
import { RootStackParamList } from '../types';

type WelcomeScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  'Welcome'
>;

export default function WelcomeScreen({
  navigation,
  route,
}: WelcomeScreenNavigationProp) {
  const statusBarHeight = Constants.statusBarHeight;
  const { height, width } = useWindowDimensions();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/images/1-op.jpg')}
        style={{ width: width, height: height + statusBarHeight }}
      >
        <FormView style={{ justifyContent: 'center', flex: 1 }}>
          <BoldText
            style={{
              fontSize: 65,
              alignSelf: 'center',
              paddingBottom: 0,
              marginBottom: 0,
              marginVertical: 0,
            }}
          >
            Florae
          </BoldText>
          <LightText
            style={{
              fontSize: 20,
              alignSelf: 'center',
              paddingBottom: 15,
              paddingTop: 0,
              marginTop: 0,
              marginVertical: 0,
            }}
          >
            Happy plants, happy you.
          </LightText>
          <CustomButton
            style={{ height: 50 }}
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <BoldText>Sign up with Email</BoldText>
          </CustomButton>

          <TouchableOpacity
            style={{
              backgroundColor: '#1A1A1A',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 15,
              height: 50,
              marginTop: 5,
            }}
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          >
            <BoldText>Google</BoldText>
          </TouchableOpacity>
          <LightText style={{ fontSize: 13, padding: 5, alignSelf: 'center' }}>
            Already have an account? Sign in.
          </LightText>
        </FormView>
      </ImageBackground>
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
