import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CONSTANTS,
  STATUS,
  StatusData,
  systemMessage,
} from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Modal from "@/common/modal/model";
import CreatableSelect from "react-select/creatable";
import Image from "next/image";
import EmailSenderComponent from "@/common/EmailSender";
import E2br2 from "@/common/modal/e2br2";
import UploadFileInTableModal from "@/common/modal/uploadFileInTableModal";
import AssignToTeamMember from "@/common/helper/AssignToTeamMember";
import {
  MonitorData,
  TeamMember,
} from "@/components/abstract-review/abstract.model";
import CustomPagination from "@/common/Pagination/CustomPagination";
import Toast from "@/common/Toast";
import {
  AbstractReviewDataState,
  GetTeamUserAsync,
  PreviewURlAsync,
} from "@/components/abstract-review/abstract-review.slice";
import {
  AdvanceMonitorDetailsCountsAsync,
  AdvanceReviewDataState,
  AdvanceReviewMonitorDetailAsync,
  AdvanceReviewMonitorIdAsync,
  AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync,
  AssignToAsync,
  ReviewQcSendMailAsync,
} from "../../advance-review.slice";
import { LocalStorage } from "../../../../../utils/localstorage";
import { SortOption } from "../../../../../utils/sortingUtils";
import LoadingSpinner from "@/common/LoadingSpinner";
import { Utils } from "../../../../../utils/utils";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface IData {
  ID: number;
  Title: string;
  status: string | null;
  Decision: any[];
  monitor_id: string;
  start_date: string;
  end_date: string;
  tagging_ai_response_enitity: string[];
  assign_to: string;
  updated_by: string | null;
  Link: string;
}

interface IUploadFile {
  index: number;
  isOpen: boolean;
}

interface IProps {
  monitor_id: string;
  label: string;
}

const InValidICSR: React.FC<IProps> = ({ monitor_id, label }) => {
  // state
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openAdd, setOPenAdd] = useState(false);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<MonitorData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [value, setValue] = useState<Option | null>(null);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState({
    selectedFile: null as File | null,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState<IUploadFile>({
    index: -1,
    isOpen: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(100);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");
  const [updateByOptions, setUpdateByOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const { status, teamUsers, monitorDetail } = useAppSelector(
    AbstractReviewDataState
  );
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MonitorData[]>([]);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [selectedSamplingPercentage, setSelectedSamplingPercentage] =
    useState<number>(0);
  const [fetchAdvanceReviewMonitor, setFetchAdvanceReviewMonitor] = useState<
    MonitorData[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);

  const { advanceReviewMonitor, AdvanceReviewMonitorInValidICSRTotalRecord } =
    useAppSelector(AdvanceReviewDataState);

  useEffect(() => {
    setIsLoading(true);
    const payload = {
      monitor_id,
      pageNumber: 1,
      perPage: 100,
      label,
    };
    dispatch(AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync(monitor_id));
    dispatch(AdvanceReviewMonitorIdAsync(payload));
    setIsLoading(false);
  }, [monitor_id]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setFetchAdvanceReviewMonitor(advanceReviewMonitor);
      setTotalRecords(AdvanceReviewMonitorInValidICSRTotalRecord);
    } else {
      setFetchAdvanceReviewMonitor([]);
    }
  }, [
    advanceReviewMonitor,
    status,
    monitorDetail,
    AdvanceReviewMonitorInValidICSRTotalRecord,
  ]);

  const filterDataRandomly = (data: MonitorData[], percentage: number) => {
    const totalRecords = data.length;
    const numberOfRecordsToShow = Math.ceil((percentage / 100) * totalRecords);
    const shuffledData = [...data]?.sort(() => Math.random() - 0.5);
    return shuffledData.slice(0, numberOfRecordsToShow);
  };

  useEffect(() => {
    if (selectedSamplingPercentage > 0) {
      const sampledData = filterDataRandomly(
        fetchAdvanceReviewMonitor,
        selectedSamplingPercentage
      );
      setFilteredData(sampledData);
    } else {
      setFilteredData(fetchAdvanceReviewMonitor);
    }
  }, [selectedSamplingPercentage]);

  const handleSamplingPercentageChange = (percentage: number) => {
    setSelectedSamplingPercentage(percentage);
  };

  const samplingPercentageOptions = [10, 20, 30, 40, 50];

  useEffect(() => {
    if (monitorDetail.abstract_team_id) {
      dispatch(GetTeamUserAsync(monitorDetail.abstract_team_id));
    }
  }, [monitorDetail.abstract_team_id]);

  useEffect(() => {
    const mappedUpdatedByOptions = teamUsers.map((cat: TeamMember) => ({
      label: cat.user_name,
      value: cat.id,
    }));
    setUpdateByOptions(mappedUpdatedByOptions);
  }, [teamUsers]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectAllChecked(false);
    setSelectedItems([]);
    const payload = { monitor_id, pageNumber, perPage, label };
    dispatch(AdvanceReviewMonitorIdAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setSelectAllChecked(false);
    setSelectedItems([]);
    setCurrentPage(1);
    const payload = { monitor_id, pageNumber: 1, perPage: newPerPage, label };
    dispatch(AdvanceReviewMonitorIdAsync(payload));
  };

  useEffect(() => {
    if (fetchAdvanceReviewMonitor.length) {
      setFilteredData(fetchAdvanceReviewMonitor);
      setMessage("");
    } else {
      setFilteredData([]);
      setMessage(systemMessage.not_found);
    }
  }, [fetchAdvanceReviewMonitor]);

  useEffect(() => {
    setSearchQuery("");
    setFilteredData(fetchAdvanceReviewMonitor);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
    setSelectAllChecked(false);
    setSelectedStatusValue("");
    setSelectedSamplingPercentage(0);
  }, [fetchAdvanceReviewMonitor]);

  //option declare
  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });
  const defaultOptions = [
    createOption("Suspected Adverse Event  (AE)"),
    createOption("Suspected Case"),
    createOption("Animal/In-Vitro"),
    createOption("Pregnancy/fetus/foetus"),
    createOption("Elderly"),
    createOption("Pediatric"),
    createOption("Branding"),
    createOption("Patient"),
    createOption("Abuse/Drug misuse/drug dependence"),
    createOption("Occupational exposure(OC exposure)"),
    createOption("Medication error"),
    createOption("Lack of efficacy"),
    createOption("Overdose"),
    createOption("Drug interaction"),
    // createOption("Important medical event(IME)"),
    createOption("Off label"),
  ];

  const GenerativeAIAssistedDecisionOption = [
    createOption("Invalid ICSR"),
    createOption("Valid ICSR"),
    createOption("ICSR Full Text Required"),
  ];

  const CausalityAssessmentOption = [
    createOption("Certain"),
    createOption("Possible"),
    createOption("Probable/Likely"),
    createOption("Unlikely"),
    createOption("Conditional/Unclassified"),
    createOption("Unassessable/Unclassifiable"),
  ];

  const AssignToOptions = [
    createOption("Arlene McCoy"),
    createOption("Jerome Bell"),
    createOption("Darrell Steward"),
    createOption("Devon Lane"),
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setFilteredData(fetchAdvanceReviewMonitor);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedStatusValue("");
    setSelectedUpdatedBy([]);
    setSelectAllChecked(false);
    setSelectedItems([]);
    setSelectedSamplingPercentage(0);
  };

  const handleCreate = (inputValue: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const newOption = createOption(inputValue);
      setIsLoading(false);
      // setOptions((prev) => [...prev, newOption]);
      setValue(newOption);
    }, 1000);
  };
  const handelUploadFile = (selectFile: IUploadFile, index: number) => {
    setUploadModalOpen(selectFile);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleRowSelection = (index: number) => {
    LocalStorage.setItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.RecordIndex,
      JSON.stringify(index)
    );
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof MonitorData;
    direction: "ascending" | "descending" | "";
  }>({
    key: "id",
    direction: "",
  });

  const handleCheckboxChange = (item: MonitorData, checked: boolean) => {
    let updatedSelectedItems;
    if (checked) {
      updatedSelectedItems = [...selectedItems, item];
    } else {
      updatedSelectedItems = selectedItems.filter(
        (selectedItem) => selectedItem !== item
      );
    }
    setSelectedItems(updatedSelectedItems);
    setSelectAllChecked(updatedSelectedItems.length === filteredData.length);
  };

  const handleSelectAllChange = (isCheck: boolean) => {
    setSelectAllChecked(isCheck);
    const updatedSelectedItems = isCheck ? filteredData : [];
    setSelectedItems(updatedSelectedItems);
  };

  const handleFileDelete = () => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedFile: null,
    }));
    setUploadModalOpen({ index: -1, isOpen: false });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    let nameA = "";
    let nameB = "";

    if (typeof a[sortConfig.key] === "string") {
      nameA = a[sortConfig.key] as string;
    } else if (typeof a[sortConfig.key] === "number") {
      nameA = a[sortConfig.key].toString();
    }

    if (typeof b[sortConfig.key] === "string") {
      nameB = b[sortConfig.key] as string;
    } else if (typeof b[sortConfig.key] === "number") {
      nameB = b[sortConfig.key].toString();
    }

    if (sortConfig.direction === "ascending") {
      return nameA > nameB ? 1 : -1;
    } else {
      return nameA < nameB ? 1 : -1;
    }
  });

  const handleStatusTagSelect = (value: string) => {
    if (value) {
      const filteredData = fetchAdvanceReviewMonitor?.filter(
        (item) => item.status === value
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(fetchAdvanceReviewMonitor);
    }
  };

  const handleUpdatedByTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAdvanceReviewMonitor
        : fetchAdvanceReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.assignee?.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleSearch = (event: { target: { value: any } }) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handelOpen = () => {
    setOPenAdd(true);
  };

  function handleClose() {
    setOPenAdd(false);
  }
  const userIsMasterAdmin = true;

  const handleClick = (item: MonitorData) => {
    /*const validICSRData = responseData.filter(
      (data) => (data.status = "Valid ICSR")
    );
    const InvalidICSRData = responseData.filter(
      (data) => (data.status = "Invalid ICSR")
    );
    if (validICSRData && InvalidICSRData) {
    }*/
    setIsLoading(true);
    router.push(
      `${CONSTANTS.ROUTING_PATHS.advancedReview3}/${monitor_id}/${item.id}`
    );
  };

  const handleLink = async (item: MonitorData) => {
    try {
      setIsLoading(true);
      if (item.search_result_id) {
        const response = await dispatch(PreviewURlAsync(item.search_result_id));
        if (PreviewURlAsync.fulfilled.match(response)) {
          if (response.payload.status === 400) {
            setIsLoading(false);
            Toast(systemMessage.FullTextLinkNotAvailable, { type: "error" });
            return;
          } else {
            router.push(
              `${CONSTANTS.ROUTING_PATHS.PDFReaderFromTable}/${monitor_id}`
            );
          }
        }
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleAssign = async (selectedTeamMember: string) => {
    const id = selectedItems.map((item, index) => {
      return item.id;
    });
    try {
      const payload = {
        expert_review_ids: id,
        user_id: selectedTeamMember,
      };
      const response = await dispatch(AssignToAsync(payload));
      if (AssignToAsync.fulfilled.match(response)) {
        Toast(systemMessage.AssignSuccessFully, { type: "success" });
      }
      const paginationPayload = {
        monitor_id,
        pageNumber: 1,
        perPage,
        label,
      };
      await dispatch(AdvanceReviewMonitorIdAsync(paginationPayload));
      await dispatch(AdvanceMonitorDetailsCountsAsync(monitor_id as string));
      await dispatch(AdvanceReviewMonitorDetailAsync(monitor_id as string));
    } catch (error: unknown) {
      console.error("Error in Assign:", error);
    }
  };

  useEffect(() => {
    LocalStorage.setItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.DATA_STORE,
      JSON.stringify(sortedData)
    );
  }, [sortedData]);

  const handleDownload = () => {
    setIsExportLoading(true);
    let selectedData = sortedData;
    const csvHeader =
      "Id,Title,Published On,Medications,Designated Medical Event,Literature Source,Status,Decision,Assign To,Updated By\n";
    const csvContent = selectedData
      .map((item) => {
        const LiteratureSource = item?.filter_type || "-";
        const DesignatedMedicalEvent =
          item?.designated_medical_events.toString() || "-";
        const medications = item?.ai_tags?.Medications
          ? item?.ai_tags?.Medications?.flatMap((medication) =>
              medication?.entity?.map((entity) => entity)
            ).join(", ")
          : "-";
        return `"${item?.article_id}","${item?.title}","${
          item?.updated_on || "-"
        }","${medications}",${DesignatedMedicalEvent},${LiteratureSource},"${
          item?.status || "-"
        }","${item?.ai_decision || "-"}","${item?.assignee || "-"}","${
          item?.modified_by || "-"
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
      `${
        monitorDetail.name
      }_QcInValidICSRList_${Utils.getCurrentDateAndTime()}.csv`
    );

    link.click();

    URL.revokeObjectURL(url);
    setIsExportLoading(false);
  };

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);
      const payload = {
        emails: tags,
        col: "abstract_review_decision",
        value: label,
        monitor_id: monitor_id,
        page: currentPage,
        per_page: perPage,
        count: false,
      };
      const res = await dispatch(ReviewQcSendMailAsync(payload));
      if (ReviewQcSendMailAsync.fulfilled.match(res)) {
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
        <div className="divide-y-2">
          <div className="flex relative">
            <div className="relative">
              <div className="ml-2 mt-2 text-14 flex">
                <div>
                  <input
                    type="text"
                    placeholder="Search by title"
                    onChange={handleSearch}
                    className="w-[200px] h-[22px] rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
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
            </div>
            {label === "Invalid ICSR" && (
              <div className="w-[15%] relative ml-6 mt-3">
                <select
                  className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) => {
                    const percentage = parseInt(e.target.value);
                    handleSamplingPercentageChange(percentage);
                  }}
                  value={selectedSamplingPercentage}
                >
                  <option className="text-14" value={0}>
                    Random Sampling
                  </option>
                  {samplingPercentageOptions.map((percentage) => (
                    <option key={percentage} value={percentage}>
                      {percentage}%
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="w-[18%] relative text-14 ml-6 mt-2">
              <CreatableSelect
                placeholder="Filter by assign"
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => {
                  setSelectedUpdatedBy(newValue as Option[]);
                  handleUpdatedByTagSelect(newValue as Option[]);
                }}
                options={updateByOptions}
                isMulti
                value={selectedUpdatedBy}
              />
            </div>
            <div className="w-[20%] relative text-14 ml-2 mt-3">
              <select
                className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSelectedStatusValue(e.target.value);
                  handleStatusTagSelect(e.target.value);
                }}
                value={selectedStatusValue}
              >
                <option value={""}>Filter By Status</option>
                {StatusData?.map((name, index) => (
                  <option key={index} value={name.value}>
                    {name.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="ml-2 mt-3">
              <button
                className="text-12 bg-gray border-none rounded-md cursor-pointer px-8 py-3"
                onClick={resetFilters}
              >
                Reset Filter
              </button>
            </div>
          </div>
          <div className="flex mt-3 justify-between text-14">
            <div className="flex w-full">
              {userIsMasterAdmin && (
                <AssignToTeamMember onAssign={handleAssign} />
              )}
            </div>
            <div className="flex mr-4">
              <div className="mt-2 ml-2 border-style">
              <EmailSenderComponent
                  handleSend={(tags: string[]) => {
                    handleEmailSend(tags);
                  }}
                  customClasses="right-8"
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
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
        <div className="overflow-style">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-sm text-left">
                <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                  <th className="cursor-pointer w-12">
                    <input
                      type="checkbox"
                      checked={selectAllChecked}
                      className="border cursor-pointer ml-4 border-black text-violet bg-white-900 rounded-md"
                      onChange={(event) => {
                        const { checked } = event.target;
                        handleSelectAllChange(checked);
                      }}
                    />
                  </th>
                  <th className="px-8 w-12 py-2 hover-text-style">ID</th>
                  <th className="py-2 w-40 text-right">
                    <div className="relative">
                      <span
                        className="flex hover-text-style text-right items-end hover:bg-whiteGray cursor-pointer px-6 py-2"
                      >
                        Title{" "}
                      </span>
                    </div>
                  </th>
                  <th className="px-2 w-40 py-4 text-center hover-text-style">
                    Medications
                  </th>
                  <th className="px-2 w-40 py-4 text-center hover-text-style">
                    Designated Medical Events
                  </th>
                  <th className="px-2 w-20 py-4 text-left hover-text-style">
                    Article Published Country
                  </th>
                  <th className="px-2 w-20 py-2 text-left hover-text-style">
                    Status
                  </th>
                  <th className="px-2 w-20 py-2 text-left hover-text-style">
                    Decision
                  </th>
                  <th className="px-2 w-20 py-4 text-left hover-text-style">
                    Assign To
                  </th>
                  <th className="px-2 w-20 py-4 text-left hover-text-style">
                    Updated By
                  </th>
                  {/* <th className="px-2 py-2 text-center hover-text-style">
                    Attachments
                  </th> */}
                  <th className="px-2 w-20 py-2 text-center hover-text-style">
                    Processed Fulltext Links
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData &&
                  sortedData
                    .filter((item) =>
                      item.title
                        ? item.title.toLowerCase().includes(searchQuery.toLowerCase())
                        : "".includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite"
                        key={index}
                        onClick={() => {
                          toggleRowSelection(index);
                        }}
                      >
                        <td className="cursor-pointer">
                          <div>
                            <input
                              disabled={item.status === "Completed"}
                              type="checkbox"
                              checked={selectedItems.includes(item)}
                              onChange={(event) => {
                                const { checked } = event.target;
                                handleCheckboxChange(item, checked);
                              }}
                              className={`${
                                item.status === "Completed"
                                  ? "disabled-select"
                                  : ""
                              } border cursor-pointer ml-4 border-black text-violet bg-white-900 rounded-md`}
                            />
                          </div>
                        </td>
                        <td className="px-2 items-center">
                          <div className="mt-1">
                            {item?.article_id ? item?.article_id : "-"}
                          </div>
                        </td>
                        <td
                          className="w-40 py-4 cursor-pointer break-words text-left"
                          onClick={() => {
                            handleClick(item);
                          }}
                        >
                          <div className="flex relative">
                            <div className="relative">
                              {item.title ? item.title : "-"}
                            </div>
                          </div>
                          <div className="flex">
                            <div className="mt-2 table-date-font text-dimgray">
                              Published on:{" "}
                              {item?.updated_on
                                ? item?.updated_on.split("T")[0]
                                : "-"}
                            </div>
                            <div className="w-[55px] ml-2">
                              {/* {item.new && (
                            <div className="bg-violet  text-white rounded-2xl py-1 px-3 items-center">
                              new
                            </div>
                          )} */}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 w-40 text-dimgray text-center capitalize">
                          <>
                            {item?.ai_tags?.Medications ? (
                              item.ai_tags.Medications.map(
                                (medication, index: number) => {
                                  const entitiesToShow = medication.entity
                                    .filter((entity) => entity.length > 3)
                                    .slice(0, 5);
                                  return entitiesToShow.length > 0 ? (
                                    <div key={index}>
                                      {entitiesToShow.map(
                                        (entity, entityIndex) => (
                                          <span
                                            key={entityIndex}
                                            className="medications-selected mt-2 medications-tagging ml-1 cursor-pointer"
                                          >
                                            {entity}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  ) : (
                                    <div key={index} className={`text-center`}>
                                      {"-"}
                                    </div>
                                  );
                                }
                              )
                            ) : (
                              <div className={`text-center`}>{"-"}</div>
                            )}
                          </>
                        </td>
                        <td className="w-40">
                          <>
                        {item?.designated_medical_events.length ? (
                              item.designated_medical_events.map(
                                (dme, index: number) => {
                                  return  (
                                    <div key={index}>
                                          
                                          <span
                                            key={index}
                                            className="designated-medical-event-selected mt-2 medications-tagging text-center ml-1 cursor-pointer"
                                          >
                                          {dme}
                                          </span>
                                        
                                     
                                    </div>
                                  )
                                }
                              )
                            ) : (
                              <div className={`text-center`}>{"-"}</div>
                            )}
                          </>
                        </td>
                        <td
                          className="text-lightslategray w-20 text-center"
                          onClick={() => {
                            handleClick(item);
                            toggleRowSelection(index);
                          }}
                        >
                          {item?.country ? item.country : '-'}
                        </td>
                        <td
                          className="text-lightslategray w-20 text-left"
                          onClick={() => {
                            handleClick(item);
                            toggleRowSelection(index);
                          }}
                        >
                          {item.status}
                        </td>
                        <td
                          className="pl-3 text-lightslategray w-20 text-left"
                          onClick={() => {
                            handleClick(item);
                            toggleRowSelection(index);
                          }}
                        >
                          {item.expert_decision}
                          {/* {item.Decision?.map((item, index) => (
                        <div key={index} className="mt-2 text-violet">
                          {item}
                        </div>
                      ))} */}
                        </td>
                        <td
                          className="p-3 text-black capitalize w-20 text-left"
                          onClick={() => {
                            handleClick(item);
                          }}
                        >
                          {item?.assignee?.indexOf("@") !== -1
                            ? item?.assignee?.substring(
                                0,
                                item?.assignee?.indexOf("@")
                              )
                            : item?.assignee}
                        </td>
                        <td
                          className="p-3 text-black capitalize w-20 text-left"
                          onClick={() => {
                            handleClick(item);
                          }}
                        >
                          {item.modified_by}
                        </td>
                        {/* <td className="pr-4 py-3 text-lightslategray">
                        <div className="justify-center items-center bg-gray-100">
                          <button
                            className="bg-yellow ml-16 cursor-pointer w-30 text-white text-base font-archivo capitalize  px-4 py-2 rounded font-medium"
                            onClick={() => {
                              setUploadModalOpen((prev) => ({
                                ...prev,
                                index,
                                isOpen: true,
                              }));
                            }}
                          >
                            Upload
                          </button>
                          <p className="mt-2 ml-8 w-[140px] break-words text-center">
                            full text document PDF file
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
                      </td> */}
                        <td className="py-3 text-center w-20 text-lightslategray">
                          <div
                            className="ml-3 mt-4 cursor-pointer"
                            onClick={() => handleLink(item)}
                          >
                            <Image
                              alt="link"
                              src="/assets/icons/linkicon.png"
                              width={20}
                              height={20}
                              title="preview"
                            />
                          </div>
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
        </div>
        <Modal
          isOpen={openAdd}
          childElement={
            <E2br2
              isOpen={false}
              handelClose={() => {
                handleClose();
              }}
            />
          }
        />
        <Modal
          isOpen={uploadModalOpen.isOpen}
          childElement={
            <UploadFileInTableModal
              isOpen={uploadModalOpen.isOpen}
              onClose={() => setUploadModalOpen({ index: -1, isOpen: false })}
              onFileUpload={(file) =>
                setFormValues({
                  ...formValues,
                  selectedFile: file,
                })
              }
            />
          }
        />
      </div>
      {isLoading && <LoadingSpinner />}
      {fetchAdvanceReviewMonitor?.length > 0 && (
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

export default InValidICSR;
