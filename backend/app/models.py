from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, Float, Text
from sqlalchemy.orm import relationship, validates
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    avatar = Column(Text, nullable=True)

class RecoveryCode(Base):
    __tablename__ = "recovery_codes"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, index=True)
    code = Column(String)
    expires_at = Column(String)

# 1. HERANÇA: A nossa classe UserGame "herda" as características da classe 'Base' do SQLAlchemy.
class UserGame(Base):
    __tablename__ = "user_games"

    id = Column(Integer, primary_key=True, index=True)
    
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    game_id = Column(String, nullable=False) 

    titulo = Column(String, nullable=True) 
    capa = Column(String, nullable=True)
    dados_jogo = Column(Text, nullable=True)
    
    status_principal = Column(String, default="Quero Jogar") 
    favorito = Column(Boolean, default=False)
    
    # Atributo "privado" para aplicar o encapsulamento
    _horas_jogadas = Column("horas_jogadas", Float, default=0.0)

    nota_geral = Column(Float, nullable=True) 
    comentario = Column(String, nullable=True)
    criterios = Column(String, nullable=True) 
    conquistas = Column(String, nullable=True) 
    conquistas_personalizadas = Column(String, nullable=True)

    # Relacionamento (Diz para o banco que esse jogo pertence a um User)
    user = relationship("User", backref="meus_jogos")

    # 2. ENCAPSULAMENTO: Protegendo o dado de horas jogadas. 
    @validates('_horas_jogadas')
    def validate_horas(self, key, value):
        if value < 0:
            raise ValueError("As horas jogadas não podem ser negativas!")
        return value

    @property
    def horas_jogadas(self):
        return self._horas_jogadas

    @horas_jogadas.setter
    def horas_jogadas(self, value):
        self._horas_jogadas = value

class Lista(Base):
    __tablename__ = "listas"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id")) 
    list_id = Column(String, unique=True, index=True)
    nome = Column(String)
    descricao = Column(String, nullable=True)
    jogos = Column(Text, default="[]") 
    criado_em = Column(Float)