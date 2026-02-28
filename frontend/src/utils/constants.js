export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api/v1";

export const ROLES = Object.freeze({
  ADMIN: "ADMIN",
  DOCTOR: "DOCTOR",
  RECEPTIONIST: "RECEPTIONIST",
  PATIENT: "PATIENT",
});

export const ROUTES = Object.freeze({
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",

  // Dashboards
  ADMIN_DASHBOARD: "/admin",
  DOCTOR_DASHBOARD: "/doctor",
  RECEPTIONIST_DASHBOARD: "/receptionist",
  PATIENT_DASHBOARD: "/patient",
});
