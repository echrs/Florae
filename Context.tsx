import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useRef, useState } from 'react';
import { getPlants } from './api';

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
    if (plants.length) saveToStorage(); console.log(plants);

    async function saveToStorage() {
      await AsyncStorage.setItem('plants', JSON.stringify(plants));
    }
  }, [plants]);

  const fetchUser = async () => {
    var credentials = await AsyncStorage.getItem('userCredentials');
    if (credentials) {
      setUser(JSON.parse(credentials));
    } else setUser('');
  };

  const fetchPlants = async () => {
    //sync local storage i baze
    //u context
    var plants = await AsyncStorage.getItem('plants');

    if (plants?.length) {
      setPlants(JSON.parse(plants));
    } else {
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
