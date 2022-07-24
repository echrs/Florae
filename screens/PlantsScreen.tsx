import { Fontisto, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, View } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { PlantsTabParamList, TabsParamList } from '../types';
import { SearchBar } from '@rneui/themed';

type PlantsScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<PlantsTabParamList, 'Plants'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantsScreen({ navigation, route }: PlantsScreenNavigationProp) {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    setSearch(search);
  };
  
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
          <SearchBar
            containerStyle={{
              backgroundColor: Colors.background,
              borderTopColor: Colors.background,
              borderBottomColor: Colors.background,
              borderRadius: 0,
            }}
            placeholder='Type here...'
            onChangeText={updateSearch}
            value={search}
          />
          {plants?.map(({ _id, nickname, img }) => (
            <TouchableOpacity key={_id} style={styles.section} onPress={() => {}}>
              <TransparentView style={{ flexDirection: 'row' }}>
                <Image source={{ uri: img }} style={{ width: 50, height: 50, borderRadius: 10 }} />
                <BoldText style={{ paddingLeft: 7, alignSelf: 'center', fontSize: 15 }}>{nickname}</BoldText>
              </TransparentView>
              <TransparentView style={{ alignSelf: 'center', flexDirection: 'row' }}>
                <Fontisto style={{ paddingTop: 2.5 }} name='blood-drop' size={15} color={Colors.text} />
                <MaterialIcons name='bolt' size={20} color={Colors.text} />
                <Fontisto style={{ paddingTop: 2.5 }} name='asterisk' size={15} color={Colors.text} />
              </TransparentView>
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
    justifyContent: 'space-between',
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
