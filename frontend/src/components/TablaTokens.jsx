import React from "react";

/**
 * Componente que muestra el análisis léxico de la oración en formato de tabla.
 * @param {Array} tokens - Lista de tokens con word, pos y lemma.
 */
function TablaTokens({ tokens }) {
  return (
    <section>
      <h2>Análisis Léxico — Tokens</h2>
      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>POS</th>
            <th>Lema</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((t, i) => (
            <tr key={i}>
              <td>{t.word}</td>
              <td><span className="tag">{t.pos}</span></td>
              <td>{t.lemma}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default TablaTokens;