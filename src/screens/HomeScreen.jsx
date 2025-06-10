import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Card } from 'react-native-paper';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Card style={styles.card} elevation={6}>
        <Card.Content>
          <Text variant="headlineLarge" style={styles.title}>
            Bem-vindo ao ForenSeek Mobile!
          </Text>
          <Text style={styles.subtitle}>
            Acompanhe evidências, casos e laudos de forma eficiente e moderna.
          </Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    backgroundColor: '#ffffffee',
    borderRadius: 16,
    padding: 20,
  },
  title: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 4,
  },
});