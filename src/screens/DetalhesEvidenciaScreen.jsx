import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DetalhesEvidenciaScreen = ({ route }) => {
  const { evidenciaIndex } = route.params;
  const [evidencia, setEvidencia] = useState(null);

  useEffect(() => {
    const carregarEvidencia = async () => {
      const dados = await AsyncStorage.getItem('evidencias');
      const evidencias = dados ? JSON.parse(dados) : [];
      setEvidencia(evidencias[evidenciaIndex]);
    };
    carregarEvidencia();
  }, [evidenciaIndex]);

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
      <Text style={styles.text}>Lat: {evidencia.localizacao?.latitude}</Text>
      <Text style={styles.text}>Lng: {evidencia.localizacao?.longitude}</Text>

      <Text style={styles.label}>Data e Hora:</Text>
      <Text style={styles.text}>{evidencia.dataHora}</Text>

      <Text style={styles.label}>Caso Relacionado:</Text>
      <Text style={styles.text}>{evidencia.casoRelacionado}</Text>

      <Text style={styles.label}>Perito Responsável:</Text>
      <Text style={styles.text}>{evidencia.peritoResponsavel}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10
  },
  text: {
    marginBottom: 10
  },
  image: {
    width: '100%',
    height: 200,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 10
  }
});

export default DetalhesEvidenciaScreen;
// DetalhesEvidenciaScreen.jsx