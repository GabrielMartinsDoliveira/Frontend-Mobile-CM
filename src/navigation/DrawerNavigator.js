import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from '../screens/HomeScreen';
import CasosScreen from '../screens/CasosScreen';
import DashScreen from '../screens/DashScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Casos" component={CasosScreen} />
      <Drawer.Screen name="Dash" component={DashScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
