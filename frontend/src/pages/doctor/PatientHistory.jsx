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
      header: "Patient Entity",
      accessor: "name",
      cell: (row) => (
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center group-hover:bg-teal-600 transition-all duration-500 shadow-sm relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent" />
            <span className="text-sm font-black text-slate-500 group-hover:text-white relative z-10">
              {row.name.charAt(0)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-black text-slate-800 tracking-tight text-lg group-hover:text-teal-900 transition-colors">
              {row.name}
            </span>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Clinical Master Record
            </span>
          </div>
        </div>
      ),
    },
    {
      header: "Biological Markers",
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
      header: "Comms Link",
      cell: (row) => (
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">
            Direct Contact
          </span>
          <span className="font-bold text-slate-600 tracking-tighter">
            {row.contact}
          </span>
        </div>
      ),
    },
    {
      header: "Information Node",
      cell: (row) => (
        <button
          onClick={() => handleViewHistory(row._id)}
          className="h-11 px-6 bg-slate-50 hover:bg-teal-600 text-teal-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-teal-100/50 transition-all duration-500 shadow-sm flex items-center gap-3 group"
        >
          <Clock className="h-4 w-4" />
          Access History
        </button>
      ),
    },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Personnel Registry"
          description="Access and synchronize universal medical histories for all registered patient nodes."
        />
        <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="px-4 py-2 text-slate-800 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
            Records Synchronized
          </div>
        </div>
      </div>

      {isLoadingPatients ? (
        <div className="flex h-[40vh] justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Hydrating Patient Data...
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-100/60 overflow-hidden">
          <DataTable
            columns={columns}
            data={patients || []}
            placeholder="Search within clinical archive..."
          />
        </div>
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
            ? `Medical Dossier: ${history?.patient?.name}`
            : "Patient History"
        }
      >
        {isLoadingHistory ? (
          <div className="flex h-[30vh] justify-center items-center">
            <div className="h-10 w-10 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : history ? (
          <div className="space-y-8 py-4">
            <div className="bg-slate-50 p-1.5 rounded-2xl flex gap-1 border border-slate-100">
              {[
                { id: "appointments", label: "Timeline", icon: <Clock /> },
                { id: "prescriptions", label: "Protocol", icon: <FileText /> },
                { id: "diagnoses", label: "Analysis", icon: <Activity /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-900/10"
                      : "text-slate-400 hover:text-slate-600 hover:bg-white"
                  }`}
                >
                  <span className="h-4 w-4">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="max-h-[60vh] overflow-y-auto px-1 space-y-6 custom-scrollbar pr-2">
              {activeTab === "appointments" && (
                <div className="space-y-4">
                  {history.appointments?.map((app) => (
                    <div
                      key={app._id}
                      className="p-5 rounded-[24px] border border-slate-100 bg-white shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest mb-1">
                            Temporal Encounter
                          </p>
                          <p className="font-black text-slate-800 text-lg">
                            {new Date(app.date).toLocaleDateString(undefined, {
                              dateStyle: "long",
                            })}
                          </p>
                          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-tighter">
                            {app.timeSlot} Protocol Locked
                          </p>
                        </div>
                        <div
                          className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                            app.status === "completed"
                              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                              : "bg-slate-50 text-slate-400 border border-slate-100"
                          }`}
                        >
                          {app.status}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!history.appointments?.length && (
                    <div className="text-center py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        No Historical Encounters Found.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "prescriptions" && (
                <div className="space-y-6">
                  {history.prescriptions?.map((rx) => (
                    <div
                      key={rx._id}
                      className="p-6 rounded-[32px] border border-teal-100/50 bg-teal-50/20 shadow-sm relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-[0.03]">
                        <FileText className="h-24 w-24 text-teal-900" />
                      </div>
                      <h4 className="font-black text-teal-900 text-lg mb-4 flex items-center gap-2">
                        <div className="h-2 w-2 bg-teal-500 rounded-full" />
                        Clinical Protocol: {rx.diagnosis}
                      </h4>
                      <div className="space-y-3">
                        {rx.medicines?.map((m, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between bg-white/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-teal-100/50 group hover:border-teal-400 transition-colors"
                          >
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-800">
                                {m.name}
                              </span>
                              <span className="text-[10px] font-black text-teal-600/60 uppercase tracking-widest">
                                {m.frequency}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                                {m.dosage}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  {!history.prescriptions?.length && (
                    <div className="text-center py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        Pharmaceutical Void Detected.
                      </p>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "diagnoses" && (
                <div className="space-y-6">
                  {history.diagnoses?.map((diag) => (
                    <div
                      key={diag._id}
                      className="p-6 rounded-[32px] border border-indigo-100/50 bg-indigo-50/20 shadow-sm"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-2 flex-wrap">
                          {diag.symptoms?.map((s, i) => (
                            <span
                              key={i}
                              className="px-3 py-1.5 bg-white text-indigo-700 text-[10px] font-black uppercase tracking-widest rounded-xl border border-indigo-100 shadow-sm"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                        <span
                          className={`text-[9px] px-3 py-1.5 rounded-xl font-black uppercase tracking-[0.2em] ${diag.riskLevel === "high" ? "bg-red-500 text-white shadow-lg shadow-red-500/20" : "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"}`}
                        >
                          Risk: {diag.riskLevel}
                        </span>
                      </div>
                      <div className="bg-white/60 p-5 rounded-2xl border border-indigo-100/50">
                        <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-1">
                          Doctor Analytical Notes
                        </p>
                        <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                          "
                          {diag.doctorNotes ||
                            "No analytical notes provided for this node."}
                          "
                        </p>
                      </div>
                    </div>
                  ))}
                  {!history.diagnoses?.length && (
                    <div className="text-center py-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                        No Analytical Nodes Active.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
              Protocol Sync Failed.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PatientHistory;
