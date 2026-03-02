import { ReactNode } from "react";

const StatCard = ({ title, value, icon, description, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 premium-shadow hover:-translate-y-1 transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-teal-50 group-hover:bg-teal-500 rounded-2xl text-teal-600 group-hover:text-white transition-all duration-300 shadow-sm">
          {icon}
        </div>
        {trend && (
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-tight ${
              trendUp
                ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                : "bg-red-50 text-red-600 border border-red-100"
            }`}
          >
            {trendUp ? "↑" : "↓"} {trend}
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-black text-slate-900 tracking-tighter">
            {value}
          </h4>
          {description && (
            <span className="text-xs font-medium text-slate-400">
              {description}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${trendUp ? "bg-teal-500 w-2/3" : "bg-amber-400 w-1/3"}`}
        />
      </div>
    </div>
  );
};

export default StatCard;
