import {
  useListAppointmentsQuery,
  useUpdateStatusMutation,
  useCancelAppointmentMutation,
} from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import {
  CalendarRange,
  User,
  Stethoscope,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Download,
  Eye,
  Calendar,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  CalendarDays,
  Activity,
  HeartPulse,
  BrainCircuit,
  Pill,
  Syringe,
  FileText,
  Info,
  Shield,
  Sparkles,
  Zap,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
  Timer,
  Users,
  UserCog,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
} from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const ManageAppointments = () => {
  const [filterDate, setFilterDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  const {
    data: appointments,
    isLoading,
    isError,
    refetch,
  } = useListAppointmentsQuery({ date: filterDate });

  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [cancelAppointment] = useCancelAppointmentMutation();

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter appointments
  const filteredAppointments =
    appointments?.filter((a) => {
      // Search filter
      const matchesSearch =
        a.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.doctorId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a._id?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = filterStatus === "all" || a.status === filterStatus;

      return matchesSearch && matchesStatus;
    }) || [];

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === "date") {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    }
    if (sortBy === "time") {
      return sortOrder === "asc"
        ? a.timeSlot.localeCompare(b.timeSlot)
        : b.timeSlot.localeCompare(a.timeSlot);
    }
    if (sortBy === "patient") {
      return sortOrder === "asc"
        ? (a.patientId?.name || "").localeCompare(b.patientId?.name || "")
        : (b.patientId?.name || "").localeCompare(a.patientId?.name || "");
    }
    return 0;
  });

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateStatus({ id, status }).unwrap();
      toast.success(`Appointment marked as ${status}`, {
        icon: "✅",
        description: "Operational status synchronized",
      });
    } catch (err) {
      toast.error("Protocol update failed", {
        icon: "❌",
      });
    }
  };

  const handleCancelClick = (id) => {
    setCancellingId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelAppointment(cancellingId).unwrap();
      toast.success("Appointment cancelled successfully", {
        icon: "✅",
        description: "Encounter aborted",
      });
      setShowCancelModal(false);
      setCancellingId(null);
    } catch (err) {
      toast.error("Cancellation sequence failed", {
        icon: "❌",
      });
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterStatus("all");
    setFilterDate("");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle2,
          label: "Completed",
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: Clock,
          label: "Pending",
        };
      case "confirmed":
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: CheckCircle2,
          label: "Confirmed",
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
          label: "Cancelled",
        };
      case "no_show":
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: AlertCircle,
          label: "No Show",
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: AlertCircle,
          label: status,
        };
    }
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
    return { icon: CalendarDays, color: "text-teal-500" };
  };

  const columns = [
    {
      header: "Clinical Encounter",
      cell: (row) => {
        const DateIcon = getDateIcon(row.date).icon;
        const dateColor = getDateIcon(row.date).color;

        return (
          <div className="flex items-center gap-4">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center shadow-sm"
              style={{ backgroundColor: tealLight }}
            >
              <CalendarRange size={18} style={{ color: primaryTeal }} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800 tracking-tight">
                {row.reason || "General Consultation"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <DateIcon className={`h-3 w-3 ${dateColor}`} />
                <p className="text-[10px] font-medium text-slate-500">
                  {formatDate(row.date)} • {row.timeSlot}
                </p>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Subject & Practitioner",
      cell: (row) => (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: primaryTeal }}
            >
              {row.patientId?.name?.charAt(0) || "P"}
            </div>
            <span className="text-xs font-medium text-slate-700">
              {row.patientId?.name || "Anonymous Patient"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Stethoscope className="h-3 w-3" style={{ color: primaryTeal }} />
            <span className="text-[10px] font-medium text-slate-500">
              Dr. {row.doctorId?.name || "Unassigned"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const status = getStatusColor(row.status);
        const StatusIcon = status.icon;

        return (
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.bg} ${status.text} border ${status.border}`}
          >
            <StatusIcon className="h-3 w-3" />
            <span className="text-[10px] font-bold uppercase">
              {status.label}
            </span>
          </div>
        );
      },
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

          {row.status !== "completed" &&
            row.status !== "cancelled" &&
            row.status !== "no_show" && (
              <>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleStatusUpdate(row._id, "completed")}
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
                  <CheckCircle2 className="h-4 w-4" />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleCancelClick(row._id)}
                  className="p-2 rounded-lg transition-all hover:bg-red-50 hover:text-red-500"
                >
                  <XCircle className="h-4 w-4" />
                </motion.button>
              </>
            )}
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
              <CalendarRange className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Global<span style={{ color: primaryTeal }}>Oversight</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Centralized coordination of all clinical appointments
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
          <button className="h-10 px-4 bg-white border border-slate-200 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
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
                placeholder="Search by patient, doctor, reason..."
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

            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
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

            {(searchTerm || filterStatus !== "all" || filterDate) && (
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
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
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
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no_show">No Show</option>
                  </select>
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
                    <option value="time">Time</option>
                    <option value="patient">Patient Name</option>
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
                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
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
            label: "Total",
            value: appointments?.length || 0,
            icon: CalendarRange,
          },
          {
            label: "Pending",
            value:
              appointments?.filter((a) => a.status === "pending").length || 0,
            icon: Clock,
          },
          {
            label: "Completed",
            value:
              appointments?.filter((a) => a.status === "completed").length || 0,
            icon: CheckCircle2,
          },
          {
            label: "Cancelled",
            value:
              appointments?.filter((a) => a.status === "cancelled").length || 0,
            icon: XCircle,
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

      {/* Appointments Table */}
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
                <CalendarRange
                  className="h-6 w-6 animate-pulse"
                  style={{ color: primaryTeal }}
                />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Synchronising Operational Grid...
            </p>
          </div>
        ) : isError ? (
          <div className="h-[500px] flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
            <p className="text-sm font-bold text-red-400">
              Grid Access Exception
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
            data={sortedAppointments}
            placeholder="No clinical encounters detected in current frame..."
          />
        )}
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedAppointment && (
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
                <h3 className="text-lg font-bold text-slate-800">
                  Appointment Details
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
                    {selectedAppointment.patientId?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">
                      {selectedAppointment.patientId?.name || "Unknown Patient"}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-slate-500">
                        {selectedAppointment.patientId?.age || "?"} years
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-sm text-slate-500 capitalize">
                        {selectedAppointment.patientId?.gender || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Appointment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Date</p>
                    <p className="font-bold text-slate-800">
                      {new Date(selectedAppointment.date).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        },
                      )}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Time</p>
                    <p className="font-bold text-slate-800">
                      {selectedAppointment.timeSlot}
                    </p>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Assigned Doctor</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">
                        Dr. {selectedAppointment.doctorId?.name || "Unassigned"}
                      </p>
                      <p className="text-xs text-slate-500">Practitioner</p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {selectedAppointment.reason && (
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: tealLight }}
                  >
                    <p
                      className="text-xs font-bold mb-1"
                      style={{ color: primaryTeal }}
                    >
                      Reason for Visit
                    </p>
                    <p className="text-sm text-slate-700 italic">
                      "{selectedAppointment.reason}"
                    </p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Current Status</span>
                  <div
                    className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                      getStatusColor(selectedAppointment.status).bg
                    } ${getStatusColor(selectedAppointment.status).border}`}
                  >
                    {selectedAppointment.status === "completed" && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    )}
                    {selectedAppointment.status === "pending" && (
                      <Clock className="h-4 w-4 text-amber-600" />
                    )}
                    {selectedAppointment.status === "cancelled" && (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <span
                      className={`font-bold ${getStatusColor(selectedAppointment.status).text}`}
                    >
                      {getStatusColor(selectedAppointment.status).label}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelModal(false)}
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
                    Cancel Appointment
                  </h3>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to cancel this appointment? This will
                  mark it as cancelled and notify the patient.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Keep Appointment
                  </button>
                  <button
                    onClick={confirmCancel}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors"
                  >
                    Confirm Cancel
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

export default ManageAppointments;
