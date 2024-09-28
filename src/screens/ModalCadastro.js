import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons'; // Importando Octicons
import { FontAwesome } from '@expo/vector-icons'; // Importando FontAwesome para o ícone de senha

export default function ModalCadastro({ visible, onClose, onAdd, onEdit, selectedLogin, viewOnly }) {
  const [sistema, setSistema] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaSegura, setSenhaSegura] = useState({ color: 'gray', icon: 'shield' }); // Estado da cor e ícone do input
  const [popupVisible, setPopupVisible] = useState(false); // Estado para o popup de informações

  useEffect(() => {
    if (selectedLogin) {
      setSistema(selectedLogin.sistema);
      setLogin(selectedLogin.login);
      setSenha(selectedLogin.senha);
      validarSenha(selectedLogin.senha); // Muda o ícone na tela de visualização também
    } else {
      resetInputs();
    }
  }, [selectedLogin]);

  const validarSenha = (senha) => {
    if (senha.length === 0) {
      setSenhaSegura({ color: 'gray', icon: 'shield' }); // Reset para cinza quando o input estiver vazio
    } else if (senha.length >= 6 && /[A-Z]/.test(senha) && /[0-9]/.test(senha) && /[!@#$%^&*]/.test(senha)) {
      setSenhaSegura({ color: 'green', icon: 'shield-check' }); // Senha segura
    } else if (senha.length >= 6 && /[A-Z]/.test(senha) && /[0-9]/.test(senha)) {
      setSenhaSegura({ color: '#d4a017', icon: 'shield' }); // Senha parcialmente segura (amarelo escuro)
    } else {
      setSenhaSegura({ color: 'red', icon: 'shield-x' }); // Senha não segura
    }
  };

  const handleSave = () => {
    if (!sistema || !login || !senha) {
      alert('Todos os campos devem ser preenchidos.');
      return;
    }

    const loginData = { id: selectedLogin ? selectedLogin.id : Date.now(), sistema, login, senha };
    if (selectedLogin) {
      onEdit(loginData);
    } else {
      onAdd(loginData);
    }
    resetInputs();
    onClose();
  };

  const handleSenhaChange = (text) => {
    setSenha(text);
    validarSenha(text);
  };

  const resetInputs = () => {
    setSistema('');
    setLogin('');
    setSenha('');
    setSenhaSegura({ color: 'gray', icon: 'shield' }); // Resetar para cinza
  };

  const handleIconPress = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const gerarSenhaSegura = () => {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let novaSenha = '';
    for (let i = 0; i < 12; i++) { // Gerar senha de 12 caracteres
      const indice = Math.floor(Math.random() * caracteres.length);
      novaSenha += caracteres[indice];
    }
    setSenha(novaSenha);
    validarSenha(novaSenha); // Validar a nova senha gerada
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>

          <View style={styles.header}>
            <TouchableOpacity onPress={() => { onClose(); resetInputs(); }}>
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
            <View style={styles.senhaContainer}>
              <TextInput
                style={styles.inputSenha}
                placeholder="Senha"
                value={senha}
                onChangeText={handleSenhaChange}
                editable={!viewOnly}
              />
              <Octicons
                name={senhaSegura.icon}
                size={24}
                color={senhaSegura.color}
                style={styles.iconeSenha}
                onPress={handleIconPress}
              />
            </View>

            <TouchableOpacity style={styles.gerarSenhaButton} onPress={gerarSenhaSegura}>
              <FontAwesome name="key" size={18} color="white" />
              <Text style={styles.gerarSenhaText}>Gerar</Text> {/* Texto "Gerar" adicionado */}
            </TouchableOpacity>

            {!viewOnly && (
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Salvar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {popupVisible && (
          <Modal transparent={true} visible={popupVisible} animationType="fade">
            <View style={styles.popupOverlay}>
              <View style={styles.popupContainer}>
                <Text style={styles.popupText}>Segurança da Senha:</Text>
                <Text style={styles.popupInfo}>
                  <Octicons name="shield-check" size={16} color="green" /> Verde: Senha segura (mín. 6 caracteres, 1 maiúscula, 1 número, 1 especial)
                </Text>
                <Text style={styles.popupInfo}>
                  <Octicons name="shield" size={16} color="#d4a017" /> Amarelo: Parcialmente segura (mín. 6 caracteres, 1 maiúscula, 1 número)
                </Text>
                <Text style={styles.popupInfo}>
                  <Octicons name="shield-x" size={16} color="red" /> Vermelho: Não segura (não atende aos requisitos mínimos acima)
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={closePopup}>
                  <Text style={styles.closeButtonText}>Fechar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        )}
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
    width: '100%',
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputSenha: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 5,
    flex: 1,
  },
  iconeSenha: {
    position: 'absolute',
    right: 10,
  },
  gerarSenhaButton: {
    backgroundColor: '#2E8B57', // Verde escuro
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginTop: 10, // Espaço acima do botão
    alignSelf: 'flex-end', // Alinha o botão à direita
    flexDirection: 'row',
    alignItems: 'center',
  },
  gerarSenhaText: {
    color: 'white',
    marginLeft: 5, // Espaço entre o ícone e o texto
  },
  saveButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  popupOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  popupText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  popupInfo: {
    marginVertical: 5,
  },
  closeButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: 'white',
  },
});
