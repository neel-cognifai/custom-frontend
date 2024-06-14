  "use client";
  import React, { useEffect, useState } from "react";
  import { usePathname, useRouter } from "next/navigation";
  import { LocalStorage } from "../../../utils/localstorage";
  import Link from "next/link";
  import { CONSTANTS } from "@/common/constants";

  const Navbar = () => {
    const router = useRouter();
    const [activeLink, setActiveLink] = useState("");

    const pathname = usePathname();

    useEffect(() => {
      if (pathname) {
        setActiveLink(pathname);
      }
    }, [pathname]);

    const handleLogout = () => {
      LocalStorage.clearLocalStorage();
      router.push("/");
    };
    return (
      <nav className="bg-gray-900 w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600">
        <div className="flex flex-wrap mx-auto p-4">
          <div className="flex ml-auto md:order-2">
            <button
              type="button"
              onClick={handleLogout}
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    );
  };

  export default Navbar;
