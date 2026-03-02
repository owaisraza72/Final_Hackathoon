import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";

const PasswordRequirement = ({ met, text }) => (
  <div className="flex items-center gap-2 text-xs">
    {met ? (
      <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
    ) : (
      <X className="h-4 w-4 text-destructive flex-shrink-0" />
    )}
    <span className={met ? "text-muted-foreground" : "text-muted-foreground"}>
      {text}
    </span>
  </div>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[@$!%*?&#]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every((check) => check);
  const passwordsMatch =
    formData.password && formData.password === formData.confirmPassword;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Lead signature required";
    if (!formData.email.trim()) newErrors.email = "Communication link required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid link format";

    if (!isPasswordValid) newErrors.password = "Security parameters not met";

    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirmation required";
    else if (!passwordsMatch) newErrors.confirmPassword = "Sequence mismatch";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Security validation failed. Please review your parameters.");
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      const res = await register(registerData).unwrap();

      const userRole = res.data?.user?.role;
      let targetPath = ROUTES.HOME;
      if (userRole === "ADMIN") targetPath = ROUTES.ADMIN_DASHBOARD;
      else if (userRole === "DOCTOR") targetPath = ROUTES.DOCTOR_DASHBOARD;
      else if (userRole === "RECEPTIONIST")
        targetPath = ROUTES.RECEPTIONIST_DASHBOARD;
      else if (userRole === "PATIENT") targetPath = ROUTES.PATIENT_DASHBOARD;

      toast.success("Clinic Node Initialized Successfully");
      navigate(targetPath, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || "Node initialization failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-[#fdfdfd] selection:bg-indigo-100 relative overflow-hidden">
      {/* Background Clinical Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] bg-indigo-50/50 rounded-full blur-[120px]" />
        <div className="absolute bottom-[10%] right-[5%] w-[40%] h-[40%] bg-teal-50/50 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-slate-50 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div className="text-center mb-12 space-y-4">
          <div className="h-20 w-20 bg-slate-900 rounded-[30px] flex items-center justify-center mx-auto shadow-2xl relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <UserPlus className="h-10 w-10 text-white relative z-10" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            Clinical Environment Setup
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
            Initialize your specialized healthcare node
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/70 backdrop-blur-3xl rounded-[60px] border border-white p-12 premium-shadow space-y-10"
        >
          <div className="grid md:grid-cols-2 gap-8">
            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Lead Administrator
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Legal Execution Name"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Secured Communication Route
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="admin@yourclinicalnode.com"
                className="w-full h-14 px-6 bg-slate-50/50 border border-slate-100 rounded-[20px] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Establish Security Key
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-200 rounded-[20px] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Validate Security Key
              </label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full h-14 px-6 bg-slate-50/50 border border-slate-200 rounded-[20px] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Password Requirements UI */}
          {formData.password && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-6 bg-slate-50 rounded-[32px] border border-slate-100">
              {[
                { met: passwordChecks.minLength, text: "8+ Length" },
                { met: passwordChecks.hasUpper, text: "Upper Case" },
                { met: passwordChecks.hasLower, text: "Lower Case" },
                { met: passwordChecks.hasNumber, text: "Numerical" },
                { met: passwordChecks.hasSpecial, text: "Symbolic" },
                {
                  met: passwordsMatch && formData.confirmPassword,
                  text: "Synchronized",
                },
              ].map((check, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${check.met ? "bg-white border-indigo-100 text-indigo-600 shadow-sm" : "bg-transparent border-slate-100 text-slate-300"}`}
                >
                  {check.met ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {check.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-6 pt-4">
            <button
              type="submit"
              disabled={isRegistering}
              className="h-16 w-full bg-slate-900 border-b-4 border-black hover:bg-indigo-600 hover:border-indigo-800 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-[24px] shadow-2xl transition-all flex items-center justify-center gap-4 group active:scale-95 disabled:opacity-50"
            >
              {isRegistering ? (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Initializing Environment...
                </div>
              ) : (
                <>
                  Establish Node Access
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>

            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest text-center">
              Existing Operator?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="text-indigo-600 hover:text-indigo-400 ml-2 border-b-2 border-indigo-100 hover:border-indigo-500 transition-all"
              >
                Authenticate Here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
