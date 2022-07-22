import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BoldText, LightText, SafeAreaView, TransparentView, View } from '../components/CustomStyled';
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
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TransparentView style={{ width: '90%' }}>
        <ScrollView>
          {/* searchbox */}
          {plants?.map(({ _id, nickname, img }) => (
            <TouchableOpacity key={_id} style={styles.section} onPress={() => {}}>
              <>
                <Image source={{ uri: `data:image/gif;base64,${img}` }} style={{ width: 45, height: 45, borderRadius: 10 }} />
                <BoldText style={{ paddingLeft: 7, alignSelf: 'center', fontSize: 15 }}>{nickname}</BoldText>
              </>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    flexDirection: 'row',
    alignContent: 'center',
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
