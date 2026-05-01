from pydantic import BaseModel, Field
from typing import Optional

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    avatar: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    avatar: Optional[str] = None

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# HERANÇA ABSTRATA (Molde base)
class GameBase(BaseModel):
    title: str
    platform: str
    status: str

class GameCreate(GameBase):
    pass

class GameResponse(GameBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True

class PasswordRecoveryRequest(BaseModel):
    email: str

class PasswordReset(BaseModel):
    email: str
    code: str
    new_password: str

# ---------------------------------------------------------
# SCHEMAS PARA A BIBLIOTECA (UserGame)
# ---------------------------------------------------------

class UserGameCreate(BaseModel):
    game_id: str
    titulo: Optional[str] = None  
    capa: Optional[str] = None    
    dados_jogo: Optional[str] = None 
    status_principal: Optional[str] = "Quero Jogar"
    favorito: Optional[bool] = False
    horas_jogadas: Optional[float] = Field(default=0.0, ge=0.0)
    nota_geral: Optional[float] = None
    comentario: Optional[str] = None
    criterios: Optional[str] = None 
    conquistas: Optional[str] = None
    conquistas_personalizadas: Optional[str] = None

class UserGameResponse(BaseModel):
    id: int
    user_id: int
    game_id: str
    titulo: Optional[str] = None  
    capa: Optional[str] = None    
    dados_jogo: Optional[str] = None 
    status_principal: str
    favorito: bool
    horas_jogadas: float
    nota_geral: Optional[float]
    comentario: Optional[str]
    criterios: Optional[str]
    conquistas: Optional[str]
    conquistas_personalizadas: Optional[str]

    class Config:
        from_attributes = True

# ---------------------------------------------------------
# SCHEMAS PARA AS LISTAS
# ---------------------------------------------------------

# HERANÇA ABSTRATA (Molde base)
class ListaBase(BaseModel):
    list_id: str
    nome: str
    descricao: Optional[str] = ""
    jogos: str = "[]"
    criado_em: float

class ListaCreate(ListaBase):
    pass

class ListaResponse(ListaBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True
