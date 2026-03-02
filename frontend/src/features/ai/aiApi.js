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

export const aiApi = createApi({
  reducerPath: "aiApi",
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({
    getAiDiagnosis: builder.mutation({
      query: (data) => ({
        url: "ai/diagnosis",
        method: "POST",
        body: data,
      }),
    }),
    explainPrescription: builder.query({
      query: (prescriptionId) => `ai/explain/${prescriptionId}`,
    }),
  }),
});

export const { useGetAiDiagnosisMutation, useLazyExplainPrescriptionQuery } =
  aiApi;
