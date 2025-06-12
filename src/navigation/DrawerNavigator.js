import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../screens/HomeScreen";
import CasosScreen from "../screens/CasosScreen";
import CadastroCasoScreen from "../screens/CadastroCasoScreen";
import DetalhesCasoScreen from "../screens/DetalhesCasoScreen";
import SettingsScreen from "../screens/SettingsScreen";

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
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen 
        name="Casos" 
        component={CasosStack} 
        options={{ title: 'Casos' }} 
      />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      <Drawer.Screen name="Cadastrar Usuario" component={UserRegister}/>
      <Drawer.Screen name="Atualizar senha" component={passworUpdate}/>
    </Drawer.Navigator>
  );
}


//hhh