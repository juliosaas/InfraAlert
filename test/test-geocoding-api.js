const testGeocodingAPI = async () => {

  const API_URL = 'http://localhost:5050/api/routing/geocode';
  

  const testData = {
    address: "Rua das Amoreiras, 123",
    city: "Campinas, SP"
  };
  
  console.log('🚀 Testando geocoding...');
  console.log('📍 URL:', API_URL);
  console.log('📤 Dados:', JSON.stringify(testData, null, 2));
  
  try {
    const response = await fetch(API_URL, { // fetch é para fazer requisições no HTTP
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

testGeocodingAPI();
