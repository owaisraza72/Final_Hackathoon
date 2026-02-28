import { useListAppointmentsQuery } from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Users, CalendarCheck, UserPlus, Clock } from "lucide-react";
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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <PageHeader
        title="Reception Desk"
        description="Manage patient flow and daily schedules efficiently."
      />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Today's Appointments"
          value={todaysAppointments.length}
          icon={<CalendarCheck className="h-6 w-6 text-teal-600" />}
        />
        <StatCard
          title="Waiting Queue"
          value={pendingAppointments.length}
          icon={<Clock className="h-6 w-6 text-amber-500" />}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mt-8">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Link
            to="/receptionist/patients/new"
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-teal-500 hover:shadow-md transition-all bg-white group"
          >
            <div className="h-12 w-12 rounded-lg bg-teal-50 flex items-center justify-center group-hover:bg-teal-500 transition-colors">
              <UserPlus className="h-6 w-6 text-teal-600 group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Register Patient</h4>
              <p className="text-xs text-slate-500 mt-1">
                Add new patient to records
              </p>
            </div>
          </Link>

          <Link
            to="/receptionist/appointments/new"
            className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-indigo-500 hover:shadow-md transition-all bg-white group"
          >
            <div className="h-12 w-12 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-500 transition-colors">
              <CalendarCheck className="h-6 w-6 text-indigo-600 group-hover:text-white" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800">Book Appointment</h4>
              <p className="text-xs text-slate-500 mt-1">
                Schedule a visit with doctor
              </p>
            </div>
          </Link>
        </div>

        {/* Schedule Preview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
            <h3 className="text-lg font-bold text-slate-800">Up Next Today</h3>
            <Link
              to="/receptionist/schedule"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              Full Schedule →
            </Link>
          </div>

          <div className="space-y-4">
            {todaysAppointments.length === 0 ? (
              <p className="text-center text-slate-500 py-8">
                No appointments remaining today.
              </p>
            ) : (
              todaysAppointments.slice(0, 5).map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                >
                  <div className="flex items-center gap-4">
                    <span className="font-bold text-slate-700 w-16">
                      {app.timeSlot}
                    </span>
                    <div>
                      <h4 className="font-semibold text-slate-800">
                        {app.patientId?.name || "Unknown"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Dr. {app.doctorId?.name || "Staff"}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded-full font-bold uppercase ${
                      app.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {app.status}
                  </span>
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
