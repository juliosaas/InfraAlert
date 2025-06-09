import requests
import json
from geopy.geocoders import Nominatim
from geopy.distance import geodesic
import networkx as nx
from datetime import datetime, time
from typing import List, Dict, Tuple, Optional

class GeocodingService:
    def __init__(self):
        self.geolocator = Nominatim(user_agent="rota-segura-app")
    
    def geocode_address(self, address: str, city: str = "Campinas, SP") -> Optional[Tuple[float, float]]:
        """
        Converte um endereço em coordenadas lat/lng
        """
        try:
            print(f"🔍 Geocoding: {address}, {city}")
            full_address = f"{address}, {city}, Brasil"
            print(f"📍 Endereço completo: {full_address}")
            
            location = self.geolocator.geocode(full_address, timeout=3)  # Reduzido de 5 para 3
            if location:
                coords = (location.latitude, location.longitude)
                print(f"✅ Geocoding sucesso: {coords}")
                return coords
            else:
                print(f"❌ Geocoding falhou para: {full_address}")
                return None
        except Exception as e:
            print(f"❌ Erro no geocoding: {e}")
            return None
    
    def reverse_geocode(self, lat: float, lng: float) -> Optional[str]:
        """
        Converte coordenadas em endereço
        """
        try:
            location = self.geolocator.reverse((lat, lng), timeout=10)
            if location:
                return location.address
            return None
        except Exception as e:
            print(f"Erro no reverse geocoding: {e}")
            return None

class RoutingService:
    def __init__(self):
        self.geocoding = GeocodingService()
    
    def get_route_osrm(self, start_coords: Tuple[float, float], end_coords: Tuple[float, float]) -> Optional[Dict]:
        """
        Obtém rota usando OSRM (Open Source Routing Machine)
        """
        try:
            print(f"🛣️ Calculando rota OSRM...")
            print(f"📍 Start: {start_coords}")
            print(f"🎯 End: {end_coords}")
            
            start_lng, start_lat = start_coords[1], start_coords[0]
            end_lng, end_lat = end_coords[1], end_coords[0]
            
            url = f"http://router.project-osrm.org/route/v1/driving/{start_lng},{start_lat};{end_lng},{end_lat}"
            params = {
                'overview': 'full',
                'geometries': 'geojson',
                'steps': 'true'
            }
            
            print(f"🌐 URL OSRM: {url}")
            print(f"📤 Params: {params}")
            
            response = requests.get(url, params=params, timeout=8)  # Reduzido de 10 para 8
            print(f"📥 Response status: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"📊 OSRM response code: {data.get('code', 'N/A')}")
                if data['code'] == 'Ok' and data['routes']:
                    print(f"✅ Rota OSRM calculada com sucesso!")
                    return data['routes'][0]
                else:
                    print(f"❌ OSRM erro: {data}")
            else:
                print(f"❌ HTTP Error: {response.status_code}")
            return None
        except Exception as e:
            print(f"❌ Erro ao obter rota: {e}")
            return None
    
    def extract_street_names_from_route(self, route_data: Dict) -> List[str]:
        """
        Extrai nomes das ruas da rota
        """
        street_names = []
        if 'legs' in route_data:
            for leg in route_data['legs']:
                if 'steps' in leg:
                    for step in leg['steps']:
                        if 'name' in step and step['name']:
                            street_names.append(step['name'])
        return list(set(street_names))  # Remove duplicatas
    
    def calculate_route(self, start_address: str, end_address: str) -> Optional[Dict]:
        """
        Calcula rota completa entre dois endereços
        """
        print(f"🚀 Iniciando cálculo de rota...")
        print(f"📍 Origem: {start_address}")
        print(f"🎯 Destino: {end_address}")
        
        # Geocoding dos endereços
        print(f"📍 Fase 1: Geocoding origem...")
        start_coords = self.geocoding.geocode_address(start_address)
        if not start_coords:
            print(f"❌ Falha no geocoding da origem")
            return None
            
        print(f"📍 Fase 2: Geocoding destino...")
        end_coords = self.geocoding.geocode_address(end_address)
        if not end_coords:
            print(f"❌ Falha no geocoding do destino")
            return None
        
        print(f"📍 Fase 3: Calculando rota...")
        # Obter rota
        route_data = self.get_route_osrm(start_coords, end_coords)
        if not route_data:
            print(f"❌ Falha no cálculo da rota")
            return None
        
        print(f"📍 Fase 4: Extraindo nomes das ruas...")
        # Extrair nomes das ruas
        street_names = self.extract_street_names_from_route(route_data)
        print(f"🛣️ Ruas encontradas: {len(street_names)} ruas")
        
        result = {
            'start_coords': start_coords,
            'end_coords': end_coords,
            'route_data': route_data,
            'street_names': street_names,
            'distance': route_data.get('distance', 0),
            'duration': route_data.get('duration', 0)
        }
        
        print("✅ Rota calculada com sucesso!")
        return result

class SafetyAnalyzer:
    def __init__(self, db_session):
        self.db_session = db_session
    
    def is_time_in_danger_period(self, current_time: time, start_time: str, end_time: str) -> bool:
        """
        Verifica se o horário atual está no período de perigo
        """
        try:
            start = datetime.strptime(start_time, "%H:%M").time()
            end = datetime.strptime(end_time, "%H:%M").time()
            
            # Se o período cruza a meia-noite (ex: 20:00 às 05:00)
            if start > end:
                return current_time >= start or current_time <= end
            else:
                return start <= current_time <= end
        except:
            return False
    
    def analyze_street_safety(self, street_name: str, current_time: time = None) -> Dict:
        """
        Analisa a segurança de uma rua específica
        """
        if current_time is None:
            current_time = datetime.now().time()
        
        # Buscar dados da rua no banco
        from src.models.rota_segura import RotaSegura
        street_data = self.db_session.query(RotaSegura).filter(
            RotaSegura.nomeRua.ilike(f"%{street_name}%")
        ).first()
        
        if street_data:
            is_danger_time = self.is_time_in_danger_period(
                current_time, 
                street_data.horarioInicio, 
                street_data.horarioFim
            )
            
            # Ajustar índice baseado no horário
            safety_index = street_data.indicePericulosidade
            if is_danger_time:
                safety_index = min(10.0, safety_index * 1.5)  # Aumenta o perigo no horário crítico
            
            return {
                'street_name': street_name,
                'found_in_db': True,
                'base_danger_index': street_data.indicePericulosidade,
                'current_danger_index': safety_index,
                'is_danger_time': is_danger_time,
                'danger_period': f"{street_data.horarioInicio} - {street_data.horarioFim}"
            }
        else:
            return {
                'street_name': street_name,
                'found_in_db': False,
                'base_danger_index': 2.0,  # Índice padrão para ruas não catalogadas
                'current_danger_index': 2.0,
                'is_danger_time': False,
                'danger_period': None
            }
    
    def analyze_route_safety(self, street_names: List[str], current_time: time = None) -> Dict:
        """
        Analisa a segurança de uma rota completa
        """
        if current_time is None:
            current_time = datetime.now().time()
        
        street_analyses = []
        total_danger = 0
        streets_in_db = 0
        
        for street in street_names:
            analysis = self.analyze_street_safety(street, current_time)
            street_analyses.append(analysis)
            total_danger += analysis['current_danger_index']
            if analysis['found_in_db']:
                streets_in_db += 1
        
        avg_danger = total_danger / len(street_names) if street_names else 0
        coverage = (streets_in_db / len(street_names)) * 100 if street_names else 0
        
        # Classificar nível de segurança
        if avg_danger <= 3:
            safety_level = "SEGURA"
        elif avg_danger <= 6:
            safety_level = "MODERADA"
        else:
            safety_level = "PERIGOSA"
        
        return {
            'street_analyses': street_analyses,
            'average_danger_index': avg_danger,
            'safety_level': safety_level,
            'database_coverage': coverage,
            'total_streets': len(street_names),
            'streets_in_database': streets_in_db
        }

