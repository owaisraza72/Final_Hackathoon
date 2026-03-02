import { useState } from "react";
import { Search } from "lucide-react";

const DataTable = ({
  columns,
  data,
  onSearch,
  placeholder = "Search...",
  actions,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    if (onSearch) onSearch(e.target.value);
  };

  return (
    <div className="bg-white rounded-3xl premium-shadow border border-slate-200/60 overflow-hidden transition-all duration-500">
      {/* Table Header Controls */}
      <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row gap-6 items-center justify-between bg-slate-50/30">
        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 group-focus-within:text-teal-600 transition-colors" />
          <input
            type="text"
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 focus:bg-white transition-all shadow-sm"
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        {actions && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto min-h-[300px]">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] bg-slate-50 border-b border-slate-100">
            <tr>
              {columns.map((col, i) => (
                <th key={i} className="px-8 py-5">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/60">
            {data?.length > 0 ? (
              data.map((row, i) => (
                <tr
                  key={i}
                  className="group hover:bg-teal-50/30 transition-all duration-300"
                >
                  {columns.map((col, j) => (
                    <td
                      key={j}
                      className="px-8 py-5 whitespace-nowrap text-slate-700 font-medium group-hover:text-slate-900 transition-colors"
                    >
                      {col.cell ? col.cell(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-3 opacity-30">
                    <Search className="h-12 w-12 text-slate-300" />
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                      No matching records found
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
