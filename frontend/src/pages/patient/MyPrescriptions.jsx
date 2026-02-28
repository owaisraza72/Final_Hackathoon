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
  const { data: prescriptions, isLoading } = useGetPatientPrescriptionsQuery(
    user?.profileId || "me",
  );
  const [downloadPDF, { isLoading: isDownloading }] = useLazyDownloadPDFQuery();
  const [explainRx, { isLoading: isExplaining }] =
    useLazyExplainPrescriptionQuery();

  const [explanation, setExplanation] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDownload = async (id) => {
    try {
      const blob = await downloadPDF(id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Prescription_${id}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("PDF download failed");
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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="My Prescriptions"
        description="Download PDFs and understand your prescribed medication."
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : prescriptions?.length === 0 ? (
        <div className="bg-white p-16 text-center rounded-2xl border border-slate-200 shadow-sm">
          <FileText className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No prescriptions</h3>
          <p className="text-slate-500 mt-2">
            You don't have any medical prescriptions on record.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {prescriptions?.map((rx) => (
            <div
              key={rx._id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 transition-transform group-hover:scale-110" />

              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {rx.diagnosis}
                  </h3>
                  <p className="text-sm font-medium text-indigo-600 mt-1">
                    {new Date(rx.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-700">
                  <FileText className="h-5 w-5" />
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-1 min-h-[100px]">
                {rx.medicines?.slice(0, 3).map((m, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm items-center bg-slate-50 px-3 py-2 rounded-lg border border-slate-100"
                  >
                    <span className="font-bold text-slate-700">{m.name}</span>
                    <span className="text-slate-500">{m.dosage}</span>
                  </div>
                ))}
                {rx.medicines?.length > 3 && (
                  <p className="text-xs font-bold text-slate-400 text-center uppercase tracking-widest">
                    + {rx.medicines.length - 3} more
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => handleDownload(rx._id)}
                  disabled={isDownloading}
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 shadow shadow-slate-900/20 transition-all text-sm"
                >
                  <Download className="h-4 w-4" /> Download PDF
                </button>
                <button
                  onClick={() => handleExplain(rx._id)}
                  className="flex-1 flex justify-center items-center gap-2 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white font-bold rounded-xl hover:from-amber-500 hover:to-orange-500 shadow shadow-amber-500/30 transition-all text-sm"
                >
                  <BrainCircuit className="h-4 w-4" /> AI Explanation
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
        title="AI Prescription Translator"
      >
        {isExplaining && !explanation ? (
          <div className="text-center py-8">
            <Loader2 className="h-8 w-8 text-amber-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-600 font-medium">
              Gemini is analyzing your prescription...
            </p>
          </div>
        ) : explanation === "PRO_REQUIRED" ? (
          <div className="text-center py-6">
            <Activity className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-slate-800">
              Clinic on Free Plan
            </h4>
            <p className="text-slate-500 mt-2">
              Your clinic must upgrade to PRO to unlock AI features for
              patients.
            </p>
          </div>
        ) : (
          <div className="py-4">
            <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-5 shadow-inner leading-relaxed text-slate-700">
              <p className="whitespace-pre-wrap">{explanation}</p>
            </div>
            <p className="text-xs text-amber-600 font-bold tracking-wider uppercase mt-4 text-center">
              AI-generated content. Consult your doctor.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyPrescriptions;
