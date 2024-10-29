import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoES from 'crypto-es'; // Importa o módulo principal
import { SECRET_KEY } from '../../config';

async function encryptData(data) {
    const jsonString = JSON.stringify(data);
    const encryptedData = CryptoES.AES.encrypt(jsonString, SECRET_KEY).toString();

    return encryptedData;
}

async function decryptData(encryptedData) {
    const bytes = CryptoES.AES.decrypt(encryptedData, SECRET_KEY);
    const decryptedData = bytes.toString(CryptoES.enc.Utf8);

    return JSON.parse(decryptedData);
}

export async function saveEncryptedData(key, data) {
    try {
        const encryptedData = await encryptData(data);
        await AsyncStorage.setItem(key, encryptedData);
    } catch (error) {
        console.warn("Erro ao salvar dados criptografados", error);
    }
}

export async function getDecryptedData(key) {
    try {
        const encryptedData = await AsyncStorage.getItem(key);
        if (encryptedData !== null) {
            return await decryptData(encryptedData);
        }

        return null;
    } catch (error) {
        console.warn("Erro ao buscar dados criptografados", error);
        return null;
    }
}

export async function getEncryptedData(key) {
    try {
        const encryptedData = await AsyncStorage.getItem(key);
        return encryptedData;
    } catch (error) {
        console.warn("Erro ao buscar dados criptografados", error);
        return null;
    }
}
