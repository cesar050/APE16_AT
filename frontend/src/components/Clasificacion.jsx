import React from "react";

/**
 * Componente que muestra la clasificación semántica de la oración analizada.
 * @param {Object} clasificacion - Objeto con tipo, relacion y conector detectado.
 */
function Clasificacion({ clasificacion }) {
  return (
    <section>
      <h2>Clasificación Semántica</h2>
      <div className="card clasificacion">
        <p><strong>Tipo:</strong> {clasificacion.tipo}</p>
        <p><strong>Relación:</strong> {clasificacion.relacion}</p>
        <p><strong>Conector:</strong> {clasificacion.conector}</p>
      </div>
    </section>
  );
}

export default Clasificacion;