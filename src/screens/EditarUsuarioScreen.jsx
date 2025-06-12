import React, { useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Text,
  Card,
  Snackbar,
} from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { HeaderReq, UserPUT } from "../api/PathsApi";

const EditarUsuarioScreen = () => {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const navigation = useNavigation();

  React.useEffect(() => {
    const loadUserData = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      const storedToken = await AsyncStorage.getItem("token");
      setUserId(storedUserId);
      setToken(storedToken);
    };
    loadUserData();
  }, []);

  const handleSubmit = async () => {
    setMessage("");
    setError("");

    if (senha !== confirmacao) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      await axios.put(
        `${UserPUT}/${userId}`,
        { senha },
        { headers: HeaderReq(token) }
      );
      setMessage("Senha atualizada com sucesso!");
      setSenha("");
      setConfirmacao("");
      setVisibleSnackbar(true);
      setTimeout(() => {
        navigation.goBack();
      }, 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Erro ao atualizar senha";
      setError(msg);
    }
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Atualizar Senha" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Nova Senha"
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              autoCapitalize="none"
            />

            <TextInput
              label="Confirmar Senha"
              value={confirmacao}
              onChangeText={setConfirmacao}
              style={styles.input}
              mode="outlined"
              secureTextEntry
              autoCapitalize="none"
            />

            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : (
              <Text style={styles.successText}>{message}</Text>
            )}

            <View style={styles.buttonsContainer}>
              <Button
                mode="contained"
                style={styles.button}
                onPress={handleSubmit}
                disabled={!senha || !confirmacao}
              >
                Atualizar Senha
              </Button>

              <Button
                mode="outlined"
                style={styles.button}
                onPress={() => navigation.goBack()}
              >
                Voltar
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {message}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dee1eb",
  },
  scrollContainer: {
    padding: 16,
    flexGrow: 1,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  buttonsContainer: {
    marginTop: 16,
  },
  button: {
    marginVertical: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
    textAlign: "center",
  },
  successText: {
    color: "green",
    marginBottom: 16,
    textAlign: "center",
  },
  snackbar: {
    backgroundColor: "green",
  },
});

export default EditarUsuarioScreen;