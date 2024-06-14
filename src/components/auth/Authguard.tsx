"use client";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { authAction, authState } from "./auth.slice";
import { LocalStorage } from "../../../utils/localstorage";
import { CONSTANTS } from "@/common/constants";

const Authguard = ({ children }: any) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isUserLoggedIn } = useAppSelector(authState);
  const path = usePathname();

  useEffect(() => {
    const isTokenExisting: boolean = LocalStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.TOKEN
    )
      ? true
      : false;
    dispatch(authAction.updateIsLoggedIn(isTokenExisting));

    if (isTokenExisting) {
      if (path === CONSTANTS.ROUTING_PATHS.login) {
        router.push(CONSTANTS.ROUTING_PATHS.journalSearch);
      }
    } else {
      router.push(CONSTANTS.ROUTING_PATHS.login);
      LocalStorage.clearLocalStorage();
    }
  }, [isUserLoggedIn, path, router, dispatch]);

  return children;
};

export default Authguard;
