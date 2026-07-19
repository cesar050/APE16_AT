import requests
from domain.ports import AnalizadorNLPPort

CORENLP_URL = "http://localhost:9000"

class CoreNLPAdapter(AnalizadorNLPPort):
    """Adaptador que conecta el dominio con el servidor Stanford CoreNLP."""

    def analizar(self, oracion: str) -> dict:
        """
        Envía una oración al servidor CoreNLP y procesa la respuesta.

        Args:
            oracion: Texto de la oración a analizar.

        Returns:
            Diccionario con tokens, dependencias, sujeto, verbo y objeto extraídos.

        Raises:
            requests.exceptions.RequestException: Si el servidor CoreNLP no responde.
        """
        params = {
            "properties": '{"annotators":"tokenize,ssplit,mwt,pos,lemma,depparse","outputFormat":"json"}',
            "pipelineLanguage": "es"
        }

        resp = requests.post(CORENLP_URL, params=params, data=oracion.encode("utf-8"), timeout=30)
        result = resp.json()

        sent = result["sentences"][0]

        tokens = [
            {"word": t["word"], "pos": t["pos"], "lemma": t["lemma"]}
            for t in sent["tokens"]
        ]

        dependencias = [
            {
                "dep": d["dep"],
                "governor": d["governorGloss"],
                "dependent": d["dependentGloss"]
            }
            for d in sent["basicDependencies"]
        ]

        sujeto = verbo = objeto = "N/A"
        for d in sent["basicDependencies"]:
            if d["dep"] in ("nsubj", "nsubj:pass"):
                sujeto = d["dependentGloss"]
            if d["dep"].upper() == "ROOT":
                verbo = d["dependentGloss"]
            if d["dep"] in ("obj", "dobj"):
                objeto = d["dependentGloss"]

        return {
            "tokens": tokens,
            "dependencias": dependencias,
            "sujeto": sujeto,
            "verbo": verbo,
            "objeto": objeto
        }