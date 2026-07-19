import React from "react";

/**
 * Componente que renderiza el área de entrada de texto y el botón de análisis.
 * @param {string} oracion - Texto actual de la oración.
 * @param {Function} setOracion - Función para actualizar el estado de la oración.
 * @param {Function} onAnalizar - Función que dispara el análisis.
 * @param {boolean} cargando - Indica si el análisis está en curso.
 */
function InputOracion({ oracion, setOracion, onAnalizar, cargando }) {
  return (
    <div className="input-section">
      <textarea
        rows={3}
        placeholder="Escribe una oración en español..."
        value={oracion}
        onChange={(e) => setOracion(e.target.value)}
      />
      <button onClick={onAnalizar} disabled={cargando}>
        {cargando ? "Analizando..." : "Analizar"}
      </button>
    </div>
  );
}

export default InputOracion;