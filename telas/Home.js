import React, { useState, useEffect, useRef } from 'react';
import { Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [favoritado, setFavoritado] = useState(false);
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      
      {/* apenas o ícone da estrela é clicável */}
      <TouchableOpacity
        onPress={() => setFavoritado(!favoritado)}
        style={styles.starTouchable}
        hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }} // controle exato da area tocável
      >
        <FontAwesome
          name="star"
          size={28}
          color={favoritado ? '#FFD700' : 'white'}
        />
      </TouchableOpacity>

      <Text style={styles.title}>Para onde vamos?</Text>

      <TextInput
        style={styles.input}
        placeholder="Local de partida..."
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Seu destino..."
        placeholderTextColor="#999"
      />

      <Text style={styles.footerText}>
        Deseja favoritar lugares e salvar suas preferências?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.login}>login</Text>
        </TouchableOpacity>
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#19549C',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  starTouchable: { //config criada somente para precisão do click do icone
    alignSelf: 'flex-start',
    padding: 0, // evita área extra clicável
    marginBottom: 10,
  },
  title: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 10,
  },
  footerText: {
    color: 'white',
    marginTop: 15,
  },
  login: {
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
});
