import { useListAppointmentsQuery } from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Users, FileText, CalendarCheck, Activity } from "lucide-react";
import { Link } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const STATUS_COLORS = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  completed: "#10b981",
  cancelled: "#ef4444",
  no_show: "#94a3b8",
};

const DoctorDashboard = () => {
  const { data: appointments, isLoading } = useListAppointmentsQuery({});

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <LoadingSpinner />
      </div>
    );
  }

  const apptList = appointments || [];
  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments = apptList.filter(
    (app) => app.date?.split("T")[0] === today,
  );
  const pendingAppointments = apptList.filter(
    (app) => app.status === "pending",
  );

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

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <PageHeader
        title="Doctor Dashboard"
        description="Here is your schedule and patient summary for today."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Patients"
          value={todaysAppointments.length}
          icon={<Users className="h-6 w-6 text-teal-600" />}
          trend="vs yesterday"
          trendUp={true}
        />
        <StatCard
          title="Pending Queue"
          value={pendingAppointments.length}
          icon={<CalendarCheck className="h-6 w-6 text-amber-500" />}
        />
        <StatCard
          title="Total Appointments"
          value={apptList.length}
          icon={<FileText className="h-6 w-6 text-indigo-500" />}
          description="All time"
        />
        <StatCard
          title="Completed"
          value={statusCounts["completed"] || 0}
          icon={<Activity className="h-6 w-6 text-emerald-500" />}
          description="All time"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">
              Today's Schedule
            </h3>
            <Link
              to="/doctor/appointments"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View All
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {todaysAppointments.length === 0 ? (
              <p className="text-slate-500 text-center py-8">
                No appointments scheduled for today.
              </p>
            ) : (
              todaysAppointments.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <div className="font-bold text-slate-700 bg-white px-3 py-1.5 rounded border border-slate-200 shadow-sm w-20 text-center">
                      {app.timeSlot}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {app.patientId?.name || "Patient"}
                      </h4>
                      <p className="text-sm text-slate-500">
                        {app.reason || "General checkup"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      app.status === "completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : app.status === "pending"
                          ? "bg-amber-100 text-amber-700"
                          : app.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {app.status?.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pie Chart + Quick Links */}
        <div className="space-y-6">
          {/* Appointment Status Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="text-base font-bold text-slate-800 mb-3">
                📊 Appointment Breakdown
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val, name) => [val, name]}
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(val) => (
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {val}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Quick Links */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-800 mb-4">
              Quick Links
            </h3>
            <div className="space-y-3">
              <Link
                to="/doctor/prescriptions/new"
                className="flex items-center p-3 text-slate-700 font-medium rounded-lg hover:bg-teal-50 hover:text-teal-700 border border-transparent hover:border-teal-100 transition-colors"
              >
                <FileText className="mr-3 h-5 w-5" /> Write Prescription
              </Link>
              <Link
                to="/doctor/ai"
                className="flex items-center p-3 text-slate-700 font-medium rounded-lg hover:bg-indigo-50 hover:text-indigo-700 border border-transparent hover:border-indigo-100 transition-colors"
              >
                <Activity className="mr-3 h-5 w-5" /> Gemini AI Diagnosis
              </Link>
              <Link
                to="/doctor/patients"
                className="flex items-center p-3 text-slate-700 font-medium rounded-lg hover:bg-slate-50 hover:text-slate-900 border border-transparent hover:border-slate-200 transition-colors"
              >
                <Users className="mr-3 h-5 w-5" /> Patient History
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
