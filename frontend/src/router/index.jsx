import { createBrowserRouter } from "react-router-dom";

// Layouts
import Layout from "@/components/layout/Layout";
import DashboardLayout from "@/components/layout/DashboardLayout";

// Route Guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";

// Public & Auth Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";

// Admin Dashboards
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ManageDoctors from "@/pages/admin/ManageDoctors";
import ManageReceptionists from "@/pages/admin/ManageReceptionists";
import SubscriptionPage from "@/pages/admin/SubscriptionPage";

// Doctor Dashboards
import DoctorDashboard from "@/pages/doctor/DoctorDashboard";
import MyAppointments from "@/pages/doctor/MyAppointments";
import PatientHistory from "@/pages/doctor/PatientHistory";
import WritePrescription from "@/pages/doctor/WritePrescription";
import AIAssistant from "@/pages/doctor/AIAssistant";

// Receptionist Dashboards
import ReceptionistDashboard from "@/pages/receptionist/ReceptionistDashboard";
import RegisterPatient from "@/pages/receptionist/RegisterPatient";
import PatientsList from "@/pages/receptionist/PatientsList";
import BookAppointment from "@/pages/receptionist/BookAppointment";
import DailySchedule from "@/pages/receptionist/DailySchedule";

// Patient Dashboards
import PatientDashboard from "@/pages/patient/PatientDashboard";
import MyPrescriptions from "@/pages/patient/MyPrescriptions";
import AppointmentHistory from "@/pages/patient/AppointmentHistory";

const router = createBrowserRouter([
  // ── Public Pages & Auth ──
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "contact", element: <ContactPage /> },
      {
        path: "login",
        element: (
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        ),
      },
    ],
  },

  // ── Admin Pages ──
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["ADMIN"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "doctors", element: <ManageDoctors /> },
      { path: "receptionists", element: <ManageReceptionists /> },
      { path: "subscription", element: <SubscriptionPage /> },
    ],
  },

  // ── Doctor Pages ──
  {
    path: "/doctor",
    element: (
      <ProtectedRoute allowedRoles={["DOCTOR"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DoctorDashboard /> },
      { path: "appointments", element: <MyAppointments /> },
      { path: "patients", element: <PatientHistory /> },
      { path: "prescriptions/new", element: <WritePrescription /> },
      { path: "ai", element: <AIAssistant /> },
    ],
  },

  // ── Receptionist Pages ──
  {
    path: "/receptionist",
    element: (
      <ProtectedRoute allowedRoles={["RECEPTIONIST"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <ReceptionistDashboard /> },
      { path: "patients", element: <PatientsList /> },
      { path: "patients/new", element: <RegisterPatient /> },
      { path: "appointments/new", element: <BookAppointment /> },
      { path: "schedule", element: <DailySchedule /> },
    ],
  },

  // ── Patient Pages ──
  {
    path: "/patient",
    element: (
      <ProtectedRoute allowedRoles={["PATIENT"]}>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <PatientDashboard /> },
      { path: "prescriptions", element: <MyPrescriptions /> },
      { path: "appointments", element: <AppointmentHistory /> },
    ],
  },

  // ── 404 Not Found ──
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export default router;
