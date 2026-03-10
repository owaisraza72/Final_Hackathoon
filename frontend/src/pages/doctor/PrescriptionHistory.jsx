import { useState } from "react";
import {
  useGetDoctorPrescriptionsQuery,
  useDeletePrescriptionMutation,
  useLazyDownloadPDFQuery,
} from "@/features/prescriptions/prescriptionApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  FileText,
  Download,
  Trash2,
  Eye,
  Search,
  Calendar,
  User,
  Activity,
  AlertCircle,
  Edit,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PrescriptionHistory = () => {
  const {
    data: prescriptions,
    isLoading,
    isError,
  } = useGetDoctorPrescriptionsQuery();
  const [deletePrescription, { isLoading: isDeleting }] =
    useDeletePrescriptionMutation();
  const [downloadPDF] = useLazyDownloadPDFQuery();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDownload = async (id) => {
    try {
      const { data } = await downloadPDF(id);
      const url = window.URL.createObjectURL(data);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      toast.error("Failed to download PDF");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this prescription? This action cannot be undone.",
      )
    ) {
      try {
        await deletePrescription(id).unwrap();
        toast.success("Prescription deleted successfully");
      } catch (err) {
        toast.error("Failed to delete prescription");
      }
    }
  };

  const filteredPrescriptions =
    prescriptions?.filter(
      (p) =>
        p.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const columns = [
    {
      header: "Issued On",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
            <Calendar className="h-4 w-4" />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-700">
              {new Date(row.createdAt).toLocaleDateString()}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {new Date(row.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Patient Domain",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xs">
            {row.patientId?.name?.charAt(0)}
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800">
              {row.patientId?.name || "Anonymous Patient"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase">
              {row.patientId?.age}Y / {row.patientId?.gender}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Clinical Diagnosis",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Activity className="h-3.5 w-3.5 text-teal-500" />
          <span className="text-sm font-semibold text-slate-600 truncate max-w-[200px]">
            {row.diagnosis}
          </span>
        </div>
      ),
    },
    {
      header: "Medication Count",
      cell: (row) => (
        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-200">
          {row.medicines?.length || 0} Compounds
        </span>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link
            to={`/doctor/prescriptions/edit/${row._id}`}
            className="p-2 hover:bg-indigo-50 rounded-lg text-indigo-500 transition-colors"
            title="Edit Record"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <button
            onClick={() => handleDownload(row._id)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            title="Download PDF"
          >
            <Download className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-2 hover:bg-red-50 rounded-lg text-red-400 transition-colors"
            title="Delete Record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <LoadingSpinner />
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">
          Synchronizing Archive...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Prescription Master Archive"
          description="Access and manage all medical authorizations issued across your clinical tenure."
        />

        <div className="relative group w-full md:w-80">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Filter by patient or diagnosis..."
            className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all premium-shadow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-slate-200/60 premium-shadow">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">
              Aggregate Insight
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-indigo-500 shadow-sm">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Total Issued
                    </p>
                    <p className="text-lg font-black text-indigo-600">
                      {prescriptions?.length || 0}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center text-teal-500 shadow-sm">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Unique Patients
                    </p>
                    <p className="text-lg font-black text-teal-600">
                      {
                        [
                          ...new Set(
                            prescriptions?.map((p) => p.patientId?._id),
                          ),
                        ].filter(Boolean).length
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-[32px] text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 -m-8 h-32 w-32 bg-indigo-500/10 blur-3xl rounded-full" />
            <div className="relative z-10">
              <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center mb-4 backdrop-blur-md">
                <AlertCircle className="h-6 w-6 text-teal-400" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider mb-2">
                Clinical Protocol
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                Prescriptions are legal medical documents. Any modifications to
                the analytical record will be logged in the system audit trail
                for compliance.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden">
            <DataTable
              columns={columns}
              data={filteredPrescriptions}
              placeholder="Search master archive..."
            />
            {filteredPrescriptions.length === 0 && (
              <div className="p-20 text-center">
                <div className="h-16 w-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <FileText className="h-8 w-8" />
                </div>
                <h4 className="text-slate-800 font-bold mb-1">
                  No Prescriptions Found
                </h4>
                <p className="text-xs text-slate-400 font-medium">
                  No records match your current filter parameters or the archive
                  is empty.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionHistory;
