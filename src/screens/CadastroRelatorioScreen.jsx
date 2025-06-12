import React, { useState, useEffect } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import {
  Appbar,
  TextInput,
  Button,
  Snackbar,
  Text,
  Card,
} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ReportPOST, HeaderReq, CasesDetailsGET } from "../api/PathsApi";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const CadastroRelatorioScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { casoId } = route.params;

  const [token, setToken] = useState("");
  const [caso, setCaso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [pdfPath, setPdfPath] = useState(null);

  const [form, setForm] = useState({
    titulo: "",
    conteudo: "",
    casoReportado: "",
  });

  useEffect(() => {
    const loadTokenAndCaso = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);

        const response = await axios.get(`${CasesDetailsGET}/${casoId}`, {
          headers: HeaderReq(storedToken),
        });

        setCaso(response.data);

        // ✅ Preenche o ID do caso no formulário
        setForm((prev) => ({ ...prev, casoReportado: casoId }));
      } catch (err) {
        setError("Erro ao carregar caso");
      } finally {
        setLoading(false);
      }
    };

    loadTokenAndCaso();
  }, []);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const payload = { ...form };
      const response = await axios.post(ReportPOST, payload, {
        headers: HeaderReq(token),
      });

      if (response.status !== 201) throw new Error("Erro ao salvar relatório");

      await generatePDF(payload);
      setSnackbarVisible(true);
      setTimeout(() => navigation.goBack(), 2500);
    } catch (err) {
      setError(err.message);
    }
  };

  const generatePDF = async (data) => {
    const htmlContent = `
      <h1>${data.titulo}</h1>
      <p><strong>Conteúdo:</strong></p>
      <p>${data.conteudo}</p>
      <p><strong>Caso Relacionado:</strong> ${caso?.titulo || data.casoReportado}</p>
      <p><em>Gerado em ${new Date().toLocaleString("pt-BR")}</em></p>
    `;

    try {
      const { uri } = await Print.printToFileAsync({
        html: htmlContent,
        base64: false,
      });

      console.log("PDF gerado em:", uri);
      setPdfPath(uri); // ✅ Atualiza caminho do PDF

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

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Novo Relatório" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Card style={styles.card}>
          <Card.Title title="Informações do Relatório" />
          <Card.Content>
            {caso?.titulo && (
              <Text style={{ marginBottom: 8, fontWeight: "bold" }}>
                Caso relacionado: {caso.titulo}
              </Text>
            )}
            <TextInput
              label="Título"
              value={form.titulo}
              onChangeText={(text) => handleChange("titulo", text)}
              mode="outlined"
              style={styles.input}
            />
            <TextInput
              label="Conteúdo"
              value={form.conteudo}
              onChangeText={(text) => handleChange("conteudo", text)}
              mode="outlined"
              multiline
              numberOfLines={8}
              style={[styles.input, styles.textArea]}
              placeholder="Descreva o relatório técnico detalhadamente..."
            />
            <TextInput
              label="ID do Caso"
              value={form.casoReportado}
              disabled // ✅ desabilitado porque já está preenchido via route
              mode="outlined"
              style={styles.input}
            />
          </Card.Content>
        </Card>

        {error && <Text style={styles.error}>{error}</Text>}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={styles.button}
          >
            Cancelar
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            disabled={!form.titulo || !form.conteudo || !form.casoReportado}
            style={styles.button}
          >
            Salvar e Gerar PDF
          </Button>
        </View>
      </ScrollView>

      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        Relatório salvo e PDF gerado: {pdfPath?.split("/").pop()}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eef0f5",
  },
  content: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    backgroundColor: "#fff",
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
});

export default CadastroRelatorioScreen;
