import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
  Activity,
  Award,
  Star,
  Clock,
  FileText,
  CheckCircle2,
  Settings,
  Camera,
  Edit3,
  Key,
  ShieldCheck,
  X,
  Save,
  HeartPulse,
  Stethoscope,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useGetDoctorAnalyticsQuery,
} from "@/features/auth/authApi";
import { toast } from "sonner";

const primaryTeal = "#00BBA7";
const tealLight = "#E0F7F5";

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] =
    useChangePasswordMutation();

  const { data: analyticsData } = useGetDoctorAnalyticsQuery(undefined, {
    skip: user?.role !== "DOCTOR",
  });
  const analytics = analyticsData?.data || {
    totalPrescriptions: 0,
    totalPatientsTreated: 0,
  };

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = async () => {
    try {
      await updateProfile(formData).unwrap();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }).unwrap();
      toast.success("Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to change password");
    }
  };

  const profileData = {
    joinDate: new Date(user?.createdAt || Date.now()).toLocaleDateString(
      "en-US",
      { month: "long", year: "numeric" },
    ),
    address: user?.address || "Please update your address.",
    phone: user?.phone || "Please update your phone.",
    achievements: [
      { title: "Top Rated", icon: Star },
      { title: "Certified", icon: Award },
    ],
    stats: [
      {
        label: "Patients Treated",
        value: user?.role === "DOCTOR" ? analytics.totalPatientsTreated : 1,
      },
      {
        label: "Patients Treated",
        value: user?.role === "DOCTOR" ? analytics.totalPatientsTreated : 1,
      },
      { label: "Response Time", value: "< 5 mins" },
    ],
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "ADMIN":
        return "from-teal-600 to-teal-500";
      case "DOCTOR":
        return `from-${primaryTeal} to-teal-500`;
      case "RECEPTIONIST":
        return "from-teal-600 to-teal-500";
      case "PATIENT":
        return "from-teal-300 to-teal-500";
      default:
        return `from-${primaryTeal} to-teal-500`;
    }
  };

  const getRoleBg = () => {
    switch (user?.role) {
      case "ADMIN":
        return "bg-purple-50 text-purple-600";
      case "DOCTOR":
        return "bg-teal-50 text-teal-600";
      case "RECEPTIONIST":
        return "bg-blue-50 text-blue-600";
      case "PATIENT":
        return "bg-amber-50 text-amber-600";
      default:
        return "bg-teal-50 text-teal-600";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6 pb-12 px-4 sm:px-6"
    >
      {/* Profile Header Card */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden"
      >
        <div className={`h-32 w-full bg-gradient-to-r ${getRoleColor()}`} />

        <div className="px-6 pb-6 relative">
          <div className="flex flex-col md:flex-row gap-5 items-start md:items-end -mt-12 mb-5">
            <div className="h-24 w-24 rounded-2xl bg-white p-1 shadow-xl">
              <div
                className={`h-full w-full rounded-xl bg-gradient-to-r ${getRoleColor()} flex items-center justify-center`}
              >
                <span className="text-2xl font-bold text-white">
                  {user?.name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>

            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">
                    {user?.name}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                    <span
                      className={`px-2.5 py-0.5 rounded-lg text-xs font-medium ${getRoleBg()}`}
                    >
                      {user?.role}
                    </span>
                    <span className="text-slate-300">|</span>
                    <span>
                      {user?.role === "DOCTOR" ? "Cardiology" : "Healthcare"}
                    </span>
                  </p>
                </div>

                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveProfile}
                        disabled={isUpdating}
                        className="px-4 py-2 text-sm text-white rounded-lg"
                        style={{ backgroundColor: primaryTeal }}
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-4 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 flex items-center gap-1"
                      >
                        <Edit3 className="h-3 w-3" /> Edit
                      </button>
                      <button
                        onClick={() => setShowPasswordModal(true)}
                        className="px-4 py-2 text-sm text-white rounded-lg"
                        style={{ backgroundColor: primaryTeal }}
                      >
                        Password
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            {profileData.stats.map((stat, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-50">
                <p className="text-xs text-slate-500 mb-1">{stat.label}</p>
                <p className="text-xl font-bold text-slate-800">{stat.value}</p>
              </div>
            ))}
            <div className="p-3 rounded-xl bg-slate-50">
              <p className="text-xs text-slate-500 mb-1">Journey</p>
              <p className="text-sm font-bold text-slate-700">
                {profileData.joinDate}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Left Column - Details */}
        <motion.div variants={itemVariants} className="space-y-5">
          {/* Contact Details */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">
              Contact Details
            </h3>

            <div className="space-y-4">
              <div className="flex gap-3">
                <Mail className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">EMAIL</p>
                  {isEditing ? (
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="text-sm text-slate-700 border rounded px-2 py-1 w-full"
                    />
                  ) : (
                    <p className="text-sm text-slate-700">{user?.email}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">PHONE</p>
                  {isEditing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="text-sm text-slate-700 border rounded px-2 py-1"
                    />
                  ) : (
                    <p className="text-sm text-slate-700">
                      {profileData.phone}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <MapPin className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-xs text-slate-400">LOCATION</p>
                  {isEditing ? (
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="text-sm text-slate-700 border rounded px-2 py-1 w-full"
                      rows={2}
                    />
                  ) : (
                    <p className="text-sm text-slate-700">
                      {profileData.address}
                    </p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex gap-3">
                  <User className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="text-xs text-slate-400">FULL NAME</p>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="text-sm text-slate-700 border rounded px-2 py-1"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Credentials */}
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
            <h3 className="text-sm font-semibold text-slate-800 mb-3">
              Credentials
            </h3>
            <div className="space-y-2">
              {profileData.achievements.map((item, i) => {
                const Icon = item.icon;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50"
                  >
                    <Icon className="h-5 w-5 text-slate-500" />
                    <span className="text-sm text-slate-700">{item.title}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Column - Tabs */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-5">
          {/* Tabs */}
          <div className="bg-white rounded-xl p-1 shadow-sm border border-slate-100 flex">
            {["overview", "security", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "text-white"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
                style={
                  activeTab === tab ? { backgroundColor: primaryTeal } : {}
                }
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-semibold text-slate-800 mb-3">
                    Professional Summary
                  </h3>
                  <p className="text-slate-600 text-sm">
                    Welcome to your customized ClinicOS profile. This secure
                    environment manages your operational credentials, facility
                    access levels, and clinical history logs. Ensure your
                    contact details remain up-to-date to receive critical system
                    alerts and patient notifications in real-time.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: tealLight }}
                  >
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center mb-3">
                      <Activity
                        className="h-4 w-4"
                        style={{ color: primaryTeal }}
                      />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      System Status
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Your account is fully active and verified for all clinical
                      operations.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-indigo-50">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center mb-3">
                      <Shield className="h-4 w-4 text-indigo-500" />
                    </div>
                    <h4 className="font-semibold text-slate-800 text-sm">
                      Access Level
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Granted Tier-1 permissions for {user?.role} specific
                      subsystems.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "security" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <Key className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-800">Password</p>
                      <p className="text-xs text-slate-500">
                        Last changed 3 months ago
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-3 py-1.5 text-xs rounded-lg"
                    style={{ backgroundColor: tealLight, color: primaryTeal }}
                  >
                    Update
                  </button>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-xl">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-slate-500" />
                    <div>
                      <p className="font-semibold text-slate-800">
                        Two-Factor Authentication
                      </p>
                      <p className="text-xs text-slate-500">
                        Add an extra layer of security
                      </p>
                    </div>
                  </div>
                  <button className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs rounded-lg">
                    Enable
                  </button>
                </div>
              </div>
            )}

            {activeTab === "activity" && (
              <div>
                <div className="relative pl-5 border-l-2 border-slate-100 space-y-5">
                  <div className="relative">
                    <div className="absolute -left-[31px] h-6 w-6 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white">
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">
                        Logged In
                      </h4>
                      <p className="text-xs text-slate-500">
                        Successful authentication from secure IP
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Just now
                      </p>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute -left-[31px] h-6 w-6 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white">
                      <Settings className="h-3 w-3 text-indigo-500" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">
                        Profile Updated
                      </h4>
                      <p className="text-xs text-slate-500">
                        Changed notification preferences
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> 2 hours ago
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowPasswordModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex justify-between">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <input
                type="password"
                name="currentPassword"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full h-10 px-3 rounded-lg border"
              />
              <input
                type="password"
                name="newPassword"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="w-full h-10 px-3 rounded-lg border"
              />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="w-full h-10 px-3 rounded-lg border"
              />
            </div>
            <div className="p-6 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                disabled={isChangingPassword}
                className="px-4 py-2 text-white rounded-lg"
                style={{ backgroundColor: primaryTeal }}
              >
                {isChangingPassword ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProfilePage;
