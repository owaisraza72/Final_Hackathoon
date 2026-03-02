import { useState } from "react";
import {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/features/admin/adminApi";
import DataTable from "@/components/ui/DataTable";
import PageHeader from "@/components/ui/PageHeader";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";

const ManageReceptionists = () => {
  const {
    data: receptionists,
    isLoading,
    isError,
  } = useListUsersQuery("RECEPTIONIST");
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <span className="font-medium text-slate-900">{row.name}</span>
      ),
    },
    { header: "Email", accessor: "email" },
    {
      header: "Status",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${row.isActive ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]"}`}
          />
          <span
            className={`text-[10px] font-black uppercase tracking-widest ${row.isActive ? "text-emerald-600" : "text-red-600"}`}
          >
            {row.isActive ? "Active" : "On Hold"}
          </span>
        </div>
      ),
    },
    {
      header: "Joined",
      cell: (row) => (
        <span className="text-slate-500 font-bold text-xs">
          {new Date(row.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Management",
      cell: (row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleEdit(row)}
            className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all duration-300"
            title="Edit Identity"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="h-9 w-9 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
            title="Revoke Access"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({ name: user.name, email: user.email, password: "" });
    setIsEditMode(true);
    setModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Are you sure you want to deactivate this receptionist?")
    ) {
      try {
        await deleteUser(id).unwrap();
        toast.success("Receptionist deactivated successfully");
      } catch (err) {
        toast.error("Failed to deactivate receptionist");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateUser({ id: selectedUser._id, data: formData }).unwrap();
        toast.success("Receptionist updated successfully");
      } else {
        await createUser({ ...formData, role: "RECEPTIONIST" }).unwrap();
        toast.success("Receptionist added successfully");
      }
      setModalOpen(false);
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} receptionist`,
      );
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = receptionists?.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Front Desk Personnel"
          description="Maintain and oversee the core operational staff at your clinical reception nodes."
        />
        <button
          onClick={() => {
            setIsEditMode(false);
            setModalOpen(true);
            setFormData({ name: "", email: "", password: "" });
          }}
          className="h-14 px-8 bg-slate-900 border-b-4 border-black hover:bg-indigo-600 hover:border-indigo-800 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-[20px] transition-all duration-300 shadow-2xl flex items-center justify-center gap-4 active:scale-95 group"
        >
          <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
          Onboard Liaison
        </button>
      </div>

      {isLoading ? (
        <div className="flex h-[40vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Accessing Support Records...
            </p>
          </div>
        </div>
      ) : isError ? (
        <div className="p-10 bg-red-50/50 border border-red-100 rounded-[32px] text-center">
          <AlertCircle className="h-10 w-10 text-red-400 mx-auto mb-4" />
          <p className="text-red-600 font-bold tracking-tight">
            Access Protocol Failure: Operations records unreachable.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-100/60 overflow-hidden">
          <DataTable
            columns={columns}
            data={filteredData || []}
            onSearch={setSearchTerm}
            placeholder="Search by liaison identity..."
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsEditMode(false);
        }}
        title={isEditMode ? "Modify Liaison Record" : "New Liaison Induction"}
      >
        <form onSubmit={handleSubmit} className="space-y-8 pt-4">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Liaison Signature Name
              </label>
              <input
                required
                type="text"
                placeholder="e.g. Elena Sterling"
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Operational Link (Email)
              </label>
              <input
                required
                type="email"
                placeholder="liaison@clinicos.pro"
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                {isEditMode
                  ? "New Access Key (Optional)"
                  : "Initial Access Key"}
              </label>
              <input
                required={!isEditMode}
                type="password"
                placeholder="••••••••••••"
                className="w-full h-14 px-6 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest ml-1">
                Security Protocol: 8+ Characters required
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="h-12 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Abort Protocol
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="h-14 px-10 bg-slate-900 hover:bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl transition-all active:scale-95 disabled:opacity-50"
            >
              {isCreating || isUpdating ? (
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Syncing Data...
                </div>
              ) : isEditMode ? (
                "Confirm Modification"
              ) : (
                "Execute Induction"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageReceptionists;
