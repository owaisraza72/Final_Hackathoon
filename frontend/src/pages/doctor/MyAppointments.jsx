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
      header: "Date & Time",
      accessor: "date",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="font-semibold text-slate-800">
            {new Date(row.date).toLocaleDateString()}
          </span>
          <span className="text-slate-500 text-sm">{row.timeSlot}</span>
        </div>
      ),
    },
    {
      header: "Patient Name",
      accessor: "patient",
      cell: (row) => (
        <span className="font-medium">{row.patientId?.name || "Unknown"}</span>
      ),
    },
    { header: "Reason", accessor: "reason" },
    {
      header: "Status",
      cell: (row) => (
        <select
          value={row.status}
          onChange={(e) => handleStatusChange(row._id, e.target.value)}
          disabled={isUpdating}
          className={`px-3 py-1.5 rounded-lg border text-sm font-semibold outline-none focus:ring-2 focus:ring-teal-500 transition-colors ${
            row.status === "completed"
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : row.status === "pending"
                ? "bg-amber-50 border-amber-200 text-amber-700"
                : row.status === "no_show"
                  ? "bg-red-50 border-red-200 text-red-700"
                  : "bg-slate-50 border-slate-200 text-slate-700"
          }`}
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="no_show">No Show</option>
        </select>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="My Appointments"
        description="Manage your appointments and update patient status."
      />

      <DataTable
        columns={columns}
        data={appointments}
        placeholder="Search appointments..."
      />
    </div>
  );
};

export default MyAppointments;
