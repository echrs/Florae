import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { BoldText, TransparentView } from './CustomStyled';
import { Image, TouchableOpacity, useWindowDimensions, StyleSheet } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Constants';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';

export const PickImage = ({ onChange, value }: any) => {
  const { height, width } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;
  const [imgModalVisible, setImgModalVisible] = useState(false);
  const [img64, setImg64] = useState(null);

  const selectPicture = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });

    if (!result.cancelled) {
      setImg64(result.base64);
      onChange(result.base64);
    }

    setImgModalVisible(false);
  };

  const takePicture = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
      base64: true,
    });

    if (!result.cancelled) {
      setImg64(result.base64);
      onChange(result.base64);
    }

    setImgModalVisible(false);
  };

  return (
    <>
      <Modal
        style={styles.view}
        statusBarTranslucent
        deviceHeight={height + statusBarHeight + 5}
        isVisible={imgModalVisible}
        swipeDirection={['up', 'left', 'right', 'down']}
        onBackdropPress={() => setImgModalVisible(false)}
        onBackButtonPress={() => setImgModalVisible(false)}
        onSwipeComplete={() => setImgModalVisible(false)}
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
      {img64 ? (
        <TouchableOpacity onPress={() => setImgModalVisible(true)}>
          <Image source={{ uri: `data:image/gif;base64,${img64}` }} style={{ width: width, height: height * 0.4 }} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={{}} onPress={() => setImgModalVisible(true)}>
          <Image source={require('../assets/images/1-op.jpg')} style={{ width: width, height: height * 0.4 }} />
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
});
