import axios from "axios";

const API_URL = "http://localhost:5000";

/**
 * Envía una oración al backend para su análisis lingüístico.
 * @param {string} oracion - Texto de la oración a analizar.
 * @returns {Promise<Object>} Resultado del análisis con tokens, dependencias y clasificación.
 */
export const analizarOracion = async (oracion) => {
  const response = await axios.post(`${API_URL}/analizar`, { oracion });
  return response.data;
};