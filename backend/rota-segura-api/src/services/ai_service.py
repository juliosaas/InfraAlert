import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from datetime import datetime, time
import pickle
import os
from typing import List, Dict, Tuple, Optional
import json

class RouteOptimizationAI:
    """
    IA para otimização de rotas baseada em análise de segurança
    """
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.is_trained = False
        self.model_path = '/tmp/route_optimization_model.pkl'
        self.scaler_path = '/tmp/route_scaler.pkl'
        
    def extract_features(self, route_data: Dict, safety_analysis: Dict, current_time: time) -> np.array:
        """
        Extrai características da rota para o modelo de IA
        """
        features = []
        
        # Características temporais
        hour = current_time.hour
        minute = current_time.minute
        time_decimal = hour + minute / 60.0
        
        # Características da rota
        distance = route_data.get('distance_meters', 0) / 1000.0  # em km
        duration = route_data.get('duration_seconds', 0) / 3600.0  # em horas
        num_streets = len(route_data.get('street_names', []))
        
        # Características de segurança
        avg_danger = safety_analysis.get('average_danger_index', 5.0)
        coverage = safety_analysis.get('database_coverage', 0.0) / 100.0
        streets_in_db = safety_analysis.get('streets_in_database', 0)
        
        # Análise por período do dia
        is_night = 1 if 22 <= hour or hour <= 6 else 0
        is_rush_hour = 1 if (7 <= hour <= 9) or (17 <= hour <= 19) else 0
        is_weekend = 1 if datetime.now().weekday() >= 5 else 0
        
        # Análise de ruas perigosas
        dangerous_streets = 0
        moderate_streets = 0
        safe_streets = 0
        
        for street_analysis in safety_analysis.get('street_analyses', []):
            danger_index = street_analysis.get('current_danger_index', 5.0)
            if danger_index >= 7:
                dangerous_streets += 1
            elif danger_index >= 4:
                moderate_streets += 1
            else:
                safe_streets += 1
        
        # Normalizar contadores de ruas
        if num_streets > 0:
            dangerous_ratio = dangerous_streets / num_streets
            moderate_ratio = moderate_streets / num_streets
            safe_ratio = safe_streets / num_streets
        else:
            dangerous_ratio = moderate_ratio = safe_ratio = 0
        
        features = [
            time_decimal,
            distance,
            duration,
            num_streets,
            avg_danger,
            coverage,
            streets_in_db,
            is_night,
            is_rush_hour,
            is_weekend,
            dangerous_ratio,
            moderate_ratio,
            safe_ratio
        ]
        
        return np.array(features).reshape(1, -1)
    
    def calculate_route_score(self, route_data: Dict, safety_analysis: Dict, current_time: time) -> float:
        """
        Calcula um score de qualidade da rota (0-10, onde 10 é melhor)
        """
        # Fatores de peso
        safety_weight = 0.4
        distance_weight = 0.3
        time_weight = 0.2
        coverage_weight = 0.1
        
        # Score de segurança (inverso do perigo)
        avg_danger = safety_analysis.get('average_danger_index', 5.0)
        safety_score = max(0, 10 - avg_danger)
        
        # Score de distância (preferir rotas mais curtas, mas não penalizar muito)
        distance_km = route_data.get('distance_meters', 0) / 1000.0
        distance_score = max(0, 10 - (distance_km / 5))  # Penaliza após 5km
        
        # Score de tempo (preferir rotas mais rápidas)
        duration_hours = route_data.get('duration_seconds', 0) / 3600.0
        time_score = max(0, 10 - (duration_hours * 10))  # Penaliza após 1h
        
        # Score de cobertura (preferir rotas com mais dados)
        coverage = safety_analysis.get('database_coverage', 0.0)
        coverage_score = coverage / 10.0  # Converte % para 0-10
        
        # Score final ponderado
        final_score = (
            safety_score * safety_weight +
            distance_score * distance_weight +
            time_score * time_weight +
            coverage_score * coverage_weight
        )
        
        return min(10.0, max(0.0, final_score))
    
    def generate_synthetic_training_data(self, num_samples: int = 1000) -> Tuple[np.array, np.array]:
        """
        Gera dados sintéticos para treinar o modelo
        """
        np.random.seed(42)
        
        X = []
        y = []
        
        for _ in range(num_samples):
            # Gerar características aleatórias
            time_decimal = np.random.uniform(0, 24)
            distance = np.random.exponential(5)  # Média de 5km
            duration = distance / np.random.uniform(20, 60)  # Velocidade entre 20-60 km/h
            num_streets = max(1, int(np.random.poisson(10)))
            avg_danger = np.random.uniform(0, 10)
            coverage = np.random.uniform(0, 1)
            streets_in_db = int(num_streets * coverage)
            
            # Características temporais
            is_night = 1 if 22 <= time_decimal or time_decimal <= 6 else 0
            is_rush_hour = 1 if (7 <= time_decimal <= 9) or (17 <= time_decimal <= 19) else 0
            is_weekend = np.random.choice([0, 1], p=[5/7, 2/7])
            
            # Distribuição de ruas por perigo
            dangerous_ratio = np.random.beta(2, 5) if avg_danger > 6 else np.random.beta(1, 10)
            safe_ratio = np.random.beta(5, 2) if avg_danger < 4 else np.random.beta(1, 5)
            moderate_ratio = max(0, 1 - dangerous_ratio - safe_ratio)
            
            features = [
                time_decimal, distance, duration, num_streets, avg_danger,
                coverage, streets_in_db, is_night, is_rush_hour, is_weekend,
                dangerous_ratio, moderate_ratio, safe_ratio
            ]
            
            # Calcular score baseado em regras heurísticas
            safety_score = max(0, 10 - avg_danger)
            distance_score = max(0, 10 - (distance / 5))
            time_score = max(0, 10 - (duration * 10))
            coverage_score = coverage * 10
            
            # Penalidades por período noturno e ruas perigosas
            night_penalty = 2 if is_night else 0
            danger_penalty = dangerous_ratio * 3
            
            score = (
                safety_score * 0.4 +
                distance_score * 0.3 +
                time_score * 0.2 +
                coverage_score * 0.1 -
                night_penalty -
                danger_penalty
            )
            
            score = min(10.0, max(0.0, score))
            
            X.append(features)
            y.append(score)
        
        return np.array(X), np.array(y)
    
    def train_model(self, force_retrain: bool = False):
        """
        Treina o modelo de IA
        """
        if self.is_trained and not force_retrain:
            return
        
        # Tentar carregar modelo existente
        if os.path.exists(self.model_path) and os.path.exists(self.scaler_path) and not force_retrain:
            try:
                with open(self.model_path, 'rb') as f:
                    self.model = pickle.load(f)
                with open(self.scaler_path, 'rb') as f:
                    self.scaler = pickle.load(f)
                self.is_trained = True
                return
            except:
                pass
        
        # Gerar dados de treinamento
        X, y = self.generate_synthetic_training_data(2000)
        
        # Dividir dados
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        # Normalizar características
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Treinar modelo
        self.model = RandomForestRegressor(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        
        self.model.fit(X_train_scaled, y_train)
        
        # Avaliar modelo
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        print(f"Modelo treinado - Score treino: {train_score:.3f}, Score teste: {test_score:.3f}")
        
        # Salvar modelo
        try:
            with open(self.model_path, 'wb') as f:
                pickle.dump(self.model, f)
            with open(self.scaler_path, 'wb') as f:
                pickle.dump(self.scaler, f)
        except Exception as e:
            print(f"Erro ao salvar modelo: {e}")
        
        self.is_trained = True
    
    def predict_route_quality(self, route_data: Dict, safety_analysis: Dict, current_time: time) -> Dict:
        """
        Prediz a qualidade da rota usando IA
        """
        if not self.is_trained:
            self.train_model()
        
        # Extrair características
        features = self.extract_features(route_data, safety_analysis, current_time)
        features_scaled = self.scaler.transform(features)
        
        # Fazer predição
        ai_score = self.model.predict(features_scaled)[0]
        
        # Calcular score heurístico para comparação
        heuristic_score = self.calculate_route_score(route_data, safety_analysis, current_time)
        
        # Score final (média ponderada)
        final_score = (ai_score * 0.7 + heuristic_score * 0.3)
        
        # Classificar qualidade
        if final_score >= 8:
            quality = "EXCELENTE"
        elif final_score >= 6:
            quality = "BOA"
        elif final_score >= 4:
            quality = "REGULAR"
        else:
            quality = "RUIM"
        
        return {
            'ai_score': float(ai_score),
            'heuristic_score': float(heuristic_score),
            'final_score': float(final_score),
            'quality_rating': quality,
            'confidence': min(1.0, safety_analysis.get('database_coverage', 0) / 100.0)
        }
    
    def suggest_route_improvements(self, route_data: Dict, safety_analysis: Dict, current_time: time) -> List[str]:
        """
        Sugere melhorias para a rota
        """
        suggestions = []
        
        avg_danger = safety_analysis.get('average_danger_index', 5.0)
        coverage = safety_analysis.get('database_coverage', 0.0)
        hour = current_time.hour
        
        # Sugestões baseadas no horário
        if 22 <= hour or hour <= 6:
            suggestions.append("Considere usar transporte público ou táxi durante a madrugada")
            if avg_danger > 6:
                suggestions.append("Evite caminhar sozinho neste horário")
        
        # Sugestões baseadas na segurança
        if avg_danger > 7:
            suggestions.append("Rota com alto risco - considere alternativas mais seguras")
            suggestions.append("Mantenha contato com alguém durante o trajeto")
        elif avg_danger > 5:
            suggestions.append("Mantenha atenção redobrada durante o trajeto")
        
        # Sugestões baseadas na cobertura de dados
        if coverage < 50:
            suggestions.append("Dados de segurança limitados - mantenha-se em áreas movimentadas")
        
        # Sugestões baseadas na distância
        distance_km = route_data.get('distance_meters', 0) / 1000.0
        if distance_km > 10:
            suggestions.append("Trajeto longo - considere fazer paradas em locais seguros")
        
        return suggestions

# Instância global da IA
route_ai = RouteOptimizationAI()

