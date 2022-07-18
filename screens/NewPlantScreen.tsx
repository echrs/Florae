import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BoldText, Text, View, CustomButton, SafeAreaView, FormInput, TransparentView } from '../components/CustomStyled';
import PickImage from '../components/PickImage';
import { Colors } from '../constants/Constants';

export default function NewPlantScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PickImage></PickImage>
      <TransparentView style={{ width: '90%', marginTop: 20 }}>
        <TouchableOpacity style={styles.touchableSection} onPress={() => {}}>
          <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <BoldText style={{ fontSize: 15 }}>IDENTIFY PLANT</BoldText>
            <MaterialIcons name='search' size={20} color={Colors.text} />
          </TransparentView>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => {}}>
          <BoldText style={{ fontSize: 20 }}>GENERAL INFO</BoldText>
          <Text style={{ paddingTop: 5, fontSize: 15 }}>Name:</Text>
          <Text style={{ paddingTop: 5, fontSize: 15 }}>Description:</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.section} onPress={() => {}}>
          <BoldText style={{ fontSize: 20 }}>TASKS</BoldText>
          <Text style={{ paddingTop: 5, fontSize: 15 }}>Water every 7 days</Text>
        </TouchableOpacity>
      </TransparentView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  section: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
  touchableSection: {
    backgroundColor: '#1D4D47',
    padding: 20,
    borderRadius: 15,
    marginBottom: 5,
  },
});
