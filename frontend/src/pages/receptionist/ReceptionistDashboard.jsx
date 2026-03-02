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
} from "lucide-react";
import { Link } from "react-router-dom";

const ReceptionistDashboard = () => {
  const { data: appointments, isLoading } = useListAppointmentsQuery();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  const today = new Date().toISOString().split("T")[0];
  const todaysAppointments =
    appointments?.filter((app) => app.date.split("T")[0] === today) || [];
  const pendingAppointments = todaysAppointments.filter(
    (app) => app.status === "pending",
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Reception Excellence"
          description="Patient coordination and front-office intelligence hub."
        />
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm overflow-hidden whitespace-nowrap">
          <div className="px-4 py-2 text-slate-800 text-[10px] font-black uppercase tracking-widest border-r border-slate-100 flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Reception
          </div>
          <Link
            to="/receptionist/patients/new"
            className="px-4 py-2 bg-teal-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/10"
          >
            <UserPlus className="h-4 w-4" /> New Registration
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Bookings"
          value={todaysAppointments.length}
          icon={<CalendarCheck className="h-6 w-6" />}
          description="Active clinic load"
          trend="Steady"
          trendUp={true}
        />
        <StatCard
          title="Waiting Queue"
          value={pendingAppointments.length}
          icon={<Clock className="h-6 w-6" />}
          description="Awaiting intake"
          trend="Live"
          trendUp={true}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Quick Actions Panel */}
        <div className="space-y-6">
          <h3 className="text-lg font-black text-slate-800 tracking-tight flex items-center gap-3 ml-1">
            Front Desk Flow
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                to: "/receptionist/patients/new",
                icon: <UserPlus />,
                title: "Registration",
                desc: "Create medical record",
                color: "bg-teal-50 text-teal-600 hover:border-teal-200",
              },
              {
                to: "/receptionist/appointments/new",
                icon: <CalendarCheck />,
                title: "Slot Booking",
                desc: "Schedule doctor visit",
                color: "bg-indigo-50 text-indigo-600 hover:border-indigo-200",
              },
              {
                to: "/receptionist/patients",
                icon: <Users />,
                title: "Patient Vault",
                desc: "Access records",
                color: "bg-slate-50 text-slate-600 hover:border-slate-300",
              },
            ].map((action, i) => (
              <Link
                key={i}
                to={action.to}
                className={`flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-3xl transition-all duration-300 group premium-shadow ${action.color}`}
              >
                <div className="h-14 w-14 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                  {action.icon}
                </div>
                <div>
                  <h4 className="font-black text-slate-900 leading-tight">
                    {action.title}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight className="ml-auto h-5 w-5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0" />
              </Link>
            ))}
          </div>
        </div>

        {/* Schedule Insights */}
        <div className="lg:col-span-2 bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <Activity className="h-6 w-6 text-teal-600" />
              Real-time Queue Status
            </h3>
            <Link
              to="/receptionist/schedule"
              className="px-4 py-2 rounded-xl text-xs font-black text-teal-600 bg-teal-50 hover:bg-teal-100 uppercase tracking-widest transition-all"
            >
              Full Schedule
            </Link>
          </div>

          <div className="p-8 space-y-4">
            {todaysAppointments.length === 0 ? (
              <div className="text-center py-20">
                <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 opacity-30">
                  <CalendarCheck className="h-10 w-10 text-slate-400" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">
                  No clinic hours active today
                </p>
              </div>
            ) : (
              todaysAppointments.slice(0, 5).map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between items-center p-5 bg-white rounded-3xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6">
                    <div className="font-black text-teal-700 bg-teal-50 px-4 py-2 rounded-2xl border border-teal-100 shadow-sm w-28 text-center text-sm">
                      {app.timeSlot}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 tracking-tight group-hover:text-teal-900 transition-colors">
                        {app.patientId?.name || "Patient Unknown"}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Stethoscope className="h-3 w-3 text-slate-400" />
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Dr. {app.doctorId?.name || "Unassigned"}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border rounded-xl transition-all ${
                      app.status === "pending"
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
      </div>
    </div>
  );
};

export default ReceptionistDashboard;
