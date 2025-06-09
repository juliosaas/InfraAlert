// Teste simples de conectividade
const fetch = require('node-fetch');

async function testAPI() {
    try {
        console.log('🧪 Testando conectividade da API...');
        
        // Teste 1: Health check do Python
        console.log('\n1. Testando health check Python...');
        const healthResponse = await fetch('http://192.168.100.9:5000/health');
        const healthData = await healthResponse.json();
        console.log('✅ Python Health:', healthData);
        
        // Teste 2: Endpoint de routing
        console.log('\n2. Testando endpoint de routing...');
        const routingResponse = await fetch('http://192.168.100.9:5000/api/routing/calculate-route', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                start_address: 'Rua Barão de Jaguara, Campinas',
                end_address: 'Avenida Francisco Glicério, Campinas',
                current_time: '14:30'
            })
        });
        
        console.log('📊 Status:', routingResponse.status);
        console.log('📊 Headers:', Object.fromEntries(routingResponse.headers.entries()));
        
        const routingData = await routingResponse.text();
        console.log('📊 Response:', routingData);
        
        if (routingResponse.ok) {
            console.log('✅ Endpoint de routing está funcionando!');
        } else {
            console.log('❌ Problema no endpoint de routing');
        }
        
    } catch (error) {
        console.error('❌ Erro no teste:', error);
    }
}

testAPI();
