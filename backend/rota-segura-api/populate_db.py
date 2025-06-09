import os
import sys
from datetime import datetime

# Adicionar o diretório raiz do projeto ao sys.path para importações
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), ".")))

from src.main import app
from src.models.rota_segura import db, RotaSegura

# Dados de exemplo para a tabela RotaSegura
sample_data = [
    # Ruas centrais (mais seguras)
    ("Rua Barão de Jaguara", "22:00", "06:00", 2.5),
    ("Avenida Francisco Glicério", "23:00", "05:00", 3.0),
    ("Rua Conceição", "22:00", "06:00", 2.8),
    ("Rua Dr. Quirino", "22:30", "05:30", 2.2),
    ("Avenida Andrade Neves", "23:00", "05:00", 3.2),

    # Ruas comerciais (segurança moderada)
    ("Rua 13 de Maio", "21:00", "06:00", 4.5),
    ("Rua General Osório", "21:30", "05:30", 4.2),
    ("Rua Regente Feijó", "22:00", "06:00", 3.8),
    ("Avenida Orosimbo Maia", "20:00", "07:00", 5.2),
    ("Rua José Paulino", "21:00", "06:00", 4.0),

    # Ruas periféricas (mais perigosas)
    ("Rua dos Expedicionários", "20:00", "07:00", 6.8),
    ("Avenida John Boyd Dunlop", "19:00", "07:00", 7.2),
    ("Rua Luiz Gama", "20:30", "06:30", 6.5),
    ("Avenida Ruy Rodriguez", "19:30", "07:30", 7.8),
    ("Rua Campos Sales", "20:00", "07:00", 6.2),

    # Ruas industriais (muito perigosas à noite)
    ("Avenida das Amoreiras", "18:00", "08:00", 8.5),
    ("Rua Jequitibás", "19:00", "07:00", 8.2),
    ("Avenida Mackenzie", "18:30", "07:30", 8.8),
    ("Rua Abolição", "19:00", "07:00", 7.9),
    ("Avenida Prestes Maia", "18:00", "08:00", 8.1),

    # Ruas residenciais nobres (seguras)
    ("Rua Coronel Quirino", "23:00", "05:00", 1.8),
    ("Avenida Júlio de Mesquita", "22:30", "05:30", 2.1),
    ("Rua Marechal Deodoro", "22:00", "06:00", 2.4),
    ("Rua Benjamin Constant", "22:30", "05:30", 2.0),
    ("Avenida Norte Sul", "21:00", "06:00", 3.5),

    # Ruas próximas a universidades
    ("Avenida Bertrand Russell", "20:00", "06:00", 4.8),
    ("Rua Saturnino de Brito", "20:30", "06:30", 5.1),
    ("Avenida Albert Einstein", "21:00", "06:00", 4.2),
    ("Rua Roxo Moreira", "20:00", "07:00", 5.5),
    ("Avenida Atílio Martini", "19:30", "07:30", 6.0),
]

def populate_rota_segura():
    with app.app_context():
        print("Iniciando população de dados para RotaSegura...")
        
        # Opcional: Limpar dados existentes antes de inserir
        # RotaSegura.query.delete()
        # db.session.commit()
        # print("Dados existentes da tabela RotaSegura limpos (se descomentado).")

        inserted_count = 0
        for nome, inicio, fim, perigo in sample_data:
            # Verificar se a rua já existe para evitar duplicatas
            existing_street = RotaSegura.query.filter_by(nomeRua=nome).first()
            if not existing_street:
                rua = RotaSegura(
                    nomeRua=nome,
                    horarioInicio=inicio,
                    horarioFim=fim,
                    indicePericulosidade=perigo
                )
                db.session.add(rua)
                inserted_count += 1
            else:
                print(f"Rua \'{nome}\' já existe, pulando inserção.")
        
        db.session.commit()
        print(f"População de dados concluída. {inserted_count} novas ruas inseridas.")
        
        total_ruas = RotaSegura.query.count()
        print(f"Total de ruas na tabela RotaSegura: {total_ruas}")

if __name__ == "__main__":
    # Defina a variável de ambiente DATABASE_URL antes de executar este script
    # Exemplo: export DATABASE_URL='postgresql://user:password@host:port/database'
    if "DATABASE_URL" not in os.environ:
        print("Erro: A variável de ambiente DATABASE_URL não está definida.")
        print("Por favor, defina-a antes de executar este script.")
        sys.exit(1)
    
    populate_rota_segura()


