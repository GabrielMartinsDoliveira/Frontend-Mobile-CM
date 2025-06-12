import React, { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Appbar,
  Card,
  Text,
  Button,
  Divider,
  ActivityIndicator,
  Modal,
  Portal,
  TextInput,
  HelperText,
} from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  CasesDetailsGET,
  CaseUpdatePUT,
  EvidencesGET,
  HeaderReq,
  UserByIdGET,
} from "../api/PathsApi";

const DetalhesCasoScreen = () => {
  const route = useRoute();
  const { casoId } = route.params;
  const navigation = useNavigation();
  const [caseDetail, setCaseDetail] = useState(null);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    status: "",
    dataAbertura: "",
    dataOcorrencia: "",
    dataFechamento: "",
    localidade: {
      latitude: "",
      longitude: "",
    },
  });
  const [evidences, setEvidences] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState({
    ocorrencia: false,
    fechamento: false,
  });

  // Funções de validação de data
  const validateDate = (dateString) => {
    if (!dateString) return true;
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;
    
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  };

  const formatDateInput = (text) => {
    let cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length > 4) {
      cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6, 8)}`;
    } else if (cleaned.length > 2) {
      cleaned = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}`;
    }
    
    return cleaned.slice(0, 10);
  };

  useEffect(() => {
    const loadData = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedUserId = await AsyncStorage.getItem("userId");
      setToken(storedToken);
      setUserId(storedUserId);

      if (casoId) {
        loadCase(storedToken);
        loadEvidences(casoId, storedToken);
        getRoleUser(storedUserId, storedToken);
      }
    };
    loadData();
  }, [casoId]);

  const loadCase = async (token) => {
    try {
      const response = await axios.get(`${CasesDetailsGET}/${casoId}`, {
        headers: HeaderReq(token),
      });
      setCaseDetail(response.data);
      setFormData({
        titulo: response.data.titulo,
        status: response.data.status,
        descricao: response.data.descricao,
        dataAbertura: response.data.dataAbertura?.split("T")[0],
        dataOcorrencia: response.data.dataOcorrencia?.split("T")[0],
        dataFechamento: response.data.dataFechamento?.split("T")[0] || "",
        localidade: {
          latitude: response.data.localidade?.latitude
            ? parseFloat(response.data.localidade.latitude)
            : "",
          longitude: response.data.localidade?.longitude
            ? parseFloat(response.data.localidade.longitude)
            : "",
        },
      });
      setLoading(false);
    } catch (error) {
      console.error("Erro na requisição:", error);
      setError("Erro ao carregar caso");
      setLoading(false);
    }
  };

  const loadEvidences = async (casoId, token) => {
    try {
      const response = await axios.get(`${EvidencesGET}?idCaso=${casoId}`, {
        headers: HeaderReq(token),
      });
      setEvidences(response.data);
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  const getRoleUser = async (userId, token) => {
    try {
      const response = await axios.get(`${UserByIdGET}/${userId}`, {
        headers: HeaderReq(token),
      });
      setUserRole(response.data.role);
    } catch (error) {
      console.error("Erro ao obter role do usuário:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    // Validação das datas
    if (formData.dataOcorrencia && !validateDate(formData.dataOcorrencia)) {
      setError("Formato de data de ocorrência inválido (use AAAA-MM-DD)");
      return;
    }

    if (formData.dataFechamento && !validateDate(formData.dataFechamento)) {
      setError("Formato de data de fechamento inválido (use AAAA-MM-DD)");
      return;
    }

    try {
      const response = await axios.put(`${CaseUpdatePUT}/${casoId}`, formData, {
        headers: HeaderReq(token),
      });
      setCaseDetail(response.data);
      setEditMode(false);
      setShowPopup(true);

      setTimeout(() => {
        setShowPopup(false);
        navigation.navigate("ListaCasos");
      }, 3000);
    } catch (error) {
      console.error("Erro na atualização:", error);
      setError("Erro ao atualizar caso");
    }
  };

  const toggleEditMode = () => {
    setEditMode(!editMode);
    setError(null);
  };

  const handleReturnCases = () => {
    navigation.navigate("ListaCasos");
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    loadCase(token);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  const displayEvidences = () => (
    <View style={styles.evidencesContainer}>
      {evidences &&
        evidences.map((evidence) => (
          <Card key={evidence._id} style={styles.evidenceCard}>
            <Card.Content>
              <Text>
                <Text style={styles.boldText}>Tipo:</Text> {evidence.tipo}
              </Text>
              <Text>
                <Text style={styles.boldText}>Data Coleta:</Text>{" "}
                {formatDate(evidence.dataColeta)}
              </Text>
              <Text>
                <Text style={styles.boldText}>Coletado Por:</Text>{" "}
                {evidence.coletadoPor?.nome || "Desconhecido"}
              </Text>
              <Button
                mode="contained"
                style={styles.evidenceButton}
                onPress={() =>
                  navigation.navigate("DetalhesEvidencia", { evidenciaIndex: evidence._id })
                }
              >
                Ver Evidência
              </Button>
            </Card.Content>
          </Card>
        ))}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  if (error && !editMode) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        {editMode ? (
          <Appbar.BackAction onPress={handleCancelEdit} />
        ) : (
          <Appbar.BackAction onPress={handleReturnCases} />
        )}
        <Appbar.Content title="Detalhes do Caso" />
        {!editMode && userRole !== "assistente" && (
          <Appbar.Action icon="pencil" onPress={toggleEditMode} />
        )}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <Portal>
          <Modal
            visible={showPopup}
            onDismiss={() => setShowPopup(false)}
            contentContainerStyle={styles.modalContainer}
          >
            <Card>
              <Card.Content>
                <Text style={styles.popupText}>
                  Caso atualizado com sucesso!
                </Text>
              </Card.Content>
            </Card>
          </Modal>
        </Portal>

        {editMode ? (
          <Card style={styles.editFormCard}>
            <Card.Content>
              <TextInput
                label="Título"
                value={formData.titulo}
                onChangeText={(text) => handleChange("titulo", text)}
                style={styles.input}
                mode="outlined"
              />

              <TextInput
                label="Descrição"
                value={formData.descricao}
                onChangeText={(text) => handleChange("descricao", text)}
                style={styles.input}
                mode="outlined"
                multiline
                numberOfLines={3}
              />

              <View style={styles.dateInputContainer}>
                <TextInput
                  label="Data de Ocorrência"
                  value={formData.dataOcorrencia}
                  onChangeText={(text) => {
                    const formatted = formatDateInput(text);
                    handleChange("dataOcorrencia", formatted);
                  }}
                  style={[
                    styles.input,
                    !validateDate(formData.dataOcorrencia) && styles.invalidInput
                  ]}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="AAAA-MM-DD"
                  right={
                    <TextInput.Icon
                      icon="calendar"
                      onPress={() => setShowDatePicker({...showDatePicker, ocorrencia: true})}
                    />
                  }
                />
              </View>

              <View style={styles.dateInputContainer}>
                <TextInput
                  label="Data de Fechamento"
                  value={formData.dataFechamento}
                  onChangeText={(text) => {
                    const formatted = formatDateInput(text);
                    handleChange("dataFechamento", formatted);
                  }}
                  style={[
                    styles.input,
                    !validateDate(formData.dataFechamento) && styles.invalidInput
                  ]}
                  mode="outlined"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholder="AAAA-MM-DD"
                  right={
                    <TextInput.Icon
                      icon="calendar"
                      onPress={() => setShowDatePicker({...showDatePicker, fechamento: true})}
                    />
                  }
                />
              </View>

              {showDatePicker.ocorrencia && (
                <DateTimePicker
                  value={new Date(formData.dataOcorrencia || Date.now())}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker({...showDatePicker, ocorrencia: false});
                    if (date) {
                      handleChange("dataOcorrencia", date.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}

              {showDatePicker.fechamento && (
                <DateTimePicker
                  value={new Date(formData.dataFechamento || Date.now())}
                  mode="date"
                  display="default"
                  onChange={(event, date) => {
                    setShowDatePicker({...showDatePicker, fechamento: false});
                    if (date) {
                      handleChange("dataFechamento", date.toISOString().split('T')[0]);
                    }
                  }}
                />
              )}

              {error && <HelperText type="error">{error}</HelperText>}

              <View style={styles.buttonGroup}>
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  style={styles.button}
                  disabled={
                    !validateDate(formData.dataOcorrencia) || 
                    (formData.dataFechamento && !validateDate(formData.dataFechamento))
                  }
                >
                  Salvar
                </Button>
                <Button
                  mode="outlined"
                  onPress={handleCancelEdit}
                  style={styles.button}
                >
                  Cancelar
                </Button>
              </View>
            </Card.Content>
          </Card>
        ) : (
          <>
            <View style={styles.detailsGrid}>
              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Título:</Text>
                  <Text>{caseDetail?.titulo}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Descrição:</Text>
                  <Text>{caseDetail?.descricao}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Status:</Text>
                  <Text>{caseDetail?.status}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Responsável:</Text>
                  <Text>{caseDetail?.responsavel?.nome}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Data Ocorrência:</Text>
                  <Text>{formatDate(caseDetail?.dataOcorrencia)}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Data Abertura:</Text>
                  <Text>{formatDate(caseDetail?.dataAbertura)}</Text>
                </Card.Content>
              </Card>

              <Card style={styles.detailCard}>
                <Card.Content>
                  <Text style={styles.boldText}>Data Fechamento:</Text>
                  <Text>
                    {caseDetail?.dataFechamento
                      ? formatDate(caseDetail.dataFechamento)
                      : "N/A"}
                  </Text>
                </Card.Content>
              </Card>
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleLarge" style={styles.sectionTitle}>Evidências</Text>
            {evidences ? (
              displayEvidences()
            ) : (
              <Text>Carregando evidências...</Text>
            )}

            <View style={styles.actionButtons}>
              <Button
                mode="contained"
                style={styles.actionButton}
                onPress={() =>
                  navigation.navigate("CadastroEvidencia", {
                    casoId: caseDetail?._id,
                  })
                }
              >
                Adicionar Evidência
              </Button>

              {userRole !== "assistente" && (
                <Button
                  mode="contained"
                  style={styles.actionButton}
                  onPress={() =>
                    navigation.navigate("CadastroRelatorio", { casoId: caseDetail?._id })
                  }
                >
                  Gerar Relatório
                </Button>
              )}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#dee1eb",
  },
  content: {
    padding: 16,
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
    padding: 20,
  },
  errorText: {
    color: "red",
    fontSize: 16,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailCard: {
    width: "48%",
    marginBottom: 16,
  },
  boldText: {
    fontWeight: "bold",
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  evidencesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  evidenceCard: {
    width: "100%",
    marginBottom: 16,
  },
  evidenceButton: {
    marginTop: 8,
    backgroundColor: '#05253E'
  },
  actionButtons: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  actionButton: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#05253E'
  },
  editFormCard: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  invalidInput: {
    backgroundColor: '#FFF0F0',
    borderColor: '#FF0000',
  },
  dateInputContainer: {
    position: 'relative',
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
  },
  modalContainer: {
    padding: 20,
  },
  popupText: {
    fontSize: 18,
    textAlign: "center",
  },
});

export default DetalhesCasoScreen;