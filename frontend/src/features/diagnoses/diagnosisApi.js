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
      invalidatesTags: ["Diagnosis"],
    }),
    getPatientDiagnoses: builder.query({
      query: (patientId) => `diagnoses/patient/${patientId}`,
      providesTags: ["Diagnosis"],
      transformResponse: (res) => res.data?.diagnoses || res.data,
    }),
    getDiagnosisDetail: builder.query({
      query: (id) => `diagnoses/${id}`,
      providesTags: (result, error, id) => [{ type: "Diagnosis", id }],
      transformResponse: (res) => res.data?.diagnosis || res.data,
    }),
  }),
});

export const {
  useCreateDiagnosisMutation,
  useGetPatientDiagnosesQuery,
  useGetDiagnosisDetailQuery,
} = diagnosisApi;
