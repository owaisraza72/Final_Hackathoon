import { useState, useEffect } from "react";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Phone,
  User,
  Pencil,
  Trash2,
  CircleAlert,
  HeartPulse,
  Activity,
  Shield,
  Fingerprint,
  Stethoscope,
  Syringe,
  Pill,
  Calendar,
  Clock,
  Mail,
  MapPin,
  FileText,
  Scan,
  CircleCheckBig,
  CircleX,
  TriangleAlert,
  Download,
  Printer,
  Filter,
  RefreshCw,
  ChevronDown,
  Eye,
  MoreVertical,
  Users,
  Building2,
  Award,
  Sparkles,
} from "lucide-react";
import {
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useBulkDeletePatientsMutation,
} from "@/features/patients/patientApi";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const PatientsList = () => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterBloodGroup, setFilterBloodGroup] = useState("all");
  const [viewMode, setViewMode] = useState("table"); // table or grid
  const [selectedPatients, setSelectedPatients] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const {
    data: patientsData,
    isLoading,
    isError,
    refetch,
  } = useListPatientsQuery({ search });
  
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();
  const [bulkDeletePatients] = useBulkDeletePatientsMutation();
  
  const [isModalOpen, setModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isBulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewPatient, setViewPatient] = useState(null);
  const [isViewModalOpen, setViewModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    bloodGroup: "",
    email: "",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
    allergies: "",
  });

  const patients = Array.isArray(patientsData)
    ? patientsData
    : patientsData?.patients || [];

  // Filter patients
  const filteredPatients = patients.filter((patient) => {
    if (filterStatus !== "all" && patient.isActive !== (filterStatus === "active")) return false;
    if (filterBloodGroup !== "all" && patient.bloodGroup !== filterBloodGroup) return false;
    return true;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let comparison = 0;
    if (sortBy === "name") comparison = a.name.localeCompare(b.name);
    if (sortBy === "age") comparison = (a.age || 0) - (b.age || 0);
    if (sortBy === "date") comparison = new Date(a.createdAt) - new Date(b.createdAt);
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSelectAll = () => {
    if (selectedPatients.length === sortedPatients.length) {
      setSelectedPatients([]);
    } else {
      setSelectedPatients(sortedPatients.map(p => p._id));
    }
  };

  const handleSelectPatient = (id) => {
    if (selectedPatients.includes(id)) {
      setSelectedPatients(selectedPatients.filter(pid => pid !== id));
    } else {
      setSelectedPatients([...selectedPatients, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!selectedPatients.length) return;
    
    try {
      await bulkDeletePatients(selectedPatients).unwrap();
      toast.success(`${selectedPatients.length} patients deactivated successfully`);
      setSelectedPatients([]);
      setBulkDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to deactivate patients");
    }
  };

  const columns = [
    {
      header: "SELECT",
      cell: (row) => (
        <div className="flex items-center justify-center">
          <input
            type="checkbox"
            checked={selectedPatients.includes(row._id)}
            onChange={() => handleSelectPatient(row._id)}
            className="w-4 h-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
        </div>
      ),
    },
    {
      header: "CLINICAL SUBJECT",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl opacity-20 blur-sm" />
            <div className="relative h-14 w-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
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
            <button
              onClick={() => {
                setViewPatient(row);
                setViewModalOpen(true);
              }}
              className="font-black text-slate-800 tracking-tight text-lg hover:text-teal-600 transition-colors text-left uppercase"
            >
              {row.name}
            </button>
            <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-1">
              <Fingerprint className="h-3 w-3" />
              {row._id.slice(-10).toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "BIOLOGICAL PROFILE",
      cell: (row) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-teal-500" />
            <span className="font-bold text-slate-700 text-sm">
              {row.age}Y <span className="text-slate-300 mx-1">|</span> {row.gender?.toUpperCase()}
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
      header: "LIAISON ENDPOINTS",
      cell: (row) => (
        <div className="flex flex-col space-y-1">
          <div className="flex items-center gap-2 group">
            <Phone className="h-3 w-3 text-teal-500 group-hover:scale-125 transition-transform" />
            <span className="text-xs font-medium text-slate-600">{row.contact || "—"}</span>
          </div>
          {row.email && (
            <div className="flex items-center gap-2 group">
              <Mail className="h-3 w-3 text-cyan-500 group-hover:scale-125 transition-transform" />
              <span className="text-xs font-medium text-slate-600">{row.email}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "HEMO-GROUP",
      cell: (row) => (
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className={`inline-flex items-center justify-center h-12 w-12 rounded-xl font-black text-sm shadow-lg ${
            row.bloodGroup === "O+" ? "bg-green-50 text-green-700 border border-green-200" :
            row.bloodGroup === "O-" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
            row.bloodGroup === "A+" ? "bg-blue-50 text-blue-700 border border-blue-200" :
            row.bloodGroup === "A-" ? "bg-cyan-50 text-cyan-700 border border-cyan-200" :
            row.bloodGroup === "B+" ? "bg-purple-50 text-purple-700 border border-purple-200" :
            row.bloodGroup === "B-" ? "bg-pink-50 text-pink-700 border border-pink-200" :
            row.bloodGroup === "AB+" ? "bg-amber-50 text-amber-700 border border-amber-200" :
            row.bloodGroup === "AB-" ? "bg-orange-50 text-orange-700 border border-orange-200" :
            "bg-slate-50 text-slate-400 border border-slate-200"
          }`}
        >
          {row.bloodGroup || "—"}
        </motion.div>
      ),
    },
    {
      header: "INDUCTION DATE",
      cell: (row) => (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 text-xs font-medium text-slate-600">
            <Calendar className="h-3 w-3 text-teal-500" />
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1">
            <Clock className="h-3 w-3" />
            Last visit: {row.lastVisit || "N/A"}
          </div>
        </div>
      ),
    },
    {
      header: "REGISTRY STATUS",
      cell: (row) => (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2 ${
            row.isActive
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-red-50 text-red-700 border-red-200"
          }`}
        >
          {row.isActive ? (
            <>
              <CircleCheckBig className="h-3 w-3" />
              OPERATIONAL
            </>
          ) : (
            <>
              <CircleX className="h-3 w-3" />
              DECOMMISSIONED
            </>
          )}
        </motion.div>
      ),
    },
    {
      header: "NODE CONTROL",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setViewPatient(row);
              setViewModalOpen(true);
            }}
            className="h-9 w-9 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-cyan-600 hover:bg-cyan-50 rounded-xl border border-slate-100 hover:border-cyan-200 transition-all duration-300"
            title="View Record"
          >
            <Eye className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleEdit(row)}
            className="h-9 w-9 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-teal-600 hover:bg-teal-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-all duration-300"
            title="Modify Record"
          >
            <Pencil className="h-4 w-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setSelectedPatient(row);
              setDeleteModalOpen(true);
            }}
            className="h-9 w-9 flex items-center justify-center bg-slate-50 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl border border-slate-100 hover:border-red-200 transition-all duration-300"
            title="Revoke Access"
          >
            <Trash2 className="h-4 w-4" />
          </motion.button>
          <button className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-slate-600">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    try {
      await deletePatient(id).unwrap();
      toast.success("Patient deactivated successfully", {
        icon: "✅",
        description: "Record has been archived",
      });
      setDeleteModalOpen(false);
    } catch (err) {
      toast.error("Failed to deactivate patient", {
        icon: "❌",
      });
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
      emergencyContact: patient.emergencyContact || "",
      medicalHistory: patient.medicalHistory || "",
      allergies: patient.allergies || "",
    });
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePatient({ id: selectedPatient._id, data: formData }).unwrap();
      toast.success("Patient records synchronized", {
        icon: "🔄",
        description: "Clinical metadata updated",
      });
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update patient", {
        icon: "⚠️",
      });
    }
  };

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 pb-10"
    >
      {/* Header Section */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical<span className="text-teal-600">Registry</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" />
            Global directory of all synchronized patient entities and their medical markers
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Selected Count Badge */}
          {selectedPatients.length > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-teal-50 rounded-xl border border-teal-200 flex items-center gap-2"
            >
              <span className="text-xs font-bold text-teal-700">
                {selectedPatients.length} selected
              </span>
              <button
                onClick={() => setSelectedPatients([])}
                className="text-teal-500 hover:text-teal-700"
              >
                <CircleX className="h-4 w-4" />
              </button>
            </motion.div>
          )}

          {/* Bulk Actions */}
          {selectedPatients.length > 0 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBulkDeleteModalOpen(true)}
              className="h-12 px-5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Bulk Deactivate
            </motion.button>
          )}

          {/* New Patient Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/receptionist/patients/new"
              className="h-14 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-2xl shadow-xl flex items-center gap-3 group"
            >
              <UserPlus className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Initialize New Intake
              <Sparkles className="h-4 w-4 opacity-70" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Filter Bar */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm"
      >
        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <Filter className="h-4 w-4" />
            <span className="text-xs font-bold">Filters</span>
            <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>


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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none"
                  >
                    <option value="all">All Patients</option>
                    <option value="active">Operational Only</option>
                    <option value="inactive">Decommissioned</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
                    Blood Group
                  </label>
                  <select
                    value={filterBloodGroup}
                    onChange={(e) => setFilterBloodGroup(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none"
                  >
                    <option value="all">All Groups</option>
                    {bloodGroups.map(group => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none"
                  >
                    <option value="name">Name</option>
                    <option value="age">Age</option>
                    <option value="date">Registration Date</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
                    Sort Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none"
                  >
                    <option value="asc">Ascending ↑</option>
                    <option value="desc">Descending ↓</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Main Content */}
      {isLoading ? (
        <div className="flex h-[50vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="h-16 w-16 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="h-6 w-6 text-teal-500 animate-pulse" />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Accessing Central Registry...
            </p>
          </div>
        </div>
      ) : isError ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-12 bg-red-50/50 border border-red-100 rounded-3xl text-center"
        >
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <TriangleAlert className="h-10 w-10 text-red-500" />
          </div>
          <p className="text-red-600 font-black text-lg mb-2">
            Access Protocol Failure
          </p>
          <p className="text-red-400 text-sm">Registry unreachable. Please verify connection.</p>
          <button
            onClick={() => refetch()}
            className="mt-6 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Retry Connection
          </button>
        </motion.div>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={sortedPatients}
            placeholder="Search by patient identity, contact, or ID..."
            onSearch={setSearch}
            selectAll={handleSelectAll}
            isAllSelected={selectedPatients.length === sortedPatients.length}
          />
        </motion.div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Modify Clinical Metadata"
      >
        <form onSubmit={handleUpdate} className="space-y-6 pt-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <User className="h-3 w-3" />
                Full Legal Identity
              </label>
              <input
                required
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <Activity className="h-3 w-3" />
                Temporal Age
              </label>
              <input
                required
                type="number"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <Users className="h-3 w-3" />
                Gender Class
              </label>
              <select
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Primary Contact
              </label>
              <input
                required
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email Address
              </label>
              <input
                type="email"
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <Syringe className="h-3 w-3" />
                Blood Group
              </label>
              <select
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="">Pending Verification</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Address
              </label>
              <input
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest flex items-center gap-1">
                <CircleAlert className="h-3 w-3" />
                Known Allergies
              </label>
              <input
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="List any allergies or write 'None'"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-11 px-6 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isUpdating}
              className="h-12 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Synchronizing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Synchronize Changes
                </>
              )}
            </motion.button>
          </div>
        </form>
      </Modal>

      {/* View Patient Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setViewModalOpen(false)}
        title="Patient Clinical Profile"
      >
        {viewPatient && (
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl border border-teal-100">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center text-white font-black text-2xl">
                {viewPatient.name?.charAt(0)?.toUpperCase()}
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">{viewPatient.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                  <Fingerprint className="h-3 w-3" />
                  ID: {viewPatient._id}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Age</p>
                <p className="font-bold text-slate-800">{viewPatient.age} years</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Gender</p>
                <p className="font-bold text-slate-800 capitalize">{viewPatient.gender}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Blood Group</p>
                <p className="font-bold text-slate-800">{viewPatient.bloodGroup || "—"}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Status</p>
                <p className={`font-bold ${viewPatient.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {viewPatient.isActive ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Contact Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-teal-500" />
                  <span>{viewPatient.contact || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-cyan-500" />
                  <span>{viewPatient.email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-amber-500" />
                  <span>{viewPatient.address || "—"}</span>
                </div>
              </div>
            </div>

            {viewPatient.allergies && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                <p className="text-[10px] font-black uppercase text-amber-600 mb-2">Allergies</p>
                <p className="text-sm text-amber-800">{viewPatient.allergies}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Single Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deactivation"
      >
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <TriangleAlert className="h-8 w-8 text-red-500" />
            <p className="text-sm text-red-700">
              Are you sure you want to deactivate this patient? This action will archive their records.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(selectedPatient?._id)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Confirm Deactivation
            </button>
          </div>
        </div>
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setBulkDeleteModalOpen(false)}
        title="Bulk Deactivation"
      >
        <div className="space-y-6 pt-2">
          <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-200">
            <TriangleAlert className="h-8 w-8 text-red-500" />
            <div>
              <p className="text-sm text-red-700 font-bold mb-1">
                Deactivate {selectedPatients.length} patients?
              </p>
              <p className="text-xs text-red-600">
                This action will archive all selected patient records.
              </p>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setBulkDeleteModalOpen(false)}
              className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl transition-colors"
            >
              Confirm Bulk Deactivation
            </button>
          </div>
        </div>
      </Modal>
    </motion.div>
  );
};

export default PatientsList;
