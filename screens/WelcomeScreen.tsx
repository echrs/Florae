import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { Button, StyleSheet } from 'react-native';
import { BoldText, View } from '../components/CustomStyled';
import { RootStackParamList } from '../types';

type WelcomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({
  navigation,
  route,
}: WelcomeScreenNavigationProp) {
  return (
    <View style={styles.container}>
      <BoldText>Welcome</BoldText>
      <Button
        title='Go to Sign in'
        onPress={() => navigation.navigate('SignIn')}
      />
      <Button
        title='Go to Sign up'
        onPress={() => navigation.navigate('SignUp')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
