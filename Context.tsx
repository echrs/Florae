import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useRef, useState } from 'react';
import { getPlants, syncPlants } from './api';
import NetInfo from '@react-native-community/netinfo';

export const Context = createContext({});

export const Provider = (props: any) => {
  const [user, setUser] = useState('');
  const [plants, setPlants] = useState([]);
  const userRef = useRef('');
  userRef.current = user;

  useEffect(() => {
    fetchUser();
    fetchPlants();
  }, []);

  useEffect(() => {
    console.log('plants have changed!');
    saveToStorage();

    async function saveToStorage() {
      await AsyncStorage.setItem('plants', JSON.stringify(plants));
      console.log('saved to storage');
      console.log(plants);
    }
  }, [plants]);

  const fetchUser = async () => {
    var credentials = await AsyncStorage.getItem('userCredentials');
    if (credentials) {
      setUser(JSON.parse(credentials));
    } else setUser('');
  };

  const fetchPlants = async () => {
    var plants = await syncPlantsWDb();

    if (plants?.length) {
      await AsyncStorage.setItem('plants', JSON.stringify(plants));
      setPlants(plants);
    }
  };

  const syncPlantsWDb = async () => {
    var plants = await AsyncStorage.getItem('plants');
    let netInfo = await NetInfo.fetch();
    if (plants?.length) {
      if (netInfo.isConnected) {
        return syncPlants(JSON.parse(plants), userRef.current.token).then(
          async (response) => {
            return response.data;
          },
          (error) => {
            console.log(error);
          }
        );
      } else {
        return JSON.parse(plants);
      }
    } else {
      if (netInfo.isConnected) {
        return getPlants(userRef.current.token).then(
          async (response) => {
            await AsyncStorage.setItem('plants', JSON.stringify(response.data));
            setPlants(response.data);
          },
          (error) => {
            console.log(error);
          }
        );
      }
    }
  };

  return (
    <Context.Provider
      value={{
        userCtx: [user, setUser],
        plantsCtx: [plants, setPlants],
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
