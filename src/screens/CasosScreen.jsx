import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
  Appbar,
  TextInput,
  Text,
  Button,
  Menu,
  Divider,
  Chip,
  IconButton,
  Card
} from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import { CasesGET, HeaderReq } from "../api/PathsApi";

const CasosScreen = () => {
  const navigation = useNavigation();
  const [cases, setCases] = useState([]);
  const [responsibleFilter, setResponsibleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  const handleGoToCase = (id) => {
    navigation.navigate("DetalhesCaso", { casoId: id });
  };

  useEffect(() => {
    const loadTokenAndCases = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
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

  const onDismissSingle = useCallback(() => {
    setDatePickerVisible(false);
  }, []);

  const onConfirmSingle = useCallback((params) => {
    if (params?.date) {
      const selectedDate = new Date(params.date);
      setDateFilter(selectedDate);
    }
    setDatePickerVisible(false);
  }, []);

  const isSameDay = (d1, d2) => {
    return (
      d1 &&
      d2 &&
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const filteredCases = cases.filter((item) => {
    const matchesResponsible = item.responsavel.nome
      .toLowerCase()
      .includes(responsibleFilter.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || item.status === statusFilter;

    const itemDate = new Date(item.dataAbertura);
    const matchesDate =
      !dateFilter || (dateFilter instanceof Date && isSameDay(itemDate, dateFilter));

    return matchesResponsible && matchesStatus && matchesDate;
  });

  const clearDateFilter = () => {
    setDateFilter(null);
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

  const formatFilterDate = (date) => {
    return date instanceof Date ? date.toLocaleDateString("pt-BR") : "";
  };

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.navigate("Home")} />
        <Appbar.Content title="Lista de Casos" />
        <Appbar.Action
          icon="plus"
          onPress={() => navigation.navigate("CadastrarCaso")}
        />
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
              value={formatFilterDate(dateFilter)}
              onFocus={() => setDatePickerVisible(true)}
              style={styles.filterInput}
              mode="outlined"
              right={
                dateFilter ? (
                  <TextInput.Icon icon="close" onPress={clearDateFilter} />
                ) : null
              }
              editable={false}
            />

            <DatePickerModal
              locale="pt"
              mode="single"
              visible={datePickerVisible}
              onDismiss={onDismissSingle}
              date={dateFilter}
              onConfirm={onConfirmSingle}
              label="Selecione a data"
              animationType="slide"
              startYear={2000}
              endYear={new Date().getFullYear()}
            />
          </View>
        </View>

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
            <Card key={caso._id} style={styles.card}>
              <Card.Title title={`Caso #${index + 1}`} />
              <Card.Content>
                <Text style={styles.label}>Responsável:</Text>
                <Text>{caso.responsavel.nome}</Text>

                <Text style={styles.label}>Data de Abertura:</Text>
                <Text>{formatDate(caso.dataAbertura)}</Text>

                <Text style={styles.label}>Status:</Text>
                <Chip
                  style={[styles.chip, { backgroundColor: getStatusColor(caso.status) }]}
                  textStyle={{
                    color: caso.status === "Em andamento" ? "#000" : "#fff",
                  }}
                >
                  {caso.status}
                </Chip>
              </Card.Content>
              <Card.Actions style={styles.actions}>
                <IconButton
                  icon="pencil"
                  onPress={() => handleGoToCase(caso._id)}
                  size={20}
                />
              </Card.Actions>
            </Card>
          ))
        )}
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
  card: {
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  chip: {
    marginTop: 4,
    alignSelf: "flex-start",
  },
  label: {
    fontWeight: "bold",
    marginTop: 8,
  },
  actions: {
    justifyContent: "flex-end",
  },
});

export default CasosScreen;
