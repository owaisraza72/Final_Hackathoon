import { useState } from "react";
import {
  useListAppointmentsQuery,
  useUpdateStatusMutation,
  useCancelAppointmentMutation,
} from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Calendar,
  Clock,
  User,
  CircleCheckBig,
  CircleX,
  CircleAlert,
  Clock4,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Download,
  Eye,
  Edit,
  Trash2,
  FileText,
  CalendarCheck,
  CalendarX,
  CalendarClock,
  CalendarDays,
  CalendarRange,
  ChevronRight,
  ArrowUpDown,
  CheckCheck,
  X,
  Info,
  Stethoscope,
  HeartPulse,
  Activity,
  Fingerprint,
  Syringe,
  Pill,
  Thermometer,
  Microscope,
  BrainCircuit,
  Sparkles,
  Shield,
  Phone,
  Mail,
  MapPin,
  History,
  DownloadCloud,
  Printer,
  Share2,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Use #009689 as the primary teal color throughout
const primaryTeal = "#009689";

const MyAppointments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [expandedRows, setExpandedRows] = useState({});

  const { data: appointments, isLoading, refetch } = useListAppointmentsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();
  const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" style={{ borderTopColor: primaryTeal }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-6 w-6 animate-pulse" style={{ color: primaryTeal }} />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">
            Loading Appointments...
          </p>
        </div>
      </div>
    );
  }

  // Filter and sort appointments
  const filteredAppointments = appointments?.filter(app => {
    // Status filter
    if (filterStatus !== "all" && app.status !== filterStatus) return false;
    
    // Search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.patientId?.name?.toLowerCase().includes(searchLower) ||
        app.patientId?._id?.toLowerCase().includes(searchLower) ||
        app.reason?.toLowerCase().includes(searchLower) ||
        app.timeSlot?.toLowerCase().includes(searchLower)
      );
    }
    
    // Date filter
    if (selectedDate && app.date !== selectedDate) return false;
    
    return true;
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

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`, {
        icon: "✅",
        description: "Appointment status synchronized",
        style: { borderLeftColor: primaryTeal },
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status", {
        icon: "❌",
      });
    }
  };

  const handleDeleteAppointment = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await cancelAppointment(id).unwrap();
        toast.success("Appointment deleted successfully", {
          icon: "✅",
        });
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete appointment", {
          icon: "❌",
        });
      }
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const toggleRowExpand = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          hover: "hover:bg-amber-100",
        };
      case "confirmed":
        return {
          label: "Confirmed",
          icon: CircleCheckBig,
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          hover: "hover:bg-blue-100",
        };
      case "completed":
        return {
          label: "Completed",
          icon: CheckCheck,
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          hover: "hover:bg-emerald-100",
        };
      case "no_show":
        return {
          label: "No Show",
          icon: CircleX,
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          hover: "hover:bg-red-100",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          icon: X,
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          hover: "hover:bg-slate-100",
        };
      default:
        return {
          label: status,
          icon: CircleAlert,
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          hover: "hover:bg-slate-100",
        };
    }
  };

  const getDateIcon = (date) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    
    if (date === today) return { icon: CalendarCheck, color: "text-emerald-500" };
    if (date === tomorrow) return { icon: CalendarClock, color: "text-amber-500" };
    if (date < today) return { icon: CalendarX, color: "text-red-500" };
    return { icon: CalendarDays, color: "text-teal-500" };
  };

  const columns = [
    {
      header: "Date & Time",
      accessor: "date",
      cell: (row) => {
        const DateIcon = getDateIcon(row.date).icon;
        const iconColor = getDateIcon(row.date).color;
        
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryTeal}10` }}>
                <DateIcon className="h-6 w-6" style={{ color: primaryTeal }} />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200">
                <span className="text-[8px] font-black text-slate-600">
                  {new Date(row.date).getDate()}
                </span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-slate-800">
                  {new Date(row.date).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-xs font-medium text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-600">{row.timeSlot}</span>
              </div>
              <div className="flex items-center gap-1 mt-1">
                <Calendar className="h-3 w-3" style={{ color: primaryTeal }} />
                <span className="text-[10px] font-medium text-slate-500">
                  {new Date(row.date).toLocaleDateString("en-US", { weekday: "short" })}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      header: "Patient",
      accessor: "patient",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: primaryTeal }}>
            {row.patientId?.name?.charAt(0) || "P"}
          </div>
          <div>
            <div className="font-bold text-slate-800">{row.patientId?.name || "Anonymous Patient"}</div>
            <div className="flex items-center gap-2 mt-1">
              <Fingerprint className="h-3 w-3 text-slate-400" />
              <span className="text-[8px] font-medium text-slate-500">
                ID: {row.patientId?._id?.slice(-6).toUpperCase() || "NEW"}
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Reason",
      accessor: "reason",
      cell: (row) => (
        <div className="flex items-center gap-2 max-w-xs">
          <Stethoscope className="h-4 w-4 flex-shrink-0" style={{ color: primaryTeal }} />
          <span className="text-sm text-slate-600 truncate">
            {row.reason || "General Consultation"}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (row) => {
        const config = getStatusConfig(row.status);
        const StatusIcon = config.icon;
        
        return (
          <div className="relative">
            <select
              value={row.status}
              onChange={(e) => handleStatusChange(row._id, e.target.value)}
              disabled={isUpdating}
              className={`w-full h-10 pl-9 pr-8 rounded-xl border text-xs font-bold uppercase tracking-wider outline-none focus:ring-2 transition-all appearance-none cursor-pointer ${config.bg} ${config.text} ${config.border} ${config.hover}`}
              style={{ focusRingColor: primaryTeal }}
            >
              <option value="pending">PENDING</option>
              <option value="confirmed">CONFIRMED</option>
              <option value="completed">COMPLETED</option>
              <option value="no_show">NO SHOW</option>
              <option value="cancelled">CANCELLED</option>
            </select>
            <StatusIcon className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${config.text}`} />
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          </div>
        );
      },
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleViewDetails(row)}
            className="h-8 w-8 rounded-lg flex items-center justify-center border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
            style={{ hoverBorderColor: primaryTeal }}
          >
            <Eye className="h-4 w-4 text-slate-500" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleRowExpand(row._id)}
            className="h-8 w-8 rounded-lg flex items-center justify-center border border-slate-200 hover:border-teal-300 hover:bg-teal-50 transition-all"
          >
            <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${expandedRows[row._id] ? 'rotate-180' : ''}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleDeleteAppointment(row._id)}
            disabled={isCancelling}
            className="h-8 w-8 rounded-lg flex items-center justify-center border border-slate-200 hover:border-red-300 hover:bg-red-50 hover:text-red-500 transition-all text-slate-500"
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
      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: primaryTeal }}>
              <CalendarRange className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical<span style={{ color: primaryTeal }}>Queue</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Manage and synchronize patient appointments
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ backgroundColor: `${primaryTeal}10`, borderColor: `${primaryTeal}30` }}>
            <div className="relative">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: primaryTeal }} />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2 w-2 rounded-full opacity-50"
                style={{ backgroundColor: primaryTeal }}
              />
            </div>
            <span className="text-xs font-bold" style={{ color: primaryTeal }}>Live Queue</span>
          </div>

          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Appointments", value: appointments?.length || 0, icon: CalendarRange, color: "text-blue-600" },
          { label: "Pending", value: appointments?.filter(a => a.status === "pending").length || 0, icon: Clock, color: "text-amber-600" },
          { label: "Completed", value: appointments?.filter(a => a.status === "completed").length || 0, icon: CheckCheck, color: "text-emerald-600" },
          { label: "Today", value: appointments?.filter(a => a.date === new Date().toISOString().split("T")[0]).length || 0, icon: CalendarCheck, color: "text-teal-600" },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Filter Bar */}
      <motion.div variants={itemVariants} className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filters
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 w-64"
                style={{ focusRingColor: `${primaryTeal}20` }}
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

            {(searchTerm || filterStatus !== "all" || selectedDate) && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterStatus("all");
                  setSelectedDate("");
                }}
                className="text-xs font-medium" style={{ color: primaryTeal }}
              >
                Clear filters
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExportModal(true)}
              className="h-10 px-4 border border-slate-200 rounded-xl text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 mt-4 border-t border-slate-100">
                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2"
                    style={{ focusRingColor: `${primaryTeal}20` }}
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="no_show">No Show</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2"
                    style={{ focusRingColor: `${primaryTeal}20` }}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2"
                    style={{ focusRingColor: `${primaryTeal}20` }}
                  >
                    <option value="date">Date</option>
                    <option value="time">Time</option>
                    <option value="patient">Patient Name</option>
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
                    <ArrowUpDown className="h-4 w-4 text-slate-400" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Appointments Table */}
      {isLoading ? (
        <div className="flex h-[50vh] justify-center items-center">
          <LoadingSpinner />
        </div>
      ) : (
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          <DataTable
            columns={columns}
            data={sortedAppointments}
            placeholder="Search appointments..."
            expandedRows={expandedRows}
            renderExpanded={(row) => (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-slate-50 border-t border-slate-100"
              >
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Patient Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                      <User className="h-4 w-4" style={{ color: primaryTeal }} />
                      Patient Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{row.patientId?.contact || "No contact"}</span>
                      </div>
                      {row.patientId?.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{row.patientId.email}</span>
                        </div>
                      )}
                      {row.patientId?.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-slate-400" />
                          <span className="text-slate-600">{row.patientId.address}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                      <Calendar className="h-4 w-4" style={{ color: primaryTeal }} />
                      Appointment Details
                    </h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">{row.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Stethoscope className="h-4 w-4 text-slate-400" />
                        <span className="text-slate-600">Dr. {row.doctorId?.name || "Unassigned"}</span>
                      </div>
                      {row.reason && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-600 italic">"{row.reason}"</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-500 flex items-center gap-2">
                      <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
                      Quick Actions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-teal-50 transition-colors flex items-center gap-2">
                        <FileText className="h-4 w-4" style={{ color: primaryTeal }} />
                        Add Note
                      </button>
                      <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-medium hover:bg-teal-50 transition-colors flex items-center gap-2">
                        <History className="h-4 w-4" style={{ color: primaryTeal }} />
                        View History
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          />
        </motion.div>
      )}

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
                <h3 className="text-lg font-bold text-slate-800">Appointment Details</h3>
                <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-xl flex items-center justify-center text-white font-bold text-2xl" style={{ backgroundColor: primaryTeal }}>
                    {selectedAppointment.patientId?.name?.charAt(0) || "P"}
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-slate-800">{selectedAppointment.patientId?.name || "Unknown Patient"}</h4>
                    <p className="text-sm text-slate-500">ID: {selectedAppointment.patientId?._id?.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Date</p>
                    <p className="font-bold text-slate-800">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        month: 'long', 
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Time</p>
                    <p className="font-bold text-slate-800">{selectedAppointment.timeSlot}</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Status</p>
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border`}
                    style={{ 
                      backgroundColor: selectedAppointment.status === 'completed' ? '#10b98120' : 
                                      selectedAppointment.status === 'pending' ? '#f59e0b20' : 
                                      '#ef444420',
                      borderColor: selectedAppointment.status === 'completed' ? '#10b981' : 
                                  selectedAppointment.status === 'pending' ? '#f59e0b' : 
                                  '#ef4444'
                    }}
                  >
                    {selectedAppointment.status === 'completed' && <CircleCheckBig className="h-4 w-4 text-emerald-600" />}
                    {selectedAppointment.status === 'pending' && <Clock className="h-4 w-4 text-amber-600" />}
                    {selectedAppointment.status === 'no_show' && <CircleX className="h-4 w-4 text-red-600" />}
                    <span className="text-sm font-bold capitalize">{selectedAppointment.status}</span>
                  </div>
                </div>

                {selectedAppointment.reason && (
                  <div className="p-4 bg-teal-50 rounded-lg border border-teal-100">
                    <p className="text-xs font-bold text-teal-700 mb-2">Reason for Visit</p>
                    <p className="text-sm text-teal-900 italic">"{selectedAppointment.reason}"</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Export Modal */}
      <AnimatePresence>
        {showExportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowExportModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Export Appointments</h3>
              </div>

              <div className="p-6 space-y-4">
                <button className="w-full p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all text-left flex items-center gap-4">
                  <DownloadCloud className="h-6 w-6" style={{ color: primaryTeal }} />
                  <div>
                    <p className="font-bold text-slate-800">CSV Format</p>
                    <p cl assName="text-xs text-slate-500">Export as spreadsheet</p>
                  </div>
                </button>

                <button className="w-full p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all text-left flex items-center gap-4">
                  <Printer className="h-6 w-6" style={{ color: primaryTeal }} />
                  <div>
                    <p className="font-bold text-slate-800">PDF Report</p>
                    <p className="text-xs text-slate-500">Generate printable report</p>
                  </div>
                </button>

                <button className="w-full p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all text-left flex items-center gap-4">
                  <Share2 className="h-6 w-6" style={{ color: primaryTeal }} />
                  <div>
                    <p className="font-bold text-slate-800">Share via Email</p>
                    <p className="text-xs text-slate-500">Send to colleagues</p>
                  </div>
                </button>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyAppointments;
