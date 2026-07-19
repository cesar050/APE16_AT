from dataclasses import dataclass, field
from typing import List

@dataclass
class Token:
    """Representa un token léxico extraído de una oración."""
    word: str
    pos: str
    lemma: str

@dataclass
class Dependencia:
    """Representa una relación de dependencia sintáctica entre dos palabras."""
    dep: str
    governor: str
    dependent: str

@dataclass
class Clasificacion:
    """Representa la clasificación semántica de una oración compuesta."""
    tipo: str
    relacion: str
    conector: str

@dataclass
class AnalisisOracion:
    """Entidad principal que agrupa todos los resultados del análisis lingüístico."""
    oracion: str
    tokens: List[Token]
    dependencias: List[Dependencia]
    sujeto: str
    verbo: str
    objeto: str
    clasificacion: Clasificacion