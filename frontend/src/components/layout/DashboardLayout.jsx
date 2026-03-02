import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "@/hooks/useAuth";
import { LogOut, Bell, Zap } from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  // FIXED: Add subscription status display in header
  // For now, we'll show subscription tier if available in user data
  // In a full implementation, this would come from clinic info API
  const subscriptionTier = user?.subscriptionPlan || "FREE";
  const isPro = subscriptionTier === "PRO";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full relative z-10">
        {/* Top Header */}
        <header className="h-20 glass-card border-b border-slate-200/50 flex items-center justify-between px-10 shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block tracking-tight">
              Hello,{" "}
              <span className="text-teal-600 font-black">
                {user?.name?.split(" ")[0] || "User"}
              </span>
            </h2>
            {/* FIXED: Show subscription tier badge */}
            <div
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                isPro
                  ? "bg-amber-50 text-amber-700 border border-amber-200"
                  : "bg-slate-100 text-slate-600 border border-slate-200"
              }`}
            >
              <Zap className="h-3.5 w-3.5" />
              {subscriptionTier} Plan
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <button className="p-2.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-xl transition-all relative group">
                <Bell className="h-5 w-5 transition-transform group-hover:rotate-12" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-teal-500 ring-2 ring-white"></span>
              </button>
            </div>

            <div className="w-px h-8 bg-slate-200"></div>

            <div className="flex items-center gap-4">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-black text-slate-800 leading-none mb-1">
                  {user?.name}
                </span>
                <span className="text-[10px] font-bold text-teal-600 uppercase tracking-widest bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                  {user?.role}
                </span>
              </div>
              <div className="h-11 w-11 rounded-2xl clinical-gradient p-[2px] shadow-lg shadow-teal-500/10">
                <div className="h-full w-full bg-white rounded-[14px] flex items-center justify-center text-teal-700 font-black text-lg">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </div>
              </div>
              <button
                onClick={logout}
                className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
