import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { BoldText, SafeAreaView, TransparentView, Text } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { PlantsTabParamList, TabsParamList } from '../types';
import { SearchBar } from '@rneui/themed';
import { Context } from '../Context';

type PlantsScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<PlantsTabParamList, 'Plants'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantsScreen({ navigation, route }: PlantsScreenNavigationProp) {
  const { plantsCtx } = useContext(Context);
  const [plants] = plantsCtx;
  const [filteredPlants, setFilteredPlants] = useState([]);
  const [search, setSearch] = useState('');

  const updateSearch = (search: any) => {
    if (search) {
      let filteredItems = plants.filter((item: any) => {
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
      setSearch('');
    });

    async function getAndSetPlants() {
      setFilteredPlants(plants);
    }
  }, [plants]);

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
            placeholderTextColor={Colors.placeholder}
            inputContainerStyle={{
              borderRadius: 15,
              backgroundColor: Colors.section,
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
                  style={{ marginLeft: 5 }}
                  onPress={() => {
                    navigation.navigate('Plant');
                  }}
                >
                  <MaterialCommunityIcons name='plus-circle' size={24} color={Colors.text} />
                </TouchableOpacity>
              </TransparentView>
            </TransparentView>
            {filteredPlants?.reverse().map((plant: any) => (
              <TouchableOpacity
                key={plant._id}
                style={styles.plant}
                onPress={() => {
                  navigation.navigate('Plant', { plant: plant });
                }}
              >
                <TransparentView style={{ flexDirection: 'row' }}>
                  {plant.img ? (
                    <Image source={{ uri: plant.img }} style={styles.img} />
                  ) : (
                    <Image source={require('../assets/images/1-op.jpg')} style={styles.img} />
                  )}
                  <Text style={{ paddingLeft: 10, alignSelf: 'center', fontSize: 15 }}>{plant.nickname}</Text>
                </TransparentView>
              </TouchableOpacity>
            ))}
            {(!filteredPlants || !filteredPlants.length) && <Text>There are currently none!</Text>}
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
    paddingTop: 60,
  },
  section: {
    backgroundColor: Colors.section,
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 50,
  },
  plant: {
    backgroundColor: Colors.innerSection,
    padding: 10,
    borderRadius: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
