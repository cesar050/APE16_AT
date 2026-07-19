import React from "react";

/**
 * Componente que muestra los roles gramaticales extraídos de la oración.
 * @param {string} sujeto - Sujeto detectado en la oración.
 * @param {string} verbo - Verbo principal detectado en la oración.
 * @param {string} objeto - Objeto directo detectado en la oración.
 */
function RolesGramaticales({ sujeto, verbo, objeto }) {
  return (
    <section>
      <h2>Roles Gramaticales</h2>
      <div className="card roles">
        <p><strong>Sujeto:</strong> {sujeto}</p>
        <p><strong>Verbo:</strong> {verbo}</p>
        <p><strong>Objeto:</strong> {objeto}</p>
      </div>
    </section>
  );
}

export default RolesGramaticales;