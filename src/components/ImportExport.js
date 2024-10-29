import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ImportExport = ({ visible, onClose, actionType }) => {
    const renderContent = () => {
        if (actionType === 'import') {
            return <Text>Tentativa de import</Text>;
        } else if (actionType === 'export') {
            return <Text>Tentativa de export</Text>;
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