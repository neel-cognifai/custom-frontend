"use client";
import Profile from "@/common/Profile";
import { authState } from "@/components/auth/auth.slice";
import { useAppSelector } from "@/redux/store";
import React, { ReactElement, useEffect, useState } from "react";
import HelpComponent from "@/common/helpButton";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "../sidebar";
import ResetPassword from "../reset-password";
import { CURRENT_VERSION, privacyPolicyURL, termsOfService } from "@/common/constants";

interface IProps {
  children: ReactElement;
}
const Layout: React.FC<IProps> = ({ children }) => {
  const [currPath, setCurrPath] = useState('/reset-password');
  const [openModals, setOpenModals] = useState(false);
  const { isUserLoggedIn } = useAppSelector(authState);
  const handleSubmit = () => {
    setOpenModals(false);
  };

  useEffect(() => {
    setCurrPath(window.location.pathname);
  }, []);

  const handleClose = () => {
    setOpenModals(false);
  };
  return (
    <div>
      <ToastContainer />
      {currPath === "/reset-password" ? (
        <ResetPassword />
      ) : (
        <>
          <div
            className={
              isUserLoggedIn ? "flex flex-row justify-start bg-gray-300" : ""
            }
          >
            {isUserLoggedIn && (
              <>
                <Sidebar />
              </>
            )}
            <div
              className={
                isUserLoggedIn
                  ? "bg-whitesmoke ml-2 justify-center w-[100%] break-words"
                  : ""
              }
            >
              <div className="flex flex-col">
                <div
                  className={`flex items-center justify-between ${
                    isUserLoggedIn ? "h-[90px]" : ""
                  }`}
                >
                  {isUserLoggedIn && (
                    <>
                      <div className="flex flex-wrap">
                        <HelpComponent />
                        <Profile />
                        {/* <Image
                      className="absolute right-[300px] top-10 cursor-pointer overflow-hidden"
                      alt=""
                      width={18}
                      height={18}
                      src="/assets/icons/bell-2-1.svg"
                      onClick={() => {
                        setOpenModals(true);
                      }}
                    />
                    {openModals && (
                      <NotificationModal  openModals={openModals} onClose={handleClose}/>
                    )} */}
                      </div>
                    </>
                  )}
                </div>

                <div className={isUserLoggedIn ? "m-4" : ""}>{children}</div>
              </div>
              {isUserLoggedIn && (
              <>
              <div className="footer">
                <div className="ml-5 text-14">
                  {CURRENT_VERSION}
                </div>
                <div>
                  <span className="mr-5 text-14"><a href={privacyPolicyURL} target="_blank">Privacy Policy </a>&nbsp; /</span>
                  <span className="mr-5 text-14"><a href={termsOfService} target="_blank">Terms of Service</a>&nbsp; /</span>
                  <span className="mr-5 text-14">&copy; 2024 CovigilAI</span>
                </div>
              </div>
              </>
            )

            }
            </div>
          </div>
        </>
      )}
    </div>
  );
};
export default Layout;
