import { data } from "@/common/data";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { SortOption } from "../../../utils/sortingUtils";
import EmailSenderComponent from "@/common/EmailSender";
import Modal from "@/common/modal/model";
import UploadListModal from "@/common/modal/monitorListModal";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GetItemDownloadDataAsync,
  SentMonitorEmailAsync,
  deleteProductMonitorAsync,
  getProductMonitorAsync,
  getProductTotalMonitorAsync,
  productMonitorState,
} from "./productMonitor.slice";
import {
  CONSTANTS,
  STATUS,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import Toast from "@/common/Toast";
import { Utils } from "../../../utils/utils";
import LoadingSpinner from "@/common/LoadingSpinner";
import { IItem } from "../abstract-review/abstract.model";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { IDownload } from "./productMonitor.model";
import { LocalStorage } from "../../../utils/localstorage";
import { UserData } from "@/common/helper/common.modal";

interface Item {
  ID: number;
  new: boolean;
  "Monitor Name": string;
  Description: string;
  "Due Date": string;
  "Total Records": string;
  "Pending Case": string;
  "Monitor status": string;
}

interface IProps {
  setOPenEdit: any;
}

interface IUploadFile {
  index: number;
  isOpen: boolean;
  monitorData: IItem;
}

const ListDrugMonitor: React.FC<IProps> = ({ setOPenEdit }) => {
  const [openModals, setOpenModals] = useState(
    new Array(data.length).fill(false)
  );
  const dispatch = useAppDispatch();
  const { productMonitor, loading, TotalMonitor } =
    useAppSelector(productMonitorState);
  const [fetchedProductMonitor, setProductMonitor] = useState<IItem[]>([]);
  const [openModalIndex, setOpenModalIndex] = useState<number | null>(null);
  const [monitorDropdownOpen, setMonitorDropdownOpen] = useState(false);
  const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
  const [recordsDropdownOpen, setRecordsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState<boolean | string>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [filterData, setFilterData] = useState<IItem[]>([]);
  const [monitorId, setMonitorId] = useState("string");
  const [formValues, setFormValues] = useState({
    selectedFile: null as File | null,
  });
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [searchQuery, setSearchQuery] = useState("");
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [uploadModalOpen, setUploadModalOpen] = useState<IUploadFile>({
    index: -1,
    isOpen: false,
    monitorData: {} as IItem,
  });
  const handleFileDelete = () => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedFile: null,
    }));
    //setUploadModalOpen({ index: -1, isOpen: false });
  };
  const monitorDropdownRef = useRef<HTMLDivElement>(null);
  const dateDropdownRef = useRef<HTMLDivElement>(null);
  const recordsDropdownRef = useRef<HTMLDivElement>(null);
  const editRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const payload = {
      pageNumber: 1,
      perPage: perPage,
    };
    dispatch(getProductTotalMonitorAsync());
    dispatch(getProductMonitorAsync(payload));
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setProductMonitor(productMonitor);
      setTotalRecords(TotalMonitor);
    }
  }, [loading, productMonitor, TotalMonitor]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(getProductMonitorAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(getProductMonitorAsync(payload));
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      /*if (editRef.current && !editRef.current.contains(event.target as Node)) {
        setIsModalOpen(false);
      }*/
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
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

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
  useEffect(() => {
    if (fetchedProductMonitor.length) {
      setFilterData(fetchedProductMonitor);
      setMessage(false);
    } else {
      setMessage(systemMessage.not_found);
    }
  }, [fetchedProductMonitor]);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof IItem;
    direction: "ascending" | "descending" | "" | "";
  }>({
    key: "id",
    direction: "",
  });

  const sortedData = [...filterData].sort((a, b) => {
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

  const requestSort = (
    key: keyof IItem,
    direction: "ascending" | "descending" | ""
  ) => {
    debugger;
    if (sortConfig.direction == "") {
      direction = direction;
    }
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const deleteItem = async (id: number, index: number) => {
    await dispatch(deleteProductMonitorAsync(id));
    const payload = {
      pageNumber: 1,
      perPage: perPage,
    };
    await dispatch(getProductMonitorAsync(payload));
    Toast(message, { type: "success" });
    const newOpenModals = [...openModals];
    newOpenModals[index] = false;
    setOpenModals(newOpenModals);
  };

  const handleEdit = (index: number, id: number) => {
    setOPenEdit(id);
    const newOpenModals = [...openModals];
    newOpenModals[index] = false;
    setOpenModals(newOpenModals);
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = (event: MouseEvent) => {
      if (!editRef.current) return;
      if (!isModalOpen || editRef.current.contains(event.target as Node))
        return;
      setIsModalOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const recordsDownload = async (id: string, status: string, name?: string) => {
    try {
      setLoader(true);
      const response = await dispatch(GetItemDownloadDataAsync({ id, status }));
      if (GetItemDownloadDataAsync.fulfilled.match(response)) {
        const data = response.payload;
        let selectedData = [data][0];
        const csvHeader = `Title,Citation Db,Assignee,Review Type,Status,Expert Decision,Aggregate Reporting,Safety Signal,Serious Event,Categories,Classifications,Comments,Search Result Status,Monitor Status,Active,Country,Article Id,Ai decision,Confidence Score,Reason,Causality Decision,Causality Confidence Score,Causality Reason,Designated Medical Events,Created By,Date Created,Modified By,Modified On,Filter Type,Updated On\n`;
        const csvContent = selectedData
          .map((item: IDownload) => {
            return `"${item?.title}","${item?.filter_type}","${
              item?.assignee
            }","${item?.review_type}","${item?.status}","${
              item?.expert_decision || "-"
            }","${item?.is_aggregate_reporting || "-"}","${
              item?.is_safety_signal || "-"
            }","${item?.is_serious_event || "-"}","${
              item?.categories || "-"
            }","${item?.classifications || "-"}","${item?.comments || "-"}","${
              item?.search_result_status || ""
            }","${item?.monitor_status || "-"}","${item?.is_active || "-"}","${
              item?.country || "-"
            }","${item?.article_id || ""}","${item?.ai_decision || "-"}","${
              item?.confidence_score || "-"
            }","${item?.reason || "-"}","${item?.causality_decision || "-"}","${
              item?.causality_confidence_score || ""
            }","${item?.causality_reason || "-"}","${
              item?.designated_medical_events || "-"
            }","${item?.created_by || "-"}","${
              item?.created_on?.split("T")[0] || "-"
            }","${item?.modified_by || "-"}","${
              item?.modified_on?.split("T")[0] || "-"
            }","${item?.filter_type || "-"}","${
              item?.updated_on?.split("T")[0] || "-"
            }"`;
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
          `${name}_ArticleList_${Utils.getCurrentDateAndTime()}.csv`
        );

        link.click();

        URL.revokeObjectURL(url);
        setLoader(false);
      } else {
        setLoader(false);
        console.error(CONSTANTS.errorMessage.searchFailed, response.error);
      }
      setLoader(false);
    } catch (error) {
      setLoader(false);
      console.error(CONSTANTS.errorMessage.unexpectedError, error);
    }
  };

  const handleDownload = () => {
    setIsExportLoading(true);
    let selectedData = fetchedProductMonitor;
    const csvHeader =
      "Id,Name,Description,Date Created,Due Date,Total Records,Monitor Status,Created By\n";
    const csvContent = selectedData
      .map((item) => {
        return `"${item.monitor_id}","${item?.name}","${item.description}","${item.created_on}","${item.to_date}","${item.total_records}","${item.status}","${item.created_by}"`;
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
      }_MonitorList_${Utils.getCurrentDateAndTime()}.csv`
    );

    link.click();

    URL.revokeObjectURL(url);
    setIsExportLoading(false);
  };

  const handleEmailSend = async (tags: string[]) => {
    try {
      const payload = {
        expert_review_type: "Abstract",
        page: currentPage,
        per_page: perPage,
        count: false,
        emails: tags,
      };
      const res = await dispatch(SentMonitorEmailAsync(payload));
      if (SentMonitorEmailAsync.fulfilled.match(res)) {
        if (res.payload.status === 200) {
          Toast(systemMessage.SendMailSuccess, { type: "success" });
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
        }
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
      }
    } catch (error) {
      console.error("Error occurred during download:", error);
    }
  };

  return (
    <React.Fragment>
      <section className="mt-32 bg-white custom-box-shadow">
        <div className="flex justify-between">
          <div className="ml-2 mt-2 flex">
            <div>
              <input
                type="text"
                placeholder="Search by monitor name"
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
          </div>
          <div className="ml-2 justify-end mr-3 px-2 py-4 flex cursor-pointer">
            <div className="mt-1">
              <EmailSenderComponent
                handleSend={(tags: string[]) => {
                  handleEmailSend(tags);
                }}
                customClasses="right-8 mt-6"
              />
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
        </div>
        <div className="border-style"></div>
        <div className="overflow-style">
          <table className="w-full border border-collapse table-auto relative">
            <thead className="border-style text-14 text-sm text-left">
              <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                <th className="px-4 w-20 py-3 text-center hover-text-style">
                  ID
                </th>
                <th className="w-20">
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
                <th className="px-2 w-20 py-3 hover-text-style">Description</th>
                <th className="px-2 w-20 py-3 hover-text-style">
                  Date created
                </th>
                <th className="px-2 w-20 py-3">
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
                      <div className="absolute text-left top-14 w-[200px] bg-white border rounded shadow-lg">
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
                <th className="px-4 w-20 py-3 ml-8">
                  <div ref={recordsDropdownRef} className="relative">
                    <span
                      className="flex w-full -ml-4 px-4 py-4 hover-text-style items-center hover:bg-whiteGray cursor-pointer"
                      onClick={() =>
                        setRecordsDropdownOpen(!recordsDropdownOpen)
                      }
                    >
                      Total records{" "}
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
                      <div className="absolute top-14 text-left w-[190px] bg-white border rounded shadow-lg">
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
                <th className="py-2 w-20 text-center hover-text-style">
                  Monitor Status
                </th>
                <th className="py-2 w-32 text-center hover-text-style">
                  Citations
                </th>
                <th className="py-2 w-20 text-center hover-text-style">
                  Created By
                </th>
                <th className="px-4 w-20 py-3 text-center hover-text-style">
                  Export
                </th>
              </tr>
            </thead>
            <tbody className="text-14">
              {sortedData &&
                sortedData
                  ?.filter((item) =>
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item, index) => (
                    <tr
                      className="border-b text-left text-sm border-style"
                      key={index}
                    >
                      <td className="px-4 w-32 py-6">{item.monitor_id}</td>
                      <td className="px-8 w-32 py-6">
                        <div className="flex">
                          <div
                            className={`mt-1 ${searchQuery ? "font-bold" : ""}`}
                          >
                            {item["name"]}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 w-32 py-6 text-lightslategray">
                        {item.description}
                      </td>
                      <td className="px-4 w-20 py-2 text-lightslategray date-width">
                        {item?.created_on
                          ? item?.created_on.split("T")[0]
                          : "-"}
                      </td>
                      <td className="px-4 w-20 py-6 text-lightslategray date-width">
                        {item["to_date"]}
                      </td>
                      <td className="px-4 w-20 py-6 text-lightslategray text-left">
                        {item["total_records"]}
                      </td>
                      <td className="px-4 w-20 py-6 text-lightslategray text-left">
                        {item.status}
                      </td>
                      <td className="px-4 py-3 text-lightslategray">
                        <div className="justify-center items-center bg-gray-100">
                          <button
                            className={`bg-yellow ml-4 cursor-pointer w-30 text-white text-base font-archivo capitalize text-14 px-4 py-2 rounded font-light ${
                              item.filter_type === "PubMed Search"
                                ? "disabled-select"
                                : ""
                            }`}
                            onClick={() => {
                              setMonitorId(item.monitor_id);
                              setUploadModalOpen((prev: any) => ({
                                ...prev,
                                index,
                                isOpen: true,
                                monitorData: item,
                              }));
                            }}
                            disabled={item.filter_type === "PubMed Search"}
                          >
                            Upload
                          </button>

                          <p className="mt-2 ml-1 break-words text-center">
                            Citations
                          </p>
                        </div>
                        {formValues?.selectedFile &&
                          uploadModalOpen.index === index && (
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Image
                                src="/assets/icons/check.svg"
                                alt="add document"
                                width={25}
                                height={25}
                              />
                              <p className="m-2">
                                <span className="text-silver">
                                  File Uploaded
                                </span>
                              </p>
                              <div className="flex flex-wrap items-center">
                                <p className="m-2 text-md text-gray-100">
                                  {formValues.selectedFile.name}
                                </p>
                                <Image
                                  src="/assets/icons/cross-circle.svg"
                                  alt="check"
                                  width={25}
                                  height={25}
                                  className="ml-2"
                                  onClick={handleFileDelete}
                                />
                              </div>
                            </div>
                          )}
                      </td>
                      <td className="px-4 w-20 py-6 text-lightslategray text-left">
                        {item.created_by}
                      </td>
                      <td className="px-4 text-center w-20 py-6 relative ">
                        <div
                          ref={editRef}
                          className="relative"
                          onClick={() => {
                            recordsDownload(item.id, item.status, item.name);
                          }}
                        >
                          <Image
                            src="/assets/icons/download-black.svg"
                            alt="download icon"
                            width={15}
                            height={15}
                            className={`left-0 ml-2 top-0 mt-2 cursor-pointer`}
                          />
                          {/* <Image
                            src="/assets/icons/menu-dots-vertical.png"
                            alt="3 dots"
                            width={15}
                            height={15}
                            className="m-3 w-4"
                            onClick={() => {
                              setOpenModalIndex(index);
                              const newOpenModals = [...openModals];
                              newOpenModals[index] = openModals;
                              setOpenModals(newOpenModals);
                              setIsModalOpen(true);
                            }}
                          /> */}
                        </div>
                        {isModalOpen && (
                          <div>
                            {openModalIndex === index && openModals[index] && (
                              <div
                                className="absolute right-12 rounded-lg top-[2px] bg-white shadow-style"
                                style={{ zIndex: 10 }}
                              >
                                <div className="flex items-center px-4 py-2 space-x-2">
                                  <Image
                                    src="/assets/icons/trash(2).png"
                                    alt="trash"
                                    width={15}
                                    height={15}
                                    onClick={() => {}}
                                  />
                                  <div
                                    className="ml-4 cursor-pointer"
                                    onClick={() =>
                                      deleteItem(
                                        item.monitor_id as unknown as number,
                                        index
                                      )
                                    }
                                  >
                                    Delete
                                  </div>
                                </div>
                                <div className="border-bottom"></div>
                                <div className="flex items-center px-4 py-2 space-x-2">
                                  <Image
                                    src="/assets/icons/pencil.png"
                                    alt="pencil"
                                    width={15}
                                    height={15}
                                  />
                                  <div
                                    className="ml-4"
                                    onClick={() =>
                                      handleEdit(
                                        index,
                                        item.monitor_id as unknown as number
                                      )
                                    }
                                  >
                                    Edit
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
                    className="px-2 py-2 capitalize col-span-9 text-center"
                    colSpan={9}
                  >
                    {message}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={uploadModalOpen.isOpen}
          childElement={
            <UploadListModal
              isOpen={uploadModalOpen.isOpen}
              onClose={() =>
                setUploadModalOpen({
                  index: -1,
                  isOpen: false,
                  monitorData: {} as IItem,
                })
              }
              monitorData={uploadModalOpen.monitorData}
              onFileUpload={(status) => setLoader(status)}
            />
          }
        />
        {loader && <LoadingSpinner />}
      </section>
      {filterData.length > 0 && (
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

export default ListDrugMonitor;
