import { Fontisto, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, Text } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { PlantsTabParamList, TabsParamList } from '../types';
import { SearchBar } from '@rneui/themed';

type PlantsScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<PlantsTabParamList, 'Plants'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantsScreen({ navigation, route }: PlantsScreenNavigationProp) {
  const [plants, setPlants] = useState([]);
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [search, setSearch] = useState('');

  const updateSearch = (search) => {
    if (search) {
      let filteredItems = plants.filter((item) => {
        let nickname = item.nickname ? item.nickname.toLowerCase() : ''.toLowerCase();
        return nickname.indexOf(search.toLowerCase()) > -1;
      });
      setFilteredPlants(filteredItems);
      setSearch(search);
    } else {
      setFilteredPlants(plants);
      setSearch(search);
    }
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      getAndSetPlants();
    });

    async function getAndSetPlants() {
      let plantsStorage = await AsyncStorage.getItem('plants');
      setPlants(JSON.parse(plantsStorage));
      setFilteredPlants(JSON.parse(plantsStorage));
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TransparentView style={{ width: '90%' }}>
        <ScrollView>
          <SearchBar
            containerStyle={{
              borderTopColor: Colors.background,
              borderBottomColor: Colors.background,
              padding: 0,
              backgroundColor: Colors.background,
            }}
            inputContainerStyle={{
              borderRadius: 15,
              backgroundColor: Colors.other,
            }}
            inputStyle={{
              color: Colors.text,
              fontSize: 15,
            }}
            leftIconContainerStyle={{
              paddingLeft: 5,
              paddingRight: 0,
            }}
            placeholder='Search for plants'
            onChangeText={(text) => updateSearch(text)}
            value={search}
          />
          <TransparentView style={styles.section}>
            <TransparentView style={{ flexDirection: 'row', marginBottom: 10 }}>
              <BoldText style={{ fontSize: 20 }}>All plants</BoldText>
              <TransparentView>
                <TouchableOpacity
                  style={{ marginLeft: 5, marginTop: 3 }}
                  onPress={() => {
                    navigation.navigate('NewPlant');
                  }}
                >
                  <MaterialCommunityIcons name='plus-circle' size={24} color={Colors.text} />
                </TouchableOpacity>
              </TransparentView>
            </TransparentView>
            {filteredPlants?.map(({ _id, nickname, img }) => (
              <TouchableOpacity key={_id} style={styles.plant} onPress={() => {}}>
                <TransparentView style={{ flexDirection: 'row' }}>
                  {img ? (
                    <Image source={{ uri: img }} style={styles.img} />
                  ) : (
                    <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                  )}
                  <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{nickname}</Text>
                </TransparentView>
                <TransparentView style={{ alignSelf: 'center', flexDirection: 'row' }}>
                  <Fontisto style={{ paddingTop: 2.5 }} name='blood-drop' size={15} color={Colors.text} />
                  <MaterialIcons name='bolt' size={20} color={Colors.text} />
                  <Fontisto style={{ paddingTop: 2.5 }} name='asterisk' size={15} color={Colors.text} />
                </TransparentView>
              </TouchableOpacity>
            ))}
            {!filteredPlants && <Text>There are currently none!</Text>}
          </TransparentView>
        </ScrollView>
      </TransparentView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  img: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 70,
  },
  section: {
    backgroundColor: '#333333',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 50,
  },
  plant: {
    backgroundColor: '#3D3D3D',
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
