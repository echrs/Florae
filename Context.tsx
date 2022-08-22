import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useEffect, useRef, useState } from 'react';
import { editUser, getPlants, syncPlants } from './api';
import NetInfo from '@react-native-community/netinfo';
import { Colors as ColorsDark, ColorsLight } from './constants/Constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform, ToastAndroid } from 'react-native';
import { getDaysLeft, sort } from './utils';
import * as FileSystem from 'expo-file-system';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export const Context = createContext({} as any);

export const Provider = (props: any) => {
  const [user, setUser] = useState('' as any);
  const [plants, setPlants] = useState([]);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState('on');
  const [Colors, setColors] = useState({ ...ColorsDark });
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    fetchUser();

    async function fetchUser() {
      var credentials = await AsyncStorage.getItem('userCredentials');
      if (credentials) {
        setUser(JSON.parse(credentials));
      } else setUser('');

      var theme = await AsyncStorage.getItem('theme');
      if (theme === 'light') {
        setTheme('light');
        setColors({ ...ColorsLight });
      } else {
        setTheme('dark');
        setColors({ ...ColorsDark });
      }
      var notifications = await AsyncStorage.getItem('notifications');
      if (notifications === 'off') {
        setNotifications('off');
      } else {
        setNotifications('on');
      }
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchPlants();
      checkPlantImgs();
      setupNotifications();
    }

    async function checkPlantImgs() {
      if (plants) {
        plants.forEach(async (plant: any) => {
          if (plant && plant.img) {
            let tmp = await FileSystem.getInfoAsync(plant.img);
            if (!tmp.exists) plant.img = '';
          }
        });
      }
    }

    async function fetchPlants() {
      var plants = await syncPlantsWDb();

      if (plants?.length) {
        await AsyncStorage.setItem('plants', JSON.stringify(plants));
        setPlants(plants);
      }
    }

    async function syncPlantsWDb() {
      var plants = await AsyncStorage.getItem('plants');
      let netInfo = await NetInfo.fetch();
      if (plants?.length) {
        if (netInfo.isConnected) {
          return syncPlants(JSON.parse(plants), user.token).then(
            async (response) => {
              return response.data;
            },
            (error) => {
              console.log(error);
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
              return JSON.parse(plants);
            }
          );
        } else {
          return JSON.parse(plants);
        }
      } else if (plants === null) {
        if (netInfo.isConnected) {
          return getPlants(user.token).then(
            async (response) => {
              await AsyncStorage.setItem('plants', JSON.stringify(response.data));
              setPlants(response.data);
            },
            (error) => {
              console.log(error);
              ToastAndroid.show(error.message, ToastAndroid.SHORT);
            }
          );
        }
      }
    }

    function setupNotifications() {
      registerForPushNotificationsAsync().then((token: any) => setExpoPushToken(token));

      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

      return () => {
        Notifications.removeNotificationSubscription(notificationListener.current);
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }

    async function registerForPushNotificationsAsync() {
      let token;
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
      } else {
        alert('Must use physical device for Push Notifications');
      }

      if (Platform.OS === 'android') {
        Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      return token;
    }
  }, [user.token]);

  useEffect(() => {
    if (user) {
      saveUserToStorage();
      syncUserWDb();
    }
    async function saveUserToStorage() {
      console.log('saved user to storage');
      console.log(user);
      await AsyncStorage.setItem('userCredentials', JSON.stringify(user));
    }
    async function syncUserWDb() {
      let netInfo = await NetInfo.fetch();
      if (netInfo.isConnected) {
        return editUser(user.userId, { name: user.name, email: user.email, img: user.img }, user.token).then(
          async (response) => {
            return response.data;
          },
          (error) => {
            console.log(error);
            ToastAndroid.show(error.message, ToastAndroid.SHORT);
          }
        );
      }
    }
  }, [user.name, user.email, user.img]);

  useEffect(() => {
    if (user) {
      console.log('plants have changed!');
      setPlants(sort(plants));
      saveToStorage();
      schedulePushNotification();
    }

    async function saveToStorage() {
      await AsyncStorage.setItem('plants', JSON.stringify(plants));
      console.log('saved plants to storage');
      console.log(plants);
    }

    async function schedulePushNotification() {
      if (notifications === 'on') {
        let allTasks = plants.flatMap((plant: any) => {
          return plant.tasks.map((task: any) => {
            return { ...task };
          });
        });
        let earliest = allTasks.sort((a, b) => new Date(a.taskDate).getTime() - new Date(b.taskDate).getTime())[0];
        if (earliest) {
          if (getDaysLeft(earliest.taskDate) >= 0) {
            let taskDate = new Date(earliest.taskDate);
            ToastAndroid.show(taskDate.toString(), ToastAndroid.SHORT);
            await Notifications.cancelAllScheduledNotificationsAsync();
            await Notifications.scheduleNotificationAsync({
              content: {
                title: 'Your plants are waiting!',
                body: 'Take care of them.',
              },
              trigger: { date: taskDate },
            });
          }
        }
      }
    }
  }, [plants]);

  return (
    <Context.Provider
      value={{
        userCtx: [user, setUser],
        plantsCtx: [plants, setPlants],
        themeCtx: [theme, setTheme],
        colorsCtx: [Colors, setColors],
        notificationsCtx: [notifications, setNotifications],
      }}
    >
      {props.children}
    </Context.Provider>
  );
};
