// services/ai.service.js
const { GoogleGenerativeAI } = require("@google/generative-ai"); // Package to be installed
const ApiError = require("../utils/ApiError");
const { HTTP_STATUS } = require("../constants");
const env = require("../config/env.config");

class AIService {
  constructor() {
    // API KEY setting handles automatically in construction when called
    this.genAI = null;
    this.model = null;
  }

  /**
   * Initialize Gemini Model
   */
  _init() {
    if (!process.env.GEMINI_API_KEY) {
      console.warn(
        "⚠️ GEMINI_API_KEY is missing in env. AI features will fallback.",
      );
      return false;
    }

    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    }
    return true;
  }

  /**
   * Get AI Diagnosis based on symptoms
   */
  getDiagnosis = async ({ symptoms, patientAge, patientGender, notes }) => {
    const isReady = this._init();

    if (!isReady) {
      return this._getFallbackResponse(
        "AI initialization failed. API key missing.",
      );
    }

    try {
      const prompt = `
        You are an advanced medical assistant AI. A doctor is providing the following patient details:
        Patient Age: ${patientAge}
        Patient Gender: ${patientGender}
        Symptoms: ${symptoms.join(", ")}
        Additional Notes: ${notes || "None"}

        Based on these symptoms, provide a structured response in JSON format (strictly JSON):
        {
          "possibleConditions": ["list of 3-4 likely conditions"],
          "recommendations": ["list of 3 key next steps or tests"],
          "riskLevel": "low" | "medium" | "high" | "critical",
          "explanation": "a concise 2-3 sentence medical reasoning",
          "disclaimer": "strictly for doctor's assistance only"
        }
        Do not include any conversational text before or after the JSON.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean and parse JSON
      const jsonStr = text.replace(/```json|```/g, "").trim();
      return JSON.parse(jsonStr);
    } catch (error) {
      console.error("Gemini AI API Error:", error.message);
      return this._getFallbackResponse(
        "AI Service currently unavailable. Please use manual diagnosis.",
      );
    }
  };

  /**
   * Get AI Explanation for Prescriptions (Simple language for patients)
   */
  explainPrescription = async (prescriptionData) => {
    this._init();
    if (!this.model)
      return { message: "AI Explanation currently unavailable." };

    try {
      const prompt = `
        Explain the following medical prescription to a patient in very simple, non-medical language.
        Focus on: What is it for? How to take it? Important precautions?
        
        Diagnosis: ${prescriptionData.diagnosis}
        Medicines: ${prescriptionData.medicines.map((m) => `${m.name} (${m.dosage}) - ${m.frequency}`).join(", ")}
        Instructions: ${prescriptionData.instructions}

        Provide a friendly, 3-paragraph summary. No JSON needed here.
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return { explanation: response.text() };
    } catch (error) {
      return {
        explanation:
          "Unable to generate explanation right now. Please follow doctor's instructions strictly.",
      };
    }
  };

  /**
   * Fallback logic for graceful failure
   */
  _getFallbackResponse(reason) {
    return {
      possibleConditions: ["Manual assessment required"],
      recommendations: ["Consult clinical guidelines", "Physical examination"],
      riskLevel: "medium",
      explanation: `Fallback Mode: ${reason}`,
      isFallback: true,
    };
  }
}

module.exports = new AIService();
