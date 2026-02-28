import { Navigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import { useGetMeQuery } from "@/features/auth/authApi";
import LoadingSpinner from "./LoadingSpinner";
import { ROUTES } from "@/utils/constants";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { isLoading, isError } = useGetMeQuery();

  // If checking auth and not errored yet, show loading
  if (isLoading && !isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // If already logged in, redirect to home
  if (isAuthenticated) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return children;
};

export default PublicRoute;
