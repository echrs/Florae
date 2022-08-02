import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';
import { getPlants } from './api';

export const Context = createContext({});

export const Provider = (props: any) => {
  const [user, setUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetchUser();
    fetchPlants();
  }, []);

  const fetchUser = async () => {
    var credentials = await AsyncStorage.getItem('userCredentials');
    if (credentials) {
      setUser(JSON.parse(credentials));
    } else setUser('');
  };

  const fetchPlants = async () => {
    var plants = await AsyncStorage.getItem('plants');
    if (!plants) {
      // return getPlants(token).then(
      //   async (response) => {
      //     console.log(response);
      //     await AsyncStorage.setItem('plants', JSON.stringify(response));
      //   },
      //   (error) => {
      //     console.log(error);
      //   }
      // );
    }
  };

  return (
    <Context.Provider
      value={{
        userCtx: [user, setUser],
        taskCtx: [tasks, setTasks],
        plantCtx: [plants, setPlants],
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
