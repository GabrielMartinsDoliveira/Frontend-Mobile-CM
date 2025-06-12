import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import CasosScreen from "../screens/CasosScreen";
import CadastroCasoScreen from "../screens/CadastroCasoScreen";
import DetalhesCasoScreen from "../screens/DetalhesCasoScreen";
import CadastroUsuarioScreen from "../screens/CadastroUsuarioScreen";
import EditarUsuarioScreen from "../screens/EditarUsuarioScreen";
import SettingsScreen from "../screens/SettingsScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { UserByIdGET, HeaderReq } from "../api/PathsApi";
import { useEffect, useState } from "react";
import CadastroVitimaScreen from "../screens/CadastroVitimaScreen";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function CasosStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ListaCasos" component={CasosScreen} />
      <Stack.Screen name="CadastrarCaso" component={CadastroCasoScreen} />
      <Stack.Screen name="DetalhesCaso" component={DetalhesCasoScreen} />
    </Stack.Navigator>
  );
}

export default function DrawerNavigator() {
  const [role, setRole] = useState(null);

  useEffect(() => {
    async function fetchUserRole() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const idUsuario = await AsyncStorage.getItem("idUsuario");

        if (!idUsuario) {
          console.error("Id do usuário não encontrada:", e);
        }
        const response = await axios.get(`${UserByIdGET}/${idUsuario}`, {
          headers: HeaderReq(storedToken),
        });

        setRole(response.data.role);
      } catch (e) {
        console.error("Erro ao buscar role do usuário:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchUserRole();
  }, []);

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen
        name="Casos"
        component={CasosStack}
        options={{ title: "Casos" }}
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      {role == "admin" && (
        <Drawer.Screen
          name="Cadastrar Usuario"
          component={CadastroUsuarioScreen}
        />
      )}

      <Drawer.Screen name="Atualizar senha" component={EditarUsuarioScreen} />
      <Drawer.Screen name="Cadastrar Vítima" component={CadastroVitimaScreen} />
    </Drawer.Navigator>
  );
}
