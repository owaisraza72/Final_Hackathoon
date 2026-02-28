import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePrescriptionMutation } from "@/features/prescriptions/prescriptionApi";
import { useListPatientsQuery } from "@/features/patients/patientApi";
import PageHeader from "@/components/ui/PageHeader";
import { toast } from "sonner";
import { Plus, Trash2, Pill, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
      }),
    )
    .min(1, "Add at least one medicine"),
  instructions: z.string().optional(),
});

const WritePrescription = () => {
  const { data: patients, isLoading: loadingPatients } = useListPatientsQuery();
  const [createPrescription, { isLoading: isSubmitting }] =
    useCreatePrescriptionMutation();
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      patientId: "",
      diagnosis: "",
      medicines: [
        { name: "", dosage: "", frequency: "1-0-1", duration: "5 days" },
      ],
      instructions: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = async (data) => {
    try {
      await createPrescription(data).unwrap();
      toast.success("Prescription saved successfully!");
      reset();
      navigate("/doctor");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save prescription");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in">
      <PageHeader
        title="Write Prescription"
        description="Prescribe medicines securely to your patients."
      />

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Top Section */}
          <div className="grid md:grid-cols-2 gap-6 pb-6 border-b border-slate-100">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Patient
              </label>
              <select
                {...register("patientId")}
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              >
                <option value="">-- Choose Patient --</option>
                {!loadingPatients &&
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
                Diagnosis
              </label>
              <input
                type="text"
                {...register("diagnosis")}
                placeholder="e.g. Viral Pharyngitis"
                className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
              />
              {errors.diagnosis && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
          </div>

          {/* Medicines Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Pill className="h-5 w-5 text-teal-600" /> Rx Medicines
              </h3>
              <button
                type="button"
                onClick={() =>
                  append({
                    name: "",
                    dosage: "",
                    frequency: "1-0-1",
                    duration: "",
                  })
                }
                className="flex items-center gap-1 text-sm font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Medicine
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex flex-col md:flex-row gap-4 items-start"
                >
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-xs text-slate-500 font-medium ml-1">
                      Medicine Name
                    </label>
                    <input
                      {...register(`medicines.${index}.name`)}
                      placeholder="e.g. Paracetamol 500mg"
                      className="w-full p-2.5 mt-1 border border-slate-300 rounded-lg outline-none focus:border-teal-500"
                    />
                    {errors.medicines?.[index]?.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.medicines[index].name.message}
                      </p>
                    )}
                  </div>
                  <div className="w-full md:w-32">
                    <label className="text-xs text-slate-500 font-medium ml-1">
                      Dosage
                    </label>
                    <input
                      {...register(`medicines.${index}.dosage`)}
                      placeholder="1 Tablet"
                      className="w-full p-2.5 mt-1 border border-slate-300 rounded-lg outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="text-xs text-slate-500 font-medium ml-1">
                      Frequency
                    </label>
                    <input
                      {...register(`medicines.${index}.frequency`)}
                      placeholder="1-0-1"
                      className="w-full p-2.5 mt-1 border border-slate-300 rounded-lg outline-none focus:border-teal-500"
                    />
                  </div>
                  <div className="w-full md:w-32">
                    <label className="text-xs text-slate-500 font-medium ml-1">
                      Duration
                    </label>
                    <input
                      {...register(`medicines.${index}.duration`)}
                      placeholder="5 days"
                      className="w-full p-2.5 mt-1 border border-slate-300 rounded-lg outline-none focus:border-teal-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-6 p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors self-center md:self-auto"
                    disabled={fields.length === 1}
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            {errors.medicines?.root && (
              <p className="text-red-500 text-sm mt-3">
                {errors.medicines.root.message}
              </p>
            )}
          </div>

          {/* Footer Notes */}
          <div className="pt-4 border-t border-slate-100">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Instructions / Advice
            </label>
            <textarea
              {...register("instructions")}
              placeholder="Drink plenty of water. Return if fever persists."
              rows={3}
              className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            ></textarea>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/30 transition-all flex items-center gap-2 disabled:opacity-70 disabled:shadow-none"
            >
              {isSubmitting ? (
                "Generating..."
              ) : (
                <>
                  <CheckCircle className="h-5 w-5" /> Confirm Prescription
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WritePrescription;
