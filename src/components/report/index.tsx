"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  STATUS,
  SelectReporting,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import EmailSenderComponent from "@/common/EmailSender";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { auditRepotdata } from "@/common/data";
import CardDataStats from "./widgets/CardDataStats";
import {
  faCircleCheck,
  faXmarkCircle,
  faUserCheck,
  faUserXmark,
  faFileLines,
  faFileExport,
  faAlignLeft,
} from "@fortawesome/free-solid-svg-icons";
import { Utils } from "../../../utils/utils";
import LoadingSpinner from "@/common/LoadingSpinner";
import { format } from "date-fns";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  DashboardDataAsync,
  GetAllCountReportAsync,
  GetAllReportAsync,
  SendEmailAsync,
  addReportAsync,
  getReportAsync,
  reportState,
} from "./report.slice";
import {
  IDashboardData,
  IGetReportAll,
  IGetReportSignedUrl,
  IReportResponse,
} from "./report.model";
import Toast from "@/common/Toast";
import e from "express";
import CustomPagination from "@/common/Pagination/CustomPagination";
interface Option {
  readonly label: string;
  readonly value: string;
}
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

const Report = () => {
  const dispatch = useAppDispatch();
  const editRef = useRef<HTMLDivElement>(null);
  const { loading, status, DashboardData, Report, GetReport, GetAllReport, TotalReport } =
    useAppSelector(reportState);
  const [isLoading, setIsLoading] = useState(false);
  const [dashboardData, setDashboardData] = useState<IDashboardData>();
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [selectedRowsData, setSelectedRowsData] = useState<Item[]>([]);
  const [allData, setAllData] = useState<Item[]>([]);
  const [rowCheckedState, setRowCheckedState] = useState<boolean[]>(
    new Array(auditRepotdata.length).fill(false)
  );
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [getReport, setGetReport] = useState<IReportResponse>();
  const [getReportUrl, setGetReportUrl] = useState<IGetReportSignedUrl>();
  const [selectedItems, setSelectedItems] = useState<Item>({
    "Monitor ID": "",
    "Monitor name": "",
    "Article id": 0,
    "Article title": "",
    "From decision": "",
    "To decision": "",
    Comments: "",
    history: [],
  });
  const [selectedDate, setSelectedDate] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });

  const [selectedReportDate, setSelectedReportDate] = useState<{
    startReportDate: Date | string;
    endReportDate: Date | string;
  }>({
    startReportDate: format(
      new Date(new Date().setDate(new Date().getDate() - 30)),
      "yyyy-MM-dd"
    ),
    endReportDate: format(new Date(), "yyyy-MM-dd"),
  });

  const { startDate, endDate } = selectedDate;
  const { startReportDate, endReportDate } = selectedReportDate;
  const [formValues, setFormValues] = useState({
    selectedTeam: "Team Jupiter",
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSubCategory, setSelectedSubCategory] = useState({
    selectedTeam: "",
  });
  const [timeModalOpen, setTimeModalOpen] = useState<ITime>({
    index: -1,
    isOpen: false,
  });

  const [selectedExportOption, setSelectedExportOption] = useState("pdf");
  const [startDateRange, setStartDateRange] = useState(new Date());
  const [endDateRange, setEndDateRange] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [reportData, setReportData] = useState<IGetReportAll[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDateRange(start);
    setEndDateRange(end);
  };
  const handleExportOptionChange = (option: string) => {
    setSelectedExportOption(option);
  };

  useEffect(() => {
    const payload = {
      from_date: format(selectedDate.startDate, "yyyy-MM-dd"),
      to_date: format(selectedDate.endDate, "yyyy-MM-dd"),
    };
    dispatch(DashboardDataAsync(payload));
  }, []);

  useEffect(() => {
    dispatch(GetAllCountReportAsync())
    const payload = {
      perPage: perPage,
      pageNumber: currentPage,
    };
    dispatch(GetAllReportAsync(payload));
  }, []);

  useEffect(() => {
    if (loading === STATUS.fulfilled) {
      setDashboardData(DashboardData);
      setTotalRecords(TotalReport);
    }
  }, [loading, DashboardData, TotalReport]);

  useEffect(() => {
    setGetReport(undefined);
    setGetReportUrl(undefined);
  }, [loading]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setGetReport(Report);
      setGetReportUrl(GetReport);
      setReportData(GetAllReport);
    }
  }, [status, GetReport, Report, GetAllReport]);

  const data = [
    {
      title: "Valid ICSR - Generative AI",
      total: dashboardData?.gen_ai_review_valid ?? 0,
      icon: faCircleCheck,
    },
    {
      title: "Invalid ICSR - Generative AI",
      total: dashboardData?.gen_ai_review_invalid ?? 0,
      icon: faXmarkCircle,
    },
    {
      title: "Valid ICSR - Expert Review",
      total: dashboardData?.expert_review_valid ?? 0,
      icon: faUserCheck,
    },
    {
      title: "Invalid ICSR - Expert Review",
      total: dashboardData?.expert_review_invalid ?? 0,
      icon: faUserXmark,
    },
    {
      title: "Full Text Search - Expert Review",
      total: dashboardData?.full_text_expert_review ?? 0,
      icon: faFileLines,
    },
    {
      title: "XML Generated E2B R3",
      total: dashboardData?.xml_generated_e2b ?? 0,
      icon: faFileExport,
    },
    {
      title: "Abstract Screened",
      total: dashboardData?.abstract_screened ?? 0,
      icon: faAlignLeft,
    },
  ];

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

  const resetFilters = () => {
    setSearchQuery("");
    setAllData(auditRepotdata);
    setSelectedTags([]);
    setGetReport(undefined);
    setGetReportUrl(undefined);
    setFormValues({
      selectedTeam: "Team Jupiter",
    });
    setSelectedCategory("");
  };
  const userIsMasterAdmin = true;

  const handleExportAllDataClick = () => {
    setIsExportLoading(true);
    if (allData.length === 0) {
      return;
    }
    const csvData = allData.map((item) => {
      const historyData = item.history
        .map(
          (historyItem) =>
            `"${historyItem["Date"]}", "${historyItem["Updated by"]}", "${historyItem["From Decision"]}", "${historyItem["To Decision"]}"`
        )
        .join("\n");

      return `"${item["Monitor ID"]}", "${item["Monitor name"]}", "${item["Article id"]}", "${item["Article title"]}", "${item["From decision"]}", "${item["Comments"]}", "${item["To decision"]}"\n${historyData}`;
    });

    const csvString = `data:text/csv;charset=utf-8,${csvData.join("\n\n")}`;

    const encodedUri = encodeURI(csvString);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `exported_all_data_${Utils.getCurrentDateAndTime()}.csv`
    );
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    setIsExportLoading(false);
  };

  const handleDateChange = async (date: Date | null, dateType: string) => {
    setIsLoading(true);
    let newSelectedDate = { ...selectedDate };
    if (dateType === "startDate") {
      newSelectedDate.startDate = date || new Date();
    } else if (dateType === "endDate") {
      newSelectedDate.endDate = date || new Date();
    }
    setSelectedDate(newSelectedDate);
    const payload = {
      from_date: format(newSelectedDate.startDate, "yyyy-MM-dd"),
      to_date: format(newSelectedDate.endDate, "yyyy-MM-dd"),
    };

    await dispatch(DashboardDataAsync(payload));
    if (selectedCategory) {
      await dispatch(getReportAsync(getReport!.data!.id));
    }
    setIsLoading(false);
  };

  const handleReportDateChange = async (
    date: string | null,
    dateType: string
  ) => {
    let newSelectedDate = { ...selectedReportDate };
    if (dateType === "startDate") {
      newSelectedDate.startReportDate = date
        ? typeof date === "string"
          ? date
          : new Date()
        : new Date();
    } else if (dateType === "endDate") {
      newSelectedDate.endReportDate = date
        ? typeof date === "string"
          ? date
          : new Date()
        : new Date();
    }
    setSelectedReportDate(newSelectedDate);
  };

  const handleCheckboxChange = (item: Item, rowIndex: number) => {
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
          (selectedItem) => selectedItem["Monitor ID"] !== item["Monitor ID"]
        )
      );
    }
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchQuery(event.target.value);
  };

  const filteredData = auditRepotdata.filter((item) =>
    item["Monitor name"].toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      const payload = {
        report_category: selectedCategory,
        from_date: startReportDate,
        to_date: endReportDate,
      };
      const response = await dispatch(addReportAsync(payload));
      if (addReportAsync.fulfilled.match(response)) {
        if (response.payload.status == 201) {
          // Toast(systemMessage.AddReportSuccess, { type: "success" });
          await dispatch(getReportAsync(response?.payload?.data?.id));
          setIsLoading(false);
        }
        setIsLoading(false);
      } else {
        Toast(systemMessage.Something_Wrong, { type: "error" });
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const handleDownload = async (e: any) => {
    try {
      setIsLoading(true);
      e.preventDefault();
      const anchor = document.createElement("a");
      anchor.href = getReportUrl?.url as string;
      anchor.download = getReportUrl?.url as string;
      anchor.click();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    const payload = { pageNumber, perPage };
    dispatch(GetAllReportAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const payload = { pageNumber: 1, perPage: newPerPage };
    dispatch(GetAllReportAsync(payload));
  };

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);
      const payload = {
        report_category: selectedCategory,
        from_date: startReportDate,
        to_date: endReportDate,
        emails: tags,
      };
      const res = await dispatch(SendEmailAsync(payload));
      if (SendEmailAsync.fulfilled.match(res)) {
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
      <div className="main bg-white mt-0 w-100 custom-box-shadow card-box">
        <div className="mt-2 p-2">
          <div className="divide-y-2">
            <div className="ml-5 mt-3 flex">
              <h3 className="mt-2 mr-5">Dashboard</h3>
              <DatePicker
                selected={startDate}
                onChange={(date: Date) => {
                  const formattedDate = format(date, "yyyy-MM-dd");
                  handleDateChange(new Date(formattedDate), "startDate");
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="From Date"
                className="w-full relative text-14 rounded-md"
                maxDate={endDate || new Date()}
                isClearable
              />
              <Image
                className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                alt=""
                width={10}
                height={10}
                src="/assets/icons/calendarday-1.svg"
              />
              <div className="ml-8 flex">
                <DatePicker
                  selected={endDate}
                  isClearable
                  onChange={(date: Date) => {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    handleDateChange(new Date(formattedDate), "endDate");
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  className="w-full relative text-14 rounded-md"
                  minDate={startDate}
                  maxDate={new Date()}
                />
                  <Image
                    className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                    alt=""
                    width={10}
                    height={10}
                    src="/assets/icons/calendarday-1.svg"
                  />
              </div>
            </div>
            <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
            <div className="flex">
              {/* <div className="px-2 py-2 mt-4">
                <DatePicker
                  selected={startDateRange}
                  onChange={onChange}
                  startDate={startDateRange}
                  endDate={endDate}
                  selectsRange
                  inline
                />
              </div> */}
              <div className="grid grid-cols-3 text-14 gap-4 md:grid-cols-5 pr-5 mb-2 ml-1">
                {data.map((item, index) => (
                  <CardDataStats
                    key={index}
                    title={item.title}
                    total={item.total}
                    icon={item.icon}
                  ></CardDataStats>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="main bg-white mt-4 w-[100%] custom-box-shadow">
        <div className="divide-y-2">
          <h3 className="ml-6 mt-5 pt-2">Report</h3>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <div className="flex">
            {/* <div className="ml-4 mt-4 p-2 relative">
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="w-60 h-5 text-14 text-dimgray border border-gray rounded-md"
              />
              <div className="absolute top-5 left-60">
                <Image
                  src="/assets/icons/search-5-1.svg"
                  width={15}
                  height={15}
                  alt="search icon"
                />
              </div>
            </div> */}
            {/* {userIsMasterAdmin && (
              <div className="ml-6 mt-2">
                <select
                  className="block text-dimgray text-14 mt-[16px] border cursor-pointer w-[255px] px-4 py-[9px] pr-8 text-sm leading-tight bg-white border-gray rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      selectedTeam: e.target.value,
                    })
                  }
                  value={formValues.selectedTeam}
                >
                  <option value={""}>Select Purpose</option>
                  {SelectPurpose.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            )} */}
            <div className="flex absolute right-5 mt-3">
              <div className="mt-4 mr-2">
                <EmailSenderComponent
                  handleSend={(tags: string[]) => {
                    handleEmailSend(tags);
                  }}
                  customClasses="right-8"
                  disabled={!selectedCategory}
                />
              </div>
              <div className="m-2">
                <button
                  className="rounded-md border bg-silver cursor-pointer border-gray text-sm font-medium font-archivo px-8 py-3"
                  onClick={resetFilters}
                >
                  Reset Filter
                </button>
              </div>
              <div className="relative m-2">
                <button
                  className={`rounded-md border ml-2 cursor-pointer border-gray text-sm font-medium font-archivo px-8 py-3 bg-yellow text-white text-14`}
                  onClick={handleExportAllDataClick}
                >
                  Export
                </button>
                <>
                  <div className="absolute cursor-pointer top-1 ml-2">
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
          <div className="w-[19%] flex relative ml-6 mt-6">
            <div>
              <select
                className="block text-dimgray text-14 border cursor-pointer w-[400px] px-4 py-[9px] pr-8 text-sm leading-tight bg-white border-gray rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setSelectedCategory(e.target.value)}
                value={selectedCategory}
              >
                <option value="">Select report category</option>
                {SelectReporting.map((item, index) => (
                  <option
                    title={item.description}
                    key={index}
                    value={item.category}
                  >
                    {item.category}
                  </option>
                ))}
              </select>
            </div>
            {/* <div>
              <select
                className="block text-dimgray ml-3 text-14 border cursor-pointer w-[255px] px-4 py-[9px] pr-8 text-sm leading-tight bg-white border-gray rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) =>
                  setSelectedCategory({
                    selectedTeam: e.target.value,
                  })
                }
                value={selectedCategory.selectedTeam}
              >
                <option value="">Select sub category</option>
                {SelectSubReporting.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="flex ml-3 w-72">
              <DatePicker
                selected={
                  typeof startReportDate === "string"
                    ? new Date(startReportDate)
                    : startReportDate
                }
                onChange={(date: Date | null) => {
                  if (date) {
                    const formattedDate = format(date, "yyyy-MM-dd");
                    handleReportDateChange(formattedDate, "startDate");
                  } else {
                    handleReportDateChange("", "startDate");
                  }
                }}
                dateFormat="dd/MM/yyyy"
                placeholderText="Start Date"
                className="w-32 relative text-14 rounded-md"
                maxDate={new Date(endReportDate) || new Date()}
                isClearable
              />
              <div className="ml-4">
                <DatePicker
                  selected={
                    typeof endReportDate === "string"
                      ? new Date(endReportDate)
                      : endReportDate
                  }
                  onChange={(date: Date | null) => {
                    if (date) {
                      const formattedDate = format(date, "yyyy-MM-dd");
                      handleReportDateChange(formattedDate, "endDate");
                    } else {
                      handleReportDateChange("", "endDate");
                    }
                  }}
                  dateFormat="dd/MM/yyyy"
                  placeholderText="End Date"
                  className="w-32 relative text-14 rounded-md"
                  minDate={new Date(startReportDate)}
                  maxDate={new Date()}
                  isClearable
                />
              </div>
              {/* <ExportOptions
                selectedOption={selectedExportOption}
                onChange={handleExportOptionChange}
              /> */}
              <div>
                <button
                  className={`button-style-export cursor-pointer ml-4 border-none px-8 py-3 text-white rounded-md
                  ${
                    !selectedCategory || !startReportDate || !endReportDate
                      ? "disabled-select"
                      : ""
                  }
                  `}
                  disabled={
                    !selectedCategory || !startReportDate || !endReportDate
                  }
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full  text-14 border border-collapse table-auto">
              <thead className="border-style text-left">
                <tr className="font-Archivo capitalize text-sm bg-gray-50">
                  {/* <th className="px-2 py-4 thead-style text-left">Purpose</th> */}
                  <th className="pl-6 px-2 py-6 w-60 thead-style text-left">
                    Report Category
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    Report id
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    User Name
                  </th>
                  <th className="px-2 py-4 thead-style text-center">Status</th>
                  {/* <th className="px-2 py-4 thead-style text-left">
                    Sub Category
                  </th> */}
                  <th className="px-2 py-4 thead-style text-center">
                    Start date
                  </th>
                  <th className="px-2 py-4 thead-style text-center">
                    End date
                  </th>
                  {/* <th className="px-2 py-4 thead-style text-left">
                    Report Type ( PDF / CSV)
                  </th> */}
                  <th className="ml-4 px-2 py-4 thead-style text-center">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(getReportUrl || getReport || {}).length ? (
                  <tr
                    className="border-b  text-left text-sm border-style hover:bg-ghostwhite"
                    key={1}
                  >
                    <td className="pl-6 px-3 py-6 text-left">
                      {selectedCategory}
                    </td>
                    <td className="px-3 py-6 text-center">
                      {getReport?.data?.report_id}
                    </td>
                    <td className="px-3 py-6 text-center">
                      {getReport?.data?.user_name}
                    </td>
                    <td className="px-3 py-6 text-center">
                      {getReport?.data?.status}
                    </td>
                    <td className="px-3 py-6 text-black text-center">
                      {getReport?.data?.from_date?.split("T")[0]}
                    </td>
                    <td className="px-3 py-6 text-black text-center">
                      {getReport?.data?.to_date?.split("T")[0]}
                    </td>
                    <td
                      className="px-3 py-6 text-black text-center "
                      onClick={(e) => handleDownload(e)}
                    >
                      <Image
                        src="/assets/icons/download-black.svg"
                        alt="download icon"
                        width={15}
                        height={15}
                        title="Download"
                        className="left-0 top-0 mt-2 cursor-pointer"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center">
                      No record found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="main bg-white mt-4 w-[100%] custom-box-shadow">
        <div className="divide-y-2">
          <h3 className="ml-6 mt-5 pt-2">Report List</h3>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full  text-14 border border-collapse table-auto">
              <thead className="border-style text-left">
                <tr className="font-Archivo capitalize text-sm bg-gray-50">
                  <th className="pl-6 w-60 px-2 py-6 thead-style text-left">
                    Report Category
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    Report id
                  </th>
                  <th className=" px-2 py-4 thead-style text-center">
                    User Name
                  </th>
                  <th className="px-2 py-4 thead-style text-center">Status</th>
                  <th className="px-2 py-4 thead-style text-center">
                    Start date
                  </th>
                  <th className="px-2 py-4 thead-style text-center">
                    End date
                  </th>
                  <th className="ml-4 px-2 py-4 thead-style text-center">
                    Link
                  </th>
                </tr>
              </thead>
              <tbody>
                {reportData?.length !== 0 ? (
                  reportData?.map((item, index) => (
                    <tr
                      className="border-b  text-left text-sm border-style hover:bg-ghostwhite"
                      key={1}
                    >
                      <td className="pl-6 px-3 py-6 text-left">
                       {item?.category || "-"}
                      </td>
                      <td className="px-3 py-6 text-center">
                        {item?.report_id || "-"}
                      </td>
                      <td className="px-3 py-6 text-center">
                        {item?.user_name || "-"}
                      </td>
                      <td className="px-3 py-6 text-center">
                        {item?.status || "-"}
                      </td>
                      <td className="px-3 py-6 text-black text-center">
                        {item?.from_date?.split("T")[0] || "-"}
                      </td>
                      <td className="px-3 py-6 text-black text-center">
                        {item?.to_date?.split("T")[0] || "-"}
                      </td>
                      <td
                        className="px-3 py-6 text-black text-center "
                      >
                        {"-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <>
                    <tr>
                      <td colSpan={6} className="px-3 py-6 text-center">
                        No record found
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {reportData?.length > 0 && (
        <CustomPagination
          currentPage={currentPage}
          perPage={perPage}
          totalRecords={Number(totalRecords)}
          handlePageChange={handlePageChange}
          handlePerPageChange={handlePerPageChange}
        />
        )} 
      </div>
      {isLoading && <LoadingSpinner />}
    </React.Fragment>
  );
};

export default Report;
