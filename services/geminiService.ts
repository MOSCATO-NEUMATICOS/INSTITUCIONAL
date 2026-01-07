
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const geminiService = {
  /**
   * Analiza un PDF en base64 y extrae metadatos sugeridos para el manual.
   */
  async analyzeManualPdf(base64Data: string) {
    const model = ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        {
          role: 'user',
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: base64Data.split(',')[1], // Quitar el prefijo data:application/pdf;base64,
              },
            },
            {
              text: `Analiza este manual técnico/institucional para un negocio de neumáticos llamado "Moscato". 
              Extrae y sugiere:
              1. Un título claro y profesional.
              2. Una categoría que debe ser estrictamente una de estas: 'Taller', 'Administración', 'Seguridad', 'Ventas'.
              3. Una descripción breve y concisa de máximo 200 caracteres que resuma de qué trata.
              
              Responde estrictamente en formato JSON.`
            }
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING, description: "Título sugerido para el manual" },
            category: { type: Type.STRING, description: "Categoría detectada (Taller, Administración, Seguridad, Ventas)" },
            description: { type: Type.STRING, description: "Resumen breve del contenido" }
          },
          required: ["title", "category", "description"]
        }
      }
    });

    const result = await model;
    try {
      return JSON.parse(result.text || '{}');
    } catch (e) {
      console.error("Error parseando respuesta de IA:", e);
      return null;
    }
  }
};
