import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const generatePassword = (length, includeLowercase, includeUppercase, includeNumbers, includeSpecialChars) => {
  const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
  const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const numbers = '0123456789';
  const specialChars = '!@#$%^&*()-_=+[]{}|;:,.<>?';

  let characters = '';
  if (includeLowercase) characters += lowercaseChars;
  if (includeUppercase) characters += uppercaseChars;
  if (includeNumbers) characters += numbers;
  if (includeSpecialChars) characters += specialChars;

  let password = '';
  if (includeLowercase) password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
  if (includeUppercase) password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
  if (includeNumbers) password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  if (includeSpecialChars) password += specialChars.charAt(Math.floor(Math.random() * specialChars.length));

  for (let i = password.length; i < length; i++) {
    password += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return password.split('').sort(() => Math.random() - 0.5).join('');
};

const PasswordWizard = ({ visible, onClose, onGeneratePassword }) => {
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const increaseLength = () => {
    if (passwordLength < 32) {
      setPasswordLength(passwordLength + 1);
    }
  };

  const decreaseLength = () => {
    if (passwordLength > 4) {
      setPasswordLength(passwordLength - 1);
    }
  };

  const handleGeneratePassword = () => {
    const password = generatePassword(passwordLength, includeLowercase, includeUppercase, includeNumbers, includeSpecialChars);
    setGeneratedPassword(password);
    onGeneratePassword(password);
    onClose();
  };

  const handleSwitchChange = (type, value) => {
    if (value === false) {
      const activeSwitches = [
        includeLowercase,
        includeUppercase,
        includeNumbers,
        includeSpecialChars
      ].filter(Boolean).length;
  
      if (activeSwitches === 1) {
        return;
      }
    }

    if (type === 'Lowercase') setIncludeLowercase(value);
    if (type === 'Uppercase') setIncludeUppercase(value);
    if (type === 'Numbers') setIncludeNumbers(value);
    if (type === 'SpecialChars') setIncludeSpecialChars(value);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Configurar Senha Segura</Text>

          <Text style={styles.sectionTitle}>Comprimento da Senha</Text>
          <View style={styles.sliderContainer}>

            <TouchableOpacity onPress={decreaseLength} style={styles.buttonText}>
              <Text style={styles.button}>-</Text>
            </TouchableOpacity>

            <Slider
              style={styles.slider}
              minimumValue={4}
              maximumValue={32}
              step={1}
              value={passwordLength}
              onValueChange={(value) => setPasswordLength(Math.round(value))}
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#293A97"
            />
            
            <TouchableOpacity onPress={increaseLength} style={styles.buttonText}>
              <Text style={styles.button}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sliderValue}>{passwordLength} caracteres</Text>

          <View style={styles.option}>
            <Text>Incluir Letras Minúsculas</Text>
            <Switch 
                value={includeLowercase}
                onValueChange={ (value) => handleSwitchChange('Lowercase', value) }
                trackColor={ {true: 'rgba(41, 58, 185, 0.6)'} }
                thumbColor={ includeLowercase ? '#293A97' : 'rgb(241, 243, 253)' } />
          </View>

          <View style={styles.option}>
            <Text>Incluir Letras Maiúsculas</Text>
            <Switch
                value={includeUppercase}
                onValueChange={(value) => handleSwitchChange('Uppercase', value)}
                trackColor={ {true: 'rgba(41, 58, 185, 0.6)'} }
                thumbColor={ includeUppercase ? '#293A97' : 'rgb(241, 243, 253)' } />
          </View>

          <View style={styles.option}>
            <Text>Incluir Números</Text>
            <Switch
                value={includeNumbers}
                onValueChange={(value) => handleSwitchChange('Numbers', value)}
                trackColor={ {true: 'rgba(41, 58, 185, 0.6)'} }
                thumbColor={ includeNumbers ? '#293A97' : 'rgb(241, 243, 253)' } />
          </View>

          <View style={styles.option}>
            <Text>Incluir Caracteres Especiais</Text>
            <Switch
                value={includeSpecialChars}
                onValueChange={(value) => handleSwitchChange('SpecialChars', value)}
                trackColor={ {true: 'rgba(41, 58, 185, 0.6)'} }
                thumbColor={ includeSpecialChars ? '#293A97' : 'rgb(241, 243, 253)' } />
          </View>

          <TouchableOpacity style={styles.generateButton} onPress={handleGeneratePassword}>
            <Text style={styles.generateButtonText}>Gerar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 10,
    marginBottom: 5,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  slider: {
    width: '70%',
    height: 40,
  },
  buttonText: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  button: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#293A97',
  },
  sliderValue: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#293A97',
  },
  generatedPassword: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 8,
  },
  generateButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#293A97',
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 10,
  },
  closeButtonText: {
    color: '#293A97',
    fontSize: 16,
  },
});

export default PasswordWizard;
