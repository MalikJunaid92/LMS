import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userRegisteration } from "./authSlice"; // Ensure correct import

// Define response type
type RegistrationResponse = {
  message: string;
  activationToken: string;
};

// Define request data type
type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Endpoint for user registration
    register: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "register",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegisteration({
              token: result.data.activationToken, // Ensure activationToken exists
            })
          );
        } catch (error) {
          console.error("Registration Error:", error);
        }
      },
    }),
    activation: builder.mutation({
      query: ({ activation_token, activation_code }) => ({
        url: "activate-user",
        method: "POST",
        body: {
          activation_token,
          activation_code,
        },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login-user",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials : "include" as const,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error) {
          console.error("Registration Error:", error);
        }
      },
    }),
  }),
});

export const { useRegisterMutation, useActivationMutation, useLoginMutation } = authApi;
