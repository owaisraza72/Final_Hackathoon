import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBookAppointmentMutation } from "@/features/appointments/appointmentApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import { useListUsersQuery } from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { CalendarCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const appointmentSchema = z.object({
  patientId: z.string().min(1, "Patient is required"),
  doctorId: z.string().min(1, "Doctor is required"),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  reason: z.string().optional(),
});

const generateTimeSlots = () => {
  const slots = [];
  for (let i = 9; i <= 17; i++) {
    const hour = i > 12 ? i - 12 : i;
    const ampm = i >= 12 ? "PM" : "AM";
    slots.push(`${hour}:00 ${ampm}`);
    slots.push(`${hour}:30 ${ampm}`);
  }
  return slots;
};

const BookAppointment = () => {
  const { data: patients, isLoading: patientsLoading } = useListPatientsQuery();
  const { data: doctors, isLoading: doctorsLoading } =
    useListUsersQuery("DOCTOR");
  const [bookAppointment, { isLoading: isBooking }] =
    useBookAppointmentMutation();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: { date: new Date().toISOString().split("T")[0] },
  });

  const selectedDate = watch("date");
  const selectedTimeSlot = watch("timeSlot");

  const onSubmit = async (data) => {
    try {
      await bookAppointment(data).unwrap();
      toast.success("Appointment booked successfully!");
      navigate("/receptionist");
    } catch (err) {
      toast.error(err?.data?.message || "Booking failed");
    }
  };

  const timeSlots = generateTimeSlots();

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Clinical Scheduler"
          description="Coordinate patient-doctor encounters with precision."
        />
        <div className="h-12 px-6 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center gap-3">
          <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">
            Global Scheduling Active
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Helper Info Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-indigo-900 rounded-[32px] p-8 text-white premium-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <CalendarCheck className="h-24 w-24" />
            </div>
            <h3 className="text-xl font-black tracking-tight mb-4 relative z-10">
              Scheduling Intelligence
            </h3>
            <p className="text-indigo-200 text-xs font-semibold leading-relaxed relative z-10">
              Please ensure all clinical data is verified before confirming the
              appointment slot.
            </p>
            <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
              <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest mb-2">
                Selected Patient
              </p>
              <p className="text-sm font-bold truncate">
                {patients?.find((p) => p._id === watch("patientId"))?.name ||
                  "None Selected"}
              </p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-10 rounded-[40px] premium-shadow border border-slate-200/60 space-y-10"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Patient Entry
                </label>
                <select
                  {...register("patientId")}
                  className="w-full h-14 pl-5 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none appearance-none"
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
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                    {errors.patientId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Medical Practitioner
                </label>
                <select
                  {...register("doctorId")}
                  className="w-full h-14 pl-5 pr-10 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none appearance-none"
                >
                  <option value="">-- Assign Doctor --</option>
                  {!doctorsLoading &&
                    doctors?.map((d) => (
                      <option key={d._id} value={d._id}>
                        Dr. {d.name}
                      </option>
                    ))}
                </select>
                {errors.doctorId && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                    {errors.doctorId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Consultation Date
                </label>
                <input
                  type="date"
                  {...register("date")}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                />
                {errors.date && (
                  <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                    {errors.date.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Primary Concern
                </label>
                <input
                  type="text"
                  {...register("reason")}
                  placeholder="e.g. Chronic Pain, Follow-up"
                  className="w-full h-14 px-5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all outline-none"
                />
              </div>
            </div>

            {/* Time Slot Picker */}
            <div className="pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-8">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                  Vault Time Allocation
                </label>
                <div className="px-3 py-1 bg-indigo-50 rounded-lg text-indigo-600 text-[10px] font-black uppercase tracking-widest">
                  Availability: High
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {timeSlots.map((slot) => {
                  const isActive = selectedTimeSlot === slot;
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() =>
                        setValue("timeSlot", slot, { shouldValidate: true })
                      }
                      className={`h-12 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 border flex items-center justify-center ${
                        isActive
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xl shadow-indigo-500/20 scale-105"
                          : "bg-white text-slate-400 border-slate-100 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/30"
                      }`}
                    >
                      {slot}
                    </button>
                  );
                })}
              </div>
              {errors.timeSlot && (
                <p className="text-[10px] font-bold text-red-500 mt-4 ml-1">
                  {errors.timeSlot.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-8">
              <button
                type="submit"
                disabled={isBooking}
                className="h-16 px-12 bg-slate-900 hover:bg-teal-600 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl transition-all duration-500 flex items-center gap-4 group active:scale-95 disabled:opacity-50"
              >
                {isBooking ? (
                  <div className="flex items-center gap-3">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authorizing Slot...
                  </div>
                ) : (
                  <>
                    Complete Booking
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
