// utils/networkUtils.js
// Utilitário para detecção de rede multiplataforma

import { Platform } from 'react-native';
import * as Network from 'expo-network';

/**
 * Detecta automaticamente o IP local da máquina
 * Funciona tanto no Windows quanto no Mac
 */
export const detectLocalIP = async () => {
  try {
    console.log('🔍 Detectando IP local da máquina...');

    // Método 1: Usar Expo Network (mais confiável)
    try {
      const ipAddress = await Network.getIpAddressAsync();
      if (ipAddress && !ipAddress.startsWith('127.') && !ipAddress.includes('::')) {
        console.log(`✅ IP detectado via Expo Network: ${ipAddress}`);
        return ipAddress;
      }
    } catch (error) {
      console.warn('⚠️ Expo Network falhou:', error.message);
    }

    // Método 2: Tentar conectar com IPs comuns e ver qual responde
    const commonNetworks = [
      '192.168.1.',
      '192.168.0.',
      '192.168.100.',
      '10.0.0.',
      '172.16.',
      '192.168.2.'
    ];

    for (const network of commonNetworks) {
      for (let i = 1; i <= 20; i++) {
        const testIP = `${network}${i}`;
        try {
          // Testa se existe um servidor no IP
          const response = await fetch(`http://${testIP}:3000/health`, {
            method: 'GET',
            timeout: 1000
          });
          
          if (response.ok) {
            console.log(`✅ IP detectado via teste de conectividade: ${testIP}`);
            return testIP;
          }
        } catch (error) {
          // IP não responde, continua tentando
        }
      }
    }

    // Método 3: Fallback baseado na plataforma
    let fallbackIP;
    
    if (Platform.OS === 'web') {
      fallbackIP = 'localhost';
    } else if (Platform.OS === 'android') {
      // No emulador Android, 10.0.2.2 mapeia para localhost do host
      fallbackIP = '10.0.2.2';
    } else if (Platform.OS === 'ios') {
      // No simulador iOS, localhost funciona
      fallbackIP = 'localhost';
    } else {
      // Para dispositivos físicos - usa o IP mais comum
      fallbackIP = '192.168.1.1';
    }

    console.log(`⚠️ Usando IP de fallback: ${fallbackIP}`);
    return fallbackIP;

  } catch (error) {
    console.error('❌ Erro ao detectar IP local:', error);
    return '192.168.100.9'; // Seu IP atual como último recurso
  }
};

/**
 * Verifica se um servidor está rodando em um IP e porta específicos
 */
export const testConnection = async (ip, port = 5000, timeout = 3000) => {
  try {
    console.log(`🔍 Testando conexão: http://${ip}:${port}/health`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(`http://${ip}:${port}/health`, {
      method: 'GET',
      signal: controller.signal,
      cache: 'no-cache'
    });

    clearTimeout(timeoutId);
    
    const success = response.ok;
    console.log(`${success ? '✅' : '❌'} ${ip}:${port} - Status: ${response.status}`);
    
    return success;
  } catch (error) {
    console.log(`❌ ${ip}:${port} - Erro: ${error.message}`);
    return false;
  }
};

/**
 * Encontra o melhor IP para conectar com o backend
 */
export const findBestBackendIP = async () => {
  console.log('🔍 Procurando o melhor IP para conectar com o backend...');

  // Lista de IPs para testar (incluindo o atual)
  const ipsToTest = [
    '192.168.100.9', // Seu IP atual
    '192.168.1.1',
    '192.168.1.100',
    '192.168.0.1',
    '192.168.0.100',
    '10.0.0.1',
    'localhost'
  ];

  // Testa cada IP
  for (const ip of ipsToTest) {
    console.log(`🧪 Testando conexão com ${ip}:5000...`);
    
    const isOnline = await testConnection(ip, 5000, 2000);
    if (isOnline) {
      console.log(`✅ Backend encontrado em: ${ip}:5000`);
      return ip;
    }
  }

  // Se nenhum IP funcionou, tenta detectar automaticamente
  const detectedIP = await detectLocalIP();
  console.log(`⚠️ Nenhum backend encontrado. Usando IP detectado: ${detectedIP}`);
  
  return detectedIP;
};

/**
 * Cache do IP para evitar múltiplas detecções
 */
let cachedBackendIP = null;
let ipDetectionPromise = null;

export const getBackendIP = async () => {
  // Para Android emulator, tenta diferentes IPs
  if (Platform.OS === 'android') {
    console.log('🔧 Detectando IP para Android emulator...');
    
    // Lista de IPs para testar no Android emulator
    const androidIPs = [
      '10.0.2.2',        // Padrão do emulador Android
      '192.168.100.9',   // Seu IP atual
      '192.168.1.1',     // IP comum de rede
      '192.168.0.1',     // IP comum de rede
      'localhost'        // Fallback
    ];
    
    for (const ip of androidIPs) {
      console.log(`🧪 Testando Android IP: ${ip}:5000`);
      const isOnline = await testConnection(ip, 5000, 3000);
      if (isOnline) {
        console.log(`✅ Backend encontrado em: ${ip}:5000`);
        cachedBackendIP = ip;
        return ip;
      }
    }
    
    // Se nenhum IP funcionou, usa o padrão
    console.log('⚠️ Nenhum IP respondeu. Usando 10.0.2.2 como fallback');
    return '10.0.2.2';
  }
  
  // Para outras plataformas, tenta detectar o melhor IP
  if (cachedBackendIP) {
    return cachedBackendIP;
  }

  if (ipDetectionPromise) {
    return await ipDetectionPromise;
  }

  ipDetectionPromise = findBestBackendIP();
  cachedBackendIP = await ipDetectionPromise;
  
  return cachedBackendIP;
};

/**
 * Limpa o cache do IP (útil para redetecção)
 */
export const clearIPCache = () => {
  cachedBackendIP = null;
  ipDetectionPromise = null;
  console.log('🧹 Cache de IP limpo');
};
