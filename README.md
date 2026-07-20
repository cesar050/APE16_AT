# Analizador Lingüístico — Stanford CoreNLP

Práctica 16 — Teoría de Autómatas y Computabilidad Avanzada  
Universidad Nacional de Loja — FEIRNNR — 6to Ciclo

Sistema web para el análisis léxico, sintáctico y semántico de oraciones en español utilizando Stanford CoreNLP y spaCy, con arquitectura hexagonal en el backend y React en el frontend.

---

## Requisitos previos

Antes de ejecutar el proyecto asegúrate de tener instalado lo siguiente:

| Herramienta | Versión mínima | Descarga |
|-------------|---------------|---------|
| Java JDK | 11+ | https://adoptium.net |
| Python | 3.10+ | https://python.org |
| Node.js | 18+ | https://nodejs.org |
| Git | cualquiera | https://git-scm.com |

---

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/cesar050/APE16_AT.git
cd APE16_AT
```

### 2. Descargar Stanford CoreNLP

```bash
wget https://nlp.stanford.edu/software/stanford-corenlp-4.5.7.zip
wget https://nlp.stanford.edu/software/stanford-corenlp-4.5.7-models-spanish.jar
unzip stanford-corenlp-4.5.7.zip
mv stanford-corenlp-4.5.7-models-spanish.jar stanford-corenlp-4.5.7/
```

### 3. Crear entorno virtual e instalar dependencias Python

```bash
python3 -m venv venv
source venv/bin/activate
pip install flask flask-cors requests spacy
python -m spacy download es_core_news_sm
```

### 4. Instalar dependencias del frontend

```bash
cd frontend
npm install
cd ..
```

---

## Ejecución

El proyecto requiere tres terminales abiertas simultáneamente.

### Terminal 1 — Servidor Stanford CoreNLP

```bash
cd stanford-corenlp-4.5.7
java -mx4g -cp "*" edu.stanford.nlp.pipeline.StanfordCoreNLPServer \
  -serverProperties StanfordCoreNLP-spanish.properties \
  -port 9000 \
  -timeout 60000
```

Espera hasta ver:
```
StanfordCoreNLPServer listening at /[0:0:0:0:0:0:0:0]:9000
```

### Terminal 2 — Backend Flask

```bash
source venv/bin/activate
cd backend
python app.py
```

Debe mostrar:
```
Running on http://127.0.0.1:5000
```

### Terminal 3 — Frontend React

```bash
cd frontend
npm start
```

Se abre automáticamente en: http://localhost:3000

---

## Estructura del proyecto

```
APE16_AT/
├── backend/
│   ├── app.py                            # punto de entrada Flask
│   ├── domain/
│   │   ├── models.py                     # entidades del dominio
│   │   └── ports.py                      # puertos (interfaces)
│   ├── application/
│   │   └── analizar_oracion_use_case.py  # caso de uso principal
│   ├── infrastructure/
│   │   ├── corenlp_adapter.py            # adaptador Stanford CoreNLP
│   │   ├── spacy_adapter.py              # adaptador spaCy
│   │   └── clasificador_adapter.py       # clasificador semántico
│   └── api/
│       └── routes.py                     # endpoints REST
├── frontend/
│   └── src/
│       ├── components/                   # componentes React
│       ├── services/                     # servicios HTTP
│       └── App.js                        # componente raíz
├── stanford-corenlp-4.5.7/              # NO se sube al repo
└── README.md
```

---

## Endpoints disponibles

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /analizar | Analiza una oración con CoreNLP |
| POST | /comparar | Analiza con CoreNLP y spaCy simultáneamente |

### Ejemplo de uso

```bash
curl -X POST http://localhost:5000/analizar \
  -H "Content-Type: application/json" \
  -d '{"oracion": "Pedro llegó y Ana salió."}'
```

---

## Prueba rápida

Una vez levantados los tres servicios, abre http://localhost:3000 y escribe cualquiera de estas oraciones:

- María estudia porque mañana tiene un examen.
- Pedro llegó y Ana salió.
- Aunque llueve iremos al parque.
- Si estudias aprobarás.
- Juan cocina mientras Ana limpia.

Navega por las tabs del sidebar para ver el análisis léxico, sintáctico, árbol de dependencias y la comparativa entre spaCy y CoreNLP.

---

