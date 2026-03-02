import { useState } from "react";
import {
  useGetPatientPrescriptionsQuery,
  useLazyDownloadPDFQuery,
} from "@/features/prescriptions/prescriptionApi";
import { useLazyExplainPrescriptionQuery } from "@/features/ai/aiApi";
import useAuth from "@/hooks/useAuth";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import {
  FileDown,
  FileText,
  Download,
  BrainCircuit,
  Activity,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const MyPrescriptions = () => {
  const { user } = useAuth();
  
  // FIXED: Changed from user?.profileId to user?._id for proper User reference
  // Backend endpoint `/prescriptions/patient/:id` can handle both patient ID and "me" alias
  // For now we use user._id even though patients are data-only; needs backend update for full patient portal
  const { data: prescriptions, isLoading, error } = useGetPatientPrescriptionsQuery(
    user?._id || "me",
  );
  const [downloadPDF, { isLoading: isDownloading }] = useLazyDownloadPDFQuery();
  const [explainRx, { isLoading: isExplaining }] =
    useLazyExplainPrescriptionQuery();

  const [explanation, setExplanation] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDownload = async (id) => {
    try {
      // FIXED: Improved PDF download with better error handling
      const result = await downloadPDF(id).unwrap();
      
      // Handle both blob and JSON response (in case of error wrapped in JSON)
      let blob = result;
      if (result instanceof Blob) {
        blob = result;
      } else if (typeof result === 'object') {
        // If it's JSON error, show error message
        toast.error(result.message || "PDF generation failed");
        return;
      }
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Prescription_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Prescription downloaded successfully");
    } catch (err) {
      console.error("Download error:", err);
      if (err?.status === 403) {
        toast.error("You don't have permission to download this prescription");
      } else if (err?.status === 404) {
        toast.error("Prescription not found");
      } else {
        toast.error(err?.data?.message || "PDF download failed. Please try again.");
      }
    }
  };

  const handleExplain = async (id) => {
    try {
      setModalOpen(true);
      const res = await explainRx(id).unwrap();
      setExplanation(
        res.data?.aiExplanation || res.result || res.aiExplanation,
      );
    } catch (err) {
      if (err?.status === 403) {
        setExplanation("PRO_REQUIRED");
      } else {
        toast.error("Explanation failed to load.");
        setModalOpen(false);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Personal Health Records"
          description="Access your validated medical directives and diagnostic history."
        />
        <div className="flex items-center gap-3 h-14 px-6 bg-white border border-slate-200 rounded-[20px] shadow-sm">
          <FileText className="h-5 w-5 text-indigo-500" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Digital Vault ID:
          </span>
          <span className="text-xs font-black text-slate-700">PX-881-HIST</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Accessing Secure Records...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-[40px] p-8 text-center">
          <p className="text-red-600 font-semibold">Failed to load prescriptions</p>
          <p className="text-sm text-red-500 mt-2">Please ensure you have the appropriate permissions</p>
        </div>
      ) : prescriptions?.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-[40px] border border-slate-200/60 premium-shadow">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-10 w-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Zero Medical Directives
          </h3>
          <p className="text-slate-400 mt-2 text-sm font-semibold max-w-sm mx-auto leading-relaxed">
            Your clinical history is currently clear. Any future prescriptions
            issued by your provider will appear in this secure vault.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {prescriptions?.map((rx) => (
            <div
              key={rx._id}
              className="group bg-white rounded-[40px] border border-slate-200/50 premium-shadow overflow-hidden transition-all duration-500 hover:scale-[1.02] flex flex-col"
            >
              <div className="p-8 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform duration-500">
                    <FileText className="h-7 w-7" />
                  </div>
                  <div className="px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[8px] font-black uppercase tracking-[0.2em] border border-slate-100">
                    VLD-ID: {rx._id.slice(-6).toUpperCase()}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight line-clamp-1 group-hover:text-indigo-900 transition-colors">
                    {rx.diagnosis}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                      Authorized on{" "}
                      {new Date(rx.createdAt).toLocaleDateString(undefined, {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-6">
                  <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-3">
                    Therapeutic Directives
                  </p>
                  {rx.medicines?.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-xs items-center p-3 bg-slate-50/50 rounded-xl border border-slate-100 group-hover:bg-indigo-50/30 group-hover:border-indigo-100/50 transition-colors"
                    >
                      <span className="font-black text-slate-700 tracking-tight">
                        {m.name}
                      </span>
                      <span className="px-2 py-0.5 bg-white rounded-lg text-[10px] font-bold text-slate-400 shadow-sm border border-slate-100">
                        {m.dosage}
                      </span>
                    </div>
                  ))}
                  {rx.medicines?.length > 3 && (
                    <div className="py-2 flex items-center justify-center gap-2">
                      <div className="h-px bg-slate-100 flex-1" />
                      <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                        + {rx.medicines.length - 3} additional formulations
                      </span>
                      <div className="h-px bg-slate-100 flex-1" />
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 grid grid-cols-2 gap-3 bg-slate-50/50 border-t border-slate-50">
                <button
                  onClick={() => handleDownload(rx._id)}
                  disabled={isDownloading}
                  className="flex justify-center items-center gap-3 h-12 bg-white text-slate-700 text-[10px] font-black uppercase tracking-widest rounded-2xl border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 shadow-sm transition-all group/btn"
                >
                  <Download className="h-4 w-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                  Doc-PDF
                </button>
                <button
                  onClick={() => handleExplain(rx._id)}
                  className="flex justify-center items-center gap-3 h-12 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-indigo-600 transition-all group/ai"
                >
                  <BrainCircuit className="h-4 w-4 group-hover/ai:scale-125 transition-transform" />
                  AI-Assist
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setExplanation(null);
        }}
        title="Diagnostic Analysis System"
      >
        <div className="p-2">
          {isExplaining && !explanation ? (
            <div className="text-center py-20 bg-slate-50 rounded-[32px] border border-slate-100 border-dashed">
              <div className="relative h-20 w-20 mx-auto mb-8">
                <BrainCircuit className="h-20 w-20 text-indigo-500 absolute inset-0 animate-pulse" />
                <div className="absolute inset-0 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin mask-conic" />
              </div>
              <h4 className="text-lg font-black text-slate-800 tracking-tight">
                Synchronizing Knowledge
              </h4>
              <p className="text-slate-400 mt-2 text-[10px] font-black uppercase tracking-widest">
                Accessing Medical Semantic nodes...
              </p>
            </div>
          ) : explanation === "PRO_REQUIRED" ? (
            <div className="text-center py-12 px-6 bg-slate-900 rounded-[32px] overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit className="h-40 w-40 text-white" />
              </div>
              <div className="h-16 w-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/20">
                <Activity className="h-8 w-8 text-amber-400" />
              </div>
              <h4 className="text-2xl font-black text-white tracking-tight relative z-10">
                Premium Intelligence Required
              </h4>
              <p className="text-slate-400 mt-3 text-sm font-semibold leading-relaxed relative z-10">
                Patient-facing AI insights are exclusive to{" "}
                <span className="text-amber-400">ClinicOS PRO</span>. Please
                request your facility administrator to upgrade.
              </p>
              <button className="mt-8 h-14 w-full bg-white text-slate-900 text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-2xl relative z-10">
                Explore Pro Capabilities
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center gap-4 bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100">
                <div className="h-10 w-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                  <Activity className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                    Medical Insight Protocol
                  </p>
                  <p className="text-xs font-bold text-indigo-900">
                    Patient-Friendly Formulation
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-inner-premium leading-relaxed text-slate-700">
                <div className="flex gap-2 text-indigo-200 mb-6">
                  <span className="text-4xl font-serif">"</span>
                </div>
                <p className="text-sm font-bold leading-[1.8] whitespace-pre-wrap -mt-8">
                  {explanation}
                </p>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-center gap-4">
                <BrainCircuit className="h-6 w-6 text-amber-500 shrink-0" />
                <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-relaxed">
                  Disclaimer: This analysis is AI-synthesized and for
                  educational purposes only. Always prioritize direct medical
                  advice from your provider.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MyPrescriptions;
