import React, { useState } from "react";
import { compararOracion } from "../services/comparativaService";

/**
 * Componente que muestra la comparativa entre spaCy y Stanford CoreNLP.
 * Permite analizar una oración con ambas herramientas y comparar resultados.
 */
function Comparativa() {
  const [oracion, setOracion] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState("resumen");

  const handleComparar = async () => {
    if (!oracion.trim()) return;
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const data = await compararOracion(oracion);
      setResultado(data);
      setTabActiva("resumen");
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const renderResumen = () => (
    <table>
      <thead>
        <tr>
          <th>Aspecto</th>
          <th>spaCy</th>
          <th>Stanford CoreNLP</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Tiempo de ejecución</strong></td>
          <td>{resultado.spacy.tiempo_ms} ms</td>
          <td>{resultado.corenlp.tiempo_ms} ms</td>
        </tr>
        <tr>
          <td><strong>Sujeto</strong></td>
          <td>{resultado.spacy.sujeto}</td>
          <td>{resultado.corenlp.sujeto}</td>
        </tr>
        <tr>
          <td><strong>Verbo</strong></td>
          <td>{resultado.spacy.verbo}</td>
          <td>{resultado.corenlp.verbo}</td>
        </tr>
        <tr>
          <td><strong>Objeto</strong></td>
          <td>{resultado.spacy.objeto}</td>
          <td>{resultado.corenlp.objeto}</td>
        </tr>
        <tr>
          <td><strong>Tipo de oración</strong></td>
          <td>{resultado.spacy.clasificacion.tipo}</td>
          <td>{resultado.corenlp.clasificacion.tipo}</td>
        </tr>
        <tr>
          <td><strong>Relación semántica</strong></td>
          <td>{resultado.spacy.clasificacion.relacion}</td>
          <td>{resultado.corenlp.clasificacion.relacion}</td>
        </tr>
        <tr>
          <td><strong>Conector</strong></td>
          <td>{resultado.spacy.clasificacion.conector}</td>
          <td>{resultado.corenlp.clasificacion.conector}</td>
        </tr>
      </tbody>
    </table>
  );

  const renderTokens = (herramienta) => (
    <table>
      <thead>
        <tr>
          <th>Token</th>
          <th>POS</th>
          <th>Lema</th>
        </tr>
      </thead>
      <tbody>
        {herramienta.tokens.map((t, i) => (
          <tr key={i}>
            <td>{t.word}</td>
            <td><span className="tag">{t.pos}</span></td>
            <td>{t.lemma}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderDependencias = (herramienta) => (
    <table>
      <thead>
        <tr>
          <th>Dependencia</th>
          <th>Gobernador</th>
          <th>Dependiente</th>
        </tr>
      </thead>
      <tbody>
        {herramienta.dependencias.map((d, i) => (
          <tr key={i}>
            <td><span className="tag dep">{d.dep}</span></td>
            <td>{d.governor}</td>
            <td>{d.dependent}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  const renderContenido = () => {
    if (!resultado) return null;
    switch (tabActiva) {
      case "resumen": return renderResumen();
      case "tokens-spacy": return renderTokens(resultado.spacy);
      case "tokens-corenlp": return renderTokens(resultado.corenlp);
      case "dep-spacy": return renderDependencias(resultado.spacy);
      case "dep-corenlp": return renderDependencias(resultado.corenlp);
      default: return null;
    }
  };

  return (
    <section>
      <h2>Comparativa spaCy vs Stanford CoreNLP</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
        <input
          type="text"
          placeholder="Escribe una oración para comparar..."
          value={oracion}
          onChange={(e) => setOracion(e.target.value)}
          style={{ flex: 1, padding: "8px 12px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "0.9rem" }}
        />
        <button
          onClick={handleComparar}
          disabled={cargando}
          style={{ padding: "8px 20px", backgroundColor: "#4a90e2", color: "white", border: "none", borderRadius: "8px", cursor: "pointer" }}
        >
          {cargando ? "Comparando..." : "Comparar"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { id: "resumen", label: "Resumen" },
              { id: "tokens-spacy", label: "Tokens spaCy" },
              { id: "tokens-corenlp", label: "Tokens CoreNLP" },
              { id: "dep-spacy", label: "Deps spaCy" },
              { id: "dep-corenlp", label: "Deps CoreNLP" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                style={{
                  padding: "6px 14px",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  backgroundColor: tabActiva === tab.id ? "#1a1a2e" : "#e8f0fe",
                  color: tabActiva === tab.id ? "white" : "#1967d2",
                  fontWeight: tabActiva === tab.id ? "600" : "400",
                  fontSize: "0.85rem"
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          {renderContenido()}
        </>
      )}
    </section>
  );
}

export default Comparativa;