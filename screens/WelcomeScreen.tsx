import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import React, { useContext } from 'react';
import { ImageBackground, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { BoldText, SignInUpButton, FormView, LightText, View } from '../components/CustomStyled';
import { Context } from '../Context';
import { RootStackParamList } from '../types';

type WelcomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation, route }: WelcomeScreenNavigationProp) {
  const statusBarHeight = Constants.statusBarHeight;
  const { height, width } = useWindowDimensions();
  const { colorsCtx } = useContext(Context);
  const [Colors] = colorsCtx;

  return (
    <View style={styles(Colors).container}>
      <ImageBackground source={require('../assets/images/1-op.jpg')} style={{ width: width, height: height + statusBarHeight }}>
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
          <SignInUpButton
            style={{ height: 50 }}
            onPress={() => {
              navigation.navigate('SignUp');
            }}
          >
            <BoldText>Sign up with Email</BoldText>
          </SignInUpButton>

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
            <BoldText>Sign in</BoldText>
          </TouchableOpacity>
        </FormView>
      </ImageBackground>
    </View>
  );
}

const styles = (Colors: any) => StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    flex: 1,
    alignItems: 'center',
    width: '100%',
  },
});
