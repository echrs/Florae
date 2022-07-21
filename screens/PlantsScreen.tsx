import AsyncStorage from '@react-native-async-storage/async-storage';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { BoldText, View } from '../components/CustomStyled';
import { PlantsTabParamList, TabsParamList } from '../types';

type PlantsScreenNavigationProp = CompositeScreenProps<NativeStackScreenProps<PlantsTabParamList, 'Plants'>, BottomTabScreenProps<TabsParamList>>;

export default function PlantsScreen({ navigation, route }: PlantsScreenNavigationProp) {
  const [plants, setPlants] = useState();
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
    <View style={styles.container}>
      <BoldText>{plants}</BoldText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
