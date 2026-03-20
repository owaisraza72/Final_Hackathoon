import { useState } from "react";
import useAuth from "@/hooks/useAuth";
import { 
  User, Mail, Phone, MapPin, Calendar, Shield, Activity, Award, Star, Clock, FileText, CheckCircle2, ChevronRight, Settings, Camera, Edit3, Key, ShieldCheck, X, Save
} from "lucide-react";
import { motion } from "framer-motion";
import { useUpdateProfileMutation, useChangePasswordMutation, useGetDoctorAnalyticsQuery } from "@/features/auth/authApi";
import { toast } from "sonner";

const ProfilePage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  
  // Fetch real analytics if user is a doctor
  const { data: analyticsData } = useGetDoctorAnalyticsQuery(undefined, {
    skip: user?.role !== "DOCTOR"
  });
  const analytics = analyticsData?.data || { totalPrescriptions: 0, totalPatientsTreated: 0 };

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    department: user?.department || ""
  });

  const handleInputChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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

  // Mock data for the profile since we don't have full data in user object
  const profileData = {
    joinDate: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    status: user?.isActive ? "Active" : "Inactive",
    lastLogin: "Currently Online",
    address: user?.address || "Please update your address.",
    phone: user?.phone || "Please update your phone.",
    department: user?.department || (user?.role === "DOCTOR" ? "Cardiology" : user?.role === "RECEPTIONIST" ? "Front Desk Operations" : "Patient Care"),
    achievements: [
      { title: "Top Rated", icon: Star, color: "text-amber-500", bg: "bg-amber-50" },
      { title: "Certified", icon: Award, color: "text-blue-500", bg: "bg-blue-50" },
      { title: "HIPAA Compliant", icon: ShieldCheck, color: "text-emerald-500", bg: "bg-emerald-50" }
    ],
    stats: [
      { label: "Total Prescriptions", value: user?.role === "DOCTOR" ? analytics.totalPrescriptions : "N/A" },
      { label: "Patients Treated", value: user?.role === "DOCTOR" ? analytics.totalPatientsTreated : "N/A" },
      { label: "Response Time", value: "< 5 mins" }
    ]
  };

  const getRoleColor = () => {
    switch (user?.role) {
      case "ADMIN": return "from-purple-600 to-indigo-600";
      case "DOCTOR": return "from-teal-600 to-emerald-600";
      case "RECEPTIONIST": return "from-blue-600 to-cyan-600";
      case "PATIENT": return "from-amber-600 to-orange-600";
      default: return "from-teal-600 to-indigo-600";
    }
  };

  const getRoleBg = () => {
    switch (user?.role) {
      case "ADMIN": return "bg-purple-50 text-purple-600 border-purple-200";
      case "DOCTOR": return "bg-teal-50 text-teal-600 border-teal-200";
      case "RECEPTIONIST": return "bg-blue-50 text-blue-600 border-blue-200";
      case "PATIENT": return "bg-amber-50 text-amber-600 border-amber-200";
      default: return "bg-teal-50 text-teal-600 border-teal-200";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto space-y-6 pb-12"
    >
      {/* Profile Header Card */}
      <motion.div variants={itemVariants} className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden relative premium-shadow">
        {/* Abstract Background Header */}
        <div className={`h-48 w-full bg-gradient-to-r ${getRoleColor()} relative overflow-hidden flex items-center justify-center`}>
           {/* Abstract patterns */}
           <div className="absolute inset-0 opacity-10">
             <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
             <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-black blur-3xl transform translate-x-1/4 translate-y-1/4"></div>
           </div>
           
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
           
           {/* Header badges */}
           <div className="absolute top-4 right-4 flex gap-2">
             <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-widest flex items-center gap-1.5 border border-white/20 shadow-lg">
               <Activity className="h-3 w-3" /> System Active
             </div>
           </div>
        </div>

        {/* Profile Info Section */}
        <div className="px-8 pb-8 relative">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-20 sm:-mt-24 mb-6">
            {/* Avatar relative container */}
            <div className="relative group">
              <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-3xl bg-white p-2 shadow-2xl relative z-10">
                <div className={`h-full w-full rounded-2xl bg-gradient-to-br ${getRoleColor()} flex items-center justify-center overflow-hidden relative`}>
                   {user?.avatar ? (
                     <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                   ) : (
                     <span className="text-5xl font-black text-white mix-blend-overlay">
                       {user?.name?.charAt(0)?.toUpperCase()}
                     </span>
                   )}
                   {/* Avatar hover overlay */}
                   <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                      <Camera className="h-8 w-8 text-white" />
                   </div>
                </div>
              </div>
              
              {/* Status indicator */}
              <div className="absolute bottom-4 right-0 h-6 w-6 bg-green-500 rounded-full border-4 border-white z-20 shadow-lg shadow-green-500/50"></div>
            </div>

            {/* Profile Meta Info */}
            <div className="flex-1 space-y-2 mt-4 md:mt-0 z-10 w-full">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end w-full gap-4">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                    {user?.name}
                    {user?.role === "DOCTOR" && <CheckCircle2 className="h-6 w-6 text-blue-500" />}
                  </h1>
                  <p className="text-slate-500 font-medium mt-1 flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-lg text-xs font-black uppercase tracking-widest border ${getRoleBg()}`}>
                      {user?.role}
                    </span>
                    <span className="text-sm">|</span>
                    <span className="text-sm">{profileData.department}</span>
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex-1 sm:flex-none h-11 px-5 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold rounded-xl transition-all shadow-sm"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSaveProfile}
                        disabled={isUpdating}
                        className={`flex-1 sm:flex-none h-11 px-5 bg-gradient-to-r ${getRoleColor()} text-white text-sm font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2`}
                      >
                        {isUpdating ? <div className="animate-spin h-4 w-4 border-2 border-white/50 border-t-white rounded-full"></div> : <><Save className="h-4 w-4" /> Save</>}
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex-1 sm:flex-none h-11 px-5 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-50 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <Edit3 className="h-4 w-4" /> Edit Profile
                      </button>
                      <button className={`flex-1 sm:flex-none h-11 px-5 bg-gradient-to-r ${getRoleColor()} text-white text-sm font-bold rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2`}>
                        <Settings className="h-4 w-4" /> Settings
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Key Stats Row (For applicable roles) */}
          {(user?.role === "DOCTOR" || user?.role === "RECEPTIONIST") && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
              {profileData.stats.map((stat, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-slate-800">{stat.value}</p>
                </div>
              ))}
              <div className="p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-slate-50 transition-colors">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">Joined</p>
                 <p className="text-lg font-bold text-slate-700 mt-1">{profileData.joinDate}</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          
          {/* Contact Information Card */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
              <User className="h-4 w-4 text-slate-400" />
              Contact Details
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start group">
                <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0 group-hover:bg-indigo-100 transition-colors">
                  <Mail className="h-4 w-4 text-indigo-500" />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Email Address</p>
                  <p className="text-sm font-bold text-slate-700 break-all">{user?.email}</p>
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="h-10 w-10 rounded-xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                  <Phone className="h-4 w-4 text-teal-500" />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Phone Number</p>
                  {isEditing ? (
                    <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-teal-500" />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">{profileData.phone}</p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 items-start group">
                <div className="h-10 w-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 group-hover:bg-amber-100 transition-colors">
                  <MapPin className="h-4 w-4 text-amber-500" />
                </div>
                <div className="w-full">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Location</p>
                  {isEditing ? (
                    <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-amber-500 resize-none" rows={2} />
                  ) : (
                    <p className="text-sm font-bold text-slate-700 leading-snug">{profileData.address}</p>
                  )}
                </div>
              </div>
              
              {isEditing && (
                 <div className="flex gap-4 items-start group">
                   <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center shrink-0 group-hover:bg-purple-100 transition-colors">
                     <User className="h-4 w-4 text-purple-500" />
                   </div>
                   <div className="w-full">
                     <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Full Name</p>
                     <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full text-sm font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-purple-500" />
                   </div>
                 </div>
              )}
            </div>
          </div>

          {/* Certifications / Badges */}
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100">
             <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6 flex items-center gap-2">
               <Award className="h-4 w-4 text-slate-400" />
               Credentials
             </h3>
             <div className="space-y-3">
               {profileData.achievements.map((item, i) => {
                 const Icon = item.icon;
                 return (
                   <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-default">
                     <div className={`h-10 w-10 rounded-xl ${item.bg} flex items-center justify-center`}>
                       <Icon className={`h-4 w-4 ${item.color}`} />
                     </div>
                     <p className="text-sm font-bold text-slate-700 flex-1">{item.title}</p>
                     <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                   </div>
                 )
               })}
             </div>
          </div>
        </motion.div>

        {/* Right Column - Tabs & Content */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
          
          {/* Custom Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-slate-100 flex overflow-x-auto hide-scrollbar">
            {["overview", "security", "activity"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 min-w-[120px] px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                  activeTab === tab 
                    ? `bg-slate-900 text-white shadow-md` 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content Area */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 min-h-[400px]">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                 <div>
                   <h3 className="text-lg font-black text-slate-800 mb-4">Professional Summary</h3>
                   <p className="text-slate-600 leading-relaxed font-medium">
                     Welcome to your customized ClinicOS profile. This secure environment manages your operational credentials, facility access levels, and clinical history logs. 
                     Ensure your contact details remain up-to-date to receive critical system alerts and patient notifications in real-time.
                   </p>
                 </div>

                 <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="p-5 rounded-2xl bg-teal-50/50 border border-teal-100 group hover:bg-teal-50 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm border border-teal-100">
                        <Activity className="h-5 w-5 text-teal-500" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">System Status</h4>
                      <p className="text-xs text-slate-500 font-medium">Your account is fully active and verified for all clinical operations.</p>
                    </div>
                    
                    <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100 group hover:bg-indigo-50 transition-colors">
                      <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center mb-4 shadow-sm border border-indigo-100">
                        <Shield className="h-5 w-5 text-indigo-500" />
                      </div>
                      <h4 className="font-bold text-slate-800 mb-1">Access Level</h4>
                      <p className="text-xs text-slate-500 font-medium">Granted Tier-1 permissions for {user?.role} specific subsystems.</p>
                    </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <h3 className="text-lg font-black text-slate-800 mb-6">Security Settings</h3>
                 
                 <div className="space-y-4">
                   <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                           <Key className="h-5 w-5 text-slate-600" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-800">Password</p>
                           <p className="text-xs text-slate-500 font-medium mt-0.5">Last changed 3 months ago</p>
                         </div>
                      </div>
                      <button className="px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0">
                         Update
                      </button>
                   </div>

                   <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition-colors">
                      <div className="flex items-center gap-4">
                         <div className="h-12 w-12 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-center">
                           <ShieldCheck className="h-5 w-5 text-slate-600" />
                         </div>
                         <div>
                           <p className="font-bold text-slate-800">Two-Factor Authentication</p>
                           <p className="text-xs text-slate-500 font-medium mt-0.5">Add an extra layer of security</p>
                         </div>
                      </div>
                      <button className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shrink-0">
                         Enable
                      </button>
                   </div>
                 </div>
              </motion.div>
            )}

            {activeTab === "activity" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-lg font-black text-slate-800 mb-6 flex justify-between items-center">
                   Recent Activity Log
                   <span className="text-xs font-bold uppercase tracking-widest text-teal-600 bg-teal-50 px-3 py-1 rounded-full">Live</span>
                </h3>
                
                <div className="relative pl-6 border-l-2 border-slate-100 space-y-8 pb-4">
                   {[
                     { title: "Logged In", desc: "Successful authentication from IP 192.168.1.1", time: "Just now", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100" },
                     { title: "Profile Updated", desc: "Changed notification preferences", time: "2 hours ago", icon: Settings, color: "text-indigo-500", bg: "bg-indigo-100" },
                     { title: "Report Generated", desc: "Weekly analytics summary exported", time: "Yesterday", icon: FileText, color: "text-amber-500", bg: "bg-amber-100" },
                     { title: "System Login", desc: "Session started on new device", time: "Oct 24, 2023", icon: Activity, color: "text-slate-500", bg: "bg-slate-200" }
                   ].map((item, i) => {
                     const Icon = item.icon;
                     return (
                       <div key={i} className="relative">
                         <div className={`absolute -left-[35px] h-6 w-6 rounded-full ${item.bg} flex items-center justify-center border-4 border-white shadow-sm`}>
                            <Icon className={`h-3 w-3 ${item.color}`} />
                         </div>
                         <div>
                           <h4 className="font-bold text-slate-800 text-sm">{item.title}</h4>
                           <p className="text-xs text-slate-500 font-medium mt-1">{item.desc}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2 flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {item.time}
                           </p>
                         </div>
                       </div>
                     )
                   })}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default ProfilePage;
