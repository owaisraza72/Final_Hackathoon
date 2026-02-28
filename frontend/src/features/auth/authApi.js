import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/utils/constants";
import { setCredentials, logout } from "./authSlice";

// ── Base query with credentials (cookies) ──
const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
  prepareHeaders: (headers, { endpoint }) => {
    // Don't set Content-Type for file uploads
    if (endpoint !== "updateAvatar") {
      headers.set("Content-Type", "application/json");
    }
    return headers;
  },
});

// ── Endpoints that should NOT trigger token refresh ──
const skipRefreshEndpoints = [
  "/auth/login",
  "/auth/register",
  "/auth/refresh-token",
  "/auth/me",
];

// ── Base query with automatic token refresh ──
const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 401) {
    // Get the URL being called
    const url = typeof args === "string" ? args : args?.url;

    // Don't try refresh for auth endpoints (avoids infinite loop)
    const shouldSkip = skipRefreshEndpoints.some(
      (endpoint) => url?.includes(endpoint)
    );

    if (!shouldSkip) {
      // Try refreshing the token
      const refreshResult = await baseQuery(
        { url: "/auth/refresh-token", method: "POST" },
        api,
        extraOptions
      );

      if (refreshResult?.data?.success) {
        // Refresh succeeded → retry the original request
        result = await baseQuery(args, api, extraOptions);
      } else {
        // Refresh failed → logout user
        api.dispatch(logout());
      }
    }
  }

  return result;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // ── Register ──
    register: builder.mutation({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Login ──
    login: builder.mutation({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // handled by component
        }
      },
    }),

    // ── Logout ──
    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch {
          dispatch(logout());
        }
      },
    }),

    // ── Get Current User (verify session) ──
    getMe: builder.query({
      query: () => "/auth/me",
      providesTags: ["User"],
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setCredentials(data.data.user));
        } catch {
          // not logged in — this is expected, do nothing
        }
      },
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetMeQuery,
} = authApi;