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

export const diagnosisApi = createApi({
  reducerPath: "diagnosisApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Diagnosis"],
  endpoints: (builder) => ({
    createDiagnosis: builder.mutation({
      query: (data) => ({
        url: "diagnoses",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Diagnosis", "PatientHistory"],
    }),
    getPatientDiagnoses: builder.query({
      query: (patientId) => `diagnoses/patient/${patientId}`,
      providesTags: ["Diagnosis"],
      transformResponse: (res) => res.data?.diagnoses || res.data,
    }),
    updateDiagnosis: builder.mutation({
      query: ({ id, data }) => ({
        url: `diagnoses/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Diagnosis", id },
        "Diagnosis",
        "PatientHistory",
      ],
    }),
    deleteDiagnosis: builder.mutation({
      query: (id) => ({
        url: `diagnoses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Diagnosis", "PatientHistory"],
    }),
  }),
});

export const {
  useCreateDiagnosisMutation,
  useGetPatientDiagnosesQuery,
  useUpdateDiagnosisMutation,
  useDeleteDiagnosisMutation,
} = diagnosisApi;
