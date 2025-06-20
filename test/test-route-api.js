// Arquivo de teste para a API de rotas
const testRouteAPI = async () => {

  const API_URL = 'http://localhost:5050/api/routing/calculate-route';
  
  const testData = {
    start_address: "Rua das Amoreiras, 123, Campinas",
    end_address: "Rua Abolição, 456, Campinas",
    current_time: "14:30"
  };
  
  console.log('🚀 Testando API de rotas...');
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
    console.log('📥 Headers:', Object.fromEntries(response.headers.entries()));
    
    const data = await response.json();
    console.log('📊 Response:', JSON.stringify(data, null, 2));
    
    if (data.route) {
      console.log('✅ Rota calculada com sucesso!');
      console.log('📍 Coordenadas de início:', data.route.start_coords);
      console.log('🎯 Coordenadas de fim:', data.route.end_coords);
      console.log('📏 Distância:', data.route.distance_meters, 'metros');
      console.log('⏱️ Duração:', data.route.duration_seconds, 'segundos');
      console.log('🗺️ Geometria presente:', !!data.route.geometry);
    }
    
    if (data.safety_analysis) {
      console.log('🛡️ Análise de segurança:', data.safety_analysis);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};

// Executar teste
testRouteAPI();
