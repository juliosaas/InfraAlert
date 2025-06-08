import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity } from 'react-native';
import MapView from 'react-native-maps';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../App';

export default function Home() {
  const [favoritado, setFavoritado] = useState(false);
  const [partida, setPartida] = useState('');
  const [destino, setDestino] = useState('');
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const { user } = useContext(UserContext);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const searchLocation = (query) => {
    console.log(`Buscando localização: ${query}`); // isso vai ser substituído por uma chamada a API de geolocalização
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: -22.9064,
            longitude: -47.0616,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        />
        {/* Botão admin flutuante */}
        {user && user.role === 'ADMIN' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('Admin')}
          >
            <Text style={styles.adminButtonText}>admin</Text>
          </TouchableOpacity>
        )}
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
          <TouchableOpacity
            onPress={() => setFavoritado(!favoritado)}
            style={styles.starTouchable}
            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
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
            value={partida}
            onChangeText={setPartida}
            onSubmitEditing={() => searchLocation(partida)} // faz com que a busca seja feita ao pressionar Enter //(nao funfa ainca))
          />
          <TextInput
            style={styles.input}
            placeholder="Seu destino..."
            placeholderTextColor="#999"
            value={destino}
            onChangeText={setDestino}
            onSubmitEditing={() => searchLocation(destino)} 
          />

          <Text style={styles.footerText}>
            Deseja favoritar lugares e salvar suas preferências?{' '}
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.login}>login</Text>
            </TouchableOpacity>
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// barra interativa e estilizada na parte inferior da tela

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
  starTouchable: {
    alignSelf: 'flex-start',
    padding: 0,
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
  adminButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#19549C',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    zIndex: 10,
    elevation: 10,
  },
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});