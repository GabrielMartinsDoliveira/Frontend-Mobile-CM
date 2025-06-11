import { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";
import { TextInput, Button, Card, Text } from "react-native-paper";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { LoginPOST } from "../api/PathsApi";
import logo from "../../assets/ForenSeek.png";

const LoginScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      matricula: "",
      senha: "",
    },
  });

  const navigation = useNavigation();

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = await AsyncStorage.getItem("token");
  //     if (token) {
  //       navigation.navigate("Home");
  //     }
  //   };
  //   checkToken();
  // }, []);

  const onSubmit = async (data) => {
    try {
      clearErrors();

      const response = await axios.post(LoginPOST, {
        matricula: data.matricula,
        senha: data.senha,
      });

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        await AsyncStorage.setItem("userId", String(response.data.user.id));
        navigation.navigate("MainApp");
      }
    } catch (err) {
      const message =
        err?.response?.data?.message || "Erro ao conectar com o servidor";
      setError("root", { type: "server", message });
      console.error("Erro no login:", err);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Image source={logo} style={styles.logo} resizeMode="contain" />

          {errors.root && (
            <Text style={styles.errorText}>{errors.root.message}</Text>
          )}

          <Controller
            control={control}
            name="matricula"
            rules={{ required: "Matrícula é obrigatória" }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Matrícula"
                mode="outlined"
                value={value}
                onChangeText={onChange}
                error={!!errors.matricula}
                style={styles.input}
              />
            )}
          />
          {errors.matricula && (
            <Text style={styles.errorText}>{errors.matricula.message}</Text>
          )}

          <Controller
            control={control}
            name="senha"
            rules={{
              required: "Senha é obrigatória",
              minLength: {
                value: 6,
                message: "Senha deve ter pelo menos 6 caracteres",
              },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Senha"
                mode="outlined"
                secureTextEntry
                value={value}
                onChangeText={onChange}
                error={!!errors.senha}
                style={styles.input}
              />
            )}
          />
          {errors.senha && (
            <Text style={styles.errorText}>{errors.senha.message}</Text>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
          >
            Entrar
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    justifyContent: "center",
    padding: 16,
  },
  card: {
    padding: 16,
    elevation: 4,
    borderRadius: 12,
  },
  logo: {
    width: "100%",
    height: 100,
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
  },
  errorText: {
    color: "red",
    marginBottom: 8,
  },
});
