"use client";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useMemo, useEffect } from "react";
import { CONSTANTS } from "@/common/constants";
import Image from "next/image";
import LoadingSpinner from "@/common/LoadingSpinner";
import { LocalStorage } from "../../../utils/localstorage";
import { useAppSelector } from "@/redux/store";
import { authState } from "../auth/auth.slice";

const menuItems = [
  {
    id: 1,
    label: "Search Builder",
    src: "/assets/icons/journal-search.svg",
    link: CONSTANTS.ROUTING_PATHS.journalSearch,
  },
  {
    id: 2,
    label: "Product Monitor",
    src: "/assets/icons/drug-monitor.svg",
    link: CONSTANTS.ROUTING_PATHS.drugMonitor,
  },
  {
    id: 3,
    label: "Abstract Review",
    src: "/assets/icons/abstract-review.svg",
    link: CONSTANTS.ROUTING_PATHS.abstractReview,
  },
  {
    id: 4,
    label: "QC Review",
    src: "/assets/icons/advanced-review.svg",
    link: CONSTANTS.ROUTING_PATHS.advancedReview,
  },
  {
    id: 5,
    label: "Audit Log",
    src: "/assets/icons/report.svg",
    link: CONSTANTS.ROUTING_PATHS.ListAuditLog,
  },
  {
    id: 6,
    label: "Analytics",
    src: "/assets/icons/chart-icon.svg",
    link: CONSTANTS.ROUTING_PATHS.report,
  },
  {
    id: 7,
    label: "User Management",
    src: "/assets/icons/setting.svg",
    link: CONSTANTS.ROUTING_PATHS.settings,
  },
  {
    id: 8,
    label: "System Management",
    src: "/assets/icons/settings-svgrepo-com.svg",
    link: CONSTANTS.ROUTING_PATHS.systemSettings,
  },
];

interface UserData {
  user_id: string;
  role_name: string;
  user_name: string;
  access_level: number;
}

const Sidebar = () => {
  const login = useAppSelector(authState);
  const { status } = login;
  const [activeLink, setActiveLink] = useState<string | null>("/");
  const [toggleCollapse, setToggleCollapse] = useState(true);
  const [isCollapsible, setIsCollapsible] = useState(false);
  const [visibleMenus, setVisibleMenus] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (status === "fulfilled" || status === "idle") {
      const fetchUserRoleFromLocalStorage = () => {
        const userDataString = LocalStorage.getItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.USERDATA
        );
        if (userDataString) {
          const userData: UserData = JSON.parse(userDataString);
          const accessLevel = userData.access_level;
          if (accessLevel === 1) {
            setVisibleMenus([
              "Search Builder",
              "Product Monitor",
              "Abstract Review",
              "QC Review",
            ]);
          } else if (accessLevel === 2) {
            setVisibleMenus([
              "Search Builder",
              "Product Monitor",
              "Abstract Review",
              "QC Review",
              "Audit Log",
              "Analytics",
            ]);
          } else if (accessLevel === 3) {
            setVisibleMenus([
              "Search Builder",
              "Product Monitor",
              "Abstract Review",
              "QC Review",
              "Audit Log",
              "Analytics",
              "User Management",
              "System Management",
            ]);
          }
        }
        setIsLoading(false);
      };
      fetchUserRoleFromLocalStorage();
    }
  }, [status]);

  const pathname = usePathname();
    useEffect(() => {
    setActiveLink(pathname);
  }, [pathname]);

  const activeMenu = useMemo(
    () => menuItems.find((menu) => pathname?.includes(menu.link)),
    [pathname]
  );

  const wrapperClasses = classNames(
    "mt-6 mb-2 bg-white flex h-screen flex-col",
    {
      ["w-60 pl-2"]: !toggleCollapse,
      ["w-20 ml-4"]: toggleCollapse,
    }
  );

  const collapseIconClasses = classNames(
    "ml-8 rounded bg-transparent cursor-pointer fixed left-[9%]"
  );

  const getNavItemClasses = (menu: {
    id?: Number;
    label?: string;
    link?: string;
  }) => {
    return classNames(
      "flex items-center mt-2 text-14 cursor-pointer hover:bg-light-lighter rounded overflow-hidden whitespace-nowrap ",
      {
        ["line-style collapse-style mr-8"]: activeMenu?.id === menu.id,
      }
    );
  };

  const onMouseOver = () => {
    setIsCollapsible(!isCollapsible);
  };

  const handleSidebarToggle = () => {
    setToggleCollapse(!toggleCollapse);
  };
  
  return (
    <div
      className={wrapperClasses}
      onMouseEnter={onMouseOver}
      onMouseLeave={onMouseOver}
      style={{ transition: "width 300ms cubic-bezier(0.2, 0, 0, 1) 0s" }}
    >
      <div className="fixed flex flex-col">
        <div className="flex items-center justify-between relative">
          {toggleCollapse && (
            <div className="flex items-center pl-1 gap-4">
              <button
                className="p-4 rounded bg-white cursor-pointer absolute"
                onClick={handleSidebarToggle}
              >
                <Image
                  src="/assets/icons/menu-burger.svg"
                  width={20}
                  height={20}
                  alt="menu"
                />
              </button>
            </div>
          )}

          {!toggleCollapse && (
            <>
              <div className="p-0 mb-2">
                <span
                  className={classNames(
                    "ml-4 text-style font-medium text-text text-violet text-shadow w-full tracking-0.48",
                    {
                      hidden: toggleCollapse,
                    }
                  )}
                >
                  <Image
                    src="/assets/icons/CoVigilAI_logo.png"
                    width={200}
                    height={30}
                    className="w-[90%] mt-4"
                    alt="layer"
                  />
                </span>
              </div>
              <button
                className={collapseIconClasses}
                onClick={handleSidebarToggle}
              >
                <Image
                  className="ml-4 mt-0 bg-transparent"
                  alt="image1"
                  src="/assets/icons/left-arrow.png"
                  width={15}
                  height={15}
                />
              </button>
            </>
          )}
        </div>

        <div
          className={`flex flex-col items-start ${
            toggleCollapse ? "mt-6 ml-1" : ""
          } ${activeLink ? "border-r-4 border-indigo-500" : ""}`}
        >
          {menuItems.map(({ src: src, ...menu }) => {
            if (!visibleMenus.includes(menu.label)) return null;
            const classes = getNavItemClasses(menu);
            return (
              <div
                key={menu.id}
                className={`${classes} ${
                  activeLink?.includes(menu.link) && !toggleCollapse
                    ? "w-[212px]"
                    : ""
                }`}
              >
                <Link href={menu.link} legacyBehavior>
                  <div
                    className={`flex py-4 ml-2 items-center w-full h-full
                    ${
                      activeLink?.includes(menu.link) && toggleCollapse
                        ? "menu-style"
                        : ""
                    }
                    ${
                      activeLink?.includes(menu.link) && !toggleCollapse
                        ? "expands-style"
                        : ""
                    }

                  `}
                  >
                    <div className="items-center w-[2.5rem] justify-center">
                      <Image
                        src={src}
                        alt="image"
                        width={20}
                        height={20}
                        className="ml-2"
                        title={menu.label}
                      />
                    </div>
                    {!toggleCollapse && (
                      <span
                        className={classNames(
                          "text-normal font-medium  no-underline font-Archivo"
                        )}
                      >
                        {menu.label}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {isLoading && (
        <div className="spinner-overlay">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default Sidebar;
