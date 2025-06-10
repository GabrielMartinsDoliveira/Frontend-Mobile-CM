import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const CadastroEvidenciaScreen = () => {
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [imagem, setImagem] = useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  const [dataHora, setDataHora] = useState(new Date().toISOString());
  const [casoRelacionado, setCasoRelacionado] = useState('');
  const [peritoResponsavel, setPeritoResponsavel] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      setImagem(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão negada', 'Não foi possível acessar a localização.');
      return;
    }
    let location = await Location.getCurrentPositionAsync({});
    setLocalizacao(location.coords);
  };

  const salvarEvidencia = async () => {
    if (!tipo || !descricao || !imagem || !localizacao || !casoRelacionado || !peritoResponsavel) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    const novaEvidencia = {
      tipo,
      descricao,
      imagem,
      localizacao,
      dataHora,
      casoRelacionado,
      peritoResponsavel
    };

    try {
      const dados = await AsyncStorage.getItem('evidencias');
      const evidencias = dados ? JSON.parse(dados) : [];
      evidencias.push(novaEvidencia);
      await AsyncStorage.setItem('evidencias', JSON.stringify(evidencias));
      Alert.alert('Sucesso', 'Evidência cadastrada com sucesso!');
      setTipo(''); setDescricao(''); setImagem(null); setLocalizacao(null); setCasoRelacionado(''); setPeritoResponsavel('');
    } catch (error) {
      Alert.alert('Erro', 'Falha ao salvar a evidência.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Tipo da Evidência:</Text>
      <TextInput style={styles.input} value={tipo} onChangeText={setTipo} placeholder="Ex: Dente, Objeto..." />

      <Text style={styles.label}>Descrição:</Text>
      <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} multiline />

      <Text style={styles.label}>Imagem:</Text>
      <TouchableOpacity onPress={pickImage} style={styles.uploadBtn}>
        <Text>{imagem ? 'Imagem Selecionada' : 'Selecionar Imagem'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Localização:</Text>
      <TouchableOpacity onPress={getLocation} style={styles.uploadBtn}>
        <Text>{localizacao ? 'Localização Capturada' : 'Capturar Localização'}</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Data e Hora:</Text>
      <TextInput style={styles.input} value={dataHora} editable={false} />

      <Text style={styles.label}>Caso Relacionado:</Text>
      <TextInput style={styles.input} value={casoRelacionado} onChangeText={setCasoRelacionado} placeholder="ID ou nome do caso" />

      <Text style={styles.label}>Perito Responsável:</Text>
      <TextInput style={styles.input} value={peritoResponsavel} onChangeText={setPeritoResponsavel} />

      <Button title="Cadastrar Evidência" onPress={salvarEvidencia} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 60,
    backgroundColor: '#fff'
  },
  label: {
    fontWeight: 'bold',
    marginTop: 15
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginTop: 5
  },
  uploadBtn: {
    backgroundColor: '#eee',
    padding: 10,
    marginTop: 5,
    alignItems: 'center',
    borderRadius: 5
  }
});

export default CadastroEvidenciaScreen;
