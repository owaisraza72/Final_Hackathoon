import { 
  useGetNotificationsQuery, 
  useMarkAsReadMutation, 
  useMarkAllReadMutation 
} from "@/features/notifications/notificationApi";
import { 
  Bell, 
  Check, 
  Clock, 
  CircleCheckBig, 
  CircleAlert, 
  Calendar, 
  FileText,
  Sparkles,
  ShieldAlert,
  Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

const TopNavNotifications = ({ isOpen, setIsOpen }) => {
  const { data: notifications = [], isLoading } = useGetNotificationsQuery(undefined, {
    pollingInterval: 30000,
  });
  const [markRead] = useMarkAsReadMutation();
  const [markAllRead] = useMarkAllReadMutation();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getTypeIcon = (type) => {
    switch (type) {
      case "SUCCESS": return <CircleCheckBig className="text-emerald-500" size={16} />;
      case "ERROR": return <CircleAlert className="text-red-500" size={16} />;
      case "APPOINTMENT": return <Calendar className="text-indigo-500" size={16} />;
      case "PRESCRIPTION": return <FileText className="text-teal-500" size={16} />;
      default: return <Bell className="text-slate-400" size={16} />;
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2.5 rounded-2xl transition-all duration-300 group flex items-center justify-center border ${
          unreadCount > 0 
            ? "bg-teal-50 border-teal-100 text-teal-600 shadow-lg shadow-teal-500/10" 
            : "bg-slate-50 border-slate-100 text-slate-400 hover:text-teal-600 hover:bg-teal-50 hover:border-teal-100 shadow-sm"
        }`}
      >
        <div className="relative">
           <Bell className={`h-5 w-5 transition-all duration-300 ${unreadCount > 0 ? "scale-110 active-notification" : "group-hover:scale-110"}`} />
           {unreadCount > 0 && (
             <motion.div
               animate={{ scale: [1, 1.2, 1] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -top-0.5 -right-0.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white shadow-[0_0_8px_rgba(239,68,68,0.5)]"
             />
           )}
        </div>
        
        {unreadCount > 0 && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-2 text-[10px] font-black uppercase tracking-widest hidden lg:block"
          >
            {unreadCount} Alerts
          </motion.span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40"
            />
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute right-0 mt-4 w-96 bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden z-50 premium-shadow"
            >
              {/* Notifications Header */}
              <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-gradient-to-r from-slate-50/80 to-white/50">
                <div className="flex items-center gap-3">
                   <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-teal-400 border border-slate-800 shadow-inner">
                      <ShieldAlert size={18} />
                   </div>
                   <div>
                      <h3 className="font-black text-slate-900 text-sm uppercase tracking-tight">Clinical Alerts</h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Master Feed</p>
                   </div>
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="h-10 px-4 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2"
                  >
                    <Check size={12} /> Clear all
                  </button>
                )}
              </div>

              {/* Feed Content */}
              <div className="max-h-[480px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="p-16 flex flex-col items-center justify-center gap-4">
                    <div className="h-10 w-10 border-4 border-teal-500/10 border-t-teal-500 rounded-full animate-spin" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Synchronizing feed...</span>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="p-20 text-center">
                    <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-slate-100/50">
                      <Bell className="h-8 w-8 text-slate-200" />
                    </div>
                    <p className="text-sm font-black text-slate-700 tracking-tight uppercase">No active directives</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Grid is currently silent</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-50">
                    {notifications.map((n) => (
                      <motion.div
                        key={n._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => !n.isRead && markRead(n._id)}
                        className={`p-5 hover:bg-slate-50 transition-all cursor-pointer group relative ${!n.isRead ? "bg-teal-50/20" : ""}`}
                      >
                        {!n.isRead && (
                           <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-500" />
                        )}
                        <div className="flex gap-4">
                          <div className={`h-12 w-12 shrink-0 rounded-[18px] flex items-center justify-center bg-white shadow-sm border border-slate-100 group-hover:scale-110 transition-transform ${!n.isRead ? "border-teal-100 shadow-teal-500/5" : ""}`}>
                            <div className="relative">
                               {getTypeIcon(n.type)}
                               {!n.isRead && (
                                  <motion.div 
                                    animate={{ opacity: [0.4, 1, 0.4] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="absolute inset-0 bg-teal-500/20 rounded-full blur-md"
                                  />
                               )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                               <h5 className={`text-sm tracking-tight ${!n.isRead ? "font-black text-slate-900" : "font-bold text-slate-600"}`}>
                                 {n.title}
                               </h5>
                               <div className="flex items-center gap-1.5 opacity-40">
                                 <Clock size={10} />
                                 <span className="text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                                   {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                 </span>
                               </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium mt-1 line-clamp-2">
                              {n.message}
                            </p>
                            
                            <div className="flex items-center gap-3 mt-3">
                               <span className="px-2 py-0.5 bg-white border border-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:border-teal-200 group-hover:text-teal-600 transition-colors">
                                  {n.type || "SYSTEM"}
                               </span>
                               {!n.isRead && (
                                  <span className="flex items-center gap-1 text-[8px] font-black text-teal-600 uppercase tracking-widest">
                                     <Zap size={8} fill="currentColor" /> Priority
                                  </span>
                               )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-4 border-t border-slate-50 bg-slate-50/50">
                <button className="w-full h-12 flex items-center justify-center gap-2 text-[10px] font-black text-slate-400 hover:text-teal-600 uppercase tracking-[0.2em] transition-all group">
                   <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
                   Review Global History
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <style>{`
        .active-notification {
          animation: ring 1s ease-in-out infinite;
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

export default TopNavNotifications;


