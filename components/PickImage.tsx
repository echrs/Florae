import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, useWindowDimensions } from 'react-native';
import { Colors } from '../constants/Constants';
import { BoldText, TransparentView } from './CustomStyled';
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
      >
        <TransparentView style={{ alignSelf: 'center', backgroundColor: Colors.background, width: '100%', padding: 30, borderRadius: 15 }}>
          <BoldText style={{ paddingBottom: 20 }}>SELECT IMAGE FROM</BoldText>
          <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
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
          <Image source={{ uri: img }} style={{ width: width, height: height * 0.4 }} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{}} onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/images/1-op.jpg')} style={{ width: width, height: height * 0.4 }} />
        </TouchableOpacity>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});