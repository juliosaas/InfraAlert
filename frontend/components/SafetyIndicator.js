// components/SafetyIndicator.js
// Componente para exibir indicadores de segurança

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SafetyIndicator = ({ safetyLevel, aiScore, coverage }) => {
  const getSafetyConfig = (level) => {
    switch (level) {
      case 'SEGURA':
        return {
          color: '#4CAF50',
          icon: '🛡️',
          text: 'SEGURA'
        };
      case 'MODERADA':
        return {
          color: '#FF9800',
          icon: '⚠️',
          text: 'MODERADA'
        };
      case 'PERIGOSA':
        return {
          color: '#F44336',
          icon: '🚨',
          text: 'PERIGOSA'
        };
      default:
        return {
          color: '#9E9E9E',
          icon: 'ℹ️',
          text: 'DESCONHECIDA'
        };
    }
  };

  const config = getSafetyConfig(safetyLevel);

  return (
    <View style={styles.container}>
      <View style={styles.mainIndicator}>
        <Text style={styles.icon}>{config.icon}</Text>
        <Text style={[styles.levelText, { color: config.color }]}>
          {config.text}
        </Text>
      </View>
      
      {aiScore && (
        <Text style={styles.aiScore}>
          IA: {aiScore.toFixed(1)}/10
        </Text>
      )}
      
      {coverage && (
        <Text style={styles.coverage}>
          Cobertura: {coverage.toFixed(0)}%
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 8,
  },
  mainIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 16,
    marginRight: 4,
  },
  levelText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  aiScore: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  coverage: {
    fontSize: 10,
    color: '#999',
  },
});

export default SafetyIndicator;

