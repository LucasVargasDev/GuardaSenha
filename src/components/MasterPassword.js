import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { saveEncryptedData, getDecryptedData } from './Storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

const MasterPassword = () => {
	const [visible, setVisible] = useState(false);
	const [password, setPassword] = useState('');
	const [questionAsked, setQuestionAsked] = useState(false);
	const [enabled, setEnabled] = useState(false);
	const [isSettingPassword, setIsSettingPassword] = useState(false);
	const [showPassword, setShowPassword] = useState(false);

	useEffect(() => {
		const checkSettings = async () => {
			const savedSettings = await AsyncStorage.getItem('@guardaSenha:masterPassword');
			const masterPasswordData = savedSettings ? JSON.parse(savedSettings) : null;
			if (masterPasswordData) {
				setEnabled(masterPasswordData.enabled);
				setQuestionAsked(masterPasswordData.questionAsked);
			} else {
				setVisible(true);
			}
		};
		checkSettings();
	}, []);

	const handleConfirm = async () => {
		if (isSettingPassword) {
			if (password.length > 0) {
				const settings = {
					enabled: true,
					key: password,
					questionAsked: true,
				};
				await AsyncStorage.setItem('@guardaSenha:masterPassword', JSON.stringify(settings));
				setVisible(false);
				setEnabled(true);
				setQuestionAsked(true);
			}
		} else {
			setIsSettingPassword(true);
		}
	};

	const handleDeny = async () => {
		const settings = {
			enabled: false,
			key: '',
			questionAsked: true,
		};
		await AsyncStorage.setItem('@guardaSenha:masterPassword', JSON.stringify(settings));
		setVisible(false);
		setQuestionAsked(true);
	};

	return (
		<View>
			<Modal transparent={true} visible={visible} animationType="slide">
				<View style={styles.modalOverlay}>
					<View style={styles.modalContainer}>
						<View style={styles.header}>
							<Text style={styles.headerText}>Senha Mestre</Text>
						</View>
						<View style={styles.modalContent}>
							<Text style={styles.message}>
								{isSettingPassword ? "Informe a Senha Mestre" : "Você deseja configurar uma senha mestre?"}
							</Text>
							{!isSettingPassword && (
								<Text style={styles.infoMessage}>
									A utilização de uma senha mestre aumenta ainda mais a segurança dos seus dados.
								</Text>
							)}
							{isSettingPassword && (
								<>
									<Text style={styles.instructionText}>
										A senha mestre deve ser guardada com segurança e lembrada, pois é fundamental para a importação e exportação de suas senhas.
									</Text>
									<View style={styles.inputContainer}>
										<TextInput
											style={styles.input}
											placeholder="Digite sua Senha Mestre"
											value={password}
											onChangeText={setPassword}
											secureTextEntry={!showPassword}
										/>
										<TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
											<MaterialIcons name={showPassword ? "visibility" : "visibility-off"} size={24} color="black" />
										</TouchableOpacity>
									</View>
								</>
							)}
							<View style={styles.buttonContainer}>
								{isSettingPassword ? (
									<>
										<TouchableOpacity style={styles.cancelButton} onPress={() => setVisible(false)}>
											<Text style={styles.buttonText}>Cancelar</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
											<Text style={styles.buttonText}>Confirmar</Text>
										</TouchableOpacity>
									</>
								) : (
									<>
										<TouchableOpacity style={styles.cancelButton} onPress={handleDeny}>
											<Text style={styles.buttonText}>Não</Text>
										</TouchableOpacity>
										<TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
											<Text style={styles.buttonText}>Sim</Text>
										</TouchableOpacity>
									</>
								)}
							</View>
						</View>
					</View>
				</View>
			</Modal>
		</View>
	);
};

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
		elevation: 5,
	},
	header: {
		backgroundColor: '#293A97',
		paddingVertical: 15,
		paddingHorizontal: 10,
		alignItems: 'center',
	},
	headerText: {
		color: '#C8D4F1',
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	modalContent: {
		padding: 20,
	},
	message: {
		fontSize: 16,
		marginBottom: 10,
		textAlign: 'center',
		color: '#333',
	},
	infoMessage: {
		fontSize: 14,
		marginBottom: 20,
		textAlign: 'center',
		color: '#666',
	},
	instructionText: {
		fontSize: 14,
		marginBottom: 10,
		textAlign: 'center',
		color: '#666',
	},
	inputContainer: {
		position: 'relative',
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
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		width: '100%',
	},
	confirmButton: {
		backgroundColor: '#293A97',
		paddingVertical: 10,
		borderRadius: 5,
		flex: 1,
		marginLeft: 5,
	},
	cancelButton: {
		backgroundColor: '#293A97',
		paddingVertical: 10,
		borderRadius: 5,
		flex: 1,
		marginRight: 5,
	},
	buttonText: {
		color: 'white',
		textAlign: 'center',
		fontWeight: '600',
	},
	eyeButton: {
		position: 'absolute',
		right: 10,
		top: 13,
	},
});

export default MasterPassword;
