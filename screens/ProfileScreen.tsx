import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React, { useContext, useState } from 'react';
import { ScrollView, StyleSheet, Image, TouchableOpacity, Switch } from 'react-native';
import { logout } from '../api';
import { BoldText, SafeAreaView, TransparentView, Text, CustomButton, SignInUpButton } from '../components/CustomStyled';
import { Colors } from '../constants/Constants';
import { Context } from '../Context';

export default function ProfileScreen() {
  const { plantsCtx } = useContext(Context);
  const [plants, setPlants] = plantsCtx;
  const { userCtx } = useContext(Context);
  const [user, setUser] = userCtx;
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  const signOut = () => {
    logout();
    setUser('');
    setPlants('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <TransparentView style={{ width: '90%' }}>
        <ScrollView>
          <TransparentView style={{ alignItems: 'center', marginBottom: 5 }}>
            <Image source={require('../assets/images/2.jpg')} style={styles.img} />
          </TransparentView>
          <TransparentView style={{ alignItems: 'center', marginBottom: 17 }}>
            <BoldText style={{ textTransform: 'capitalize', fontSize: 36 }}>{user.name}</BoldText>
            <Text style={{ fontSize: 14 }}>{user.email}</Text>
          </TransparentView>
          <TransparentView>
            <TouchableOpacity style={[{ padding: 15, backgroundColor: '#333333' }, styles.section]}>
              <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <BoldText>Edit profile</BoldText>
                <MaterialIcons name='edit' size={20} color={Colors.text} />
              </TransparentView>
            </TouchableOpacity>

            <TransparentView style={[{ paddingLeft: 15, backgroundColor: '#333333' }, styles.section]}>
              <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <BoldText>Notifications</BoldText>
                <Switch
                  trackColor={{ false: '#767577', true: '#515151' }}
                  thumbColor={isEnabled ? '#3D3D3D' : '#f4f3f4'}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </TransparentView>
            </TransparentView>
            <TransparentView style={[{ paddingLeft: 15, backgroundColor: '#333333' }, styles.section]}>
              <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <BoldText>Dark mode</BoldText>
                <Switch
                  trackColor={{ false: '#767577', true: '#515151' }}
                  thumbColor={isEnabled ? '#3D3D3D' : '#f4f3f4'}
                  onValueChange={toggleSwitch}
                  value={isEnabled}
                />
              </TransparentView>
            </TransparentView>
            <TouchableOpacity style={[{ paddingHorizontal: 15, paddingVertical: 12, backgroundColor: '#333333' }, styles.section]}>
              <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <BoldText>Sync now</BoldText>
                <MaterialIcons name='sync' size={24} color={Colors.text} />
              </TransparentView>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => signOut()}
              style={[{ paddingHorizontal: 15, paddingVertical: 12, backgroundColor: Colors.button }, styles.section]}
            >
              <TransparentView style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <BoldText>Sign out</BoldText>
                <MaterialIcons name='logout' size={24} color={Colors.text} />
              </TransparentView>
            </TouchableOpacity>
          </TransparentView>
        </ScrollView>
      </TransparentView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
  },
  img: {
    width: 160,
    height: 160,
    borderRadius: 100,
  },
  section: {
    borderRadius: 15,
    marginBottom: 5,
  },
});
