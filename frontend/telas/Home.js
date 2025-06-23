// Home.js - Versão otimizada usando hooks e componentes
import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, TextInput, StyleSheet, Animated, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { UserContext } from '../App';

// Importar hooks e utilitários
import { useRoute } from '../hooks/useRoute';
import SafetyIndicator from '../components/SafetyIndicator';
import {
  convertGeometryToCoordinates,
  calculateMapRegion,
  formatDistance,
  formatDuration,
  getSafetyColor,
  getRecommendationTitle
} from '../utils/mapUtils';

export default function Home() {
  const [favoritado, setFavoritado] = useState(false);
  const [partida, setPartida] = useState('');
  const [destino, setDestino] = useState('');
  const [mapRegion, setMapRegion] = useState({
    // ponto inicial em Campinas, SP
    latitude: -22.9064,
    longitude: -47.0616,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });
  
  const navigation = useNavigation();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const mapRef = useRef(null);
  const { user } = useContext(UserContext);

  // Hook personalizado para gerenciar rotas
  const {
    loading,
    routeData,
    safetyInfo,
    error,
    calculateRoute,
    clearRoute
  } = useRoute();

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (error) {
      Alert.alert('Erro', error);
    }
  }, [error]);

  useEffect(() => {
    // Ajustar mapa quando rota for calculada
    console.log('🗺️ Effect routeData triggered:', routeData);
    if (routeData && routeData.start_coords && routeData.end_coords) {
      console.log('📍 Coordenadas encontradas:');
      console.log('  Start:', routeData.start_coords);
      console.log('  End:', routeData.end_coords);
      console.log('  Geometry:', routeData.geometry);
      
      const newRegion = calculateMapRegion(routeData.start_coords, routeData.end_coords);
      console.log('🗺️ Nova região calculada:', newRegion);
      
      if (newRegion) {
        setMapRegion(newRegion);
        if (mapRef.current) {
          mapRef.current.animateToRegion(newRegion, 1000);
        }
      }
    } else {
      console.log('❌ Dados de rota incompletos:', {
        routeData: !!routeData,
        start_coords: routeData?.start_coords,
        end_coords: routeData?.end_coords
      });
    }
  }, [routeData]);

  useEffect(() => {
    // Mostrar recomendação quando análise estiver disponível
    console.log('🛡️ Effect safetyInfo triggered:', safetyInfo);
    if (safetyInfo && safetyInfo.recommendation) {
      showSafetyRecommendation(safetyInfo.recommendation, safetyInfo.suggestions);
    }
  }, [safetyInfo]);

  const handleCalculateRoute = async () => {
    console.log('🚀 [HOME] Iniciando cálculo de rota...');
    console.log('📍 [HOME] Partida:', partida);
    console.log('🎯 [HOME] Destino:', destino);
    
    const success = await calculateRoute(partida, destino);
    console.log('📊 [HOME] Resultado do cálculo:', success);
    
    if (!success) {
      console.log('❌ [HOME] Erro já tratado pelo hook');
      return;
    }
  };

  const handleClearRoute = () => {
    clearRoute();
    setPartida('');
    setDestino('');
    setMapRegion({
      latitude: -22.9064,
      longitude: -47.0616,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    });
  };

  const showSafetyRecommendation = (recommendation, suggestions) => {
    const title = getRecommendationTitle(recommendation.type);
    let message = `${recommendation.message}\n\n${recommendation.suggestion}`;
    
    if (suggestions && suggestions.length > 0) {
      const suggestionText = suggestions.join('\n• ');
      message += `\n\nSugestões da IA:\n• ${suggestionText}`;
    }

    Alert.alert(title, message);
  };



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <MapView
          ref={mapRef}
          style={{ flex: 1 }}
          region={mapRegion}
          onRegionChangeComplete={setMapRegion}
        >
          {/* Marcador de partida */}
          {routeData && routeData.start_coords && (
            <Marker
              coordinate={{
                latitude: routeData.start_coords[0],
                longitude: routeData.start_coords[1]
              }}
              title="Partida"
              description={partida}
              pinColor="green"
            />
          )}
          
          {/* Marcador de destino */}
          {routeData && routeData.end_coords && (
            <Marker
              coordinate={{
                latitude: routeData.end_coords[0],
                longitude: routeData.end_coords[1]
              }}
              title="Destino"
              description={destino}
              pinColor="red"
            />
          )}
          
          {/* Linha da rota */}
          {routeData && routeData.geometry && (
            <Polyline
              coordinates={convertGeometryToCoordinates(routeData.geometry)}
              strokeColor={getSafetyColor(safetyInfo?.safety_analysis?.safety_level)}
              strokeWidth={4}
              strokePattern={safetyInfo?.safety_analysis?.safety_level === 'PERIGOSA' ? [10, 5] : undefined}
            />
          )}        </MapView>

        {/* Botão admin flutuante */}
        {user && user.role === 'ADMIN' && (
          <TouchableOpacity
            style={styles.adminButton}
            onPress={() => navigation.navigate('Admin')}
          >
            <Text style={styles.adminButtonText}>admin</Text>
          </TouchableOpacity>
        )}



        {/* Informações da rota */}
        {routeData && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeInfoText}>
              📍 {formatDistance(routeData.distance_meters)} • ⏱️ {formatDuration(routeData.duration_seconds)}
            </Text>
            {safetyInfo && (
              <SafetyIndicator
                safetyLevel={safetyInfo.safety_analysis.safety_level}
                aiScore={safetyInfo.ai_analysis?.final_score}
                coverage={safetyInfo.safety_analysis.database_coverage}
              />
            )}
          </View>
        )}        {/* Botão Premium na esquerda - acima da barra interativa */}
        <TouchableOpacity
          style={styles.premiumButtonLeft}
          onPress={() => Alert.alert('Premium', 'Funcionalidade Premium em desenvolvimento!')}
        >
          <FontAwesome5 name="crown" size={20} color="#fbbf24" />
        </TouchableOpacity>

        {/* Botão de Configurações no canto superior direito - acima da barra interativa */}
        <TouchableOpacity
          style={styles.configButtonRight}
          onPress={() => navigation.navigate('Configuracoes')}
        >
          <FontAwesome name="cog" size={20} color="#2563eb" />
        </TouchableOpacity>

        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>

          <View style={styles.headerRow}>
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

            {routeData && (
              <TouchableOpacity
                onPress={handleClearRoute}
                style={styles.clearButton}
              >
                <FontAwesome name="times" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>

          <Text style={styles.title}>Para onde vamos?</Text>

          <TextInput
            style={styles.input}
            placeholder="Local de partida..."
            placeholderTextColor="#999"
            value={partida}
            onChangeText={setPartida}
            editable={!loading}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Seu destino..."
            placeholderTextColor="#999"
            value={destino}
            onChangeText={setDestino}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.calculateButton, loading && styles.calculateButtonDisabled]}
            onPress={handleCalculateRoute}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.calculateButtonText}>
                🗺️ Calcular Rota Segura
              </Text>
            )}
          </TouchableOpacity>

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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  starTouchable: {
    padding: 0,
  },
  clearButton: {
    padding: 5,
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
  calculateButton: {
    backgroundColor: '#0D4A8A',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginVertical: 10,
  },
  calculateButtonDisabled: {
    backgroundColor: '#666',
  },
  calculateButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerText: {
    color: 'white',
    marginTop: 15,
  },
  login: {
    color: 'white',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },  adminButton: {
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
  routeInfo: {
    position: 'absolute',
    top: 170,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 10,
    zIndex: 5,
    elevation: 5,
  },  routeInfoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 5,
  },  floatingButtonsContainer: {
    position: 'absolute',
    top: -60,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 10,
    elevation: 10,
  },  premiumButtonLeft: {
    position: 'absolute',
    // altura do botao de configurações
    top: 10,
    left: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
  configButtonRight: {
    position: 'absolute',
    // altura do botao de premium
    top: 10,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10,
  },
});