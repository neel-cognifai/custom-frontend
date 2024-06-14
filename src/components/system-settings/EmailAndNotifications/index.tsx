import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faToggleOn, faToggleOff } from "@fortawesome/free-solid-svg-icons";

interface Props {
  staticContent: {
    id: number;
    name: string;
  }[];
}

const NotificationsList: React.FC<Props> = ({ staticContent }) => {
  const [notificationStates, setNotificationStates] = useState(
    staticContent.reduce((acc, notification) => {
      acc[notification.id] = true;
      return acc;
    }, {} as Record<number, boolean>)
  );

  const handleToggle = (notificationId: number) => {
    setNotificationStates((prevStates) => ({
      ...prevStates,
      [notificationId]: !prevStates[notificationId],
    }));
  };

  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container h-auto bg-white text-14 custom-box-shadow scrollable-content-MyTeam rounded-xl border border-gray-300">
          {staticContent.map((notification) => (
            <div key={notification.id} className="mx-2 py-2">
              <div className="flex text-14 mx-4 py-2 h-auto border-bottom-tab-content relative">
                <div className="ml-4 mt-4 text-14">{`${notification.id}. ${notification.name}:`}</div>
                <div
                  className="ml-2 mt-2 cursor-pointer flex"
                  onClick={() => handleToggle(notification.id)}
                >
                  <div>
                    <FontAwesomeIcon
                      icon={
                        notificationStates[notification.id]
                          ? faToggleOn
                          : faToggleOff
                      }
                      color={"#F39200"}
                      size="2x"
                    />
                  </div>
                  <span className="ml-2 mt-2 text-14">
                    {notificationStates[notification.id] ? "Yes" : "No"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default NotificationsList;
