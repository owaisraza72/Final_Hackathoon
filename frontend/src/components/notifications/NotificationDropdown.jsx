import { useState, useEffect } from "react";
import {
  useGetNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllReadMutation,
} from "@/features/notifications/notificationApi";
import {
  Bell,
  Check,
  Trash2,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  FileText,
  Activity,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = ({ isCollapsed, onClose }) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery();
  const [markRead] = useMarkAsReadMutation();
  const [markAllRead] = useMarkAllReadMutation();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case "SUCCESS":
        return <CheckCircle2 className="text-emerald-500" size={16} />;
      case "ERROR":
        return <AlertCircle className="text-red-500" size={16} />;
      case "APPOINTMENT":
        return <Calendar className="text-indigo-500" size={16} />;
      case "PRESCRIPTION":
        return <FileText className="text-teal-500" size={16} />;
      default:
        return <Bell className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group border border-transparent ${
          unreadCount > 0
            ? "bg-teal-500/10 text-teal-400 border-teal-500/20 shadow-[0_0_15px_rgba(45,212,191,0.1)]"
            : "text-slate-400 hover:bg-slate-800/80 hover:text-slate-100"
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Bell
            className={`h-5 w-5 transition-transform duration-300 ${unreadCount > 0 ? "active-notification" : "group-hover:rotate-12"}`}
          />
          {unreadCount > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-black text-white ring-2 ring-slate-900 shadow-lg shadow-red-500/40"
            >
              {unreadCount}
            </motion.div>
          )}
        </div>
        {!isCollapsed && (
          <div className="flex-1 flex items-center justify-between text-left">
            <span className="text-sm font-bold tracking-tight">
              Notifications
            </span>
            {unreadCount > 0 && (
              <span className="text-[10px] font-black bg-teal-500/20 text-teal-300 px-1.5 py-0.5 rounded-md">
                NEW
              </span>
            )}
          </div>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-[60]"
            />
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
                x: isCollapsed ? 60 : 0,
              }}
              animate={{ opacity: 1, scale: 1, y: 0, x: isCollapsed ? 60 : 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-16 left-0 w-80 bg-white rounded-[32px] shadow-2xl border border-slate-100/60 z-[70] overflow-hidden premium-shadow"
            >
              <div className="p-5 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-slate-900 flex items-center justify-center text-teal-400">
                    <Activity size={16} />
                  </div>
                  <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
                    Facility Feed
                  </h3>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="h-8 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest transition-colors flex items-center gap-1"
                  >
                    <Check size={10} /> Clear
                  </button>
                )}
              </div>

              <div className="max-h-[400px] overflow-y-auto custom-scrollbar bg-white">
                {isLoading ? (
                  <div className="p-16 flex flex-col items-center justify-center gap-4">
                    <div className="h-8 w-8 border-3 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                      Awaiting uplink...
                    </span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="h-16 w-16 bg-slate-50 rounded-[24px] flex items-center justify-center mx-auto mb-4 border border-slate-100/50 opacity-40">
                      <Bell size={24} className="text-slate-300" />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em]">
                      Zero Pulse Events
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <div
                        key={n._id}
                        onClick={() => {
                          if (!n.isRead) markRead(n._id);
                          if (onClose) onClose();
                        }}
                        className={`p-5 hover:bg-slate-50 transition-all cursor-pointer group relative ${!n.isRead ? "bg-indigo-50/20" : ""}`}
                      >
                        {!n.isRead && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                        )}
                        <div className="flex gap-4">
                          <div
                            className={`h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${!n.isRead ? "border-teal-100 shadow-teal-500/5" : ""}`}
                          >
                            <div className="relative">
                              {getTypeIcon(n.type)}
                              {!n.isRead && (
                                <div className="absolute inset-0 bg-teal-500/10 rounded-full blur-md" />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 pointer-events-none">
                            <div className="flex justify-between items-start mb-0.5">
                              <h5
                                className={`text-sm tracking-tight ${!n.isRead ? "font-black text-slate-900 uppercase" : "font-bold text-slate-600"}`}
                              >
                                {n.title}
                              </h5>
                              {!n.isRead && (
                                <Zap
                                  size={8}
                                  className="text-teal-500"
                                  fill="currentColor"
                                />
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 leading-normal line-clamp-2 font-medium">
                              {n.message}
                            </p>
                            <div className="flex items-center gap-1.5 mt-2.5 opacity-40">
                              <Clock size={8} />
                              <span className="text-[8px] font-black uppercase tracking-widest">
                                {formatDistanceToNow(new Date(n.createdAt), {
                                  addSuffix: true,
                                })}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-center">
                <button className="flex items-center gap-2 text-[8px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-[0.2em] transition-all">
                  Sync Audit Logs
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <style>{`
        .active-notification {
          animation: ring 1.5s ease-in-out infinite;
        }
        @keyframes ring {
          0% { transform: rotate(0); }
          10% { transform: rotate(15deg); }
          20% { transform: rotate(-15deg); }
          30% { transform: rotate(10deg); }
          40% { transform: rotate(-10deg); }
          50% { transform: rotate(0); }
          100% { transform: rotate(0); }
        }
      `}</style>
    </div>
  );
};

export default NotificationDropdown;
