import { useState } from "react";
import { useGetPatientHistoryQuery } from "@/features/patients/patientApi";
import useAuth from "@/hooks/useAuth";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  CalendarRange,
  Activity,
  Clock,
  CheckCheck,
  CalendarCheck,
  Search,
  RefreshCw,
  Stethoscope,
  X,
  CircleCheckBig,
  CircleX,
  Calendar,
  CalendarClock,
  CalendarDays,
  CalendarX,
  CircleAlert
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const primaryTeal = "#14b8a6"; // teal-500

const AppointmentHistory = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: history, isLoading, refetch } = useGetPatientHistoryQuery(
    user?._id || "me",
    { skip: !user?._id }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-teal-500 animate-pulse" />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest">
            Loading Timeline...
          </p>
        </div>
      </div>
    );
  }

  const appointments = history?.appointments || [];

  const filteredAppointments = appointments.filter(app => {
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        app.reason?.toLowerCase().includes(searchLower) ||
        app.doctorId?.name?.toLowerCase().includes(searchLower) ||
        app.status?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const getStatusConfig = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          icon: Clock,
          bg: "bg-amber-50",
          text: "text-amber-700",
          border: "border-amber-200",
        };
      case "completed":
        return {
          label: "Completed",
          icon: CheckCheck,
          bg: "bg-emerald-50",
          text: "text-emerald-700",
          border: "border-emerald-200",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          icon: CircleX,
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };
      default:
        return {
          label: status,
          icon: CircleAlert,
          bg: "bg-slate-50",
          text: "text-slate-700",
          border: "border-slate-200",
        };
    }
  };

  const getDateIcon = (date) => {
    const today = new Date().toISOString().split("T")[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    
    if (date === today) return { icon: CalendarCheck, color: "text-emerald-500" };
    if (date === tomorrow) return { icon: CalendarClock, color: "text-amber-500" };
    if (date < today) return { icon: CalendarX, color: "text-slate-400" };
    return { icon: CalendarDays, color: "text-teal-500" };
  };

  const columns = [
    {
      header: "Temporal Marker",
      accessor: "date",
      cell: (row) => {
        const DateIcon = getDateIcon(row.date.split("T")[0]).icon;
        const iconColor = getDateIcon(row.date.split("T")[0]).color;
        return (
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center">
                <DateIcon className={`h-5 w-5 ${iconColor}`} />
              </div>
            </div>
            <div>
              <span className="block text-sm font-black text-slate-800 tracking-tight">
                {new Date(row.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-[10px] font-black text-teal-600 uppercase tracking-widest leading-none mt-1 block">
                Slot: {row.timeSlot}
              </span>
            </div>
          </div>
        );
      },
    },
    {
      header: "Lead Practitioner",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="text-sm font-bold text-slate-700">
            Dr. {row.doctorId?.name || "Pending Assignment"}
          </span>
        </div>
      ),
    },
    {
      header: "Clinical Context",
      accessor: "reason",
      cell: (row) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <Stethoscope className="h-4 w-4 flex-shrink-0 text-teal-600" />
          <span className="text-sm font-semibold text-slate-600 truncate block">
            {row.reason || "Routine Surveillance"}
          </span>
        </div>
      ),
    },
    {
      header: "Session Status",
      cell: (row) => {
        const config = getStatusConfig(row.status);
        const StatusIcon = config.icon;
        return (
          <span
            className={`flex items-center gap-1.5 w-fit px-3 py-1.5 text-[10px] uppercase font-black tracking-wider rounded-xl border shadow-sm ${config.bg} ${config.text} ${config.border}`}
          >
            <StatusIcon className="h-3 w-3" />
            {config.label}
          </span>
        );
      },
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } },
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
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <CalendarRange className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical<span className="text-teal-500">Timeline</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1 text-sm">
            <Activity className="h-4 w-4 text-teal-500" />
            A verifiable audit of all medical consultations and scheduled cycles.
          </p>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl border bg-teal-50 border-teal-100">
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-teal-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2 w-2 rounded-full bg-teal-500 opacity-50"
              />
            </div>
            <span className="text-xs font-bold text-teal-600">Master Archive Sync</span>
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
          { label: "Total Bookings", value: appointments.length, icon: CalendarRange, color: "text-blue-600" },
          { label: "Pending", value: appointments.filter(a => a.status === "pending").length, icon: Clock, color: "text-amber-600" },
          { label: "Completed", value: appointments.filter(a => a.status === "completed").length, icon: CheckCheck, color: "text-emerald-600" },
          { label: "Cancelled", value: appointments.filter(a => a.status === "cancelled").length, icon: CircleX, color: "text-red-600" },
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
                  <p className="text-xs text-slate-500 mb-1 font-bold uppercase tracking-wider">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search encounters by context or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 w-full md:w-80 transition-all"
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
        </div>
      </motion.div>

      {/* Appointments Table */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
      >
        <DataTable
          columns={columns}
          data={filteredAppointments}
          placeholder="No appointments found."
        />
      </motion.div>
    </motion.div>
  );
};

export default AppointmentHistory;
