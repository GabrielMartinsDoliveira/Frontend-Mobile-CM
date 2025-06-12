import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Text,
  RadioButton,
  Card,
  Snackbar,
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { UserByIdGET, HeaderReq, PacientPOST } from "../api/PathsApi";
import { useNavigation } from "@react-navigation/native";


const CadastroVitimaScreen = () => {
  const [responsavel, setResponsavel] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const navigation = useNavigation();
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      peritoResponsavel: "",
      NIC: "identificado",
      nome: "",
      genero: "",
      idade: "",
      documento: "",
      endereco: "",
      etnia: "",
      odontograma: "",
      regiaoAnatomicas: "",
    },
  });

  useEffect(() => {
    async function fetchPerito() {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const idUsuario = await AsyncStorage.getItem("idUsuario");

        if (!idUsuario) {
          console.error("Id do usuário não encontrada:", e);
        }
        const response = await axios.get(`${UserByIdGET}/${idUsuario}`, {
          headers: HeaderReq(storedToken),
        });

        setResponsavel(response.data);
      } catch (e) {
        console.error("Erro ao buscar role do usuário:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchPerito();
  }, []);

  const onSubmit = async (data) => {
    try {
      if (!responsavel?._id) {
        throw new Error("Perito responsável não definido");
      }

      const payload = {
        ...data,
        peritoResponsavel: responsavel._id,
        dataCadastro: new Date().toISOString(),
        idade: data.idade ? Number(data.idade) : undefined
      };

      const response = await axios.post(PacientPOST, payload, {
        headers: HeaderReq(await AsyncStorage.getItem("token")),
      });
      
      setErrMessage("");
      setShowSnackbar(true);
      setTimeout(() => navigation.goBack(), 3000);
    } catch (err) {
      const message = err.response?.data?.message || err.message || "Erro ao cadastrar";
      setErrMessage(message);
      setShowSnackbar(true);
      console.error("Erro detalhado:", err.response?.data || err);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title="Cadastro de Vítima" />
        <Card.Content>
          {/* Perito Responsável */}
          <Controller
            control={control}
            name="peritoResponsavel"            
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Perito Responsável"
                mode="hidden"
                value={responsavel._id}
                error={!!errors.peritoResponsavel}
                style={styles.input}
              />
            )}
          />
          {errors.peritoResponsavel && (
            <Text style={styles.error}>{errors.peritoResponsavel.message}</Text>
          )}

          {/* NIC */}
          <Text style={styles.label}>NIC</Text>
          <Controller
            control={control}
            name="NIC"
            render={({ field: { onChange, value } }) => (
              <RadioButton.Group onValueChange={onChange} value={value}>
                <RadioButton.Item label="Identificado" value="identificado" />
                <RadioButton.Item
                  label="Não identificado"
                  value="não identificado"
                />
              </RadioButton.Group>
            )}
          />

          {/* Nome */}
          <Controller
            control={control}
            name="nome"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Nome"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          {/* Gênero */}
          <Controller
            control={control}
            name="genero"
            rules={{ required: "Campo obrigatório" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Gênero"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.genero}
                style={styles.input}
              />
            )}
          />
          {errors.genero && (
            <Text style={styles.error}>{errors.genero.message}</Text>
          )}

          {/* Idade */}
          <Controller
            control={control}
            name="idade"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Idade"
                mode="outlined"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(val) => onChange(parseInt(val) || "")}
                style={styles.input}
              />
            )}
          />

          {/* Documento */}
          <Controller
            control={control}
            name="documento"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Documento"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          {/* Endereço */}
          <Controller
            control={control}
            name="endereco"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Endereço"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          {/* Etnia */}
          <Controller
            control={control}
            name="etnia"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Etnia"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          {/* Odontograma */}
          <Controller
            control={control}
            name="odontograma"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Odontograma"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          {/* Região Anatômica */}
          <Controller
            control={control}
            name="regiaoAnatomicas"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Regiões Anatômicas"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                style={styles.input}
              />
            )}
          />

          {/* Botão */}
          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
          >
            Cadastrar Vítima
          </Button>
          <Button
            mode="contained"
            loading={isSubmitting}
            disabled={isSubmitting}
            onPress={() => navigation.navigate("Home")}
            style={styles.button}
          >
            Voltar
          </Button>
        </Card.Content>
      </Card>
      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
      >
        Vítima cadastrada!
      </Snackbar>
    </ScrollView>
  );
};

export default CadastroVitimaScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#dee1eb",
    flexGrow: 1,
  },
  card: {
    borderRadius: 10,
    padding: 10,
  },
  input: {
    marginBottom: 12,
  },
  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: "bold",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  button: {
    marginTop: 16,
  },
});
