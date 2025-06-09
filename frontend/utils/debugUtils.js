// utils/debugUtils.js
// Utilitários para debug de conectividade no React Native

export const testAPIConnectivity = async () => {
  const testResults = [];
  
  // Lista de IPs para testar
  const ipsToTest = [
    '192.168.100.9',
    '10.0.2.2', // IP especial do emulador Android para acessar a máquina host
    'localhost',
    '127.0.0.1'
  ];
  
  console.log('🧪 === TESTE DE CONECTIVIDADE API ===');
  
  for (const ip of ipsToTest) {
    const healthURL = `http://${ip}:5000/health`;
    const testRouteURL = `http://${ip}:5000/api/routing/test-route`;
    
    console.log(`🔍 Testando IP: ${ip}`);
    
    try {
      // Teste 1: Health check
      console.log(`  📡 Testando health: ${healthURL}`);
      const healthResponse = await fetch(healthURL, {
        method: 'GET',
        timeout: 5000
      });
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log(`  ✅ Health OK:`, healthData);
        
        // Teste 2: Endpoint de teste
        console.log(`  📡 Testando test-route: ${testRouteURL}`);
        const testResponse = await fetch(testRouteURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            start_address: "Rua A",
            end_address: "Rua B",
            current_time: "14:30"
          }),
          timeout: 10000
        });
        
        if (testResponse.ok) {
          const testData = await testResponse.json();
          console.log(`  ✅ Test-route OK! IP funcional: ${ip}`);
          
          testResults.push({
            ip,
            status: 'SUCCESS',
            healthCheck: true,
            testRoute: true,
            data: testData
          });
        } else {
          console.log(`  ❌ Test-route falhou: ${testResponse.status}`);
          testResults.push({
            ip,
            status: 'PARTIAL',
            healthCheck: true,
            testRoute: false,
            error: `Status ${testResponse.status}`
          });
        }
        
      } else {
        console.log(`  ❌ Health falhou: ${healthResponse.status}`);
        testResults.push({
          ip,
          status: 'FAILED',
          healthCheck: false,
          testRoute: false,
          error: `Health status ${healthResponse.status}`
        });
      }
      
    } catch (error) {
      console.log(`  ❌ Erro de conectividade: ${error.message}`);
      testResults.push({
        ip,
        status: 'ERROR',
        healthCheck: false,
        testRoute: false,
        error: error.message
      });
    }
  }
  
  console.log('📊 === RESULTADOS DOS TESTES ===');
  testResults.forEach(result => {
    console.log(`IP ${result.ip}: ${result.status}`, result);
  });
  
  // Retorna o primeiro IP que funcionou completamente
  const workingIP = testResults.find(r => r.status === 'SUCCESS');
  if (workingIP) {
    console.log(`🎯 IP recomendado: ${workingIP.ip}`);
    return workingIP.ip;
  }
  
  console.log('❌ Nenhum IP funcionou completamente');
  return null;
};

export const testRouteServiceCall = async (startAddress, endAddress) => {
  console.log('🧪 === TESTE DIRETO DO ROUTE SERVICE ===');
  
  try {
    const RouteService = require('../services/RouteService').default;
    
    console.log('📞 Chamando RouteService.calculateRoute...');
    const result = await RouteService.calculateRoute(startAddress, endAddress);
    
    console.log('✅ RouteService funcionou!', result);
    return result;
    
  } catch (error) {
    console.error('❌ RouteService falhou:', error);
    throw error;
  }
};
