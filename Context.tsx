import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useRef, useState } from 'react';
import { getPlants } from './api';

export const Context = createContext({});

export const Provider = (props: any) => {
  const [user, setUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [plants, setPlants] = useState([]);
  const userRef = useRef('');
  userRef.current = user;
  
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
      return getPlants(userRef.current.token).then(
        async (response) => {
          await AsyncStorage.setItem('plants', JSON.stringify(response.data));
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
        taskCtx: [tasks, setTasks],
        plantCtx: [plants, setPlants],
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
