import axios from "axios";

const API_URL = "http://localhost:5000";

/**
 * Envía una oración al backend para su análisis comparativo entre spaCy y CoreNLP.
 * @param {string} oracion - Texto de la oración a analizar.
 * @returns {Promise<Object>} Resultado comparativo con datos de ambas herramientas.
 */
export const compararOracion = async (oracion) => {
  const response = await axios.post(`${API_URL}/comparar`, { oracion });
  return response.data;
};