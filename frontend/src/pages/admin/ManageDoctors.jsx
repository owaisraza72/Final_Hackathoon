import { useState } from "react";
import {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/features/admin/adminApi";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import {
  UserPlus,
  Phone,
  User,
  Pencil,
  Trash2,
  CircleAlert,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Eye,
  Mail,
  Calendar,
  Clock,
  CircleCheckBig,
  CircleX,
  Shield,
  Award,
  Sparkles,
  Stethoscope,
  HeartPulse,
  BrainCircuit,
  Activity,
  Fingerprint,
  UserCog,
  UserCheck,
  UserX,
  UserSearch,
  UserCircle,
  UserPlus as UserPlusIcon,
  UserMinus,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  BookOpen,
  Medal,
  Star,
  Zap,
  Info,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const ManageDoctors = () => {
  const { data: doctors, isLoading, isError, refetch } = useListUsersQuery("DOCTOR");
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialization: "",
    phone: "",
    experience: "",
  });

  // Filter doctors
  const filteredDoctors = doctors?.filter((d) => {
    // Search filter
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.specialization || "").toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "active" && d.isActive) ||
      (filterStatus === "inactive" && !d.isActive);

    return matchesSearch && matchesStatus;
  }) || [];

  const columns = [
    {
      header: "Practitioner",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div 
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: primaryTeal }}
          >
            {row.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800">{row.name}</p>
            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
              <Mail className="h-3 w-3" style={{ color: primaryTeal }} />
              {row.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      header: "Specialization",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Stethoscope className="h-4 w-4" style={{ color: primaryTeal }} />
          <span className="text-sm text-slate-600">{row.specialization || "General Practice"}</span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              row.isActive 
                ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" 
                : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"
            }`}
          />
          <span
            className={`text-[10px] font-bold uppercase tracking-wider ${
              row.isActive ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm text-slate-600">
            {new Date(row.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
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
            onClick={() => {
              setSelectedDoctor(row);
              setShowDetailsModal(true);
            }}
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
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEdit(row)}
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
            <Pencil className="h-4 w-4" />
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

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ 
      name: user.name, 
      email: user.email, 
      password: "",
      specialization: user.specialization || "",
      phone: user.phone || "",
      experience: user.experience || "",
    });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDeleteClick = (id) => {
    setDeletingId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      await deleteUser(deletingId).unwrap();
      toast.success("Doctor deactivated successfully", {
        icon: "✅",
        description: "Record updated",
      });
      setShowDeleteModal(false);
      setDeletingId(null);
    } catch (err) {
      toast.error("Failed to deactivate doctor", {
        icon: "❌",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateUser({ id: selectedUser._id, data: formData }).unwrap();
        toast.success("Doctor updated successfully", {
          icon: "✅",
          description: "Practitioner record modified",
        });
      } else {
        await createUser({ ...formData, role: "DOCTOR" }).unwrap();
        toast.success("Doctor added successfully", {
          icon: "✅",
          description: "New practitioner onboarded",
        });
      }
      setModalOpen(false);
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({ name: "", email: "", password: "", specialization: "", phone: "", experience: "" });
    } catch (err) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} doctor`,
        {
          icon: "❌",
        }
      );
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
  };

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
              style={{ backgroundColor: primaryTeal }}
            >
              <Users className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Practitioner<span style={{ color: primaryTeal }}>Directory</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Maintain and oversee the active medical task force
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsEditMode(false);
              setModalOpen(true);
              setFormData({ name: "", email: "", password: "", specialization: "", phone: "", experience: "" });
            }}
            className="h-10 px-5 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg"
            style={{ 
              background: primaryTeal,
              boxShadow: `0 4px 6px ${tealGlow}`
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = tealHover}
            onMouseLeave={(e) => e.currentTarget.style.background = primaryTeal}
          >
            <UserPlus className="h-4 w-4" />
            Onboard Practitioner
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Bar */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
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
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: primaryTeal }} />
              <input
                type="text"
                placeholder="Search by name, email, specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none w-80 transition-all"
                style={{ 
                  focusBorderColor: primaryTeal, 
                  focusRing: `0 0 0 3px ${tealGlow}` 
                }}
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
              <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
                <div className="w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                    style={{ 
                      focusBorderColor: primaryTeal, 
                      focusRing: `0 0 0 3px ${tealGlow}` 
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = primaryTeal;
                      e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <option value="all">All Practitioners</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Stats Summary */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Doctors", value: doctors?.length || 0, icon: Users },
          { label: "Active", value: doctors?.filter(d => d.isActive).length || 0, icon: UserCheck },
          { label: "Inactive", value: doctors?.filter(d => !d.isActive).length || 0, icon: UserX },
          { label: "Specialties", value: new Set(doctors?.map(d => d.specialization).filter(Boolean)).size || 0, icon: Stethoscope },
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
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: tealLight }}>
                  <Icon className="h-5 w-5" style={{ color: primaryTeal }} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Doctors Table */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="relative">
              <div 
                className="h-16 w-16 border-4 rounded-full animate-spin"
                style={{ borderColor: `${primaryTeal}20`, borderTopColor: primaryTeal }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <User className="h-6 w-6 animate-pulse" style={{ color: primaryTeal }} />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Accessing Secure Records...
            </p>
          </div>
        ) : isError ? (
          <div className="h-[400px] flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
              <CircleAlert className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-sm font-bold text-red-400">Access Protocol Failure</p>
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
            data={filteredDoctors}
            placeholder="No practitioners found..."
          />
        )}
      </motion.div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsEditMode(false);
        }}
        title={
          isEditMode
            ? "Edit Practitioner"
            : "Add New Practitioner"
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Full Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Dr. Julian Vanguard"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryTeal, 
                focusRing: `0 0 0 3px ${tealGlow}` 
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = primaryTeal;
                e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Email
            </label>
            <input
              required
              type="email"
              placeholder="practitioner@clinicos.pro"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryTeal, 
                focusRing: `0 0 0 3px ${tealGlow}` 
              }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Specialization
            </label>
            <input
              type="text"
              placeholder="e.g. Cardiology"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryTeal, 
                focusRing: `0 0 0 3px ${tealGlow}` 
              }}
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              Phone
            </label>
            <input
              type="text"
              placeholder="+1 (555) 123-4567"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryTeal, 
                focusRing: `0 0 0 3px ${tealGlow}` 
              }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs font-medium text-slate-500 mb-1 block">
              {isEditMode ? "New Password (Optional)" : "Password"}
            </label>
            <input
              required={!isEditMode}
              type="password"
              placeholder="••••••••"
              className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
              style={{ 
                focusBorderColor: primaryTeal, 
                focusRing: `0 0 0 3px ${tealGlow}` 
              }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <p className="text-[10px] text-slate-400 mt-1">Minimum 8 characters</p>
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
              disabled={isCreating || isUpdating}
              className="px-5 py-2 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2"
              style={{ 
                background: primaryTeal,
                boxShadow: `0 4px 6px ${tealGlow}`
              }}
              onMouseEnter={(e) => !isCreating && !isUpdating && (e.currentTarget.style.background = tealHover)}
              onMouseLeave={(e) => !isCreating && !isUpdating && (e.currentTarget.style.background = primaryTeal)}
            >
              {isCreating || isUpdating ? (
                <>
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                isEditMode ? "Update" : "Add Doctor"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedDoctor && (
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
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Practitioner Details</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Doctor Info */}
                <div className="flex items-center gap-4">
                  <div 
                    className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl"
                    style={{ backgroundColor: primaryTeal }}
                  >
                    {selectedDoctor.name?.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">{selectedDoctor.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-4 w-4" style={{ color: primaryTeal }} />
                      <span className="text-sm text-slate-600">{selectedDoctor.email}</span>
                    </div>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Specialization</p>
                    <p className="font-bold text-slate-800">{selectedDoctor.specialization || "General Practice"}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Phone</p>
                    <p className="font-bold text-slate-800">{selectedDoctor.phone || "Not provided"}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Status</span>
                  <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    selectedDoctor.isActive 
                      ? "bg-emerald-50 border-emerald-200" 
                      : "bg-red-50 border-red-200"
                  }`}>
                    <div className={`h-2 w-2 rounded-full ${
                      selectedDoctor.isActive 
                        ? "bg-emerald-500" 
                        : "bg-red-500"
                    }`} />
                    <span className={`text-sm font-bold ${
                      selectedDoctor.isActive 
                        ? "text-emerald-700" 
                        : "text-red-700"
                    }`}>
                      {selectedDoctor.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Joined</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" style={{ color: primaryTeal }} />
                    <span className="text-sm font-bold text-slate-800">
                      {new Date(selectedDoctor.createdAt).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
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
                    <CircleAlert className="h-6 w-6 text-red-600" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">Deactivate Practitioner</h3>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to deactivate this doctor? They will no longer have access to the system.
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
                    Deactivate
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

export default ManageDoctors;
