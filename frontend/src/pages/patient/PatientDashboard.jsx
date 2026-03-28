import { useState, useEffect } from "react";
import { useGetPatientHistoryQuery } from "@/features/patients/patientApi";
import useAuth from "@/hooks/useAuth";
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
  Clock,
  HeartPulse,
  CircleCheckBig,
  Pill,
  ChevronRight,
  Sparkles,
  Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const PatientDashboard = () => {
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const {
    data: history,
    isLoading,
    error,
  } = useGetPatientHistoryQuery(user?._id, {
    skip: !user?._id,
  });

  if (isLoading) {
    return (
      <div className="flex h-[60vh] justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-[40px] p-6 text-center">
          <p className="text-red-600 font-semibold">
            Unable to load patient history
          </p>
          <p className="text-sm text-red-500 mt-1">
            Please try again or contact support.
          </p>
        </div>
      </div>
    );
  }

  const { patient: basicInfo, appointments = [], prescriptions = [], diagnoses = [] } = history || {};
  
  const now = new Date();
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  
  const pendingAppointments = appointments.filter(app => app.status === "pending" || app.date > new Date().toISOString());
  const completedAppointments = appointments.filter(app => app.status === "completed");

  const recentAppointments = appointments.slice(0, 5);
  const recentPrescriptions = prescriptions.slice(0, 4);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8 pb-10 px-4 sm:px-6"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Patient<span className="text-teal-500">Dashboard</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">
                Welcome back, {basicInfo?.name || user?.name || "Patient"}
              </p>
            </div>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1 text-xs">
            <Clock className="h-3 w-3" />
            {currentTime.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            • {now.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>

        {/* Live Status Badge */}
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-2 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2 px-4 py-2">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500/50"
              />
            </div>
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Protected Records
            </span>
          </div>
          <div className="w-px h-6 bg-slate-200" />
          <Link
            to="/patient/appointments"
            className="px-5 py-2 bg-gradient-to-r from-teal-400 to-teal-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:from-teal-500 hover:to-teal-700 transition-all flex items-center gap-2 shadow-lg shadow-teal-500/20 group"
          >
            <CalendarCheck className="h-4 w-4 group-hover:scale-110 transition-transform" />
            New Booking
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        <StatCard
          title="Total Visits"
          value={completedAppointments.length}
          icon={<CircleCheckBig className="h-6 w-6" />}
          description="Completed appointments"
          trend={`${appointments.length} total booked`}
          trendUp={completedAppointments.length > 0}
          color="from-teal-400 to-teal-600"
        />
        <StatCard
          title="Upcoming"
          value={pendingAppointments.length}
          icon={<Clock className="h-6 w-6" />}
          description="Pending appointments"
          trend={pendingAppointments.length > 0 ? "Action required" : "All caught up"}
          trendUp={pendingAppointments.length === 0}
          color="from-amber-400 to-orange-500"
        />
        <StatCard
          title="Prescriptions"
          value={prescriptions.length}
          icon={<Pill className="h-6 w-6" />}
          description="Medical directives"
          trend={`${recentPrescriptions.length} recent`}
          trendUp={prescriptions.length > 0}
          color="from-indigo-400 to-blue-500"
        />
        <StatCard
          title="AI Insights"
          value={diagnoses.length}
          icon={<BrainCircuit className="h-6 w-6" />}
          description="Diagnostic logs"
          trend="Gemini powered"
          trendUp={true}
          color="from-purple-400 to-pink-500"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Consultations */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-slate-50 to-white">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800">
                    Recent Encounters
                  </h3>
                  <p className="text-xs text-slate-500">
                    Your appointment history
                  </p>
                </div>
              </div>
              <Link
                to="/patient/appointments"
                className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                View timeline
              </Link>
            </div>

            <div className="p-6 space-y-4">
              {recentAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarCheck className="h-10 w-10 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">
                    No Appointments Yet
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Book your first consultation to get started
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {recentAppointments.map((app, index) => (
                    <motion.div
                      key={app._id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, x: 4 }}
                      className="group"
                    >
                      <Link
                        to="/patient/appointments"
                        className="flex flex-wrap items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-16 text-center">
                            <span className="block text-xl font-black text-teal-600">
                              {new Date(app.date).toLocaleDateString("en-US", { day: "2-digit" })}
                            </span>
                            <span className="text-[10px] font-bold uppercase text-slate-400">
                              {new Date(app.date).toLocaleDateString("en-US", { month: "short" })}
                            </span>
                          </div>
                          
                          <div className="w-px h-10 bg-slate-100" />

                          <div>
                            <h4 className="font-black text-slate-800 text-sm group-hover:text-teal-700 transition-colors">
                              {app.reason || "General Consultation"}
                            </h4>
                            <div className="flex items-center gap-3 mt-1">
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <Clock className="h-3 w-3" />
                                {app.timeSlot}
                              </div>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                                <Stethoscope className="h-3 w-3" />
                                Dr. {app.doctorId?.name?.split(" ")[0] || "Doctor"}
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mt-2 sm:mt-0">
                          <div
                            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5 ${
                              app.status === "pending"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : app.status === "completed"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                                  : "bg-red-50 text-red-600 border-red-200"
                            }`}
                          >
                            {app.status}
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Profile & Prescriptions */}
        <motion.div variants={itemVariants} className="space-y-6">
          {/* Health Demographics Card */}
          <div className="bg-gradient-to-br from-teal-500 to-teal-700 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <HeartPulse className="w-32 h-32" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-6 flex items-center gap-2 relative z-10">
              <User className="h-4 w-4" />
              My Profile
            </h3>
            
            <div className="flex items-center gap-4 mb-6 relative z-10">
              <div className="h-16 w-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-3xl font-black shadow-inner border border-white/20">
                {(basicInfo?.name || user?.name || "P").charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="text-xl font-black tracking-tight">{basicInfo?.name || user?.name}</h4>
                <p className="text-teal-100 text-xs font-medium uppercase tracking-widest mt-1">Patient Identity</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="block text-[9px] text-teal-200 font-bold uppercase tracking-wider mb-1">Age</span>
                <span className="font-black text-lg">{basicInfo?.age || "--"}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10">
                <span className="block text-[9px] text-teal-200 font-bold uppercase tracking-wider mb-1">Gender</span>
                <span className="font-black text-lg capitalize">{basicInfo?.gender || "--"}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/10 col-span-2 flex items-center justify-between">
                <div>
                  <span className="block text-[9px] text-teal-200 font-bold uppercase tracking-wider mb-1">Blood Group</span>
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-rose-300" />
                    <span className="font-black text-lg">{basicInfo?.bloodGroup || "O+"}</span>
                  </div>
                </div>
                <Link to="/patient/profile" className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Prescriptions */}
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-500" />
                Formularies
              </h3>
              <Link to="/patient/prescriptions" className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {recentPrescriptions.length === 0 ? (
                <div className="text-center py-6 pb-2">
                  <Pill className="h-8 w-8 text-slate-200 mx-auto mb-2" />
                  <p className="text-xs text-slate-400 font-medium">No active prescriptions</p>
                </div>
              ) : (
                recentPrescriptions.map((rx) => (
                  <Link
                    key={rx._id}
                    to="/patient/prescriptions"
                    className="flex justify-between items-center p-3 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{rx.diagnosis}</h4>
                        <p className="text-[9px] font-bold text-slate-400 mt-0.5">
                          {rx.medicines?.length || 0} meds • {new Date(rx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500" />
                  </Link>
                ))
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default PatientDashboard;
