import spacy
import time
from domain.ports import AnalizadorNLPPort

nlp = spacy.load("es_core_news_sm")

class SpacyAdapter(AnalizadorNLPPort):
    """Adaptador que conecta el dominio con la librería spaCy para análisis lingüístico."""

    def analizar(self, oracion: str) -> dict:
        """
        Analiza una oración usando spaCy y retorna tokens, dependencias y roles gramaticales.

        Args:
            oracion: Texto de la oración a analizar.

        Returns:
            Diccionario con tokens, dependencias, sujeto, verbo, objeto y tiempo de ejecución.
        """
        inicio = time.time()
        doc = nlp(oracion)
        tiempo = round((time.time() - inicio) * 1000, 2)

        tokens = [
            {"word": token.text, "pos": token.pos_, "lemma": token.lemma_}
            for token in doc
        ]

        dependencias = [
            {"dep": token.dep_, "governor": token.head.text, "dependent": token.text}
            for token in doc
        ]

        sujeto = verbo = objeto = "N/A"
        for token in doc:
            if token.dep_ in ("nsubj", "nsubj:pass"):
                sujeto = token.text
            if token.dep_ == "ROOT":
                verbo = token.text
            if token.dep_ in ("obj", "dobj"):
                objeto = token.text

        return {
            "tokens": tokens,
            "dependencias": dependencias,
            "sujeto": sujeto,
            "verbo": verbo,
            "objeto": objeto,
            "tiempo_ms": tiempo
        }