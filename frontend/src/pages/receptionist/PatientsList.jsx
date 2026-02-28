import { useState } from "react";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Link } from "react-router-dom";
import { UserPlus, Phone, User, Edit2, Trash2 } from "lucide-react";
import { useUpdatePatientMutation } from "@/features/patients/patientApi";
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
      header: "Name",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
            <User className="h-4 w-4 text-teal-600" />
          </div>
          <span className="font-medium text-slate-800">{row.name}</span>
        </div>
      ),
    },
    {
      header: "Age / Gender",
      cell: (row) => (
        <span className="text-slate-600">
          {row.age}y / {row.gender}
        </span>
      ),
    },
    {
      header: "Contact",
      cell: (row) => (
        <span className="flex items-center gap-1 text-slate-600">
          <Phone className="h-3.5 w-3.5" />
          {row.contact || "—"}
        </span>
      ),
    },
    {
      header: "Blood Group",
      cell: (row) => (
        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
          {row.bloodGroup || "—"}
        </span>
      ),
    },
    {
      header: "Registered On",
      cell: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })
          : "—",
    },
    {
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex px-2.5 py-1 text-xs rounded-full font-medium ${
            row.isActive
              ? "bg-emerald-100 text-emerald-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {row.isActive ? "Active" : "Inactive"}
        </span>
      ),
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
        </div>
      ),
    },
  ];

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
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="All Patients"
        description="View all registered patients in your clinic."
        action={
          <Link
            to="/receptionist/patients/new"
            className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            Register New Patient
          </Link>
        }
      />

      {isLoading ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : isError ? (
        <div className="p-6 bg-red-50 text-red-600 rounded-lg text-center">
          Failed to load patients. Please try again.
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          placeholder="Search patients by name..."
          onSearch={setSearch}
        />
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Edit Patient Details"
      >
        <form onSubmit={handleUpdate} className="grid grid-cols-2 gap-4 pt-2">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              required
              className="w-full p-2 border rounded-lg"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Age
            </label>
            <input
              required
              type="number"
              className="w-full p-2 border rounded-lg"
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Gender
            </label>
            <select
              className="w-full p-2 border rounded-lg"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Contact
            </label>
            <input
              required
              className="w-full p-2 border rounded-lg"
              value={formData.contact}
              onChange={(e) =>
                setFormData({ ...formData, contact: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Blood Group
            </label>
            <select
              className="w-full p-2 border rounded-lg"
              value={formData.bloodGroup}
              onChange={(e) =>
                setFormData({ ...formData, bloodGroup: e.target.value })
              }
            >
              <option value="unknown">Unknown</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>
          <div className="col-span-2 flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-slate-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg disabled:opacity-50"
            >
              {isUpdating ? "Updating..." : "Save Changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PatientsList;
