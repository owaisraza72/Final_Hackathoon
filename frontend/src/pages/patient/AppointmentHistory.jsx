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
      header: "Date & Time",
      accessor: "date",
      cell: (row) => (
        <div>
          <span className="block font-bold text-slate-800">
            {new Date(row.date).toLocaleDateString()}
          </span>
          <span className="text-xs font-semibold text-slate-500">
            {row.timeSlot}
          </span>
        </div>
      ),
    },
    {
      header: "Doctor",
      cell: (row) => `Dr. ${row.doctorId?.name || "Unassigned"}`,
    },
    {
      header: "Reason",
      accessor: "reason",
      cell: (row) => (
        <span className="text-slate-600">{row.reason || "-"}</span>
      ),
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`px-2 py-1 text-xs uppercase font-extrabold tracking-widest rounded-full ${
            row.status === "completed"
              ? "bg-emerald-100 text-emerald-700"
              : row.status === "pending"
                ? "bg-amber-100 text-amber-700"
                : row.status === "no_show"
                  ? "bg-red-100 text-red-700"
                  : "bg-slate-100 text-slate-700"
          }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="Appointment History"
        description="A complete log of your past and upcoming clinic visits."
      />

      <DataTable
        columns={columns}
        data={appointments}
        placeholder="Filter by status..."
      />
    </div>
  );
};

export default AppointmentHistory;
