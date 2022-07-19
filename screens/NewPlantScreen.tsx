import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { BoldText, Text, View, TransparentView, CustomButton } from '../components/CustomStyled';
import PickImage from '../components/PickImage';
import { Colors, Mode } from '../constants/Constants';

export default function NewPlantScreen() {
  const [mode, setMode] = useState(Mode.new);

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
        }}
      >
        <PickImage></PickImage>
        <TransparentView style={{ width: '90%', marginTop: 20 }}>
          <TouchableOpacity style={styles.buttonSection} onPress={() => {}}>
            <CustomButton>
              <BoldText>IDENTIFY PLANT</BoldText>
              <MaterialIcons name='search' size={17} color={Colors.text} />
            </CustomButton>
          </TouchableOpacity>
          <BoldText style={styles.headerText}>GENERAL INFO</BoldText>
          <TouchableOpacity style={styles.section} onPress={() => {}}>
            <CustomButton>
              <BoldText>NICKNAME</BoldText>
              <Text>Poison Ivy</Text>
            </CustomButton>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section} onPress={() => {}}>
            <CustomButton>
              <BoldText>NAME</BoldText>
              <Text>Toxicodendron orientale</Text>
            </CustomButton>
          </TouchableOpacity>
          <BoldText style={styles.headerText}>TASKS</BoldText>
          <TouchableOpacity style={styles.section} onPress={() => {}}>
            <CustomButton>
              <BoldText>WATER</BoldText>
              <Text>Every 7 days</Text>
            </CustomButton>
          </TouchableOpacity>
          <TouchableOpacity style={styles.section} onPress={() => {}}>
            <CustomButton>
              <BoldText>FEED</BoldText>
              <Text>Every 21 days</Text>
            </CustomButton>
          </TouchableOpacity>
          <BoldText style={styles.headerText}>NOTES</BoldText>
          <TouchableOpacity style={styles.section} onPress={() => {}}>
            <Text style={{ textAlign: 'justify' }}>
              Poison ivy is a type of allergenic plant in the genus Toxicodendron native to Asia and North America. Formerly considered a single species, Toxicodendron radicans, poison ivies are now
              generally treated as a complex of three separate species: Toxicodendron radicans, Toxicodendron rydbergii, and Toxicodendron orientale. They are well known for causing urushiol-induced
              contact dermatitis, an itchy, irritating, and sometimes painful rash, in most people who touch it. The rash is caused by urushiol, a clear liquid compound in the plant's sap. They are
              variable in appearance and habit, and despite its common name, it is not a "true" ivy (Hedera), but rather a member of the cashew and pistachio family (Anacardiaceae). T. radicans is
              commonly eaten by many animals, and the seeds are consumed by birds, but poison ivy is most often thought of as an unwelcome weed.
            </Text>
          </TouchableOpacity>
        </TransparentView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 20,
    paddingTop: 10,
    paddingBottom: 5,
  },
  section: {
    backgroundColor: '#333333',
    padding: 15,
    borderRadius: 15,
    marginBottom: 5,
  },
  buttonSection: {
    backgroundColor: '#1D4D47',
    padding: 15,
    borderRadius: 15,
    marginBottom: 5,
  },
});
