import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/features/auth/authApi";
import authReducer from "@/features/auth/authSlice";
import { adminApi } from "@/features/admin/adminApi";
import { patientApi } from "@/features/patients/patientApi";
import { appointmentApi } from "@/features/appointments/appointmentApi";
import { prescriptionApi } from "@/features/prescriptions/prescriptionApi";
import { diagnosisApi } from "@/features/diagnoses/diagnosisApi";
import { aiApi } from "@/features/ai/aiApi";
import { notificationApi } from "@/features/notifications/notificationApi";

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
    [patientApi.reducerPath]: patientApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [prescriptionApi.reducerPath]: prescriptionApi.reducer,
    [diagnosisApi.reducerPath]: diagnosisApi.reducer,
    [aiApi.reducerPath]: aiApi.reducer,
    [notificationApi.reducerPath]: notificationApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      adminApi.middleware,
      patientApi.middleware,
      appointmentApi.middleware,
      prescriptionApi.middleware,
      diagnosisApi.middleware,
      aiApi.middleware,
      notificationApi.middleware,
    ),
  devTools: import.meta.env.DEV,
});
