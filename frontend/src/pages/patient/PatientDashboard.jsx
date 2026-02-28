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
} from "lucide-react";
import { Link } from "react-router-dom";

const PatientDashboard = () => {
  const { user } = useAuth();

  // We fetch history using the logged-in user's profile ID
  // In our model structure, assuming patient _id maps to User's profile or we get patient by email
  // Assuming useAuth gives us the patient document ID or we use a "me" endpoint variant.
  // We'll query useGetPatientHistoryQuery("me") assuming backend handles "me" or patient's own ID.
  const { data: history, isLoading } = useGetPatientHistoryQuery(
    user?.profileId || "me",
  );

  if (isLoading)
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const { basicInfo, appointments = [], prescriptions = [] } = history || {};

  const recentAppointments = appointments.slice(0, 3);
  const recentPrescriptions = prescriptions.slice(0, 3);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <PageHeader
        title={`Welcome, ${basicInfo?.name || user?.name || "Patient"}`}
        description="View your medical records and upcoming appointments."
      />

      {/* Patient Profile Snapshot */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 p-8 rounded-2xl shadow-lg border border-teal-500 text-white flex flex-col md:flex-row items-center gap-8">
        <div className="h-24 w-24 bg-white/20 backdrop-blur-md rounded-full shadow-inner flex items-center justify-center border-4 border-white/30 text-4xl font-black shrink-0">
          {(basicInfo?.name || user?.name || "P").charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-6 w-full text-center md:text-left">
          <div>
            <span className="text-teal-200 text-sm font-semibold uppercase tracking-wider block mb-1">
              Age / Gender
            </span>
            <span className="font-bold text-xl">
              {basicInfo?.age || "--"} /{" "}
              <span className="capitalize">{basicInfo?.gender || "--"}</span>
            </span>
          </div>
          <div>
            <span className="text-teal-200 text-sm font-semibold uppercase tracking-wider block mb-1 flex justify-center md:justify-start items-center gap-1">
              <Droplet className="h-4 w-4" /> Blood
            </span>
            <span className="font-bold text-xl">
              {basicInfo?.bloodGroup || "Unknown"}
            </span>
          </div>
          <div>
            <span className="text-teal-200 text-sm font-semibold uppercase tracking-wider block mb-1 flex justify-center md:justify-start items-center gap-1">
              <Phone className="h-4 w-4" /> Contact
            </span>
            <span className="font-bold text-lg leading-tight block">
              {basicInfo?.contact || "--"}
            </span>
          </div>
          <div className="flex justify-center md:justify-end items-center">
            <Link
              to="/patient/profile"
              className="px-4 py-2 bg-white text-teal-700 font-bold rounded-xl text-sm hover:bg-teal-50 shadow-md transition-all"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Appointments Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-teal-600" /> Recent
              Appointments
            </h3>
            <Link
              to="/patient/appointments"
              className="text-sm font-medium text-teal-600 hover:text-teal-700"
            >
              View All →
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {recentAppointments.length === 0 ? (
              <p className="text-center text-slate-500 py-6">
                No appointments yet.
              </p>
            ) : (
              recentAppointments.map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100"
                >
                  <div>
                    <h4 className="font-bold text-slate-800">
                      {new Date(app.date).toLocaleDateString()} at{" "}
                      {app.timeSlot}
                    </h4>
                    <p className="text-sm text-slate-500 mt-1">
                      Status:{" "}
                      <span className="uppercase font-semibold text-slate-600">
                        {app.status}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Prescriptions Preview */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileText className="h-5 w-5 text-indigo-600" /> Recent
              Prescriptions
            </h3>
            <Link
              to="/patient/prescriptions"
              className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View All →
            </Link>
          </div>
          <div className="p-6 space-y-4">
            {recentPrescriptions.length === 0 ? (
              <p className="text-center text-slate-500 py-6">
                No prescriptions found.
              </p>
            ) : (
              recentPrescriptions.map((rx) => (
                <div
                  key={rx._id}
                  className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 flex justify-between items-center"
                >
                  <div>
                    <h4 className="font-bold tracking-tight text-indigo-900">
                      {rx.diagnosis}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-1">
                      {new Date(rx.createdAt).toLocaleDateString()} •{" "}
                      {rx.medicines?.length} medicines prescribed
                    </p>
                  </div>
                  <Link
                    to={`/patient/prescriptions`}
                    className="text-indigo-600 p-2 hover:bg-indigo-100 rounded-lg transition-colors"
                  >
                    <FileText className="h-5 w-5" />
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
