import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Platform
} from "react-native";
import {
  TextInput,
  Button,
  Text,
  HelperText,
  Snackbar,
  Divider,
  Menu
} from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as Location from "expo-location";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CasePOST, HeaderReq, PacientsGET, UserByIdGET } from "../api/PathsApi";
import { useNavigation } from "@react-navigation/native";

const CadastroCasoScreen = () => {
  const [userCase, setUserCase] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [vitimas, setVitimas] = useState([]);
  const [vitimaMenuVisible, setVitimaMenuVisible] = useState(false);
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
        localidade: { latitude, longitude },
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

  const getVitimas = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(PacientsGET, {
        headers: HeaderReq(token),
      });
      setVitimas(response.data);
    } catch (error) {
      console.error("Erro ao buscar vítimas:", error);
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
    getVitimas();
    const hoje = new Date().toISOString().split("T")[0];
    setValue("dataAbertura", hoje);
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <Text variant="headlineMedium" style={styles.title}>
        Cadastrar Caso de Perícia
      </Text>
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
          />
        )}
      />

      <Controller
        control={control}
        name="dataAbertura"
        rules={{ required: true }}
        render={({ field: { value } }) => (
          <TextInput
            label="Data de Abertura"
            value={value}
            disabled
            style={styles.input}
          />
        )}
      />

      <Controller
        control={control}
        name="dataOcorrencia"
        rules={{ required: true }}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              label="Data da Ocorrência"
              value={value}
              onFocus={() => setShowDatePicker(true)}
              style={styles.input}
              editable={true}
              right={<TextInput.Icon icon="calendar" />}
            />
            {showDatePicker && (
              <DateTimePicker
                value={value ? new Date(value) : new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    const isoDate = selectedDate.toISOString().split("T")[0];
                    onChange(isoDate);
                  }
                }}
              />
            )}
          </>
        )}
      />

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
            style={[styles.input, styles.textArea]}
          />
        )}
      />

      <Controller
        control={control}
        name="vitima"
        rules={{ required: "A vítima é obrigatória" }}
        render={({ field: { onChange, value } }) => (
          <View>
            <Menu
              visible={vitimaMenuVisible}
              onDismiss={() => setVitimaMenuVisible(false)}
              anchor={
                <TextInput
                  label="Selecione a Vítima"
                  value={
                    vitimas.find((v) => v._id === value)?.dataCadastro || "Selecionar"
                  }
                  style={styles.input}
                  onFocus={() => setVitimaMenuVisible(true)}
                />
              }
            >
              {vitimas.map((v) => (
                <Menu.Item
                  key={v._id}
                  onPress={() => {
                    onChange(v._id);
                    setVitimaMenuVisible(false);
                  }}
                  title={v.dataCadastro}
                />
              ))}
            </Menu>
          </View>
        )}
      />

      <Button
        mode="outlined"
        onPress={getLocation}
        style={styles.input}
        icon="map-marker"
      >
        Obter Localização Atual
      </Button>
    

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
          mode="contained"
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
    backgroundColor: "#dee1eb",
    flexGrow: 1,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
  },
  textArea: {
    height: 120,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: "#05253E",
    color:'#ffff'
  },
});

export default CadastroCasoScreen;
