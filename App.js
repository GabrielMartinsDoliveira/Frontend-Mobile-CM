import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider as PaperProvider } from "react-native-paper";
import StackNavigator from "./src/navigation/StackNavigator";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaView style={{ flex: 1 }} edges={["bottom"]}>
        <NavigationContainer>
          <StackNavigator />
        </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
  );
}

/*
import React from 'react';
import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Provider as PaperProvider, Appbar, BottomNavigation, FAB, Text, Avatar, List, Divider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from './src/screens/HomeScreen';
import CasosScreen from './src/screens/CasosScreen';
import DashScreen from './src/screens/DashScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';


const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'ForenSeek Mobile' }} />
      <Drawer.Screen name="Casos" component={CasosScreen} options={{ title: 'Casos' }} />
      <Drawer.Screen name="Dash" component={DashScreen} options={{ title: 'Dashboard' }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="MainApp" 
            component={DrawerNavigator} 
            options={{ headerShown: false }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
  */

/*
export default function App() {
  return (
    <PaperProvider>
        <NavigationContainer>
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={HomeScreen} options={{ title: 'ForenSeek Mobile' }} />
          <Drawer.Screen name="Casos" component={CasosScreen} options={{ title: 'Casos' }} />
          <Drawer.Screen name="Dash" component={DashScreen} options={{ title: 'Dashboard' }} />
          <Drawer.Screen name="Settings" component={SettingsScreen} options={{ title: 'Configurações' }} />
        </Drawer.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
  */

/*
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
*/
