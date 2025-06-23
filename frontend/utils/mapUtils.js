// utils/mapUtils.js
// Utilitários para manipulação de mapas e dados geográficos

/**
 * Converte geometria de rota em coordenadas para o mapa
 */
export const convertGeometryToCoordinates = (geometry) => {
  if (!geometry) return [];
  
  try {
    // Se for uma string, tenta fazer parse JSON
    if (typeof geometry === 'string') {
      geometry = JSON.parse(geometry);
    }
    
    // Se for um array de coordenadas simples
    if (Array.isArray(geometry) && geometry.length > 0) {
      return geometry.map(coord => ({
        latitude: coord[0] || coord.lat || coord.latitude,
        longitude: coord[1] || coord.lng || coord.longitude
      }));
    }
    
    // Se for um objeto GeoJSON
    if (geometry.type === 'LineString' && geometry.coordinates) {
      return geometry.coordinates.map(coord => ({
        latitude: coord[1],
        longitude: coord[0]
      }));
    }
    
    // Se for coordenadas diretas
    if (geometry.coordinates && Array.isArray(geometry.coordinates)) {
      return geometry.coordinates.map(coord => ({
        latitude: coord[1] || coord[0],
        longitude: coord[0] || coord[1]
      }));
    }
    
    console.warn('Formato de geometria não reconhecido:', geometry);
    return [];
  } catch (error) {
    console.error('Erro ao converter geometria:', error);
    return [];
  }
};

/**
 * Calcula região do mapa baseada nas coordenadas de início e fim
 */
export const calculateMapRegion = (startCoords, endCoords) => {
  if (!startCoords || !endCoords) {
    console.warn('Coordenadas inválidas para calcular região');
    return null;
  }
  
  try {
    const startLat = Array.isArray(startCoords) ? startCoords[0] : startCoords.latitude;
    const startLng = Array.isArray(startCoords) ? startCoords[1] : startCoords.longitude;
    const endLat = Array.isArray(endCoords) ? endCoords[0] : endCoords.latitude;
    const endLng = Array.isArray(endCoords) ? endCoords[1] : endCoords.longitude;
    
    const minLat = Math.min(startLat, endLat);
    const maxLat = Math.max(startLat, endLat);
    const minLng = Math.min(startLng, endLng);
    const maxLng = Math.max(startLng, endLng);
    
    const centerLat = (minLat + maxLat) / 2;
    const centerLng = (minLng + maxLng) / 2;
    
    const deltaLat = Math.abs(maxLat - minLat) * 1.5; // Adiciona margem
    const deltaLng = Math.abs(maxLng - minLng) * 1.5;
    
    // Valores mínimos para zoom adequado
    const minDelta = 0.01;
    
    return {
      latitude: centerLat,
      longitude: centerLng,
      latitudeDelta: Math.max(deltaLat, minDelta),
      longitudeDelta: Math.max(deltaLng, minDelta),
    };
  } catch (error) {
    console.error('Erro ao calcular região do mapa:', error);
    return null;
  }
};

/**
 * Formata distância em metros para exibição
 */
export const formatDistance = (distanceMeters) => {
  if (!distanceMeters || distanceMeters <= 0) return '0m';
  
  if (distanceMeters < 1000) {
    return `${Math.round(distanceMeters)}m`;
  } else {
    const km = distanceMeters / 1000;
    return `${km.toFixed(1)}km`;
  }
};

/**
 * Formata duração em segundos para exibição
 */
export const formatDuration = (durationSeconds) => {
  if (!durationSeconds || durationSeconds <= 0) return '0min';
  
  const minutes = Math.round(durationSeconds / 60);
  
  if (minutes < 60) {
    return `${minutes}min`;
  } else {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
  }
};

/**
 * Retorna cor baseada no nível de segurança
 */
export const getSafetyColor = (safetyLevel) => {
  switch (safetyLevel?.toLowerCase()) {
    case 'segura':
      return '#22c55e'; // Verde
    case 'moderada':
      return '#f59e0b'; // Amarelo
    case 'perigosa':
      return '#ef4444'; // Vermelho
    default:
      return '#6b7280'; // Cinza padrão
  }
};

/**
 * Retorna título da recomendação baseado no tipo
 */
export const getRecommendationTitle = (type) => {
  switch (type?.toLowerCase()) {
    case 'safe':
      return '✅ Rota Segura';
    case 'caution':
      return '⚠️ Atenção Recomendada';
    case 'danger':
      return '🚨 Cuidado!';
    case 'alternative':
      return '🔄 Rota Alternativa';
    default:
      return 'ℹ️ Recomendação';
  }
};

/**
 * Calcula distância entre duas coordenadas (fórmula de Haversine)
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Raio da Terra em metros
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Distância em metros
};

/**
 * Valida se as coordenadas são válidas
 */
export const isValidCoordinate = (lat, lng) => {
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180 &&
    !isNaN(lat) && !isNaN(lng)
  );
};
