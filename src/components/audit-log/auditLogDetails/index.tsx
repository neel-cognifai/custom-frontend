"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Modal from "@/common/modal/model";
import MonitorDetails from "@/common/modal/monitorDetails";
import EmailSenderComponent from "@/common/EmailSender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import LoadingSpinner from "@/common/LoadingSpinner";
import Link from "next/link";
import { CONSTANTS, STATUS, defaultPerPage } from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  GetAuditLogItemAsync,
  GetAuditLogItemCountAsync,
  GetItemDownloadDataAsync,
  productMonitorState,
} from "../../drug-monitor/productMonitor.slice";
import { IDownload } from "../../drug-monitor/productMonitor.model";
import CustomPagination from "@/common/Pagination/CustomPagination";

export interface Item {
  "Monitor ID": string;
  "Monitor name": string;
  "Article id": number;
  "Article title": string;
  "From decision": string;
  "To decision": string;
  Comments: string;
  history: {
    Date: string;
    "Updated by": string;
    "From Decision": string;
    "To Decision": string;
  }[];
}
interface ITime {
  index: number;
  isOpen: boolean;
}

const AuditLog = (context: { params: any }) => {
  const [allData, setAllData] = useState<IDownload[]>([]);
  const [selectedRowsData, setSelectedRowsData] = useState<IDownload[]>([]);
  const [selectedHistory, setSelectedHistory] = useState<any[]>([]);
  const [rowCheckedState, setRowCheckedState] = useState<boolean[]>(
    new Array(allData.length).fill(false)
  );
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [selectedItems, setSelectedItems] = useState<IDownload | undefined>();
  const [formValues, setFormValues] = useState({
    selectedTeam: "Team Jupiter",
  });
  const [timeModalOpen, setTimeModalOpen] = useState<ITime>({
    index: -1,
    isOpen: false,
  });
  const dispatch = useAppDispatch();
  const [selectedDate, setSelectedDates] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { startDate, endDate } = selectedDate;
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const MonitorStatus = params?.status as string;
  const MonitorName = params?.monitor_name as string;
  const { getData, status, TotalAuditLog } =
    useAppSelector(productMonitorState);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);

  useEffect(() => {
    setIsLoading(true);
    const countPayload = {
      id: monitor_id,
      status: MonitorStatus,
    };
    dispatch(GetAuditLogItemCountAsync(countPayload));
    const payload = {
      id: monitor_id,
      status: MonitorStatus,
      pageNumber: 1,
      perPage: perPage,
    };
    dispatch(GetAuditLogItemAsync(payload));
  }, [monitor_id]);

  useEffect(() => {
    setIsLoading(true);
    if (status === STATUS.fulfilled) {
      setAllData(getData);
      setTotalRecords(TotalAuditLog);
    }
    setIsLoading(false);
  }, [getData, status, TotalAuditLog]);

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const handlePageChange = async (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);
    const payload = {
      pageNumber,
      perPage,
      id: monitor_id,
      status: MonitorStatus,
    };
    await dispatch(GetAuditLogItemAsync(payload));
    setIsLoading(false);
  };

  const handlePerPageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIsLoading(true);
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = {
      pageNumber: 1,
      perPage: newPerPage,
      id: monitor_id,
      status: MonitorStatus,
    };
    await dispatch(GetAuditLogItemAsync(payload));
    setIsLoading(false);
  };

  const handleCheckboxChange = (item: IDownload, rowIndex: number) => {
    setAllData([item]);
    const newCheckedState = [...rowCheckedState];
    newCheckedState[rowIndex] = !newCheckedState[rowIndex]; // Toggle the checked state for the specific row
    setRowCheckedState(newCheckedState);

    const isSelected = newCheckedState[rowIndex];

    if (isSelected) {
      setSelectedRowsData((prevSelectedRowsData) => [
        ...prevSelectedRowsData,
        item,
      ]);
    } else {
      setSelectedRowsData((prevSelectedRowsData) =>
        prevSelectedRowsData.filter(
          (selectedItem) => selectedItem.monitor_id !== item.monitor_id
        )
      );
    }
  };
  const filteredData = allData.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // const handleExportAllDataClick = () => {
  //   setIsExportLoading(true);
  //   if (allData.length === 0) {
  //     return;
  //   }
  //   const csvData = allData.map((item) => {
  //     const historyData = item.history
  //       .map(
  //         (historyItem) =>
  //           `"${historyItem["Date"]}", "${historyItem["Updated by"]}", "${historyItem["From Decision"]}", "${historyItem["To Decision"]}"`
  //       )
  //       .join("\n");

  //     return `"${item["Monitor ID"]}", "${item["Monitor name"]}", "${item["Article id"]}", "${item["Article title"]}", "${item["From decision"]}", "${item["Comments"]}", "${item["To decision"]}"\n${historyData}`;
  //   });

  //   const csvString = `data:text/csv;charset=utf-8,${csvData.join("\n\n")}`;

  //   const encodedUri = encodeURI(csvString);
  //   const link = document.createElement("a");
  //   link.setAttribute("href", encodedUri);
  //   link.setAttribute(
  //     "download",
  //     `exported_all_data_${Utils.getCurrentDateAndTime()}.csv`
  //   );
  //   document.body.appendChild(link);

  //   link.click();
  //   document.body.removeChild(link);
  //   setIsExportLoading(false);
  // };

  const resetFilters = () => {
    setSearchQuery("");
    setAllData(getData);
    setFormValues({
      selectedTeam: "Team Jupiter",
    });
  };

  const handleClick = (item: Item) => {
    setSelectedHistory(item.history);
  };
  const handleDateChange = (date: Date | null, dateType: string) => {
    console.log(date, dateType);
  };
  return (
    <React.Fragment>
      <div className="absolute top-[30px]">
        <div className="flex ml-2 text-14 items-center">
          <div className="mt-3">
            <Link
              href={CONSTANTS.ROUTING_PATHS.ListAuditLog}
              className="no-underline	"
            >
              <div className="flex">
                <div>
                  <Image
                    className="w-[20px]"
                    width={15}
                    height={15}
                    alt=""
                    src="/assets/icons/left-arrow.png"
                  />
                </div>
                <div className="text-14 text-black ml-2 capitalize">
                  <span className="no-underline">Back</span>
                </div>
              </div>
            </Link>
          </div>
          <div className="mt-2 ml-4 w-[50%]">
            <input
              type="text"
              placeholder="Search article title"
              className="w-[100%] text-black border-none text-14 search px-4 py-2"
              onChange={handleSearchInputChange}
            />
            <Image
              className="absolute cursor-pointer right-[12px] top-[20px] w-4 h-4 overflow-hidden"
              alt=""
              width={22}
              height={22}
              src="/assets/icons/search-5-1.svg"
            />
          </div>
        </div>
      </div>
      <div className="main bg-white mt-0 w-[100%] custom-box-shadow">
        <div className="divide-y-2">
          <div className="flex justify-end">
            {/* <div className="ml-4 p-2">
              <input
                type="text"
                placeholder="Search"
                onChange={handleSearchInputChange}
                className="w-[15%] h-[3%] absolute top-[125px] text-dimgray border border-gray rounded-md px-4 py-2"
              />
              <div className="absolute top-[138px]">
                <Image
                  src="/assets/icons/search-5-1.svg"
                  width={15}
                  height={15}
                  alt="search icon"
                  className="absolute left-[235px]"
                />
              </div>
            </div> */}
            {/* <div className="px-2 py-2 mt-2">
              <DatePicker
                selected={startDateRange}
                onChange={onChange}
                startDate={startDateRange}
                endDate={endDate}
                selectsRange
                inline
              />
            </div> */}
            <div className="flex float-right mt-2">
              <div className="mt-4 mr-2">
                <EmailSenderComponent customClasses="right-8" />
              </div>
              
              {isExportLoading && <LoadingSpinner text={"Downloading"} />}
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-x-autos">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-left">
                <tr className="font-Archivo capitalize text-sm bg-gray-50">
                  <th className="px-4 py-4 thead-style text-left">
                    Article id
                  </th>
                  <th className="px-2 py-4 thead-style text-left">
                    Article title
                  </th>
                  <th className="px-4 py-4 thead-style text-left">History</th>
                </tr>
              </thead>
              {filteredData.length === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan={3} className="px-3 py-6 text-center">
                      No records found
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {filteredData.map((item, index) => (
                    <tr
                      className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite"
                      key={index}
                    >
                      <td className="px-3 py-6">{item.article_id || "-"}</td>
                      <td className="px-3 py-6 text-black text-left">
                        {item.title || "-"}
                      </td>
                      <td className="px-6 py-6 text-black text-left">
                        <button
                          className="bg-transparent cursor-pointer"
                          onClick={() => {
                            setSelectedItems(item);
                            setTimeModalOpen((prev) => ({
                              ...prev,
                              index,
                              isOpen: true,
                            }));
                          }}
                        >
                          <Image
                            src="/assets/icons/time-past.png"
                            width={15}
                            height={15}
                            alt="search icon"
                            className="mr-4"
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
        </div>
        {isLoading && <LoadingSpinner />}
        {filteredData.length > 0 && (
          <CustomPagination
            currentPage={currentPage}
            perPage={perPage}
            totalRecords={Number(totalRecords)}
            handlePageChange={handlePageChange}
            handlePerPageChange={handlePerPageChange}
          />
        )}
        <Modal
          isOpen={timeModalOpen.isOpen}
          childElement={
            <MonitorDetails
              MonitorName={MonitorName}
              isOpen={timeModalOpen.isOpen}
              selectedItems={selectedItems!}
              onClose={() => setTimeModalOpen({ index: -1, isOpen: false })}
            />
          }
        />
      </div>
    </React.Fragment>
  );
};

export default AuditLog;
