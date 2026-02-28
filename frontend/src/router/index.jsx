import { createBrowserRouter } from "react-router-dom";

// Layout
import Layout from "@/components/layout/Layout";

// Route Guards
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import PublicRoute from "@/components/shared/PublicRoute";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import LoginPage from "@/pages/auth/LoginPage";
import RegisterPage from "@/pages/auth/RegisterPage";
import NotFoundPage from "@/pages/NotFoundPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      // ── Public Pages (anyone can see) ──
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "about",
        element: <AboutPage />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },

      // ── Auth Pages (only non-logged-in users) ──
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

      // ── Protected Pages (only logged-in users) ──
      // Example: Add your protected pages here
      // {
      //   path: "dashboard",
      //   element: (
      //     <ProtectedRoute>
      //       <DashboardPage />
      //     </ProtectedRoute>
      //   ),
      // },

      // ── Admin Only Pages ──
      // {
      //   path: "admin",
      //   element: (
      //     <ProtectedRoute allowedRoles={["admin"]}>
      //       <AdminPage />
      //     </ProtectedRoute>
      //   ),
      // },

      // ── 404 ──
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

export default router;