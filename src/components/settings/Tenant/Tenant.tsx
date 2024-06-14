import React, { useEffect, useRef, useState } from "react";
import { STATUS, defaultPerPage } from "@/common/constants";
import { useDispatch } from "react-redux";
import { AppDispatch, useAppSelector } from "@/redux/store";
import Toast from "@/common/Toast";
import LoadingSpinner from "@/common/LoadingSpinner";
import AddTenant from "./AddTenant";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faToggleOn,
  faToggleOff,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { SortOption } from "../../../../utils/sortingUtils";
import Image from "next/image";
import CustomPagination from "@/common/Pagination/CustomPagination";
import {
  TenantStatusActivateAsync,
  TenantStatusDeactivateAsync,
  getTenantAsync,
  getTenantCountAsync,
  tenantState,
} from "./tenant.slice";
import { TenantPayload } from "./tenant.model";
import { Utils } from "../../../../utils/utils";

interface ITeam {
  id: any;
  name: string;
  description: string;
  is_active: boolean;
}
interface IEnterData {
  setCustomerNames: React.Dispatch<React.SetStateAction<string[]>>;
}

const Tenant: React.FC<IEnterData> = ({ setCustomerNames }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, tenant, TotalTenant } = useAppSelector(tenantState);
  const [openAdd, setOPenAdd] = useState<boolean>(false);
  const [tenantId, setTenantId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [teamData, setTeamData] = useState<ITeam[]>([]);
  const [tenantStates, setTenantStates] = useState<Record<number, boolean>>({});
  const [nameDropdownOpen, setNameDropdownOpen] = useState(false);
  const nameDropdownRef = useRef<HTMLDivElement>(null);
  const [totalRecords, setTotalRecords] = useState<Number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ITeam;
    direction: "ascending" | "descending" | "";
  }>({
    key: "name",
    direction: "",
  });

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        nameDropdownRef.current &&
        !nameDropdownRef.current.contains(event.target as Node)
      ) {
        setNameDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    setTenantStates(
      teamData.reduce((acc, status) => {
        acc[status.id] = status.is_active;
        return acc;
      }, {} as Record<number, boolean>)
    );
  }, [teamData]);

  useEffect(() => {
    const payload = {
      pageNumber: 1,
      perPage: perPage,
    };
    setIsLoading(true);
    dispatch(getTenantCountAsync());
    dispatch(getTenantAsync(payload));
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setTeamData(tenant);
      setTotalRecords(TotalTenant);
    }
  }, [loading, tenant, TotalTenant]);

  const sortedData = [...teamData].sort((a, b) => {
    const nameA = a[sortConfig.key].toLowerCase();
    const nameB = b[sortConfig.key].toLowerCase();

    if (sortConfig.direction === "ascending") {
      return nameA > nameB ? 1 : -1;
    } else {
      return nameA < nameB ? 1 : -1;
    }
  });

  const requestSort = (
    key: keyof ITeam,
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.direction == "") {
      direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleMonitorNameSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "name" && sortConfig.direction === direction) {
      return;
    }
    requestSort("name", direction);
    setNameDropdownOpen(false);
  };

  const handleToggle = async (id: number) => {
    const isActive = tenantStates[id];
    setIsLoading(true);
    const payload = {
      id: id,
    };
    const response = isActive
      ? await dispatch(
          TenantStatusDeactivateAsync(payload as unknown as TenantPayload)
        )
      : await dispatch(
          TenantStatusActivateAsync(payload as unknown as TenantPayload)
        );

    if (response.payload.status === "success") {
      Toast(response.payload.message, { type: "success" });
    } else {
      Toast(response.payload.data.message, { type: "error" });
    }
    const PaginationPayload = {
      pageNumber: 1,
      perPage: perPage,
    };
    setCurrentPage(1);
    dispatch(getTenantAsync(PaginationPayload));
    setIsLoading(false);
  };

  const handelOpen = () => {
    setTenantId("");
    setOPenAdd(true);
  };

  const handleClose = () => {
    setOPenAdd(false);
    setTenantId("");
  };

  const handleOpenEdit = (id: React.SetStateAction<string>) => {
    setTenantId(id);
    setOPenAdd(true);
  };

  const handlePageChange = (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(getTenantAsync(payload));
    setIsLoading(false);
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIsLoading(true);
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(getTenantAsync(payload));
    setIsLoading(false);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container h-auto bg-white custom-box-shadow rounded-xl border border-gray-300">
        <div className="add mt-4">
          {!openAdd ? (
            <>
              <div className="ml-2 mt-2 flex">
                <div>
                  <input
                    type="text"
                    placeholder="Search by tenant"
                    onChange={handleSearch}
                    className="w-[400px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
                  />
                </div>
                <div className="ml-[-30px] mt-3">
                  <Image
                    src="/assets/icons/search-5-1.svg"
                    width={15}
                    height={15}
                    alt="search icon"
                    className=""
                  />
                </div>

                <div className="action-button-right flex flex-col items-end justify-end mr-4">
                  <button
                    className="bg-yellow cursor-pointer px-4 py-3 w-40 text-white text-14 text-base font-archivo font-medium capitalize rounded"
                    onClick={handelOpen}
                  >
                    + add Tenant
                  </button>
                </div>
              </div>
            </>
          ) : (
            <AddTenant
              handelClose={() => {
                handleClose();
              }}
              currentPage={currentPage}
              editTenantId={tenantId}
              setCustomerNames={setCustomerNames}
            />
          )}
        </div>
        <section className="mt-4 bg-white custom-box-shadow">
          <div className="border-style"></div>
          <div className="overflow-style">
            <table className="w-[100%] border border-collapse table-auto relative">
              <thead className="border-style text-14 text-sm text-left">
                <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                  <th className="py-6 hover-text-style">
                    <div ref={nameDropdownRef} className="relative">
                      <span
                        className="flex px-4 py-4 hover-text-style items-center hover:bg-whiteGray cursor-pointer"
                        onClick={() => setNameDropdownOpen(!nameDropdownOpen)}
                      >
                        Tenant{" "}
                        <Image
                          src="/assets/icons/sort.svg"
                          alt="sort"
                          width={15}
                          height={15}
                          className={`ml-3 ${
                            sortConfig.direction === "ascending"
                              ? "rotate-180"
                              : ""
                          }`}
                        />
                      </span>
                      {nameDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleMonitorNameSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleMonitorNameSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-2 py-6 hover-text-style">Description</th>
                  <th className="px-2 py-6 hover-text-style">Active</th>
                  <th className="px-2 py-6 hover-text-style">Action</th>
                </tr>
              </thead>
              <tbody className="text-14">
                {sortedData &&
                  sortedData
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        key={index}
                        className="border-b text-left text-sm border-style"
                      >
                        <td
                          className={`px-4 text-left py-6 ${
                            searchQuery ? "font-bold" : ""
                          }`}
                        >
                          {item.name}
                        </td>
                        <td className="px-2 text-left py-6">
                          {item.description}
                        </td>
                        <td className="px-2 py-6">
                          <div
                            className="mt-2 cursor-pointer flex"
                            onClick={(e: any) => handleToggle(item.id)}
                          >
                            <div>
                              <FontAwesomeIcon
                                icon={
                                  tenantStates[item.id]
                                    ? faToggleOn
                                    : faToggleOff
                                }
                                color={"#F39200"}
                                size="2x"
                              />
                            </div>
                            <span className="ml-2 mt-2 text-14">
                              {tenantStates[item.id] ? "Yes" : "No"}
                            </span>
                          </div>
                        </td>
                        <td className="px-2 mt-4 cursor-pointer text-left py-3">
                          <div
                            onClick={() => {
                              Utils.scrollToTopSmooth();
                              handleOpenEdit(item.id);
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faEdit}
                              color={"#F39200"}
                              size="xl"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </section>
        {isLoading && <LoadingSpinner />}
      </div>
      {teamData.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          perPage={perPage}
          totalRecords={Number(totalRecords)}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
        />
      )}
    </section>
  );
};

export default Tenant;
