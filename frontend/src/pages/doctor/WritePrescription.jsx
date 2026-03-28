import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  useCreatePrescriptionMutation,
  useGetPrescriptionQuery,
  useUpdatePrescriptionMutation,
} from "@/features/prescriptions/prescriptionApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { 
  Plus, 
  Trash2, 
  Pill, 
  CheckCircle, 
  ArrowRight,
  User,
  Stethoscope,
  Calendar,
  Clock,
  CircleAlert,
  FileText,
  Save,
  X,
  ChevronDown,
  Sparkles,
  Shield,
  Info,
  CircleHelp,
  CheckCheck,
  Edit,
  Copy,
  Printer,
  Download,
  RefreshCw,
  Eye,
  EyeOff,
  List,
  Grid,
  Search,
  Filter,
  ChevronRight,
  ChevronLeft,
  Upload,
  DownloadCloud,
  HeartPulse,
  Activity,
  BrainCircuit,
  Fingerprint,
  Syringe,
  Thermometer,
  Microscope,
  Bone,
  Droplets,
  Scissors,
  Bandage,
  Heart,
  Zap,
  Wind,
  Sun,
  Moon,
  Cloud,
  Umbrella,
  Home,
  Briefcase,
  Coffee,
  Pizza,
  Apple,
  Carrot,
  Fish
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Primary teal color from your palette
const primaryTeal = "#009689";
const tealLight = "#E6F7F5";
const tealHover = "#007F73";
const tealGlow = "rgba(0, 150, 137, 0.15)";

// Client-side schema mirroring backend
const prescriptionSchema = z.object({
  patientId: z.string().min(1, "Select a patient"),
  diagnosis: z.string().min(3, "Diagnosis is required"),
  medicines: z
    .array(
      z.object({
        name: z.string().min(1, "Medicine name is required"),
        dosage: z.string().min(1, "Dosage is required"),
        frequency: z.string().min(1, "Frequency is required"),
        duration: z.string().min(1, "Duration is required"),
        timing: z.string().optional(),
        notes: z.string().optional(),
      }),
    )
    .min(1, "Add at least one medicine"),
  instructions: z.string().optional(),
  followUp: z.string().optional(),
  isEmergency: z.boolean().optional(),
  isControlled: z.boolean().optional(),
});

const WritePrescription = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [showMedicineHelp, setShowMedicineHelp] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  const { data: patients, isLoading: loadingPatients, refetch: refetchPatients } = useListPatientsQuery();
  const { data: existingPrescription, isLoading: loadingExisting } =
    useGetPrescriptionQuery(id, { skip: !id });

  const [createPrescription, { isLoading: isCreating }] =
    useCreatePrescriptionMutation();
  const [updatePrescription, { isLoading: isUpdating }] =
    useUpdatePrescriptionMutation();

  const isEdit = !!id;
  const isSubmitting = isCreating || isUpdating;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty: formIsDirty },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      diagnosis: "",
      medicines: [
        { 
          name: "", 
          dosage: "", 
          frequency: "1-0-1", 
          duration: "5 days",
          timing: "After meals",
          notes: "",
        },
      ],
      instructions: "",
      followUp: "",
      isEmergency: false,
      isControlled: false,
    },
  });

  const watchPatientId = watch("patientId");
  const watchMedicines = watch("medicines");

  useEffect(() => {
    if (isEdit && existingPrescription) {
      reset({
        patientId:
          existingPrescription.patientId?._id || existingPrescription.patientId,
        diagnosis: existingPrescription.diagnosis,
        medicines: existingPrescription.medicines?.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          timing: m.instructions || "After meals",
          notes: "",
        })),
        instructions: existingPrescription.instructions,
        followUp: existingPrescription.followUp || "",
        isEmergency: existingPrescription.isEmergency || false,
        isControlled: existingPrescription.isControlled || false,
      });
    }
  }, [isEdit, existingPrescription, reset]);

  useEffect(() => {
    if (watchPatientId && patients) {
      const patient = patients.find(p => p._id === watchPatientId);
      setSelectedPatient(patient);
    } else {
      setSelectedPatient(null);
    }
  }, [watchPatientId, patients]);

  useEffect(() => {
    setIsDirty(formIsDirty);
  }, [formIsDirty]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = async (data) => {
    try {
      // Format data to match backend schema exactly
      const payload = {
        patientId: data.patientId,
        diagnosis: data.diagnosis,
        instructions: data.instructions,
        medicines: data.medicines.map((med) => ({
          name: med.name,
          dosage: med.dosage,
          frequency: med.frequency,
          duration: med.duration,
          // Merge UI timing and notes into backend instructions
          instructions: `${med.timing || ""} ${med.notes ? `- ${med.notes}` : ""}`.trim()
        }))
      };

      // Add followUpDate if it exists and handles different input types (convert string text to a date approx or just drop it if not a real date since schema requires YYYY-MM-DD)
      if (data.followUp) {
         // for simplicity, if it's already a valid date string we keep it, otherwise frontend might just ignore complex parsing for a hackathon
         const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
         if(dateRegex.test(data.followUp)) {
            payload.followUpDate = data.followUp;
         }
      }

      if (isEdit) {
        await updatePrescription({ id, data: payload }).unwrap();
        toast.success("Prescription updated successfully!", {
          icon: "✅",
          description: "Medical record synchronized",
        });
        navigate("/doctor/prescriptions");
      } else {
        await createPrescription(payload).unwrap();
        toast.success("Prescription saved successfully!", {
          icon: "✅",
          description: "New medical directive issued",
        });
        reset();
        navigate("/doctor/prescriptions");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEdit ? "update" : "save"} prescription`,
        {
          icon: "❌",
        }
      );
    }
  };

  const onError = (formErrors) => {
    if (formErrors.patientId || formErrors.diagnosis) {
      setActiveStep(1);
      toast.error("Please complete Patient & Diagnosis fields", { icon: "⚠️" });
    } else if (formErrors.medicines) {
      setActiveStep(2);
      toast.error("Please complete all Medication fields", { icon: "⚠️" });
    } else {
      toast.error("Please check the form for errors", { icon: "⚠️" });
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm("You have unsaved changes. Are you sure you want to leave?")) {
        navigate("/doctor/prescriptions");
      }
    } else {
      navigate("/doctor/prescriptions");
    }
  };

  const addMedicineFromTemplate = (template) => {
    append({
      name: template.name,
      dosage: template.dosage,
      frequency: template.frequency,
      duration: template.duration,
      timing: template.timing || "After meals",
      notes: template.notes || "",
    });
  };

  const medicineTemplates = [
    { name: "Amoxicillin 500mg", dosage: "1 tab", frequency: "1-0-1", duration: "7 days", timing: "After meals" },
    { name: "Paracetamol 650mg", dosage: "1 tab", frequency: "1-0-1", duration: "3 days", timing: "If fever" },
    { name: "Azithromycin 500mg", dosage: "1 tab", frequency: "1-0-0", duration: "3 days", timing: "Empty stomach" },
    { name: "Omeprazole 20mg", dosage: "1 cap", frequency: "0-0-1", duration: "14 days", timing: "Before breakfast" },
  ];

  const steps = [
    { number: 1, title: "Patient & Diagnosis", icon: User },
    { number: 2, title: "Medications", icon: Pill },
    { number: 3, title: "Instructions", icon: FileText },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto space-y-8 pb-10 px-4 sm:px-6"
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div 
              className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: primaryTeal }}
            >
              <Pill className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              {isEdit ? "Edit" : "Write"}<span style={{ color: primaryTeal }}>Prescription</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" style={{ color: primaryTeal }} />
            Issue validated medical directives for patient care
          </p>
        </div>

        {/* Provider ID */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-slate-100 shadow-sm">
          <div 
            className="h-10 w-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: tealLight }}
          >
            <Fingerprint className="h-5 w-5" style={{ color: primaryTeal }} />
          </div>
          <div>
            <p className="text-[8px] font-bold uppercase text-slate-400">Provider ID</p>
            <p className="text-sm font-bold text-slate-700">PR-{Math.floor(Math.random() * 1000)}-CLINIC</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.number === activeStep;
          const isCompleted = step.number < activeStep;
          
          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{ duration: 0.5, repeat: isActive ? Infinity : 0, repeatDelay: 1 }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                    isCompleted
                      ? "text-white"
                      : isActive
                      ? "text-white shadow-lg"
                      : "bg-slate-100 text-slate-400"
                  }`}
                  style={
                    isCompleted || isActive
                      ? { background: primaryTeal }
                      : {}
                  }
                >
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
                <p className="text-[8px] font-bold text-center mt-2 text-slate-500">{step.title}</p>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={`flex-1 h-1 mx-2 rounded ${
                    step.number < activeStep 
                      ? "bg-teal-500" 
                      : "bg-slate-200"
                  }`}
                  style={step.number < activeStep ? { backgroundColor: primaryTeal } : {}}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          {/* Step 1: Patient & Diagnosis */}
          <AnimatePresence mode="wait">
            {activeStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <User className="h-4 w-4" style={{ color: primaryTeal }} />
                  Patient Assignment
                </h3>

                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Select Patient
                    </label>
                    <select
                      {...register("patientId", {
                        onChange: (e) => {
                          if (e.target.value) setActiveStep(2);
                        }
                      })}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                      style={{ 
                        focusBorderColor: primaryTeal, 
                        focusRing: `0 0 0 3px ${tealGlow}` 
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryTeal;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">-- Search Patient Directory --</option>
                      {!loadingPatients &&
                        patients?.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name} ({p.age}y, {p.gender}) - {p.contact}
                          </option>
                        ))}
                    </select>
                    {errors.patientId && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <CircleAlert className="h-3 w-3" />
                        {errors.patientId.message}
                      </p>
                    )}
                  </div>

                  {/* Selected Patient Card */}
                  {selectedPatient && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 rounded-xl border bg-slate-50"
                      style={{ borderColor: `${primaryTeal}30` }}
                    >
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                          style={{ backgroundColor: primaryTeal }}
                        >
                          {selectedPatient.name?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{selectedPatient.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-slate-500">{selectedPatient.age} years</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-xs text-slate-500 capitalize">{selectedPatient.gender}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-xs text-slate-500">{selectedPatient.bloodGroup || "Blood unknown"}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div className="space-y-2">
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      {...register("diagnosis")}
                      placeholder="e.g. Acute Respiratory Infection"
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                      style={{ 
                        focusBorderColor: primaryTeal, 
                        focusRing: `0 0 0 3px ${tealGlow}` 
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryTeal;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                    {errors.diagnosis && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <CircleAlert className="h-3 w-3" />
                        {errors.diagnosis.message}
                      </p>
                    )}
                  </div>

                  {/* Flags */}
                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isEmergency")}
                        className="w-4 h-4 rounded border-slate-300"
                        style={{ accentColor: primaryTeal }}
                      />
                      <span className="text-sm text-slate-600">Emergency</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        {...register("isControlled")}
                        className="w-4 h-4 rounded border-slate-300"
                        style={{ accentColor: primaryTeal }}
                      />
                      <span className="text-sm text-slate-600">Controlled Substance</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Medications */}
            {activeStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Pill className="h-4 w-4" style={{ color: primaryTeal }} />
                    Pharmacotherapy Directives
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowMedicineHelp(!showMedicineHelp)}
                      className="h-8 px-3 text-xs rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <CircleHelp className="h-3 w-3" />
                      Templates
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        append({
                          name: "",
                          dosage: "",
                          frequency: "1-0-1",
                          duration: "",
                          timing: "After meals",
                          notes: "",
                        })
                      }
                      className="h-8 px-3 text-white text-xs rounded-lg transition-colors flex items-center gap-1"
                      style={{ 
                        backgroundColor: primaryTeal,
                        hoverBackground: tealHover
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tealHover}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = primaryTeal}
                    >
                      <Plus className="h-3 w-3" />
                      Add Medicine
                    </button>
                  </div>
                </div>

                {/* Medicine Templates */}
                <AnimatePresence>
                  {showMedicineHelp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 mb-4">
                        <p className="text-xs font-medium text-slate-600 mb-3">Quick Templates</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {medicineTemplates.map((template, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => addMedicineFromTemplate(template)}
                              className="p-2 bg-white rounded-lg border border-slate-200 hover:border-teal-300 text-left transition-all"
                              style={{ hoverBorderColor: primaryTeal }}
                            >
                              <p className="text-xs font-bold text-slate-700">{template.name}</p>
                              <p className="text-[10px] text-slate-500">{template.dosage} • {template.frequency}</p>
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Medicines List */}
                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <motion.div
                      key={field.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 border rounded-xl relative"
                      style={{ borderColor: `${primaryTeal}20` }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                        <div className="md:col-span-2">
                          <label className="text-[10px] font-medium text-slate-400 mb-1 block">
                            Medicine Name
                          </label>
                          <input
                            {...register(`medicines.${index}.name`)}
                            placeholder="e.g. Amoxicillin 500mg"
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                            style={{ 
                              focusBorderColor: primaryTeal, 
                              focusRing: `0 0 0 2px ${tealGlow}` 
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.borderColor = primaryTeal;
                              e.currentTarget.style.boxShadow = `0 0 0 2px ${tealGlow}`;
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.borderColor = '#e2e8f0';
                              e.currentTarget.style.boxShadow = 'none';
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-slate-400 mb-1 block">
                            Dosage
                          </label>
                          <input
                            {...register(`medicines.${index}.dosage`)}
                            placeholder="1 tab"
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                            style={{ 
                              focusBorderColor: primaryTeal, 
                              focusRing: `0 0 0 2px ${tealGlow}` 
                            }}
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-slate-400 mb-1 block">
                            Frequency
                          </label>
                          <select
                            {...register(`medicines.${index}.frequency`)}
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                            style={{ 
                              focusBorderColor: primaryTeal, 
                              focusRing: `0 0 0 2px ${tealGlow}` 
                            }}
                          >
                            <option value="1-0-1">Morning & Night (1-0-1)</option>
                            <option value="1-1-1">Three Times (1-1-1)</option>
                            <option value="1-0-0">Morning Only (1-0-0)</option>
                            <option value="0-0-1">Night Only (0-0-1)</option>
                            <option value="0-1-0">Afternoon Only (0-1-0)</option>
                            <option value="As needed">As needed</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-medium text-slate-400 mb-1 block">
                            Duration
                          </label>
                          <input
                            {...register(`medicines.${index}.duration`)}
                            placeholder="5 days"
                            className="w-full h-10 px-3 rounded-lg border border-slate-200 text-sm outline-none transition-all"
                            style={{ 
                              focusBorderColor: primaryTeal, 
                              focusRing: `0 0 0 2px ${tealGlow}` 
                            }}
                          />
                        </div>

                        <div className="absolute top-2 right-2 md:relative md:top-0 md:right-0">
                          <button
                            type="button"
                            onClick={() => remove(index)}
                            className="h-10 w-10 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            disabled={fields.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 mt-2">
                        <div>
                          <input
                            {...register(`medicines.${index}.timing`)}
                            placeholder="Timing (e.g. After meals)"
                            className="w-full h-8 px-3 text-xs rounded-lg border border-slate-200 outline-none transition-all"
                          />
                        </div>
                        <div>
                          <input
                            {...register(`medicines.${index}.notes`)}
                            placeholder="Special instructions"
                            className="w-full h-8 px-3 text-xs rounded-lg border border-slate-200 outline-none transition-all"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {errors.medicines?.root && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <CircleAlert className="h-3 w-3" />
                    {errors.medicines.root.message}
                  </p>
                )}
              </motion.div>
            )}

            {/* Step 3: Instructions */}
            {activeStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-6 space-y-6"
              >
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                  <FileText className="h-4 w-4" style={{ color: primaryTeal }} />
                  Medical Advice & Follow-up
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Instructions & Contraindications
                    </label>
                    <textarea
                      {...register("instructions")}
                      placeholder="Detailed regimen instructions, potential side effects, and warnings..."
                      rows={4}
                      className="w-full p-4 rounded-xl border border-slate-200 text-sm outline-none transition-all resize-none"
                      style={{ 
                        focusBorderColor: primaryTeal, 
                        focusRing: `0 0 0 3px ${tealGlow}` 
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = primaryTeal;
                        e.currentTarget.style.boxShadow = `0 0 0 3px ${tealGlow}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-500 mb-1 block">
                      Follow-up Date (Optional)
                    </label>
                    <input
                      type="date"
                      {...register("followUp")}
                      className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm outline-none transition-all"
                      style={{ 
                        focusBorderColor: primaryTeal, 
                        focusRing: `0 0 0 3px ${tealGlow}` 
                      }}
                    />
                  </div>

                  {/* Preview Card */}
                  <div 
                    className="p-4 rounded-xl border"
                    style={{ backgroundColor: tealLight, borderColor: primaryTeal }}
                  >
                    <h4 className="text-xs font-bold mb-2" style={{ color: primaryTeal }}>Prescription Summary</h4>
                    <div className="space-y-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Patient:</span> {selectedPatient?.name || "Not selected"}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Diagnosis:</span> {watch("diagnosis") || "Not specified"}
                      </p>
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Medications:</span> {watchMedicines?.length || 0} items
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Cancel
              </button>

              {activeStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="px-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-2 text-white text-sm font-bold rounded-lg transition-all flex items-center gap-2 shadow-lg"
                  style={{ 
                    background: primaryTeal,
                    boxShadow: `0 4px 6px ${tealGlow}`
                  }}
                  onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.background = tealHover)}
                  onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.background = primaryTeal)}
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isEdit ? "Updating..." : "Saving..."}
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      {isEdit ? "Update Prescription" : "Issue Prescription"}
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Warning for unsaved changes */}
      <AnimatePresence>
        {isDirty && !isSubmitting && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 bg-amber-50 border border-amber-200 rounded-lg p-3 shadow-lg flex items-center gap-3"
          >
            <CircleAlert className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-700">You have unsaved changes</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default WritePrescription;
