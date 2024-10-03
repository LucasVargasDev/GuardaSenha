import React, { useEffect } from 'react';
import { View, Text, Alert, AppState, StyleSheet, Platform  } from 'react-native';
import { useFonts } from 'expo-font'; 
import * as LocalAuthentication from 'expo-local-authentication';

export default function AuthScreen({ navigation }) {

  const [fontsLoaded] = useFonts({
    'SourceSerif4-Regular': require('../../assets/SourceSerif4-Regular.ttf'),
  });

  useEffect(() => {
    authenticate();
  }, []);

  const authenticate = async () => {

    if(Platform.OS == "web") {
      navigation.replace('Home');
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const isEnrolled = await LocalAuthentication.isEnrolledAsync();

    if (!hasHardware && !isEnrolled) {
      Alert.alert(
        'Erro',
        'Autenticação não disponível. Por favor, configure a autenticação em seu dispositivo.'
      );
      return;
    }

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Autentique-se para acessar o app',
        cancelLabel: 'Cancelar'
      });

      if (result.success) {
        navigation.replace('Home');
      } else {
        Alert.alert(
          'Erro',
          'Autenticação cancelada. É necessário autenticar-se.',
          [
            {
              text: 'OK',
              onPress: () => authenticate(),
            },
          ],
          { cancelable: false }
        );
      }
    } catch (error) {
      console.error('Erro durante a autenticação:', error);
      Alert.alert('Erro', 'Ocorreu um erro durante a autenticação. Tente novamente.');
    }
  };

  if (!fontsLoaded) {
    return <View style={styles.container}><Text>Carregando fontes...</Text></View>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Aguardando Autenticação...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#293A97', // Cor de fundo
  },
  text: {
    color: '#C8D4F1', // Cor das letras
    fontSize: 18,
    fontFamily: 'SourceSerif4-Regular',
  },
});
