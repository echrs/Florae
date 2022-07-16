import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useState } from 'react';

export const Context = createContext({});

export const Provider = (props: any) => {
  const [user, setUser] = useState('');
  const [tasks, setTasks] = useState([]);
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    var credentials = await AsyncStorage.getItem('userCredentials');
    if (credentials) setUser(JSON.parse(credentials)); 
    else setUser('');
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
