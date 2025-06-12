import React from "react";
import { View, StyleSheet } from "react-native";
import { Dialog, Portal, Button, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const SairScreen = () => {
  const navigation = useNavigation();
  const [visible, setVisible] = React.useState(true);

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    setVisible(false);
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }], 
    });
  };

  const handleCancel = () => {
    setVisible(false);
    navigation.goBack(); 
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleCancel}>
        <Dialog.Title>Deseja sair?</Dialog.Title>
        <Dialog.Content>
          <Paragraph>Você será deslogado do sistema.</Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={handleCancel}>Cancelar</Button>
          <Button onPress={handleLogout}>Sair</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default SairScreen;