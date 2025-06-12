import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios'
import {EvidenceDetailsGET, HeaderReq} from "../api/PathsApi"

const DetalhesEvidenciaScreen = ({ route }) => {
  const { evidenciaIndex } = route.params;
  const [evidencia, setEvidencia] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const carregarEvidencia = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) return;

        const response = await axios(`${EvidenceDetailsGET}/${evidenciaIndex}`, {
          headers: HeaderReq(storedToken),
        });
        setEvidencia(response.data);
      } catch (error) {
        console.error("Erro ao buscar a evidencia:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEvidencia();
  }, []);

  if (!evidencia) {
    return (
      <View style={styles.container}>
        <Text>Carregando evidência...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Detalhes da Evidência</Text>
      <Text style={styles.label}>Tipo:</Text>
      <Text style={styles.text}>{evidencia.tipo}</Text>

      <Text style={styles.label}>Descrição:</Text>
      <Text style={styles.text}>{evidencia.descricao}</Text>

      <Text style={styles.label}>Imagem:</Text>
      {evidencia.imagem && (
        <Image source={{ uri: evidencia.imagem }} style={styles.image} />
      )}

      <Text style={styles.label}>Localização:</Text>
      <Text style={styles.text}>Lat: {evidencia.localColeta?.latitude}</Text>
      <Text style={styles.text}>Lng: {evidencia.localColeta?.longitude}</Text>

      <Text style={styles.label}>Data e Hora:</Text>
      <Text style={styles.text}>{evidencia.dataColeta}</Text>

      <Text style={styles.label}>Caso Relacionado:</Text>
      <Text style={styles.text}>{evidencia.casoRelacionado?.titulo}</Text>

      <Text style={styles.label}>Perito Responsável:</Text>
      <Text style={styles.text}>{evidencia.coletadoPor?.nome}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
  },
  text: {
    marginBottom: 10,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default DetalhesEvidenciaScreen;
// DetalhesEvidenciaScreen.jsx
