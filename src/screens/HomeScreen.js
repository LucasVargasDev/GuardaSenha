import React, { useState, useEffect, useRef } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import ModalCadastro from './ModalCadastro';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts } from 'expo-font'; 
import Alerta from '../components/Alerta'; 
import ActionSheet from 'react-native-actions-sheet';

export default function HomeScreen() {
    const [logins, setLogins] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedLogin, setSelectedLogin] = useState(null);
    const [viewOnly, setViewOnly] = useState(false);
    const [alertaVisible, setAlertaVisible] = useState(false);
    const [isValidationError, setIsValidationError] = useState(false);
    const [alertaTitle, setAlertaTitle] = useState('');
    const [alertaMessage, setAlertaMessage] = useState('');
    const [loginToDelete, setLoginToDelete] = useState(null);
    const actionSheetRef = useRef(null);
    const [fontsLoaded] = useFonts({
        'Shanti-Regular': require('../../assets/Shanti-Regular.ttf'),
        'SourceSerif4-Regular': require('../../assets/SourceSerif4-Regular.ttf'),
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
        const newLogins = logins.map((item) => item.id === updatedLogin.id ? updatedLogin : item);
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

    const confirmDeleteLogin = (id) => {
        setLoginToDelete(id);
        setAlertaTitle("Confirmar Exclusão");
        setAlertaMessage("Você tem certeza que deseja excluir esta conta?");
        setAlertaVisible(true);
    };

    const handleAlertClose = () => {
        setAlertaVisible(false);
        setLoginToDelete(null);
    };

    const handleAlertConfirm = () => {
        handleDeleteLogin(loginToDelete);
        handleAlertClose();
    };

    const openActionSheet = (login) => {
        setSelectedLogin(login);
        actionSheetRef.current?.setModalVisible(true);
    };

    const showUnavailableAlert = () => {
        setAlertaTitle("Opção Indisponível");
        setAlertaMessage("As opções de filtro e configurações gerais ainda não estão disponíveis na versão beta 1.");
        setAlertaVisible(true);
        setIsValidationError(true);
    };

    const renderItem = ({ item }) => (
        <View style={styles.loginContainer}>
            <View style={styles.iconContainer}>
                <View style={styles.iconCircle}>
                    <Text style={styles.iconText}>{item.sistema[0]}</Text>
                </View>
            </View>

            <View style={styles.textContainer}>
                <Text style={styles.systemText} numberOfLines={1} ellipsizeMode="tail">{item.sistema}</Text>
                <Text style={styles.loginText} numberOfLines={1} ellipsizeMode="tail">{item.login}</Text>
            </View>

            <View style={styles.iconsContainer}>
                <TouchableOpacity onPress={() => openModal(item, true)}>
                    <MaterialIcons name="visibility" size={24} color="#4F4F4F" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openActionSheet(item)} style={styles.optionIcon}>
                    <Ionicons name="options-outline" size={24} color="#4F4F4F" />
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
                    <MaterialIcons name="search" size={24} color="#C8D4F1" onPress={() => showUnavailableAlert()}/>
                    <MaterialIcons name="more-vert" size={24} color="#C8D4F1" onPress={() => showUnavailableAlert()}/>
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
                logins={logins}
            />

            <Alerta
                visible={alertaVisible}
                onClose={handleAlertClose}
                title={alertaTitle}
                message={alertaMessage}
                onConfirm={handleAlertConfirm}
                onCancel={handleAlertClose}
                isValidationError={isValidationError}
            />

            <ActionSheet ref={actionSheetRef}>
                <View style={styles.actionSheetContainer}>
                    <TouchableOpacity
                        style={styles.actionOption}
                        onPress={() => {
                            actionSheetRef.current?.setModalVisible(false);
                            openModal(selectedLogin);
                        }}
                    >
                        <Text style={styles.actionText}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionOption}
                        onPress={() => {
                            actionSheetRef.current?.setModalVisible(false);
                            confirmDeleteLogin(selectedLogin.id);
                        }}
                    >
                        <Text style={styles.actionText}>Remover</Text>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily: 'SourceSerif4-Regular',
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
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        marginBottom: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
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
        fontSize: 16,
        color: '#4F4F4F',
        fontFamily: 'SourceSerif4-Regular',
    },
    loginText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'SourceSerif4-Regular',
    },
    iconsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: 90,
    },
    optionIcon: {
        marginLeft: 10,
    },
    floatingButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#293A97',
        width: 'auto',
        height: 60,
        borderRadius: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    buttonText: {
        color: 'white',
        marginLeft: 10,
        fontSize: 16,
    },
    actionSheetContainer: {
        padding: 20,
    },
    actionOption: {
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    actionText: {
        fontSize: 18,
        color: '#333',
    },
});