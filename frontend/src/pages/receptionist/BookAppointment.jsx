import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useBookAppointmentMutation } from "@/features/appointments/appointmentApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import { useListUsersQuery } from "@/features/admin/adminApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { CalendarCheck } from "lucide-react";
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in">
      <PageHeader
        title="Book Appointment"
        description="Schedule an appointment with a doctor."
      />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8"
      >
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Patient
            </label>
            <select
              {...register("patientId")}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Select Patient --</option>
              {!patientsLoading &&
                patients?.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.contact})
                  </option>
                ))}
            </select>
            {errors.patientId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.patientId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Doctor
            </label>
            <select
              {...register("doctorId")}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="">-- Select Doctor --</option>
              {!doctorsLoading &&
                doctors?.map((d) => (
                  <option key={d._id} value={d._id}>
                    Dr. {d.name}
                  </option>
                ))}
            </select>
            {errors.doctorId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.doctorId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Date
            </label>
            <input
              type="date"
              {...register("date")}
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
            {errors.date && (
              <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason (Optional)
            </label>
            <input
              type="text"
              {...register("reason")}
              placeholder="e.g. Follow-up, Fever"
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Custom Visual Time Slot Picker */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-3 border-b border-slate-100 pb-2">
            Available Time Slots
          </label>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {timeSlots.map((slot) => (
              <button
                key={slot}
                type="button"
                onClick={() =>
                  setValue("timeSlot", slot, { shouldValidate: true })
                }
                className={`py-2 px-1 text-sm font-medium rounded-lg text-center transition-all border ${
                  selectedTimeSlot === slot
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                {slot}
              </button>
            ))}
          </div>
          {errors.timeSlot && (
            <p className="text-red-500 text-sm mt-3">
              {errors.timeSlot.message}
            </p>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100 mt-8">
          <button
            type="submit"
            disabled={isBooking}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <CalendarCheck className="h-5 w-5" />
            {isBooking ? "Booking..." : "Book Appointment"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointment;
