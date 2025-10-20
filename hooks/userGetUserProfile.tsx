import { useGetCurrentLoggedInUserQuery } from "@/apis/authQuery";
import { RootState } from "@/store";
import { setUserProfile } from "@/store/slices/userProfileSlice";
import { skipToken } from "@reduxjs/toolkit/query";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import useAuthUser from "./useAuthUser";

export const useGetUserProfile = () => {
  const { authUser } = useAuthUser();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: RootState) => state.userProfile.data);
  const shouldSkip = !authUser?.accessToken;

  const {
    data: fetchedProfile,
    isLoading,
    refetch: refetchProfile,
  } = useGetCurrentLoggedInUserQuery(shouldSkip ? skipToken : undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  useEffect(() => {
    if (fetchedProfile?.data) {
      dispatch(setUserProfile(fetchedProfile.data));
    }
  }, [dispatch, fetchedProfile]);

  const refetchAndUpdate = useCallback(async () => {
    const result = await refetchProfile();
    if ("data" in result && result.data?.data) {
      dispatch(setUserProfile(result.data.data));
    }
    return result;
  }, [dispatch, refetchProfile]);

  return {
    userProfile,
    isLoading,
    refetchProfile: refetchAndUpdate,
  };
};
