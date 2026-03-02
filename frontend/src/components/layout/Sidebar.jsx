import { Link, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import {
  Users,
  UserPlus,
  FileText,
  CalendarRange,
  Stethoscope,
  Activity,
  Settings,
  LayoutDashboard,
  BrainCircuit,
  History,
} from "lucide-react";

const getNavLinks = (role) => {
  switch (role) {
    case "ADMIN":
      return [
        {
          name: "Dashboard",
          path: ROUTES.ADMIN_DASHBOARD,
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          name: "Manage Doctors",
          path: "/admin/doctors",
          icon: <Stethoscope className="h-5 w-5" />,
        },
        {
          name: "Manage Receptionists",
          path: "/admin/receptionists",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Subscription",
          path: "/admin/subscription",
          icon: <Settings className="h-5 w-5" />,
        },
      ];
    case "DOCTOR":
      return [
        {
          name: "Dashboard",
          path: ROUTES.DOCTOR_DASHBOARD,
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          name: "My Appointments",
          path: "/doctor/appointments",
          icon: <CalendarRange className="h-5 w-5" />,
        },
        {
          name: "Patient History",
          path: "/doctor/patients",
          icon: <History className="h-5 w-5" />,
        },
        {
          name: "AI Assistant",
          path: "/doctor/ai",
          icon: <BrainCircuit className="h-5 w-5" />,
        },
      ];
    case "RECEPTIONIST":
      return [
        {
          name: "Dashboard",
          path: ROUTES.RECEPTIONIST_DASHBOARD,
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          name: "All Patients",
          path: "/receptionist/patients",
          icon: <Users className="h-5 w-5" />,
        },
        {
          name: "Register Patient",
          path: "/receptionist/patients/new",
          icon: <UserPlus className="h-5 w-5" />,
        },
        {
          name: "Book Appointment",
          path: "/receptionist/appointments/new",
          icon: <CalendarRange className="h-5 w-5" />,
        },
        {
          name: "Daily Schedule",
          path: "/receptionist/schedule",
          icon: <Activity className="h-5 w-5" />,
        },
      ];
    case "PATIENT":
      return [
        {
          name: "Dashboard",
          path: ROUTES.PATIENT_DASHBOARD,
          icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
          name: "My History",
          path: "/patient/appointments",
          icon: <History className="h-5 w-5" />,
        },
        {
          name: "My Prescriptions",
          path: "/patient/prescriptions",
          icon: <FileText className="h-5 w-5" />,
        },
      ];
    default:
      return [];
  }
};

const Sidebar = () => {
  const { role, user } = useAuth();
  const location = useLocation();
  const navLinks = getNavLinks(role);

  return (
    <aside className="w-72 sidebar-gradient text-white flex flex-col shrink-0 relative z-20">
      {/* Clinic/App Logo Area */}
      <div className="h-20 flex items-center px-8 mb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 clinical-gradient rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/20">
            <Stethoscope className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">
              Clinic<span className="text-teal-400">OS</span>
            </h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mt-1">
              Smart Healthcare
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full px-4 space-y-1.5 overflow-y-auto pt-2">
        <p className="px-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-4">
          Menu
        </p>
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive
                  ? "bg-teal-500/15 text-teal-400 border border-teal-500/20 shadow-[0_0_20px_rgba(20,184,166,0.1)]"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
              }`}
            >
              <div
                className={`transition-colors duration-300 ${isActive ? "text-teal-400" : "text-slate-500 group-hover:text-slate-300"}`}
              >
                {link.icon}
              </div>
              <span className="font-semibold text-[15px]">{link.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,1)]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Subscription/Clinic Info */}
      <div className="p-4 mt-auto">
        <div className="bg-slate-800/40 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-bold text-slate-500 uppercase">
              System Status
            </p>
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-0.5">
              Clinic OS Matrix
            </span>
            <span
              className={`inline-flex w-fit items-center rounded-lg px-2.5 py-1 text-[10px] font-black border uppercase tracking-wider ${
                user?.subscriptionPlan === "PRO"
                  ? "bg-teal-500/10 text-teal-400 border-teal-500/20"
                  : "bg-slate-500/10 text-slate-400 border-slate-500/20"
              }`}
            >
              {user?.subscriptionPlan || "FREE"} Tier
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
