import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
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
  HeartPulse,
  Shield,
  Sparkles,
  ChevronRight,
  LogOut,
  Bell,
  HelpCircle,
  Menu,
  X,
  UserRound,
  Home,
  Info,
  Mail,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NotificationDropdown from "../notifications/NotificationDropdown";

const getNavLinks = (role) => {
  switch (role) {
    case "ADMIN":
      return [
        {
          name: "Dashboard",
          path: ROUTES.ADMIN_DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          name: "Manage Doctors",
          path: "/admin/doctors",
          icon: Stethoscope,
        },
        {
          name: "Manage Receptionists",
          path: "/admin/receptionists",
          icon: Users,
        },
        {
          name: "Manage Patients",
          path: "/admin/patients",
          icon: UserRound,
        },
        {
          name: "All Appointments",
          path: "/admin/appointments",
          icon: CalendarRange,
        },
        {
          name: "All Prescriptions",
          path: "/admin/prescriptions",
          icon: FileText,
        },
        {
          name: "Subscription",
          path: "/admin/subscription",
          icon: Settings,
        },
        {
          name: "Back To Home",
          path: "/",
          icon: Home,
        },
      ];
    case "DOCTOR":
      return [
        {
          name: "Dashboard",
          path: ROUTES.DOCTOR_DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          name: "My Patients",
          path: "/doctor/patients",
          icon: Users,
        },
        {
          name: "My Appointments",
          path: "/doctor/appointments",
          icon: CalendarRange,
        },

        {
          name: "Prescriptions",
          path: "/doctor/prescriptions",
          icon: FileText,
        },
        {
          name: "AI Assistant",
          path: "/doctor/ai",
          icon: BrainCircuit,
        },
        {
          name: "Back To Home",
          path: "/",
          icon: Home,
        },
      ];
    case "RECEPTIONIST":
      return [
        {
          name: "Dashboard",
          path: ROUTES.RECEPTIONIST_DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          name: "All Patients",
          path: "/receptionist/patients",
          icon: Users,
        },
        {
          name: "Register Patient",
          path: "/receptionist/patients/new",
          icon: UserPlus,
        },
        {
          name: "Book Appointment",
          path: "/receptionist/appointments/new",
          icon: CalendarRange,
        },
        {
          name: "Daily Schedule",
          path: "/receptionist/schedule",
          icon: Activity,
        },
        {
          name: "Back To Home",
          path: "/",
          icon: Home,
        },
      ];
    case "PATIENT":
      return [
        {
          name: "Dashboard",
          path: ROUTES.PATIENT_DASHBOARD,
          icon: LayoutDashboard,
        },
        {
          name: "My History",
          path: "/patient/appointments",
          icon: History,
        },
        {
          name: "My Prescriptions",
          path: "/patient/prescriptions",
          icon: FileText,
        },
        {
          name: "Back To Home",
          path: "/",
          icon: Home,
        },
      ];
    default:
      return [];
  }
};

// Public navigation for non-authenticated users
const publicNavLinks = [
  { name: "Home", path: ROUTES.HOME, icon: Home },
  { name: "About", path: ROUTES.ABOUT, icon: Info },
  { name: "Contact", path: ROUTES.CONTACT, icon: Mail },
];

const Sidebar = () => {
  const { role, user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = isAuthenticated ? getNavLinks(role) : publicNavLinks;
  const isActive = (path) => location.pathname === path;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const sidebarVariants = {
    expanded: { width: 280 },
    collapsed: { width: 80 },
    mobile: { width: "100%", maxWidth: 320 },
  };

  const menuItemVariants = {
    hover: {
      x: 5,
      transition: { type: "spring", stiffness: 400, damping: 17 },
    },
    tap: { scale: 0.98 },
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 left-4 z-50 md:hidden bg-slate-800 text-white p-2.5 rounded-xl shadow-xl border border-slate-700"
      >
        {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={
          isMobileMenuOpen ? "mobile" : isCollapsed ? "collapsed" : "expanded"
        }
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`fixed md:static top-0 left-0 h-screen bg-slate-900 text-white flex flex-col z-50 shadow-2xl overflow-hidden ${
          isMobileMenuOpen ? "block" : "hidden md:block"
        }`}
      >
        {/* Header with Logo */}
        <div className="h-20 flex items-center px-4 border-b border-slate-800">
          <AnimatePresence mode="wait">
            {!isCollapsed ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-between w-full"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-600 flex items-center justify-center shadow-lg">
                    <HeartPulse className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-white">
                      Clinic<span className="text-cyan-300">OS</span>
                    </h1>
                    <p className="text-[8px] uppercase tracking-wider text-slate-500 font-bold">
                      HEALTHCARE OS
                    </p>
                  </div>
                </div>

                {/* Collapse Toggle */}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full flex items-center justify-between"
              >
                <div className="w-full flex justify-center">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center">
                    <HeartPulse className="h-6 w-6 text-white" />
                  </div>
                </div>

                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-slate-500 rotate-180" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="flex-1 w-full px-3 py-6 space-y-1 overflow-y-auto">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4"
              >
                {isAuthenticated ? "Menu" : "Navigation"}
              </motion.p>
            )}
          </AnimatePresence>

          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.path);

            return (
              <motion.div
                key={link.path}
                variants={menuItemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <Link
                  to={link.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                    active
                      ? "bg-gradient-to-r from-teal-500/20 to-indigo-500/20 text-white border border-teal-500/20"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-200"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "text-teal-400" : "text-slate-500"}`}
                  />

                  {!isCollapsed && (
                    <>
                      <span className="font-medium text-sm flex-1">
                        {link.name}
                      </span>
                      {active && (
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-400 shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                      )}
                    </>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-slate-800">
          {isAuthenticated ? (
            /* Authenticated Bottom Actions */
            <div className="space-y-2">
              <NotificationDropdown isCollapsed={isCollapsed} />

              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 transition-colors">
                <HelpCircle className="h-5 w-5" />
                {!isCollapsed && (
                  <span className="text-sm">Help & Support</span>
                )}
              </button>

              {/* Subscription Badge */}
              <div className="mt-4 p-3 rounded-xl bg-slate-800/50 border border-slate-700">
                {!isCollapsed ? (
                  <>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase mb-2">
                      System Status
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-400">
                        Clinic OS Matrix
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                          user?.subscriptionPlan === "PRO"
                            ? "bg-teal-500/20 text-teal-400 border border-teal-500/30"
                            : "bg-slate-700 text-slate-400"
                        }`}
                      >
                        {user?.subscriptionPlan || "FREE"} Tier
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-center">
                    <Sparkles className="h-5 w-5 text-teal-400" />
                  </div>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors mt-2"
              >
                <LogOut className="h-5 w-5" />
                {!isCollapsed && <span className="text-sm">Logout</span>}
              </button>
            </div>
          ) : (
            /* Non-Authenticated Bottom Section */
            <div className="space-y-3">
              {!isCollapsed ? (
                <>
                  <p className="text-xs text-slate-500 text-center">
                    Sign in to access your dashboard
                  </p>
                  <div className="flex gap-2">
                    <Link
                      to={ROUTES.LOGIN}
                      className="flex-1 py-2 px-3 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-xl text-center transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to={ROUTES.REGISTER}
                      className="flex-1 py-2 px-3 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white text-sm font-medium rounded-xl text-center transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <Link
                    to={ROUTES.LOGIN}
                    className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-slate-700 transition-colors"
                  >
                    <span className="text-white text-sm font-bold">In</span>
                  </Link>
                  <Link
                    to={ROUTES.REGISTER}
                    className="w-10 h-10 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center hover:from-teal-600 hover:to-indigo-600 transition-colors"
                  >
                    <span className="text-white text-sm font-bold">+</span>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
