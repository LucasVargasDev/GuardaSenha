import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Alert = ({ visible, onClose, title, message, onConfirm, onCancel, isValidationError }) => {
    if (!visible) {
        return null;
    }

    return (
        <View style={styles.overlay}>
            <View style={styles.alertContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.message}>{message}</Text>
                <View style={styles.buttonContainer}>
                    {isValidationError ? (
                        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                            <Text style={styles.buttonText}>Fechar</Text>
                        </TouchableOpacity>
                    ) : (
                        <>
                        <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>
        </View>
  );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    message: {
        marginVertical: 10,
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cancelButton: {
        flex: 1,
        backgroundColor: 'lightgray',
        padding: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    confirmButton: {
        flex: 1,
        backgroundColor: '#293A97',
        padding: 10,
        borderRadius: 5,
        marginLeft: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
    },
    closeButton: {
        flex: 1,
        backgroundColor: '#293A97',
        padding: 10,
        borderRadius: 5,
    },
});

export default Alert;
