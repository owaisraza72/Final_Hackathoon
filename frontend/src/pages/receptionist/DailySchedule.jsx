import { useState } from "react";
import {
  useGetDailyScheduleQuery,
  useCancelAppointmentMutation,
} from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Calendar, User, Clock, Trash2 } from "lucide-react";
import { toast } from "sonner";

const DailySchedule = () => {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const { data: appointments, isLoading } =
    useGetDailyScheduleQuery(selectedDate);
  const [cancelAppointment, { isLoading: isCanceling }] =
    useCancelAppointmentMutation();

  const handleCancelClick = async (id) => {
    if (window.confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await cancelAppointment(id).unwrap();
        toast.success("Appointment cancelled");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to cancel");
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="Daily Schedule"
        description="View and manage the clinic's master schedule."
        action={
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200">
            <Calendar className="h-5 w-5 text-indigo-500" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="font-medium text-slate-700 outline-none"
            />
          </div>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : appointments?.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 shadow-sm">
          <Calendar className="h-16 w-16 mx-auto text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-700">No appointments</h3>
          <p className="text-slate-500 mt-2">
            There are no appointments scheduled for{" "}
            {new Date(selectedDate).toLocaleDateString()}.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {appointments?.map((app) => (
            <div
              key={app._id}
              className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col relative overflow-hidden group"
            >
              {/* Status Indicator Band */}
              <div
                className={`absolute top-0 left-0 w-1 h-full ${
                  app.status === "completed"
                    ? "bg-emerald-500"
                    : app.status === "pending"
                      ? "bg-amber-500"
                      : app.status === "no_show"
                        ? "bg-red-500"
                        : "bg-slate-300"
                }`}
              />

              <div className="flex justify-between items-start mb-4 pl-3">
                <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-lg font-bold text-sm">
                  <Clock className="h-4 w-4" /> {app.timeSlot}
                </div>
                <span
                  className={`px-2 py-1 text-[10px] uppercase font-bold rounded-full tracking-wider ${
                    app.status === "completed"
                      ? "bg-emerald-100 text-emerald-700"
                      : app.status === "pending"
                        ? "bg-amber-100 text-amber-700"
                        : app.status === "no_show"
                          ? "bg-red-100 text-red-700"
                          : "bg-slate-100 text-slate-700"
                  }`}
                >
                  {app.status}
                </span>
              </div>

              <div className="pl-3 flex-1">
                <h4 className="text-lg font-black text-slate-800 flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-400" />{" "}
                  {app.patientId?.name || "Unknown"}
                </h4>
                <p className="text-sm text-slate-500 font-medium ml-6 mb-3 border-b border-slate-100 pb-3">
                  Dr. {app.doctorId?.name || "Unassigned"}
                </p>

                {app.reason && (
                  <p className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    "{app.reason}"
                  </p>
                )}
              </div>

              <div className="pl-3 mt-4 pt-4 border-t border-slate-100 flex justify-end">
                {app.status === "pending" && (
                  <button
                    onClick={() => handleCancelClick(app._id)}
                    disabled={isCanceling}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Cancel Appointment"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailySchedule;
