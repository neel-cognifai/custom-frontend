"use client";
import React, { useState } from "react";
import User from "./User";
import MyTeam from "./Team/MyTeam";
import Tenant from "./Tenant/Tenant";
import Role from "./Role";

const Settings = () => {
  const [tabs, setTabs] = useState(1);
  const [customerNames, setCustomerNames] = useState<string[]>([]);

  const handleTab = (tabIndex: React.SetStateAction<number>) => {
    setTabs(tabIndex);
  };


  return (
    <React.Fragment>
      <div className="bg-white text-14 rounded-[15px]">
        <ul className="flex flex-wrap bg-tabColor cursor-pointer text-sm font-medium text-center  border-b border-gray-200 mb-0">
          <span
            className={`inline-block text-14 p-4 -ml-[40px] ${
              tabs === 1 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 1 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(1)}
          >
            {" "}
            Tenant
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 2 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 2 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(2)}
          >
            {" "}
            User
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 4 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 4 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(4)}
          >
            {" "}
            Role
          </span>
          <span
            className={`inline-block text-14 p-4 text-tabText  ${
              tabs === 3 ? "bg-white" : "bg-tabColor"
            } ${
              tabs === 3 ? "text-violet" : "text-buttonGray"
            } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
            onClick={() => handleTab(3)}
          >
            {" "}
            Team
          </span>
        </ul>
        {tabs === 1 ? <Tenant setCustomerNames={setCustomerNames} /> : tabs === 2 ? <User customerName={customerNames}/> : tabs === 3 ? <MyTeam customerName={customerNames}/>: <Role setCustomerNames={setCustomerNames}/>}
      </div>
    </React.Fragment>
  );
};

export default Settings;