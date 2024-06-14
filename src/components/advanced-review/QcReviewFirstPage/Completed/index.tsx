import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  CONSTANTS,
  STATUS,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import EmailSenderComponent from "@/common/EmailSender";
import LoadingSpinner from "@/common/LoadingSpinner";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { StatusChangeAsync } from "@/components/abstract-review/abstract-review.slice";
import Toast from "@/common/Toast";
import { IItem } from "../../advance.model";
import {
  AdvanceReviewDataState,
  AdvancedReviewCancelledTotalCountAsync,
  AdvancedReviewCompletedDataAsync,
  AdvancedReviewCompletedTotalCountAsync,
  AdvancedReviewInProgressTotalCountAsync,
} from "../../advance-review.slice";
import { SortOption } from "../../../../../utils/sortingUtils";
import { Utils } from "../../../../../utils/utils";
import { LocalStorage } from "../../../../../utils/localstorage";
import { UserData } from "@/common/helper/common.modal";
import { SentMonitorEmailAsync } from "@/components/drug-monitor/productMonitor.slice";

interface Item {
  ID: string;
  "Monitor Name": string;
  Description: string;
  "Total Records": string;
  "Pending Case": number;
  "Due Date": string;
}

interface IProps {
  searchQuery: string;
  label: string;
}
const Completed: React.FC<IProps> = ({ searchQuery, label }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [filterData, setFilteredData] = useState<IItem[]>([]);
  const [monitorDropdownOpen, setMonitorDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [recordsDropdownOpen, setRecordsDropdownOpen] = useState(false);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [fetchAdvanceReviewCompletedData, setFetchAdvanceReviewCompletedData] =
    useState<IItem[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const { advanceReviewCompletedData, status, TotalCompletedCount } =
    useAppSelector(AdvanceReviewDataState);

  useEffect(() => {
    const payload = {
      pageNumber: 1,
      perPage: defaultPerPage,
    };
    dispatch(AdvancedReviewCompletedTotalCountAsync());
    dispatch(AdvancedReviewCompletedDataAsync(payload));
  }, []);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setTotalRecords(TotalCompletedCount);
      setFetchAdvanceReviewCompletedData(advanceReviewCompletedData);
    } else {
      setIsLoading(false);
    }
  }, [status, advanceReviewCompletedData, TotalCompletedCount]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(AdvancedReviewCompletedDataAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(AdvancedReviewCompletedDataAsync(payload));
  };

  useEffect(() => {
    setIsLoading(true);
    if (fetchAdvanceReviewCompletedData?.length) {
      setIsLoading(false);
      setFilteredData(fetchAdvanceReviewCompletedData);
      setMessage("");
    } else {
      setIsLoading(false);
      setFilteredData([]);
      setMessage(systemMessage.not_found);
    }
  }, [fetchAdvanceReviewCompletedData]);

  const [openModals, setOpenModals] = useState(
    new Array(filterData.length).fill(false)
  );

  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);

  const monitorDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const recordsDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        monitorDropdownRef.current &&
        !monitorDropdownRef.current.contains(event.target as Node)
      ) {
        setMonitorDropdownOpen(false);
      }
      if (
        dateDropdownRef.current &&
        !dateDropdownRef.current.contains(event.target as Node)
      ) {
        setDateDropdownOpen(false);
      }
      if (
        recordsDropdownRef.current &&
        !recordsDropdownRef.current.contains(event.target as Node)
      ) {
        setRecordsDropdownOpen(false);
      }
      if (
        statusDropdownRef.current &&
        !statusDropdownRef.current.contains(event.target as Node)
      ) {
        setStatusDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isModalOpen &&
        actionRef.current &&
        !actionRef.current.contains(event.target as Node)
      ) {
        const newOpenModals = [...openModals];
        newOpenModals[openModalIndex!] = false;
        setOpenModals(newOpenModals);
        setIsModalOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isModalOpen, openModals, openModalIndex]);

  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!actionRef.current) return;
      if (!isModalOpen || actionRef.current.contains(event.target as Node))
        return;
      setIsModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  }, []);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IItem;
    direction: "ascending" | "descending" | "";
  }>({
    key: "id",
    direction: "",
  });

  const sortedFilteredData = [...filterData].sort((a, b) => {
    let valueA: number | string = "";
    let valueB: number | string = "";

    if (typeof a[sortConfig.key] === "string") {
      valueA = a[sortConfig.key] as string;
    } else if (typeof a[sortConfig.key] === "number") {
      valueA = a[sortConfig.key] as number;
    }

    if (typeof b[sortConfig.key] === "string") {
      valueB = b[sortConfig.key] as string;
    } else if (typeof b[sortConfig.key] === "number") {
      valueB = b[sortConfig.key] as number;
    }

    if (sortConfig.direction === "ascending") {
      return valueA > valueB ? 1 : -1;
    } else {
      return valueA < valueB ? 1 : -1;
    }
  });

  const handleMonitorNameSort = (
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.key === "name" && sortConfig.direction === direction) {
      return;
    }

    requestSort("name", direction);
    setMonitorDropdownOpen(false);
  };

  const handleDateSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "to_date" && sortConfig.direction === direction) {
      return;
    }

    requestSort("to_date", direction);
    setDateDropdownOpen(false);
  };

  const handleRecordsSort = (direction: "ascending" | "descending" | "") => {
    if (
      sortConfig.key === "total_records" &&
      sortConfig.direction === direction
    ) {
      return;
    }

    requestSort("total_records", direction);
    setRecordsDropdownOpen(false);
  };

  const requestSort = (
    key: keyof IItem,
    direction: "ascending" | "descending" | ""
  ) => {
    if (sortConfig.direction == "") {
      direction = direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowClick = (item: IItem) => {
    setIsLoading(true);
    router.push(`${CONSTANTS.ROUTING_PATHS.advancedReview2}/${item.id}`);
  };

  const handleStatus = async (item: IItem, index: number, status: string) => {
    try {
      setIsLoading(true);
      const payload = { id: item.id, status: status };
      const response = await dispatch(StatusChangeAsync(payload));
      if (StatusChangeAsync.fulfilled.match(response)) {
        if (response.payload.status === 200) {
          setIsLoading(false);
          if (status === "Completed") {
            Toast(systemMessage.MarkCompleted, { type: "success" });
          } else if (status === "AI Review Completed") {
            Toast(systemMessage.MarkInProgress, { type: "success" });
          } else {
            Toast(systemMessage.MaskCancelled, { type: "success" });
          }
          await dispatch(AdvancedReviewInProgressTotalCountAsync());
          await dispatch(AdvancedReviewCompletedTotalCountAsync());
          await dispatch(AdvancedReviewCancelledTotalCountAsync());
          const payload = {
            pageNumber: 1,
            perPage: perPage,
          };
          await dispatch(AdvancedReviewCompletedDataAsync(payload));
          const newOpenModals = [...openModals];
          newOpenModals[index] = false;
          setOpenModals(newOpenModals);
          setIsModalOpen(false);
        } else {
          setIsLoading(false);
          Toast(systemMessage.ErrorInCompleted, { type: "error" });
        }
      }
    } catch (error: unknown) {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    setIsExportLoading(true);
    let selectedData = sortedFilteredData;
    const csvHeader =
      "Id,Name,Description,Date Created,Due Date,Total Records,Pending Case,Created By\n";
    const csvContent = selectedData
      .map((item) => {
        return `"${item?.monitor_id}","${item?.name}","${item?.description}", ${
          item?.created_on ? item?.created_on.split("T")[0] : "-"
        },"${item?.created_on}","${item?.to_date}","${item?.total_records}","${
          item?.pending_records
        }","${item?.created_by}"`;
      })
      .join("\n");

    const fullCsvContent = csvHeader + csvContent;

    const blob = new Blob([fullCsvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${
        Utils.getUserData()?.user_name
      }_QcCompletedList_${Utils.getCurrentDateAndTime()}.csv`
    );

    link.click();

    URL.revokeObjectURL(url);
    setIsExportLoading(false);
  };

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);
      const payload = {
        expert_review_type: "QC",
        page: currentPage,
        per_page: perPage,
        count: false,
        emails: tags,
        col: "status",
        value: 'Completed'
      };
      const res = await dispatch(SentMonitorEmailAsync(payload));
      if (SentMonitorEmailAsync.fulfilled.match(res)) {
        setIsLoading(false);
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          setIsLoading(false);
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        setIsLoading(false);
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during download:", error);
      setIsLoading(false);
    }
  };
  return (
    <React.Fragment>
      <div>
        <section className="mt-0 relative bg-white custom-box-shadow">
          <div className="mr-4 cursor-pointer justify-end flex">
            <div className="mt-1">
              <EmailSenderComponent
               handleSend={(tags: string[]) => {
                handleEmailSend(tags);
              }}
              customClasses="right-8" />
            </div>
            <div className="relative">
              <button
                className={`rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8 bg-yellow text-white text-14`}
                onClick={handleDownload}
              >
                Export
              </button>
              <>
                <div className="absolute cursor-pointer top-0 ml-2">
                  <Image
                    src="/assets/icons/download-white.svg"
                    alt="download icon"
                    width={15}
                    height={15}
                    className={`left-0 ml-2 top-0 mt-2 `}
                  />
                </div>
              </>
            </div>
            {isExportLoading && <LoadingSpinner text={"Downloading"} />}
          </div>
          <div className="border-style mt-4"></div>
          <div className="overflow-x-autos">
            <table className="w-[100%] text-14 border border-collapse table-auto">
              <thead className="border-style text-sm text-left">
                <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                  <th className="px-4 py-3 w-32 hover-text-style">ID</th>
                  <th className="w-64">
                    <div ref={monitorDropdownRef} className="relative">
                      <span
                        className="flex ml-2 px-4 py-4 hover-text-style items-center hover:bg-whiteGray cursor-pointer"
                        onClick={() =>
                          setMonitorDropdownOpen(!monitorDropdownOpen)
                        }
                      >
                        Monitor Name{" "}
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
                      {monitorDropdownOpen && (
                        <div className="absolute top-14 w-[190px] bg-white border rounded-lg shadow-lg">
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
                  <th className="pl-3 w-20 hover-text-style items-center hover:bg-whiteGray cursor-pointer">
                    Description
                  </th>
                  <th className="px-2 py-3 w-20 hover-text-style date-created-width">
                    Date created
                  </th>
                  <th className="px-2 w-32 py-3">
                    <div ref={dateDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-2 px-4 py-4 hover-text-style items-center hover:bg-whiteGray cursor-pointer"
                        onClick={() => setDateDropdownOpen(!dateDropdownOpen)}
                      >
                        Due Date{" "}
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
                      {dateDropdownOpen && (
                        <div className="absolute text-left top-14 w-[200px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleDateSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleDateSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-4 w-32 py-3 ml-8">
                    <div ref={recordsDropdownRef} className="relative">
                      <span
                        className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center hover:bg-whiteGray cursor-pointer"
                        onClick={() =>
                          setRecordsDropdownOpen(!recordsDropdownOpen)
                        }
                      >
                        Total Records{" "}
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
                      {recordsDropdownOpen && (
                        <div className="absolute top-14 text-left w-[190px] bg-white border rounded-lg shadow-lg">
                          <SortOption
                            label="Sort Ascending"
                            direction="ascending"
                            active={sortConfig.direction}
                            onClick={handleRecordsSort}
                            iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                          <SortOption
                            label="Sort Descending"
                            direction="descending"
                            active={sortConfig.direction}
                            onClick={handleRecordsSort}
                            iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                            iconAlt="arrow"
                          />
                        </div>
                      )}
                    </div>
                  </th>
                  <th className="px-4 w-20 py-3 ml-8">
                    <div className="relative">
                      <span className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center cursor-pointer">
                        Pending Cases{" "}
                      </span>
                    </div>
                  </th>
                  <th className="px-4 w-20 py-3 text-left hover-text-style" >
                    Created By
                  </th>
                  <th className="px-4 w-20 py-3 ml-8">
                    <div className="relative">
                      <span className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center cursor-pointer">
                        Action
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedFilteredData &&
                  sortedFilteredData
                    ?.filter((item) =>
                      item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b cursor-pointer hover:bg-ghostwhite text-left text-sm table-row border-style"
                        key={index}
                      >
                        <td
                          className="px-4 py-6"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.monitor_id}
                        </td>
                        <td
                          className={`px-8 py-6 ${
                            searchQuery ? "font-bold" : ""
                          }`}
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.name}
                        </td>
                        <td
                          className={`px-2 py-6 w-[300px] break-words text-lightslategray`}
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.description}
                        </td>
                        <td
                          className="px-4 py-6 text-lightslategray date-width"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.created_on
                            ? item?.created_on.split("T")[0]
                            : "-"}
                        </td>
                        <td
                          className="px-4 py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.to_date}
                        </td>
                        <td
                          className="px-4 py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.total_records}
                        </td>
                        <td
                          className="px-4 py-6 text-lightslategray"
                          onClick={() => handleRowClick(item)}
                        >
                          {item?.pending_records}
                        </td>
                        <td className="px-4 py-6 text-lightslategray text-left">
                          {item.created_by}
                        </td>
                        <td className="px-4 py-6 relative cursor-pointer">
                          <div ref={actionRef} className="relative">
                            <Image
                              src="/assets/icons/menu-dots-vertical.png"
                              alt="3 dots"
                              width={15}
                              height={15}
                              className="m-3 w-4"
                              onClick={() => {
                                setOpenModalIndex(index);
                                const newOpenModals = [...openModals];
                                newOpenModals[index] = true;
                                setOpenModals(newOpenModals);
                                setIsModalOpen(true);
                              }}
                            />
                          </div>
                          {isModalOpen && (
                            <div>
                              {openModalIndex === index &&
                                openModals[index] && (
                                  <div
                                    className="absolute right-1 top-[60px] w-48 rounded-lg bg-white shadow-style"
                                    style={{ zIndex: 10 }}
                                  >
                                    <Image
                                      alt="close"
                                      src="/assets/icons/cross-5.svg"
                                      width={10}
                                      height={10}
                                      onClick={() => {
                                        const newOpenModals = [...openModals];
                                        newOpenModals[index] = false;
                                        setOpenModals(newOpenModals);
                                      }}
                                      className="mt-0 absolute right-4 top-2 crs-btn-bg" 
                                    />
                                    <div
                                      className={`items-center text-[red] space-x-2`}
                                    >
                                      <div
                                        className="m-4"
                                        onClick={() =>
                                          handleStatus(
                                            item,
                                            index,
                                            CONSTANTS.MONITOR_STATUS_IN_PROGRESS
                                          )
                                        }
                                      >
                                        Mark as In Progress
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                {message && (
                  <tr className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite mb-2">
                    {" "}
                    <td
                      className="px-2 py-2 capitalize col-span-3 text-center"
                      colSpan={9}
                    >
                      {message}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
        {isLoading && <LoadingSpinner />}
      </div>
      {fetchAdvanceReviewCompletedData?.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          perPage={perPage}
          totalRecords={Number(totalRecords)}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
        />
      )}
    </React.Fragment>
  );
};

export default Completed;
