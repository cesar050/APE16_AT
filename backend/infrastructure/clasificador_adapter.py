import re
from domain.ports import ClasificadorPort

CONECTORES = {
    "coordinadas": {
        "sin embargo": "Adversativa",
        "pero": "Adversativa",
        "ni": "Copulativa",
        "y": "Copulativa",
        "e": "Copulativa",
        "o": "Disyuntiva",
        "u": "Disyuntiva",
    },
    "subordinadas": {
        "por lo tanto": "Consecutiva",
        "puesto que": "Causal",
        "para que": "Final",
        "ya que": "Causal",
        "porque": "Causal",
        "aunque": "Concesiva",
        "cuando": "Temporal",
        "mientras": "Temporal",
        "si": "Condicional",
    }
}

class ClasificadorAdapter(ClasificadorPort):
    """Adaptador que implementa la clasificación semántica de oraciones mediante reglas léxicas."""

    def clasificar(self, oracion: str) -> dict:
        """
        Clasifica una oración según los conectores presentes en el texto.

        Primero busca conectores multi-palabra y luego conectores simples
        usando límites de palabra para evitar falsos positivos.

        Args:
            oracion: Texto de la oración a clasificar.

        Returns:
            Diccionario con tipo de oración, relación semántica y conector detectado.
            Si no se detecta conector retorna tipo Simple con relacion y conector N/A.
        """
        texto = oracion.lower()

        for tipo, conectores in CONECTORES.items():
            for conector, relacion in conectores.items():
                if " " in conector and conector in texto:
                    categoria = "Compuesta Coordinada" if tipo == "coordinadas" else "Compuesta Subordinada"
                    return {"tipo": categoria, "relacion": relacion, "conector": conector}

        for tipo, conectores in CONECTORES.items():
            for conector, relacion in conectores.items():
                if " " not in conector:
                    patron = r'\b' + re.escape(conector) + r'\b'
                    if re.search(patron, texto):
                        categoria = "Compuesta Coordinada" if tipo == "coordinadas" else "Compuesta Subordinada"
                        return {"tipo": categoria, "relacion": relacion, "conector": conector}

        return {"tipo": "Simple", "relacion": "N/A", "conector": "N/A"}