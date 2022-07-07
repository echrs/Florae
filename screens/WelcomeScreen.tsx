import React from 'react';
import { StyleSheet } from 'react-native';
import { BoldText, View } from '../components/Themed';

export default function WelcomeScreen() {
  return (
    <View style={styles.container}>
      <BoldText>Welcome</BoldText>
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
