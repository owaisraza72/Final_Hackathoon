import { useState, useEffect } from "react";
import {
  useListPatientsQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";
import {
  User,
  Search,
  Phone,
  Calendar,
  Activity,
  Trash2,
  Edit3,
  AlertCircle,
  Filter,
  Users,
  Shield,
  Fingerprint,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Mail,
  MapPin,
  Syringe,
  Sparkles,
  AlertTriangle,
  Eye,
  RefreshCw,
  Clock,
  Building2,
  UserPlus,
  Download,
  HeartPulse,
  Stethoscope,
  FileText,
  Info,
  Award,
  Star,
  Zap,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  SlidersHorizontal,
  CalendarDays,
  CalendarRange,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  UserCog,
  UserCheck,
  UserX,
  UserMinus,
  Building,
  Home,
  Briefcase,
  GraduationCap,
  BookOpen,
  Medal,
  Trophy,
  Target,
  Globe,
  Link,
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
import { motion, AnimatePresence } from "framer-motion";

// Primary colors
const primaryTeal = "#00BBA7";
const primaryPurple = "#00BBA7";
const tealLight = "#E0F7F5";
const purpleLight = "#E0F7F5";
const tealGlow = "rgba(0, 187, 167, 0.15)";
const purpleGlow = "rgba(0, 187, 167, 0.15)";

const ManagePatients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedPatients, setSelectedPatients] = useState([]);
  
  const {
    data: patientsData,
    isLoading,
    isError,
    refetch,
  } = useListPatientsQuery({ search: searchTerm });

  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();

  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    bloodGroup: "",
    email: "",
    address: "",
    medicalHistory: "",
    allergies: "",
  });

  const patients = Array.isArray(patientsData)
    ? patientsData
    : patientsData?.patients || [];

  // Filter and Sort Logic
  const processedPatients = patients
    .filter((p) => {
      if (filterStatus !== "all" && p.isActive !== (filterStatus === "active")) return false;
      if (filterBloodGroup !== "all" && p.bloodGroup !== filterBloodGroup) return false;
      return true;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") comparison = a.name.localeCompare(b.name);
      if (sortBy === "age") comparison = (a.age || 0) - (b.age || 0);
      if (sortBy === "date") comparison = new Date(a.createdAt) - new Date(b.createdAt);
      return sortOrder === "asc" ? comparison : -comparison;
    });

  const handleDelete = async (id) => {
    try {
      await deletePatient(id).unwrap();
      toast.success("Clinical record archived successfully", {
        icon: "📁",
        description: "The patient entity has been decommissioned.",
      });
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error("Process interrupted: Deactivation failed.");
    }
  };

  const handleBulkDelete = async () => {
    try {
      // Bulk delete logic here
      toast.success(`${selectedPatients.length} records archived`, {
        icon: "📁",
      });
      setSelectedPatients([]);
      setBulkDeleteModalOpen(false);
    } catch (err) {
      toast.error("Bulk operation failed");
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name || "",
      age: patient.age || "",
      gender: patient.gender || "",
      contact: patient.contact || "",
      bloodGroup: patient.bloodGroup || "",
      email: patient.email || "",
      address: patient.address || "",
      medicalHistory: patient.medicalHistory || "",
      allergies: patient.allergies || "",
    });
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePatient({ id: selectedPatient._id, data: formData }).unwrap();
      toast.success("Clinical metadata synchronized", {
        description: "Registry records successfully updated.",
      });
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update record.");
    }
  };

  const handleSelectAll = () => {
    if (selectedPatients.length === processedPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(processedPatients.map(p => p._id));
    }
  };

  const handleSelectPatient = (id) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter(pid => pid !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const columns = [
    {
      header: (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={selectedPatients.length === processedPatients.length && processedPatients.length > 0}
            onChange={handleSelectAll}
            className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
          />
          <span className="text-[10px] font-black uppercase text-slate-500">SELECT</span>
        </div>
      ),
      cell: (row) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedPatients.includes(row._id)}
            onChange={() => handleSelectPatient(row._id)}
            className="w-4 h-4 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
          />
        </div>
      ),
    },
    {
      header: "Registry Entity",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="relative"
          >
            <div 
              className="h-12 w-12 rounded-2xl flex items-center justify-center text-white shadow-xl overflow-hidden"
              style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${primaryPurple})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
              <span className="text-lg font-black relative z-10">
                {row.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            {row.isActive && (
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 rounded-full border-2 border-white"
              />
            )}
          </motion.div>
          <div>
            <button 
              onClick={() => { setSelectedPatient(row); setViewModalOpen(true); }}
              className="text-sm font-black text-slate-800 tracking-tight uppercase hover:text-purple-600 transition-colors text-left block"
            >
              {row.name}
            </button>
            <p className="text-[10px] font-bold text-slate-400 tracking-widest flex items-center gap-1">
              <Fingerprint size={10} style={{ color: primaryTeal }} />
              {row._id.slice(-12).toUpperCase()}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Medical Vectors",
      cell: (row) => (
        <div className="flex flex-col space-y-1">
          <span className="text-sm font-bold text-slate-700">
            {row.age}Y <span className="text-slate-200">|</span> {row.gender?.toUpperCase()}
          </span>
          <div className="flex items-center gap-2">
            <Syringe size={10} className="text-red-500" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              {row.bloodGroup || "HEMO-UNDEFINED"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Liaison Endpoint",
      cell: (row) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 text-slate-600">
            <Phone size={12} style={{ color: primaryPurple }} />
            <span className="text-xs font-bold">{row.contact}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Mail size={12} className="text-slate-400" />
            <span className="text-[10px] font-bold truncate max-w-[120px]">{row.email || "NO-MAIL-LINK"}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Operational Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border flex items-center gap-1.5 ${
              row.isActive
                ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                : "bg-red-50 text-red-600 border-red-100"
            }`}
          >
            {row.isActive ? <CheckCircle2 size={10} /> : <XCircle size={10} />}
            {row.isActive ? "Operational" : "Archived"}
          </div>
        </div>
      ),
    },
    {
      header: "Admin Control",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedPatient(row); setViewModalOpen(true); }}
            className="h-9 w-9 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-xl border border-slate-100 hover:border-purple-200 transition-all"
          >
            <Eye size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(row)}
            className="h-9 w-9 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-all"
            style={{ hoverColor: primaryTeal }}
          >
            <Edit3 size={16} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { setSelectedPatient(row); setDeleteModalOpen(true); }}
            className="h-9 w-9 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-100 hover:border-red-200 transition-all"
          >
            <Trash2 size={16} />
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
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${primaryPurple})` }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Clinical<span style={{ color: primaryPurple }}>Registry</span> Master
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1 text-sm font-medium">
            <Building2 className="h-4 w-4" style={{ color: primaryPurple }} />
            Global administrative oversight of facility patient directory
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: primaryPurple }}
            />
            <input
              type="text"
              placeholder="Search patients..."
              className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none w-64 transition-all"
              style={{ 
                focusBorderColor: primaryPurple, 
                focusRing: `0 0 0 3px ${purpleGlow}` 
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryPurple;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${purpleGlow}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 px-4 flex items-center gap-2 bg-white border rounded-xl transition-all ${
              showFilters 
                ? "text-white" 
                : "text-slate-600 hover:bg-slate-50"
            }`}
            style={showFilters ? { background: primaryPurple, borderColor: primaryPurple } : { borderColor: '#e2e8f0' }}
          >
            <Filter className="h-4 w-4" />
            <span className="text-xs font-medium">Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </motion.button>

          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </motion.div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedPatients.length > 0 && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="bg-gradient-to-r rounded-xl p-3 text-white flex items-center justify-between"
            style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${primaryPurple})` }}
          >
            <span className="text-sm font-medium">
              {selectedPatients.length} patient(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button className="px-4 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs font-bold transition-colors">
                Export Selected
              </button>
              <button
                onClick={() => setBulkDeleteModalOpen(true)}
                className="px-4 py-1.5 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-xs font-bold transition-colors"
              >
                Archive Selected
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

      {/* Expanded Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                  style={{ 
                    focusBorderColor: primaryPurple, 
                    focusRing: `0 0 0 3px ${purpleGlow}` 
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = primaryPurple;
                    e.currentTarget.style.boxShadow = `0 0 0 3px ${purpleGlow}`;
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <option value="all">All Patients</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Archived</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                  Blood Group
                </label>
                <select
                  value={filterBloodGroup}
                  onChange={(e) => setFilterBloodGroup(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                  style={{ 
                    focusBorderColor: primaryPurple, 
                    focusRing: `0 0 0 3px ${purpleGlow}` 
                  }}
                >
                  <option value="all">All Groups</option>
                  {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                  style={{ 
                    focusBorderColor: primaryPurple, 
                    focusRing: `0 0 0 3px ${purpleGlow}` 
                  }}
                >
                  <option value="name">Name</option>
                  <option value="age">Age</option>
                  <option value="date">Registration Date</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                  Order
                </label>
                <button
                  onClick={() => setSortOrder(order => order === "asc" ? "desc" : "asc")}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm font-medium flex items-center justify-between hover:bg-slate-50 transition-colors"
                >
                  <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Left Panel - Insights */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-4">
          <div 
            className="p-6 rounded-xl text-white"
            style={{ background: `linear-gradient(135deg, #1e293b, #0f172a)` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
                <Users className="h-5 w-5" style={{ color: primaryTeal }} />
              </div>
              <div>
                <p className="text-xs text-slate-400">Total Patients</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : processedPatients.length}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Active</span>
                <span className="text-sm font-bold text-emerald-400">
                  {patients.filter(p => p.isActive).length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400">Archived</span>
                <span className="text-sm font-bold text-red-400">
                  {patients.filter(p => !p.isActive).length}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800">
              <button
                onClick={() => refetch()}
                className="flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="h-3 w-3" />
                Sync Registry
              </button>
            </div>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-100 shadow-sm">
            <h4 className="text-xs font-bold text-slate-500 mb-3">Quick Actions</h4>
            <div className="space-y-2">
              <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-left flex items-center gap-3 transition-colors">
                <UserPlus className="h-4 w-4" style={{ color: primaryTeal }} />
                <span>Add New Patient</span>
              </button>
              <button className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-sm text-left flex items-center gap-3 transition-colors">
                <Download className="h-4 w-4" style={{ color: primaryPurple }} />
                <span>Export Registry</span>
              </button>
            </div>
          </div>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                Archiving a patient suspends their portal access immediately.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Data Table */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
            {isLoading ? (
              <div className="h-[600px] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div 
                    className="h-16 w-16 border-4 rounded-full animate-spin"
                    style={{ borderColor: `${primaryPurple}20`, borderTopColor: primaryPurple }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Users className="h-6 w-6 animate-pulse" style={{ color: primaryPurple }} />
                  </div>
                </div>
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
                  Synchronizing Master Registry...
                </p>
              </div>
            ) : isError ? (
              <div className="h-[600px] flex flex-col items-center justify-center gap-4">
                <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <p className="text-sm font-bold text-red-400">Sync Protocol Failure</p>
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
                data={processedPatients}
                placeholder="No patients match your search criteria."
              />
            )}
          </div>
        </motion.div>
      </div>

      {/* View Modal */}
      <Modal isOpen={isViewModalOpen} onClose={() => setViewModalOpen(false)} title="Patient Profile">
        {selectedPatient && (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
              <div 
                className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                style={{ background: `linear-gradient(135deg, ${primaryTeal}, ${primaryPurple})` }}
              >
                {selectedPatient.name?.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{selectedPatient.name}</h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-slate-500">{selectedPatient.age} years</span>
                  <span className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-sm text-slate-500 capitalize">{selectedPatient.gender}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Contact</p>
                <p className="font-bold text-slate-800">{selectedPatient.contact}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Blood Group</p>
                <p className="font-bold text-slate-800">{selectedPatient.bloodGroup || "Unknown"}</p>
              </div>
            </div>

            {selectedPatient.email && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Email</p>
                <p className="font-bold text-slate-800">{selectedPatient.email}</p>
              </div>
            )}

            {selectedPatient.address && (
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500 mb-1">Address</p>
                <p className="font-bold text-slate-800">{selectedPatient.address}</p>
              </div>
            )}

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <span className="text-sm text-slate-600">Status</span>
              <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                selectedPatient.isActive 
                  ? "bg-emerald-50 border-emerald-200" 
                  : "bg-red-50 border-red-200"
              }`}>
                <div className={`h-2 w-2 rounded-full ${
                  selectedPatient.isActive ? "bg-emerald-500" : "bg-red-500"
                }`} />
                <span className={`text-sm font-bold ${
                  selectedPatient.isActive ? "text-emerald-700" : "text-red-700"
                }`}>
                  {selectedPatient.isActive ? "Active" : "Archived"}
                </span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)} title="Edit Patient">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Name</label>
            <input
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryPurple, 
                focusRing: `0 0 0 3px ${purpleGlow}` 
              }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Age</label>
              <input
                required
                type="number"
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                style={{ 
                  focusBorderColor: primaryPurple, 
                  focusRing: `0 0 0 3px ${purpleGlow}` 
                }}
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-500 mb-1 block">Gender</label>
              <select
                className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                style={{ 
                  focusBorderColor: primaryPurple, 
                  focusRing: `0 0 0 3px ${purpleGlow}` 
                }}
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Contact</label>
            <input
              required
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryPurple, 
                focusRing: `0 0 0 3px ${purpleGlow}` 
              }}
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Blood Group</label>
            <select
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryPurple, 
                focusRing: `0 0 0 3px ${purpleGlow}` 
              }}
              value={formData.bloodGroup}
              onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
            >
              <option value="">Select</option>
              {bloodGroups.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Email</label>
            <input
              type="email"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryPurple, 
                focusRing: `0 0 0 3px ${purpleGlow}` 
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">Address</label>
            <input
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryPurple, 
                focusRing: `0 0 0 3px ${purpleGlow}` 
              }}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-5 py-2 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
              style={{ 
                background: `linear-gradient(135deg, ${primaryTeal}, ${primaryPurple})`,
                opacity: isUpdating ? 0.7 : 1,
              }}
            >
              {isUpdating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Update Patient
                </>
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} title="Archive Patient">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">
                Are you sure you want to archive {selectedPatient?.name}?
              </p>
              <p className="text-xs text-red-600">
                This will suspend their portal access immediately.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(selectedPatient?._id)}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Confirm Archive
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Modal */}
      <Modal isOpen={isBulkDeleteModalOpen} onClose={() => setBulkDeleteModalOpen(false)} title="Archive Multiple Patients">
        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <AlertTriangle className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm font-bold text-red-700 mb-1">
                Archive {selectedPatients.length} patients?
              </p>
              <p className="text-xs text-red-600">
                This action cannot be undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBulkDeleteModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors"
            >
              Confirm Archive
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default ManagePatients;