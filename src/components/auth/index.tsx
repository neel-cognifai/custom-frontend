"use client";

import React, { useState } from "react";
import Login from "./login";
import Image from "next/image";

const Auth = () => {
  const [tab, setTab] = useState("login");

  return (
    <>
      <div className="flex bg-whitesmoke w-full overflow-hidden text-left text-lg text-white font-archivo">
        <div className="w-1/2 h-screen flex justify-center items-center">
          <div className="container max-w-sm mx-auto flex-1 flex flex-col items-center justify-center px-2">
            <div className="container bg-white rounded-xl px-6 pt-8 pb-1 shadow-md text-black w-auto h-auto">
              <div
                className={`text-center cursor-pointer ${
                  tab === "login"
                    ? "text-black font-archivo font-bold underline underline-offset-8"
                    : "text-silver"
                }`}
                onClick={() => setTab("login")}
              >
                Sign in
              </div>
              <div className="mt-4">
                <Login setTab={setTab} />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 h-screen bg-lightsteelblue opacity-100 flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center">
            <Image
              src="/assets/icons/CoVigilAI_logo.png"
              alt="image1"
              width={200}
              height={50}
              className="mt-16"
            />
            <div className="mt-5 text-center text-black font-semibold text-20 font-archivo">
              Generative AI Infused Pharmacovigilance & Safety Surveillance
            </div>
            <div className="text-center text-black font-semibold text-20 font-archivo">
            Literature Monitoring Solution
            </div>
            <Image
              src="/assets/icons/Medical research.png"
              alt="image2"
              width={390}
              height={390}
              className="mt-4"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default Auth;
