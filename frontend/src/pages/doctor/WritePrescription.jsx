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
import { Plus, Trash2, Pill, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

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
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: patients, isLoading: loadingPatients } = useListPatientsQuery();
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
        })),
        instructions: existingPrescription.instructions,
      });
    }
  }, [isEdit, existingPrescription, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "medicines",
  });

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await updatePrescription({ id, data }).unwrap();
        toast.success("Prescription updated successfully!");
        navigate("/doctor/prescriptions");
      } else {
        await createPrescription(data).unwrap();
        toast.success("Prescription saved successfully!");
        reset();
        navigate("/doctor/prescriptions");
      }
    } catch (err) {
      toast.error(
        err?.data?.message ||
          `Failed to ${isEdit ? "update" : "save"} prescription`,
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
        <PageHeader
          title="Digital Prescription Vault"
          description="Issue validated medical directives for patient care."
        />
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 premium-shadow bg-white rounded-2xl flex items-center justify-center border border-slate-100/50">
            <Pill className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">
              Provider ID
            </p>
            <p className="text-sm font-bold text-slate-700">PR-992-CLINIC</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] premium-shadow border border-slate-200/60 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 clinical-gradient" />
        <form onSubmit={handleSubmit(onSubmit)} className="p-10 space-y-10">
          {/* Header Identity Section */}
          <div className="grid md:grid-cols-2 gap-10 pb-10 border-b border-slate-100 bg-slate-50/30 -mx-10 px-10">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Patient Assignment
              </label>
              <div className="relative">
                <select
                  {...register("patientId")}
                  className="w-full h-14 pl-5 pr-10 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none appearance-none shadow-sm"
                >
                  <option value="">-- Search Directory --</option>
                  {!loadingPatients &&
                    patients?.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.name} ({p.contact})
                      </option>
                    ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <Plus className="h-4 w-4 rotate-45" />
                </div>
              </div>
              {errors.patientId && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.patientId.message}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                Clinical Diagnosis
              </label>
              <input
                type="text"
                {...register("diagnosis")}
                placeholder="e.g. Acute Respiratory Infection"
                className="w-full h-14 px-5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 shadow-sm focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none"
              />
              {errors.diagnosis && (
                <p className="text-[10px] font-bold text-red-500 mt-1 ml-1">
                  {errors.diagnosis.message}
                </p>
              )}
            </div>
          </div>

          {/* Medicines Dynamic Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <div className="h-10 w-10 bg-teal-50 rounded-xl flex items-center justify-center border border-teal-100">
                  <Pill className="h-5 w-5 text-teal-600" />
                </div>
                Pharmacotherapy Directives
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
                className="h-11 px-6 bg-teal-50 text-teal-600 hover:bg-teal-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center gap-2 border border-teal-100"
              >
                <Plus className="h-4 w-4" /> Add Formulation
              </button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-1 glass-card border-slate-100/50 rounded-[30px] overflow-hidden group hover:premium-shadow transition-all duration-500"
                >
                  <div className="bg-slate-50/50 p-6 rounded-[29px] flex flex-col xl:flex-row gap-6 items-start">
                    <div className="flex-1 w-full space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                        Formulation Name
                      </label>
                      <input
                        {...register(`medicines.${index}.name`)}
                        placeholder="e.g. Amoxicillin 500mg"
                        className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-teal-500 outline-none transition-all shadow-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 w-full xl:w-auto">
                      <div className="space-y-1.5 min-w-[120px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                          Dosage
                        </label>
                        <input
                          {...register(`medicines.${index}.dosage`)}
                          placeholder="1 Tab"
                          className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-teal-500 outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5 min-w-[120px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                          Freq (Morning-Eve)
                        </label>
                        <input
                          {...register(`medicines.${index}.frequency`)}
                          placeholder="1-0-1"
                          className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-teal-500 outline-none shadow-sm"
                        />
                      </div>
                      <div className="space-y-1.5 min-w-[120px]">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">
                          Duration
                        </label>
                        <input
                          {...register(`medicines.${index}.duration`)}
                          placeholder="5-days"
                          className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm font-bold focus:border-teal-500 outline-none shadow-sm"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="h-12 w-12 flex items-center justify-center text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all self-end xl:self-center shrink-0"
                      disabled={fields.length === 1}
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {errors.medicines?.root && (
              <p className="text-[10px] font-bold text-red-500 mt-2 ml-1">
                {errors.medicines.root.message}
              </p>
            )}
          </div>

          {/* Footer Notes */}
          <div className="space-y-4 pt-6">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1 flex items-center gap-2">
              Medical Advice & Contraindications
            </label>
            <textarea
              {...register("instructions")}
              placeholder="Detailed regimen instructions, potential side effects, and follow-up directives..."
              rows={4}
              className="w-full p-6 bg-slate-50/50 border border-slate-200 rounded-[32px] text-sm font-bold text-slate-700 focus:ring-4 focus:ring-teal-500/10 focus:border-teal-500/50 transition-all outline-none resize-none"
            ></textarea>
          </div>

          <div className="flex justify-between items-center pt-8 border-t border-slate-100">
            <div className="hidden md:flex items-center gap-2 text-slate-400">
              <CheckCircle className="h-4 w-4 text-emerald-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Validated Session active
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-16 px-12 clinical-gradient hover:scale-105 text-white text-xs font-black uppercase tracking-[0.2em] rounded-[24px] shadow-2xl shadow-teal-500/30 transition-all duration-500 flex items-center gap-4 disabled:opacity-70 group"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Securing Record...
                </div>
              ) : (
                <>
                  {isEdit ? "Update Medical Record" : "Issue Digital Rx"}
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
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
