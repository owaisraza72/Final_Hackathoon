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
    <aside className="w-64 bg-slate-900 text-white flex flex-col items-center">
      {/* Clinic/App Logo Area */}
      <div className="h-16 flex items-center justify-center w-full border-b border-slate-800">
        <h1 className="text-xl font-bold tracking-wider text-teal-400">
          ClinicOS
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 w-full px-4 py-6 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-teal-500 text-white shadow-lg"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {link.icon}
              <span className="font-medium">{link.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Subscription/Clinic Info */}
      {user?.clinicId && role === "ADMIN" && (
        <div className="mb-6 px-4 w-full">
          <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
            <p className="text-xs text-slate-400 mb-1">Current Plan</p>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-teal-400/10 px-2 py-1 text-xs font-medium text-teal-400 ring-1 ring-inset ring-teal-400/20">
                PRO ACTIVE
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
