import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Text,
  Card,
  ActivityIndicator,
  Snackbar,
} from "react-native-paper";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EvidenceDetailsGET, HeaderReq, LaudoPOST } from "../api/PathsApi";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const CadastroLaudoScreen = () => {
  const route = useRoute();
  const { idEvidencia } = route.params;
  const navigation = useNavigation();
  const [laudo, setLaudo] = useState({
    evidencia: idEvidencia,
    dataEmissao: new Date().toISOString().split("T")[0],
    descricao: "",
  });
  const [evidenceInfo, setEvidenceInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      setToken(storedToken);
      if (storedToken) {
        getEvidenceInfo(storedToken);
      }
    };
    loadToken();
  }, []);

  const getEvidenceInfo = async (token) => {
    try {
      const response = await axios.get(`${EvidenceDetailsGET}/${idEvidencia}`, {
        headers: HeaderReq(token),
      });
      if (!response) {
        throw new Error("Evidência não encontrada");
      }
      setEvidenceInfo(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setLaudo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${LaudoPOST}`, laudo, {
        headers: HeaderReq(token),
      });

      if (response.status !== 201) {
        throw new Error("Erro ao criar laudo");
      }

      setShowSnackbar(true);
      await generatePDF({
        descricao: laudo.descricao,
        dataEmissao: laudo.dataEmissao,
        tipo: evidenceInfo?.tipo,
        descricaoEvidencia: evidenceInfo?.descricao,
        dataColeta: evidenceInfo?.dataColeta,
      });
      setTimeout(() => {
        navigation.navigate("DetalhesEvidencia", idEvidencia );
      }, 2000);
    } catch (err) {
      setError(err.message);
    }
  };

  const generatePDF = async (data) => {
  const htmlContent = `
    <h1>Laudo Técnico</h1>
    <p><strong>Data de Emissão:</strong> ${data.dataEmissao}</p>
    <p><strong>Tipo de Evidência:</strong> ${data.tipo}</p>
    <p><strong>Descrição da Evidência:</strong> ${data.descricaoEvidencia}</p>
    <p><strong>Data de Coleta:</strong> ${new Date(data.dataColeta).toLocaleDateString("pt-BR")}</p>
    <p><strong>Conteúdo do Laudo:</strong></p>
    <p>${data.descricao}</p>
    <p><em>Gerado em ${new Date().toLocaleString("pt-BR")}</em></p>
  `;

  try {
    const { uri } = await Print.printToFileAsync({
      html: htmlContent,
      base64: false,
    });

    console.log("PDF gerado em:", uri);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      alert("Compartilhamento não está disponível neste dispositivo");
    }

    return uri;
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
  }
};

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    const formattedDate = date.toISOString().split("T")[0];
    handleChange("dataEmissao", formattedDate);
    hideDatePicker();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
        <Text>Carregando informações da evidência...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Erro: {error}</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Voltar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Criar Laudo Técnico" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Card style={styles.card}>
          <Card.Title title="Informações do Laudo" />
          <Card.Content>
            <TextInput
              label="Data de Emissão"
              value={laudo.dataEmissao}
              onFocus={showDatePicker}
              style={styles.input}
              mode="outlined"
            />

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />

            <TextInput
              label="Descrição do Laudo *"
              value={laudo.descricao}
              onChangeText={(text) => handleChange("descricao", text)}
              style={[styles.input, styles.textArea]}
              mode="outlined"
              multiline
              numberOfLines={8}
              placeholder="Descreva detalhadamente as análises realizadas, metodologia utilizada, resultados encontrados e conclusões..."
            />
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Title title="Informações da Evidência" />
          <Card.Content>
            <View style={styles.infoItem}>
              <Text style={styles.label}>ID:</Text>
              <Text style={styles.value}>{evidenceInfo?._id}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Tipo:</Text>
              <Text style={styles.value}>{evidenceInfo?.tipo}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Data de Coleta:</Text>
              <Text style={styles.value}>
                {new Date(evidenceInfo?.dataColeta).toLocaleDateString("pt-BR")}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.label}>Descrição:</Text>
              <Text style={styles.value}>{evidenceInfo?.descricao}</Text>
            </View>
          </Card.Content>
        </Card>

        {error && (
          <Text style={styles.errorText} variant="bodyMedium">
            {error}
          </Text>
        )}

        <View style={styles.buttonsContainer}>
          <Button
            mode="outlined"
            style={styles.button}
            onPress={() => navigation.goBack()}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleSubmit}
            disabled={!laudo.descricao}
          >
            Salvar Laudo
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={showSnackbar}
        onDismiss={() => setShowSnackbar(false)}
        duration={2000}
      >
        Laudo criado com sucesso!
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
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "white",
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  infoItem: {
    flexDirection: "row",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    marginRight: 8,
    width: 100,
  },
  value: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 16,
  },
});

export default CadastroLaudoScreen;
