import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, LogIn, ArrowRight, AlertCircle } from "lucide-react";
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

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.HOME;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    const isValid = Object.keys(newErrors).length === 0;
    if (!isValid) {
      toast.error("Please provide email and password.");
    }
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const res = await login(formData).unwrap();
      const userRole = res.data?.user?.role;

      let targetPath = ROUTES.HOME;
      if (userRole === "ADMIN") targetPath = ROUTES.ADMIN_DASHBOARD;
      else if (userRole === "DOCTOR") targetPath = ROUTES.DOCTOR_DASHBOARD;
      else if (userRole === "RECEPTIONIST")
        targetPath = ROUTES.RECEPTIONIST_DASHBOARD;
      else if (userRole === "PATIENT") targetPath = ROUTES.PATIENT_DASHBOARD;

      const destination = location.state?.from?.pathname || targetPath;

      toast.success("Logged in successfully!");
      navigate(destination, { replace: true });
    } catch (err) {
      const message = err?.data?.message || "Login failed. Please try again.";
      toast.error(message);

      if (err?.data?.errors?.length) {
        const apiErrors = {};
        err.data.errors.forEach((e) => {
          apiErrors[e.field] = e.message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -left-[10%] -top-[10%] h-[60%] w-[60%] rounded-full bg-teal-500/10 blur-[120px] animate-pulse" />
        <div
          className="absolute -right-[10%] -bottom-[10%] h-[60%] w-[60%] rounded-full bg-indigo-500/10 blur-[120px] animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="w-full max-w-[480px] relative z-10 glass-card p-1 shadow-2xl rounded-[32px] animate-in fade-in zoom-in duration-1000">
        <div className="bg-white rounded-[31px] overflow-hidden">
          {/* Header Section */}
          <div className="pt-12 pb-8 px-10 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 animate-shimmer" />
            <div className="mx-auto h-16 w-16 mb-6 clinical-gradient rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/20 rotate-3 hover:rotate-0 transition-transform duration-500">
              <LogIn className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">
              Clinic<span className="text-teal-600">OS</span>
            </h1>
            <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em]">
              Precision Practice Management
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-10 pb-12 space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Email Clinical ID
                </Label>
                <div className="relative group">
                  <Input
                    name="email"
                    type="email"
                    placeholder="dr.smith@clinicos.pro"
                    value={formData.email}
                    onChange={handleChange}
                    className="h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all font-medium pl-5"
                  />
                  {errors.email && (
                    <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" /> {errors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <Label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                    Secret Vault Key
                  </Label>
                </div>
                <div className="relative group">
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-14 bg-slate-50/50 border-slate-200/60 rounded-2xl focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all font-medium pl-5 pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                  {errors.password && (
                    <p className="text-[10px] font-bold text-red-500 mt-1 flex items-center gap-1 ml-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="h-3 w-3" /> {errors.password}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <Button
              disabled={isLoggingIn}
              className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-slate-900/10 group"
            >
              {isLoggingIn ? (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Decrypting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  Access Portal
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              )}
            </Button>

            <div className="pt-6 border-t border-slate-100 text-center">
              <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">
                Protected by Clinical-Grade Security
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
