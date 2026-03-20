import { useState, useEffect } from "react";
import {
  useGetDailyScheduleQuery,
  useCancelAppointmentMutation,
} from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { 
  Calendar, 
  User, 
  Clock, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Activity,
  Stethoscope,
  Phone,
  Mail,
  MapPin,
  FileText,
  CalendarDays,
  Watch,
  Timer,
  Info,
  ArrowRight,
  RefreshCw,
  Filter,
  ChevronDown,
  Eye,
  CalendarClock,
  CalendarCheck,
  CalendarX,
  CalendarRange,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

// Primary teal color from your palette
const primaryTeal = "#009689";
const tealLight = "#E6F7F5";
const tealHover = "#007F73";
const tealGlow = "rgba(0, 150, 137, 0.15)";

const DailySchedule = () => {
  const now = new Date();
  const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const [selectedDate, setSelectedDate] = useState(localDate);
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);

  const { data: appointments, isLoading, refetch } = useGetDailyScheduleQuery(selectedDate);
  const [cancelAppointment, { isLoading: isCanceling }] = useCancelAppointmentMutation();

  // Format date for display
  const formattedDate = new Date(selectedDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Filter appointments by status
  const filteredAppointments = appointments?.filter(app => {
    if (filterStatus === "all") return true;
    return app.status === filterStatus;
  }) || [];

  // Sort appointments by time
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const timeA = a.timeSlot?.split(":")[0] || "0";
    const timeB = b.timeSlot?.split(":")[0] || "0";
    return parseInt(timeA) - parseInt(timeB);
  });

  // Statistics
  const totalAppointments = appointments?.length || 0;
  const completedCount = appointments?.filter(a => a.status === "completed").length || 0;
  const pendingCount = appointments?.filter(a => a.status === "pending").length || 0;
  const cancelledCount = appointments?.filter(a => a.status === "cancelled").length || 0;

  const handleCancelClick = (id) => {
    setCancellingId(id);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    try {
      await cancelAppointment(cancellingId).unwrap();
      toast.success("Appointment cancelled successfully", {
        icon: "✅",
        description: "The appointment has been removed from schedule",
      });
      setShowCancelModal(false);
      setCancellingId(null);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to cancel appointment", {
        icon: "❌",
      });
    }
  };

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const navigateDate = (direction) => {
    const date = new Date(selectedDate);
    date.setDate(date.getDate() + direction);
    setSelectedDate(date.toISOString().split("T")[0]);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return {
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
          icon: CheckCircle2,
          label: "Completed"
        };
      case "pending":
        return {
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
          icon: Clock,
          label: "Pending"
        };
      case "cancelled":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
          label: "Cancelled"
        };
      default:
        return {
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
          icon: AlertCircle,
          label: status
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

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto space-y-8 pb-10 px-4 sm:px-6"
    >
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: primaryTeal }}
            >
              <CalendarRange className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical<span style={{ color: primaryTeal }}>Chronology</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Synchronized master schedule for active clinical encounters
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-medium text-slate-600">{completedCount}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-amber-500" />
              <span className="text-xs font-medium text-slate-600">{pendingCount}</span>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-medium text-slate-600">{cancelledCount}</span>
            </div>
          </div>

          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Date Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-100 p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate(-1)}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-slate-600" />
            </button>
            
            <div 
              className="flex items-center gap-3 h-10 px-4 rounded-xl border"
              style={{ 
                backgroundColor: tealLight, 
                borderColor: primaryTeal 
              }}
            >
              <Calendar className="h-4 w-4" style={{ color: primaryTeal }} />
              <div className="flex flex-col">
                <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: primaryTeal }}>
                  Active Cycle Date
                </span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="text-xs font-bold text-slate-700 outline-none bg-transparent cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => navigateDate(1)}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-slate-600" />
            </button>

            <span className="text-sm text-slate-500 ml-2 hidden md:inline">
              {formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="h-10 px-4 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors"
            >
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>

            <div className="flex items-center gap-1 border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode("grid")}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewMode === "grid" 
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                style={viewMode === "grid" ? { backgroundColor: primaryTeal } : {}}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="8" height="8" rx="1" strokeWidth="2" />
                  <rect x="13" y="3" width="8" height="8" rx="1" strokeWidth="2" />
                  <rect x="3" y="13" width="8" height="8" rx="1" strokeWidth="2" />
                  <rect x="13" y="13" width="8" height="8" rx="1" strokeWidth="2" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`h-8 w-8 rounded-lg flex items-center justify-center transition-colors ${
                  viewMode === "list" 
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-600"
                }`}
                style={viewMode === "list" ? { backgroundColor: primaryTeal } : {}}
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="18" height="4" rx="1" strokeWidth="2" />
                  <rect x="3" y="10" width="18" height="4" rx="1" strokeWidth="2" />
                  <rect x="3" y="17" width="18" height="4" rx="1" strokeWidth="2" />
                </svg>
              </button>
            </div>
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
                    <option value="all">All Appointments</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex h-[50vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div 
                className="h-16 w-16 border-4 rounded-full animate-spin"
                style={{ borderColor: `${primaryTeal}10`, borderTopColor: primaryTeal }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Calendar className="h-6 w-6 animate-pulse" style={{ color: primaryTeal }} />
              </div>
            </div>
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
              Compiling Daily Matrix...
            </p>
          </div>
        </div>
      ) : sortedAppointments.length === 0 ? (
        // Empty State
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm"
        >
          <div 
            className="h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: tealLight }}
          >
            <Calendar className="h-10 w-10" style={{ color: primaryTeal }} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Appointments Found</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            There are no clinical sessions scheduled for {formattedDate}.
          </p>
          <button
            onClick={() => setSelectedDate(localDate)}
            className="mt-6 px-6 py-2 text-white rounded-lg text-sm font-medium transition-all"
            style={{ 
              backgroundColor: primaryTeal,
              hoverBackground: tealHover
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tealHover}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryTeal}
          >
            View Today's Schedule
          </button>
        </motion.div>
      ) : viewMode === "grid" ? (
        // Grid View
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedAppointments.map((app, index) => {
            const statusColors = getStatusColor(app.status);
            const StatusIcon = statusColors.icon;
            const DateIcon = getDateIcon(app.date).icon;

            return (
              <motion.div
                key={app._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-all"
              >
                {/* Card Header */}
                <div 
                  className="p-4 border-b flex items-center justify-between"
                  style={{ backgroundColor: tealLight }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      <DateIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-sm font-bold" style={{ color: tealHover }}>
                        {app.timeSlot}
                      </span>
                      <span className="text-[8px] font-medium text-slate-500 block">
                        Appointment Time
                      </span>
                    </div>
                  </div>
                  <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1 ${statusColors.bg} ${statusColors.border}`}>
                    <StatusIcon className={`h-3 w-3 ${statusColors.text}`} />
                    <span className={`text-[10px] font-bold uppercase ${statusColors.text}`}>
                      {statusColors.label}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <div 
                      className="h-10 w-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      {app.patientId?.name?.charAt(0) || "P"}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-teal-700 transition-colors">
                        {app.patientId?.name || "Unknown Patient"}
                      </h4>
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Stethoscope className="h-3 w-3" />
                        Dr. {app.doctorId?.name || "Unassigned"}
                      </p>
                    </div>
                  </div>

                  {app.reason && (
                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <p className="text-xs text-slate-600 italic">"{app.reason}"</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => handleViewDetails(app)}
                      className="text-xs font-medium flex items-center gap-1 transition-colors"
                      style={{ color: primaryTeal }}
                      onMouseEnter={(e) => e.currentTarget.style.color = tealHover}
                      onMouseLeave={(e) => e.currentTarget.style.color = primaryTeal}
                    >
                      View Details
                      <ArrowRight className="h-3 w-3" />
                    </button>

                    {app.status === "pending" && (
                      <button
                        onClick={() => handleCancelClick(app._id)}
                        className="p-2 hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        // List View
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Time</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Patient</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Doctor</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Reason</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold uppercase text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedAppointments.map((app) => {
                  const statusColors = getStatusColor(app.status);
                  const StatusIcon = statusColors.icon;

                  return (
                    <motion.tr
                      key={app._id}
                      whileHover={{ backgroundColor: "#f8fafc" }}
                      className="group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" style={{ color: primaryTeal }} />
                          <span className="font-medium text-slate-700">{app.timeSlot}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: primaryTeal }}
                          >
                            {app.patientId?.name?.charAt(0) || "P"}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{app.patientId?.name || "Unknown"}</p>
                            <p className="text-[10px] text-slate-400">ID: {app._id.slice(-6).toUpperCase()}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4 text-slate-400" />
                          <span className="text-sm text-slate-600">Dr. {app.doctorId?.name || "Unassigned"}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-600 line-clamp-1">{app.reason || "—"}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg ${statusColors.bg} ${statusColors.text} border ${statusColors.border}`}>
                          <StatusIcon className="h-3 w-3" />
                          <span className="text-[10px] font-bold uppercase">{statusColors.label}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(app)}
                            className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                          >
                            <Eye className="h-4 w-4 text-slate-500" />
                          </button>
                          {app.status === "pending" && (
                            <button
                              onClick={() => handleCancelClick(app._id)}
                              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
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
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5 text-slate-500" />
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
                    <p className="text-sm text-slate-500 mt-1">
                      {selectedAppointment.patientId?.age || "?"} years • {selectedAppointment.patientId?.gender || "?"}
                    </p>
                  </div>
                </div>

                {/* Appointment Details Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 mb-1">Date</p>
                    <p className="font-bold text-slate-800">
                      {new Date(selectedAppointment.date).toLocaleDateString('en-US', {
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

                {/* Doctor Info */}
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs text-slate-500 mb-2">Assigned Doctor</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-slate-200 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Dr. {selectedAppointment.doctorId?.name || "Unassigned"}</p>
                      <p className="text-xs text-slate-500">Practitioner</p>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                {selectedAppointment.reason && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: tealLight }}>
                    <p className="text-xs font-bold mb-1" style={{ color: primaryTeal }}>Chief Complaint</p>
                    <p className="text-sm text-slate-700 italic">"{selectedAppointment.reason}"</p>
                  </div>
                )}

                {/* Status */}
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                  <span className="text-sm text-slate-600">Current Status</span>
                  <div className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
                    getStatusColor(selectedAppointment.status).bg
                  } ${getStatusColor(selectedAppointment.status).border}`}>
                    {selectedAppointment.status === "completed" && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                    {selectedAppointment.status === "pending" && <Clock className="h-4 w-4 text-amber-600" />}
                    {selectedAppointment.status === "cancelled" && <XCircle className="h-4 w-4 text-red-600" />}
                    <span className={`font-bold ${getStatusColor(selectedAppointment.status).text}`}>
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
                  <h3 className="text-lg font-bold text-slate-800">Cancel Appointment</h3>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  Are you sure you want to cancel this appointment? This action cannot be undone.
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
                    disabled={isCanceling}
                    className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isCanceling ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Cancelling...
                      </>
                    ) : (
                      'Confirm Cancel'
                    )}
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

export default DailySchedule;