import {
  useGetAnalyticsQuery,
  useUpdateSubscriptionMutation,
} from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import { CheckCircle2, X } from "lucide-react";

const SubscriptionPage = () => {
  const { data: analytics, isLoading } = useGetAnalyticsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();

  if (isLoading)
    return (
      <div className="flex h-64 justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const currentPlan = analytics?.business?.plan || "FREE";

  const handleUpdatePlan = async (newPlan) => {
    try {
      await updateSettings({ plan: newPlan }).unwrap();
      toast.success(`Successfully upgraded to ${newPlan} plan!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update subscription");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Capability Scaling"
          description="Expand your clinic's operational limits and unlock AI-driven workflows."
        />
        <div className="h-14 px-6 bg-white border border-slate-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <div>
            <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest">
              Global Status
            </p>
            <p className="text-[10px] font-black text-slate-700 uppercase">
              Operational: {currentPlan}
            </p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto pt-10">
        {/* FREE TIER - UTILITY PLAN */}
        <div
          className={`relative group p-1 rounded-[48px] transition-all duration-500 ${currentPlan === "FREE" ? "bg-slate-200" : "bg-transparent hover:bg-slate-100"}`}
        >
          <div className="bg-white rounded-[44px] border border-slate-200/60 p-10 h-full flex flex-col premium-shadow transition-transform duration-500 group-hover:-translate-y-2">
            <div className="flex justify-between items-start mb-8">
              <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:rotate-12 transition-transform">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              {currentPlan === "FREE" && (
                <span className="px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-xl border border-slate-200">
                  Active Node
                </span>
              )}
            </div>

            <h3 className="text-3xl font-black text-slate-800 tracking-tight">
              Utility Core
            </h3>
            <p className="text-slate-400 mt-2 text-sm font-semibold">
              Fundamental clinic operations for emerging practitioners.
            </p>

            <div className="my-10 flex items-baseline gap-2">
              <span className="text-6xl font-black text-slate-900 tracking-tighter">
                $0
              </span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                / Per Month
              </span>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.2em] border-b border-slate-50 pb-2">
                Standard Protocol
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-sm font-bold text-slate-600">
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                  Max 10 Patients limit
                </li>
                <li className="flex items-center gap-4 text-sm font-bold text-slate-600 opacity-60">
                  <X className="h-5 w-5 text-slate-300 shrink-0" />
                  <span className="line-through">AI Diagnosis Protocol</span>
                </li>
                <li className="flex items-center gap-4 text-sm font-bold text-slate-600 opacity-60">
                  <X className="h-5 w-5 text-slate-300 shrink-0" />
                  <span className="line-through">
                    Digital Semantic Translation
                  </span>
                </li>
              </ul>
            </div>

            <button
              disabled={currentPlan === "FREE"}
              className="h-16 w-full rounded-[24px] text-[10px] font-black uppercase tracking-widest border-2 border-slate-100 text-slate-400 disabled:opacity-50 hover:bg-slate-50 transition-all font-black"
            >
              {currentPlan === "FREE" ? "Initialized" : "Downgrade Session"}
            </button>
          </div>
        </div>

        {/* PRO TIER - INTELLIGENCE PLAN */}
        <div className="relative group p-1 rounded-[48px] bg-slate-900 border border-slate-800 premium-shadow h-full flex flex-col transform md:-translate-y-8 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0 right-10 -translate-y-1/2 bg-amber-400 text-slate-900 px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
            Recommended Protocol
          </div>

          <div className="p-10 flex flex-col h-full bg-gradient-to-b from-slate-900 to-slate-950 rounded-[44px]">
            <div className="flex justify-between items-start mb-8">
              <div className="h-16 w-16 bg-amber-400/10 rounded-2xl flex items-center justify-center text-amber-400 border border-amber-400/20">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              {currentPlan === "PRO" && (
                <span className="px-4 py-1.5 bg-amber-400/20 text-amber-400 text-[10px] font-black uppercase tracking-widest rounded-xl border border-amber-400/30">
                  Node Synchronized
                </span>
              )}
            </div>

            <h3 className="text-3xl font-black text-white tracking-tight">
              Intelligence Max
            </h3>
            <p className="text-slate-500 mt-2 text-sm font-semibold">
              The complete AI-integrated suite for validated clinical growth.
            </p>

            <div className="my-10 flex items-baseline gap-2">
              <span className="text-6xl font-black text-white tracking-tighter">
                $49
              </span>
              <span className="text-3xl font-black text-slate-600">.99</span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">
                / Per Month
              </span>
            </div>

            <div className="space-y-6 mb-12 flex-1">
              <p className="text-[10px] font-black uppercase text-slate-700 tracking-[0.2em] border-b border-slate-800 pb-2">
                Premium Matrix
              </p>
              <ul className="space-y-5">
                <li className="flex items-center gap-4 text-sm font-bold text-white">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                  Unlimited Patient Records
                </li>
                <li className="flex items-center gap-4 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                  <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
                  AI Diagnostic Assistant (Gemini)
                </li>
                <li className="flex items-center gap-4 text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-indigo-500">
                  <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
                  AI Prescription Translation
                </li>
              </ul>
            </div>

            <button
              disabled={currentPlan === "PRO" || isUpdating}
              onClick={() => handleUpdatePlan("PRO")}
              className="h-16 w-full rounded-[24px] text-[10px] font-black uppercase tracking-[0.2em] bg-white text-slate-900 hover:bg-amber-400 transition-all shadow-2xl active:scale-95 disabled:opacity-50"
            >
              {isUpdating
                ? "Synchronizing..."
                : currentPlan === "PRO"
                  ? "Current Tier Active"
                  : "Initialize Upgrade"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
