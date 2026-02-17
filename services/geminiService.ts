
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeLogs = async (logContent: string): Promise<AnalysisResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following log file content. Identify errors, anomalies, security threats (like brute-force, SQL injection, or suspicious IPs), and performance bottlenecks.
    
    Log Data:
    ${logContent.slice(0, 32000)} // Truncate if too long for safety
    `,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          parsedLogs: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                timestamp: { type: Type.STRING },
                severity: { type: Type.STRING, enum: ['INFO', 'WARNING', 'ERROR', 'CRITICAL'] },
                source: { type: Type.STRING },
                message: { type: Type.STRING },
              },
              required: ['timestamp', 'severity', 'message']
            }
          },
          anomalies: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING },
                description: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
              }
            }
          },
          securityThreats: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                category: { type: Type.STRING },
                riskScore: { type: Type.NUMBER },
                details: { type: Type.STRING },
                mitigation: { type: Type.STRING },
              }
            }
          },
          performanceInsights: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                metric: { type: Type.STRING },
                value: { type: Type.STRING },
                assessment: { type: Type.STRING, enum: ['GOOD', 'FAIR', 'POOR'] },
              }
            }
          },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['summary', 'parsedLogs', 'anomalies', 'securityThreats', 'recommendations']
      }
    }
  });

  try {
    const result: AnalysisResult = JSON.parse(response.text.trim());
    return result;
  } catch (error) {
    console.error("Failed to parse Gemini response:", error);
    throw new Error("Invalid response format from AI");
  }
};
