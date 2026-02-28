import { useState } from "react";
import {
  useListPatientsQuery,
  useGetPatientHistoryQuery,
} from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import DataTable from "@/components/ui/DataTable";
import Modal from "@/components/ui/Modal";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { Clock, FileText, Activity } from "lucide-react";

const PatientHistory = () => {
  const { data: patients, isLoading: isLoadingPatients } =
    useListPatientsQuery();
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("appointments");

  const { data: history, isLoading: isLoadingHistory } =
    useGetPatientHistoryQuery(selectedPatientId, {
      skip: !selectedPatientId,
    });

  const handleViewHistory = (id) => {
    setSelectedPatientId(id);
    setModalOpen(true);
    setActiveTab("appointments");
  };

  const columns = [
    {
      header: "Name",
      accessor: "name",
      cell: (row) => (
        <span className="font-semibold text-slate-800">{row.name}</span>
      ),
    },
    { header: "Age/Gender", cell: (row) => `${row.age} / ${row.gender}` },
    { header: "Contact", accessor: "contact" },
    {
      header: "Action",
      cell: (row) => (
        <button
          onClick={() => handleViewHistory(row._id)}
          className="text-sm font-medium text-teal-600 hover:text-teal-700 hover:underline transition-all"
        >
          View Medical History
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="Patient Directory"
        description="Search via name or contact to pull up complete medical history."
      />

      {isLoadingPatients ? (
        <div className="flex justify-center p-12">
          <LoadingSpinner />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={patients}
          placeholder="Search by patient name..."
        />
      )}

      {/* Medical History Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedPatientId(null);
        }}
        title={
          history
            ? `Medical History for ${history?.basicInfo?.name}`
            : "Patient History"
        }
      >
        {isLoadingHistory ? (
          <div className="flex justify-center p-12">
            <LoadingSpinner />
          </div>
        ) : history ? (
          <div className="space-y-6">
            <div className="flex gap-4 border-b border-slate-200">
              <button
                onClick={() => setActiveTab("appointments")}
                className={`pb-2 text-sm font-medium transition-colors ${activeTab === "appointments" ? "border-b-2 border-teal-600 text-teal-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Clock className="inline h-4 w-4 mr-1" /> Appointments
              </button>
              <button
                onClick={() => setActiveTab("prescriptions")}
                className={`pb-2 text-sm font-medium transition-colors ${activeTab === "prescriptions" ? "border-b-2 border-teal-600 text-teal-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                <FileText className="inline h-4 w-4 mr-1" /> Prescriptions
              </button>
              <button
                onClick={() => setActiveTab("diagnoses")}
                className={`pb-2 text-sm font-medium transition-colors ${activeTab === "diagnoses" ? "border-b-2 border-teal-600 text-teal-600" : "text-slate-500 hover:text-slate-700"}`}
              >
                <Activity className="inline h-4 w-4 mr-1" /> Diagnoses
              </button>
            </div>

            <div className="pt-4 max-h-[50vh] overflow-y-auto">
              {activeTab === "appointments" && (
                <div className="space-y-4">
                  {history.appointments?.map((app) => (
                    <div
                      key={app._id}
                      className="p-4 border rounded-xl shadow-sm bg-slate-50"
                    >
                      <p className="font-medium text-slate-800">
                        {new Date(app.date).toLocaleDateString()} at{" "}
                        {app.timeSlot}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        Status: {app.status}
                      </p>
                    </div>
                  ))}
                  {!history.appointments?.length && (
                    <p className="text-sm text-slate-500 py-4">
                      No appointments found.
                    </p>
                  )}
                </div>
              )}
              {activeTab === "prescriptions" && (
                <div className="space-y-4">
                  {history.prescriptions?.map((rx) => (
                    <div
                      key={rx._id}
                      className="p-4 border border-teal-100 rounded-xl shadow-sm bg-teal-50/50"
                    >
                      <h4 className="font-bold text-teal-800">
                        Diagnosis: {rx.diagnosis}
                      </h4>
                      <div className="mt-3 space-y-2">
                        {rx.medicines?.map((m, i) => (
                          <div
                            key={i}
                            className="text-sm flex justify-between bg-white px-3 py-2 rounded-lg border border-teal-50"
                          >
                            <span className="font-medium">{m.name}</span>
                            <span className="text-slate-500">
                              {m.dosage} | {m.frequency} x {m.duration}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!history.prescriptions?.length && (
                    <p className="text-sm text-slate-500 py-4">
                      No prescriptions found.
                    </p>
                  )}
                </div>
              )}
              {activeTab === "diagnoses" && (
                <div className="space-y-4">
                  {history.diagnoses?.map((diag) => (
                    <div
                      key={diag._id}
                      className="p-4 border border-indigo-100 rounded-xl shadow-sm bg-indigo-50/50"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex gap-2 flex-wrap mb-2">
                          {diag.symptoms?.map((s, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-white text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded font-bold uppercase ${diag.riskLevel === "high" ? "bg-red-100 text-red-700" : "bg-indigo-100 text-indigo-700"}`}
                        >
                          Risk: {diag.riskLevel}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 mt-3 font-medium">
                        Doctor Notes:{" "}
                        <span className="font-normal text-slate-600">
                          {diag.doctorNotes || "None"}
                        </span>
                      </p>
                    </div>
                  ))}
                  {!history.diagnoses?.length && (
                    <p className="text-sm text-slate-500 py-4">
                      No diagnoses found.
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-slate-500 text-sm py-8 text-center">
            Failed to load history.
          </p>
        )}
      </Modal>
    </div>
  );
};

export default PatientHistory;
