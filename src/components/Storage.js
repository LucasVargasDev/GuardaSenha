import AsyncStorage from '@react-native-async-storage/async-storage';
import CryptoES from 'crypto-es';
import { SECRET_KEY } from '../../config';

async function getMasterPassword() {
    const masterPasswordData = await getDecryptedData('@guardaSenha:masterPassword', false);
    if (masterPasswordData !== null) {
        return masterPasswordData && masterPasswordData.enabled ? masterPasswordData.key : null;
    }

    return null;
}

async function encryptData(data, useMasterPassword = true) {
    const masterPassword = useMasterPassword ? await getMasterPassword() : null;
    const key = masterPassword ? `${SECRET_KEY}${masterPassword}` : SECRET_KEY;
    const jsonString = JSON.stringify(data);
    const encryptedData = CryptoES.AES.encrypt(jsonString, key).toString();

    return encryptedData;
}

export async function decryptData(encryptedData, useMasterPassword = true) {
    try {
        const masterPassword = useMasterPassword ? await getMasterPassword() : null;
        const key = masterPassword ? `${SECRET_KEY}${masterPassword}` : SECRET_KEY;
        const bytes = CryptoES.AES.decrypt(encryptedData, key);
        const decryptedData = bytes.toString(CryptoES.enc.Utf8);

        return JSON.parse(decryptedData);
    } catch (e) {
        throw new Error('DECRYPTION_FAILED')
    }
}

export async function saveEncryptedData(key, data, useMasterPassword = true) {
    try {
        const encryptedData = await encryptData(data, useMasterPassword);
        await AsyncStorage.setItem(key, encryptedData);
    } catch (error) {
        console.warn("Erro ao salvar dados criptografados", error);
    }
}

export async function getDecryptedData(key, useMasterPassword = true) {
    try {
        const encryptedData = await AsyncStorage.getItem(key);
        if (encryptedData !== null) {
            return await decryptData(encryptedData, useMasterPassword);
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
