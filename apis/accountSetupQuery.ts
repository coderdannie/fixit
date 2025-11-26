import api from "@/apis/api";
import { Endpoints, RtkqTagEnum } from "@/utils/Endpoints";

export const accountSetupQuery = api.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getOnboardingStage: builder.query<any, void>({
      query: () => ({
        url: Endpoints.GET_ONBOARDING_STAGE,
        method: "GET",
      }),
      providesTags: [{ type: RtkqTagEnum.GET_ONBOARDING_STAGE }],
    }),

    createAccountType: builder.mutation<any, { role: string }>({
      query: (body) => ({
        url: Endpoints.CREATE_ACCOUNT_TYPE,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_ONBOARDING_STAGE }],
    }),

    mechanicProfileSetup: builder.mutation<any, any>({
      query: (body) => ({
        url: Endpoints.MECHANIC_PROFILE_SETUP,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_ONBOARDING_STAGE }],
    }),

    addServices: builder.mutation<
      any,
      { serviceIds: string[]; specializationIds: string[] }
    >({
      query: (body) => ({
        url: Endpoints.ADD_SERVICES,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_ONBOARDING_STAGE }],
    }),

    userSettings: builder.mutation<
      any,
      { enableNotification: boolean; allowLocationAccess: boolean }
    >({
      query: (body) => ({
        url: Endpoints.USER_SETTINGS,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.GET_ONBOARDING_STAGE }],
    }),
    getSpecialization: builder.query<any, void>({
      query: () => ({
        url: Endpoints.GET_SPECIALIZATION,
        method: "GET",
      }),
      providesTags: [{ type: RtkqTagEnum.GET_SPECIALIZATION }],
    }),
    getServices: builder.query<any, void>({
      query: () => ({
        url: Endpoints.GET_SERVICES,
        method: "GET",
      }),
      providesTags: [{ type: RtkqTagEnum.GET_SERVICES }],
    }),
    fleetProfileSetup: builder.mutation({
      query: (args) => ({
        url: Endpoints.FLEET_PROFILE_SETUP,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.ROOT }],
    }),
    addVehicle: builder.mutation({
      query: (args) => ({
        url: Endpoints.FLEET_PROFILE_SETUP,
        method: "POST",
        body: args,
      }),
      invalidatesTags: [{ type: RtkqTagEnum.ROOT }],
    }),
  }),
});

export const {
  useGetOnboardingStageQuery,
  useCreateAccountTypeMutation,
  useMechanicProfileSetupMutation,
  useAddServicesMutation,
  useUserSettingsMutation,
  useGetSpecializationQuery,
  useGetServicesQuery,
  useFleetProfileSetupMutation,
  useAddVehicleMutation,
} = accountSetupQuery;
