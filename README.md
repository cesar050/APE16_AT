# Analizador Lingüístico — Stanford CoreNLP + spaCy

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

Stanford CoreNLP es un servidor Java que corre de forma independiente. El backend Flask se comunica con él mediante HTTP en el puerto 9000.

```bash
wget https://nlp.stanford.edu/software/stanford-corenlp-4.5.7.zip
wget https://nlp.stanford.edu/software/stanford-corenlp-4.5.7-models-spanish.jar
unzip stanford-corenlp-4.5.7.zip
mv stanford-corenlp-4.5.7-models-spanish.jar stanford-corenlp-4.5.7/
```

### 3. Crear entorno virtual e instalar dependencias Python

El entorno virtual aísla las dependencias del proyecto. spaCy corre directamente dentro del proceso Python, a diferencia de CoreNLP que es un servidor externo.

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

## Cómo funciona el sistema

El sistema tiene tres capas que se comunican entre sí:

```
[React Frontend :3000]
        |
        | HTTP POST /analizar o /comparar
        v
[Flask Backend :5000]
        |
        |--- HTTP POST :9000 ---> [Stanford CoreNLP Server]
        |
        |--- Python directo ---> [spaCy es_core_news_sm]
```

### Flujo de una petición

1. El usuario escribe una oración en el frontend y presiona **Analizar**
2. React hace un `POST` a `http://localhost:5000/analizar` con `{ "oracion": "..." }`
3. Flask recibe la petición y la pasa al caso de uso `AnalizarOracionUseCase`
4. El caso de uso llama al `CoreNLPAdapter` que hace un `POST` a `http://localhost:9000`
5. CoreNLP procesa la oración y retorna tokens, POS, lemas y dependencias en JSON
6. El `ClasificadorAdapter` analiza el texto con reglas léxicas para detectar el conector
7. Flask retorna el resultado completo al frontend
8. React muestra los resultados en las tabs del sidebar

Para la comparativa, el flujo es el mismo pero el endpoint `/comparar` ejecuta **ambos** CoreNLP y spaCy y retorna los dos resultados juntos.

---

## Arquitectura hexagonal

El backend implementa arquitectura hexagonal (ports & adapters):

```
backend/
├── domain/
│   ├── models.py         # entidades: Token, Dependencia, Clasificacion, AnalisisOracion
│   └── ports.py          # interfaces: AnalizadorNLPPort, ClasificadorPort
├── application/
│   └── analizar_oracion_use_case.py   # orquesta analizador + clasificador
├── infrastructure/
│   ├── corenlp_adapter.py      # implementa AnalizadorNLPPort con CoreNLP
│   ├── spacy_adapter.py        # implementa AnalizadorNLPPort con spaCy
│   └── clasificador_adapter.py # implementa ClasificadorPort con reglas léxicas
└── api/
    └── routes.py         # endpoints Flask que inyectan los adaptadores
```

Los adaptadores son intercambiables: el dominio no sabe si está usando CoreNLP o spaCy, solo conoce la interfaz `AnalizadorNLPPort`.

---

## Endpoints disponibles

### POST /analizar

Analiza una oración con Stanford CoreNLP.

**Request:**
```json
{ "oracion": "María estudia porque mañana tiene un examen." }
```

**Response:**
```json
{
  "oracion": "María estudia porque mañana tiene un examen.",
  "tokens": [
    { "word": "María", "pos": "PROPN", "lemma": "María" },
    { "word": "estudia", "pos": "VERB", "lemma": "estudia" }
  ],
  "dependencias": [
    { "dep": "ROOT", "governor": "ROOT", "dependent": "estudia" },
    { "dep": "nsubj", "governor": "estudia", "dependent": "María" }
  ],
  "sujeto": "María",
  "verbo": "estudia",
  "objeto": "examen",
  "clasificacion": {
    "tipo": "Compuesta Subordinada",
    "relacion": "Causal",
    "conector": "porque"
  },
  "tiempo_ms": 9.01
}
```

---

### POST /comparar

Analiza una oración con CoreNLP y spaCy simultáneamente y retorna ambos resultados.

**Request:**
```json
{ "oracion": "Pedro llegó y Ana salió." }
```

**Response:**
```json
{
  "oracion": "Pedro llegó y Ana salió.",
  "corenlp": {
    "tokens": [...],
    "dependencias": [...],
    "sujeto": "Ana",
    "verbo": "llegó",
    "objeto": "N/A",
    "clasificacion": { "tipo": "Compuesta Coordinada", "relacion": "Copulativa", "conector": "y" },
    "tiempo_ms": 26.49
  },
  "spacy": {
    "tokens": [...],
    "dependencias": [...],
    "sujeto": "Ana",
    "verbo": "llegó",
    "objeto": "N/A",
    "clasificacion": { "tipo": "Compuesta Coordinada", "relacion": "Copulativa", "conector": "y" },
    "tiempo_ms": 4.07
  }
}
```

---

## Ejecución

El proyecto requiere **tres terminales** abiertas simultáneamente.

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

> ⚠️ CoreNLP requiere al menos 4GB de RAM disponibles. El parámetro `-mx4g` define el límite de memoria para la JVM.

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

## Prueba rápida con curl

Verificar que el backend responde antes de abrir el frontend:

```bash
curl -X POST http://localhost:5000/analizar \
  -H "Content-Type: application/json" \
  -d '{"oracion": "Pedro llegó y Ana salió."}'
```

```bash
curl -X POST http://localhost:5000/comparar \
  -H "Content-Type: application/json" \
  -d '{"oracion": "María estudia porque mañana tiene un examen."}'
```

---

## Oraciones de prueba

| Oración | Tipo | Relación |
|---------|------|----------|
| María estudia porque mañana tiene un examen. | Compuesta Subordinada | Causal |
| Pedro llegó y Ana salió. | Compuesta Coordinada | Copulativa |
| Aunque llueve iremos al parque. | Compuesta Subordinada | Concesiva |
| Si estudias aprobarás. | Compuesta Subordinada | Condicional |
| Juan cocina mientras Ana limpia. | Compuesta Subordinada | Temporal |
| Pedro compró un automóvil. | Simple | N/A |
| Ana cocina la cena. | Simple | N/A |
| Luis juega fútbol. | Simple | N/A |

---

