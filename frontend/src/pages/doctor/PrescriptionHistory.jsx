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
  Plus,
  Clock,
  Pill,
  Filter,
  ChevronDown,
  RefreshCw,
  Printer,
  Share2,
  Info,
  CheckCircle2,
  XCircle,
  Fingerprint,
  Syringe,
  HeartPulse,
  BrainCircuit,
  Sparkles,
  Shield,
  DownloadCloud,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#009689";
const tealLight = "#E6F7F5";
const tealHover = "#007F73";
const tealGlow = "rgba(0, 150, 137, 0.15)";

const PrescriptionHistory = () => {
  const {
    data: prescriptions,
    isLoading,
    isError,
    refetch,
  } = useGetDoctorPrescriptionsQuery();
  const [deletePrescription, { isLoading: isDeleting }] =
    useDeletePrescriptionMutation();
  const [downloadPDF] = useLazyDownloadPDFQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
      toast.success("PDF downloaded successfully", {
        icon: "✅",
        description: "Prescription saved to your device",
      });
    } catch (err) {
      toast.error("Failed to download PDF", {
        icon: "❌",
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deletePrescription(deletingId).unwrap();
      toast.success("Prescription deleted successfully", {
        icon: "✅",
        description: "Record removed from archive",
      });
      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to delete prescription", {
        icon: "❌",
      });
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  // Filter prescriptions
  const filteredPrescriptions =
    prescriptions?.filter((p) => {
      // Search filter
      const matchesSearch =
        p.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.patientId?._id?.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      const matchesDate = filterDate
        ? new Date(p.createdAt).toISOString().split("T")[0] === filterDate
        : true;

      return matchesSearch && matchesDate;
    }) || [];

  // Sort by date (newest first)
  const sortedPrescriptions = [...filteredPrescriptions].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
  };

  const columns = [
    {
      header: "Issued On",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: tealLight }}
          >
            <Calendar className="h-4 w-4" style={{ color: primaryTeal }} />
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-700">
              {new Date(row.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1 mt-0.5">
              <Clock className="h-3 w-3" />
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
      header: "Patient",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ backgroundColor: primaryTeal }}
          >
            {row.patientId?.name?.charAt(0) || "P"}
          </div>
          <div>
            <span className="block text-sm font-bold text-slate-800">
              {row.patientId?.name || "Anonymous Patient"}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <Fingerprint className="h-3 w-3" style={{ color: primaryTeal }} />
              <span className="text-[10px] font-medium text-slate-500">
                ID: {row.patientId?._id?.slice(-6).toUpperCase() || "NEW"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Diagnosis",
      cell: (row) => (
        <div className="flex items-center gap-2 max-w-xs">
          <Activity className="h-3.5 w-3.5 flex-shrink-0" style={{ color: primaryTeal }} />
          <span className="text-sm font-medium text-slate-600 truncate">
            {row.diagnosis}
          </span>
        </div>
      ),
    },
    {
      header: "Medications",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Pill className="h-3.5 w-3.5" style={{ color: primaryTeal }} />
          <span 
            className="px-3 py-1 text-[10px] font-bold rounded-lg"
            style={{ 
              backgroundColor: tealLight,
              color: primaryTeal
            }}
          >
            {row.medicines?.length || 0} {row.medicines?.length === 1 ? 'Item' : 'Items'}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDetails(row)}
            className="p-2 rounded-lg transition-all"
            style={{ hoverBackground: tealLight }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tealLight;
              e.currentTarget.style.color = primaryTeal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <Eye className="h-4 w-4" />
          </motion.button>
          <Link
            to={`/doctor/prescriptions/edit/${row._id}`}
            className="p-2 rounded-lg transition-all"
            style={{ hoverBackground: tealLight }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tealLight;
              e.currentTarget.style.color = primaryTeal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <Edit className="h-4 w-4" />
          </Link>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDownload(row._id)}
            className="p-2 rounded-lg transition-all"
            style={{ hoverBackground: tealLight }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tealLight;
              e.currentTarget.style.color = primaryTeal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#64748b';
            }}
          >
            <Download className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDeleteClick(row._id)}
            className="p-2 rounded-lg transition-all hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
        </div>
      ),
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
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

  if (isLoading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div 
            className="h-16 w-16 border-4 rounded-full animate-spin"
            style={{ borderColor: `${primaryTeal}10`, borderTopColor: primaryTeal }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <FileText className="h-6 w-6 animate-pulse" style={{ color: primaryTeal }} />
          </div>
        </div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
          Synchronizing Archive...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
          <AlertCircle className="h-8 w-8 text-red-400" />
        </div>
        <p className="text-sm font-bold text-red-400">Failed to load prescriptions</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

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
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: primaryTeal }}
            >
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Prescription<span style={{ color: primaryTeal }}>Archive</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Access and manage all medical authorizations issued across your clinical tenure
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3">
          <div 
            className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{ 
              backgroundColor: tealLight, 
              borderColor: primaryTeal 
            }}
          >
            <div className="relative">
              <div className="h-2 w-2 rounded-full" style={{ background: primaryTeal }} />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2 w-2 rounded-full opacity-50"
                style={{ background: primaryTeal }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: primaryTeal }}>
              Archive Active
            </span>
          </div>

          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center transition-all"
            style={{ hoverBackground: tealLight, hoverColor: primaryTeal }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tealLight;
              e.currentTarget.style.color = primaryTeal;
              e.currentTarget.style.borderColor = primaryTeal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'white';
              e.currentTarget.style.color = '#475569';
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-4 bg-slate-100 rounded-xl text-sm font-medium flex items-center gap-2 transition-all"
              style={{ hoverBackground: tealLight, hoverColor: primaryTeal }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = tealLight;
                e.currentTarget.style.color = primaryTeal;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f1f5f9';
                e.currentTarget.style.color = '#475569';
              }}
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: primaryTeal }} />
              <input
                type="text"
                placeholder="Search by patient or diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none w-64 transition-all"
                style={{ focusBorderColor: primaryTeal, focusRing: `0 0 0 3px ${tealGlow}` }}
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

            {(searchTerm || filterDate) && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium transition-colors"
                style={{ color: primaryTeal, hoverColor: tealHover }}
                onMouseEnter={(e) => e.currentTarget.style.color = tealHover}
                onMouseLeave={(e) => e.currentTarget.style.color = primaryTeal}
              >
                Clear filters
              </button>
            )}
          </div>

          <Link
            to="/doctor/prescriptions/new"
            className="h-10 px-5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
            style={{ 
              background: primaryTeal,
              boxShadow: `0 4px 6px ${tealGlow}`
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = tealHover}
            onMouseLeave={(e) => e.currentTarget.style.background = primaryTeal}
          >
            <Plus className="h-4 w-4" />
            New Prescription
          </Link>
        </div>

        {/* Expanded Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-4 pt-4 mt-4 border-t border-slate-100">
                <div className="w-64">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Filter by Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                    style={{ focusBorderColor: primaryTeal, focusRing: `0 0 0 3px ${tealGlow}` }}
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Cards */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div 
          className="bg-white p-5 rounded-xl border shadow-sm flex items-center justify-between"
          style={{ borderColor: `${primaryTeal}20` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: tealLight }}
            >
              <FileText className="h-6 w-6" style={{ color: primaryTeal }} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Total Prescriptions</p>
              <p className="text-2xl font-bold" style={{ color: primaryTeal }}>
                {prescriptions?.length || 0}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="bg-white p-5 rounded-xl border shadow-sm flex items-center justify-between"
          style={{ borderColor: `${primaryTeal}20` }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: tealLight }}
            >
              <User className="h-6 w-6" style={{ color: primaryTeal }} />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-500">Unique Patients</p>
              <p className="text-2xl font-bold" style={{ color: primaryTeal }}>
                {[...new Set(prescriptions?.map((p) => p.patientId?._id))].filter(Boolean).length}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Info Panel */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
            <h3 className="text-xs font-bold uppercase text-slate-400 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">This Month</span>
                <span className="font-bold" style={{ color: primaryTeal }}>
                  {prescriptions?.filter(p => {
                    const date = new Date(p.createdAt);
                    const now = new Date();
                    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
                  }).length || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <span className="text-sm text-slate-600">Last Month</span>
                <span className="font-bold" style={{ color: primaryTeal }}>
                  {prescriptions?.filter(p => {
                    const date = new Date(p.createdAt);
                    const now = new Date();
                    const lastMonth = new Date(now.setMonth(now.getMonth() - 1));
                    return date.getMonth() === lastMonth.getMonth() && date.getFullYear() === lastMonth.getFullYear();
                  }).length || 0}
                </span>
              </div>
            </div>
          </div>

          <div 
            className="p-5 rounded-xl text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})` }}
          >
            <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center mb-3">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <h4 className="text-sm font-bold mb-2">Clinical Protocol</h4>
            <p className="text-xs text-white/80 leading-relaxed">
              Prescriptions are legal medical documents. Any modifications will be logged in the system audit trail for compliance.
            </p>
          </div>
        </motion.div>

        {/* Main Table */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            {sortedPrescriptions.length === 0 ? (
              <div className="p-12 text-center">
                <div 
                  className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ backgroundColor: tealLight }}
                >
                  <FileText className="h-8 w-8" style={{ color: primaryTeal }} />
                </div>
                <h4 className="text-slate-800 font-bold mb-1">No Prescriptions Found</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  No records match your current filter parameters or the archive is empty.
                </p>
                {(searchTerm || filterDate) && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 text-xs font-bold rounded-lg transition-colors"
                    style={{ 
                      backgroundColor: tealLight,
                      color: primaryTeal
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = tealHover;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = tealLight;
                      e.currentTarget.style.color = primaryTeal;
                    }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <DataTable
                columns={columns}
                data={sortedPrescriptions}
                placeholder="Search prescriptions..."
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedPrescription && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetailsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white">
                <h3 className="text-lg font-bold text-slate-800">Prescription Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Patient Info */}
                <div className="flex items-center gap-4">
                  <div 
                    className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: primaryTeal }}
                  >
                    {selectedPrescription.patientId?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">
                      {selectedPrescription.patientId?.name || "Unknown Patient"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-500">
                        {selectedPrescription.patientId?.age || "?"} years
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-sm text-slate-500 capitalize">
                        {selectedPrescription.patientId?.gender || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Prescription Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Date Issued</p>
                    <p className="font-bold text-slate-800">
                      {new Date(selectedPrescription.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Time</p>
                    <p className="font-bold text-slate-800">
                      {new Date(selectedPrescription.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                {/* Diagnosis */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: tealLight }}>
                  <p className="text-xs font-bold mb-1" style={{ color: primaryTeal }}>Diagnosis</p>
                  <p className="text-lg font-medium text-slate-800">{selectedPrescription.diagnosis}</p>
                </div>

                {/* Medicines */}
                <div>
                  <h5 className="text-sm font-bold text-slate-700 mb-3">Prescribed Medications</h5>
                  <div className="space-y-2">
                    {selectedPrescription.medicines?.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 border rounded-lg"
                        style={{ borderColor: `${primaryTeal}30` }}
                      >
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4" style={{ color: primaryTeal }} />
                          <span className="font-medium text-slate-800">{med.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">{med.dosage}</span>
                          <span className="text-xs text-slate-400">{med.frequency}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                {selectedPrescription.instructions && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs font-bold text-slate-500 mb-2">Instructions</p>
                    <p className="text-sm text-slate-700 italic">"{selectedPrescription.instructions}"</p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleDownload(selectedPrescription._id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all flex items-center justify-center gap-2"
                    style={{ 
                      background: primaryTeal,
                      boxShadow: `0 4px 6px ${tealGlow}`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = tealHover}
                    onMouseLeave={(e) => e.currentTarget.style.background = primaryTeal}
                  >
                    <DownloadCloud className="h-4 w-4" />
                    Download PDF
                  </button>
                  <Link
                    to={`/doctor/prescriptions/edit/${selectedPrescription._id}`}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-all flex items-center justify-center gap-2"
                    onClick={() => setShowDetailsModal(false)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit Prescription
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-xl bg-red-100 flex items-center justify-center">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Delete Prescription</h3>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to delete this prescription? This action cannot be undone.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={isDeleting}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PrescriptionHistory;