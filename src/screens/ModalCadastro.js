import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons'; // Importando Octicons
import { FontAwesome } from '@expo/vector-icons'; // Importando FontAwesome para o ícone de senha

export default function ModalCadastro({ visible, onClose, onAdd, onEdit, selectedLogin, viewOnly }) {
  const [sistema, setSistema] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaSegura, setSenhaSegura] = useState({ color: 'gray', icon: 'shield' }); // Estado da cor e ícone do input
  const [popupVisible, setPopupVisible] = useState(false); // Estado para o popup de informações

  const [fontSizeZoom, setFontSizeZoom] = useState(14);

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
    const letrasMaiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const letrasMinusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const caracteresEspeciais = '!@#$%^&*';
    
    // Garantindo que a senha tenha pelo menos uma letra maiúscula, um número e um caractere especial
    let novaSenha = '';
    novaSenha += letrasMaiusculas[Math.floor(Math.random() * letrasMaiusculas.length)];
    novaSenha += numeros[Math.floor(Math.random() * numeros.length)];
    novaSenha += caracteresEspeciais[Math.floor(Math.random() * caracteresEspeciais.length)];
    
    // Gerando o restante da senha para ter entre 6 a 8 caracteres
    const todosOsCaracteres = letrasMaiusculas + letrasMinusculas + numeros + caracteresEspeciais;
    const tamanhoRestante = Math.floor(Math.random() * 3) + 3; // Para que a senha total tenha entre 6 e 8 caracteres
  
    for (let i = 0; i < tamanhoRestante; i++) {
      const indice = Math.floor(Math.random() * todosOsCaracteres.length);
      novaSenha += todosOsCaracteres[indice];
    }
  
    // Embaralhando a senha para que os caracteres obrigatórios não fiquem em posições fixas
    novaSenha = novaSenha.split('').sort(() => 0.5 - Math.random()).join('');
  
    setSenha(novaSenha);
    validarSenha(novaSenha); // Validar a nova senha gerada
  };

  const zoomSenha = () => {
    setFontSizeZoom(prevSize => (prevSize === 14 ? 24 : 14));
  }

  const handleBackdropPress = () => {
    onClose(); 
    resetInputs(); 
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <TouchableWithoutFeedback onPress={handleBackdropPress}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modalContainer}>
  
              <View style={styles.header}>
                <TouchableOpacity onPress={() => { onClose(); resetInputs(); }}>
                  <MaterialIcons name="arrow-back" size={24} color="#C8D4F1" />
                </TouchableOpacity>
                <Text style={styles.headerText}>{viewOnly ? 'Visualizar' : selectedLogin ? 'Editar' : 'Adicionar'} Conta</Text>
              </View>
  
              <View style={styles.modalContent}>
                <TextInput
                  style={[styles.input, viewOnly && styles.inputViewOnly]}
                  placeholder="Sistema"
                  value={sistema}
                  onChangeText={setSistema}
                  editable={!viewOnly}
                />
                <TextInput
                  style={[styles.input, viewOnly && styles.inputViewOnly]}
                  placeholder="Login"
                  value={login}
                  onChangeText={setLogin}
                  editable={!viewOnly}
                />

                <View style={styles.senhaContainer}>
                  <TextInput
                    style={[styles.inputSenha, viewOnly && styles.inputViewOnly, { fontSize:  fontSizeZoom}]}
                    placeholder="Senha"
                    value={senha}
                    onChangeText={handleSenhaChange}
                    editable={!viewOnly}
                  />
                  <Octicons
                    name={senhaSegura.icon}
                    size={20} // Ajuste o tamanho conforme necessário
                    color={senhaSegura.color}
                    style={styles.iconeSenha}
                    onPress={handleIconPress}
                  />
                </View>
  
                {!selectedLogin && (
                  <TouchableOpacity style={styles.gerarSenhaButton} onPress={gerarSenhaSegura}>
                    <FontAwesome name="key" size={18} color="white" />
                    <Text style={styles.gerarSenhaText}>Gerar</Text>
                  </TouchableOpacity>
                )}

                {viewOnly && (
                  <TouchableOpacity style={styles.zoomButton} onPress={zoomSenha}>
                    <FontAwesome name="search" size={18} color="white" />
                    <Text style={styles.zoomText}>Zoom</Text>
                  </TouchableOpacity>
                )}
  
                {!viewOnly && (
                  <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Salvar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
  
      {popupVisible && (
        <Modal transparent={true} visible={popupVisible} animationType="fade">
          <View style={styles.popupOverlay}>
            <View style={styles.popupContainer}>
              <Text style={styles.popupText}>Segurança da Senha</Text>
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
    fontSize: 18,
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
  inputViewOnly: {
    backgroundColor: '#f0f0f0', // Cor de fundo leve
    color: '#888', // Cor do texto em modo de visualização
  },
  senhaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative', // Permite que o ícone seja posicionado relativamente ao container
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
    right: 15, // Ajuste conforme necessário
    top: '50%', // Alinha verticalmente ao centro
    transform: [{ translateY: -12 }], // Ajuste para centralizar verticalmente
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
  zoomButton: {
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
  zoomText: {
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
