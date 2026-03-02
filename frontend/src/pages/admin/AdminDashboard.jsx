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
} from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { toast } from "sonner";

const AdminDashboard = () => {
  const { data, isLoading } = useGetAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const { overview, business } = data || {};

  const chartData = [
    { name: "Doctors", value: overview?.doctors || 0, color: "#0d9488" },
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

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinic Overview"
          description="Operational intelligence and medical staff management."
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Medical Staff"
          value={overview?.doctors || 0}
          icon={<Stethoscope className="h-6 w-6" />}
          description="Total practitioners"
          trend="8%"
          trendUp={true}
        />
        <StatCard
          title="Front Desk"
          value={overview?.receptionists || 0}
          icon={<Users className="h-6 w-6" />}
          description="Active receptionists"
        />
        <StatCard
          title="Patient Base"
          value={overview?.totalPatients || 0}
          icon={<UserRound className="h-6 w-6" />}
          description="Total registered"
          trend="12%"
          trendUp={true}
        />
        <StatCard
          title="Daily Traffic"
          value={overview?.todayAppointments || 0}
          icon={<CalendarHeart className="h-6 w-6" />}
          description="Appointments today"
          trend="New"
          trendUp={true}
        />
      </div>

      {/* Analytics & Subscription Section */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Recharts Analytics Bar Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl premium-shadow border border-slate-200/60 p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
              <Activity className="h-5 w-5 text-teal-600" />
              Resource Distribution
            </h3>
            <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1.5 focus:ring-0">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-[320px] w-full">
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
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#94a3b8", fontWeight: 700 }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc", radius: 10 }}
                  contentStyle={{
                    borderRadius: "16px",
                    border: "none",
                    boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                    fontSize: "12px",
                    fontWeight: "bold",
                    padding: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={40}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subscription Info */}
        <div className="bg-slate-900 rounded-3xl p-8 relative overflow-hidden flex flex-col shadow-2xl shadow-slate-900/40">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Crown className="h-32 w-32 text-white" />
          </div>

          <div className="relative z-10 flex-1">
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 ${
                business?.plan === "PRO"
                  ? "bg-amber-400 text-slate-900"
                  : "bg-teal-500 text-white"
              }`}
            >
              {business?.plan || "FREE"} TIER
            </div>
            <h3 className="text-3xl font-black text-white tracking-tighter mb-4">
              Premium <br />
              Management
            </h3>
            <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
              {business?.plan === "PRO"
                ? "Your clinic is using our advanced infrastructure with Gemini AI active."
                : "Unlock the full power of ClinicOS including advanced AI diagnostics."}
            </p>
          </div>

          <div className="relative z-10 pt-6 border-t border-white/10 mt-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Revenue (Mock)
                </p>
                <p className="text-3xl font-black text-white flex items-center">
                  <span className="text-teal-400 text-sm mr-1">$</span>
                  {business?.revenue || "0.00"}
                </p>
              </div>
              <Link
                to="/admin/subscription"
                className="h-12 px-6 bg-white text-slate-900 text-xs font-black uppercase tracking-widest rounded-2xl flex items-center justify-center hover:bg-teal-400 hover:text-white transition-all duration-300"
              >
                Upgrade
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="p-8 bg-white rounded-3xl premium-shadow border border-slate-200/60">
        <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">
          Staff Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              to: "/admin/doctors",
              title: "Doctors",
              desc: "Medical Staff Registry",
              icon: <Stethoscope />,
              color: "bg-teal-50 text-teal-600",
            },
            {
              to: "/admin/receptionists",
              title: "Front Desk",
              desc: "Receptionist Management",
              icon: <Users />,
              color: "bg-indigo-50 text-indigo-600",
            },
            {
              to: "/admin/subscription",
              title: "Billing",
              desc: "Plan & Billing Settings",
              icon: <Crown />,
              color: "bg-amber-50 text-amber-600",
            },
          ].map((action, i) => (
            <Link
              key={i}
              to={action.to}
              className="p-6 rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all duration-500 group flex items-center gap-5"
            >
              <div
                className={`h-14 w-14 ${action.color} rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 shadow-sm`}
              >
                {action.icon}
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg group-hover:text-teal-900 transition-colors">
                  {action.title}
                </p>
                <p className="text-xs font-semibold text-slate-400">
                  {action.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
