import { useGetPatientHistoryQuery } from "@/features/patients/patientApi";
import useAuth from "@/hooks/useAuth";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

const AppointmentHistory = () => {
  const { user } = useAuth();
  const { data: history, isLoading } = useGetPatientHistoryQuery(
    user?.profileId || "me",
  );

  if (isLoading)
    return (
      <div className="flex h-64 justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const appointments = history?.appointments || [];

  const columns = [
    {
      header: "Temporal Marker",
      accessor: "date",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[10px] font-black text-slate-500 uppercase">
            {new Date(row.date).toLocaleDateString("en-US", { month: "short" })}
          </div>
          <div>
            <span className="block text-sm font-black text-slate-800 tracking-tight">
              {new Date(row.date).toLocaleDateString(undefined, {
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none">
              Allocated: {row.timeSlot}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Lead Practitioner",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-teal-500" />
          <span className="text-sm font-bold text-slate-700">
            Dr. {row.doctorId?.name || "Pending Assignment"}
          </span>
        </div>
      ),
    },
    {
      header: "Clinical Context",
      accessor: "reason",
      cell: (row) => (
        <span className="text-sm font-semibold text-slate-500 max-w-[200px] truncate block">
          {row.reason || "Routine Surveillance"}
        </span>
      ),
    },
    {
      header: "Session Status",
      cell: (row) => (
        <span
          className={`px-4 py-1.5 text-[10px] uppercase font-black tracking-[0.15em] rounded-xl border shadow-sm ${
            row.status === "completed"
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : row.status === "pending"
                ? "bg-amber-50 text-amber-600 border-amber-100"
                : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Encounter Log"
          description="A verifiable audit of all medical consultations and scheduled cycles."
        />
        <div className="h-14 px-6 bg-white border border-slate-200 rounded-[20px] shadow-sm flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Master Archive Sync:
          </span>
          <span className="text-xs font-black text-slate-700">
            100% Validated
          </span>
        </div>
      </div>

      <div className="bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden">
        <DataTable
          columns={columns}
          data={appointments}
          placeholder="Search encounters by diagnosis or status..."
        />
      </div>
    </div>
  );
};

export default AppointmentHistory;
