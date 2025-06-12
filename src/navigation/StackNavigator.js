import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Screens
import LoginScreen from "../screens/LoginScreen";
import DrawerNavigator from "./DrawerNavigator";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CadastroCasoScreen from "../screens/CadastroCasoScreen";
import CadastroEvidenciaScreen from "../screens/CadastroEvidenciaScreen";
import CadastroLaudoScreen from "../screens/CadastroLaudoScreen";
import CasosScreen from "../screens/CasosScreen";
import DetalhesCasoScreen from "../screens/DetalhesCasoScreen";
import DetalhesEvidenciaScreen from "../screens/DetalhesEvidenciaScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
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

      {/* navegação interna */}
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="CadastroCaso" component={CadastroCasoScreen} />
      <Stack.Screen
        name="CadastroEvidencia"
        component={CadastroEvidenciaScreen}
      />
      <Stack.Screen name="CadastroLaudo" component={CadastroLaudoScreen} />
      <Stack.Screen name="Casos" component={CasosScreen} />
      <Stack.Screen name="DetalhesCaso" component={DetalhesCasoScreen} />
      <Stack.Screen
        name="DetalhesEvidencia"
        component={DetalhesEvidenciaScreen}
      />
    </Stack.Navigator>
  );
}
