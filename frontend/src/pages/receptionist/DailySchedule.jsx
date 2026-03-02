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
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Chronology"
          description="Synchronized master schedule for active clinical encounters."
        />
        <div className="flex items-center gap-4 h-14 px-6 bg-white border border-slate-200 rounded-[24px] shadow-sm">
          <Calendar className="h-5 w-5 text-indigo-500" />
          <div className="flex flex-col">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
              Active Cycle Date
            </span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="text-xs font-black text-slate-700 outline-none bg-transparent cursor-pointer"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Compiling Daily Matrix...
            </p>
          </div>
        </div>
      ) : appointments?.length === 0 ? (
        <div className="bg-white p-20 text-center rounded-[40px] border border-slate-200/60 premium-shadow">
          <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Calendar className="h-10 w-10 text-slate-200" />
          </div>
          <h3 className="text-xl font-black text-slate-800 tracking-tight">
            Zero Encounters Active
          </h3>
          <p className="text-slate-400 mt-2 text-sm font-semibold max-w-sm mx-auto leading-relaxed">
            There are no clinical sessions synchronized for the selected
            temporal marker.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {appointments?.map((app) => (
            <div
              key={app._id}
              className="group bg-white rounded-[40px] border border-slate-200/50 premium-shadow overflow-hidden flex flex-col hover:scale-[1.02] transition-all duration-500"
            >
              <div className="p-8 space-y-6 flex-1">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-12 bg-slate-50 rounded-2xl flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-colors">
                    <Clock className="h-4 w-4 text-indigo-500" />
                    <span className="text-[9px] font-black text-slate-700 mt-1">
                      {app.timeSlot}
                    </span>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border shadow-sm ${
                      app.status === "completed"
                        ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                        : app.status === "pending"
                          ? "bg-amber-50 text-amber-600 border-amber-100"
                          : "bg-red-50 text-red-600 border-red-100"
                    }`}
                  >
                    {app.status}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <User className="h-4 w-4 text-slate-300" />
                    <h4 className="text-xl font-black text-slate-800 tracking-tight">
                      {app.patientId?.name || "Protocol Unknown"}
                    </h4>
                  </div>
                  <p className="text-[10px] font-black uppercase text-indigo-500 tracking-widest ml-7">
                    Assigned: Dr. {app.doctorId?.name || "Pending Selection"}
                  </p>
                </div>

                {app.reason && (
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white transition-colors duration-500">
                    <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mb-1 font-black">
                      Chief Complaint
                    </p>
                    <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                      "{app.reason}"
                    </p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50/50 border-t border-slate-50 flex justify-between items-center px-8">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-slate-300" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    ID: {app._id.slice(-6).toUpperCase()}
                  </span>
                </div>
                {app.status === "pending" && (
                  <button
                    onClick={() => handleCancelClick(app._id)}
                    disabled={isCanceling}
                    className="h-10 w-10 bg-white hover:bg-red-50 text-slate-300 hover:text-red-500 rounded-xl border border-slate-200 hover:border-red-100 shadow-sm transition-all flex items-center justify-center group/trash"
                  >
                    <Trash2 className="h-4 w-4 group-hover/trash:scale-125 transition-transform" />
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
