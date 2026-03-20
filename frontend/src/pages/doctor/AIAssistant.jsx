import { useState, useEffect } from "react";
import { useGetAiDiagnosisMutation } from "@/features/ai/aiApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import {
  BrainCircuit,
  Loader2,
  AlertTriangle,
  UserRound,
  ArrowRight,
  Sparkles,
  Shield,
  Activity,
  HeartPulse,
  Stethoscope,
  Microscope,
  Thermometer,
  Pill,
  Syringe,
  Clock,
  Calendar,
  Info,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Zap,
  Star,
  Award,
  TrendingUp,
  Users,
  FileText,
  Search,
  Filter,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  HelpCircle,
  BookOpen,
  Lightbulb,
  Target,
  Compass,
  Globe,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Scan,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useGetAnalyticsQuery } from "@/features/admin/adminApi";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const AIAssistant = () => {
  const { data: analytics } = useGetAnalyticsQuery();
  const { data: patients, isLoading: patientsLoading } = useListPatientsQuery();
  const [getDiagnosis, { isLoading }] = useGetAiDiagnosisMutation();

  const [patientId, setPatientId] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeTab, setActiveTab] = useState("input");
  const [showTips, setShowTips] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  const isPro = analytics?.business?.plan === "PRO";

  useEffect(() => {
    if (patientId && patients) {
      const patient = patients.find(p => p._id === patientId);
      setSelectedPatient(patient);
    } else {
      setSelectedPatient(null);
    }
  }, [patientId, patients]);

  const handleAddSymptom = (e) => {
    if (e.key === "Enter" && symptomInput.trim()) {
      e.preventDefault();
      if (!symptoms.includes(symptomInput.trim())) {
        setSymptoms([...symptoms, symptomInput.trim()]);
      }
      setSymptomInput("");
    }
  };

  const removeSymptom = (s) => setSymptoms(symptoms.filter((x) => x !== s));

  const handleAnalyze = async () => {
    if (!patientId) return toast.error("Please select a patient", {
      icon: "👤",
      description: "Patient context is required for accurate analysis",
    });
    if (symptoms.length === 0)
      return toast.error("Please add at least one symptom", {
        icon: "🩺",
        description: "Symptoms help the AI generate accurate diagnoses",
      });

    try {
      const res = await getDiagnosis({ patientId, symptoms, notes }).unwrap();
      const analysisResult = res.data?.result || res.result;
      setResult(analysisResult);
      
      // Add to recent analyses
      setRecentAnalyses(prev => [
        {
          id: Date.now(),
          patientName: selectedPatient?.name,
          timestamp: new Date().toISOString(),
          riskLevel: analysisResult.riskLevel,
        },
        ...prev.slice(0, 4)
      ]);
      
      setActiveTab("results");
      
      toast.success("Analysis complete!", {
        icon: "🧠",
        description: "AI diagnostic report generated successfully",
      });
    } catch (err) {
      toast.error(err?.data?.message || "AI Analysis failed", {
        icon: "❌",
      });
    }
  };

  const resetAnalysis = () => {
    setResult(null);
    setActiveTab("input");
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel?.toLowerCase()) {
      case "low": return { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", icon: Shield };
      case "medium": return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", icon: AlertCircle };
      case "high": return { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", icon: AlertTriangle };
      case "critical": return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", icon: XCircle };
      default: return { bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200", icon: Info };
    }
  };

  const symptomSuggestions = [
    "Fever", "Cough", "Headache", "Fatigue", "Nausea", 
    "Chest pain", "Shortness of breath", "Dizziness", "Rash", "Joint pain"
  ];

  if (!isPro && analytics) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto px-4 py-12"
      >
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-10 text-center">
            <div 
              className="h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})` }}
            >
              <BrainCircuit className="h-12 w-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">
              Unlock Gemini AI Assistant
            </h2>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Elevate your clinical decisions with AI-powered differential diagnoses.
              Upgrade your clinic to the PRO plan to access this feature.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                className="px-8 py-3 text-white rounded-xl font-bold shadow-lg transition-all flex items-center gap-2 justify-center"
                style={{ 
                  background: primaryTeal,
                  boxShadow: `0 4px 12px ${tealGlow}`
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = tealHover}
                onMouseLeave={(e) => e.currentTarget.style.background = primaryTeal}
              >
                <Sparkles className="h-5 w-5" />
                Upgrade to PRO
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="px-8 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 pb-10 px-4 sm:px-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})` }}
            >
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Gemini<span style={{ color: primaryTeal }}>AI</span> Assistant
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Analyze symptoms securely against clinical datasets
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: tealLight, 
              borderColor: primaryTeal 
            }}
          >
            <Sparkles className="h-4 w-4" style={{ color: primaryTeal }} />
            <span className="text-xs font-bold" style={{ color: primaryTeal }}>
              AI-Powered
            </span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab("input")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "input"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          style={activeTab === "input" ? { backgroundColor: primaryTeal } : {}}
        >
          Input Symptoms
        </button>
        <button
          onClick={() => setActiveTab("results")}
          disabled={!result}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            !result ? 'opacity-50 cursor-not-allowed' : ''
          } ${
            activeTab === "results" && result
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          style={activeTab === "results" && result ? { backgroundColor: primaryTeal } : {}}
        >
          Analysis Results
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
            activeTab === "history"
              ? "text-white"
              : "text-slate-600 hover:bg-slate-100"
          }`}
          style={activeTab === "history" ? { backgroundColor: primaryTeal } : {}}
        >
          Recent Analyses
        </button>
      </div>

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {activeTab === "input" && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="grid lg:grid-cols-2 gap-8"
          >
            {/* Input Panel */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="space-y-6">
                {/* Patient Selection */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Patient Profile
                  </label>
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: primaryTeal }} />
                    <select
                      className="w-full pl-10 p-3 border border-slate-200 rounded-xl focus:outline-none transition-all appearance-none"
                      style={{ 
                        focusBorderColor: primaryTeal, 
                        focusRing: `0 0 0 3px ${tealGlow}` 
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryTeal;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                      value={patientId}
                      onChange={(e) => setPatientId(e.target.value)}
                      disabled={patientsLoading}
                    >
                      <option value="">Select a patient...</option>
                      {patients?.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.age}y, {p.gender})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Patient Card */}
                {selectedPatient && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-xl border bg-slate-50"
                    style={{ borderColor: `${primaryTeal}30` }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                        style={{ backgroundColor: primaryTeal }}
                      >
                        {selectedPatient.name?.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800">{selectedPatient.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-xs text-slate-500">{selectedPatient.age} years</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-xs text-slate-500 capitalize">{selectedPatient.gender}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-xs text-slate-500">{selectedPatient.bloodGroup || "Blood unknown"}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Symptoms Input */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Reported Symptoms
                  </label>
                  
                  {/* Symptom Tags */}
                  <div className="flex flex-wrap gap-2 mb-3 min-h-[40px]">
                    {symptoms.map((s) => (
                      <motion.span
                        key={s}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 border"
                        style={{ 
                          backgroundColor: tealLight,
                          borderColor: primaryTeal,
                          color: tealHover
                        }}
                      >
                        {s}
                        <button
                          onClick={() => removeSymptom(s)}
                          className="hover:opacity-70"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </motion.span>
                    ))}
                  </div>

                  {/* Symptom Input */}
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full p-3 pr-20 border border-slate-200 rounded-xl focus:outline-none transition-all"
                      placeholder="Type symptom and press Enter..."
                      value={symptomInput}
                      onChange={(e) => setSymptomInput(e.target.value)}
                      onKeyDown={handleAddSymptom}
                      style={{ 
                        focusBorderColor: primaryTeal, 
                        focusRing: `0 0 0 3px ${tealGlow}` 
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryTeal;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
                      Enter ↵
                    </span>
                  </div>

                  {/* Symptom Suggestions */}
                  <button
                    type="button"
                    onClick={() => setShowTips(!showTips)}
                    className="mt-2 text-xs flex items-center gap-1"
                    style={{ color: primaryTeal }}
                  >
                    <HelpCircle className="h-3 w-3" />
                    Common symptoms
                    <ChevronDown className={`h-3 w-3 transition-transform ${showTips ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {showTips && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="flex flex-wrap gap-2 mt-2">
                          {symptomSuggestions.map(s => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => {
                                if (!symptoms.includes(s)) {
                                  setSymptoms([...symptoms, s]);
                                }
                              }}
                              className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none transition-all resize-none"
                    placeholder="Vitals, recent history, observations..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    style={{ 
                      focusBorderColor: primaryTeal, 
                      focusRing: `0 0 0 3px ${tealGlow}` 
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = primaryTeal;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  />
                </div>

                {/* Analyze Button */}
                <div className="relative">
                  <AnimatePresence>
                    {isLoading && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl"
                      >
                        <div className="flex flex-col items-center gap-4">
                          <div className="relative">
                            <div 
                              className="h-12 w-12 border-4 rounded-full animate-spin"
                              style={{ borderColor: `${primaryTeal}20`, borderTopColor: primaryTeal }}
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <BrainCircuit className="h-5 w-5 animate-pulse" style={{ color: primaryTeal }} />
                            </div>
                          </div>
                          <div className="space-y-1 text-center">
                            <p className="text-xs font-bold" style={{ color: primaryTeal }}>
                              AI Processing...
                            </p>
                            <div className="flex gap-1 justify-center">
                              <div className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0s' }} />
                              <div className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.2s' }} />
                              <div className="w-1 h-1 rounded-full bg-slate-300 animate-bounce" style={{ animationDelay: '0.4s' }} />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAnalyze}
                    disabled={isLoading || !patientId || symptoms.length === 0}
                    className="w-full py-4 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-lg"
                    style={{ 
                      background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})`,
                      boxShadow: `0 4px 12px ${tealGlow}`
                    }}
                  >
                    <BrainCircuit className="h-5 w-5" />
                    Analyze Symptoms
                    <ArrowRight className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                  <Info className="h-4 w-4" style={{ color: primaryTeal }} />
                  How It Works
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      1
                    </div>
                    <p className="text-sm text-slate-600">Select a patient to provide clinical context</p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      2
                    </div>
                    <p className="text-sm text-slate-600">Add reported symptoms using the input field</p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      3
                    </div>
                    <p className="text-sm text-slate-600">Include any additional clinical notes</p>
                  </div>
                  <div className="flex gap-3">
                    <div 
                      className="h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      4
                    </div>
                    <p className="text-sm text-slate-600">AI analyzes patterns and generates diagnostic insights</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <h3 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                  <Shield className="h-4 w-4" style={{ color: primaryTeal }} />
                  Clinical Guidelines
                </h3>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: primaryTeal }} />
                    <span>AI suggestions are for reference only</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: primaryTeal }} />
                    <span>Always verify with clinical judgment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: primaryTeal }} />
                    <span>Results are logged for audit purposes</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "results" && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            {/* Results Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800">Analysis Results</h2>
              <button
                onClick={resetAnalysis}
                className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                New Analysis
              </button>
            </div>

            {/* Main Results Card */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
              {/* Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: tealLight }}
                  >
                    <BrainCircuit className="h-5 w-5" style={{ color: primaryTeal }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Diagnostic Report</h3>
                    <p className="text-xs text-slate-500">Generated by Gemini AI • {new Date().toLocaleString()}</p>
                  </div>
                </div>
                
                {/* Risk Badge */}
                {result.riskLevel && (
                  <div 
                    className="px-4 py-2 rounded-lg text-xs font-bold uppercase flex items-center gap-2"
                    style={(() => {
                      const colors = getRiskColor(result.riskLevel);
                      return {
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.border,
                      };
                    })()}
                  >
                    {result.riskLevel === "critical" && <XCircle className="h-4 w-4" />}
                    {result.riskLevel === "high" && <AlertTriangle className="h-4 w-4" />}
                    {result.riskLevel === "medium" && <AlertCircle className="h-4 w-4" />}
                    {result.riskLevel === "low" && <Shield className="h-4 w-4" />}
                    {result.riskLevel} Severity
                  </div>
                )}
              </div>

              {/* Patient Context */}
              {selectedPatient && (
                <div className="p-4 bg-slate-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      {selectedPatient.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">{selectedPatient.name}</p>
                      <p className="text-xs text-slate-500">
                        {selectedPatient.age}y • {selectedPatient.gender} • {selectedPatient.bloodGroup || "Blood unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Possible Conditions */}
              {result.possibleConditions && result.possibleConditions.length > 0 && (
                <div className="p-6 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Possible Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.possibleConditions.map((condition, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 bg-white border rounded-lg text-sm"
                        style={{ borderColor: `${primaryTeal}30` }}
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations && result.recommendations.length > 0 && (
                <div className="p-6 border-b border-slate-100">
                  <h4 className="text-sm font-bold text-slate-700 mb-3">Clinical Recommendations</h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <span 
                          className="h-5 w-5 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5"
                          style={{ backgroundColor: primaryTeal }}
                        >
                          {i + 1}
                        </span>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Explanation */}
              {result.explanation && (
                <div className="p-6">
                  <h4 className="text-sm font-bold text-slate-700 mb-2">Clinical Reasoning</h4>
                  <div 
                    className="p-4 rounded-xl italic"
                    style={{ backgroundColor: tealLight }}
                  >
                    <p className="text-sm text-slate-700">"{result.explanation}"</p>
                  </div>
                </div>
              )}

              {/* Disclaimer */}
              <div className="p-4 bg-amber-50 border-t border-amber-100 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700">
                  {result.disclaimer || "This AI analysis is provided as a supportive tool for licensed medical professionals only. Final clinical decisions must be made by the attending physician."}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "history" && (
          <motion.div
            key="history"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6"
          >
            <h3 className="text-lg font-bold text-slate-800 mb-4">Recent Analyses</h3>
            {recentAnalyses.length === 0 ? (
              <div className="text-center py-12">
                <BrainCircuit className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No recent analyses</p>
                <p className="text-xs text-slate-400 mt-1">Run your first analysis to see history</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentAnalyses.map((item) => (
                  <div key={item.id} className="p-4 border border-slate-100 rounded-xl hover:border-teal-200 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ backgroundColor: primaryTeal }}
                        >
                          {item.patientName?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="font-medium text-slate-700">{item.patientName || "Unknown Patient"}</p>
                          <p className="text-xs text-slate-500">{new Date(item.timestamp).toLocaleString()}</p>
                        </div>
                      </div>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: getRiskColor(item.riskLevel).bg,
                          color: getRiskColor(item.riskLevel).text,
                        }}
                      >
                        {item.riskLevel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AIAssistant;