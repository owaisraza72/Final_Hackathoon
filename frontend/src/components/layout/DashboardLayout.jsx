import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import useAuth from "@/hooks/useAuth";
import { LogOut, Bell } from "lucide-react";

const DashboardLayout = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Area */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center">
            <h2 className="text-lg font-semibold text-slate-800 hidden sm:block">
              Welcome back, {user?.name || "User"} 👋
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-teal-600 transition-colors relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-medium text-slate-700">
                  {user?.name}
                </span>
                <span className="text-xs text-slate-500 capitalize">
                  {user?.role?.toLowerCase()}
                </span>
              </div>
              <div className="h-9 w-9 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
              <button
                onClick={logout}
                className="ml-2 p-2 text-slate-400 hover:text-red-500 transition-colors"
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
