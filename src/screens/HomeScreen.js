import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ModalCadastro from './ModalCadastro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font'; 

export default function HomeScreen() {
  const [logins, setLogins] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

  const [fontsLoaded] = useFonts({
    'Shanti-Regular': require('../../assets/Shanti-Regular.ttf'), // Verifique o caminho
  });

  useEffect(() => {
    const loadLogins = async () => {
      try {
        const savedLogins = await AsyncStorage.getItem('logins');
        if (savedLogins !== null) {
          setLogins(JSON.parse(savedLogins));
        }
      } catch (error) {
        console.error("Erro ao carregar os logins", error);
      }
    };

    loadLogins();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  const saveLogins = async (newLogins) => {
    try {
      await AsyncStorage.setItem('logins', JSON.stringify(newLogins));
      setLogins(newLogins);
    } catch (error) {
      console.error("Erro ao salvar os logins", error);
    }
  };

  const handleAddLogin = (login) => {
    const newLogins = [...logins, login];
    saveLogins(newLogins);
  };

  const handleEditLogin = (updatedLogin) => {
    const newLogins = logins.map((item) => 
      item.id === updatedLogin.id ? updatedLogin : item
    );
    saveLogins(newLogins);
  };

  const handleDeleteLogin = (id) => {
    const newLogins = logins.filter((item) => item.id !== id);
    saveLogins(newLogins);
  };

  const openModal = (login, isViewOnly = false) => {
    setSelectedLogin(login);
    setViewOnly(isViewOnly);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedLogin(null);
    setModalVisible(false);
    setViewOnly(false);
  };

  const renderItem = ({ item }) => (
    <View style={styles.loginContainer}>
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <Text style={styles.iconText}>{item.sistema[0]}</Text>
        </View>
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.systemText}>{item.sistema}</Text>
        <Text style={styles.loginText} numberOfLines={1} ellipsizeMode="tail">{item.login}</Text>
      </View>

      <View style={styles.iconsContainer}>
        <TouchableOpacity onPress={() => openModal(item, true)}>
          <MaterialIcons name="visibility" size={24} color="#4F4F4F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => openModal(item)}>
          <MaterialIcons name="edit" size={24} color="#4F4F4F" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteLogin(item.id)}>
          <MaterialIcons name="delete" size={24} color="#4F4F4F" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#293A97" />

      <View style={styles.header}>
        <Text style={[styles.headerText, { fontFamily: 'Shanti-Regular' }]}>GuardaSenha</Text>
        <View style={styles.iconContainer}>
          <MaterialIcons name="search" size={24} color="#C8D4F1"/>
          <MaterialIcons name="more-vert" size={24} color="#C8D4F1"/>
        </View>
      </View>

      <FlatList
        data={logins}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />

      <TouchableOpacity style={styles.floatingButton} onPress={() => openModal(null)}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

      <ModalCadastro
        visible={modalVisible}
        onClose={closeModal}
        onAdd={handleAddLogin}
        onEdit={handleEditLogin}
        selectedLogin={selectedLogin}
        viewOnly={viewOnly}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#293A97',
    paddingVertical: 20,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#C8D4F1',
    fontSize: 28,
    textAlign: 'left',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15, // Ajusta o padding vertical
    paddingHorizontal: 15, // Adiciona padding horizontal para mover tudo para a esquerda
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff', // Cor de fundo branca
    borderRadius: 0, // Bordas arredondadas
    marginTop: 2,
    marginBottom: 5, // Espaço entre os itens
    shadowColor: '#000', // Cor da sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2, // Opacidade da sombra
    shadowRadius: 4, // Raio da sombra
    elevation: 5, // Para Android
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end', 
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#293A97',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  textContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  systemText: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#4F4F4F',
  },
  loginText: {
    fontSize: 16,
    color: '#666',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 90,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#293A97',
    width: 'auto', // Ajuste para auto
    height: 60,
    borderRadius: 20,
    flexDirection: 'row', // Para alinhar texto e ícone
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15, // Adiciona espaço ao redor do conteúdo
  },
  buttonText: {
    color: 'white',
    marginLeft: 10, // Espaço entre o ícone e o texto
    fontSize: 16,
  },
});