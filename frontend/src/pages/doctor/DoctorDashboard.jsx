import { useState, useEffect } from "react";
import { useListAppointmentsQuery } from "@/features/appointments/appointmentApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Users,
  Activity,
  BrainCircuit,
  CalendarRange,
  ChevronRight,
  Clock,
  UserRound,
  Stethoscope,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Hourglass,
  Zap,
  Pill,
  Calendar,
  RefreshCw,
  Filter,
  Search,
  ChevronDown,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
  no_show: "#94a3b8",
};

const DoctorDashboard = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("week");
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("appointments");
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: appointments,
    isLoading,
    refetch,
  } = useListAppointmentsQuery({});
  const { data: patients } = useListPatientsQuery();

  // Mock data for charts - in real app, this would come from API
  const weeklyData = [
    { day: "Mon", appointments: 8, completed: 6, cancelled: 1, pending: 1 },
    { day: "Tue", appointments: 12, completed: 9, cancelled: 2, pending: 1 },
    { day: "Wed", appointments: 10, completed: 8, cancelled: 1, pending: 1 },
    { day: "Thu", appointments: 14, completed: 11, cancelled: 2, pending: 1 },
    { day: "Fri", appointments: 9, completed: 7, cancelled: 1, pending: 1 },
    { day: "Sat", appointments: 5, completed: 4, cancelled: 1, pending: 0 },
    { day: "Sun", appointments: 3, completed: 3, cancelled: 0, pending: 0 },
  ];

  const monthlyData = [
    {
      week: "Week 1",
      appointments: 45,
      completed: 38,
      cancelled: 4,
      pending: 3,
    },
    {
      week: "Week 2",
      appointments: 52,
      completed: 44,
      cancelled: 5,
      pending: 3,
    },
    {
      week: "Week 3",
      appointments: 48,
      completed: 41,
      cancelled: 4,
      pending: 3,
    },
    {
      week: "Week 4",
      appointments: 55,
      completed: 47,
      cancelled: 5,
      pending: 3,
    },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className="h-16 w-16 border-4 rounded-full animate-spin"
              style={{
                borderColor: `${primaryTeal}20`,
                borderTopColor: primaryTeal,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Stethoscope
                className="h-6 w-6 animate-pulse"
                style={{ color: primaryTeal }}
              />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
            Loading Medical Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const apptList = appointments || [];
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentHour = now.getHours();

  const todaysAppointments = apptList.filter(
    (app) => app.date?.split("T")[0] === today,
  );

  const pendingAppointments = apptList.filter(
    (app) => app.status === "pending",
  );

  const upcomingAppointments = todaysAppointments.filter((app) => {
    const hour = parseInt(app.timeSlot?.split(":")[0] || "0");
    return (
      hour >= currentHour &&
      app.status !== "completed" &&
      app.status !== "cancelled"
    );
  });

  const completedToday = todaysAppointments.filter(
    (app) => app.status === "completed",
  ).length;
  const cancelledToday = todaysAppointments.filter(
    (app) => app.status === "cancelled",
  ).length;

  // Build pie chart data from appointment statuses
  const statusCounts = apptList.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(statusCounts).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1).replace("_", " "),
    value,
    color: STATUS_COLORS[name] || "#94a3b8",
  }));

  // Calculate statistics
  const totalPatients = patients?.length || 0;
  const completionRate =
    apptList.length > 0
      ? Math.round(((statusCounts["completed"] || 0) / apptList.length) * 100)
      : 0;

  const averagePerDay =
    apptList.length > 30 ? Math.round(apptList.length / 30) : apptList.length;

  const getGreeting = () => {
    const hour = currentHour;
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${primaryTeal}, #00BBA7)`,
              }}
            >
              <Stethoscope className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Medical<span style={{ color: primaryTeal }}>Dashboard</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                {getGreeting()}, Dr.{" "}
                {apptList[0]?.doctorId?.name?.split(" ")[0] || "Smith"}
              </p>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="flex items-center gap-4">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: tealLight,
              borderColor: primaryTeal,
            }}
          >
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500/50"
              />
            </div>
            <span className="text-xs font-bold" style={{ color: primaryTeal }}>
              Live Updates
            </span>
          </div>

          <Link
            to="/doctor/ai"
            className="h-10 px-4 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all group"
            style={{
              background: `linear-gradient(135deg, ${primaryTeal}, #00BBA7)`,
              boxShadow: `0 4px 6px ${tealGlow}`,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <BrainCircuit className="h-4 w-4 group-hover:rotate-12 transition-transform" />
            AI Diagnostics
            <Sparkles className="h-3 w-3" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard
          title="Today's Patients"
          value={todaysAppointments.length}
          icon={<Users className="h-6 w-6" />}
          description={`${upcomingAppointments.length} upcoming, ${completedToday} completed`}
          trend={`${completedToday} completed`}
          trendUp={completedToday > 0}
          color={primaryTeal}
        />
        <StatCard
          title="Pending Queue"
          value={pendingAppointments.length}
          icon={<Hourglass className="h-6 w-6" />}
          description="Awaiting attention"
          trend={`${upcomingAppointments.length} upcoming`}
          trendUp={pendingAppointments.length > 0}
          color={primaryTeal}
        />
        <StatCard
          title="Completion Rate"
          value={`${completionRate}%`}
          icon={<Activity className="h-6 w-6" />}
          description="Success rate"
          trend={`${statusCounts["completed"] || 0} total`}
          trendUp={completionRate > 70}
          color={primaryTeal}
        />
        <StatCard
          title="Total Patients"
          value={totalPatients}
          icon={<UserRound className="h-6 w-6" />}
          description="Active patients"
          trend={`${averagePerDay}/day avg`}
          trendUp={true}
          color={primaryTeal}
        />
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
                placeholder="Search appointments, patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-sm outline-none w-64 transition-all"
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
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
            >
              <RefreshCw className="h-4 w-4 text-slate-600" />
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
              <div className="flex gap-4 pt-4 mt-4 border-t border-slate-100">
                <div className="w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Status
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  >
                    <option>All Appointments</option>
                    <option>Pending</option>
                    <option>Completed</option>
                    <option>Cancelled</option>
                  </select>
                </div>
                <div className="w-48">
                  <label className="text-[10px] font-bold uppercase text-slate-500 mb-2 block">
                    Sort By
                  </label>
                  <select
                    className="w-full h-10 px-3 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  >
                    <option>Date</option>
                    <option>Patient Name</option>
                    <option>Status</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Timeframe Selector */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-3 shadow-sm"
      >
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" style={{ color: primaryTeal }} />
          <span className="text-sm font-medium text-slate-600">
            Analytics Overview
          </span>
        </div>
        <div className="flex items-center gap-2">
          {["week", "month", "year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedTimeframe === tf
                  ? "text-white shadow-sm"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
              style={
                selectedTimeframe === tf ? { backgroundColor: primaryTeal } : {}
              }
            >
              {tf}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${primaryTeal}, #00BBA7)`,
                  }}
                >
                  <CalendarRange className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-800">
                    Today's Schedule
                  </h3>
                  <p className="text-xs text-slate-500">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#f59e0b" }}
                    />
                    <span className="text-[10px] text-slate-500">Pending</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className="h-2 w-2 rounded-full"
                      style={{ backgroundColor: "#10b981" }}
                    />
                    <span className="text-[10px] text-slate-500">
                      Completed
                    </span>
                  </div>
                </div>
                <Link
                  to="/doctor/appointments"
                  className="px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors"
                  style={{
                    backgroundColor: tealLight,
                    color: primaryTeal,
                  }}
                >
                  Full Schedule
                </Link>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {todaysAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div
                    className="h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: tealLight }}
                  >
                    <CalendarRange
                      className="h-8 w-8"
                      style={{ color: primaryTeal }}
                    />
                  </div>
                  <p className="text-slate-500 font-medium">
                    No Appointments Today
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Enjoy your day off or review patient records
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {todaysAppointments.slice(0, 5).map((app, index) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ x: 5 }}
                      className="group"
                    >
                      <Link
                        to={`/doctor/appointments/${app._id}`}
                        className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-3">
                          {/* Time Badge */}
                          <div className="w-16 text-center">
                            <span className="text-xs font-bold text-slate-700">
                              {app.timeSlot}
                            </span>
                          </div>

                          {/* Patient Info */}
                          <div className="flex items-center gap-2">
                            <div
                              className="h-8 w-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: primaryTeal }}
                            >
                              {app.patientId?.name?.charAt(0) || "P"}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-sm group-hover:text-teal-700 transition-colors">
                                {app.patientId?.name || "Patient Name"}
                              </h4>
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                  <Stethoscope className="h-2.5 w-2.5" />
                                  {app.reason || "Consultation"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <div
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase flex items-center gap-1 ${
                            app.status === "pending"
                              ? "bg-amber-50 text-amber-700"
                              : app.status === "completed"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {app.status === "pending" && (
                            <Clock className="h-2.5 w-2.5" />
                          )}
                          {app.status === "completed" && (
                            <CheckCircle2 className="h-2.5 w-2.5" />
                          )}
                          {app.status}
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {todaysAppointments.length > 5 && (
                <div className="pt-2 text-center">
                  <Link
                    to="/doctor/appointments"
                    className="inline-flex items-center gap-1 text-xs font-medium transition-colors"
                    style={{ color: primaryTeal }}
                  >
                    View all {todaysAppointments.length} appointments
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Weekly Trends Chart */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div
                  className="h-8 w-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: tealLight }}
                >
                  <TrendingUp
                    className="h-4 w-4"
                    style={{ color: primaryTeal }}
                  />
                </div>
                <h3 className="text-sm font-bold text-slate-800">
                  Weekly Trends
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: primaryTeal }}
                  />
                  <span className="text-[9px] text-slate-500">
                    Appointments
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#10b981" }}
                  />
                  <span className="text-[9px] text-slate-500">Completed</span>
                </div>
              </div>
            </div>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="day"
                    tick={{ fontSize: 10, fill: "#64748b" }}
                  />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      padding: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar
                    dataKey="appointments"
                    fill={primaryTeal}
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="completed"
                    fill="#10b981"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Right Column */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Appointment Status Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
              <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                <PieChart className="h-4 w-4" style={{ color: primaryTeal }} />
                Case Distribution
              </h3>

              <div className="h-[180px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val, name) => [val, name]}
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        fontWeight: "bold",
                        fontSize: 10,
                        padding: 8,
                        backgroundColor: "white",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {pieData.map((item, index) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-[10px] text-slate-600">
                      {item.name}
                    </span>
                    <span className="text-[10px] font-bold text-slate-700 ml-auto">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Patient Demographics Card */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: primaryTeal }} />
              Patient Demographics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-600">Total Patients</span>
                <span
                  className="text-lg font-bold"
                  style={{ color: primaryTeal }}
                >
                  {totalPatients}
                </span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-600">Average Age</span>
                <span className="text-lg font-bold text-indigo-600">42</span>
              </div>
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                <span className="text-xs text-slate-600">Gender Ratio</span>
                <span className="text-xs font-bold text-slate-700">
                  52% F / 48% M
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Quick Actions
            </h3>
            <div className="space-y-2">
              {[
                {
                  to: "/doctor/prescriptions/new",
                  icon: Pill,
                  title: "New Prescription",
                  desc: "Create digital prescription",
                },
                {
                  to: "/doctor/ai",
                  icon: BrainCircuit,
                  title: "AI Diagnosis",
                  desc: "Get AI-powered insights",
                },
                {
                  to: "/doctor/patients/new",
                  icon: UserRound,
                  title: "New Patient",
                  desc: "Register patient",
                },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <motion.div
                    key={action.title}
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link
                      to={action.to}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors group"
                    >
                      <div
                        className="h-8 w-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: tealLight }}
                      >
                        <Icon
                          className="h-4 w-4"
                          style={{ color: primaryTeal }}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 text-sm group-hover:text-teal-700 transition-colors">
                          {action.title}
                        </p>
                        <p className="text-[10px] text-slate-500">
                          {action.desc}
                        </p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-slate-400" />
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DoctorDashboard;
