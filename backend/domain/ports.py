from abc import ABC, abstractmethod

class AnalizadorNLPPort(ABC):
    """Puerto que define el contrato para cualquier analizador NLP externo."""

    @abstractmethod
    def analizar(self, oracion: str) -> dict:
        """
        Analiza una oración y retorna tokens, dependencias y roles gramaticales.
        
        Args:
            oracion: Texto de la oración a analizar.
        
        Returns:
            Diccionario con tokens, dependencias, sujeto, verbo y objeto.
        """
        pass

class ClasificadorPort(ABC):
    """Puerto que define el contrato para el clasificador semántico de oraciones."""

    @abstractmethod
    def clasificar(self, oracion: str) -> dict:
        """
        Clasifica una oración según su conector y relación semántica.
        
        Args:
            oracion: Texto de la oración a clasificar.
        
        Returns:
            Diccionario con tipo, relacion y conector detectado.
        """
        pass