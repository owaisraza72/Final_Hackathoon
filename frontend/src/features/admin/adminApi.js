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
      { url: "/auth/refresh-token", method: "POST" },
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

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Analytics"],
  endpoints: (builder) => ({
    listUsers: builder.query({
      query: (role) => `/admin/list/${role}`,
      providesTags: ["User"],
      transformResponse: (res) => res.data.users,
    }),
    createUser: builder.mutation({
      query: (data) => ({
        url: "/admin/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User", "Analytics"],
    }),
    updateUser: builder.mutation({
      query: ({ id, data }) => ({
        url: `/admin/update/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Analytics"],
    }),
    getAnalytics: builder.query({
      query: () => "/admin/analytics",
      providesTags: ["Analytics"],
      transformResponse: (res) => res.data,
    }),
    updateSubscription: builder.mutation({
      query: (plan) => ({
        url: "/admin/subscription",
        method: "PATCH",
        body: { plan },
      }),
      invalidatesTags: ["Analytics", "User"],
    }),
  }),
});

export const {
  useListUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetAnalyticsQuery,
  useUpdateSubscriptionMutation,
} = adminApi;
