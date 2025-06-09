// Teste simples do geocoding
const testGeocodingAPI = async () => {
  const API_URL = 'http://192.168.100.9:5000/api/routing/geocode';
  
  const testData = {
    address: "Rua das Amoreiras, 123",
    city: "Campinas, SP"
  };
  
  console.log('🚀 Testando geocoding...');
  console.log('📍 URL:', API_URL);
  console.log('📤 Dados:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });
    
    console.log('📥 Status:', response.status);
    
    const data = await response.json();
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

// Executar teste
testGeocodingAPI();
