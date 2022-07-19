import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, TextInput, KeyboardAvoidingView } from 'react-native';
import { BoldText, Text, View, TransparentView, CustomButton, FormInput, SignInUpButton } from '../components/CustomStyled';
import PickImage from '../components/PickImage';
import { Colors, Mode } from '../constants/Constants';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
import { Controller, useForm } from 'react-hook-form';
import { HomeTabParamList } from '../types';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type PlantScreenNavigationProp = NativeStackScreenProps<HomeTabParamList, 'NewPlant'>;

export default function NewPlantScreen({ navigation, route }: PlantScreenNavigationProp) {
  navigation.setOptions({
    headerRight: () => (
      <Pressable
        onPress={handleSubmit(onSubmit)}
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
        })}
      >
        <BoldText>SAVE</BoldText>
      </Pressable>
    ),
  });

  const [mode, setMode] = useState(Mode.new); //future

  const [modalVisible, setModalVisible] = useState(false);
  const { height, width } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;
  const { control, handleSubmit, watch } = useForm();
  const [fieldName, setFieldName] = useState('');
  const [nameField, setNameField] = useState('');
  const [nicknameField, setNicknameField] = useState('');
  const [multiline, setMultiline] = useState(false);
  const [notesField, setNotesField] = useState('Currently there are no notes.');

  const onSubmit = (formData: any) => {
    console.log(formData);
  };

  return (
    <>
      <Modal
        style={styles.view}
        statusBarTranslucent
        deviceHeight={height + statusBarHeight + 5}
        isVisible={modalVisible}
        swipeDirection={['up', 'left', 'right', 'down']}
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        onSwipeComplete={() => setModalVisible(false)}
        hideModalContentWhileAnimating={true}
        backdropOpacity={0.5}
        useNativeDriver
        avoidKeyboard
      >
        <KeyboardAvoidingView behavior='padding'>
          <TransparentView style={{ alignSelf: 'center', backgroundColor: Colors.background, width: '100%', padding: 30, borderRadius: 15 }}>
            <Controller
              control={control}
              name={fieldName}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <>
                  <BoldText style={{ textTransform: 'uppercase' }}>{fieldName}</BoldText>
                  <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <TextInput multiline={multiline} selectionColor={Colors.button} style={styles.textInput} onBlur={onBlur} onChangeText={onChange} value={value} />
                    <TouchableOpacity
                      style={{ alignSelf: 'center' }}
                      onPress={() => {
                        if (fieldName === 'Nickname') {
                          setNicknameField(watch(fieldName));
                        } else if (fieldName === 'Name') {
                          setNameField(watch(fieldName));
                        } else {
                          setNotesField(watch(fieldName));
                        }
                        setModalVisible(false);
                      }}
                    >
                      <MaterialCommunityIcons name='content-save-outline' size={30} color='white' />
                    </TouchableOpacity>
                  </TransparentView>
                </>
              )}
            />
          </TransparentView>
        </KeyboardAvoidingView>
      </Modal>
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
            <TouchableOpacity
              style={styles.section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Nickname');
                setMultiline(false);
              }}
            >
              <CustomButton>
                <BoldText>NICKNAME</BoldText>
                <Text>{nicknameField}</Text>
              </CustomButton>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Name');
                setMultiline(false);
              }}
            >
              <CustomButton>
                <BoldText>NAME</BoldText>
                <Text>{nameField}</Text>
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
            <TouchableOpacity
              style={styles.section}
              onPress={() => {
                setModalVisible(true);
                setFieldName('Notes');
                setMultiline(true);
              }}
            >
              <Text style={{ textAlign: 'justify' }}>{notesField}</Text>
            </TouchableOpacity>
          </TransparentView>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  textInput: {
    color: '#ffffff',
    width: '85%',
    borderColor: '#ffffff',
    borderBottomWidth: 1,
    marginVertical: 5,
  },
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
