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

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Patient"],
  endpoints: (builder) => ({
    registerPatient: builder.mutation({
      query: (data) => ({
        url: "patients",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Patient"],
    }),
    listPatients: builder.query({
      query: ({ search, page } = {}) => {
        const params = new URLSearchParams();
        if (search) params.set("search", search);
        if (page) params.set("page", page);
        return `patients?${params.toString()}`;
      },
      providesTags: ["Patient"],
      transformResponse: (res) => res.data?.patients || res.data,
    }),
    getPatient: builder.query({
      query: (id) => `patients/${id}`,
      providesTags: (result, error, id) => [{ type: "Patient", id }],
      transformResponse: (res) => res.data?.patient || res.data,
    }),
    updatePatient: builder.mutation({
      query: ({ id, data }) => ({
        url: `patients/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Patient", id },
        "Patient",
      ],
    }),
    deletePatient: builder.mutation({
      query: (id) => ({
        url: `patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Patient"],
    }),
    getPatientHistory: builder.query({
      query: (id) => `patients/${id}/history`,
      providesTags: (result, error, id) => [{ type: "PatientHistory", id }],
      transformResponse: (res) => res.data,
    }),
  }),
});

export const {
  useRegisterPatientMutation,
  useListPatientsQuery,
  useGetPatientQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
  useGetPatientHistoryQuery,
} = patientApi;
