// utils/networkUtils.js
// Utilitários para detecção automática de rede

import { Platform } from 'react-native';

let cachedIP = null;

/**
 * Lista de IPs para testar conectividade
 */
const getIPsToTest = () => {
  if (Platform.OS === 'android') {
    return [
      '10.0.2.2',        // IP especial do emulador Android
      '192.168.100.12',  // IP da máquina local
      '192.168.1.100',   // IP comum da rede local
      '127.0.0.1',       // localhost
    ];
  } else if (Platform.OS === 'ios') {
    return [
      'localhost',
      '127.0.0.1',
      '192.168.100.12',
      '192.168.1.100',
    ];
  } else {
    return ['localhost', '127.0.0.1'];
  }
};

/**
 * Testa conexão com um IP e porta específicos
 */
export const testConnection = async (ip, port, timeout = 3000) => {
  try {
    console.log(`🧪 Testando conexão: ${ip}:${port}`);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`http://${ip}:${port}/health`, {
      method: 'GET',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log(`✅ Conexão OK: ${ip}:${port}`);
      return true;
    } else {
      console.log(`❌ Conexão falhou: ${ip}:${port} - Status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Erro de conexão: ${ip}:${port} - ${error.message}`);
    return false;
  }
};

/**
 * Detecta automaticamente o melhor IP do backend
 */
export const getBackendIP = async () => {
  // Retorna IP cached se disponível
  if (cachedIP) {
    console.log(`📌 Usando IP em cache: ${cachedIP}`);
    return cachedIP;
  }

  console.log('🔍 Detectando melhor IP do backend...');
  
  const ipsToTest = getIPsToTest();
  
  for (const ip of ipsToTest) {
    console.log(`🧪 Testando IP: ${ip}`);
    
    // Testa primeiro o backend Node.js (porta 3000)
    const nodeWorking = await testConnection(ip, 3000, 2000);
    
    // Testa o backend Python (porta 5050)
    const pythonWorking = await testConnection(ip, 5050, 2000);
    
    if (nodeWorking || pythonWorking) {
      console.log(`🎯 IP funcional encontrado: ${ip}`);
      console.log(`   Node.js (3000): ${nodeWorking ? '✅' : '❌'}`);
      console.log(`   Python (5050): ${pythonWorking ? '✅' : '❌'}`);
      
      cachedIP = ip;
      return ip;
    }
  }
  
  // Se nenhum IP funcionar, usa o padrão baseado na plataforma
  const defaultIP = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
  console.warn(`⚠️ Nenhum IP respondeu, usando padrão: ${defaultIP}`);
  
  cachedIP = defaultIP;
  return defaultIP;
};

/**
 * Limpa o cache de IP (força nova detecção)
 */
export const clearIPCache = () => {
  console.log('🗑️ Limpando cache de IP...');
  cachedIP = null;
};

/**
 * Testa conectividade completa com todos os serviços
 */
export const testAllServices = async () => {
  const ip = await getBackendIP();
  
  const results = {
    ip,
    nodeJS: await testConnection(ip, 3000, 3000),
    python: await testConnection(ip, 5050, 3000),
  };
  
  console.log('📊 Resultados dos testes:', results);
  return results;
};
