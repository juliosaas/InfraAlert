from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class RotaSegura(db.Model):
    __tablename__ = 'RotaSegura'
    
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    nomeRua = db.Column(db.String(255), nullable=False)
    horarioInicio = db.Column(db.String(10), nullable=False)  # ex: "20:00"
    horarioFim = db.Column(db.String(10), nullable=False)     # ex: "05:00"
    indicePericulosidade = db.Column(db.Float, nullable=False)  # valor de 0.0 a 10.0
    
    def to_dict(self):
        return {
            'id': self.id,
            'nomeRua': self.nomeRua,
            'horarioInicio': self.horarioInicio,
            'horarioFim': self.horarioFim,
            'indicePericulosidade': self.indicePericulosidade
        }

