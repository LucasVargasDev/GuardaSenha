import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

const PasswordWizard = ({ visible, onClose, onGeneratePassword }) => {
  const [passwordLength, setPasswordLength] = useState(8);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSpecialChars, setIncludeSpecialChars] = useState(false);

  const increaseLength = () => {
    if (passwordLength < 32) {
      setPasswordLength(passwordLength + 1);
    }
  };

  const decreaseLength = () => {
    if (passwordLength > 1) {
      setPasswordLength(passwordLength - 1);
    }
  };

  const handleGeneratePassword = () => {
    const options = { passwordLength, includeLowercase, includeUppercase, includeNumbers, includeSpecialChars };
    handleGeneratePassword(options);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Gerar Senha Segura</Text>

          <Text style={styles.sectionTitle}>Comprimento da Senha</Text>
          <View style={styles.sliderContainer}>

            <TouchableOpacity onPress={decreaseLength} style={styles.buttonText}>
              <Text style={styles.button}>-</Text>
            </TouchableOpacity>

            <Slider
              style={styles.slider}
              minimumValue={1}
              maximumValue={32}
              step={1}
              value={passwordLength}
              onValueChange={(value) => setPasswordLength(Math.round(value))}
              minimumTrackTintColor="#007BFF"
              maximumTrackTintColor="#d3d3d3"
              thumbTintColor="#007BFF"
            />
            
            <TouchableOpacity onPress={increaseLength} style={styles.buttonText}>
              <Text style={styles.button}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.sliderValue}>{passwordLength} caracteres</Text>

          <View style={styles.option}>
            <Text>Incluir Letras Minúsculas</Text>
            <Switch value={includeLowercase} onValueChange={setIncludeLowercase} />
          </View>

          <View style={styles.option}>
            <Text>Incluir Letras Maiúsculas</Text>
            <Switch value={includeUppercase} onValueChange={setIncludeUppercase} />
          </View>

          <View style={styles.option}>
            <Text>Incluir Números</Text>
            <Switch value={includeNumbers} onValueChange={setIncludeNumbers} />
          </View>

          <View style={styles.option}>
            <Text>Incluir Caracteres Especiais</Text>
            <Switch value={includeSpecialChars} onValueChange={setIncludeSpecialChars} />
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
    color: '#007BFF',
  },
  sliderValue: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
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
    backgroundColor: '#007BFF',
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
    color: '#007BFF',
    fontSize: 16,
  },
});

export default PasswordWizard;
