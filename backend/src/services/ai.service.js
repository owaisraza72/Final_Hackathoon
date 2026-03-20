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
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("⚠️ GEMINI_API_KEY is missing in env. AI features will fallback.");
      return false;
    }

    if (!this.genAI) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          responseMimeType: "application/json",
        }
      });
    }
    return true;
  }

  /**
   * Get AI Diagnosis based on symptoms
   */
  getDiagnosis = async ({ symptoms, patientAge, patientGender, notes }) => {
    const isReady = this._init();

    if (!isReady) {
      return this._getFallbackResponse("AI initialization failed. API key missing.");
    }

    try {
      const prompt = `
        You are a senior medical consultant AI assistant. A clinical case is presented with the following details:
        - Patient context: ${patientAge} year old ${patientGender}
        - Presenting symptoms: ${symptoms.join(", ")}
        - Clinical notes: ${notes || "None provided"}

        Analyze this case and provide a structured clinical insight in JSON format according to this schema:
        {
          "possibleConditions": ["list of 3-4 likely differential diagnoses"],
          "recommendations": ["list of 3 key next steps, tests, or immediate actions"],
          "riskLevel": "low" | "medium" | "high" | "critical",
          "explanation": "A professional, concise clinical reasoning (2-3 sentences)",
          "disclaimer": "This is an AI-generated clinical assistance tool. Final diagnosis MUST be made by a licensed physician."
        }
      `;

      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Better JSON extraction in case Gemini wraps it in text
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No valid JSON found in AI response");
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error("❌ Gemini AI API Refusal or Error:", error.message);
      if (error.message.includes("SAFETY")) {
        return this._getFallbackResponse("Safety filters triggered. Please describe symptoms clinically.");
      }
      return this._getFallbackResponse(`AI Service Error: ${error.message}`);
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
