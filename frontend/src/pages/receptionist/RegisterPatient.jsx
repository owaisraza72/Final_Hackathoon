import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRegisterPatientMutation } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { UserPlus, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.coerce.number().min(0, "Age must be valid"),
  gender: z.enum(["male", "female", "other"]),
  contact: z
    .string()
    .min(10, "Valid contact number required")
    .regex(/^[0-9+\-\s]+$/, "Invalid format"),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  address: z.string().optional(),
  bloodGroup: z
    .enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "unknown"])
    .optional(),
  emergencyContact: z
    .object({
      name: z.string().optional(),
      phone: z.string().optional(),
      relation: z.string().optional(),
    })
    .optional(),
});

const RegisterPatient = () => {
  const [registerPatient, { isLoading }] = useRegisterPatientMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { gender: "male", bloodGroup: "unknown" },
  });

  const onSubmit = async (data) => {
    try {
      await registerPatient(data).unwrap();
      toast.success("Patient registered successfully!");
      navigate("/receptionist");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Patient Intake Manifest"
          description="Initialize a new clinical record within the global directory."
        />
        <div className="h-14 px-6 bg-white border border-slate-200 rounded-[24px] shadow-sm flex items-center gap-4">
          <div className="h-2 w-2 rounded-full bg-teal-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
            Entry Protocol Active
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-10 rounded-[48px] premium-shadow border border-slate-100/60 space-y-12"
      >
        {/* Personal Details Section */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 border-b border-slate-50 pb-6">
            <div className="h-12 w-12 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 border border-teal-100/50">
              <UserPlus className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Identity Matrix
              </h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Core Biographical Data
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-x-10 gap-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Full Legal Name
              </label>
              <input
                {...register("name")}
                placeholder="e.g. Alexander Pierce"
                className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
              {errors.name && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Temporal Age
                </label>
                <input
                  type="number"
                  {...register("age")}
                  className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
                />
                {errors.age && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                    {errors.age.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Gender Node
                </label>
                <select
                  {...register("gender")}
                  className="w-full h-14 pl-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none appearance-none"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Communication Link
              </label>
              <input
                {...register("contact")}
                placeholder="+1 (555) 000-0000"
                className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
              {errors.contact && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.contact.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Hematological Profile
              </label>
              <select
                {...register("bloodGroup")}
                className="w-full h-14 pl-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none appearance-none"
              >
                <option value="unknown">Pending Verification</option>
                <option value="A+">A Positive (+)</option>
                <option value="A-">A Negative (-)</option>
                <option value="B+">B Positive (+)</option>
                <option value="B-">B Negative (-)</option>
                <option value="AB+">AB Positive (+)</option>
                <option value="AB-">AB Negative (-)</option>
                <option value="O+">O Positive (+)</option>
                <option value="O-">O Negative (-)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Contact Email
              </label>
              <input
                {...register("email")}
                placeholder="patient@clinicos.pro"
                className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
              {errors.email && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Emergency Contact Section */}
        <section className="space-y-8 pt-6 border-t border-slate-50">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 border border-amber-100/50">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-800 tracking-tight">
                Kinship Directive (Optional)
              </h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
                Emergency Escalation Link
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Kin Name
              </label>
              <input
                {...register("emergencyContact.name")}
                className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Kin Liaison
              </label>
              <input
                {...register("emergencyContact.phone")}
                className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Kin Relationship
              </label>
              <input
                {...register("emergencyContact.relation")}
                className="w-full h-14 px-5 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-8 border-t border-slate-50">
          <button
            type="submit"
            disabled={isLoading}
            className="h-16 px-12 bg-slate-900 hover:bg-teal-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl transition-all duration-500 flex items-center gap-4 group active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Validating Entry...
              </div>
            ) : (
              <>
                Confirm Intake
                <UserPlus className="h-5 w-5 group-hover:scale-125 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPatient;
