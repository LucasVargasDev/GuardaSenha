import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ActivityIndicator  } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import Alerta from '../components/Alerta';
import PasswordWizard from '../components/PasswordWizard';
import * as Clipboard from 'expo-clipboard';

export default function ModalCadastro({ visible, onClose, onAdd, onEdit, selectedLogin, viewOnly, logins }) {
    const [sistema, setSistema] = useState('');
    const [login, setLogin] = useState('');
    const [senha, setSenha] = useState('');
    const [senhaSegura, setSenhaSegura] = useState({ color: 'gray', icon: 'shield' });
    const [popupVisible, setPopupVisible] = useState(false);
    const [fontSizeZoom, setFontSizeZoom] = useState(14);
    const [alertaVisible, setAlertaVisible] = useState(false);
    const [alertaTitle, setAlertaTitle] = useState('');
    const [alertaMessage, setAlertaMessage] = useState('');
    const [isPasswordWizardVisible, setPasswordWizardVisible] = useState(false);
    const [generatedPassword, setGeneratedPassword] = useState('');
    const [fontsLoaded] = useFonts({
        'SourceSerif4-Regular': require('../../assets/SourceSerif4-Regular.ttf'),
    });

    useEffect(() => {
        if (selectedLogin) {
            setSistema(selectedLogin.sistema);
            setLogin(selectedLogin.login);
            setSenha(selectedLogin.senha);
            validarSenha(selectedLogin.senha);
        } else {
            resetInputs();
        }
    }, [selectedLogin]);

    const validarSenha = (senha) => {
        if (senha.length === 0) {
            setSenhaSegura({ color: 'gray', icon: 'shield' });
        } else if (senha.length >= 6 && /[A-Z]/.test(senha) && /[0-9]/.test(senha) && /[!@#$%^&*]/.test(senha)) {
            setSenhaSegura({ color: 'green', icon: 'shield-check' });
        } else if (senha.length >= 6 && /[A-Z]/.test(senha) && /[0-9]/.test(senha)) {
            setSenhaSegura({ color: '#d4a017', icon: 'shield' });
        } else {
            setSenhaSegura({ color: 'red', icon: 'shield-x' });
        }
    };

    const isDuplicate = () => {
        return logins && Array.isArray(logins) && logins.some((item) => item.sistema === sistema && item.login === login);
    };
  
    const handleSave = () => {
        if (!sistema || !login || !senha) {
            setAlertaTitle('Erro');
            setAlertaMessage('Todos os campos devem ser preenchidos.');
            setAlertaVisible(true);

            return;
        }

        if (isDuplicate() && !selectedLogin) {
            setAlertaTitle('Erro');
            setAlertaMessage('Essa combinação de sistema e login já existe.');
            setAlertaVisible(true);

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
        setSenhaSegura({ color: 'gray', icon: 'shield' });
    };

    const handleIconPress = () => {
        setPopupVisible(true);
    };

    const closePopup = () => {
        setPopupVisible(false);
    };

    const openPasswordWizard = () => {
        setPasswordWizardVisible(true);
    };

    const handleGeneratePassword = (password) => {
        setGeneratedPassword(password);
        setSenha(password);
        setPasswordWizardVisible(false);
    };

    const zoomSenha = () => {
        setFontSizeZoom(prevSize => (prevSize === 14 ? 20 : 14));
    }

    const handleBackdropPress = () => {
        onClose(); 
        resetInputs(); 
        setFontSizeZoom(14);
    };

    if (!fontsLoaded) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    return (
        <Modal style={styles.container} visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
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
                                {viewOnly ? (
                                    <>
                                        <View style={styles.infoContainer}>
                                            <Text style={styles.label}>
                                                <MaterialIcons name="app-registration" size={16} color="#666" /> Sistema:
                                            </Text>
                                            <Text style={[styles.value, { fontFamily: 'SourceSerif4-Regular' }]}>{sistema}</Text>
                                        </View>

                                        <View style={styles.infoContainer}>
                                            <Text style={styles.label}>
                                                <MaterialIcons name="person" size={16} color="#666" /> Login:
                                            </Text>
                                            <Text style={[styles.value, { fontFamily: 'SourceSerif4-Regular' }]}>{login}</Text>
                                        </View>

                                        <View style={styles.infoContainer}>
                                            <Text style={styles.label}>
                                                <MaterialIcons name="lock" size={16} color="#666" /> Senha:
                                            </Text>
                                            <Text style={[styles.value, { fontSize: fontSizeZoom, fontFamily: 'SourceSerif4-Regular' }]}>{senha}</Text>
                                            {viewOnly && (
                                                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                    <TouchableOpacity style={styles.zoomButton} onPress={zoomSenha}>
                                                        <FontAwesome name="search" size={18} color="white" />
                                                        <Text style={styles.zoomText}>Zoom</Text>
                                                    </TouchableOpacity>

                                                    <TouchableOpacity style={styles.copiarButton} onPress={() => Clipboard.setString(senha)}>
                                                        <FontAwesome name="copy" size={18} color="white" />
                                                        <Text style={styles.copiarText}>Copiar</Text>
                                                    </TouchableOpacity>
                                                </View>
                                )}
                                        </View>
                                    </>
                                ) : (
                                    <>
                                        <View style={styles.inputContainer}>
                                            <View style={styles.rowContainer}>
                                                <MaterialIcons name="business" size={20} color="#666" />
                                                <Text style={styles.inputLabel}>Sistema</Text>
                                            </View>
                                            <TextInput
                                                style={[styles.input, viewOnly && styles.inputViewOnly, { fontFamily: 'SourceSerif4-Regular' }]}
                                                value={sistema}
                                                onChangeText={setSistema}
                                                editable={!viewOnly}
                                                multiline={true}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.rowContainer}>
                                                <MaterialIcons name="person" size={20} color="#666" />
                                                <Text style={styles.inputLabel}>Login</Text>
                                            </View>
                                            <TextInput
                                                style={[styles.input, viewOnly && styles.inputViewOnly, { fontFamily: 'SourceSerif4-Regular' }]}
                                                value={login}
                                                onChangeText={setLogin}
                                                editable={!viewOnly}
                                                autoCapitalize="none"
                                                multiline={true}
                                            />
                                        </View>

                                        <View style={styles.inputContainer}>
                                            <View style={styles.rowContainer}>
                                                <MaterialIcons name="lock" size={20} color="#666" />
                                                <Text style={styles.inputLabel}>Senha</Text>
                                            </View>
                                            <View style={styles.senhaContainer}>
                                                <TextInput
                                                    style={[styles.inputSenha, viewOnly && styles.inputViewOnly, { fontFamily: 'SourceSerif4-Regular', fontSize: fontSizeZoom }]}
                                                    value={senha}
                                                    onChangeText={handleSenhaChange}
                                                    editable={!viewOnly}
                                                    autoCapitalize="none"
                                                    multiline={true}
                                                />
                                                <Octicons
                                                    name={senhaSegura.icon}
                                                    size={20}
                                                    color={senhaSegura.color}
                                                    style={styles.iconeSenha}
                                                    onPress={handleIconPress}
                                                />
                                            </View>
                                        </View>
                                    </>
                                )}

                                {!selectedLogin && (
                                    <TouchableOpacity style={styles.gerarSenhaButton} onPress={openPasswordWizard}>
                                        <FontAwesome name="key" size={18} color="white" />
                                        <Text style={styles.gerarSenhaText}>Gerar</Text>
                                    </TouchableOpacity>
                                )}

                                {!viewOnly && (
                                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                                        <Text style={styles.saveButtonText}>Salvar</Text>
                                    </TouchableOpacity>
                                )}

                                <Alerta
                                    visible={alertaVisible}
                                    onClose={() => setAlertaVisible(false)}
                                    title={alertaTitle}
                                    message={alertaMessage}
                                    isValidationError={true}
                                />

                                <PasswordWizard
                                    visible={isPasswordWizardVisible}
                                    onClose={() => setPasswordWizardVisible(false)}
                                    onGeneratePassword={handleGeneratePassword}
                                />
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
    container: {
        fontFamily: 'SourceSerif4-Regular',
    },
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
        fontFamily: 'SourceSerif4-Regular',
    },
    inputViewOnly: {
        backgroundColor: '#f0f0f0',
        color: '#888',
        fontFamily: 'SourceSerif4-Regular',
    },
    senhaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
    },
    inputSenha: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
        flex: 1,
        paddingRight: 40
    },
    iconeSenha: {
        position: 'absolute',
        right: 15,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
    gerarSenhaButton: {
        backgroundColor: '#2E8B57',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    zoomButton: {
        backgroundColor: '#2E8B57',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
    },
    gerarSenhaText: {
        color: 'white',
        marginLeft: 5,
    },
    zoomText: {
        color: 'white',
        marginLeft: 5,
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
        fontWeight: '600',
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
    infoContainer: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: '#f0f4f8',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 5,
        color: '#333',
    },
    value: {
        fontSize: 14,
        padding: 10,
        backgroundColor: '#ffffff',
        color: '#222',
    },
    inputContainer: {
        marginBottom: 0,
    },
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 3,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 5,
        color: '#666',
    },
    copiarButton: {
        backgroundColor: '#2E8B57',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
        alignSelf: 'flex-end',
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
    },
    copiarText: {
        color: 'white',
        marginLeft: 5,
    },
});
