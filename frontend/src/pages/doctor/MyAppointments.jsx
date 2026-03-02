import {
  useListAppointmentsQuery,
  useUpdateStatusMutation,
} from "@/features/appointments/appointmentApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";

const MyAppointments = () => {
  const { data: appointments, isLoading } = useListAppointmentsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateStatusMutation();

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <LoadingSpinner />
      </div>
    );

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status");
    }
  };

  const columns = [
    {
      header: "Temporal Marker",
      accessor: "date",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 border border-slate-100/60 rounded-xl flex flex-col items-center justify-center group-hover:bg-teal-600 transition-colors duration-500">
            <span className="text-[10px] font-black text-slate-400 group-hover:text-teal-200 uppercase leading-none">
              {new Date(row.date).toLocaleDateString("en-US", {
                month: "short",
              })}
            </span>
            <span className="text-lg font-black text-slate-700 group-hover:text-white leading-none">
              {new Date(row.date).getDate()}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase text-teal-600 tracking-wider bg-teal-50 px-2 py-0.5 rounded-md mb-1 self-start">
              Scheduled Slot
            </span>
            <span className="font-bold text-slate-800 tracking-tight">
              {row.timeSlot}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Patient Entity",
      accessor: "patient",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 shadow-sm">
            <span className="text-xs font-black text-slate-500">
              {row.patientId?.name?.charAt(0) || "P"}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tight">
              {row.patientId?.name || "Anonymous Patient"}
            </span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              ID: {row.patientId?._id?.slice(-8).toUpperCase() || "NEW-INTAKE"}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Encouter Reason",
      accessor: "reason",
      cell: (row) => (
        <span className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-xl italic">
          "{row.reason || "General Consultation"}"
        </span>
      ),
    },
    {
      header: "Status Synchronization",
      cell: (row) => (
        <div className="relative inline-block w-full">
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row._id, e.target.value)}
            disabled={isUpdating}
            className={`w-full h-11 px-4 rounded-xl border-2 text-[10px] font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-teal-500/10 transition-all cursor-pointer appearance-none ${
              row.status === "completed"
                ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                : row.status === "pending"
                  ? "bg-amber-50 border-amber-100 text-amber-600"
                  : row.status === "no_show"
                    ? "bg-red-50 border-red-100 text-red-600"
                    : "bg-slate-50 border-slate-200 text-slate-500"
            }`}
          >
            <option value="pending">PENDING PHASE</option>
            <option value="confirmed">CONFIRMED NODE</option>
            <option value="completed">ENCOUNTER CLOSED</option>
            <option value="no_show">LIAISON FAILED</option>
          </select>
        </div>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Queue Command"
          description="High-precision management of scheduled patient encounters and status synchronization."
        />
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-4 py-2 text-slate-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Queue Synchronized
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Hydrating Queue Data...
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-100/60 overflow-hidden">
          <DataTable
            columns={columns}
            data={appointments || []}
            placeholder="Search within clinical queue..."
          />
        </div>
      )}
    </div>
  );
};

export default MyAppointments;
