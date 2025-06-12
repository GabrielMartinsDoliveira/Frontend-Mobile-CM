import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { EvidenceDetailsGET, HeaderReq } from "../api/PathsApi";
import { TextInput, Button, Text, Appbar } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";

const DetalhesEvidenciaScreen = ({ route }) => {
  const { evidenciaIndex } = route.params;
  const [evidencia, setEvidencia] = useState(null);
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigator = useNavigation();

  useEffect(() => {
    const carregarEvidencia = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        setToken(storedToken);

        if (!storedToken) return;

        const response = await axios(
          `${EvidenceDetailsGET}/${evidenciaIndex}`,
          {
            headers: HeaderReq(storedToken),
          }
        );
        setEvidencia(response.data);
        console.log(evidencia)
        console.log("Imagem:", evidencia.imagem);
      } catch (error) {
        console.error("Erro ao buscar a evidência:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    carregarEvidencia();
  }, []);

  if (isLoading || !evidencia) {
    return (
      <View style={styles.container}>
        <Text>Carregando evidência...</Text>
      </View>
    );
  }

  return (
    <>
     <Appbar.Header>
        <Appbar.BackAction onPress={()=> navigator.navigate("DetalhesCaso", {casoId: evidencia.casoRelacionado?._id})} />
        <Appbar.Content title="Detalhes da Evidencia" />        
          <Appbar.Action icon="pencil"  />
        
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.container}>
        <TextInput
          label="Tipo"
          value={evidencia.tipo}
          onChangeText={(text) => setEvidencia({ ...evidencia, tipo: text })}
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Descrição"
          value={evidencia.descricao}
          onChangeText={(text) =>
            setEvidencia({ ...evidencia, descricao: text })
          }
          mode="outlined"
          multiline
          style={styles.input}
        />

        <Text style={styles.label}>Imagem:</Text>
        {evidencia.imagem && (
          <Image source={{ uri: evidencia.imagem }} style={styles.image} />
        )}

        <TextInput
          label="Latitude"
          value={String(evidencia.localColeta?.latitude || "")}
          onChangeText={(text) =>
            setEvidencia({
              ...evidencia,
              localColeta: {
                ...evidencia.localColeta,
                latitude: text,
              },
            })
          }
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Longitude"
          value={String(evidencia.localColeta?.longitude || "")}
          onChangeText={(text) =>
            setEvidencia({
              ...evidencia,
              localColeta: {
                ...evidencia.localColeta,
                longitude: text,
              },
            })
          }
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Data e Hora"
          value={evidencia.dataColeta}
          onChangeText={(text) =>
            setEvidencia({ ...evidencia, dataColeta: text })
          }
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Caso Relacionado"
          value={evidencia.casoRelacionado?.titulo || ""}
          onChangeText={(text) =>
            setEvidencia({
              ...evidencia,
              casoRelacionado: {
                ...evidencia.casoRelacionado,
                titulo: text,
              },
            })
          }
          mode="outlined"
          style={styles.input}
        />

        <TextInput
          label="Perito Responsável"
          value={evidencia.coletadoPor?.nome || ""}
          onChangeText={(text) =>
            setEvidencia({
              ...evidencia,
              coletadoPor: {
                ...evidencia.coletadoPor,
                nome: text,
              },
            })
          }
          mode="outlined"
          style={styles.input}
        />
         <Button
          mode="contained"
          onPress={() =>
            navigator.navigate("CadastroLaudo", {
              idEvidencia: evidencia._id,              
            })
          }
          style={styles.button}
        >
          Gerar Laudo
        </Button>

        <Button
          mode="contained"
          onPress={() => navigator.goBack()}
          style={styles.button}
        >
          Voltar
        </Button>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#dee1eb",
    flexGrow: 1,
  },
  title: {
    marginBottom: 15,
  },
  input: {
    marginBottom: 15,
  },
  image: {
    width: "100%",
    height: 200,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 10,
  },
  button: {
    marginTop: 20,
  },
});

export default DetalhesEvidenciaScreen;
