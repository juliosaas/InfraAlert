from flask import Blueprint, request, jsonify
from datetime import datetime, time
from src.services.routing_service import RoutingService, SafetyAnalyzer
from src.services.ai_service import route_ai
from src.models.rota_segura import db

routing_bp = Blueprint('routing', __name__)

@routing_bp.route('/calculate-route', methods=['POST'])
def calculate_route():
    """
    Endpoint para calcular rota entre dois pontos com análise de IA
    """
    try:
        data = request.get_json()
        start_address = data.get('start_address')
        end_address = data.get('end_address')
        current_time_str = data.get('current_time')  # formato "HH:MM"
        
        if not start_address or not end_address:
            return jsonify({
                'error': 'Endereços de origem e destino são obrigatórios'
            }), 400
        
        # Parse do horário atual
        current_time = None
        if current_time_str:
            try:
                current_time = datetime.strptime(current_time_str, "%H:%M").time()
            except:
                current_time = datetime.now().time()
        else:
            current_time = datetime.now().time()
        
        # Calcular rota
        routing_service = RoutingService()
        route_result = routing_service.calculate_route(start_address, end_address)
        
        if not route_result:
            return jsonify({
                'error': 'Não foi possível calcular a rota'
            }), 404
        
        # Analisar segurança da rota
        safety_analyzer = SafetyAnalyzer(db.session)
        safety_analysis = safety_analyzer.analyze_route_safety(
            route_result['street_names'], 
            current_time
        )
        
        # Análise com IA
        ai_analysis = route_ai.predict_route_quality(
            route_result, 
            safety_analysis, 
            current_time
        )
        
        # Sugestões de melhoria
        suggestions = route_ai.suggest_route_improvements(
            route_result, 
            safety_analysis, 
            current_time
        )
        
        # Preparar resposta
        response = {
            'route': {
                'start_coords': route_result['start_coords'],
                'end_coords': route_result['end_coords'],
                'distance_meters': route_result['distance'],
                'duration_seconds': route_result['duration'],
                'geometry': route_result['route_data']['geometry'],
                'street_names': route_result['street_names']
            },
            'safety_analysis': safety_analysis,
            'ai_analysis': ai_analysis,
            'suggestions': suggestions,
            'recommendation': generate_route_recommendation(safety_analysis, ai_analysis),
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erro interno do servidor: {str(e)}'
        }), 500

@routing_bp.route('/test-route', methods=['POST'])
def test_route():
    """
    Endpoint de teste com dados simulados
    """
    try:
        data = request.get_json()
        start_address = data.get('start_address', 'Origem Teste')
        end_address = data.get('end_address', 'Destino Teste')
        
        print(f"🧪 Teste de rota simulada")
        print(f"📍 Origem: {start_address}")
        print(f"🎯 Destino: {end_address}")
        
        # Dados simulados para Campinas
        mock_response = {
            'route': {
                'start_coords': [-22.9064, -47.0616],  # Campinas centro
                'end_coords': [-22.9164, -47.0716],    # Próximo ao centro
                'distance_meters': 1500,
                'duration_seconds': 420,  # 7 minutos
                'geometry': {
                    'type': 'LineString',
                    'coordinates': [
                        [-47.0616, -22.9064],
                        [-47.0666, -22.9114],
                        [-47.0716, -22.9164]
                    ]
                },
                'street_names': ['Rua Teste A', 'Rua Teste B', 'Rua Teste C']
            },
            'safety_analysis': {
                'safety_level': 'MODERADA',
                'risk_score': 6.5,
                'database_coverage': 0.8,
                'incident_count': 3,
                'risk_factors': ['Tráfego intenso', 'Área comercial']
            },
            'ai_analysis': {
                'final_score': 7.2,
                'confidence': 0.85,
                'quality': 'BOA'
            },
            'suggestions': ['Evite horários de pico', 'Mantenha atenção em cruzamentos'],
            'recommendation': {
                'type': 'WARNING',
                'message': 'Rota com qualidade regular. (Score IA: 7.2/10)',
                'suggestion': 'Mantenha atenção redobrada durante o trajeto.',
                'ai_confidence': 'ALTA'
            },
            'timestamp': datetime.now().isoformat()
        }
        
        print(f"✅ Retornando dados simulados")
        return jsonify(mock_response), 200
        
    except Exception as e:
        print(f"❌ Erro no teste: {e}")
        return jsonify({
            'error': f'Erro no teste: {str(e)}'
        }), 500

@routing_bp.route('/analyze-street', methods=['POST'])
def analyze_street():
    """
    Endpoint para analisar a segurança de uma rua específica
    """
    try:
        data = request.get_json()
        street_name = data.get('street_name')
        current_time_str = data.get('current_time')
        
        if not street_name:
            return jsonify({
                'error': 'Nome da rua é obrigatório'
            }), 400
        
        # Parse do horário atual
        current_time = None
        if current_time_str:
            try:
                current_time = datetime.strptime(current_time_str, "%H:%M").time()
            except:
                current_time = datetime.now().time()
        else:
            current_time = datetime.now().time()
        
        # Analisar segurança
        safety_analyzer = SafetyAnalyzer(db.session)
        analysis = safety_analyzer.analyze_street_safety(street_name, current_time)
        
        return jsonify(analysis), 200
        
    except Exception as e:
        return jsonify({
            'error': f'Erro interno do servidor: {str(e)}'
        }), 500

@routing_bp.route('/geocode', methods=['POST'])
def geocode_address():
    """
    Endpoint para converter endereço em coordenadas
    """
    try:
        data = request.get_json()
        address = data.get('address')
        city = data.get('city', 'Campinas, SP')
        
        if not address:
            return jsonify({
                'error': 'Endereço é obrigatório'
            }), 400
        
        routing_service = RoutingService()
        coords = routing_service.geocoding.geocode_address(address, city)
        
        if coords:
            return jsonify({
                'address': address,
                'coordinates': {
                    'latitude': coords[0],
                    'longitude': coords[1]
                }
            }), 200
        else:
            return jsonify({
                'error': 'Endereço não encontrado'
            }), 404
            
    except Exception as e:
        return jsonify({
            'error': f'Erro interno do servidor: {str(e)}'
        }), 500

@routing_bp.route('/train-ai', methods=['POST'])
def train_ai():
    """
    Endpoint para retreinar o modelo de IA
    """
    try:
        route_ai.train_model(force_retrain=True)
        return jsonify({
            'message': 'Modelo de IA retreinado com sucesso'
        }), 200
    except Exception as e:
        return jsonify({
            'error': f'Erro ao treinar IA: {str(e)}'
        }), 500

def generate_route_recommendation(safety_analysis, ai_analysis):
    """
    Gera recomendação baseada na análise de segurança e IA
    """
    avg_danger = safety_analysis['average_danger_index']
    safety_level = safety_analysis['safety_level']
    coverage = safety_analysis['database_coverage']
    ai_score = ai_analysis['final_score']
    quality = ai_analysis['quality_rating']
    
    if coverage < 30:
        return {
            'type': 'INFO',
            'message': f'Rota traçada com base no caminho mais curto. Dados de segurança limitados ({coverage:.1f}% das ruas catalogadas).',
            'suggestion': 'Mantenha-se atento ao ambiente e prefira ruas movimentadas.',
            'ai_confidence': 'BAIXA'
        }
    
    if quality == 'EXCELENTE':
        return {
            'type': 'SUCCESS',
            'message': f'Excelente rota identificada! (Score IA: {ai_score:.1f}/10)',
            'suggestion': 'Esta é uma ótima opção para o horário atual.',
            'ai_confidence': 'ALTA'
        }
    elif quality == 'BOA':
        return {
            'type': 'SUCCESS',
            'message': f'Boa rota identificada! (Score IA: {ai_score:.1f}/10)',
            'suggestion': 'Rota recomendada com segurança adequada.',
            'ai_confidence': 'ALTA'
        }
    elif quality == 'REGULAR':
        return {
            'type': 'WARNING',
            'message': f'Rota com qualidade regular. (Score IA: {ai_score:.1f}/10)',
            'suggestion': 'Mantenha atenção redobrada durante o trajeto.',
            'ai_confidence': 'MÉDIA'
        }
    else:
        return {
            'type': 'DANGER',
            'message': f'Atenção! Rota com baixa qualidade. (Score IA: {ai_score:.1f}/10)',
            'suggestion': 'Considere alternativas mais seguras ou aguarde um horário melhor.',
            'ai_confidence': 'ALTA'
        }

