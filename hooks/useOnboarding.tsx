import { RootState } from "@/store";
import { setIsUserOnboarded } from "@/store/slices/storeSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useOnboarding = () => {
  const dispatch = useDispatch();
  const isOnboarded = useSelector(
    (state: RootState) => state.storeSlice.isUserOnboarded
  );

  const updateIsOnboarded = useCallback(
    (payload: boolean) => {
      dispatch(setIsUserOnboarded(payload));
    },
    [dispatch]
  );
  return {
    isOnboarded,
    updateIsOnboarded,
  };
};

export default useOnboarding;
