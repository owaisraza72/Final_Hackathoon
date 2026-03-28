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

export const prescriptionApi = createApi({
  reducerPath: "prescriptionApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Prescription"],
  endpoints: (builder) => ({
    createPrescription: builder.mutation({
      query: (data) => ({
        url: "prescriptions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Prescription"],
    }),
    getPatientPrescriptions: builder.query({
      query: (patientId) => `prescriptions/patient/${patientId}`,
      providesTags: ["Prescription"],
      transformResponse: (res) => res.data?.prescriptions || res.data,
    }),
    getDoctorPrescriptions: builder.query({
      query: () => "prescriptions/doctor",
      providesTags: ["Prescription"],
      transformResponse: (res) => res.data?.prescriptions || res.data,
    }),
    getPrescription: builder.query({
      query: (id) => `prescriptions/${id}`,
      providesTags: (result, error, id) => [{ type: "Prescription", id }],
      transformResponse: (res) => res.data?.prescription || res.data,
    }),
    downloadPDF: builder.query({
      query: (id) => ({
        url: `prescriptions/${id}/pdf`,
        method: "GET",
        responseHandler: (response) => response.arrayBuffer(),
      }),
    }),
    updatePrescription: builder.mutation({
      query: ({ id, data }) => ({
        url: `prescriptions/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Prescription", id },
        "Prescription",
      ],
    }),
    deletePrescription: builder.mutation({
      query: (id) => ({
        url: `prescriptions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Prescription"],
    }),
    listAllPrescriptions: builder.query({
      query: () => "prescriptions",
      providesTags: ["Prescription"],
      transformResponse: (res) => res.data?.prescriptions || res.data,
    }),
  }),
});

export const {
  useCreatePrescriptionMutation,
  useGetPatientPrescriptionsQuery,
  useGetDoctorPrescriptionsQuery,
  useGetPrescriptionQuery,
  useLazyDownloadPDFQuery,
  useUpdatePrescriptionMutation,
  useDeletePrescriptionMutation,
  useListAllPrescriptionsQuery,
} = prescriptionApi;
