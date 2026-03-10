import { useState } from "react";
import { useGetAiDiagnosisMutation } from "@/features/ai/aiApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import {
  BrainCircuit,
  Loader2,
  AlertTriangle,
  UserRound,
  ArrowRight,
} from "lucide-react";
import { toast } from "sonner";
import useAuth from "@/hooks/useAuth";
import { useGetAnalyticsQuery } from "@/features/admin/adminApi"; // Used to check clinic plan

const AIAssistant = () => {
  const { data: analytics } = useGetAnalyticsQuery();
  const { data: patients, isLoading: patientsLoading } = useListPatientsQuery();
  const [getDiagnosis, { isLoading }] = useGetAiDiagnosisMutation();

  const [patientId, setPatientId] = useState("");
  const [symptomInput, setSymptomInput] = useState("");
  const [symptoms, setSymptoms] = useState([]);
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);

  const isPro = analytics?.business?.plan === "PRO";

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
    if (!patientId) return toast.error("Please select a patient");
    if (symptoms.length === 0)
      return toast.error("Please add at least one symptom");

    try {
      const res = await getDiagnosis({ patientId, symptoms, notes }).unwrap();
      setResult(res.data?.result || res.result);
    } catch (err) {
      toast.error(err?.data?.message || "AI Analysis failed");
    }
  };

  if (!isPro && analytics) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500">
        <div className="h-24 w-24 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-500/20">
          <BrainCircuit className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-slate-800 mb-4">
          Unlock Gemini AI Assistant
        </h2>
        <p className="text-slate-500 max-w-lg mb-8 text-lg">
          Elevate your clinical decisions with AI-powered differential
          diagnoses. Upgrade your clinic to the PRO plan to access this feature.
        </p>
        <button className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center gap-2">
          Contact Admin to Upgrade <ArrowRight className="h-5 w-5" />
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="Gemini AI Diagnostic Assistant"
        description="Analyze symptoms securely against clinical datasets."
      />

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Patient Profile (Context)
              </label>
              <div className="relative">
                <UserRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <select
                  className="w-full pl-10 p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none appearance-none"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  disabled={patientsLoading}
                >
                  <option value="">Select a patient to pull context...</option>
                  {patients?.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name} ({p.age}y {p.gender})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 border-b border-indigo-100 pb-2 mb-2">
                Reported Symptoms
              </label>
              <div className="flex flex-wrap gap-2 mb-3">
                {symptoms.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-medium rounded-lg flex items-center gap-2 border border-indigo-100"
                  >
                    {s}{" "}
                    <button
                      onClick={() => removeSymptom(s)}
                      className="text-indigo-400 hover:text-indigo-800"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-400"
                placeholder="Type symptom and press Enter..."
                value={symptomInput}
                onChange={(e) => setSymptomInput(e.target.value)}
                onKeyDown={handleAddSymptom}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Additional Clinical Notes
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none block"
                placeholder="Vitals, recent history, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-xl animate-in fade-in">
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
                    <div className="space-y-1.5 text-center">
                      <p className="text-[10px] font-black uppercase tracking-widest text-indigo-900 border-b border-indigo-100 pb-1">
                        AI Processing Matrix
                      </p>
                      <div className="flex flex-col text-[8px] font-bold text-slate-400 gap-1 mt-2">
                        <p className="animate-pulse">
                          1. INGESTING CLINICAL CONTEXT...
                        </p>
                        <p className="animate-pulse delay-75">
                          2. PATTERN RECOGNITION ACTIVE...
                        </p>
                        <p className="animate-pulse delay-150">
                          3. SYNTHESIZING RECOMMENDATIONS...
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <button
                onClick={handleAnalyze}
                disabled={isLoading || !patientId || symptoms.length === 0}
                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-slate-900/20 transition-all flex justify-center items-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                <BrainCircuit className="h-4 w-4" />
                Initiate Analytical Sequence
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div
          className={`p-8 rounded-3xl border transition-all duration-700 premium-shadow group ${result ? "bg-white border-teal-200" : "bg-slate-50 border-slate-200 flex items-center justify-center border-dashed"}`}
        >
          {!result ? (
            <div className="text-center">
              <div className="relative inline-block mb-6">
                <div className="absolute inset-0 bg-teal-400/20 blur-2xl rounded-full" />
                <BrainCircuit className="h-20 w-20 text-slate-300 relative z-10 animate-float" />
              </div>
              <p className="text-slate-400 font-bold tracking-tight">
                System ready. Waiting for clinical data...
              </p>
              <div className="mt-4 flex gap-1 justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in slide-in-from-bottom-8 duration-700">
              <div className="flex justify-between items-center pb-6 border-b border-teal-100">
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                    Diagnostic <span className="text-teal-600">Report</span>
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Generated by Gemini Ultra-1.5
                  </p>
                </div>
                <div
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                    result.riskLevel === "high" ||
                    result.riskLevel === "critical"
                      ? "bg-red-500 text-white shadow-red-500/20"
                      : result.riskLevel === "medium"
                        ? "bg-amber-400 text-slate-900 shadow-amber-400/20"
                        : "bg-teal-500 text-white shadow-teal-500/20"
                  }`}
                >
                  {result.riskLevel} SEVERITY
                </div>
              </div>

              <div className="grid gap-6">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <h4 className="flex items-center gap-2 text-xs font-black text-teal-800 uppercase tracking-widest mb-4">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    Possible Conditions
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {result.possibleConditions?.map((c, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 bg-white text-slate-700 text-sm font-bold rounded-xl border border-slate-200 shadow-sm"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-5 bg-teal-50/30 rounded-2xl border border-teal-100/50">
                  <h4 className="flex items-center gap-2 text-xs font-black text-teal-800 uppercase tracking-widest mb-4">
                    <div className="h-2 w-2 rounded-full bg-teal-500" />
                    Clinical Recommendations
                  </h4>
                  <ul className="space-y-3">
                    {result.recommendations?.map((r, i) => (
                      <li
                        key={i}
                        className="flex gap-3 text-sm font-medium text-slate-700 leading-relaxed"
                      >
                        <div className="h-5 w-5 rounded-full bg-teal-100 flex items-center justify-center shrink-0 mt-0.5 text-teal-700 font-bold">
                          {i + 1}
                        </div>
                        {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-slate-100 clinical-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-teal-500" />
                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">
                    Professional Insight
                  </h4>
                  <p className="text-slate-700 font-medium leading-relaxed italic text-lg">
                    "{result.explanation}"
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-[10px] font-bold text-amber-800 bg-amber-50 p-4 rounded-2xl border border-amber-100 leading-normal">
                <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
                <p>
                  {result.disclaimer ||
                    "This AI analysis is provided as a supportive tool for licensed medical professionals only. Final clinical decisions must be made by the attending physician."}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
