import { useState } from "react";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Link } from "react-router-dom";
import {
  UserPlus,
  Phone,
  User,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import {
  useUpdatePatientMutation,
  useDeletePatientMutation,
} from "@/features/patients/patientApi";
import Modal from "@/components/ui/Modal";
import { toast } from "sonner";

const PatientsList = () => {
  const [search, setSearch] = useState("");
  const {
    data: patientsData,
    isLoading,
    isError,
  } = useListPatientsQuery({ search });
  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation();
  const [deletePatient] = useDeletePatientMutation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    contact: "",
    bloodGroup: "",
  });

  const patients = Array.isArray(patientsData)
    ? patientsData
    : patientsData?.patients || [];

  const columns = [
    {
      header: "Clinical Subject",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 transition-all duration-500 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
            <User className="h-5 w-5 text-slate-400 group-hover:text-white relative z-10" />
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tight text-lg group-hover:text-teal-900 transition-colors uppercase">
              {row.name}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {row._id.slice(-10).toUpperCase()}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Biological Profile",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Age / Gender
          </span>
          <span className="font-bold text-slate-700">
            {row.age}Y <span className="text-slate-300 mx-1">|</span>{" "}
            {row.gender.toUpperCase()}
          </span>
        </div>
      ),
    },
    {
      header: "Liaison Endpoint",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Direct Comms
          </span>
          <span className="font-bold text-slate-600 flex items-center gap-2 group">
            <Phone className="h-3 w-3 text-teal-500 group-hover:scale-125 transition-transform" />
            {row.contact || "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Hemo-Group",
      cell: (row) => (
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-red-50 border border-red-100/50 text-red-600 font-black text-xs shadow-sm">
          {row.bloodGroup || "—"}
        </div>
      ),
    },
    {
      header: "Registry Date",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Induction Date
          </span>
          <span className="text-xs font-bold text-slate-500">
            {row.createdAt
              ? new Date(row.createdAt).toLocaleDateString("en-US", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Registry Status",
      cell: (row) => (
        <div
          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
            row.isActive
              ? "bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-500/5"
              : "bg-red-50 text-red-600 border-red-100"
          }`}
        >
          {row.isActive ? "Operational" : "Decommissioned"}
        </div>
      ),
    },
    {
      header: "Node Control",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl border border-slate-100 hover:border-teal-200 transition-all duration-300 group shadow-sm"
            title="Modify Record"
          >
            <Edit2 className="h-4 w-4 group-hover:rotate-12 transition-transform" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="h-10 w-10 flex items-center justify-center bg-slate-50 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl border border-slate-100 hover:border-red-200 transition-all duration-300 group shadow-sm"
            title="Revoke Access"
          >
            <Trash2 className="h-4 w-4 group-hover:scale-90 transition-transform" />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to deactivate this patient?")) {
      try {
        await deletePatient(id).unwrap();
        toast.success("Patient deactivated successfully");
      } catch (err) {
        toast.error("Failed to deactivate patient");
      }
    }
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      contact: patient.contact,
      bloodGroup: patient.bloodGroup,
    });
    setModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updatePatient({ id: selectedPatient._id, data: formData }).unwrap();
      toast.success("Patient updated successfully");
      setModalOpen(false);
    } catch (err) {
      toast.error("Failed to update patient");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Registry Master"
          description="Global directory of all synchronized patient entities and their medical markers."
        />
        <Link
          to="/receptionist/patients/new"
          className="h-14 px-8 bg-slate-900 border-b-4 border-black hover:bg-teal-600 hover:border-teal-800 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[24px] transition-all duration-300 shadow-2xl flex items-center justify-center gap-4 active:scale-95 group"
        >
          <UserPlus className="h-5 w-5 group-hover:scale-125 transition-transform" />
          Initialize New Intake
        </Link>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Accessing Central Registry...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="p-10 bg-red-50/50 border border-red-100 rounded-[32px] text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-bold tracking-tight">
            Access Protocol Failure: Registry unreachable.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-100/60 overflow-hidden">
          <DataTable
            columns={columns}
            data={patients}
            placeholder="Search by patient identity..."
            onSearch={setSearch}
          />
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Modify Clinical Metadata"
      >
        <form onSubmit={handleUpdate} className="space-y-8 pt-4">
          <div className="grid grid-cols-2 gap-x-8 gap-y-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Full Legal Identity
              </label>
              <input
                required
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Temporal Age
              </label>
              <input
                required
                type="number"
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Gender Class
              </label>
              <select
                className="w-full h-14 pl-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none appearance-none"
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Communication Liaison
              </label>
              <input
                required
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Hematological Profile
              </label>
              <select
                className="w-full h-14 pl-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none appearance-none"
                value={formData.bloodGroup}
                onChange={(e) =>
                  setFormData({ ...formData, bloodGroup: e.target.value })
                }
              >
                <option value="unknown">Pending Verification</option>
                <option value="A+">A Positive (+)</option>
                <option value="A-">A Negative (-)</option>
                <option value="B+">B Positive (+)</option>
                <option value="B-">B Negative (-)</option>
                <option value="AB+">AB Positive (+)</option>
                <option value="AB-">AB Negative (-)</option>
                <option value="O+">O Positive (+)</option>
                <option value="O-">O Negative (-)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-50">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Abort Modify
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="h-14 px-10 bg-slate-900 hover:bg-teal-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
            >
              {isUpdating ? (
                <>
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Recalibrating Records...
                </>
              ) : (
                "Synchronize Changes"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsList;
