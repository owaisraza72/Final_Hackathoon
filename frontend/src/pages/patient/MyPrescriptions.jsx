import { useState } from "react";
import {
  useGetPatientPrescriptionsQuery,
  useLazyDownloadPDFQuery,
} from "@/features/prescriptions/prescriptionApi";
import { useLazyExplainPrescriptionQuery } from "@/features/ai/aiApi";
import useAuth from "@/hooks/useAuth";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import {
  FileText,
  Download,
  BrainCircuit,
  Activity,
  FileDown,
  RefreshCw,
  HeartPulse,
  Syringe,
  Pill,
  Clock,
  Thermometer,
  ShieldAlert,
  ChevronRight,
  Info,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const primaryTeal = "#14b8a6"; // teal-500

const MyPrescriptions = () => {
  const { user } = useAuth();

  const {
    data: prescriptions,
    isLoading: isPrescriptionLoading,
    error,
    refetch,
  } = useGetPatientPrescriptionsQuery(user?._id || "me", {
    skip: !user && user !== null, // Wait for auth state
  });

  const isLoading = isPrescriptionLoading || !user;

  const [downloadPDF, { isLoading: isDownloading }] = useLazyDownloadPDFQuery();
  const [explainRx, { isLoading: isExplaining }] =
    useLazyExplainPrescriptionQuery();

  const [explanation, setExplanation] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleDownload = async (id) => {
    try {
      const result = await downloadPDF(id).unwrap();

      // PROTECTIVE BINARY HANDLER: prevent UTF-8 corruption of PDF bytes
      // Using ArrayBuffer (from API) ensures binary fidelity
      const blob = new Blob([result], { type: "application/pdf" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Prescription_${id.slice(-6).toUpperCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Prescription downloaded successfully");
    } catch (err) {
      console.error("PDF DOWNLOAD ERROR:", err);
      if (err?.status === 403) {
        toast.error("You don't have permission to download this prescription");
      } else if (err?.status === 404) {
        toast.error("Prescription not found");
      } else {
        toast.error(
          err?.data?.message || "PDF download failed. Please try again.",
        );
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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8 pb-10 px-4 sm:px-6"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center shadow-lg shadow-teal-500/20">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              My<span className="text-teal-500">Prescriptions</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1 text-sm">
            <HeartPulse className="h-4 w-4 text-teal-500" />
            Access your validated medical directives and diagnostic history.
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-teal-50 border-teal-100 shadow-sm">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-teal-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2 w-2 rounded-full bg-teal-500 opacity-50"
              />
            </div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mr-1">
              Digital Vault ID:
            </span>
            <span className="text-xs font-black text-teal-700">
              {user?._id?.slice(-8).toUpperCase() || "PX-AUTH"}
            </span>
          </div>
          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors shadow-sm"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </motion.div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex justify-center items-center h-[50vh]">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-6 w-6 text-teal-500 animate-pulse" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">
              Accessing Secure Records...
            </p>
          </div>
        </div>
      ) : error ? (
        <motion.div
          variants={itemVariants}
          className="bg-red-50 border border-red-200 rounded-3xl p-8 text-center max-w-2xl mx-auto mt-10 shadow-sm"
        >
          <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-bold text-lg">
            Failed to load prescriptions
          </p>
          <p className="text-sm text-red-500 mt-2">
            Please ensure you have the appropriate permissions and try again.
          </p>
        </motion.div>
      ) : prescriptions?.length === 0 ? (
        <motion.div
          variants={itemVariants}
          className="bg-white p-16 text-center rounded-3xl border border-slate-200 shadow-sm mt-10"
        >
          <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="h-12 w-12 text-slate-300" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Zero Medical Directives
          </h3>
          <p className="text-slate-400 mt-3 text-sm font-medium max-w-sm mx-auto leading-relaxed">
            Your clinical history is currently clear. Any future prescriptions
            issued by your provider will appear in this secure vault.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {prescriptions?.map((rx) => (
            <motion.div
              key={rx._id}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-teal-500/5 transition-all flex flex-col overflow-hidden group"
            >
              <div className="p-6 flex-1 space-y-5">
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div className="h-12 w-12 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 border border-teal-100 group-hover:bg-teal-500 group-hover:text-white transition-colors">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="px-3 py-1 bg-slate-50 rounded-lg text-slate-400 text-[10px] font-bold uppercase tracking-wider border border-slate-100">
                    ID: {rx._id.slice(-6).toUpperCase()}
                  </div>
                </div>

                {/* Card Title & Info */}
                <div>
                  <h3 className="text-lg font-black text-slate-800 line-clamp-2 leading-tight group-hover:text-teal-700 transition-colors">
                    {rx.diagnosis}
                  </h3>
                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span className="font-medium">
                        {new Date(rx.createdAt).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <Activity className="h-3.5 w-3.5 text-teal-500" />
                      <span className="font-medium">
                        Dr. {rx.doctorId?.name || "Provider"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Medicines List Preview */}
                <div className="space-y-2 pt-4 border-t border-slate-100">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Pill className="h-3 w-3" />
                    Prescribed Medications
                  </p>
                  {rx.medicines?.slice(0, 3).map((m, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center p-2.5 bg-slate-50 rounded-xl border border-slate-100"
                    >
                      <span className="text-xs font-bold text-slate-700 truncate mr-2">
                        {m.name}
                      </span>
                      <span className="px-2 py-0.5 bg-white rounded-md text-[10px] font-bold text-teal-600 border border-teal-100 shadow-sm shrink-0">
                        {m.dosage}
                      </span>
                    </div>
                  ))}
                  {rx.medicines?.length > 3 && (
                    <div className="text-center pt-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        + {rx.medicines.length - 3} more medications
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Actions */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleDownload(rx._id)}
                  disabled={isDownloading}
                  className="flex justify-center items-center gap-2 h-10 w-full bg-white text-slate-600 text-xs font-bold rounded-xl border border-slate-200 hover:border-teal-300 hover:text-teal-600 shadow-sm transition-all"
                >
                  <Download className="h-4 w-4" />
                  PDF Download
                </button>
                <button
                  onClick={() => handleExplain(rx._id)}
                  className="flex justify-center items-center gap-2 h-10 w-full bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md hover:bg-teal-600 transition-all hover:shadow-lg hover:shadow-teal-500/30"
                >
                  <BrainCircuit className="h-4 w-4" />
                  AI Assist
                </button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* AI Explanation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setExplanation(null);
        }}
        title="AI Diagnostic Analysis"
      >
        <div className="p-2">
          {isExplaining && !explanation ? (
            <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
              <div className="relative h-20 w-20 mx-auto mb-6">
                <BrainCircuit className="h-20 w-20 text-teal-500 absolute inset-0 animate-pulse" />
                <div className="absolute inset-0 border-4 border-teal-200 border-t-teal-500 rounded-full animate-spin" />
              </div>
              <h4 className="text-lg font-black text-slate-800">
                Analyzing Prescription Data...
              </h4>
              <p className="text-slate-400 mt-2 text-xs font-medium">
                Gemini is breaking down complex medical terminology into
                easy-to-understand insights.
              </p>
            </div>
          ) : explanation === "PRO_REQUIRED" ? (
            <div className="text-center py-12 px-6 bg-slate-900 rounded-3xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <BrainCircuit className="h-40 w-40 text-white" />
              </div>
              <div className="h-16 w-16 bg-amber-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
                <ShieldAlert className="h-8 w-8 text-amber-400" />
              </div>
              <h4 className="text-2xl font-black text-white relative z-10">
                Premium Feature
              </h4>
              <p className="text-slate-300 mt-3 text-sm font-medium leading-relaxed relative z-10">
                AI Prescription explanations require{" "}
                <span className="text-amber-400 font-bold">ClinicOS PRO</span>.
                Please request your facility administrator to upgrade your
                account access.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start xl:items-center gap-4 bg-teal-50 p-4 rounded-2xl border border-teal-100">
                <div className="h-10 w-10 bg-white rounded-xl flex shrink-0 items-center justify-center shadow-sm">
                  <Activity className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-teal-600/80 tracking-widest mb-0.5">
                    Simplified Medical Insight
                  </p>
                  <p className="text-sm font-bold text-teal-900">
                    Patient-Friendly Interpretation
                  </p>
                </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm text-slate-700">
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">
                  {explanation}
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-4">
                <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs font-medium text-slate-500 leading-relaxed">
                  <strong className="text-slate-700">Disclaimer:</strong> This
                  analysis is AI-synthesized to help you understand your
                  prescription. It is for educational purposes only and should
                  not replace professional medical advice from your physician.
                </p>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
};

export default MyPrescriptions;
