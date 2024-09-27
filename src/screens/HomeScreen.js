import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import ModalCadastro from './ModalCadastro';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [logins, setLogins] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLogin, setSelectedLogin] = useState(null);
  const [viewOnly, setViewOnly] = useState(false);

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
        <Text style={styles.headerText}>GuardaSenha</Text>
        <MaterialIcons name="more-vert" size={24} color="#C8D4F1" />
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
    fontSize: 24,
    textAlign: 'left',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginHorizontal: 20,
  },
  iconContainer: {
    marginRight: 10,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
