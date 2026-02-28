import { ReactNode } from "react";

const StatCard = ({ title, value, icon, description, trend, trendUp }) => {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h4 className="text-3xl font-bold text-slate-800 mt-2">{value}</h4>
        </div>
        <div className="p-3 bg-teal-50 rounded-lg text-teal-600">{icon}</div>
      </div>

      {(description || trend) && (
        <div className="mt-4 flex items-center text-sm">
          {trend && (
            <span
              className={`font-medium ${trendUp ? "text-emerald-500" : "text-red-500"}`}
            >
              {trendUp ? "↑" : "↓"} {trend}
            </span>
          )}
          <span className="text-slate-500 ml-2">{description}</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
