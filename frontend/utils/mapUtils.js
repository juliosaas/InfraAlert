// utils/mapUtils.js
// Utilitários para manipulação do mapa

export const convertGeometryToCoordinates = (geometry) => {
  if (!geometry || !geometry.coordinates) return [];
  
  return geometry.coordinates.map(coord => ({
    latitude: coord[1],
    longitude: coord[0]
  }));
};

export const calculateMapRegion = (startCoords, endCoords, padding = 1.5) => {
  if (!startCoords || !endCoords) return null;
  
  const [startLat, startLng] = startCoords;
  const [endLat, endLng] = endCoords;
  
  const minLat = Math.min(startLat, endLat);
  const maxLat = Math.max(startLat, endLat);
  const minLng = Math.min(startLng, endLng);
  const maxLng = Math.max(startLng, endLng);
  
  const latDelta = (maxLat - minLat) * padding;
  const lngDelta = (maxLng - minLng) * padding;
  
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latDelta, 0.01),
    longitudeDelta: Math.max(lngDelta, 0.01),
  };
};

export const formatDistance = (meters) => {
  if (meters < 1000) {
    return `${Math.round(meters)}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
};

export const formatDuration = (seconds) => {
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) {
    return `${minutes}min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h ${remainingMinutes}min`;
};

export const getSafetyColor = (safetyLevel) => {
  switch (safetyLevel) {
    case 'SEGURA': return '#4CAF50';
    case 'MODERADA': return '#FF9800';
    case 'PERIGOSA': return '#F44336';
    default: return '#19549C';
  }
};

export const getRecommendationTitle = (type) => {
  switch (type) {
    case 'SUCCESS': return '✅ Rota Segura';
    case 'WARNING': return '⚠️ Atenção';
    case 'DANGER': return '🚨 Perigo';
    default: return 'ℹ️ Informação';
  }
};

