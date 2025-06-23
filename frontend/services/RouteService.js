// services/RouteService.js
// Serviço para comunicação com a API de rotas

import { getBackendIP, testConnection } from '../utils/networkUtils';

// Função para obter a URL base da API dinamicamente
const getAPIBaseURL = async () => {
  console.log('🔍 Detectando IP do backend...');
  const ip = await getBackendIP();
  const baseURL = `http://${ip}:5050/api/routing`;
  
  console.log(`🌐 IP detectado: ${ip}`);
  console.log(`🌐 URL base: ${baseURL}`);
  
  // Testa a conexão antes de retornar
  console.log('🧪 Testando conexão com o backend...');
  const isOnline = await testConnection(ip, 5050, 5000);
    if (!isOnline) {
    console.warn(`⚠️ Backend parece estar offline em ${ip}:5050`);
    console.warn('⚠️ Tentando mesmo assim...');
  } else {
    console.log(`✅ Backend está online em ${ip}:5050`);
  }
  
  return baseURL;
};

class RouteService {
  static async calculateRoute(startAddress, endAddress, currentTime = null) {
    try {
      console.log('🚀 Iniciando cálculo de rota...');
      console.log('📍 Origem:', startAddress);
      console.log('🎯 Destino:', endAddress);
      
      const API_BASE_URL = await getAPIBaseURL();
      const fullURL = `${API_BASE_URL}/test-route`;
      console.log('🌐 URL completa:', fullURL);
        // Testa a conexão novamente antes de fazer a requisição
      const ip = await getBackendIP();
      const isBackendOnline = await testConnection(ip, 5050, 3000);
      
      if (!isBackendOnline) {
        console.error('❌ Backend não está acessível');
        throw new Error('Servidor não está acessível. Verifique se o backend está rodando.');
      }
      
      console.log('✅ Backend está acessível, fazendo requisição...');
      
      const requestBody = {
        start_address: startAddress,
        end_address: endAddress,
        current_time: currentTime || new Date().toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      };
      
      console.log('📤 Enviando request:', JSON.stringify(requestBody, null, 2));
      
      // Criar AbortController para timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 segundos
      
      const response = await fetch(fullURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);
      
      const data = await response.json();
      console.log('📊 Response data:', JSON.stringify(data, null, 2));
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao calcular rota');
      }

      return data;
    } catch (error) {
      console.error('❌ Erro no RouteService:', error);
      
      // Tratamento específico para timeout
      if (error.name === 'AbortError') {
        throw new Error('Timeout: A requisição demorou muito para responder. Tente novamente.');
      }
      
      // Tratamento para erro de rede
      if (error.message.includes('fetch')) {
        throw new Error('Erro de conectividade: Verifique sua conexão com a internet.');
      }
      
      throw error;
    }
  }

  static async geocodeAddress(address, city = 'Campinas, SP') {
    try {
      const API_BASE_URL = await getAPIBaseURL();
      
      const response = await fetch(`${API_BASE_URL}/geocode`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address,
          city
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Erro ao geocodificar endereço');
      }

      return data;    } catch (error) {
      console.error('Erro no geocoding:', error);
      throw error;
    }
  }
}

export default RouteService;