// Teste simples da API de health
const testHealthAPI = async () => {
  const API_URL = 'http://192.168.100.9:5000/health';
  
  console.log('🚀 Testando endpoint de health...');
  console.log('📍 URL:', API_URL);
  
  try {
    const response = await fetch(API_URL);
    
    console.log('📥 Status:', response.status);
    
    const data = await response.json();
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

// Executar teste
testHealthAPI();
