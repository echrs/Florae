import React, { useContext, useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { BoldText, TransparentView } from './CustomStyled';
import { Image, TouchableOpacity, useWindowDimensions, StyleSheet, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../constants/Constants';
import Constants from 'expo-constants';
import Modal from 'react-native-modal';
import * as FileSystem from 'expo-file-system';
import uuid from 'react-native-uuid';
import { Context } from '../Context';

export const PickImage = ({ disabled, viewImg, isProfile, onChange, value }: any) => {
  const { height, width } = useWindowDimensions();
  const statusBarHeight = Constants.statusBarHeight;
  const [imgModalVisible, setImgModalVisible] = useState(false);
  const [img, setImg] = useState(null);
  const { userCtx } = useContext(Context);
  const [user, setUser] = userCtx;
  const [isLoading, setIsLoading] = useState(false);

  const selectPicture = async () => {
    setIsLoading(true);
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.cancelled) {
      let uri = await saveImage(result);
      setImg(uri);
      if (isProfile) {
        setUser({ ...user, img: uri });
      }
      onChange(uri);
    }
    setIsLoading(false);
    setImgModalVisible(false);
  };

  const takePicture = async () => {
    await ImagePicker.requestCameraPermissionsAsync();
    setIsLoading(true);
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
      base64: true,
    });

    if (!result.cancelled) {
      let uri = await saveImage(result);
      setImg(uri);
      onChange(uri);
    }
    setIsLoading(false);
    setImgModalVisible(false);
  };

  const saveImage = async (image: any) => {
    let file = await FileSystem.getInfoAsync(FileSystem.documentDirectory + 'images/');
    let uuidStr = uuid.v4();

    !file.exists && (await FileSystem.makeDirectoryAsync(FileSystem.documentDirectory + 'images/', { intermediates: true }));

    await FileSystem.writeAsStringAsync(FileSystem.documentDirectory + `images/${uuidStr}.jpg`, image.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    return FileSystem.documentDirectory + `images/${uuidStr}.jpg`;
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
        <TransparentView style={{ alignSelf: 'center', backgroundColor: Colors.modal, width: '100%', padding: 30, borderRadius: 15 }}>
          <BoldText style={{ paddingBottom: 20 }}>SELECT IMAGE FROM</BoldText>
          <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            {isLoading ? (
              <ActivityIndicator size={40} color='white' />
            ) : (
              <>
                <TouchableOpacity onPress={selectPicture}>
                  <MaterialIcons name='insert-photo' size={40} color={Colors.text} />
                </TouchableOpacity>
                <TouchableOpacity style={{ paddingLeft: 20 }} onPress={takePicture}>
                  <MaterialCommunityIcons name='camera-outline' size={40} color={Colors.text} />
                </TouchableOpacity>
              </>
            )}
          </TransparentView>
        </TransparentView>
      </Modal>
      {!isProfile ? (
        <>
          {img || viewImg ? (
            <TouchableOpacity disabled={disabled} onPress={() => setImgModalVisible(true)}>
              <Image source={{ uri: img || viewImg }} style={{ width: width, height: height * 0.4 }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={disabled} style={{}} onPress={() => setImgModalVisible(true)}>
              <Image source={require('../assets/images/1-op.jpg')} style={{ width: width, height: height * 0.4 }} />
            </TouchableOpacity>
          )}
        </>
      ) : (
        <>
          {img || viewImg ? (
            <TouchableOpacity disabled={disabled} onPress={() => setImgModalVisible(true)}>
              <Image source={{ uri: img || viewImg }} style={styles.img} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity disabled={disabled} style={{}} onPress={() => setImgModalVisible(true)}>
              <Image source={require('../assets/images/2.jpg')} style={styles.img} />
            </TouchableOpacity>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  img: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
});
