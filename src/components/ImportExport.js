import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getEncryptedData, getDecryptedData } from './Storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ImportExport = ({ visible, onClose, actionType }) => {
    const exportAccounts = async (shouldShare) => {
        try {
            const savedSettings = await getDecryptedData('@guardaSenha:masterPassword');
            const masterPasswordEnabled = savedSettings?.enabled || false;

            const encryptedLogins = await getEncryptedData('@guardaSenha:logins');
            const exportData = {
                masterPassword: masterPasswordEnabled,
                logins: encryptedLogins,
            };

            const jsonContent = JSON.stringify(exportData, null, 2);
            const folderUri = `${FileSystem.documentDirectory}GuardaSenha/`;
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

    useEffect(() => {
        if (visible && actionType === 'export') {
            Alert.alert(
                "Exportar Contas",
                "Deseja salvar localmente ou compartilhar o arquivo?",
                [
                    { text: "Salvar Localmente", onPress: () => exportAccounts(false) },
                    { text: "Compartilhar", onPress: () => exportAccounts(true) }
                ]
            );
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
                    <Text>Exportando suas contas, aguarde.</Text>
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
