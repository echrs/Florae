import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, Alert, View, useWindowDimensions } from 'react-native';
import { Colors } from '../constants/Constants';
import { BoldText, CustomButton, TransparentView } from './CustomStyled';
import * as ImagePicker from 'expo-image-picker';
import Modal from 'react-native-modal';
import Constants from 'expo-constants';
export default function PickImage() {
  const [modalVisible, setModalVisible] = useState(false);
  const [img, setImg] = useState(null);
  const { height, width } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;

  const selectPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImg(result.uri);
    }

    setModalVisible(false);
  };

  const takePicture = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync();

    if (!result.cancelled) {
      setImg(result.uri);
    }

    setModalVisible(false);
  };

  return (
    <>
      <Modal
        statusBarTranslucent
        deviceHeight={height + statusBarHeight + 5}
        isVisible={modalVisible}
        animationIn='fadeIn'
        animationOut='fadeOut'
        onBackdropPress={() => setModalVisible(false)}
        onBackButtonPress={() => setModalVisible(false)}
        hideModalContentWhileAnimating={true}
        backdropOpacity={0.5}
        useNativeDriver
      >
        <TransparentView style={{ alignSelf: 'center', backgroundColor: Colors.background, width: '50%', padding: 30, borderRadius: 15 }}>
          <BoldText style={{ alignSelf: 'center', paddingBottom: 10 }}>Select image</BoldText>
          <TransparentView style={{ flexDirection: 'row', alignSelf: 'center' }}>
            <TouchableOpacity onPress={selectPicture}>
              <MaterialIcons name='insert-photo' size={40} color={Colors.text} />
            </TouchableOpacity>
            <TouchableOpacity style={{ paddingLeft: 20 }} onPress={takePicture}>
              <MaterialCommunityIcons name='camera-outline' size={40} color={Colors.text} />
            </TouchableOpacity>
          </TransparentView>
        </TransparentView>
      </Modal>
      {img ? (
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Image source={{ uri: img }} style={{ borderRadius: 100, width: 200, height: 200 }} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{ borderWidth: 1, borderColor: Colors.text, borderRadius: 100, padding: 70 }} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name='flower-poppy' size={50} color={Colors.text} />
        </TouchableOpacity>
      )}
    </>
  );
}
