import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Appbar,
  TextInput,
  DataTable,
  Text,
  Button,
  Menu,
  Divider,
  Chip,
  IconButton,
  Portal,
  Modal,
} from "react-native-paper";
import { CasesGET, HeaderReq } from "../api/PathsApi";

const CasosScreen = () => {
  const navigation = useNavigation();
  const [cases, setCases] = useState([]);
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState("");
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const handleGoToCase = (id) => {
    navigation.navigate("DetalhesCasoScreen", { id });
  };

  useEffect(() => {
    const loadTokenAndCases = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) return;

        const response = await axios(CasesGET, {
          headers: HeaderReq(storedToken),
        });
        setCases(response.data);
      } catch (error) {
        console.error("Erro ao buscar casos:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadTokenAndCases();
  }, []);

  const filteredCases = cases.filter((item) => {
    const matchesResponsible = item.responsavel.nome
      .toLowerCase()
      .includes(responsibleFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const matchesDate =
      !dateFilter ||
      new Date(item.dataAbertura).toISOString().split("T")[0] === dateFilter;

    return matchesResponsible && matchesStatus && matchesDate;
  });

  const clearDateFilter = () => {
    setDateFilter("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Em andamento":
        return "#ffc107";
      case "Finalizado":
        return "#28a745";
      case "Arquivado":
        return "#6c757d";
      default:
        return "#f8f9fa";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Casos" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.filtersContainer}>
          <TextInput
            label="Filtrar por responsável"
            value={responsibleFilter}
            onChangeText={setResponsibleFilter}
            style={styles.filterInput}
            mode="outlined"
          />

          <Menu
            visible={statusMenuVisible}
            onDismiss={() => setStatusMenuVisible(false)}
            anchor={
              <Button
                mode="outlined"
                onPress={() => setStatusMenuVisible(true)}
                style={styles.filterInput}
                contentStyle={{ justifyContent: "space-between" }}
              >
                {statusFilter === "all" ? "Todos status" : statusFilter}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setStatusFilter("all");
                setStatusMenuVisible(false);
              }}
              title="Todos status"
            />
            <Divider />
            <Menu.Item
              onPress={() => {
                setStatusFilter("Em andamento");
                setStatusMenuVisible(false);
              }}
              title="Em andamento"
            />
            <Menu.Item
              onPress={() => {
                setStatusFilter("Finalizado");
                setStatusMenuVisible(false);
              }}
              title="Finalizado"
            />
            <Menu.Item
              onPress={() => {
                setStatusFilter("Arquivado");
                setStatusMenuVisible(false);
              }}
              title="Arquivado"
            />
          </Menu>

          <View style={styles.dateFilterContainer}>
            <TextInput
              label="Data de abertura"
              value={dateFilter}
              onFocus={() => setDatePickerVisible(true)}
              style={styles.filterInput}
              mode="outlined"
              right={
                dateFilter ? (
                  <TextInput.Icon icon="close" onPress={clearDateFilter} />
                ) : null
              }
            />
          </View>

          <Portal>
            <Modal
              visible={datePickerVisible}
              onDismiss={() => setDatePickerVisible(false)}
              contentContainerStyle={styles.modalContainer}
            >
              <View style={styles.datePickerModal}>
                <Button
                  mode="contained"
                  onPress={() => {
                    const today = new Date().toISOString().split("T")[0];
                    setDateFilter(today);
                    setDatePickerVisible(false);
                  }}
                >
                  Hoje
                </Button>
                <Button
                  mode="outlined"
                  onPress={() => {
                    setDateFilter("");
                    setDatePickerVisible(false);
                  }}
                  style={{ marginTop: 10 }}
                >
                  Limpar
                </Button>
              </View>
            </Modal>
          </Portal>
        </View>

        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Responsável</DataTable.Title>
            <DataTable.Title>Data Abertura</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title numeric>Ações</DataTable.Title>
          </DataTable.Header>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator animating={true} size="large" />
              <Text style={styles.loadingText}>Carregando casos...</Text>
            </View>
          ) : filteredCases.length === 0 ? (
            <View style={styles.noResultsContainer}>
              <Text>Nenhum caso encontrado</Text>
            </View>
          ) : (
            filteredCases.map((caso, index) => (
              <DataTable.Row key={caso._id}>
                <DataTable.Cell>{index + 1}</DataTable.Cell>
                <DataTable.Cell>{caso.responsavel.nome}</DataTable.Cell>
                <DataTable.Cell>{formatDate(caso.dataAbertura)}</DataTable.Cell>
                <DataTable.Cell>
                  <Chip
                    style={{ backgroundColor: getStatusColor(caso.status) }}
                    textStyle={{
                      color: caso.status === "Em andamento" ? "#000" : "#fff",
                    }}
                  >
                    {caso.status}
                  </Chip>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <IconButton
                    icon="pencil"
                    onPress={() => handleGoToCase(caso._id)}
                    size={20}
                  />
                </DataTable.Cell>
              </DataTable.Row>
            ))
          )}
        </DataTable>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterInput: {
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  dateFilterContainer: {
    position: "relative",
  },
  table: {
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
  },
  loadingContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 10,
  },
  noResultsContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  datePickerModal: {
    padding: 20,
  },
});

export default CasosScreen;
