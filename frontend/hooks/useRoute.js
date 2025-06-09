// hooks/useRoute.js
// Hook personalizado para gerenciar estado de rotas

import { useState, useCallback } from 'react';
import RouteService from '../services/RouteService';

export const useRoute = () => {
  const [loading, setLoading] = useState(false);
  const [routeData, setRouteData] = useState(null);
  const [safetyInfo, setSafetyInfo] = useState(null);
  const [error, setError] = useState(null);

  const calculateRoute = useCallback(async (startAddress, endAddress) => {
    console.log('🎯 [HOOK] calculateRoute chamado com:', { startAddress, endAddress });
    
    if (!startAddress?.trim() || !endAddress?.trim()) {
      console.log('❌ [HOOK] Endereços inválidos');
      setError('Endereços de partida e destino são obrigatórios');
      return false;
    }

    console.log('⏳ [HOOK] Iniciando loading...');
    setLoading(true);
    setError(null);

    try {
      console.log('🌐 [HOOK] Chamando RouteService...');
      const data = await RouteService.calculateRoute(startAddress, endAddress);
      console.log('✅ [HOOK] RouteService retornou:', data);
      
      setRouteData(data.route);
      setSafetyInfo({
        safety_analysis: data.safety_analysis,
        ai_analysis: data.ai_analysis,
        recommendation: data.recommendation,
        suggestions: data.suggestions
      });

      console.log('✅ [HOOK] Estados atualizados com sucesso');
      return true;
    } catch (err) {
      console.error('❌ [HOOK] Erro capturado:', err);
      setError(err.message);
      return false;
    } finally {
      console.log('🏁 [HOOK] Finalizando loading...');
      setLoading(false);
    }
  }, []);

  const clearRoute = useCallback(() => {
    setRouteData(null);
    setSafetyInfo(null);
    setError(null);
  }, []);

  const geocodeAddress = useCallback(async (address, city) => {
    try {
      const data = await RouteService.geocodeAddress(address, city);
      return data.coordinates;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, []);

  return {
    loading,
    routeData,
    safetyInfo,
    error,
    calculateRoute,
    clearRoute,
    geocodeAddress
  };
};

