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
  const [updatePlan, { isLoading: isUpdating }] =
    useUpdateSubscriptionMutation();

  if (isLoading)
    return (
      <div className="flex h-64 justify-center items-center">
        <LoadingSpinner />
      </div>
    );

  const currentPlan = analytics?.business?.plan || "FREE";

  const handleUpdatePlan = async (newPlan) => {
    try {
      await updatePlan(newPlan).unwrap();
      toast.success(`Successfully upgraded to ${newPlan} plan!`);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update subscription");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in">
      <PageHeader
        title="Subscription Management"
        description="Manage your clinic's subscription plan and unlock premium features."
      />

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-12">
        {/* FREE PLAN */}
        <div
          className={`relative bg-white rounded-2xl border p-8 shadow-sm flex flex-col ${currentPlan === "FREE" ? "border-teal-500 ring-1 ring-teal-500" : "border-slate-200"}`}
        >
          {currentPlan === "FREE" && (
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              CURRENT PLAN
            </div>
          )}
          <h3 className="text-xl font-bold text-slate-900">Free Tier</h3>
          <p className="text-slate-500 mt-2 text-sm">
            Perfect for solo practitioners starting out.
          </p>
          <div className="my-6">
            <span className="text-4xl font-extrabold text-slate-900">$0</span>
            <span className="text-slate-500 font-medium">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
              <span>Max 20 Patients limit</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
              <span>Basic Appointment Booking</span>
            </li>
            <li className="flex items-center gap-3 text-slate-700">
              <CheckCircle2 className="h-5 w-5 text-teal-500 shrink-0" />
              <span>Digital Prescriptions</span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="h-5 w-5 shrink-0" />
              <span className="line-through">
                Gemini AI Diagnosis Assistant
              </span>
            </li>
            <li className="flex items-center gap-3 text-slate-400">
              <X className="h-5 w-5 shrink-0" />
              <span className="line-through">AI Patient Explanations</span>
            </li>
          </ul>
          <button
            disabled={currentPlan === "FREE"}
            className="w-full py-3 px-4 rounded-xl font-medium transition-colors border-2 border-slate-200 text-slate-600 disabled:opacity-50 disabled:bg-slate-50 disabled:border-slate-100"
          >
            {currentPlan === "FREE" ? "Active" : "Downgrade to Free"}
          </button>
        </div>

        {/* PRO PLAN */}
        <div
          className={`relative bg-slate-900 rounded-2xl border p-8 shadow-xl flex flex-col transform md:-translate-y-4 ${currentPlan === "PRO" ? "border-amber-400 ring-2 ring-amber-400" : "border-slate-800"}`}
        >
          {currentPlan === "PRO" && (
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-amber-500 text-slate-900 px-3 py-1 rounded-full text-xs font-bold tracking-wide">
              ACTIVE PLAN
            </div>
          )}
          <div className="absolute top-0 left-6 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold tracking-wide">
            MOST POPULAR
          </div>

          <h3 className="text-xl font-bold text-white">Pro Tier</h3>
          <p className="text-slate-400 mt-2 text-sm">
            Everything you need for a growing clinic.
          </p>
          <div className="my-6">
            <span className="text-4xl font-extrabold text-white">$49.99</span>
            <span className="text-slate-400 font-medium">/month</span>
          </div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex items-center gap-3 text-slate-200">
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
              <span>
                <strong>Unlimited</strong> Patients
              </span>
            </li>
            <li className="flex items-center gap-3 text-slate-200">
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
              <span>Advanced Appointment Priority</span>
            </li>
            <li className="flex items-center gap-3 text-slate-200">
              <CheckCircle2 className="h-5 w-5 text-amber-400 shrink-0" />
              <span>Full Prescription History & PDFs</span>
            </li>
            <li className="flex items-center gap-3 text-white font-medium bg-white/10 p-2 rounded-lg -mx-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>Gemini AI Diagnosis Assistant</span>
            </li>
            <li className="flex items-center gap-3 text-white font-medium bg-white/10 p-2 rounded-lg -mx-2 mt-2">
              <CheckCircle2 className="h-5 w-5 text-indigo-400 shrink-0" />
              <span>AI Prescription Translator for Patients</span>
            </li>
          </ul>
          <button
            disabled={currentPlan === "PRO" || isUpdating}
            onClick={() => handleUpdatePlan("PRO")}
            className="w-full py-3 px-4 rounded-xl font-bold transition-all bg-gradient-to-r from-amber-400 to-amber-500 text-slate-900 hover:from-amber-300 hover:to-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.3)] disabled:opacity-50"
          >
            {isUpdating
              ? "Processing..."
              : currentPlan === "PRO"
                ? "Current Plan"
                : "Upgrade to PRO"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
