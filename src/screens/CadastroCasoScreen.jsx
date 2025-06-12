import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { TextInput, Button, Text, HelperText, Snackbar, Divider } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import { CasePOST, HeaderReq, UserByIdGET } from "../api/PathsApi";
import { useNavigation } from "@react-navigation/native";

const CadastroCasoScreen = () => {
  const [userCase, setUserCase] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const navigation = useNavigation();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        localidade: {
          latitude,
          longitude,
        },
      };
      await axios.post(CasePOST, payload, {
        headers: HeaderReq(await AsyncStorage.getItem("token")),
      });
      setShowSnackbar(true);
      setTimeout(() => navigation.goBack(), 3000);
    } catch (error) {
      console.error("Erro ao criar caso:", error);
    }
  };

  const getUserCase = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const userId = await AsyncStorage.getItem("idUsuario");
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });
      setUserCase(response.data);
      setValue("responsavel", response.data._id);
    } catch (error) {
      console.error("Erro ao buscar usuário:", error);
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permissão de localização negada");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    } catch (error) {
      console.error("Erro ao obter localização:", error);
    }
  };

  useEffect(() => {
    getUserCase();
    getLocation();
    const hoje = new Date().toISOString().split("T")[0];
    setValue("dataAbertura", hoje);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Cadastrar Caso de Perícia</Text>

      <Divider style={{ marginBottom: 16 }} />

      <Controller
        control={control}
        name="responsavel"
        rules={{ required: true }}
        render={({ field: { value } }) => (
          <TextInput
            label="Responsável"
            value={userCase?.nome || "Carregando..."}
            disabled
            style={styles.input}
          />
        )}
      />
      {errors.responsavel && <HelperText type="error">Responsável é obrigatório</HelperText>}

      <Controller
        control={control}
        name="status"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Status (Ex: Em andamento)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {errors.status && <HelperText type="error">Status é obrigatório</HelperText>}

      <Controller
        control={control}
        name="titulo"
        rules={{ required: "Título é obrigatório" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Título"
            value={value}
            onChangeText={onChange}
            style={styles.input}
            error={!!errors.titulo}
          />
        )}
      />
      {errors.titulo && <HelperText type="error">{errors.titulo.message}</HelperText>}

      <Controller
        control={control}
        name="dataAbertura"
        rules={{ required: true }}
        render={({ field: { value } }) => (
          <TextInput
            label="Data de Abertura"
            value={value}
            style={styles.input}
            disabled
          />
        )}
      />

      <Controller
        control={control}
        name="dataOcorrencia"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Data da Ocorrência (YYYY-MM-DD)"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {errors.dataOcorrencia && <HelperText type="error">Data da Ocorrência é obrigatória</HelperText>}

      <Controller
        control={control}
        name="descricao"
        rules={{ required: "Descrição é obrigatória" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Descrição"
            value={value}
            onChangeText={onChange}
            multiline
            numberOfLines={5}
            style={styles.textArea}
          />
        )}
      />
      {errors.descricao && <HelperText type="error">{errors.descricao.message}</HelperText>}

      <Controller
        control={control}
        name="vitima"
        rules={{ required: "A vítima é obrigatória" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="ID da Vítima"
            value={value}
            onChangeText={onChange}
            style={styles.input}
          />
        )}
      />
      {errors.vitima && <HelperText type="error">{errors.vitima.message}</HelperText>}

      <View style={styles.buttonGroup}>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
          style={styles.button}
        >
          Criar Caso
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          Voltar
        </Button>
      </View>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={3000}
      >
        Caso criado com sucesso!
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 16,
  },
  textArea: {
    marginBottom: 16,
    height: 120,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default CadastroCasoScreen;
