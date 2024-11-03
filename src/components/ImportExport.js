import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getEncryptedData, getDecryptedData, saveEncryptedData, decryptData } from './Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import * as Sharing from 'expo-sharing';

const ImportExport = ({ visible, onClose, actionType, loadLogins }) => {
    const exportAccounts = async (shouldShare) => {
        try {
            const masterPasswordData = await getDecryptedData('@guardaSenha:masterPassword', false);
            const masterPasswordEnabled = masterPasswordData?.enabled || false;

            const encryptedLogins = await getEncryptedData('@guardaSenha:logins');
            const exportData = {
                masterPassword: masterPasswordEnabled,
                logins: encryptedLogins,
            };

            const jsonContent = JSON.stringify(exportData, null, 2);
            const folderUri = `${FileSystem.documentDirectory}guardaSenha/`;
            const fileName = 'exported_accounts.json';
            const fileUri = `${folderUri}${fileName}`;

            await FileSystem.makeDirectoryAsync(folderUri, { intermediates: true });
            await FileSystem.writeAsStringAsync(fileUri, jsonContent);
            
            if (shouldShare) {
                await Sharing.shareAsync(fileUri, {
                    UTI: 'public.json',
                    dialogTitle: 'Salvar ou Compartilhar o Arquivo',
                });
            } else {
                Alert.alert('Exportação concluída', `Arquivo salvo em: ${fileUri}`);
            }
        } catch (error) {
            console.error('Erro ao exportar contas:', error);
            Alert.alert('Erro', 'Erro ao exportar contas.');
        } finally {
            onClose();
        }
    };

    const importAccounts = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/json',
                copyToCacheDirectory: false,
            });

            if (!result.canceled && result.assets && result.assets.length > 0) {
                const fileUri = result.assets[0].uri;
                const tempUri = `${FileSystem.documentDirectory}temp_imported_accounts.json`;

                await FileSystem.copyAsync({ from: fileUri, to: tempUri });

                const fileContent = await FileSystem.readAsStringAsync(tempUri);

                const importedData = JSON.parse(fileContent);

                if (importedData.logins) {
                    const decryptedLogins = await decryptData(importedData.logins);
                    let savedLogins = await getDecryptedData('@guardaSenha:logins') || [];

                    for (const login of decryptedLogins) {
                        login.id = Date.now();
                        savedLogins.push(login);
                    }

                    await saveEncryptedData('@guardaSenha:logins', savedLogins);
                    loadLogins();
                    Alert.alert('Importação concluída', 'Contas importadas com sucesso.');
                }
            } else {
                Alert.alert('Importação cancelada', 'Nenhum arquivo foi importado.');
            }
        } catch (error) {
            if (error.message === 'DECRYPTION_FAILED') {
                Alert.alert('Erro de Criptografia', 'Erro ao importar contas. Verifique sua Chave Mestre');
            } else {
                Alert.alert('Erro', 'Erro ao importar contas.');
            }
        } finally {
            onClose();
        }
    };

    useEffect(() => {
        if (visible) {
            if (actionType === 'export') {
                Alert.alert(
                    "Exportar Contas",
                    "Deseja salvar localmente ou compartilhar o arquivo?",
                    [
                        { text: "Salvar Localmente", onPress: () => exportAccounts(false) },
                        { text: "Compartilhar", onPress: () => exportAccounts(true) }
                    ]
                );
            } else if (actionType === 'import') {
                importAccounts();
            }
        }
    }, [visible, actionType]);

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <Text>Processando...</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        marginTop: 20,
        backgroundColor: '#293A97',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
    },
});

export default ImportExport;
