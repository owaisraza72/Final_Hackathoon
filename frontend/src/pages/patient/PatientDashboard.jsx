import { useGetPatientHistoryQuery } from "@/features/patients/patientApi";
import useAuth from "@/hooks/useAuth";
import PageHeader from "@/components/ui/PageHeader";
import StatCard from "@/components/ui/StatCard";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import {
  User,
  Activity,
  FileText,
  CalendarCheck,
  Droplet,
  Phone,
  BrainCircuit,
  ArrowRight,
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { user } = useAuth();

  // Patients can now view their own history!
  const {
    data: history,
    isLoading,
    error,
  } = useGetPatientHistoryQuery(user?._id, {
    skip: !user?._id,
  });

  // FIXED: Handle loading, errors, and missing data
  if (isLoading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  // Handle error or missing data
  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <PageHeader
          title="Patient History"
          description="View patient medical records"
        />
        <div className="bg-red-50 border border-red-200 rounded-[40px] p-6 text-center">
          <p className="text-red-600 font-semibold">
            Unable to load patient history
          </p>
          <p className="text-sm text-red-500 mt-1">
            Please try again or select another patient
          </p>
        </div>
      </div>
    );
  }

  const { basicInfo, appointments = [], prescriptions = [] } = history || {};

  const recentAppointments = appointments.slice(0, 3);
  const recentPrescriptions = prescriptions.slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Medical Command Center"
          description="Your real-time consolidated health profile and record access."
        />
        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-4 py-2 border-r border-slate-100 flex flex-col items-center">
            <span className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
              Active Status
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-slate-700">
                Protected
              </span>
            </div>
          </div>
          <Link
            to="/patient/appointments"
            className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-xl hover:bg-teal-600 transition-all shadow-xl shadow-slate-900/10"
          >
            New Booking
          </Link>
        </div>
      </div>

      {/* Premium Patient Banner */}
      <div className="relative group perspective-1000">
        <div className="absolute inset-x-0 -bottom-10 h-20 bg-emerald-500/10 blur-[100px] pointer-events-none" />
        <div className="relative bg-white rounded-[40px] border border-slate-200/60 p-1 premium-shadow overflow-hidden transition-all duration-500 hover:scale-[1.01]">
          <div className="clinical-gradient p-10 flex flex-col xl:flex-row items-center gap-10">
            {/* Avatar Stack */}
            <div className="relative shrink-0">
              <div className="h-32 w-32 bg-white/10 backdrop-blur-xl rounded-[32px] border-2 border-white/20 flex items-center justify-center text-5xl font-black text-white shadow-2xl overflow-hidden group-hover:rotate-3 transition-transform duration-700">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                {(basicInfo?.name || user?.name || "P").charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-white rounded-2xl flex items-center justify-center shadow-lg text-teal-600 border border-teal-50">
                <User className="h-5 w-5" />
              </div>
            </div>

            {/* Core Health Metrics */}
            <div className="flex-1 w-full grid grid-cols-2 md:grid-cols-4 gap-10">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-emerald-200 tracking-[0.2em]">
                  Patient Identity
                </p>
                <h2 className="text-2xl font-black text-white tracking-tight truncate">
                  {basicInfo?.name || user?.name || "Accessing..."}
                </h2>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-emerald-200 tracking-[0.2em]">
                  Demographics
                </p>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-white/10 text-white rounded-lg text-xs font-black uppercase">
                    {basicInfo?.age || "--"} Yrs
                  </span>
                  <span className="px-2 py-0.5 bg-white/10 text-white rounded-lg text-xs font-black uppercase">
                    {basicInfo?.gender || "--"}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase text-emerald-200 tracking-[0.2em]">
                  Bio-Marker
                </p>
                <div className="flex items-center gap-2">
                  <Droplet className="h-4 w-4 text-emerald-200" />
                  <span className="text-xl font-black text-white">
                    {basicInfo?.bloodGroup || "O+"}
                  </span>
                </div>
              </div>
              <div className="flex items-center justify-center md:justify-end">
                <Link
                  to="/patient/appointments"
                  className="h-14 px-8 bg-white/10 hover:bg-white text-white hover:text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all border border-white/20 backdrop-blur-md flex items-center gap-3 active:scale-95"
                >
                  Medical Access <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Appointments Engine */}
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <CalendarCheck className="h-6 w-6 text-teal-600" />
              Scheduled Consultations
            </h3>
            <Link
              to="/patient/appointments"
              className="px-4 py-2 rounded-xl text-xs font-black text-teal-600 bg-teal-50 hover:bg-teal-100 uppercase tracking-widest transition-all"
            >
              All Bookings
            </Link>
          </div>
          <div className="p-8 space-y-4">
            {recentAppointments.length === 0 ? (
              <div className="text-center py-16 opacity-30">
                <CalendarCheck className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No Active Bookings
                </p>
              </div>
            ) : (
              recentAppointments.map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between items-center p-5 bg-white rounded-3xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-slate-700 text-xs shadow-sm">
                      {new Date(app.date).toLocaleDateString("en-US", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-800 tracking-tight group-hover:text-teal-900 transition-colors">
                        General Consultation
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        Slot: {app.timeSlot}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border rounded-xl shadow-sm ${
                      app.status === "pending"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-slate-50 text-slate-400 border-slate-100"
                    }`}
                  >
                    {app.status}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* AI Analytical History */}
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden">
          <div className="p-8 border-b border-indigo-100/30 flex justify-between items-center bg-indigo-50/20">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <BrainCircuit className="h-6 w-6 text-indigo-600" />
              AI Analytical History
            </h3>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[9px] font-black uppercase tracking-widest rounded-lg border border-indigo-200">
              Gemini Engine Active
            </span>
          </div>
          <div className="p-8 space-y-4">
            {!history?.diagnoses?.length ? (
              <div className="text-center py-16 opacity-30">
                <BrainCircuit className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No Analytical Logs
                </p>
              </div>
            ) : (
              history.diagnoses.slice(0, 3).map((diag) => (
                <div
                  key={diag._id}
                  className="p-5 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 transition-all group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {diag.symptoms?.slice(0, 3).map((s, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[9px] font-black uppercase rounded-lg border border-slate-100"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <span
                      className={`text-[8px] font-black px-2 py-0.5 rounded-lg uppercase ${diag.riskLevel === "high" ? "bg-red-50 text-red-500" : "bg-teal-50 text-teal-600"}`}
                    >
                      {diag.riskLevel} Risk
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-700 line-clamp-2">
                      {diag.aiParsed?.recommendations?.[0] ||
                        "No critical alerts detected."}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400">
                      Validated on{" "}
                      {new Date(diag.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Prescription Repository */}
        <div className="bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden lg:col-span-2">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              <FileText className="h-6 w-6 text-indigo-600" />
              Digital Formularies
            </h3>
            <Link
              to="/patient/prescriptions"
              className="px-4 py-2 rounded-xl text-xs font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 uppercase tracking-widest transition-all"
            >
              Vault Access
            </Link>
          </div>
          <div className="p-8 grid md:grid-cols-2 gap-4">
            {recentPrescriptions.length === 0 ? (
              <div className="text-center py-16 opacity-30 md:col-span-2">
                <FileText className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  Repository Empty
                </p>
              </div>
            ) : (
              recentPrescriptions.map((rx) => (
                <Link
                  key={rx._id}
                  to={`/patient/prescriptions`}
                  className="flex justify-between items-center p-5 bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/20 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-600 shadow-sm transition-transform group-hover:scale-110">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-black text-indigo-950 tracking-tight">
                        {rx.diagnosis}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                        {new Date(rx.createdAt).toLocaleDateString()} •{" "}
                        {rx.medicines?.length} Directives
                      </p>
                    </div>
                  </div>
                  <div className="h-10 w-10 flex items-center justify-center text-slate-300 group-hover:text-indigo-600 transition-colors">
                    <ArrowRight className="h-5 w-5 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300" />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
