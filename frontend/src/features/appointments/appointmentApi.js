import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/utils/constants";
import { logout } from "@/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: "include",
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 401) {
    const refreshResult = await baseQuery(
      { url: "auth/refresh-token", method: "POST" },
      api,
      extraOptions,
    );
    if (refreshResult?.data?.success) {
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(logout());
    }
  }
  return result;
};

export const appointmentApi = createApi({
  reducerPath: "appointmentApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Appointment"],
  endpoints: (builder) => ({
    bookAppointment: builder.mutation({
      query: (data) => ({
        url: "appointments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Appointment"],
    }),
    listAppointments: builder.query({
      query: ({ status, date } = {}) => {
        const params = new URLSearchParams();
        if (status) params.set("status", status);
        if (date) params.set("date", date);
        return `appointments?${params.toString()}`;
      },
      providesTags: ["Appointment"],
      transformResponse: (res) => res.data?.appointments || res.data,
    }),
    getDailySchedule: builder.query({
      query: (date) => `appointments/schedule?date=${date}`,
      providesTags: ["Appointment"],
      transformResponse: (res) => res.data?.appointments || res.data,
    }),
    updateStatus: builder.mutation({
      query: ({ id, status }) => ({
        url: `appointments/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Appointment"],
    }),
    cancelAppointment: builder.mutation({
      query: (id) => ({
        url: `appointments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Appointment"],
    }),
  }),
});

export const {
  useBookAppointmentMutation,
  useListAppointmentsQuery,
  useGetDailyScheduleQuery,
  useUpdateStatusMutation,
  useCancelAppointmentMutation,
} = appointmentApi;
