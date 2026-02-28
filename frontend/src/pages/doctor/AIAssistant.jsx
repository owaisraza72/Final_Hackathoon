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

            <button
              onClick={handleAnalyze}
              disabled={isLoading || !patientId || symptoms.length === 0}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:shadow-none"
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <BrainCircuit className="h-5 w-5" />
              )}
              {isLoading ? "Running Analysis..." : "Analyze with Gemini Engine"}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${result ? "bg-indigo-50 border-indigo-200 shadow-inner" : "bg-slate-50 border-slate-200 flex items-center justify-center border-dashed"}`}
        >
          {!result ? (
            <div className="text-center text-slate-400">
              <BrainCircuit className="h-16 w-16 mx-auto mb-4 opacity-20" />
              <p>AI diagnosis will appear here.</p>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-bottom-4">
              <div className="flex justify-between items-start">
                <h3 className="textxl font-black text-indigo-900">
                  Analysis Complete
                </h3>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${
                    result.riskLevel === "high" ||
                    result.riskLevel === "critical"
                      ? "bg-red-500 text-white"
                      : result.riskLevel === "medium"
                        ? "bg-amber-400 text-slate-900"
                        : "bg-emerald-500 text-white"
                  }`}
                >
                  {result.riskLevel} RISK
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-2">
                  Possible Conditions
                </h4>
                <ul className="space-y-2">
                  {result.possibleConditions?.map((c, i) => (
                    <li
                      key={i}
                      className="flex gap-3 text-slate-700 font-medium"
                    >
                      <span className="text-indigo-400">•</span> {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-2">
                  Clinical Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations?.map((r, i) => (
                    <li key={i} className="flex gap-3 text-slate-700">
                      <span className="text-indigo-400">→</span> {r}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-white/60 rounded-xl border border-indigo-100 italic text-slate-600">
                "{result.explanation}"
              </div>

              <div className="flex items-center gap-2 text-xs font-medium text-amber-700 bg-amber-100 p-3 rounded-lg">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                {result.disclaimer ||
                  "AI-generated content. Requires doctor verification."}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
