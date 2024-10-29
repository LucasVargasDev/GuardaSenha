import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { saveEncryptedData, getDecryptedData } from './Storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

const ImportExport = ({ visible, onClose, actionType }) => {
    const exportAccounts = async () => {
        try {
            const savedLogins = await getDecryptedData('@guardaSenha:logins');

            console.log(savedLogins);
            const accountsData = JSON.parse(savedLogins) || [];
            const jsonContent = JSON.stringify(accountsData, null, 2);
            const fileUri = FileSystem.documentDirectory + 'exported_accounts.json';
            
            //await FileSystem.writeAsStringAsync(fileUri, jsonContent);
           // await Sharing.shareAsync(fileUri);
            console.log('Exportação concluída:', fileUri);
        } catch (error) {
            console.error('Erro ao exportar contas:', error);
        } finally {
            onClose(); // Fecha o modal após a exportação
        }
    };

    useEffect(() => {
        if (visible && actionType === 'export') {
            exportAccounts(); // Chama a função de exportação quando o modal é aberto para exportação
        }
    }, [visible, actionType]);

    const renderContent = () => {
        if (actionType === 'export') {
            return <Text>Exportando suas contas... Aguarde.</Text>;
        } else if (actionType === 'import') {
            return <Text>Tentativa de import</Text>;
        }
        return null;
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {renderContent()}
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
