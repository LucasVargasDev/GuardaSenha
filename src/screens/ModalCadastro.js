import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function ModalCadastro({ visible, onClose, onAdd, onEdit, selectedLogin, viewOnly }) {
  const [sistema, setSistema] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');

  useEffect(() => {
    if (selectedLogin) {
      setSistema(selectedLogin.sistema);
      setLogin(selectedLogin.login);
      setSenha(selectedLogin.senha);
    } else {
      setSistema('');
      setLogin('');
      setSenha('');
    }
  }, [selectedLogin]);

  const handleSave = () => {
    const loginData = { id: selectedLogin ? selectedLogin.id : Date.now(), sistema, login, senha };
    if (selectedLogin) {
      onEdit(loginData);
    } else {
      onAdd(loginData);
    }
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          <View style={styles.header}>
            <TouchableOpacity onPress={onClose}>
              <MaterialIcons name="arrow-back" size={24} color="#C8D4F1" />
            </TouchableOpacity>
            <Text style={styles.headerText}>{viewOnly ? 'Visualizar' : selectedLogin ? 'Editar' : 'Adicionar'} Login</Text>
            <MaterialIcons name="more-vert" size={24} color="#C8D4F1" />
          </View>

          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Sistema"
              value={sistema}
              onChangeText={setSistema}
              editable={!viewOnly}
            />
            <TextInput
              style={styles.input}
              placeholder="Login"
              value={login}
              onChangeText={setLogin}
              editable={!viewOnly}
            />
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              editable={!viewOnly}
            />

            {!viewOnly && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
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
    flex: 1,
    marginLeft: 10,
  },
  modalContent: {
    padding: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  saveButton: {
    backgroundColor: '#293A97',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
