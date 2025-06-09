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
    if (!startAddress?.trim() || !endAddress?.trim()) {
      setError('Endereços de partida e destino são obrigatórios');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await RouteService.calculateRoute(startAddress, endAddress);
      
      setRouteData(data.route);
      setSafetyInfo({
        safety_analysis: data.safety_analysis,
        ai_analysis: data.ai_analysis,
        recommendation: data.recommendation,
        suggestions: data.suggestions
      });

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
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

