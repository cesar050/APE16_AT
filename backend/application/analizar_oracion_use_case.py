from domain.ports import AnalizadorNLPPort, ClasificadorPort
from domain.models import AnalisisOracion, Token, Dependencia, Clasificacion

class AnalizarOracionUseCase:
    """Caso de uso principal que orquesta el análisis lingüístico de una oración."""

    def __init__(self, analizador: AnalizadorNLPPort, clasificador: ClasificadorPort):
        """
        Inicializa el caso de uso con los adaptadores necesarios.

        Args:
            analizador: Adaptador que implementa el análisis NLP.
            clasificador: Adaptador que implementa la clasificación semántica.
        """
        self.analizador = analizador
        self.clasificador = clasificador

    def ejecutar(self, oracion: str) -> AnalisisOracion:
        """
        Ejecuta el análisis completo de una oración.

        Args:
            oracion: Texto de la oración a analizar.

        Returns:
            Instancia de AnalisisOracion con todos los resultados del análisis.
        """
        resultado_nlp = self.analizador.analizar(oracion)
        resultado_clasificacion = self.clasificador.clasificar(oracion)

        tokens = [Token(**t) for t in resultado_nlp["tokens"]]
        dependencias = [Dependencia(**d) for d in resultado_nlp["dependencias"]]
        clasificacion = Clasificacion(**resultado_clasificacion)

        return AnalisisOracion(
            oracion=oracion,
            tokens=tokens,
            dependencias=dependencias,
            sujeto=resultado_nlp["sujeto"],
            verbo=resultado_nlp["verbo"],
            objeto=resultado_nlp["objeto"],
            clasificacion=clasificacion
        )