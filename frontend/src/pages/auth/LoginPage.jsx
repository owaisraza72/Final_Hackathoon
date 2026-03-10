import { useState, useEffect, useCallback, useMemo } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
  Fingerprint,
  HeartPulse,
  Activity,
  Scan,
  Key,
  Mail,
  Lock,
  CheckCircle2,
  Award,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Constants
const MAX_LOGIN_ATTEMPTS = 3;
const LOCKOUT_DURATION = 30; // seconds
const ANIMATION_DURATION = 300;

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);

  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.HOME;

  // Memoized values
  const remainingAttempts = useMemo(
    () => MAX_LOGIN_ATTEMPTS - loginAttempts,
    [loginAttempts],
  );

  const isSubmitDisabled = useMemo(
    () => isLoggingIn || isLocked,
    [isLoggingIn, isLocked],
  );

  // Lockout timer effect
  useEffect(() => {
    let interval;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setLoginAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  // Validation rules
  const validateEmail = useCallback((email) => {
    const emailRegex = /^\S+@\S+\.\S+$/;
    return emailRegex.test(email);
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData.email, formData.password, validateEmail]);

  const handleChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
    },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (isLocked) {
        toast.error(`Account locked. Try again in ${lockTimer}s`, {
          icon: "🔒",
        });
        return;
      }

      if (!validateForm()) {
        toast.error("Please check your credentials", {
          icon: "⚠️",
        });
        return;
      }

      try {
        const res = await login(formData).unwrap();
        const userRole = res.data?.user?.role;

        // Reset login attempts on success
        setLoginAttempts(0);

        // Role-based routing
        const roleRoutes = {
          ADMIN: ROUTES.ADMIN_DASHBOARD,
          DOCTOR: ROUTES.DOCTOR_DASHBOARD,
          RECEPTIONIST: ROUTES.RECEPTIONIST_DASHBOARD,
          PATIENT: ROUTES.PATIENT_DASHBOARD,
        };

        const targetPath = roleRoutes[userRole] || ROUTES.HOME;
        const destination = location.state?.from?.pathname || targetPath;

        toast.success("Access granted! Welcome back.", {
          icon: "🩺",
          description: `Logged in as ${userRole?.toLowerCase()}`,
        });

        // Smooth navigation
        setTimeout(() => {
          navigate(destination, { replace: true });
        }, ANIMATION_DURATION);
      } catch (err) {
        // Increment login attempts
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);

        // Lock account after max attempts
        if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
          setIsLocked(true);
          setLockTimer(LOCKOUT_DURATION);
          toast.error("Account temporarily locked", {
            icon: "🔒",
            description: `Too many failed attempts. Try again in ${LOCKOUT_DURATION} seconds.`,
          });
        } else {
          const message = err?.data?.message || "Invalid credentials";
          toast.error("Authentication failed", {
            icon: "❌",
            description: message,
          });
        }

        // Handle API validation errors
        if (err?.data?.errors?.length) {
          const apiErrors = {};
          err.data.errors.forEach((e) => {
            apiErrors[e.field] = e.message;
          });
          setErrors(apiErrors);
        }
      }
    },
    [
      formData,
      isLocked,
      lockTimer,
      loginAttempts,
      login,
      validateForm,
      location,
      navigate,
    ],
  );

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
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

  const inputClassName = useCallback(
    (fieldName) => `
      w-full h-12 bg-white border-2 rounded-xl transition-all text-sm px-4 pr-10
      ${
        focusedField === fieldName
          ? "border-teal-500 ring-4 ring-teal-500/10"
          : "border-slate-200"
      }
      ${errors[fieldName] ? "border-red-300 bg-red-50" : ""}
    `,
    [focusedField, errors],
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-teal-50">
      {/* Skip to content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-teal-600 text-white px-4 py-2 rounded-lg z-50"
      >
        Skip to content
      </a>

      {/* Main Content */}
      <main
        id="main-content"
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-28"
      >
        <div className="max-w-md mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10"
          >
            {/* Header Section */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="mx-auto h-20 w-20 mb-4 rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-teal-500/30 relative overflow-hidden cursor-pointer"
                role="img"
                aria-label="ClinicOS Logo"
              >
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute inset-0 bg-gradient-to-tr from-white/30 to-transparent"
                />
                <Shield className="h-10 w-10 text-white relative z-10" />
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-2"
              >
                Welcome<span className="text-teal-600">Back</span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="text-slate-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <Scan className="h-3 w-3" />
                Secure Clinical Portal Access
                <Scan className="h-3 w-3" />
              </motion.p>
            </motion.div>

            {/* Login Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Top gradient bar */}
              <motion.div
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="h-1.5 w-full bg-gradient-to-r from-teal-500 via-indigo-500 to-teal-500 bg-[size:200%]"
                aria-hidden="true"
              />

              <form
                onSubmit={handleSubmit}
                className="p-6 md:p-8 space-y-5"
                noValidate
              >
                {/* Email Field */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="dr.smith@clinic.pro"
                      value={formData.email}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("email")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClassName("email")}
                      aria-invalid={!!errors.email}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                      autoComplete="email"
                      inputMode="email"
                    />
                    <Mail
                      className={`absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4
                      ${errors.email ? "text-red-400" : "text-slate-400"}`}
                      aria-hidden="true"
                    />
                  </div>

                  <AnimatePresence>
                    {errors.email && (
                      <motion.p
                        id="email-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.email}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label
                      htmlFor="password"
                      className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2"
                    >
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <button
                      type="button"
                      onClick={() => toast.info("Password reset coming soon!")}
                      className="text-[10px] font-bold uppercase text-teal-600 hover:text-teal-700 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                    >
                      Forgot?
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      onFocus={() => setFocusedField("password")}
                      onBlur={() => setFocusedField(null)}
                      className={inputClassName("password")}
                      aria-invalid={!!errors.password}
                      aria-describedby={
                        errors.password ? "password-error" : undefined
                      }
                      autoComplete="current-password"
                    />

                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-slate-400 hover:text-teal-600 transition-colors focus:outline-none focus:ring-2 focus:ring-teal-500 rounded"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={16} />
                        ) : (
                          <Eye size={16} />
                        )}
                      </button>
                      <Fingerprint
                        className={`h-4 w-4 ml-1 ${errors.password ? "text-red-400" : "text-slate-400"}`}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        id="password-error"
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-xs text-red-500 flex items-center gap-1"
                        role="alert"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {errors.password}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Remember Me & Login Attempts */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                      aria-label="Remember me"
                    />
                    <div
                      className={`w-4 h-4 rounded border-2 transition-all flex items-center justify-center
                      ${
                        rememberMe
                          ? "bg-teal-500 border-teal-500"
                          : "border-slate-300 group-hover:border-teal-400"
                      }`}
                      aria-hidden="true"
                    >
                      {rememberMe && (
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      Remember me
                    </span>
                  </label>

                  <AnimatePresence>
                    {loginAttempts > 0 && !isLocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-orange-600 flex items-center gap-1"
                        role="status"
                      >
                        <AlertCircle className="h-3 w-3" />
                        {remainingAttempts}{" "}
                        {remainingAttempts === 1 ? "attempt" : "attempts"} left
                      </motion.div>
                    )}

                    {isLocked && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-xs text-red-600 flex items-center gap-1"
                        role="alert"
                      >
                        <Lock className="h-3 w-3" />
                        {lockTimer}s
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: isSubmitDisabled ? 1 : 1.02 }}
                  whileTap={{ scale: isSubmitDisabled ? 1 : 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitDisabled}
                    className="w-full h-12 bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 text-white font-bold uppercase tracking-wider text-sm rounded-xl shadow-xl shadow-teal-500/20 transition-all relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                    aria-busy={isLoggingIn}
                  >
                    {/* Shine effect - only when not disabled */}
                    {!isSubmitDisabled && (
                      <motion.div
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 1,
                        }}
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        aria-hidden="true"
                      />
                    )}

                    {isLoggingIn ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Authenticating...</span>
                      </div>
                    ) : isLocked ? (
                      <div className="flex items-center justify-center gap-2">
                        <Lock className="h-4 w-4" />
                        <span>Account Locked</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Key className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                        <span>Sign In</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    )}
                  </Button>
                </motion.div>

                {/* Security Badge */}
                <div className="pt-4">
                  <div className="flex items-center justify-center gap-3">
                    <Shield className="h-3 w-3 text-teal-500" />
                    <span className="text-[8px] font-black uppercase text-slate-400 tracking-wider">
                      256-bit Clinical Grade Encryption
                    </span>
                    <Shield className="h-3 w-3 text-teal-500" />
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Register Link */}
            <motion.div variants={itemVariants} className="mt-6 text-center">
              <p className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                New to ClinicOS?{" "}
                <Link
                  to={ROUTES.REGISTER}
                  className="text-teal-600 hover:text-teal-700 ml-1 border-b-2 border-teal-200 hover:border-teal-400 transition-all inline-flex items-center gap-1 group focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 rounded"
                >
                  Create Account
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              </p>
            </motion.div>

            {/* Security Badges */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center gap-4 mt-6"
            >
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200">
                <Shield className="h-3 w-3 text-teal-500" />
                <span className="text-[8px] font-black uppercase text-slate-500">
                  HIPAA Compliant
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-slate-200">
                <Award className="h-3 w-3 text-indigo-500" />
                <span className="text-[8px] font-black uppercase text-slate-500">
                  256-bit Encryption
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
