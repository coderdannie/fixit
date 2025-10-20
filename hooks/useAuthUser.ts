import { RootState } from "@/store";
import { setAuthUser } from "@/store/slices/authSlice";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

const useAuthUser = () => {
  const dispatch = useDispatch();
  const authUser = useSelector((state: RootState) => state.auth);

  const updateAuthUser = useCallback(
    (payload: { data: any; accessToken: string; expiresIn: number | null }) => {
      dispatch(setAuthUser(payload));
    },
    [dispatch]
  );

  return { authUser, updateAuthUser };
};

export default useAuthUser;
