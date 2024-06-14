"use client";
import React, { useEffect, useRef, useState } from "react";
import { LocalStorage } from "../../../utils/localstorage";
import Image from "next/image";
import { useRouter } from "next/navigation";
import LoadingSpinner from "../LoadingSpinner";
import jwt from "jsonwebtoken";
import Toast from "../Toast";
import { CONSTANTS, STATUS, systemMessage } from "../constants";
import { useAppSelector } from "@/redux/store";
import { authState } from "@/components/auth/auth.slice";
import Modal from "../modal/model";
import UpdateCredentials from "@/components/auth/UpdateCredentials";
import { Utils } from "../../../utils/utils";

interface UserData {
  user_id: string;
  role_name: string;
  user_name: string;
}

interface ListUserTeam {
  id: string;
  user_id: string;
  team_id: string;
  email: string;
  user_name: string;
  team_name: string;
  team_type: string;
  task_assignment: string;
  percentage_load: number;
  is_active: boolean;
  is_team_active: boolean;
  is_user_active: boolean;
  created_on: string;
  modified_on: string;
}

function Profile() {
  const router = useRouter();
  const [openAdd, setOPenAdd] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userDetail, setUserDetail] = useState<UserData>();
  const [abstractTeam, setAbstractTeam] = useState<ListUserTeam[] | undefined>(
    []
  );
  const [QCTeam, setQCTeam] = useState<ListUserTeam[] | undefined>([]);
  const [safetySurveillanceTeam, setSafetySurveillanceTeam] = useState<
    ListUserTeam[] | undefined
  >([]);
  const [signalMonitoringTeam, setSignalMonitoringTeam] = useState<
    ListUserTeam[] | undefined
  >([]);
  const [aggregateReportingTeam, setAggregateReportingTeam] = useState<
    ListUserTeam[] | undefined
  >([]);

  const actionRef = useRef<HTMLDivElement>(null);
  const { status } = useAppSelector(authState);


  function handleClose() {
    setOPenAdd(false);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isDropdownOpen &&
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isDropdownOpen]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      const ListUserTeam: string | null = LocalStorage.getItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.LIST_USER_TEAM
      );
      const ListTeam: ListUserTeam[] | null = ListUserTeam
        ? (JSON.parse(ListUserTeam) as ListUserTeam[])
        : null;
      const abstractReviewTeams = ListTeam?.filter(
        (team: ListUserTeam) => team.team_type === "Abstract Review"
      );
      const qcReviewTeams = ListTeam?.filter(
        (team: ListUserTeam) => team.team_type === "QC Review"
      );
      const safetySurveillanceTeams = ListTeam?.filter(
        (team: ListUserTeam) => team.team_type === "Safety Surveillance"
      );
      const signalMonitoringTeams = ListTeam?.filter(
        (team: ListUserTeam) => team.team_type === "Signal Monitoring"
      );
      const aggregateReportingTeams = ListTeam?.filter(
        (team: ListUserTeam) => team.team_type === "Aggregate Reporting"
      );
      setSafetySurveillanceTeam(safetySurveillanceTeams);
      setSignalMonitoringTeam(signalMonitoringTeams);
      setAggregateReportingTeam(aggregateReportingTeams);
      setAbstractTeam(abstractReviewTeams);
      setQCTeam(qcReviewTeams);
    }
  }, [status]);

  useEffect(() => {
    const ListUserTeam: string | null = LocalStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.LIST_USER_TEAM
    );
    const ListTeam: ListUserTeam[] | null = ListUserTeam
      ? (JSON.parse(ListUserTeam) as ListUserTeam[])
      : null;
    const abstractReviewTeams = ListTeam?.filter(
      (team: ListUserTeam) => team.team_type === "Abstract Review"
    );
    const qcReviewTeams = ListTeam?.filter(
      (team: ListUserTeam) => team.team_type === "QC Review"
    );
    const safetySurveillanceTeams = ListTeam?.filter(
      (team: ListUserTeam) => team.team_type === "Safety Surveillance"
    );
    const signalMonitoringTeams = ListTeam?.filter(
      (team: ListUserTeam) => team.team_type === "Signal Monitoring"
    );
    const aggregateReportingTeams = ListTeam?.filter(
      (team: ListUserTeam) => team.team_type === "Aggregate Reporting"
    );
    setSafetySurveillanceTeam(safetySurveillanceTeams);
    setSignalMonitoringTeam(signalMonitoringTeams);
    setAggregateReportingTeam(aggregateReportingTeams);
    setAbstractTeam(abstractReviewTeams);
    setQCTeam(qcReviewTeams);
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handleLogout = () => {
    setIsLoading(true);
    LocalStorage.clearLocalStorage();
    Toast(systemMessage["LogOut Success"], { type: "success" });
    router.push("/");
  };
  return (
    <div className="absolute top-[3%] right-[2%] text-black justify-end ">
      <div
        ref={actionRef}
        className="relative user-info-button min-w-[240px] h-[50px] top-[0px] cursor-pointer left-[0px] rounded-border  shadow-box overflow-hidden flex justify-center items-center"
        onClick={() => {
          toggleDropdown();
        }}
      >
        <div className="text-center text-14 text-white">{Utils.getUserData()?.user_name}</div>
        <Image
          className="absolute top-[15px] left-[210px] cursor-pointer w-5 h-5 overflow-hidden"
          src="/assets/icons/caretup-1.svg"
          alt="downarrow"
          width={20}
          height={20}
        />
      </div>
      {isDropdownOpen && (
        <div className="relative">
          <div className="relative z-10 top-[0px] right-0 mt-2 bg-white shadow-style rounded-[15px] border-gray-300">
            <div className="text-14">
              <div className="pt-2">
                <div className="rounded-md mx-2 border cursor-pointer border-none text-sm font-medium text-black font-archivo bg-gray py-3">
                  <span className="flex items-center justify-center">
                    {" "}
                    Role: {Utils.getUserData()?.role_name || "-"}
                  </span>
                  <span className="flex mt-2 items-center justify-center">
                    {" "}
                    Tenant: {Utils.getTenantData()?.tenant_name || "-"}
                  </span>
                </div>
              </div>
              <div className="mt-2 mx-2">
                <button
                  className="rounded-md w-full border cursor-pointer border-none text-sm font-medium text-white font-archivo bg-violet py-3"
                  type="button"
                  onClick={() => setOPenAdd(true)}
                >
                  Update Password
                </button>
              </div>
              <div className="flex py-3 px-4 mt-2 cursor-pointer">
                <Image
                  src="/assets/icons/users-alt 1.png"
                  alt="user"
                  width={18}
                  height={18}
                />
                <div className="text-violet text-archivo ml-4 font-archivo">
                  Abstract Team
                  {abstractTeam?.map((item, index) => (
                    <div key={index}>
                      <li className="text-black text-archivo mt-2 font-archivo">
                        {item.team_name}
                      </li>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex py-3 px-4 cursor-pointer">
                <Image
                  src="/assets/icons/users-alt 1.png"
                  alt="user"
                  width={18}
                  height={18}
                />
                <div className="text-violet text-archivo ml-4 font-archivo">
                  QC Team
                  {QCTeam?.map((item, index) => (
                    <div key={index}>
                      <li className="text-black text-archivo mt-2 font-archivo">
                        {item.team_name}
                      </li>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex py-3 px-4 cursor-pointer">
                <Image
                  src="/assets/icons/users-alt 1.png"
                  alt="user"
                  width={18}
                  height={18}
                />
                <div className="text-violet text-archivo ml-4 font-archivo">
                  Safety Surveillance
                  {safetySurveillanceTeam?.map((item, index) => (
                    <div key={index}>
                      <li className="text-black text-archivo mt-2 font-archivo">
                        {item.team_name}
                      </li>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex py-3 px-4 cursor-pointer">
                <Image
                  src="/assets/icons/users-alt 1.png"
                  alt="user"
                  width={18}
                  height={18}
                />
                <div className="text-violet text-archivo ml-4 font-archivo">
                  Signal Monitoring
                  {signalMonitoringTeam?.map((item, index) => (
                    <div key={index}>
                      <li className="text-black text-archivo mt-2 font-archivo">
                        {item.team_name}
                      </li>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex py-3 px-4 cursor-pointer">
                <Image
                  src="/assets/icons/users-alt 1.png"
                  alt="user"
                  width={18}
                  height={18}
                />
                <div className="text-violet text-archivo ml-4 font-archivo">
                  Aggregate Reporting
                  {aggregateReportingTeam?.map((item, index) => (
                    <div key={index}>
                      <li className="text-black text-archivo mt-2 font-archivo">
                        {item.team_name}
                      </li>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border border-b-2 border-cyanBlue"></div>
              <div
                className="flex py-3 px-4 cursor-pointer"
                onClick={() => {
                  handleLogout();
                }}
              >
                <Image
                  src="/assets/icons/exit1.png"
                  alt="exit icon"
                  width={18}
                  height={18}
                />
                <div className="text-red-600 text-archivo ml-4 font-archivo">
                  Logout
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        isOpen={openAdd}
        childElement={
          <UpdateCredentials
            onClose={() => {
              handleClose();
            }}
            isOpen={false}
          />
        }
      />
      {isLoading && <LoadingSpinner />}
    </div>
  );
}

export default Profile;
