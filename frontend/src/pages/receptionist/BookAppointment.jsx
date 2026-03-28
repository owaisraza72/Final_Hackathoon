import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBookAppointmentMutation } from "@/features/appointments/appointmentApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import { useListUsersQuery } from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import {
  CalendarCheck,
  ArrowRight,
  User,
  Stethoscope,
  Clock,
  Calendar,
  FileText,
  CircleAlert,
  CircleCheckBig,
  CircleX,
  Loader2,
  Phone,
  Mail,
  HeartPulse,
  Activity,
  Shield,
  Sparkles,
  ChevronRight,
  Users,
  Syringe,
  Pill,
  Scan,
  Fingerprint,
  Info,
  CalendarDays,
  Watch,
  Bell,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient selection is required"),
  doctorId: z.string().min(1, "Doctor assignment is required"),
  date: z.string().min(1, "Consultation date is required"),
  timeSlot: z.string().min(1, "Time slot selection is required"),
  reason: z.string().optional(),
  appointmentType: z.string().default("regular"),
  priority: z.string().default("normal"),
  notes: z.string().optional(),
});

const generateTimeSlots = (date = new Date()) => {
  const slots = [];
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();

  for (let i = 9; i <= 17; i++) {
    for (let j = 0; j < 2; j++) {
      const minutes = j === 0 ? "00" : "30";
      const hour = i > 12 ? i - 12 : i;
      const ampm = i >= 12 ? "PM" : "AM";
      const timeValue = `${i}:${minutes}`;
      const displayValue = `${hour}:${minutes} ${ampm}`;

      // Disable past time slots for today
      const isPast =
        isToday &&
        (i < currentHour ||
          (i === currentHour && parseInt(minutes) < currentMinutes));

      slots.push({
        value: displayValue,
        display: displayValue,
        available: !isPast,
        booked: Math.random() < 0.3, // Mock booked slots - replace with real data
      });
    }
  }
  return slots;
};

const appointmentTypes = [
  {
    value: "regular",
    label: "Regular Checkup",
    icon: HeartPulse,
    color: "from-teal-500 to-emerald-500",
  },
  {
    value: "followup",
    label: "Follow-up Visit",
    icon: Activity,
    color: "from-blue-500 to-cyan-500",
  },
  {
    value: "emergency",
    label: "Emergency",
    icon: CircleAlert,
    color: "from-red-500 to-rose-500",
  },
  {
    value: "consultation",
    label: "Consultation",
    icon: Stethoscope,
    color: "from-purple-500 to-pink-500",
  },
];

const priorities = [
  { value: "normal", label: "Normal", color: "bg-slate-500" },
  { value: "urgent", label: "Urgent", color: "bg-amber-500" },
  { value: "critical", label: "Critical", color: "bg-red-500" },
];

const BookAppointment = () => {
  const { data: patients, isLoading: patientsLoading } = useListPatientsQuery();
  const { data: doctors, isLoading: doctorsLoading } =
    useListUsersQuery("DOCTOR");
  const [bookAppointment, { isLoading: isBooking }] =
    useBookAppointmentMutation();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState(generateTimeSlots(new Date()));
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [step, setStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors, isValid },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      appointmentType: "regular",
      priority: "normal",
    },
  });

  const selectedPatientId = watch("patientId");
  const selectedDoctorId = watch("doctorId");
  const selectedDateStr = watch("date");
  const selectedTimeSlot = watch("timeSlot");
  const selectedPatient = patients?.find((p) => p._id === selectedPatientId);
  const selectedDoctor = doctors?.find((d) => d._id === selectedDoctorId);

  // Update time slots when date changes
  useEffect(() => {
    if (selectedDateStr) {
      const date = new Date(selectedDateStr);
      setSelectedDate(date);
      setTimeSlots(generateTimeSlots(date));
      setValue("timeSlot", "");
    }
  }, [selectedDateStr, setValue]);

  const onSubmit = async (data) => {
    try {
      await bookAppointment(data).unwrap();
      setShowConfirmation(true);
      toast.success("Appointment scheduled successfully!", {
        icon: "✅",
        description: "Confirmation sent to patient and doctor",
      });
      setTimeout(() => {
        navigate("/receptionist/schedule");
      }, 2000);
    } catch (err) {
      toast.error(err?.data?.message || "Booking failed", {
        icon: "❌",
      });
    }
  };

  const steps = [
    { number: 1, title: "Select Patient", icon: User },
    { number: 2, title: "Choose Doctor", icon: Stethoscope },
    { number: 3, title: "Pick Time", icon: Clock },
    { number: 4, title: "Confirm", icon: CircleCheckBig },
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
      className="max-w-7xl mx-auto space-y-8 pb-10"
    >
      {/* Header Section */}
      <motion.div
        variants={itemVariants}
        className="flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-teal-500 to-cyan-500 flex items-center justify-center">
              <CalendarCheck className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800">
              Clinical<span className="text-teal-600">Scheduler</span>
            </h1>
          </div>
          <p className="text-slate-500 flex items-center gap-2 ml-1">
            <Activity className="h-4 w-4" />
            Coordinate patient-doctor encounters with precision
          </p>
        </div>

        {/* System Status */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="relative">
              <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 h-2.5 w-2.5 rounded-full bg-emerald-500/50"
              />
            </div>
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              Scheduling Active
            </span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-cyan-50 rounded-xl border border-cyan-200">
            <Zap className="h-4 w-4 text-cyan-500" />
            <span className="text-xs font-bold text-cyan-700">
              {timeSlots.filter((s) => s.available).length} Slots Available
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        variants={itemVariants}
        className="flex items-center justify-between max-w-3xl mx-auto"
      >
        {steps.map((s, index) => {
          const Icon = s.icon;
          const isActive = s.number === step;
          const isCompleted = s.number < step;

          return (
            <div key={s.number} className="flex items-center flex-1">
              <div className="relative">
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.1, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: isActive ? Infinity : 0,
                    repeatDelay: 1,
                  }}
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isCompleted
                      ? "bg-gradient-to-r from-teal-500 to-emerald-500 text-white"
                      : isActive
                        ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg shadow-teal-500/30"
                        : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {isCompleted ? (
                    <CircleCheckBig className="h-5 w-5" />
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </motion.div>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded ${
                    s.number < step
                      ? "bg-gradient-to-r from-teal-500 to-cyan-500"
                      : "bg-slate-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-4 gap-8">
        {/* Patient Info Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <CalendarCheck className="h-32 w-32" />
            </div>

            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Scheduling Intelligence
            </h3>

            <p className="text-teal-100 text-sm mb-6">
              Please ensure all clinical data is verified before confirming the
              appointment slot.
            </p>

            {/* Selected Patient Card */}
            {selectedPatient && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <p className="text-[10px] font-black uppercase text-teal-200 tracking-widest mb-2">
                  Selected Patient
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">{selectedPatient.name}</p>
                    <p className="text-xs text-teal-200">
                      {selectedPatient.contact}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Selected Doctor Card */}
            {selectedDoctor && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20"
              >
                <p className="text-[10px] font-black uppercase text-teal-200 tracking-widest mb-2">
                  Assigned Doctor
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Stethoscope className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold">Dr. {selectedDoctor.name}</p>
                    <p className="text-xs text-teal-200">
                      {selectedDoctor.specialization || "General"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <div className="mt-6 pt-4 border-t border-white/20">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[8px] font-black uppercase text-teal-200">
                    Today's Slots
                  </p>
                  <p className="text-xl font-black">24</p>
                </div>
                <div>
                  <p className="text-[8px] font-black uppercase text-teal-200">
                    Available
                  </p>
                  <p className="text-xl font-black">
                    {timeSlots.filter((s) => s.available).length}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-slate-400 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-700 mb-1">
                  Booking Guidelines
                </h4>
                <ul className="text-[10px] text-slate-500 space-y-1">
                  <li>• Verify patient identity before booking</li>
                  <li>• Confirm doctor availability</li>
                  <li>• Emergency slots are prioritized</li>
                  <li>• Cancellation requires 24hr notice</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Form */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
              {/* Form Header */}
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h2 className="text-lg font-black text-slate-800">
                  New Appointment Request
                </h2>
              </div>

              {/* Form Body */}
              <div className="p-6 space-y-6">
                {/* Patient Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Patient Selection
                  </label>
                  <select
                    {...register("patientId")}
                    onChange={(e) => {
                      register("patientId").onChange(e);
                      if (e.target.value) setStep(2);
                    }}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                  >
                    <option value="">-- Select Registered Patient --</option>
                    {!patientsLoading &&
                      patients?.map((p) => (
                        <option key={p._id} value={p._id}>
                          {p.name} ({p.contact})
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

                {/* Doctor Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Medical Practitioner
                  </label>
                  <select
                    {...register("doctorId")}
                    onChange={(e) => {
                      register("doctorId").onChange(e);
                      if (e.target.value) setStep(3);
                    }}
                    className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                  >
                    <option value="">-- Assign Doctor --</option>
                    {!doctorsLoading &&
                      doctors?.map((d) => (
                        <option key={d._id} value={d._id}>
                          Dr. {d.name}{" "}
                          {d.specialization ? `- ${d.specialization}` : ""}
                        </option>
                      ))}
                  </select>
                  {errors.doctorId && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                      <CircleAlert className="h-3 w-3" />
                      {errors.doctorId.message}
                    </p>
                  )}
                </div>

                {/* Appointment Type & Priority */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Activity className="h-4 w-4" />
                      Appointment Type
                    </label>
                    <select
                      {...register("appointmentType")}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                    >
                      {appointmentTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <CircleAlert className="h-4 w-4" />
                      Priority Level
                    </label>
                    <select
                      {...register("priority")}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                    >
                      {priorities.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Date Selection */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Consultation Date
                    </label>
                    <input
                      type="date"
                      {...register("date")}
                      onChange={(e) => {
                        register("date").onChange(e);
                        setStep(3);
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                    />
                    {errors.date && (
                      <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
                        <CircleAlert className="h-3 w-3" />
                        {errors.date.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Reason (Optional)
                    </label>
                    <input
                      type="text"
                      {...register("reason")}
                      placeholder="e.g. Chronic Pain, Follow-up"
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all"
                    />
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Clinical Notes (Optional)
                  </label>
                  <textarea
                    {...register("notes")}
                    rows={2}
                    placeholder="Any additional information for the doctor..."
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all resize-none"
                  />
                </div>

                {/* Time Slot Picker */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Slot Selection
                    </label>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-[10px] text-slate-500">
                          Available
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <div className="h-2 w-2 rounded-full bg-amber-500" />
                        <span className="text-[10px] text-slate-500">
                          Limited
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                    {timeSlots.map((slot, index) => {
                      const isActive = selectedTimeSlot === slot.display;
                      const isAvailable = slot.available;
                      const isBooked = slot.booked;

                      return (
                        <motion.button
                          key={slot.value}
                          type="button"
                          whileHover={
                            isAvailable && !isBooked ? { scale: 1.05 } : {}
                          }
                          whileTap={
                            isAvailable && !isBooked ? { scale: 0.95 } : {}
                          }
                          onClick={() => {
                            if (isAvailable && !isBooked) {
                              setValue("timeSlot", slot.display, {
                                shouldValidate: true,
                              });
                              setSelectedSlot(slot);
                              setStep(4);
                            }
                          }}
                          disabled={!isAvailable || isBooked}
                          className={`
                            relative h-12 text-xs font-bold rounded-xl transition-all
                            ${
                              isActive
                                ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-lg scale-105"
                                : isBooked
                                  ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                                  : isAvailable
                                    ? "bg-white text-slate-600 border border-slate-200 hover:border-teal-400 hover:text-teal-600"
                                    : "bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100"
                            }
                          `}
                        >
                          {slot.display}
                          {isBooked && (
                            <div className="absolute -top-1 -right-1">
                              <CircleX className="h-3 w-3 text-red-500" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                  {errors.timeSlot && (
                    <p className="text-xs text-red-500 flex items-center gap-1 mt-2">
                      <CircleAlert className="h-3 w-3" />
                      {errors.timeSlot.message}
                    </p>
                  )}
                </div>

                {/* Booking Summary */}
                {selectedPatient && selectedDoctor && selectedTimeSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-teal-50 rounded-xl border border-teal-200"
                  >
                    <h4 className="text-xs font-bold text-teal-700 mb-3">
                      Booking Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-teal-600">Patient:</span>
                        <span className="font-medium text-teal-900">
                          {selectedPatient.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-600">Doctor:</span>
                        <span className="font-medium text-teal-900">
                          Dr. {selectedDoctor.name}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-600">Date:</span>
                        <span className="font-medium text-teal-900">
                          {new Date(selectedDateStr).toLocaleDateString(
                            "en-US",
                            {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            },
                          )}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-teal-600">Time:</span>
                        <span className="font-medium text-teal-900">
                          {selectedTimeSlot}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Form Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/receptionist")}
                    className="px-6 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isBooking || !isValid}
                    className="h-12 px-8 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {isBooking ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CalendarCheck className="h-4 w-4" />
                        Complete Booking
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </motion.div>
      </div>

      {/* Success Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="h-20 w-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <CircleCheckBig className="h-10 w-10 text-white" />
                </motion.div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">
                  Booking Confirmed!
                </h3>
                <p className="text-slate-500 mb-6">
                  Appointment has been scheduled successfully
                </p>
                <div className="bg-slate-50 rounded-xl p-4 mb-6">
                  <p className="text-sm text-slate-600">
                    Redirecting to schedule dashboard...
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BookAppointment;

