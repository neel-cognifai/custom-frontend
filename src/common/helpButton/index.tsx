import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button";
import Link from "next/link";

const HelpComponent = () => {
  const [openModals, setOpenModals] = useState(false);
  const handleSubmit = () => {
    setOpenModals(false);
  };

  const handleClose = () => {
    setOpenModals(false);
  };
  return (
    <div className="absolute  right-[310px] top-9">
      <Link href={"https://www.cognifai.in/solutions"} legacyBehavior>
        <a target="_blank">
          <Image
            alt="help icon"
            src="/assets/icons/help.svg"
            width={12}
            height={12}
            className="cursor-pointer px-2 py-2 rounded-full bg-gray"
          />
        </a>
      </Link>
      {/* {openModals && (
        <div className="absolute z-30 top-10 right-4 w-[400px] h-[150px] bg-white shadow-style p-2 rounded-xl border border-gray-300">
          <div className="flex items-center justify-between space-x-2">
            <span className="notification-font font-bold font-archivo m-4">
              Product Tour
            </span>
            <div className="mr-4 mt-1 cursor-pointer">
              <Image
                src="/assets/icons/circle-xmark.png"
                alt="circle"
                width={20}
                height={20}
                className="right-4 mr-4 mt-2"
                onClick={() => {
                  handleClose();
                }}
              />
            </div>
          </div>
          <div className="ml-4 mt-2 text-black text-14 capitalize font-archivo">
            you have click the start button and go to product tour
          </div>
          <Button
            customClasses={" ml-4 mt-6 px-8 cursor-pointer py-1 bg-yellow"}
            buttonText="Start"
            buttonType="submit"
            onClick={handleSubmit}
          />
        </div>
      )} */}
    </div>
  );
};

export default HelpComponent;
