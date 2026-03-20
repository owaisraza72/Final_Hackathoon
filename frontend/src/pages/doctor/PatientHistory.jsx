import { useState, useEffect } from "react";
import {
  useListPatientsQuery,
  useGetPatientHistoryQuery,
} from "@/features/patients/patientApi";
import {
  useDeletePrescriptionMutation,
  useUpdatePrescriptionMutation,
} from "@/features/prescriptions/prescriptionApi";
import {
  useDeleteDiagnosisMutation,
  useUpdateDiagnosisMutation,
} from "@/features/diagnoses/diagnosisApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Clock,
  FileText,
  Activity,
  Edit,
  Trash2,
  Pill,
  Plus,
  ArrowRight,
  ArrowUp,
  User,
  HeartPulse,
  Stethoscope,
  BrainCircuit,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Download,
  Printer,
  Share2,
  History,
  Scan,
  Fingerprint,
  Syringe,
  Thermometer,
  Microscope,
  FileSearch,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Info,
  Shield,
  Sparkles,
  Search,
  SlidersHorizontal,
  X,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#009689";
const tealLight = "#E6F7F5";
const tealHover = "#007F73";
const tealGlow = "rgba(0, 150, 137, 0.15)";

const PatientHistory = () => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [expandedSections, setExpandedSections] = useState({});
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPatients, setSelectedPatients] = useState([]);

  // Edit Prescription State
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingPrescription, setEditingPrescription] = useState(null);

  // Edit Diagnosis State
  const [isEditDiagModalOpen, setEditDiagModalOpen] = useState(false);
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);

  // Delete Confirmation Modal
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [deleteType, setDeleteType] = useState(null);

  const {
    data: patients,
    isLoading: isLoadingPatients,
    refetch: refetchPatients,
  } = useListPatientsQuery({ search: searchTerm });

  const [deletePrescription] = useDeletePrescriptionMutation();
  const [updatePrescription, { isLoading: isUpdating }] =
    useUpdatePrescriptionMutation();

  const [deleteDiagnosis] = useDeleteDiagnosisMutation();
  const [updateDiagnosis, { isLoading: isUpdatingDiag }] =
    useUpdateDiagnosisMutation();

  const {
    data: history,
    isLoading: isLoadingHistory,
    refetch: refetchHistory,
  } = useGetPatientHistoryQuery(selectedPatientId, {
    skip: !selectedPatientId,
  });

  // Filter patients based on status
  const filteredPatients =
    patients?.filter((patient) => {
      if (filterStatus === "all") return true;
      if (filterStatus === "active") return patient.isActive !== false;
      if (filterStatus === "inactive") return patient.isActive === false;
      return true;
    }) || [];

  const handleViewHistory = (id) => {
    setSelectedPatientId(id);
    setModalOpen(true);
    setActiveTab("appointments");
  };

  const handleDeleteConfirmation = (id, type) => {
    setDeletingItem(id);
    setDeleteType(type);
    setDeleteModalOpen(true);
  };

  const handleDeletePrescription = async () => {
    try {
      await deletePrescription(deletingItem).unwrap();
      toast.success("Prescription deleted successfully", {
        icon: "✅",
        description: "Record removed from patient history",
      });
      refetchHistory();
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete prescription", {
        icon: "❌",
      });
    }
  };

  const handleDeleteDiagnosis = async () => {
    try {
      await deleteDiagnosis(deletingItem).unwrap();
      toast.success("Diagnosis record deleted", {
        icon: "✅",
        description: "Analysis removed from patient history",
      });
      refetchHistory();
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to delete record", {
        icon: "❌",
      });
    }
  };

  const handleEditPrescription = (rx) => {
    setEditingPrescription(rx);
    setEditModalOpen(true);
  };

  const handleEditDiagnosis = (diag) => {
    setEditingDiagnosis(diag);
    setEditDiagModalOpen(true);
  };

  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowDetailModal(true);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const exportPatientData = () => {
    if (!history) return;

    const dataStr = JSON.stringify(history, null, 2);
    const dataUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

    const exportFileDefaultName = `patient_${history.patient?.name}_history.json`;

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();

    toast.success("Patient data exported successfully");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === filteredPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(filteredPatients.map((p) => p._id));
    }
  };

  const handleSelectPatient = (id) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter((pid) => pid !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  const getRiskLevelColor = (riskLevel) => {
    switch (riskLevel) {
      case "low":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: Shield,
        };
      case "medium":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: AlertCircle,
        };
      case "high":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: AlertCircle,
        };
      case "critical":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: Info,
        };
    }
  };

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={
              selectedPatients.length === filteredPatients.length &&
              filteredPatients.length > 0
            }
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <span className="text-[10px] font-black uppercase text-slate-500">
            Select
          </span>
        </div>
      ),
      cell: (row) => (
        <input
          type="checkbox"
          checked={selectedPatients.includes(row._id)}
          onChange={() => handleSelectPatient(row._id)}
          className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
        />
      ),
    },
    {
      header: "Patient Entity",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <motion.div whileHover={{ scale: 1.05 }} className="relative">
            <div 
              className="absolute inset-0 rounded-2xl opacity-20 blur-sm"
              style={{ background: primaryTeal }}
            />
            <div 
              className="relative h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: primaryTeal }}
            >
              <span className="text-white font-black text-lg">
                {row.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            {row.isActive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white"
              />
            )}
          </motion.div>
          <div className="flex flex-col">
            <span
              className="font-black text-slate-800 tracking-tight text-lg transition-colors cursor-pointer"
              style={{ hoverColor: primaryTeal }}
              onClick={() => handleViewHistory(row._id)}
              onMouseEnter={(e) => e.currentTarget.style.color = primaryTeal}
              onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}
            >
              {row.name}
            </span>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
              <Fingerprint className="h-3 w-3" style={{ color: primaryTeal }} />
              ID: {row._id.slice(-8).toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Biological Markers",
      cell: (row) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3" style={{ color: primaryTeal }} />
            <span className="font-bold text-slate-700 text-sm">
              {row.age}Y <span className="text-slate-300 mx-1">|</span>{" "}
              {row.gender?.toUpperCase()}
            </span>
          </div>
          {row.bloodGroup && (
            <div className="flex items-center gap-2">
              <Syringe className="h-3 w-3 text-red-500" />
              <span className="text-xs font-medium text-slate-600">
                Blood: {row.bloodGroup}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Comms Link",
      cell: (row) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 group">
            <Phone className="h-3 w-3" style={{ color: primaryTeal }} />
            <span className="text-xs font-medium text-slate-600">
              {row.contact}
            </span>
          </div>
          {row.email && (
            <div className="flex items-center gap-2 group">
              <Mail className="h-3 w-3 text-indigo-500" />
              <span className="text-xs font-medium text-slate-600">
                {row.email}
              </span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Last Visit",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Temporal Encounter
          </span>
          <span className="font-bold text-slate-700">
            {row.lastVisit
              ? new Date(row.lastVisit).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "No recent visits"}
          </span>
        </div>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewHistory(row._id)}
            className="h-9 px-3 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md flex items-center gap-1 transition-all"
            style={{ 
              background: primaryTeal,
              boxShadow: `0 4px 6px ${tealGlow}`
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = tealHover}
            onMouseLeave={(e) => e.currentTarget.style.background = primaryTeal}
          >
            <History className="h-3 w-3" />
            History
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDetails(row)}
            className="h-9 w-9 bg-slate-100 rounded-xl flex items-center justify-center transition-all"
            style={{ hoverBackground: tealLight }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = tealLight;
              e.currentTarget.style.color = primaryTeal;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#f1f5f9';
              e.currentTarget.style.color = '#475569';
            }}
          >
            <Eye className="h-4 w-4" />
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
              style={{ background: primaryTeal }}
            >
              <FileSearch className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical<span style={{ color: primaryTeal }}>Registry</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Access and synchronize universal medical histories
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
              Live Sync
            </span>
          </div>

          <button
            onClick={exportPatientData}
            className="h-10 px-4 bg-white border border-slate-200 text-slate-600 text-xs font-bold rounded-xl transition-all flex items-center gap-2"
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
            <Download className="h-4 w-4" style={{ color: primaryTeal }} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
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
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              <ChevronDown
                className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
              />
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: primaryTeal }} />
              <input
                type="text"
                placeholder="Search patients..."
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
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {(searchTerm || filterStatus !== "all") && (
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

          <div className="flex items-center gap-2">
            <button
              onClick={refetchPatients}
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
            <button 
              className="h-10 px-4 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2"
              style={{ 
                background: primaryTeal,
                boxShadow: `0 4px 6px ${tealGlow}`
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = tealHover}
              onMouseLeave={(e) => e.currentTarget.style.background = primaryTeal}
            >
              <Plus className="h-4 w-4" />
              New Patient
            </button>
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 mt-4 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
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
                  >
                    <option value="all">All Patients</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">
                    Blood Group
                  </label>
                  <select 
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
                  >
                    <option>All Groups</option>
                    <option>A+</option>
                    <option>A-</option>
                    <option>B+</option>
                    <option>B-</option>
                    <option>O+</option>
                    <option>O-</option>
                    <option>AB+</option>
                    <option>AB-</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">
                    Sort By
                  </label>
                  <select 
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
                  >
                    <option>Name</option>
                    <option>Recent Activity</option>
                    <option>Age</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedPatients.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="rounded-xl p-3 text-white flex items-center justify-between"
            style={{ 
              background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})`,
              boxShadow: `0 4px 12px ${tealGlow}`
            }}
          >
            <span className="text-sm font-medium">
              {selectedPatients.length} patient(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button 
                className="px-4 py-1.5 bg-white/20 rounded-lg text-xs font-bold transition-all hover:bg-white/30"
                style={{ hoverBackground: 'rgba(255,255,255,0.3)' }}
              >
                Export Selected
              </button>
              <button
                onClick={() => setSelectedPatients([])}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Patients Table */}
      {isLoadingPatients ? (
        <div className="flex h-[50vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div 
                className="h-16 w-16 border-4 rounded-full animate-spin"
                style={{ borderColor: `${primaryTeal}10`, borderTopColor: primaryTeal }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-6 w-6 animate-pulse" style={{ color: primaryTeal }} />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Loading Patient Data...
            </p>
          </div>
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={filteredPatients}
            placeholder="Search within clinical archive..."
          />
        </motion.div>
      )}

      {/* Medical History Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPatientId(null);
          setActiveTab("appointments");
        }}
        title={
          history
            ? `Medical History: ${history?.patient?.name}`
            : "Patient History"
        }
        size="lg"
      >
        {isLoadingHistory ? (
          <div className="flex h-[40vh] justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : history ? (
          <div className="space-y-6">
            {/* Patient Quick Info */}
            <div 
              className="rounded-2xl p-4 border"
              style={{ 
                background: `linear-gradient(135deg, ${tealLight}, #f0f9ff)`,
                borderColor: primaryTeal 
              }}
            >
              <div className="flex items-center gap-4">
                <div 
                  className="h-16 w-16 rounded-2xl flex items-center justify-center text-white font-black text-2xl"
                  style={{ background: primaryTeal }}
                >
                  {history.patient?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-800">
                    {history.patient?.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-3 mt-1">
                    <span className="text-sm text-slate-600">
                      {history.patient?.age} years
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-600 capitalize">
                      {history.patient?.gender}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                    <span className="text-sm text-slate-600">
                      {history.patient?.bloodGroup || "Blood unknown"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
              {[
                { id: "appointments", label: "Timeline", icon: Clock },
                { id: "prescriptions", label: "Medications", icon: Pill },
                { id: "diagnoses", label: "Diagnoses", icon: BrainCircuit },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-white shadow-lg"
                      : "text-slate-400 hover:text-slate-600 hover:bg-white"
                  }`}
                  style={
                    activeTab === tab.id
                      ? { 
                          background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})`,
                          boxShadow: `0 4px 12px ${tealGlow}`
                        }
                      : {}
                  }
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="max-h-[60vh] overflow-y-auto px-1 space-y-4">
              <AnimatePresence mode="wait">
                {activeTab === "appointments" && (
                  <motion.div
                    key="appointments"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {history.appointments?.length > 0 ? (
                      history.appointments.map((app, index) => (
                        <motion.div
                          key={app._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-xl border border-slate-100 bg-white transition-all"
                          style={{ hoverBorderColor: primaryTeal }}
                          onMouseEnter={(e) => e.currentTarget.style.borderColor = primaryTeal}
                          onMouseLeave={(e) => e.currentTarget.style.borderColor = '#f1f5f9'}
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                              <div 
                                className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
                                style={{ background: primaryTeal }}
                              >
                                <Calendar className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="text-sm font-bold" style={{ color: primaryTeal }}>
                                  {new Date(app.date).toLocaleDateString(
                                    undefined,
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </p>
                                <div className="flex items-center gap-3 mt-1">
                                  <span className="text-xs text-slate-500">
                                    {app.timeSlot}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    •
                                  </span>
                                  <span className="text-xs text-slate-500">
                                    Dr. {app.doctorId?.name || "Unassigned"}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                app.status === "completed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : app.status === "pending"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {app.status}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-slate-400">
                          No appointments found
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "prescriptions" && (
                  <motion.div
                    key="prescriptions"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {history.prescriptions?.length > 0 ? (
                      history.prescriptions.map((rx, index) => (
                        <motion.div
                          key={rx._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="p-4 rounded-xl border bg-gradient-to-br to-white transition-all"
                          style={{ 
                            borderColor: primaryTeal,
                            background: `linear-gradient(135deg, ${tealLight}30, white)`
                          }}
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-2">
                              <Pill className="h-4 w-4" style={{ color: primaryTeal }} />
                              <h4 className="font-bold" style={{ color: tealHover }}>
                                {rx.diagnosis}
                              </h4>
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleEditPrescription(rx)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ hoverBackground: tealLight, hoverColor: primaryTeal }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = tealLight;
                                  e.currentTarget.style.color = primaryTeal;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = 'transparent';
                                  e.currentTarget.style.color = '#475569';
                                }}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteConfirmation(
                                    rx._id,
                                    "prescription",
                                  )
                                }
                                className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-red-500" />
                              </button>
                            </div>
                          </div>

                          <div className="space-y-2">
                            {rx.medicines?.map((m, i) => (
                              <div
                                key={i}
                                className="flex justify-between items-center p-2 bg-white rounded-lg border"
                                style={{ borderColor: `${primaryTeal}30` }}
                              >
                                <span className="text-sm font-medium">
                                  {m.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-500">
                                    {m.dosage}
                                  </span>
                                  <span className="text-xs text-slate-400">
                                    {m.frequency}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Pill className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-slate-400">
                          No prescriptions found
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === "diagnoses" && (
                  <motion.div
                    key="diagnoses"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {history.diagnoses?.length > 0 ? (
                      history.diagnoses.map((diag, index) => {
                        const riskColors = getRiskLevelColor(diag.riskLevel);
                        return (
                          <motion.div
                            key={diag._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 rounded-xl border bg-gradient-to-br to-white transition-all"
                            style={{ 
                              borderColor: primaryTeal,
                              background: `linear-gradient(135deg, ${tealLight}20, white)`
                            }}
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-2">
                                <BrainCircuit className="h-4 w-4" style={{ color: primaryTeal }} />
                                <h4 className="font-bold" style={{ color: tealHover }}>
                                  Diagnosis
                                </h4>
                              </div>
                              <div className="flex items-center gap-2">
                                <span
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold ${riskColors.bg} ${riskColors.text}`}
                                >
                                  Risk: {diag.riskLevel}
                                </span>
                                <button
                                  onClick={() => handleEditDiagnosis(diag)}
                                  className="p-1.5 rounded-lg transition-colors"
                                  style={{ hoverBackground: tealLight, hoverColor: primaryTeal }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.background = tealLight;
                                    e.currentTarget.style.color = primaryTeal;
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#475569';
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteConfirmation(
                                      diag._id,
                                      "diagnosis",
                                    )
                                  }
                                  className="p-1.5 hover:bg-red-100 rounded-lg transition-colors"
                                >
                                  <Trash2 className="h-3.5 w-3.5 text-red-500" />
                                </button>
                              </div>
                            </div>

                            {/* Symptoms */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {diag.symptoms?.map((s, i) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-white text-indigo-700 text-xs rounded-lg border border-indigo-200"
                                >
                                  {s}
                                </span>
                              ))}
                            </div>

                            {/* Doctor Notes */}
                            {diag.doctorNotes && (
                              <div className="p-3 bg-white/80 rounded-lg border border-indigo-100">
                                <p className="text-xs text-slate-600 italic">
                                  "{diag.doctorNotes}"
                                </p>
                              </div>
                            )}
                          </motion.div>
                        );
                      })
                    ) : (
                      <div className="text-center py-12">
                        <BrainCircuit className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                        <p className="text-xs font-bold text-slate-400">
                          No diagnoses found
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-300 mx-auto mb-3" />
            <p className="text-sm font-bold text-red-400">
              Failed to load patient data
            </p>
          </div>
        )}
      </Modal>

      {/* Edit Modals */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Prescription"
      >
        {editingPrescription && (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target);
              try {
                await updatePrescription({
                  id: editingPrescription._id,
                  data: {
                    diagnosis: formData.get("diagnosis"),
                    instructions: formData.get("instructions"),
                  },
                }).unwrap();
                toast.success("Prescription updated");
                refetchHistory();
                setEditModalOpen(false);
              } catch (err) {
                toast.error("Update failed");
              }
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">
                Diagnosis
              </label>
              <input
                name="diagnosis"
                defaultValue={editingPrescription.diagnosis}
                className="w-full h-10 px-3 rounded-lg border border-slate-200 outline-none transition-all"
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
            <div>
              <label className="text-xs font-bold text-slate-500 mb-1 block">
                Instructions
              </label>
              <textarea
                name="instructions"
                defaultValue={editingPrescription.instructions}
                rows={3}
                className="w-full p-3 rounded-lg border border-slate-200 outline-none transition-all"
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
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-4 py-2 text-white rounded-lg text-sm transition-all"
                style={{ 
                  background: primaryTeal,
                  boxShadow: `0 4px 6px ${tealGlow}`
                }}
                onMouseEnter={(e) => !isUpdating && (e.currentTarget.style.background = tealHover)}
                onMouseLeave={(e) => !isUpdating && (e.currentTarget.style.background = primaryTeal)}
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="p-4 bg-red-50 rounded-lg mb-4">
          <p className="text-sm text-red-700">
            Are you sure you want to delete this record? This action cannot be
            undone.
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={
              deleteType === "prescription"
                ? handleDeletePrescription
                : handleDeleteDiagnosis
            }
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PatientHistory;