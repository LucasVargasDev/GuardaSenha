import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Ajusta a cor da StatusBar para preto */}
      <StatusBar barStyle="light-content" backgroundColor="#293A97" />
      
      {/* Cabeçalho com o título GuardaSenha */}
      <View style={styles.header}>
        <Text style={styles.headerText}>GuardaSenha</Text>
      </View>
      
      {/* Corpo da tela */}
      <View style={styles.body}>
        <Text>Hello World</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#293A97', // Fundo azul
    paddingVertical: 20,
    paddingHorizontal: 10,
    justifyContent: 'center',
  },
  headerText: {
    color: '#C8D4F1', // Cor do texto
    fontSize: 24, // Tamanho da fonte
    textAlign: 'left', // Texto alinhado à esquerda
  },
  body: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Fundo branco no corpo
  },
});
