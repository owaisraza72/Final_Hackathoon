import { useGetAnalyticsQuery } from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Stethoscope,
  Users,
  UserRound,
  CalendarHeart,
  DollarSign,
  Crown,
} from "lucide-react";
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

const AdminDashboard = () => {
  const { data, isLoading } = useGetAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const { overview, business, clinicName } = data || {};

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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <PageHeader
        title={`${clinicName || "Clinic"} Dashboard`}
        description="Overview of your clinic's operations and team."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Doctors"
          value={overview?.doctors || 0}
          icon={<Stethoscope className="h-6 w-6" />}
        />
        <StatCard
          title="Receptionists"
          value={overview?.receptionists || 0}
          icon={<Users className="h-6 w-6" />}
        />
        <StatCard
          title="Total Patients"
          value={overview?.totalPatients || 0}
          icon={<UserRound className="h-6 w-6" />}
        />
        <StatCard
          title="Today's Appointments"
          value={overview?.todayAppointments || 0}
          icon={<CalendarHeart className="h-6 w-6" />}
          trend="Today"
          trendUp={true}
        />
      </div>

      {/* Recharts Analytics Bar Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-6">
          📊 Clinic Overview (Analytics)
        </h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748b" }}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid #e2e8f0",
                fontSize: "13px",
              }}
            />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom Area: Subscription & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscription Info */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Crown
                className={`h-6 w-6 ${business?.plan === "PRO" ? "text-amber-500" : "text-slate-400"}`}
              />
              <h3 className="text-xl font-bold text-slate-800">
                {business?.plan || "FREE"} Plan
              </h3>
            </div>
            <p className="text-slate-500 mb-6">
              You are currently using the {business?.plan} tier.
              {business?.plan === "FREE" &&
                " Upgrade to PRO to unlock Gemini AI assistant and unlimited patients."}
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
            <div>
              <p className="text-sm text-slate-500 font-medium">Monthly Est.</p>
              <p className="text-2xl font-bold text-slate-800 flex items-center">
                <DollarSign className="h-5 w-5 text-slate-400" />
                {business?.revenue || "0.00"}
              </p>
            </div>
            <Link
              to="/admin/subscription"
              className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition"
            >
              Manage Plan
            </Link>
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="text-lg font-bold text-slate-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/admin/doctors"
              className="p-4 border border-slate-100 rounded-lg hover:border-teal-100 hover:bg-teal-50/50 transition-colors flex flex-col gap-2 group"
            >
              <div className="h-10 w-10 bg-slate-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:text-teal-600 transition-colors">
                <UserRound className="h-5 w-5" />
              </div>
              <p className="font-semibold text-slate-800 group-hover:text-teal-700">
                Add Doctor
              </p>
              <p className="text-xs text-slate-500">
                Register new medical staff
              </p>
            </Link>

            <Link
              to="/admin/receptionists"
              className="p-4 border border-slate-100 rounded-lg hover:border-teal-100 hover:bg-teal-50/50 transition-colors flex flex-col gap-2 group"
            >
              <div className="h-10 w-10 bg-slate-100 group-hover:bg-teal-100 rounded-lg flex items-center justify-center text-slate-600 group-hover:text-teal-600 transition-colors">
                <Users className="h-5 w-5" />
              </div>
              <p className="font-semibold text-slate-800 group-hover:text-teal-700">
                Add Receptionist
              </p>
              <p className="text-xs text-slate-500">
                Register front desk staff
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
