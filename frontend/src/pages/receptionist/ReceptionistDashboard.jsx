import { useState, useEffect } from "react";
import { useListAppointmentsQuery } from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Users,
  CalendarCheck,
  UserPlus,
  Clock,
  Activity,
  ArrowRight,
  Stethoscope,
  HeartPulse,
  Shield,
  Sparkles,
  ChevronRight,
  Bell,
  Timer,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  UserRound,
  Syringe,
  Pill,
  Scan,
  Fingerprint,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ReceptionistDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedView, setSelectedView] = useState("today");
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: appointments, isLoading } = useListAppointmentsQuery(
    undefined,
    {
      pollingInterval: 15000, // Refresh every 15 seconds for 'Live' feel
    },
  );

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Calculate 'today' in local time YYYY-MM-DD
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const todaysAppointments =
    appointments?.filter((app) => app.date.split("T")[0] === today) || [];
  const pendingAppointments = todaysAppointments.filter(
    (app) => app.status === "pending",
  );
  const completedAppointments = todaysAppointments.filter(
    (app) => app.status === "completed",
  );
  const cancelledAppointments = todaysAppointments.filter(
    (app) => app.status === "cancelled",
  );

  // Calculate wait times (mock data - in real app would come from API)
  const averageWaitTime = pendingAppointments.length * 5; // 5 mins per patient
  const nextAvailableSlot = pendingAppointments[0]?.timeSlot || "12:00 PM";

  // Sort appointments by time
  const sortedAppointments = [...todaysAppointments].sort((a, b) => {
    const timeA = a.timeSlot?.split(":")[0] || "0";
    const timeB = b.timeSlot?.split(":")[0] || "0";
    return parseInt(timeA) - parseInt(timeB);
  });

  const quickActions = [
    {
      to: "/receptionist/patients/new",
      icon: UserPlus,
      title: "New Registration",
      desc: "Create medical record",
      color: "from-teal-500 to-emerald-500",
      bg: "bg-teal-50",
      shortcut: "⌘N",
    },
    {
      to: "/receptionist/appointments/new",
      icon: CalendarCheck,
      title: "Book Appointment",
      desc: "Schedule doctor visit",
      color: "from-indigo-500 to-purple-500",
      bg: "bg-indigo-50",
      shortcut: "⌘B",
    },
    {
      to: "/receptionist/patients",
      icon: Users,
      title: "Patient Directory",
      desc: "Access records",
      color: "from-amber-500 to-orange-500",
      bg: "bg-amber-50",
      shortcut: "⌘P",
    },
    {
      to: "/receptionist/schedule",
      icon: Calendar,
      title: "Full Schedule",
      desc: "View all appointments",
      color: "from-purple-500 to-pink-500",
      bg: "bg-purple-50",
      shortcut: "⌘S",
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
      className="max-w-7xl mx-auto space-y-8 pb-10"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Reception<span className="text-teal-600">Dashboard</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Clock className="h-4 w-4" />
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            • Today's Date:{" "}
            {now.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500/50"
              />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Live Reception
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <Link
            to="/receptionist/patients/new"
            className="px-5 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:from-teal-600 hover:to-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 group"
          >
            <UserPlus className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            New Registration
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard
          title="Today's Bookings"
          value={todaysAppointments.length}
          icon={<CalendarCheck className="h-6 w-6" />}
          description="Total appointments today"
          trend={`${pendingAppointments.length} pending`}
          trendUp={pendingAppointments.length > 0}
          color="from-teal-500 to-emerald-500"
        />
        <StatCard
          title="Waiting Queue"
          value={pendingAppointments.length}
          icon={<Clock className="h-6 w-6" />}
          description="Patients waiting"
          trend={
            pendingAppointments.length > 0
              ? `Est. ${averageWaitTime} min wait`
              : "No wait"
          }
          trendUp={pendingAppointments.length > 0}
          color="from-amber-500 to-orange-500"
        />
        <StatCard
          title="Completed"
          value={completedAppointments.length}
          icon={<CheckCircle2 className="h-6 w-6" />}
          description="Patients seen today"
          trend={`${Math.round((completedAppointments.length / (todaysAppointments.length || 1)) * 100)}% completion`}
          trendUp={true}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Next Available"
          value={nextAvailableSlot}
          icon={<Timer className="h-6 w-6" />}
          description="Next appointment slot"
          trend={pendingAppointments.length > 0 ? "Booked" : "Available"}
          trendUp={pendingAppointments.length === 0}
          color="from-purple-500 to-pink-500"
        />
      </motion.div>

      {/* Quick Actions Panel */}
      <motion.div variants={itemVariants} className="relative">
        <button
          onClick={() => setShowQuickActions(!showQuickActions)}
          className="lg:hidden w-full mb-4 p-4 bg-white rounded-2xl border border-slate-200 flex items-center justify-between"
        >
          <span className="font-bold text-slate-700">Quick Actions</span>
          <ChevronRight
            className={`h-5 w-5 transition-transform ${showQuickActions ? "rotate-90" : ""}`}
          />
        </button>

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ${!showQuickActions ? "hidden lg:grid" : "grid"}`}
        >
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.div
                key={action.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
               
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Queue Status */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          {/* Schedule Insights Card */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    Real-time Queue Status
                  </h3>
                  <p className="text-xs text-slate-500">
                    Today's appointments overview
                  </p>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex gap-2">
                {["today", "upcoming"].map((view) => (
                  <button
                    key={view}
                    onClick={() => setSelectedView(view)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      selectedView === view
                        ? "bg-gradient-to-r from-teal-500 to-indigo-500 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {view}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 space-y-4">
              {sortedAppointments.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CalendarCheck className="h-12 w-12 text-slate-300" />
                  </div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">
                    No appointments scheduled
                  </p>
                  <p className="text-xs text-slate-300 mt-2">
                    Today's schedule is clear
                  </p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {sortedAppointments.slice(0, 6).map((app, index) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                      className="group"
                    >
                      <Link
                        to={`/receptionist/patients`}
                        className="flex flex-wrap items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          {/* Time Badge */}
                          <div className="w-20 text-center">
                            <span className="text-sm font-black text-teal-700 bg-teal-50 px-3 py-2 rounded-xl border border-teal-100">
                              {app.timeSlot || "--:--"}
                            </span>
                          </div>

                          {/* Patient Info */}
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                              {app.patientId?.name?.charAt(0) || "P"}
                            </div>
                            <div>
                              <h4 className="font-black text-slate-800 group-hover:text-teal-700 transition-colors">
                                {app.patientId?.name || "Patient Name"}
                              </h4>
                              <div className="flex items-center gap-3 mt-1">
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Stethoscope className="h-3 w-3" />
                                  Dr.{" "}
                                  {app.doctorId?.name?.split(" ")[0] ||
                                    "Doctor"}
                                </div>
                                {app.patientId?.phone && (
                                  <>
                                    <span className="w-1 h-1 rounded-full bg-slate-300" />
                                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                      <Phone className="h-3 w-3" />
                                      {app.patientId.phone}
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                              app.status === "pending"
                                ? "bg-amber-50 text-amber-700 border-amber-200"
                                : app.status === "completed"
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {app.status === "pending" && (
                              <Clock className="h-3 w-3" />
                            )}
                            {app.status === "completed" && (
                              <CheckCircle2 className="h-3 w-3" />
                            )}
                            {app.status === "cancelled" && (
                              <XCircle className="h-3 w-3" />
                            )}
                            {app.status}
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-all" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {sortedAppointments.length > 6 && (
                <div className="pt-4 text-center">
                  <Link
                    to="/receptionist/schedule"
                    className="inline-flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
                  >
                    View all {sortedAppointments.length} appointments
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Insights & Quick Stats */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Today's Summary Card */}
          <div className="bg-gradient-to-br from-teal-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl">
            <h3 className="text-sm font-black uppercase tracking-wider mb-4 opacity-90 flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Today's Summary
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-teal-100">Total Patients</span>
                <span className="text-3xl font-black">
                  {todaysAppointments.length}
                </span>
              </div>
              <div className="h-px bg-white/20" />
              <div className="flex justify-between items-center">
                <span className="text-teal-100">Completed</span>
                <span className="text-2xl font-bold text-green-300">
                  {completedAppointments.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-100">In Queue</span>
                <span className="text-2xl font-bold text-amber-300">
                  {pendingAppointments.length}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-teal-100">Cancelled</span>
                <span className="text-2xl font-bold text-red-300">
                  {cancelledAppointments.length}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-xs text-teal-100 mb-2">
                <span>Progress</span>
                <span>
                  {Math.round(
                    (completedAppointments.length /
                      (todaysAppointments.length || 1)) *
                      100,
                  )}
                  %
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(completedAppointments.length / (todaysAppointments.length || 1)) * 100}%`,
                  }}
                  className="h-full bg-white rounded-full"
                />
              </div>
            </div>
          </div>

        
         
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReceptionistDashboard;
