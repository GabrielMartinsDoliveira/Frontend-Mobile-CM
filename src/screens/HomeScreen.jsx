import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">Bem-vindo ao ForenSeek Mobile!</Text>
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