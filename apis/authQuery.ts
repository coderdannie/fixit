import api from "@/apis/api";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";
import { LoginFormType, RegisterFormType } from "@/utils/validation";

export const authQuery = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    signUp: builder.mutation<any, RegisterFormType>({
      query: (args) => ({
        url: Endpoints.SIGNUP,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.SIGNUP }],
    }),
    verifyCode: builder.mutation<any, { email: string; otpCode: string }>({
      query: (args) => ({
        url: Endpoints.VERIFY_CODE,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.CHECK_EMAIL }],
    }),
    login: builder.mutation<any, LoginFormType>({
      query: (args) => ({
        url: Endpoints.LOGIN,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.LOGIN }],
    }),
    googleSigninAndSignUp: builder.mutation<
      any,
      {
        idToken: string | any;
      }
    >({
      query: (args) => ({
        url: Endpoints.GOOGLE_SIGNIN_SIGINUP,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.SIGNUP }],
    }),
    forgotPassword: builder.mutation<any, { email: string }>({
      query: (args) => ({
        url: Endpoints.FORGOT_PASSWORD,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.FORGOT_PASSWORD }],
    }),
    resetPassword: builder.mutation<any, { email: string; password: string }>({
      query: (args) => ({
        url: Endpoints.RESET_PASSWORD,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.RESET_PASSWORD }],
    }),
    resendOtp: builder.mutation<any, { email: string }>({
      query: (args) => ({
        url: Endpoints.RESEND_OTP,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.RESEND_OTP }],
    }),
    logout: builder.mutation<any, void>({
      query: () => ({
        url: Endpoints.LOGOUT,
        method: "POST",
      }),
      invalidatesTags: [{ type: RtkqTagEnum.LOGOUT }],
    }),
    createUploadSignature: builder.mutation<any, void>({
      query: () => ({
        url: Endpoints.CREATE_UPLOAD_SIGNATURE,
        method: "POST",
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_CURRENT_LOGGED_IN_USER }],
    }),
    createGeneralSignature: builder.mutation<
      any,
      {
        resourceType: string;
        folderName: "mechanic" | string;
        tags: string[];
      }
    >({
      query: (body) => ({
        url: Endpoints.CREATE_GENERAL_UPLOAD_SIGNATURE,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_CURRENT_LOGGED_IN_USER }],
    }),

    getCurrentLoggedInUser: builder.query<any, any>({
      query: () => ({
        url: Endpoints.GET_CURRENT_LOGGED_IN_USER,
        method: "GET",
      }),
      providesTags: () => [{ type: RtkqTagEnum.GET_CURRENT_LOGGED_IN_USER }],
    }),
  }),
});

export const {
  useSignUpMutation,
  useVerifyCodeMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResendOtpMutation,
  useResetPasswordMutation,
  useLogoutMutation,
  useCreateUploadSignatureMutation,
  useGetCurrentLoggedInUserQuery,
  useCreateGeneralSignatureMutation,
  useGoogleSigninAndSignUpMutation,
} = authQuery;
