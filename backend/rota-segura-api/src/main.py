import os
import sys
from dotenv import load_dotenv

# carregar variáveis de ambiente
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))

# nao usar o sys.path.append estava dando problema de importação
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
sys.path.insert(0, os.path.dirname(__file__))

from flask import Flask, send_from_directory
from flask_cors import CORS
from src.models.rota_segura import db, RotaSegura
from src.routes.routing import routing_bp

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'asdf#FGSgvasgf$5$WGT'

# configuração do bd
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///rota_segura.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# inicializa SQLAlchemy com a aplicação
db.init_app(app)

# criar  astabelas se não existirem
with app.app_context():
    db.create_all()

# habilitar CORS para todas as rotas
CORS(app)

app.register_blueprint(routing_bp, url_prefix='/api/routing')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    import time
    return {
        'status': 'OK',
        'message': 'InfraAlert API Python está funcionando',
        'timestamp': time.strftime('%Y-%m-%d %H:%M:%S'), #horario do request 
        'service': 'rota-segura-api',
        'version': '1.0.0'
    }

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
            return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)): # se o caminho nao existir, retorna 404
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return "index.html not found", 404


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
