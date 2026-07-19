from flask import Flask
from flask_cors import CORS
from api.routes import analisis_bp

def create_app() -> Flask:
    """
    Crea y configura la instancia de la aplicación Flask.

    Returns:
        Instancia de Flask con CORS habilitado y rutas registradas.
    """
    app = Flask(__name__)
    CORS(app)
    app.register_blueprint(analisis_bp)
    return app

if __name__ == "__main__":
    """Punto de entrada principal de la aplicación."""
    app = create_app()
    app.run(debug=True, port=5000)