from flask import Blueprint, request, jsonify
from application.analizar_oracion_use_case import AnalizarOracionUseCase
from infrastructure.corenlp_adapter import CoreNLPAdapter
from infrastructure.clasificador_adapter import ClasificadorAdapter

analisis_bp = Blueprint("analisis", __name__)

def get_use_case() -> AnalizarOracionUseCase:
    """
    Construye e inyecta las dependencias del caso de uso.

    Returns:
        Instancia de AnalizarOracionUseCase con los adaptadores configurados.
    """
    analizador = CoreNLPAdapter()
    clasificador = ClasificadorAdapter()
    return AnalizarOracionUseCase(analizador, clasificador)

@analisis_bp.route("/analizar", methods=["POST"])
def analizar():
    """
    Endpoint principal que recibe una oración y retorna su análisis completo.

    Request Body:
        JSON con campo 'oracion' (str).

    Returns:
        JSON con tokens, dependencias, sujeto, verbo, objeto y clasificación.
        HTTP 400 si la oración está vacía.
        HTTP 500 si ocurre un error interno.
    """
    data = request.json
    oracion = data.get("oracion", "").strip()

    if not oracion:
        return jsonify({"error": "Oración vacía"}), 400

    try:
        use_case = get_use_case()
        resultado = use_case.ejecutar(oracion)

        return jsonify({
            "oracion": resultado.oracion,
            "tokens": [{"word": t.word, "pos": t.pos, "lemma": t.lemma} for t in resultado.tokens],
            "dependencias": [{"dep": d.dep, "governor": d.governor, "dependent": d.dependent} for d in resultado.dependencias],
            "sujeto": resultado.sujeto,
            "verbo": resultado.verbo,
            "objeto": resultado.objeto,
            "clasificacion": {
                "tipo": resultado.clasificacion.tipo,
                "relacion": resultado.clasificacion.relacion,
                "conector": resultado.clasificacion.conector
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500