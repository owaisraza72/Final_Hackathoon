import {
  useListAllPrescriptionsQuery,
  useDeletePrescriptionMutation,
  useLazyDownloadPDFQuery,
} from "@/features/prescriptions/prescriptionApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import {
  FileText,
  User,
  Stethoscope,
  Calendar,
  Download,
  Trash2,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Eye,
  Mail,
  Clock,
  CheckCircle2,
  XCircle,
  Shield,
  Award,
  Sparkles,
  Pill,
  Syringe,
  HeartPulse,
  BrainCircuit,
  Activity,
  Info,
  X,
  CalendarRange,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  FileCheck,
  FileX,
  FileWarning,
  FileMinus,
  FilePlus,
  FileSearch,
  FileCog,
  FilePen,
  DownloadCloud,
  Printer,
  Share2,
  Copy,
  Save,
  Send,
  MessageCircle,
  MessageSquare,
  HelpCircle,
  Headphones,
  Coffee,
  Sun,
  Moon,
  Cloud,
  Wind,
  Flame,
  Snowflake,
  Leaf,
  Mountain,
  Sunrise,
  Sunset,
  StarHalf,
  StarOff,
  BadgeCheck,
  BadgeX,
  BadgeAlert,
  BadgeInfo,
  BadgeMinus,
  BadgePlus,
  BadgePercent,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const ManagePrescriptions = () => {
  const {
    data: prescriptions,
    isLoading,
    isError,
    refetch,
  } = useListAllPrescriptionsQuery();
  const [deletePrescription] = useDeletePrescriptionMutation();
  const [downloadPDF] = useLazyDownloadPDFQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filter prescriptions
  const filteredPrescriptions =
    prescriptions?.filter((p) => {
      // Search filter
      const matchesSearch =
        p.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p._id?.toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      const matchesDate = filterDate
        ? new Date(p.createdAt).toISOString().split("T")[0] === filterDate
        : true;

      return matchesSearch && matchesDate;
    }) || [];

  // Sort prescriptions
  const sortedPrescriptions = [...filteredPrescriptions].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === "patient") {
      return sortOrder === "asc"
        ? (a.patientId?.name || "").localeCompare(b.patientId?.name || "")
        : (b.patientId?.name || "").localeCompare(a.patientId?.name || "");
    }
    if (sortBy === "doctor") {
      return sortOrder === "asc"
        ? (a.doctorId?.name || "").localeCompare(b.doctorId?.name || "")
        : (b.doctorId?.name || "").localeCompare(a.doctorId?.name || "");
    }
    return 0;
  });

  const handleDownload = async (id) => {
    try {
      const { data: blob } = await downloadPDF(id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Prescription downloaded successfully", {
        icon: "✅",
        description: "PDF archive retrieved",
      });
    } catch (err) {
      toast.error("Download failed", {
        icon: "❌",
      });
    }
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deletePrescription(deletingId).unwrap();
      toast.success("Prescription archived successfully", {
        icon: "📁",
        description: "Medical directive removed from active records",
      });
      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to archive prescription", {
        icon: "❌",
      });
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterDate("");
    setFilterStatus("all");
  };

  const getDateIcon = (date) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];

    if (date === today)
      return { icon: CalendarCheck, color: "text-emerald-500" };
    if (date === tomorrow)
      return { icon: CalendarClock, color: "text-amber-500" };
    if (date < today) return { icon: CalendarX, color: "text-red-500" };
    return { icon: CalendarRange, color: "text-teal-500" };
  };

  const columns = [
    {
      header: "Clinical Authorization",
      cell: (row) => {
        const DateIcon = getDateIcon(row.createdAt.split("T")[0]).icon;
        const dateColor = getDateIcon(row.createdAt.split("T")[0]).color;

        return (
          <div className="flex items-center gap-4">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: tealLight }}
            >
              <FileText size={18} style={{ color: primaryTeal }} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 tracking-tight uppercase">
                {row.diagnosis || "General Consultation"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <DateIcon className={`h-3 w-3 ${dateColor}`} />
                <p className="text-[10px] font-medium text-slate-500">
                  {new Date(row.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Patient",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div
            className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: primaryTeal }}
          >
            {row.patientId?.name?.charAt(0) || "P"}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              {row.patientId?.name || "Unknown Patient"}
            </p>
            <p className="text-xs text-slate-500">
              Age: {row.patientId?.age || "?"} • {row.patientId?.gender || "?"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Doctor",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">
            <Stethoscope className="h-4 w-4 text-slate-500" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Dr. {row.doctorId?.name || "Unknown"}
            </p>
            <p className="text-xs text-slate-500">
              {row.doctorId?.specialization || "Practitioner"}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Medications",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Pill className="h-4 w-4" style={{ color: primaryTeal }} />
          <span className="text-sm font-bold text-slate-700">
            {row.medicines?.length || 0} items
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
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
            }}
          >
            <Eye className="h-4 w-4" />
          </motion.button>
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
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#64748b";
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
              Prescription<span style={{ color: primaryTeal }}>Registry</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Facility-wide verifiable audit of all medical authorizations
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
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
                e.currentTarget.style.background = "#f1f5f9";
                e.currentTarget.style.color = "#475569";
              }}
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
                style={{ color: primaryTeal }}
              />
              <input
                type="text"
                placeholder="Search by patient, doctor, diagnosis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none w-80 transition-all"
                style={{
                  focusBorderColor: primaryTeal,
                  focusRing: `0 0 0 3px ${tealGlow}`,
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = primaryTeal;
                  e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.boxShadow = "none";
                }}
              />
            </div>

            {(searchTerm || filterDate) && (
              <button
                onClick={clearFilters}
                className="text-xs font-medium transition-colors"
                style={{ color: primaryTeal, hoverColor: tealHover }}
                onMouseEnter={(e) => (e.currentTarget.style.color = tealHover)}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = primaryTeal)
                }
              >
                Clear filters
              </button>
            )}
          </div>
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
                <div className="w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  />
                </div>

                <div className="w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  >
                    <option value="date">Date</option>
                    <option value="patient">Patient Name</option>
                    <option value="doctor">Doctor Name</option>
                  </select>
                </div>

                <div className="w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Order
                  </label>
                  <button
                    onClick={() =>
                      setSortOrder((order) =>
                        order === "asc" ? "desc" : "asc",
                      )
                    }
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium flex items-center justify-between hover:bg-slate-50 transition-colors"
                  >
                    <span>
                      {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Summary */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: "Total Prescriptions",
            value: prescriptions?.length || 0,
            icon: FileText,
          },
          {
            label: "This Month",
            value:
              prescriptions?.filter((p) => {
                const date = new Date(p.createdAt);
                const now = new Date();
                return (
                  date.getMonth() === now.getMonth() &&
                  date.getFullYear() === now.getFullYear()
                );
              }).length || 0,
            icon: Calendar,
          },
          {
            label: "Unique Patients",
            value:
              new Set(
                prescriptions?.map((p) => p.patientId?._id).filter(Boolean),
              ).size || 0,
            icon: User,
          },
          {
            label: "Active Doctors",
            value:
              new Set(
                prescriptions?.map((p) => p.doctorId?._id).filter(Boolean),
              ).size || 0,
            icon: Stethoscope,
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stat.value}
                  </p>
                </div>
                <div
                  className="h-10 w-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: tealLight }}
                >
                  <Icon className="h-5 w-5" style={{ color: primaryTeal }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Prescriptions Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[500px]"
      >
        {isLoading ? (
          <div className="h-[500px] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div
                className="h-16 w-16 border-4 rounded-full animate-spin"
                style={{
                  borderColor: `${primaryTeal}20`,
                  borderTopColor: primaryTeal,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText
                  className="h-6 w-6 animate-pulse"
                  style={{ color: primaryTeal }}
                />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Accessing Clinical Archives...
            </p>
          </div>
        ) : isError ? (
          <div className="h-[500px] flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-sm font-bold text-red-400">
              Archive Sync Exception
            </p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={sortedPrescriptions}
            placeholder="No prescriptions found..."
          />
        )}
      </motion.div>

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
                <h3 className="text-lg font-bold text-slate-800">
                  Prescription Details
                </h3>
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
                      {selectedPrescription.patientId?.name ||
                        "Unknown Patient"}
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

                {/* Doctor Info */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Prescribed By</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        Dr. {selectedPrescription.doctorId?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">
                        {selectedPrescription.doctorId?.specialization ||
                          "Practitioner"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Diagnosis */}
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: tealLight }}
                >
                  <p
                    className="text-xs font-bold mb-1"
                    style={{ color: primaryTeal }}
                  >
                    Diagnosis
                  </p>
                  <p className="text-lg font-bold text-slate-800">
                    {selectedPrescription.diagnosis}
                  </p>
                </div>

                {/* Medications */}
                <div>
                  <h5 className="text-sm font-bold text-slate-700 mb-3">
                    Medications
                  </h5>
                  <div className="space-y-2">
                    {selectedPrescription.medicines?.map((med, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 border rounded-lg"
                        style={{ borderColor: `${primaryTeal}30` }}
                      >
                        <div className="flex items-center gap-2">
                          <Pill
                            className="h-4 w-4"
                            style={{ color: primaryTeal }}
                          />
                          <span className="font-medium text-slate-800">
                            {med.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-slate-600">
                            {med.dosage}
                          </span>
                          <span className="text-xs text-slate-400">
                            {med.frequency}
                          </span>
                          <span className="text-xs text-slate-400">
                            {med.duration}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                {selectedPrescription.instructions && (
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-2">Instructions</p>
                    <p className="text-sm text-slate-700 italic">
                      "{selectedPrescription.instructions}"
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      handleDownload(selectedPrescription._id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 py-3 text-white rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: primaryTeal,
                      boxShadow: `0 4px 6px ${tealGlow}`,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = tealHover)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = primaryTeal)
                    }
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </button>
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
                  <h3 className="text-lg font-bold text-slate-800">
                    Archive Prescription
                  </h3>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to archive this prescription? This will
                  remove it from active records.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    Archive
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

export default ManagePrescriptions;
