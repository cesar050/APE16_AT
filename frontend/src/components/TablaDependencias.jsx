import React from "react";

/**
 * Componente que muestra las dependencias sintácticas de la oración en formato de tabla.
 * @param {Array} dependencias - Lista de dependencias con dep, governor y dependent.
 */
function TablaDependencias({ dependencias }) {
  return (
    <section>
      <h2>Dependencias Sintácticas</h2>
      <table>
        <thead>
          <tr>
            <th>Dependencia</th>
            <th>Gobernador</th>
            <th>Dependiente</th>
          </tr>
        </thead>
        <tbody>
          {dependencias.map((d, i) => (
            <tr key={i}>
              <td><span className="tag dep">{d.dep}</span></td>
              <td>{d.governor}</td>
              <td>{d.dependent}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default TablaDependencias;