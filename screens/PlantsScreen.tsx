import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, View } from '../components/CustomStyled';
import { PlantsTabParamList, TabsParamList } from '../types';

type PlantsScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<PlantsTabParamList, 'Plants'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantsScreen({ navigation, route }: PlantsScreenNavigationProp) {
  const [plants, setPlants] = useState([]);
  useEffect(() => {
    navigation.addListener('focus', () => {
      getAndSetPlants();
    });

    async function getAndSetPlants() {
      let plantsStorage = await AsyncStorage.getItem('plants');
      setPlants(JSON.parse(plantsStorage));
      console.log(JSON.parse(plantsStorage));
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TransparentView style={{ width: '90%' }}>
        {plants?.map(({ _id, nickname, img }) => (
          <TouchableOpacity key={_id} style={styles.section} onPress={() => {}}>
            <>
              <Image source={{ uri: `data:image/gif;base64,${img}` }} style={{ width: 20, height: 20 }} />
              <BoldText>{nickname}</BoldText>
            </>
          </TouchableOpacity>
        ))}
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
