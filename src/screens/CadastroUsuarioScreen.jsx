import { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { Snackbar, Appbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserForm from "../components/UserForm";
import { HeaderReq, UserPOST } from "../api/PathsApi";

const CadastroUsuarioScreen = () => {
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [token, setToken] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
    };
    fetchToken();
  }, []);

  const handleSubmitForm = async (data) => {
    try {
      const response = await axios.post(UserPOST, data, {
        headers: HeaderReq(token),
      });
      console.log("Dados recebidos do formulário:", response.data);

      setShowSnackbar(true);

      setTimeout(() => {
        setShowSnackbar(false);
        navigation.navigate("Home");
      }, 3000);
    } catch (error) {
      console.error("Erro ao registrar usuário:", error);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
        <Appbar.Content title="Cadastro de Novo Usuário" />
      </Appbar.Header>
      <UserForm onSubmit={handleSubmitForm} />
      <View style={styles.container}>
        <Snackbar
          visible={showSnackbar}
          onDismiss={() => setShowSnackbar(false)}
          duration={3000}
        >
          Usuário cadastrado com sucesso!
        </Snackbar>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#dee1eb",
  },
});

export default CadastroUsuarioScreen;
