import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert, // Import Alert for showing messages
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios'; // Import axios
import { UserContext } from '../App'; // Import UserContext
import { API_URL } from '../config';

export default function Login() {
  const navigation = useNavigation();
  const { setUser } = useContext(UserContext); // Get setUser from context
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Por favor, preencha o email e a senha.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/user/auth/login`, {
        email,
        password,
      });

      // Handle successful login
      console.log('Login successful:', response.data);
      const { token, user } = response.data;
      setUser(user); // Salva usuário no contexto

      // TODO: Store the token securely (e.g., AsyncStorage)
      // For now, just log it and navigate
      console.log('Token:', token);
      Alert.alert('Sucesso', `Bem-vindo, ${user.name || user.email}!`);

      // Navigate to Home screen after successful login
      navigation.navigate('Home'); // Assuming 'Home' is the name of your home screen route

    } catch (error) {
      console.error('Login error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Erro ao tentar fazer login. Tente novamente.';
      Alert.alert('Erro no Login', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo de volta!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite seu email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, { marginTop: 12 }]}>Senha:</Text>
        <TextInput
          style={styles.input}
          placeholder="Digite sua senha"
          placeholderTextColor="#999"
          secureTextEntry
          autoCapitalize="none"
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.loginBtn}
          onPress={handleLogin}
          disabled={loading} // Disable button while loading
        >
          <Text style={styles.loginText}>{loading ? 'Entrando...' : 'login'}</Text>
        </TouchableOpacity>

        {/* Ícones sociais - Funcionalidade não implementada */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="google" size={24} color="#db4437" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIcon}>
            <FontAwesome name="facebook" size={24} color="#1877f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Links - Funcionalidade não implementada */}
      <TouchableOpacity>
        <Text style={styles.linkSmall}>
          Esqueceu sua senha? <Text style={styles.linkUnderline}>Clique aqui</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{ marginTop: 40 }}
        onPress={() => navigation.navigate('Cadastro')}
      >
        <Text style={styles.linkSmall}>
          Ainda não possui cadastro? {'\n'}
          <Text style={styles.linkUnderline}>Cadastre-se</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const BLUE = '#19549C';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLUE,
    paddingHorizontal: 24,
    paddingTop: 40,
    justifyContent: 'center', // Center content vertically
  },
  welcome: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20, // Add margin bottom
  },
  label: {
    color: '#333',
    marginBottom: 4,
    fontWeight: '600',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f9f9f9', // Slightly different background for input
  },
  loginBtn: {
    backgroundColor: BLUE,
    borderRadius: 20,
    paddingVertical: 12, // Increase padding
    marginTop: 25, // Increase margin top
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  loginText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase', // Uppercase text
    fontSize: 14,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center', // Center icons
    marginTop: 25,
    gap: 20, // Add gap between icons
  },
  socialIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  linkSmall: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 15, // Adjust margin
  },
  linkUnderline: {
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});

