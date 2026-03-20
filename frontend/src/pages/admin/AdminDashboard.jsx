import {
  useGetAnalyticsQuery,
  useUpdateSettingsMutation,
} from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

import {
  Stethoscope,
  Users,
  UserRound,
  CalendarHeart,
  Crown,
  Activity,
  Settings,
  X,
  Check,
  Calendar,
  BarChart3,
  Zap,
  FileText,
  UserPlus,
  CheckCircle2,
  Bell,
  RefreshCw,
} from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

/* ✅ CLEAN RECHARTS IMPORT */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";

import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const AdminDashboard = () => {
  const { data, isLoading, refetch } = useGetAnalyticsQuery();
  const [updateSettings] = useUpdateSettingsMutation();
  const [selectedTimeframe, setSelectedTimeframe] = useState("month");
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [settingsData, setSettingsData] = useState({
    clinicName: "City Medical Center",
    email: "admin@clinicos.com",
    phone: "+1 (555) 123-4567",
    address: "123 Healthcare Ave, Medical District",
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
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
              <Activity
                className="h-6 w-6 animate-pulse"
                style={{ color: primaryTeal }}
              />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
            Loading Dashboard...
          </p>
        </div>
      </div>
    );
  }

  const { overview, business } = data || {};

  const chartData = [
    { name: "Doctors", value: overview?.doctors || 0, color: "#00BBA7" },
    {
      name: "Receptionists",
      value: overview?.receptionists || 0,
      color: "#6366f1",
    },
    { name: "Patients", value: overview?.totalPatients || 0, color: "#f59e0b" },
    {
      name: "Appointments",
      value: overview?.totalAppointments || 0,
      color: "#10b981",
    },
    {
      name: "Prescriptions",
      value: overview?.totalPrescriptions || 0,
      color: "#3b82f6",
    },
  ];

  const monthlyData = [
    { month: "Jan", appointments: 45, patients: 32, revenue: 12500 },
    { month: "Feb", appointments: 52, patients: 38, revenue: 14200 },
    { month: "Mar", appointments: 48, patients: 35, revenue: 13100 },
    { month: "Apr", appointments: 58, patients: 42, revenue: 15800 },
    { month: "May", appointments: 62, patients: 45, revenue: 17200 },
    { month: "Jun", appointments: 55, patients: 40, revenue: 15100 },
  ];

  const notifications = [
    { id: 1, title: "New doctor registration", time: "5 min ago", read: false },
    { id: 2, title: "Monthly report ready", time: "1 hour ago", read: false },
    {
      id: 3,
      title: "System update completed",
      time: "3 hours ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSaveSettings = async () => {
    try {
      await updateSettings(settingsData).unwrap();
      toast.success("Settings updated successfully", {
        icon: "✅",
        description: "Clinic information synchronized",
      });
      setShowSettings(false);
    } catch (err) {
      toast.error("Failed to update settings", {
        icon: "❌",
      });
    }
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
              <Activity className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinic<span style={{ color: primaryTeal }}>Overview</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <BarChart3 className="h-4 w-4" style={{ color: primaryTeal }} />
            Operational intelligence and medical staff management
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors relative"
            >
              <Bell className="h-4 w-4 text-slate-600" />
              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: primaryTeal }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-xl border border-slate-200 shadow-xl z-50 overflow-hidden"
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    <button className="text-xs text-teal-600 hover:text-teal-700">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notif) => (
                      <div
                        key={notif.id}
                        className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`h-2 w-2 mt-2 rounded-full ${notif.read ? "bg-slate-300" : ""}`}
                            style={
                              !notif.read
                                ? { backgroundColor: primaryTeal }
                                : {}
                            }
                          />
                          <div>
                            <p className="text-sm font-medium text-slate-800">
                              {notif.title}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {notif.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Settings */}
          <button
            onClick={() => setShowSettings(true)}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <Settings className="h-4 w-4 text-slate-600" />
          </button>

          {/* Refresh */}
          <button
            onClick={() => refetch()}
            className="h-10 w-10 rounded-xl border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Medical Staff"
          value={overview?.doctors || 0}
          icon={<Stethoscope className="h-6 w-6" />}
          description="Total practitioners"
          trend="8%"
          trendUp={true}
          color={primaryTeal}
        />
        <StatCard
          title="Front Desk"
          value={overview?.receptionists || 0}
          icon={<Users className="h-6 w-6" />}
          description="Active receptionists"
          color={primaryTeal}
        />
        <StatCard
          title="Patient Base"
          value={overview?.totalPatients || 0}
          icon={<UserRound className="h-6 w-6" />}
          description="Total registered"
          trend="12%"
          trendUp={true}
          color={primaryTeal}
        />
        <StatCard
          title="Daily Traffic"
          value={overview?.todayAppointments || 0}
          icon={<CalendarHeart className="h-6 w-6" />}
          description="Appointments today"
          trend="New"
          trendUp={true}
          color={primaryTeal}
        />
      </div>

      {/* Timeframe Selector */}
      <div className="flex items-center justify-between bg-white rounded-xl border border-slate-100 p-2 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span className="text-sm font-medium text-slate-600">
            Analytics Overview
          </span>
        </div>
        <div className="flex items-center gap-1">
          {["week", "month", "quarter", "year"].map((tf) => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-4 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all ${
                selectedTimeframe === tf
                  ? "text-white"
                  : "text-slate-500 hover:bg-slate-100"
              }`}
              style={
                selectedTimeframe === tf ? { backgroundColor: primaryTeal } : {}
              }
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div
                className="h-8 w-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: tealLight }}
              >
                <BarChart3 className="h-4 w-4" style={{ color: primaryTeal }} />
              </div>
              <h3 className="font-bold text-slate-800">
                Resource Distribution
              </h3>
            </div>
            <select
              className="h-8 px-3 rounded-lg border border-slate-200 text-xs outline-none"
              style={{ focusBorderColor: primaryTeal }}
            >
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="8 8"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 500 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc", radius: 10 }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    fontWeight: 500,
                    padding: "8px 12px",
                  }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Trends Line Chart */}
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-6">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: tealLight }}
            >
              <LineChart className="h-4 w-4" style={{ color: primaryTeal }} />
            </div>
            <h3 className="font-bold text-slate-800">Monthly Trends</h3>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={monthlyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="8 8"
                  stroke="#f1f5f9"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="appointments"
                  stroke={primaryTeal}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="patients"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subscription & Quick Actions Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Subscription Card */}
        <div
          className="lg:col-span-1 rounded-xl p-6 text-white shadow-lg relative overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${primaryTeal}, ${tealHover})`,
          }}
        >
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Crown className="h-32 w-32 text-white" />
          </div>

          <div className="relative z-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-bold uppercase tracking-wider mb-4">
              {business?.plan || "FREE"} TIER
            </div>

            <h3 className="text-2xl font-bold mb-2">Premium Management</h3>
            <p className="text-white/80 text-sm mb-6">
              {business?.plan === "PRO"
                ? "Your clinic is using our advanced infrastructure with Gemini AI active."
                : "Unlock the full power of ClinicOS including advanced AI diagnostics."}
            </p>

            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-white/90" />
                <span>24/7 Priority Support</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-white/90" />
                <span>Advanced Analytics</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-white/90" />
                <span>Gemini AI Integration</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/20">
              <div>
                <p className="text-[10px] font-bold text-white/60 uppercase tracking-wider">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold">
                  ${business?.revenue || "0.00"}
                </p>
              </div>
              <Link
                to="/admin/subscription"
                className="px-5 py-2 bg-white text-teal-600 rounded-lg text-xs font-bold hover:bg-opacity-90 transition-all"
              >
                {business?.plan === "PRO" ? "Manage" : "Upgrade"}
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-100 shadow-sm p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4" style={{ color: primaryTeal }} />
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                to: "/admin/doctors",
                title: "Doctors",
                desc: "Medical Staff Registry",
                icon: Stethoscope,
                color: primaryTeal,
              },
              {
                to: "/admin/receptionists",
                title: "Front Desk",
                desc: "Receptionist Management",
                icon: Users,
                color: "#6366f1",
              },
              {
                to: "/admin/subscription",
                title: "Billing",
                desc: "Plan & Billing Settings",
                icon: Crown,
                color: "#f59e0b",
              },
            ].map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    to={action.to}
                    className="p-4 rounded-xl border border-slate-100 hover:shadow-md transition-all block"
                  >
                    <div
                      className="h-10 w-10 rounded-lg flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${action.color}20` }}
                    >
                      <Icon
                        className="h-5 w-5"
                        style={{ color: action.color }}
                      />
                    </div>
                    <p className="font-bold text-slate-800 mb-1">
                      {action.title}
                    </p>
                    <p className="text-xs text-slate-500">{action.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Recent Activity */}
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-sm font-medium text-slate-600 mb-3">
              Recent Activity
            </h4>
            <div className="space-y-3">
              {[
                {
                  action: "New patient registered",
                  time: "5 min ago",
                  icon: UserPlus,
                },
                {
                  action: "Appointment completed",
                  time: "15 min ago",
                  icon: CheckCircle2,
                },
                {
                  action: "Monthly report generated",
                  time: "1 hour ago",
                  icon: FileText,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-slate-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-slate-700">{item.action}</p>
                      <p className="text-xs text-slate-400">{item.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-lg w-full shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className="h-10 w-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: tealLight }}
                  >
                    <Settings
                      className="h-5 w-5"
                      style={{ color: primaryTeal }}
                    />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    Clinic Settings
                  </h3>
                </div>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-slate-500" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Clinic Name
                  </label>
                  <input
                    type="text"
                    value={settingsData.clinicName}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        clinicName: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
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

                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsData.email}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        email: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={settingsData.phone}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        phone: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1 block">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settingsData.address}
                    onChange={(e) =>
                      setSettingsData({
                        ...settingsData,
                        address: e.target.value,
                      })
                    }
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                    style={{
                      focusBorderColor: primaryTeal,
                      focusRing: `0 0 0 3px ${tealGlow}`,
                    }}
                  />
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-2 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  className="px-5 py-2 text-white rounded-lg text-sm font-bold transition-all"
                  style={{
                    backgroundColor: primaryTeal,
                    hoverBackground: tealHover,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = tealHover)
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = primaryTeal)
                  }
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminDashboard;
