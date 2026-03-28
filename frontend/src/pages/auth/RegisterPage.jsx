import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  UserPlus,
  ArrowRight,
  Check,
  X,
  User,
  Mail,
  Lock,
  Stethoscope,
  Users,
  HeartPulse,
  Shield,
  Sparkles,
  Activity,
  ChevronRight,
  CircleAlert,
  Award,
  Calendar,
  Phone,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { ROUTES } from "@/utils/constants";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const RegisterPage = () => {
  const [selectedRole, setSelectedRole] = useState("PATIENT");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { register, isRegistering } = useAuth();
  const navigate = useNavigate();

  // Password strength calculation
  useEffect(() => {
    const checks = [
      formData.password.length >= 8,
      /[A-Z]/.test(formData.password),
      /[a-z]/.test(formData.password),
      /\d/.test(formData.password),
      /[@$!%*?&#]/.test(formData.password),
    ];
    const metCount = checks.filter(Boolean).length;
    setPasswordStrength((metCount / checks.length) * 100);
  }, [formData.password]);

  const passwordChecks = {
    minLength: formData.password.length >= 8,
    hasUpper: /[A-Z]/.test(formData.password),
    hasLower: /[a-z]/.test(formData.password),
    hasNumber: /\d/.test(formData.password),
    hasSpecial: /[@$!%*?&#]/.test(formData.password),
  };

  const isPasswordValid = Object.values(passwordChecks).every(Boolean);
  const passwordsMatch =
    formData.password && formData.password === formData.confirmPassword;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Full name required";
    if (!formData.email.trim()) newErrors.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number required";
    if (!formData.dob) newErrors.dob = "Date of birth required";

    if (!isPasswordValid) newErrors.password = "Password requirements not met";
    if (!formData.confirmPassword)
      newErrors.confirmPassword = "Confirm your password";
    else if (!passwordsMatch)
      newErrors.confirmPassword = "Passwords do not match";

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
      toast.error("Please fix form errors");
      return;
    }

    if (!acceptedTerms) {
      toast.error("Please accept terms to continue");
      return;
    }

    try {
      const { confirmPassword, ...rest } = formData;
      const payload = { ...rest, role: selectedRole };

      await register(payload).unwrap();

      toast.success("Account created successfully! 🎉", {
        description: "Welcome to ClinicOS",
        icon: "🏥",
      });

      navigate(ROUTES.PATIENT_DASHBOARD, { replace: true });
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed", {
        icon: "⚠️",
      });
    }
  };

  const roleConfig = {
    PATIENT: {
      icon: User,
      label: "Patient",
      color: "from-teal-400 to-cyan-400",
      bg: "bg-teal-50",
      description: "Book appointments and access medical records",
    },
    DOCTOR: {
      icon: Stethoscope,
      label: "Doctor",
      color: "from-teal-400 to-cyan-400",
      bg: "bg-teal-50",
      description: "Manage patients and write prescriptions",
    },
    RECEPTIONIST: {
      icon: Users,
      label: "Receptionist",
      color: "from-teal-400 to-cyan-400",
      bg: "bg-teal-50",
      description: "Handle appointments and patient registration",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      {/* Main Content - Centered with proper spacing */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8 md:mb-12"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-2">
              Create<span className="text-cyan-400">Account</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-semibold uppercase tracking-wider flex items-center justify-center gap-2">
              <Activity className="h-4 w-4" />
              SELECT ROLE & SETUP CREDENTIALS
              <Activity className="h-4 w-4" />
            </p>
          </motion.div>

          {/* Role Selection - Grid with proper spacing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-center text-xs font-black uppercase tracking-wider text-slate-400 mb-4 md:mb-6">
              SELECT YOUR ACCESS ROLE
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {Object.entries(roleConfig).map(([role, config]) => {
                const isActive = selectedRole === role;
                const isRestricted = role !== "PATIENT";
                const Icon = config.icon;

                return (
                  <motion.button
                    key={role}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      if (isRestricted) {
                        toast.error("Admin approval required", {
                          description: "Please contact your administrator",
                        });
                        return;
                      }
                      setSelectedRole(role);
                    }}
                    className={`
                      relative p-4 md:p-6 rounded-2xl border-2 flex flex-col items-center gap-2
                      transition-all duration-300
                      ${
                        isActive
                          ? `bg-gradient-to-r ${config.color} text-white border-transparent shadow-xl`
                          : "bg-white border-slate-200 text-slate-600 hover:border-indigo-400"
                      }
                      ${isRestricted ? "opacity-70 cursor-not-allowed" : "cursor-pointer"}
                    `}
                  >
                    <Icon
                      className={`h-6 w-6 md:h-8 md:w-8 ${isActive ? "text-white" : "text-slate-400"}`}
                    />
                    <span className="font-bold text-sm md:text-base">
                      {config.label}
                    </span>
                    {isRestricted && (
                      <span className="absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <Shield className="h-3 w-3 text-white" />
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>

            {/* Role Description */}
            <motion.p
              key={selectedRole}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center text-xs md:text-sm text-slate-500 mt-4 md:mt-6 bg-slate-50 p-3 md:p-4 rounded-xl"
            >
              {roleConfig[selectedRole].description}
            </motion.p>
          </motion.div>

          {/* Registration Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
            >
              {/* Form Fields - Properly aligned grid */}
              <div className="p-6 md:p-8 space-y-6">
                {/* Personal Information - 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <User className="h-4 w-4" />
                      FULL NAME
                    </label>
                    <div className="relative">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="e.g. John Smith"
                        className={`
                          w-full h-12 px-4 rounded-xl border-2 outline-none transition-all text-sm
                          ${
                            focusedField === "name"
                              ? "border-indigo-500 ring-4 ring-indigo-500/10"
                              : "border-slate-200"
                          }
                          ${errors.name ? "border-red-300 bg-red-50" : "bg-white"}
                        `}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.name && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <CircleAlert className="h-3 w-3" />
                          {errors.name}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="ali@gmail.com"
                        className={`
                          w-full h-12 px-4 rounded-xl border-2 outline-none transition-all text-sm
                          ${
                            focusedField === "email"
                              ? "border-indigo-500 ring-4 ring-indigo-500/10"
                              : "border-slate-200"
                          }
                          ${errors.email ? "border-red-300 bg-red-50" : "bg-white"}
                        `}
                      />
                    </div>
                    <AnimatePresence>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-xs text-red-500 flex items-center gap-1"
                        >
                          <CircleAlert className="h-3 w-3" />
                          {errors.email}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      PHONE NUMBER
                    </label>
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 000-0000"
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      DATE OF BIRTH
                    </label>
                    <input
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full h-12 px-4 rounded-xl border-2 border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                {/* Password Section - 2 columns on desktop */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("password")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Create password"
                        className={`
                          w-full h-12 px-4 pr-12 rounded-xl border-2 outline-none transition-all text-sm
                          ${
                            focusedField === "password"
                              ? "border-indigo-500 ring-4 ring-indigo-500/10"
                              : "border-slate-200"
                          }
                          ${errors.password ? "border-red-300 bg-red-50" : "bg-white"}
                        `}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      CONFIRM PASSWORD
                    </label>
                    <div className="relative">
                      <input
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        onFocus={() => setFocusedField("confirmPassword")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="Repeat password"
                        className={`
                          w-full h-12 px-4 pr-12 rounded-xl border-2 outline-none transition-all text-sm
                          ${
                            focusedField === "confirmPassword"
                              ? "border-indigo-500 ring-4 ring-indigo-500/10"
                              : "border-slate-200"
                          }
                          ${errors.confirmPassword ? "border-red-300 bg-red-50" : "bg-white"}
                        `}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Password Strength Meter */}
                {formData.password && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold uppercase text-slate-400">
                        Password Strength
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          passwordStrength < 40
                            ? "text-red-500"
                            : passwordStrength < 70
                              ? "text-yellow-500"
                              : "text-green-500"
                        }`}
                      >
                        {passwordStrength < 40
                          ? "Weak"
                          : passwordStrength < 70
                            ? "Medium"
                            : "Strong"}
                      </span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${passwordStrength}%` }}
                        className={`h-full ${
                          passwordStrength < 40
                            ? "bg-red-500"
                            : passwordStrength < 70
                              ? "bg-yellow-500"
                              : "bg-green-500"
                        }`}
                      />
                    </div>

                    {/* Password Requirements - 2 columns */}
                    <div className="grid grid-cols-2 gap-2 mt-3 p-3 bg-slate-50 rounded-xl">
                      {Object.entries(passwordChecks).map(([key, met]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-2 text-xs ${
                            met ? "text-green-600" : "text-slate-400"
                          }`}
                        >
                          {met ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                          <span>
                            {key === "minLength" && "8+ chars"}
                            {key === "hasUpper" && "Uppercase"}
                            {key === "hasLower" && "Lowercase"}
                            {key === "hasNumber" && "Number"}
                            {key === "hasSpecial" && "Special"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Password Match Indicator */}
                {formData.confirmPassword && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex items-center gap-2 text-xs font-bold ${
                      passwordsMatch ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {passwordsMatch ? (
                      <>
                        <Check className="h-4 w-4" />
                        <span>Passwords match</span>
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4" />
                        <span>Passwords do not match</span>
                      </>
                    )}
                  </motion.div>
                )}

                {/* Terms and Conditions */}
                <div className="flex items-start gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAcceptedTerms(!acceptedTerms)}
                    className={`mt-1 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                      ${
                        acceptedTerms
                          ? "bg-cyan-600 border-cyan-600"
                          : "border-slate-300 hover:border-cyan-400"
                      }`}
                  >
                    {acceptedTerms && <Check className="h-3 w-3 text-white" />}
                  </button>
                  <span className="text-xs text-slate-600">
                    I agree to the{" "}
                    <a
                      href="#"
                      className="text-cyan-600 font-bold hover:underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-cyan-600 font-bold hover:underline"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </div>
              </div>

              {/* Submit Button - Full width */}
              <div className="p-6 md:p-8 pt-0">
                <button
                  type="submit"
                  disabled={isRegistering || !acceptedTerms}
                  className="w-full h-14 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-700 hover:to-teal-700 text-white font-black uppercase tracking-wider text-sm rounded-xl shadow-xl shadow-indigo-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                >
                  {isRegistering ? (
                    <>
                      <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      Create Account
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Login Link */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center text-xs font-bold uppercase text-slate-400 tracking-wider mt-6"
          >
            Already have an account?{" "}
            <Link
              to={ROUTES.LOGIN}
              className="text-cyan-400 hover:text-cyan-400 border-b-2 border-cyan-200 hover:border-cyan-400 transition-all"
            >
              Login here
            </Link>
          </motion.p>

          {/* Security Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
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
        </div>
      </main>
    </div>
  );
};

export default RegisterPage;
