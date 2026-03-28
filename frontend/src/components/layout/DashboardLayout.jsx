import { Link, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import useAuth from "@/hooks/useAuth";
import {
  LogOut,
  Bell,
  Zap,
  ChevronDown,
  Settings,
  User,
  HelpCircle,
  Moon,
  Sun,
  Calendar,
  Activity,
  Shield,
  Sparkles,
  ChevronRight,
  Clock,
  Award,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TopNavNotifications from "../notifications/TopNavNotifications";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [theme, setTheme] = useState("light");
  const [currentTime, setCurrentTime] = useState(new Date());

  const subscriptionTier = user?.subscriptionPlan || "FREE";
  const isPro = subscriptionTier === "PRO";

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "ADMIN":
        return "from-teal-600 to-emerald-600";
      case "DOCTOR":
        return "from-teal-600 to-emerald-600";
      case "RECEPTIONIST":
        return "from-teal-600 to-emerald-600";
      case "PATIENT":
        return "from-teal-600 to-emerald-600";
      default:
        return "from-teal-600 to-emerald-600";
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 overflow-hidden">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Top Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="h-20 bg-white/80 backdrop-blur-xl border-b border-slate-200/50 flex items-center justify-between px-6 lg:px-10 shrink-0 sticky top-0 z-30 shadow-sm"
        >
          {/* Left Section - Greeting */}
          <div className="flex items-center gap-4">
            <div>
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight"
              >
                {getGreeting()},{" "}
                <span
                  className={`bg-gradient-to-r ${getRoleColor()} bg-clip-text text-transparent font-black`}
                >
                  {user?.name?.split(" ")[0] || "User"}
                </span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-xs text-slate-500 hidden sm:flex items-center gap-1 mt-1"
              >
                <Clock className="h-3 w-3" />
                {currentTime.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                <span className="w-1 h-1 rounded-full bg-slate-300 mx-1" />
                <Activity className="h-3 w-3 text-teal-500" />
                System Online
              </motion.p>
            </div>

            {/* Subscription Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className={`hidden md:flex items-center gap-2 px-4 py-2 rounded-xl border ${
                isPro
                  ? "bg-gradient-to-r from-amber-50 to-amber-100/50 border-amber-200"
                  : "bg-slate-100 border-slate-200"
              }`}
            >
              <Zap
                className={`h-4 w-4 ${isPro ? "text-amber-500" : "text-slate-500"}`}
              />
              <div>
                <p className="text-xs font-bold text-slate-700">
                  {subscriptionTier} Plan
                </p>
                <p className="text-[8px] text-slate-500 uppercase tracking-wider">
                  {isPro ? "Enterprise features active" : "Upgrade for more"}
                </p>
              </div>
              {!isPro && (
                <button className="ml-2 px-2 py-1 bg-gradient-to-r from-teal-500 to-indigo-500 text-white text-[8px] font-bold rounded-md hover:from-teal-600 hover:to-indigo-600 transition-colors">
                  UPGRADE
                </button>
              )}
            </motion.div>
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <div className="hidden lg:flex items-center gap-2 mr-2">
              <motion.button
                whileHover={{ scale: 1.05, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
              >
                <Calendar className="h-5 w-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-600 transition-colors"
              >
                {theme === "light" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </motion.button>
            </div>

            {/* Notifications */}
            <TopNavNotifications
              isOpen={showNotifications}
              setIsOpen={setShowNotifications}
            />

            <div className="w-px h-8 bg-slate-200 mx-2"></div>

            {/* User Menu */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-3 group"
              >
                <div className="flex flex-col items-end hidden md:flex">
                  <span className="text-sm font-black text-slate-800 leading-none mb-1 group-hover:text-teal-600 transition-colors">
                    {user?.name}
                  </span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <Shield className="h-3 w-3 text-teal-500" />
                    {user?.role}
                  </span>
                </div>

                <div className="relative">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${getRoleColor()} opacity-20 blur-md`}
                  />
                  <div
                    className={`relative h-12 w-12 rounded-2xl bg-gradient-to-r ${getRoleColor()} p-[2px] shadow-xl`}
                  >
                    <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center">
                      <span
                        className={`text-lg font-black bg-gradient-to-r ${getRoleColor()} bg-clip-text text-transparent`}
                      >
                        {user?.name?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                    showUserMenu ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              {/* User Dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50"
                  >
                    {/* User Info Header */}
                    <div className={`p-4 bg-gradient-to-r ${getRoleColor()}`}>
                      <p className="text-white font-bold">{user?.name}</p>
                      <p className="text-white/80 text-xs mt-1">
                        {user?.email}
                      </p>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                      <Link
                        to={`/${user?.role?.toLowerCase()}/profile`}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center">
                          <User className="h-4 w-4 text-slate-600 group-hover:text-teal-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-slate-700">
                            Profile
                          </p>
                          <p className="text-[10px] text-slate-400">
                            View your profile
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </Link>

                      <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group">
                        <div className="h-8 w-8 rounded-lg bg-slate-100 group-hover:bg-teal-50 flex items-center justify-center">
                          <HelpCircle className="h-4 w-4 text-slate-600 group-hover:text-teal-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-slate-700">
                            Help & Support
                          </p>
                          <p className="text-[10px] text-slate-400">
                            Get assistance
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>

                      <div className="my-2 h-px bg-slate-100" />

                      {/* Logout Button */}
                      <motion.button
                        whileHover={{ x: 5 }}
                        onClick={logout}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 transition-colors group"
                      >
                        <div className="h-8 w-8 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center">
                          <LogOut className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-sm font-medium text-red-600">
                            Logout
                          </p>
                          <p className="text-[10px] text-red-400">
                            End your session
                          </p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-red-400" />
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.header>

        {/* Dynamic Page Content */}
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 overflow-y-auto p-6 lg:p-8 scroll-smooth"
        >
          <Outlet />
        </motion.main>

        {/* Floating Status Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="fixed bottom-4 right-4 flex items-center gap-3 bg-white/90 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-slate-200 text-xs z-40"
        >
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-slate-600 font-medium">System Online</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <div className="flex items-center gap-1">
            <Shield className="h-3 w-3 text-teal-500" />
            <span className="text-slate-600">HIPAA</span>
          </div>
          <div className="w-px h-4 bg-slate-200" />
          <span className="text-slate-600 font-mono">v2.4.0</span>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardLayout;
