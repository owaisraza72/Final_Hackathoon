import { useListAppointmentsQuery } from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  Users,
  FileText,
  CalendarCheck,
  Activity,
  BrainCircuit,
  CalendarRange,
  History,
  ChevronRight,
} from "lucide-react";
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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Medical Center Dashboard"
          description="Real-time clinical summary and patient flow analytics."
        />
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden whitespace-nowrap">
          <div className="px-4 py-2 text-slate-800 text-[10px] font-black uppercase tracking-widest border-r border-slate-100 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Updates
          </div>
          <Link
            to="/doctor/ai"
            className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-900/10"
          >
            <BrainCircuit className="h-4 w-4" /> AI Diagnostics
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Patients"
          value={todaysAppointments.length}
          icon={<Users className="h-6 w-6" />}
          description="Scheduled for today"
          trend="8%"
          trendUp={true}
        />
        <StatCard
          title="Pending Queue"
          value={pendingAppointments.length}
          icon={<CalendarCheck className="h-6 w-6" />}
          description="Awaiting confirmation"
        />
        <StatCard
          title="Monthly Total"
          value={apptList.length}
          icon={<FileText className="h-6 w-6" />}
          description="Overall patients"
          trend="15%"
          trendUp={true}
        />
        <StatCard
          title="Completed"
          value={statusCounts["completed"] || 0}
          icon={<Activity className="h-6 w-6" />}
          description="Closed encounters"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Today's Schedule */}
        <div className="lg:col-span-2 bg-white rounded-3xl premium-shadow border border-slate-200/60 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <CalendarRange className="h-6 w-6 text-teal-600" />
              Today's Clinical Timeline
            </h3>
            <Link
              to="/doctor/appointments"
              className="px-4 py-2 rounded-xl text-xs font-bold text-teal-600 bg-teal-50 hover:bg-teal-100 transition-colors"
            >
              Full Schedule
            </Link>
          </div>
          <div className="p-8 space-y-5">
            {todaysAppointments.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                  <CalendarRange className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-slate-400 font-bold">
                  No clinic hours active for today.
                </p>
              </div>
            ) : (
              todaysAppointments.map((app) => (
                <div
                  key={app._id}
                  className="flex items-center justify-between p-5 bg-white rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-500/5 transition-all group lg:last:mb-2"
                >
                  <div className="flex items-center gap-6">
                    <div className="font-black text-teal-600 bg-teal-50 p-3 rounded-xl border border-teal-100/50 w-24 text-center text-sm shadow-sm group-hover:bg-teal-600 group-hover:text-white group-hover:border-teal-400 transition-all duration-300">
                      {app.timeSlot}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 text-lg leading-tight mb-0.5">
                        {app.patientId?.name || "Anonymous Patient"}
                      </h4>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        {app.reason || "General Consultation"}
                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                        ID: #{app._id?.slice(-6).toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-colors ${
                      app.status === "completed"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : app.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-slate-50 text-slate-500 border-slate-100"
                    }`}
                  >
                    {app.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Pie Chart + Quick Links */}
        <div className="space-y-8">
          {/* Appointment Status Pie Chart */}
          {pieData.length > 0 && (
            <div className="bg-slate-900 rounded-3xl premium-shadow p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Activity className="h-32 w-32" />
              </div>
              <h3 className="text-lg font-black tracking-tight mb-8 relative z-10 flex items-center gap-3">
                Case Distribution
              </h3>
              <div className="h-[220px] w-full relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={8}
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
                        borderRadius: 16,
                        border: "none",
                        fontWeight: "bold",
                        fontSize: 10,
                        padding: 12,
                        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      formatter={(val) => (
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {val}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Quick Shortcuts */}
          <div className="bg-white rounded-3xl p-8 premium-shadow border border-slate-200/60">
            <h3 className="text-lg font-black text-slate-800 tracking-tight mb-8">
              Quick Shortcuts
            </h3>
            <div className="space-y-4">
              {[
                {
                  to: "/doctor/prescriptions/new",
                  icon: <FileText />,
                  title: "Prescriptions",
                  desc: "Digital prescriptions",
                  color: "bg-teal-50 text-teal-600",
                },
                {
                  to: "/doctor/ai",
                  icon: <BrainCircuit />,
                  title: "Gemini AI",
                  desc: "Advanced Analysis",
                  color: "bg-indigo-50 text-indigo-600",
                },
                {
                  to: "/doctor/patients",
                  icon: <History />,
                  title: "Patient Vault",
                  desc: "Clinical History",
                  color: "bg-slate-50 text-slate-600",
                },
              ].map((link, i) => (
                <Link
                  key={i}
                  to={link.to}
                  className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/50 transition-all duration-300 group shadow-sm"
                >
                  <div
                    className={`h-12 w-12 ${link.color} rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
                  >
                    {link.icon}
                  </div>
                  <div>
                    <p className="font-black text-slate-800 tracking-tight group-hover:text-teal-900 transition-colors decoration-teal-500 decoration-2">
                      {link.title}
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">
                      {link.desc}
                    </p>
                  </div>
                  <ChevronRight className="ml-auto h-4 w-4 text-slate-300 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
