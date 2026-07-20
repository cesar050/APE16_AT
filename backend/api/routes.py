import time
from flask import Blueprint, request, jsonify
from application.analizar_oracion_use_case import AnalizarOracionUseCase
from infrastructure.corenlp_adapter import CoreNLPAdapter
from infrastructure.spacy_adapter import SpacyAdapter
from infrastructure.clasificador_adapter import ClasificadorAdapter

analisis_bp = Blueprint("analisis", __name__)

def get_use_case_corenlp() -> AnalizarOracionUseCase:
    """
    Construye el caso de uso con el adaptador CoreNLP.

    Returns:
        Instancia de AnalizarOracionUseCase con CoreNLPAdapter.
    """
    return AnalizarOracionUseCase(CoreNLPAdapter(), ClasificadorAdapter())

def get_use_case_spacy() -> AnalizarOracionUseCase:
    """
    Construye el caso de uso con el adaptador spaCy.

    Returns:
        Instancia de AnalizarOracionUseCase con SpacyAdapter.
    """
    return AnalizarOracionUseCase(SpacyAdapter(), ClasificadorAdapter())

@analisis_bp.route("/analizar", methods=["POST"])
def analizar():
    """
    Endpoint que analiza una oración con Stanford CoreNLP.

    Request Body:
        JSON con campo 'oracion' (str).

    Returns:
        JSON con tokens, dependencias, sujeto, verbo, objeto y clasificación.
    """
    data = request.json
    oracion = data.get("oracion", "").strip()

    if not oracion:
        return jsonify({"error": "Oración vacía"}), 400

    try:
        inicio = time.time()
        resultado = get_use_case_corenlp().ejecutar(oracion)
        tiempo = round((time.time() - inicio) * 1000, 2)

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
            },
            "tiempo_ms": tiempo
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@analisis_bp.route("/comparar", methods=["POST"])
def comparar():
    """
    Endpoint que analiza una oración con ambas herramientas y retorna los resultados para comparación.

    Request Body:
        JSON con campo 'oracion' (str).

    Returns:
        JSON con resultados de CoreNLP y spaCy lado a lado.
    """
    data = request.json
    oracion = data.get("oracion", "").strip()

    if not oracion:
        return jsonify({"error": "Oración vacía"}), 400

    try:
        inicio_corenlp = time.time()
        resultado_corenlp = get_use_case_corenlp().ejecutar(oracion)
        tiempo_corenlp = round((time.time() - inicio_corenlp) * 1000, 2)

        inicio_spacy = time.time()
        resultado_spacy = get_use_case_spacy().ejecutar(oracion)
        tiempo_spacy = round((time.time() - inicio_spacy) * 1000, 2)

        return jsonify({
            "oracion": oracion,
            "corenlp": {
                "tokens": [{"word": t.word, "pos": t.pos, "lemma": t.lemma} for t in resultado_corenlp.tokens],
                "dependencias": [{"dep": d.dep, "governor": d.governor, "dependent": d.dependent} for d in resultado_corenlp.dependencias],
                "sujeto": resultado_corenlp.sujeto,
                "verbo": resultado_corenlp.verbo,
                "objeto": resultado_corenlp.objeto,
                "clasificacion": {
                    "tipo": resultado_corenlp.clasificacion.tipo,
                    "relacion": resultado_corenlp.clasificacion.relacion,
                    "conector": resultado_corenlp.clasificacion.conector
                },
                "tiempo_ms": tiempo_corenlp
            },
            "spacy": {
                "tokens": [{"word": t.word, "pos": t.pos, "lemma": t.lemma} for t in resultado_spacy.tokens],
                "dependencias": [{"dep": d.dep, "governor": d.governor, "dependent": d.dependent} for d in resultado_spacy.dependencias],
                "sujeto": resultado_spacy.sujeto,
                "verbo": resultado_spacy.verbo,
                "objeto": resultado_spacy.objeto,
                "clasificacion": {
                    "tipo": resultado_spacy.clasificacion.tipo,
                    "relacion": resultado_spacy.clasificacion.relacion,
                    "conector": resultado_spacy.clasificacion.conector
                },
                "tiempo_ms": tiempo_spacy
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500