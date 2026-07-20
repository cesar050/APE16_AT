import React, { useState } from "react";
import { analizarOracion } from "./services/analizadorService";
import Clasificacion from "./components/Clasificacion";
import RolesGramaticales from "./components/RolesGramaticales";
import TablaTokens from "./components/TablaTokens";
import TablaDependencias from "./components/TablaDependencias";
import ArbolSintactico from "./components/ArbolSintactico";
import Comparativa from "./components/Comparativa";
import { MdLabel, MdPerson, MdTextFields, MdAccountTree, MdShare, MdCompareArrows } from "react-icons/md";
import "./App.css";

/**
 * Componente raíz de la aplicación.
 * Maneja el estado global y renderiza el layout con sidebar y contenido principal.
 */
function App() {
  const [oracion, setOracion] = useState("");
  const [resultado, setResultado] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [tabActiva, setTabActiva] = useState("clasificacion");

  const TABS = [
    { id: "clasificacion", label: "Clasificación Semántica", icon: <MdLabel /> },
    { id: "roles", label: "Roles Gramaticales", icon: <MdPerson /> },
    { id: "tokens", label: "Análisis Léxico", icon: <MdTextFields /> },
    { id: "dependencias", label: "Dependencias Sintácticas", icon: <MdAccountTree /> },
    { id: "arbol", label: "Árbol Sintáctico", icon: <MdShare /> },
    { id: "comparativa", label: "Comparativa spaCy vs CoreNLP", icon: <MdCompareArrows /> },
  ];

  /**
   * Dispara el análisis lingüístico de la oración ingresada.
   */
  const handleAnalizar = async () => {
    if (!oracion.trim()) return;
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const data = await analizarOracion(oracion);
      setResultado(data);
      setTabActiva("clasificacion");
    } catch (err) {
      setError("Error al conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  /**
   * Renderiza el contenido de la tab activa.
   */
  const renderContenido = () => {
    if (tabActiva === "comparativa") {
      return <Comparativa />;
    }

    if (!resultado) {
      return <div className="empty-state">Ingresa una oración y presiona Analizar.</div>;
    }

    switch (tabActiva) {
      case "clasificacion":
        return <Clasificacion clasificacion={resultado.clasificacion} />;
      case "roles":
        return <RolesGramaticales sujeto={resultado.sujeto} verbo={resultado.verbo} objeto={resultado.objeto} />;
      case "tokens":
        return <TablaTokens tokens={resultado.tokens} />;
      case "dependencias":
        return <TablaDependencias dependencias={resultado.dependencias} />;
      case "arbol":
        return <ArbolSintactico dependencias={resultado.dependencias} tokens={resultado.tokens} />;
      default:
        return null;
    }
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div>
          <h1>Analizador Lingüístico</h1>
          <p className="subtitle">Stanford CoreNLP — Español</p>
        </div>

        <textarea
          rows={5}
          placeholder="Escribe una oración en español..."
          value={oracion}
          onChange={(e) => setOracion(e.target.value)}
        />

        <button onClick={handleAnalizar} disabled={cargando}>
          {cargando ? "Analizando..." : "Analizar"}
        </button>

        {error && <p className="error">{error}</p>}

        <nav className="nav-menu">
          {TABS.map((tab) => (
            <div
              key={tab.id}
              className={`nav-item ${tabActiva === tab.id ? "active" : ""} ${!resultado && tab.id !== "comparativa" ? "disabled" : ""}`}
              onClick={() => (resultado || tab.id === "comparativa") && setTabActiva(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </nav>
      </aside>

      <main className="main-content">
        {renderContenido()}
      </main>
    </div>
  );
}

export default App;