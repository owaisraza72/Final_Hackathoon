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
import { Plus, Edit2, Trash2 } from "lucide-react";

const ManageDoctors = () => {
  const { data: doctors, isLoading, isError } = useListUsersQuery("DOCTOR");
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
        <span
          className={`inline-flex px-2 py-1 text-xs rounded-full font-medium ${row.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Joined",
      cell: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(row._id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Deactivate"
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
    if (window.confirm("Are you sure you want to deactivate this doctor?")) {
      try {
        await deleteUser(id).unwrap();
        toast.success("Doctor deactivated successfully");
      } catch (err) {
        toast.error("Failed to deactivate doctor");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await updateUser({ id: selectedUser._id, data: formData }).unwrap();
        toast.success("Doctor updated successfully");
      } else {
        await createUser({ ...formData, role: "DOCTOR" }).unwrap();
        toast.success("Doctor added successfully");
      }
      setModalOpen(false);
      setIsEditMode(false);
      setSelectedUser(null);
      setFormData({ name: "", email: "", password: "" });
    } catch (err) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEditMode ? "update" : "add"} doctor`,
      );
    }
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = doctors?.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="Manage Doctors"
        description="View and add medical staff to your clinic."
        action={
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Doctor
          </button>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg">
          Failed to load doctors
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filteredData || []}
          onSearch={setSearchTerm}
          placeholder="Search by name or email..."
        />
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setIsEditMode(false);
        }}
        title={isEditMode ? "Edit Doctor" : "Add New Doctor"}
      >
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              required
              type="text"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="Dr. John Doe"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              required
              type="email"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="doctor@clinic.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Temporary Password
            </label>
            <input
              required
              type="password"
              className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <p className="text-xs text-slate-500 mt-1">
              They can change this after logging in.
            </p>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating || isUpdating}
              className="px-4 py-2 font-medium bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {isCreating || isUpdating
                ? "Saving..."
                : isEditMode
                  ? "Update Doctor"
                  : "Add Doctor"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageDoctors;
