// scripts/autoConfigureNetwork.js
// Script para configuração automática de rede

import { Alert } from 'react-native';
import { getBackendIP, testConnection, clearIPCache } from '../utils/networkUtils';

/**
 * Configura automaticamente a rede quando o app inicia
 */
export const autoConfigureNetwork = async () => {
  try {
    console.log('🚀 Iniciando configuração automática de rede...');

    // Limpa o cache para garantir nova detecção
    clearIPCache();

    // Detecta o melhor IP
    const ip = await getBackendIP();

    // Testa a conexão com o backend Python
    const pythonBackendOnline = await testConnection(ip, 5000);
    
    // Testa a conexão com o backend Node.js
    const nodeBackendOnline = await testConnection(ip, 3000);

    // Relatório de status
    const status = {
      detectedIP: ip,
      pythonAPI: pythonBackendOnline ? '✅ Online' : '❌ Offline',
      nodeAPI: nodeBackendOnline ? '✅ Online' : '❌ Offline'
    };

    console.log('📊 Status da rede:', status);

    // Avisa se algum serviço está offline
    if (!pythonBackendOnline && !nodeBackendOnline) {
      Alert.alert(
        '⚠️ Problema de Conexão',
        `Não foi possível conectar com nenhum backend.\n\n` +
        `IP detectado: ${ip}\n` +
        `Python API (5000): ${status.pythonAPI}\n` +
        `Node API (3000): ${status.nodeAPI}\n\n` +
        `Verifique se os serviços estão rodando.`,
        [
          { text: 'Tentar Novamente', onPress: () => autoConfigureNetwork() },
          { text: 'Continuar Assim', style: 'cancel' }
        ]
      );
    } else if (!pythonBackendOnline) {
      console.warn('⚠️ API Python offline - funcionalidades de IA não disponíveis');
    } else if (!nodeBackendOnline) {
      console.warn('⚠️ API Node.js offline - algumas funcionalidades podem não funcionar');
    } else {
      console.log('✅ Todos os serviços estão online!');
    }

    return status;
  } catch (error) {
    console.error('❌ Erro na configuração automática:', error);
    
    Alert.alert(
      '❌ Erro de Configuração',
      'Não foi possível configurar a rede automaticamente.\n\n' +
      'Usando configuração padrão.',
      [{ text: 'OK' }]
    );

    return null;
  }
};

/**
 * Mostra informações de debug da rede
 */
export const showNetworkDebugInfo = async () => {
  try {
    const ip = await getBackendIP();
    const pythonOnline = await testConnection(ip, 5000);
    const nodeOnline = await testConnection(ip, 3000);

    const debugInfo = 
      `🔍 Informações de Debug\n\n` +
      `IP Detectado: ${ip}\n` +
      `Python API (5000): ${pythonOnline ? '✅' : '❌'}\n` +
      `Node API (3000): ${nodeOnline ? '✅' : '❌'}\n\n` +
      `URLs:\n` +
      `• Python: http://${ip}:5000\n` +
      `• Node: http://${ip}:3000`;

    Alert.alert('🔧 Debug de Rede', debugInfo, [
      { text: 'Reconfigurar', onPress: () => autoConfigureNetwork() },
      { text: 'Fechar', style: 'cancel' }
    ]);
  } catch (error) {
    Alert.alert('Erro', `Não foi possível obter informações de debug: ${error.message}`);
  }
};
