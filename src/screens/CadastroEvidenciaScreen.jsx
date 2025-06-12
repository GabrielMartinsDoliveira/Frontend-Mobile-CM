import React, { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Divider,
  Snackbar,
  Appbar,
} from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import { EvidencePOST, HeaderReq } from "../api/PathsApi";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CadastroEvidenciaScreen = () => {
  const route = useRoute();
  const { casoId } = route.params;
  const navigation = useNavigation();
  const [formData, setFormData] = useState({
    idCaso: casoId,
    tipo: "",
    descricao: "",
    dataColeta: new Date(),
    coletadoPor: "", // Deve ser um ObjectId válido
    localColeta: null,
    arquivos: [],
  });

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaType,
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const fileInfo = {
          filename: asset.uri.split("/").pop(),
          path: asset.uri,
          mimetype: asset.type,
          size: asset.fileSize || 0,
        };

        handleChange("arquivos", [...formData.arquivos, fileInfo]);
        showSnackbar("Imagem adicionada com sucesso");
      }
    } catch (error) {
      showSnackbar("Erro ao selecionar imagem");
    }
  };

  const takePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (permission.status !== "granted") {
        showSnackbar("Permissão da câmera negada");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 0.8,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        const fileInfo = {
          filename: asset.uri.split("/").pop(),
          path: asset.uri,
          mimetype: asset.type,
          size: asset.fileSize || 0,
        };

        handleChange("arquivos", [...formData.arquivos, fileInfo]);
        showSnackbar("Foto capturada com sucesso");
      }
    } catch (error) {
      showSnackbar("Erro ao acessar a câmera");
    }
  };

  const getLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        showSnackbar("Permissão de localização negada");
        return;
      }

      setIsLoading(true);
      let location = await Location.getCurrentPositionAsync({});
      handleChange("localColeta", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      showSnackbar("Localização capturada com sucesso");
    } catch (error) {
      showSnackbar("Erro ao obter localização");
    } finally {
      setIsLoading(false);
    }
  };

  const showDatePicker = () => {
    DateTimePickerAndroid.open({
      value: formData.dataColeta,
      onChange: (event, selectedDate) => {
        if (selectedDate) {
          handleChange("dataColeta", selectedDate);
        }
      },
      mode: "datetime",
      is24Hour: true,
    });
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setVisibleSnackbar(true);
  };

  const salvarEvidencia = async () => {
    const token = await AsyncStorage.getItem("token");
    const idUsuario = await AsyncStorage.getItem("idUsuario");
    if (idUsuario) {
      handleChange("coletadoPor", idUsuario);
    }
    const { tipo, descricao, arquivos, localColeta, coletadoPor, idCaso } =
      formData;

    if (
      !tipo ||
      !descricao ||
      arquivos.length === 0 ||
      !localColeta ||
      !idCaso ||
      !coletadoPor
    ) {
      showSnackbar("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      setIsLoading(true);

      const response = await axios.post(EvidencePOST, formData, {
        headers: HeaderReq(token),
      });
      setTimeout(() => {
        navigation.navigate("DetalhesCaso", { casoId: casoId });
      }, 3000);

      if (!response.ok) throw new Error("Erro ao salvar");

      showSnackbar("Evidência cadastrada com sucesso!");

      setFormData({
        idCaso,
        tipo: "",
        descricao: "",
        dataColeta: new Date(),
        coletadoPor: "",
        localColeta: null,
        arquivos: [],
      });
    } catch (error) {
      showSnackbar("Erro ao salvar a evidência");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction
          onPress={() =>
            navigation.navigate("DetalhesCaso", { casoId: casoId })
          }
        />
        <Appbar.Content title="Cadastro de Nova Evidência" />
      </Appbar.Header>
      <Card style={styles.card}>
        <Card.Content>
          <Divider style={styles.divider} />

          <TextInput
            label="ID do Caso *"
            value={formData.idCaso}
            style={styles.input}
            editable={false}
            mode="outlined"
          />

          <TextInput
            label="Tipo da Evidência *"
            value={formData.tipo}
            onChangeText={(text) => handleChange("tipo", text)}
            style={styles.input}
            mode="outlined"
          />

          <TextInput
            label="Descrição *"
            value={formData.descricao}
            onChangeText={(text) => handleChange("descricao", text)}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />

          <TextInput
            label="Data e Hora da Coleta"
            value={formData.dataColeta.toLocaleString()}
            style={styles.input}
            mode="outlined"
            editable={false}
            right={<TextInput.Icon icon="calendar" onPress={showDatePicker} />}
          />

          <Button
            mode="contained"
            onPress={takePhoto}
            style={styles.button}
            icon="camera"
          >
            Tirar Foto
          </Button>

          <Button
            mode="contained"
            onPress={pickImage}
            style={styles.button}
            icon="image"
          >
            Selecionar da Galeria
          </Button>

          <Button
            mode="contained"
            onPress={getLocation}
            style={styles.button}
            icon="map-marker"
            loading={isLoading}
          >
            {formData.localColeta
              ? "Localização Capturada"
              : "Capturar Localização"}
          </Button>

          <Button
            mode="contained"
            onPress={salvarEvidencia}
            style={styles.submitButton}
            loading={isLoading}
            disabled={isLoading}
          >
            Cadastrar Evidência
          </Button>
        </Card.Content>
      </Card>

      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => setVisibleSnackbar(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 60,
  },
  card: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 16,
    textAlign: "center",
  },
  divider: {
    marginBottom: 20,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  button: {
    marginBottom: 16,
    backgroundColor: "#05253E",
  },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#05253E",
  },
});

export default CadastroEvidenciaScreen;
