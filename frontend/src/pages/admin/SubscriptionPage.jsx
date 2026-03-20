import {
  useGetAnalyticsQuery,
  useUpdateSettingsMutation,
} from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { toast } from "sonner";
import {
  CheckCircle2,
  X,
  Zap,
  Shield,
  Sparkles,
  Crown,
  Star,
  Award,
  TrendingUp,
  Activity,
  HeartPulse,
  BrainCircuit,
  FileText,
  Users,
  Stethoscope,
  CalendarRange,
  Clock,
  ArrowRight,
  Check,
  AlertCircle,
  Info,
  HelpCircle,
  Rocket,
  Target,
  Globe,
  Lock,
  Unlock,
  Key,
  Fingerprint,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Cloud,
  Wind,
  Flame,
  Snowflake,
  Leaf,
  Mountain,
  Sunrise,
  Sunset,
  StarHalf,
  StarOff,
  BadgeCheck,
  Headphones,
  Infinity,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";
const tealHover = "#009688";
const tealGlow = "rgba(0, 187, 167, 0.15)";

const SubscriptionPage = () => {
  const { data: analytics, isLoading, refetch } = useGetAnalyticsQuery();
  const [updateSettings, { isLoading: isUpdating }] =
    useUpdateSettingsMutation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState(null);

  if (isLoading)
    return (
      <div className="flex h-64 justify-center items-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div
              className="h-16 w-16 border-4 rounded-full animate-spin"
              style={{
                borderColor: `${primaryTeal}20`,
                borderTopColor: primaryTeal,
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Crown
                className="h-6 w-6 animate-pulse"
                style={{ color: primaryTeal }}
              />
            </div>
          </div>
          <p className="text-xs font-black uppercase text-slate-400 tracking-widest animate-pulse">
            Loading Subscription Data...
          </p>
        </div>
      </div>
    );

  const currentPlan = analytics?.business?.plan || "FREE";
  const clinicName = analytics?.business?.clinicName || "Your Clinic";

  const handleUpdatePlan = async (newPlan) => {
    try {
      await updateSettings({ plan: newPlan }).unwrap();
      toast.success(`Successfully upgraded to ${newPlan} plan!`, {
        icon: "🚀",
        description: "Your clinic now has access to advanced features",
      });
      setShowConfirmModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update subscription", {
        icon: "❌",
      });
    }
  };

  const plans = [
    {
      name: "Utility Core",
      tier: "FREE",
      price: "0",
      priceYearly: "0",
      description: "Fundamental clinic operations for emerging practitioners.",
      icon: Shield,
      color: "from-slate-500 to-slate-600",
      bgColor: "bg-slate-50",
      textColor: "text-slate-700",
      borderColor: "border-slate-200",
      features: [
        { name: "Up to 10 Patients", included: true, icon: Users },
        {
          name: "Basic Appointment Scheduling",
          included: true,
          icon: CalendarRange,
        },
        { name: "Standard Prescriptions", included: true, icon: FileText },
        { name: "AI Diagnosis Protocol", included: false, icon: BrainCircuit },
        { name: "Digital Semantic Translation", included: false, icon: Globe },
        { name: "Unlimited Staff Accounts", included: false, icon: Users },
        { name: "Advanced Analytics", included: false, icon: TrendingUp },
        { name: "Priority Support", included: false, icon: Headphones },
      ],
    },
    {
      name: "Intelligence Max",
      tier: "PRO",
      price: "49",
      priceYearly: "470",
      description:
        "The complete AI-integrated suite for validated clinical growth.",
      icon: Crown,
      color: `from-${primaryTeal} to-indigo-600`,
      bgColor: "bg-gradient-to-br from-teal-50 to-indigo-50",
      textColor: "text-teal-700",
      borderColor: `border-${primaryTeal}`,
      popular: true,
      features: [
        { name: "Unlimited Patients", included: true, icon: Users },
        {
          name: "Advanced Appointment Management",
          included: true,
          icon: CalendarRange,
        },
        {
          name: "Digital Prescriptions with AI",
          included: true,
          icon: FileText,
        },
        {
          name: "AI Diagnostic Assistant (Gemini)",
          included: true,
          icon: BrainCircuit,
        },
        { name: "AI Prescription Translation", included: true, icon: Globe },
        { name: "Unlimited Staff Accounts", included: true, icon: Users },
        {
          name: "Advanced Analytics & Reports",
          included: true,
          icon: TrendingUp,
        },
        { name: "24/7 Priority Support", included: true, icon: Headphones },
      ],
    },
  ];

  const features = [
    {
      name: "AI Diagnostic Assistant",
      description:
        "Powered by Google's Gemini AI, get intelligent diagnosis suggestions based on symptoms and patient history.",
      icon: BrainCircuit,
      color: primaryTeal,
      pro: true,
    },
    {
      name: "AI Prescription Translation",
      description:
        "Automatically translate prescriptions into multiple languages for better patient understanding.",
      icon: Globe,
      color: "#6366f1",
      pro: true,
    },
    {
      name: "Advanced Analytics",
      description:
        "Track clinic performance, patient flow, and revenue with detailed charts and reports.",
      icon: TrendingUp,
      color: "#f59e0b",
      pro: true,
    },
    {
      name: "Unlimited Everything",
      description:
        "No limits on patients, appointments, prescriptions, or staff accounts.",
      icon: Infinity,
      color: "#10b981",
      pro: true,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto space-y-8 pb-10 px-4 sm:px-6"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${primaryTeal}, #6366f1)`,
              }}
            >
              <Crown className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Subscription<span style={{ color: primaryTeal }}>Plans</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Expand your clinic's operational limits and unlock AI-driven
            workflows
          </p>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-xl border"
            style={{
              backgroundColor: tealLight,
              borderColor: primaryTeal,
            }}
          >
            <div className="relative">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2 w-2 rounded-full bg-green-500/50"
              />
            </div>
            <div>
              <p className="text-[8px] font-bold uppercase text-slate-500">
                Current Plan
              </p>
              <p className="text-xs font-bold" style={{ color: primaryTeal }}>
                {currentPlan} Tier
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Billing Toggle (Optional) */}
      <motion.div variants={itemVariants} className="flex justify-center">
        <div className="bg-slate-100 p-1 rounded-xl inline-flex">
          <button className="px-4 py-2 bg-white rounded-lg text-sm font-medium shadow-sm">
            Monthly
          </button>
          <button className="px-4 py-2 text-sm font-medium text-slate-600">
            Yearly{" "}
            <span className="text-xs text-emerald-600 ml-1">Save 20%</span>
          </button>
        </div>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => {
          const Icon = plan.icon;
          const isCurrent = currentPlan === plan.tier;
          const isPro = plan.tier === "PRO";

          return (
            <motion.div
              key={plan.tier}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className={`relative rounded-3xl overflow-hidden ${
                isPro ? "lg:-mt-8 lg:mb-8" : ""
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div
                  className="absolute top-6 right-6 z-10 px-4 py-1.5 rounded-full text-xs font-bold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${primaryTeal}, #6366f1)`,
                  }}
                >
                  MOST POPULAR
                </div>
              )}

              {/* Plan Card */}
              <div
                className={`h-full p-8 border-2 rounded-3xl transition-all ${
                  isCurrent
                    ? "border-teal-500 shadow-xl"
                    : "border-slate-200 hover:border-teal-200 hover:shadow-lg"
                }`}
                style={isCurrent ? { borderColor: primaryTeal } : {}}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div
                      className="h-14 w-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: isPro
                          ? `linear-gradient(135deg, ${primaryTeal}20, #6366f120)`
                          : "#f1f5f9",
                      }}
                    >
                      <Icon
                        className={`h-7 w-7 ${isPro ? "text-teal-600" : "text-slate-500"}`}
                        style={isPro ? { color: primaryTeal } : {}}
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs">
                      {plan.description}
                    </p>
                  </div>

                  {isCurrent && (
                    <span
                      className="px-3 py-1.5 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: primaryTeal }}
                    >
                      ACTIVE
                    </span>
                  )}
                </div>

                {/* Price */}
                <div className="mb-8">
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold text-slate-900">
                      ${plan.price}
                    </span>
                    <span className="text-slate-400">.99</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    per month, billed monthly
                  </p>
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                    Features
                  </p>
                  <div className="space-y-3">
                    {plan.features.map((feature, idx) => {
                      const FeatureIcon = feature.icon;
                      return (
                        <div
                          key={idx}
                          className={`flex items-start gap-3 ${
                            !feature.included ? "opacity-50" : ""
                          }`}
                        >
                          {feature.included ? (
                            <CheckCircle2
                              className="h-5 w-5 shrink-0 mt-0.5"
                              style={{ color: primaryTeal }}
                            />
                          ) : (
                            <X className="h-5 w-5 text-slate-300 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <FeatureIcon className="h-4 w-4 text-slate-400" />
                              <span
                                className={`text-sm ${
                                  feature.included
                                    ? "text-slate-700"
                                    : "text-slate-400"
                                }`}
                              >
                                {feature.name}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Action Button */}
                <button
                  disabled={isCurrent || isUpdating}
                  onClick={() => {
                    setSelectedPlan(plan.tier);
                    setShowConfirmModal(true);
                  }}
                  className="w-full h-12 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                  style={{
                    background: isCurrent
                      ? "#f1f5f9"
                      : isPro
                        ? `linear-gradient(135deg, ${primaryTeal}, #6366f1)`
                        : "white",
                    color: isCurrent
                      ? "#64748b"
                      : isPro
                        ? "white"
                        : primaryTeal,
                    border:
                      !isCurrent && !isPro
                        ? `2px solid ${primaryTeal}`
                        : "none",
                    cursor: isCurrent ? "default" : "pointer",
                    opacity: isCurrent ? 0.7 : 1,
                  }}
                  onMouseEnter={(e) => {
                    if (!isCurrent && !isPro) {
                      e.currentTarget.style.backgroundColor = tealLight;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCurrent && !isPro) {
                      e.currentTarget.style.backgroundColor = "white";
                    }
                  }}
                >
                  {isCurrent ? (
                    "Current Plan"
                  ) : isPro ? (
                    <>
                      Upgrade to PRO
                      <Rocket className="h-4 w-4" />
                    </>
                  ) : (
                    "Downgrade"
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* PRO Features Section */}
      <motion.div variants={itemVariants} className="mt-16">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-8">
          Everything in <span style={{ color: primaryTeal }}>PRO</span> Plan
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm"
              >
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="h-6 w-6" style={{ color: feature.color }} />
                </div>
                <h3 className="font-bold text-slate-800 mb-2">
                  {feature.name}
                </h3>
                <p className="text-xs text-slate-500">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* FAQ Section */}
      <motion.div
        variants={itemVariants}
        className="mt-16 bg-slate-50 rounded-2xl p-8 border border-slate-200"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {[
            {
              q: "Can I switch plans anytime?",
              a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
            },
            {
              q: "Is there a contract or setup fee?",
              a: "No contracts or setup fees. You can cancel anytime with no penalties.",
            },
            {
              q: "Do you offer discounts for non-profits?",
              a: "Yes, we offer special pricing for non-profit organizations. Contact our sales team for details.",
            },
          ].map((faq, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl border border-slate-100"
            >
              <h3 className="font-bold text-slate-800 mb-2">{faq.q}</h3>
              <p className="text-sm text-slate-500">{faq.a}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Upgrade Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && selectedPlan && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowConfirmModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl max-w-md w-full shadow-2xl"
            >
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="h-12 w-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: tealLight }}
                  >
                    <Crown className="h-6 w-6" style={{ color: primaryTeal }} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">
                    {selectedPlan === "PRO"
                      ? "Upgrade to PRO"
                      : "Downgrade Plan"}
                  </h3>
                </div>

                <p className="text-sm text-slate-600 mb-6">
                  {selectedPlan === "PRO"
                    ? "Are you sure you want to upgrade to the PRO plan? You'll get access to all premium features including AI diagnostics."
                    : "Are you sure you want to downgrade? Some features will be limited."}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowConfirmModal(false)}
                    className="flex-1 py-3 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdatePlan(selectedPlan)}
                    disabled={isUpdating}
                    className="flex-1 py-3 text-white rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                    style={{
                      background: `linear-gradient(135deg, ${primaryTeal}, #6366f1)`,
                      opacity: isUpdating ? 0.7 : 1,
                    }}
                  >
                    {isUpdating ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SubscriptionPage;
