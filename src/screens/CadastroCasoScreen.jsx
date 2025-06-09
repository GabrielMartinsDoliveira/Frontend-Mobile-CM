import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import {
  TextInput,
  Button,
  Card,
  Title,
  Divider,
  Text,
  HelperText,
  Menu,
  Provider as PaperProvider,
  RadioButton,
  List,
} from "react-native-paper";
import { launchImageLibrary } from "react-native-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

const CadastroCasoPericia = () => {
  const [formData, setFormData] = useState({
    titulo: "",
    id: "",
    responsavel: "",
    status: "em_andamento",
    dataOcorrencia: new Date(),
    dataCadastro: new Date(),
    descricao: "",
    evidencias: [],
  });

  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState("ocorrencia");
  const [responsavelVisible, setResponsavelVisible] = useState(false);

  // Lista de peritos cadastrados (simulando dados)
  const peritos = [
    { id: "1", nome: "Dr. Carlos Silva" },
    { id: "2", nome: "Dra. Ana Oliveira" },
    { id: "3", nome: "Dr. Marcos Souza" },
  ];

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    // Validação e submissão do formulário
    console.log("Dados do caso:", formData);
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      if (pickerMode === "ocorrencia") {
        handleChange("dataOcorrencia", selectedDate);
      } else {
        handleChange("dataCadastro", selectedDate);
      }
    }
  };
  const addEvidencia = () => {
    launchImageLibrary({ mediaType: "photo" }, (response) => {
      if (!response.didCancel && !response.error) {
        const novaEvidencia = response.assets[0].uri;
        setFormData({
          ...formData,
          evidencias: [...formData.evidencias, novaEvidencia],
        });
      }
    });
  };

  /*
  const addEvidencia = () => {
    // Lógica para adicionar evidência (imagem)
    // Pode usar react-native-image-picker ou similar
  };
  */

  return (
    <PaperProvider>
      <ScrollView style={{ padding: 16 }}>
        <Card>
          <Card.Content>
            <Title style={{ marginBottom: 16 }}>
              Cadastro de Caso de Perícia
            </Title>

            {/* Título do Caso */}
            <TextInput
              label="Título do Caso"
              value={formData.titulo}
              onChangeText={(text) => handleChange("titulo", text)}
              mode="outlined"
              error={errors.titulo}
            />
            {errors.titulo && (
              <HelperText type="error">{errors.titulo}</HelperText>
            )}

            {/* ID (pode ser gerado automaticamente) */}
            <TextInput
              label="ID do Caso"
              value={formData.id}
              onChangeText={(text) => handleChange("id", text)}
              mode="outlined"
              style={{ marginTop: 16 }}
              disabled // Se o ID for gerado automaticamente
            />

            {/* Responsável (Menu Dropdown) */}
            <View style={{ marginTop: 16 }}>
              <Text variant="labelLarge">Responsável</Text>
              <Menu
                visible={responsavelVisible}
                onDismiss={() => setResponsavelVisible(false)}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setResponsavelVisible(true)}
                    style={{ marginTop: 8 }}
                  >
                    {formData.responsavel || "Selecione o responsável"}
                  </Button>
                }
              >
                {peritos.map((perito) => (
                  <Menu.Item
                    key={perito.id}
                    onPress={() => {
                      handleChange("responsavel", perito.nome);
                      setResponsavelVisible(false);
                    }}
                    title={perito.nome}
                  />
                ))}
              </Menu>
            </View>

            {/* Status (Radio Buttons) */}
            <View style={{ marginTop: 16 }}>
              <Text variant="labelLarge">Status</Text>
              <RadioButton.Group
                onValueChange={(value) => handleChange("status", value)}
                value={formData.status}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton value="em_andamento" />
                  <Text>Em Andamento</Text>
                </View>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RadioButton value="finalizado" />
                  <Text>Finalizado</Text>
                </View>
              </RadioButton.Group>
            </View>

            {/* Data de Ocorrência */}
            <View style={{ marginTop: 16 }}>
              <Text variant="labelLarge">Data de Ocorrência</Text>
              <Button
                mode="outlined"
                onPress={() => {
                  setPickerMode("ocorrencia");
                  setShowDatePicker(true);
                }}
                style={{ marginTop: 8 }}
              >
                {formData.dataOcorrencia.toLocaleDateString()}
              </Button>
            </View>

            {/* Data de Cadastro */}
            <View style={{ marginTop: 16 }}>
              <Text variant="labelLarge">Data de Cadastro</Text>
              <Button
                mode="outlined"
                onPress={() => {
                  setPickerMode("cadastro");
                  setShowDatePicker(true);
                }}
                style={{ marginTop: 8 }}
              >
                {formData.dataCadastro.toLocaleDateString()}
              </Button>
            </View>

            {showDatePicker && (
              <DateTimePicker
                value={
                  pickerMode === "ocorrencia"
                    ? formData.dataOcorrencia
                    : formData.dataCadastro
                }
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Descrição */}
            <TextInput
              label="Descrição do Caso"
              value={formData.descricao}
              onChangeText={(text) => handleChange("descricao", text)}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={{ marginTop: 16 }}
            />

            {/* Evidências */}
            <View style={{ marginTop: 24 }}>
              <Text variant="titleSmall">Evidências</Text>
              <Divider style={{ marginVertical: 8 }} />

              {formData.evidencias.length > 0 ? (
                <View>
                  {/* Lista de evidências adicionadas */}
                  {formData.evidencias.map((evidencia, index) => (
                    <List.Item
                      key={index}
                      title={`Evidência ${index + 1}`}
                      left={(props) => <List.Icon {...props} icon="image" />}
                    />
                  ))}
                </View>
              ) : (
                <Text style={{ fontStyle: "italic" }}>
                  Nenhuma evidência adicionada
                </Text>
              )}

              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={addEvidencia}
                style={{ marginTop: 16 }}
              >
                Adicionar Evidência
              </Button>
            </View>

            {/* Botão de Submissão */}
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={{ marginTop: 32 }}
            >
              Cadastrar Caso
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </PaperProvider>
  );
};

export default CadastroCasoPericia;
import DateTimePicker from "@react-native-community/datetimepicker";

/*
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CasosScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">TELA DE CASOS E GERENCIAMENTO</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
});
*/
