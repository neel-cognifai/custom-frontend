import React, { useState } from "react";
import Image from "next/image";
import Button from "../Button";

interface NotificationModalProps {
  openModals: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
  openModals,
  onClose,
}) => {
  const handleSubmit = () => {
    onClose();
  };

  return openModals ? (
    <>
      <div className="absolute z-30 text-14 top-16 right-[312px] w-[400px] h-[600px] bg-white p-2 shadow-style rounded-xl border border-gray-300">
        <div className="flex items-center justify-between space-x-2">
          <span className="notification-font font-bold font-archivo m-4">
            Notification
          </span>
          <div className="mr-4 mt-1 cursor-pointer">
            <Image
              src="/assets/icons/circle-xmark.png"
              alt="circle"
              width={20}
              height={20}
              className="right-4 mr-4 mt-2"
              onClick={onClose}
            />
          </div>
        </div>
        <div className="ml-4 text-lightslategray font-archivo">12:30 pm</div>
        <div className="ml-4 mt-2 text-black capitalize font-archivo">
          you have request to join jupiter team
        </div>
        <Button
          customClasses={"ml-4 mt-4 px-6 cursor-pointer py-2 bg-yellow"}
          buttonText="Join"
          buttonType="submit"
          onClick={handleSubmit}
        />
        <div className="notification-message-box flex justify-between">
          <p className="m-2 mb-4">Abstract process has been completed</p>
          <div className="mt-1 mr-1 cursor-pointer">
            <Image
              src="/assets/icons/circle-xmark.png"
              alt="circle"
              width={20}
              height={20}
              onClick={onClose}
            />
          </div>
        </div>
        <div className="notification-message-box flex justify-between">
          <p className="m-2 mb-4">
            Abstract process has been put in &apos;processing&apos; state
          </p>
          <div className="mt-1 mr-1 cursor-pointer">
            <Image
              src="/assets/icons/circle-xmark.png"
              alt="circle"
              width={20}
              height={20}
              onClick={onClose}
            />
          </div>
        </div>
        <div className="notification-message-box flex justify-between">
          <p className="m-2 mb-4">
            Abstract process for ID &apos;CD789012&apos; has been started
          </p>
          <div className="mt-1 mr-1 cursor-pointer">
            <Image
              src="/assets/icons/circle-xmark.png"
              alt="circle"
              width={20}
              height={20}
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </>
  ) : null;
};

export default NotificationModal;
