import { useSelector } from "react-redux";
import {
  selectCurrentUser,
  selectIsAuthenticated,
  selectUserRole,
} from "@/features/auth/authSlice";
import {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetMeQuery,
} from "@/features/auth/authApi";

const useAuth = () => {
  const user = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [logoutFn, { isLoading: isLoggingOut }] = useLogoutMutation();

  const isAdmin = role === "ADMIN";
  const isDoctor = role === "DOCTOR";
  const isReceptionist = role === "RECEPTIONIST";
  const isPatient = role === "PATIENT";

  return {
    // State
    user,
    isAuthenticated,
    role,
    isAdmin,
    isDoctor,
    isReceptionist,
    isPatient,

    // Actions
    login,
    register,
    logout: logoutFn,

    // Loading states
    isLoggingIn,
    isRegistering,
    isLoggingOut,
  };
};

export default useAuth;
