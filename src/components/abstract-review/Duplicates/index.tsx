import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CONSTANTS,
  ExpertDecision,
  STATUS,
  StatusData,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import CreatableSelect from "react-select/creatable";
import EmailSenderComponent from "@/common/EmailSender";
import AssignToTeamMember from "@/common/helper/AssignToTeamMember";
import LoadingSpinner from "@/common/LoadingSpinner";
import Toast from "@/common/Toast";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { MonitorData, TeamMember } from "../abstract.model";
import {
  AbstractMonitorDetailsAsync,
  AbstractMonitorDetailsCountsAsync,
  AbstractReviewDataState,
  AbstractReviewMonitorDuplicateTotalRecordIdAsync,
  AbstractReviewMonitorIdAsync,
  AssignToAsync,
  GetTeamUserAsync,
  ReviewAbstractSendMailAsync,
} from "../abstract-review.slice";
import { LocalStorage } from "../../../../utils/localstorage";
import { AbstractReviewAsync } from "../inQueue/selectedItemsSlice";
import { SortOption } from "../../../../utils/sortingUtils";
import { Utils } from "../../../../utils/utils";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface IProps {
  monitor_id: string;
  label: string;
}

const Duplicates: React.FC<IProps> = ({ monitor_id, label }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isBulkUpdateDisabled, setIsBulkUpdateDisabled] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<MonitorData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [updateByOptions, setUpdateByOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [generativeAIAssistedDecision, setGenerativeAIAssistedDecision] =
    useState<Option[]>([]);
  const [causalityAssessment, setCausalityAssessment] = useState<Option[]>([]);
  const [selectedStatusValue, setSelectedStatusValue] = useState<string>("");
  const [selectedExpertDecisionValue, setSelectedExpertDecisionValue] =
    useState<string>("");
  const [message, setMessage] = useState("");
  const dispatch = useAppDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [selectedItems, setSelectedItems] = useState<MonitorData[]>([]);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [selectedTagBy, setSelectedTagBy] = useState<Option[]>([]);
  const [fetchAbstractReviewMonitor, setFetchAbstractReviewMonitor] = useState<
    MonitorData[]
  >([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const {
    status,
    teamUsers,
    abstractReviewMontior,
    monitorDetail,
    AbstractReviewMonitorDuplicatesTotalRecord,
  } = useAppSelector(AbstractReviewDataState);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setFetchAbstractReviewMonitor(abstractReviewMontior);
      setTotalRecords(AbstractReviewMonitorDuplicatesTotalRecord);
    } else {
      setFetchAbstractReviewMonitor([]);
    }
  }, [
    abstractReviewMontior,
    ,
    status,
    monitorDetail,
    AbstractReviewMonitorDuplicatesTotalRecord,
  ]);

  useEffect(() => {
    setIsLoading(true);
    const payload = {
      monitor_id,
      pageNumber: 1,
      perPage: defaultPerPage,
      label: label,
    };
    dispatch(AbstractReviewMonitorIdAsync(payload));
    dispatch(AbstractReviewMonitorDuplicateTotalRecordIdAsync(monitor_id));
    setIsLoading(false);
  }, [monitor_id]);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    setSelectAllChecked(false);
    setSelectedItems([]);
    const payload = { monitor_id, pageNumber, perPage, label };
    dispatch(AbstractReviewMonitorIdAsync(payload));
  };

  const handlePerPageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    setSelectAllChecked(false);
    setSelectedItems([]);
    const payload = { monitor_id, pageNumber: 1, perPage: newPerPage, label };
    dispatch(AbstractReviewMonitorIdAsync(payload));
  };

  useEffect(() => {
    setSearchQuery("");
    setFilteredData(fetchAbstractReviewMonitor);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
    setSelectedStatusValue("");
    setSelectAllChecked(false);
    setSelectedExpertDecisionValue("");
    setCausalityAssessment([]);
    setSelectedTagBy([]);
  }, [fetchAbstractReviewMonitor]);

  useEffect(() => {
    setIsLoading(true);
    if (fetchAbstractReviewMonitor.length) {
      setFilteredData(fetchAbstractReviewMonitor);
      setMessage("");
      setIsLoading(false);
    } else {
      setFilteredData([]);
      setIsLoading(false);
      setMessage(systemMessage.not_found);
    }
  }, [fetchAbstractReviewMonitor]);

  const createOption = (label: string) => ({
    label,
    value: label.toLowerCase().replace(/\W/g, ""),
  });

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

  const handleUpdateByChange = (newValue: any) => {
    setSelectedUpdatedBy(newValue as Option[]);
    handleUpdatedByTagSelect(newValue as Option[]);
  };

  const defaultOptions = [
    createOption("Suspected Adverse Event(AE)"),
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

  const CausalityAssessmentOption = [
    createOption("Certain"),
    createOption("Possible"),
    createOption("Probable/Likely"),
    createOption("Unlikely"),
    createOption("Conditional/Unclassified"),
    createOption("Unassessable/Unclassifiable"),
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setFilteredData(fetchAbstractReviewMonitor);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
    setSelectedStatusValue("");
    setSelectedExpertDecisionValue("");
    setSelectAllChecked(false);
    setSelectedTagBy([]);
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
    const updatedSelectedItems = isCheck ? filteredData.filter((item) => item.status !== "Completed") : [];
    setSelectedItems(updatedSelectedItems);
  };

  const handleBulkUpdate = () => {
    if(selectedItems.length === 0) {
      Toast(systemMessage.PleaseSelectValidRecord, {type: "error"});
      return
    }
    setIsLoading(true)
    dispatch(AbstractReviewAsync(selectedItems as unknown as MonitorData));
    router.push(CONSTANTS.ROUTING_PATHS.AbstractReview4);
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

  const handleTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              Object.keys(item?.tags)
                .map((tag) => tag.toLowerCase())
                .includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleUpdatedByTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.assignee?.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleGenerativeAIAssistedDecisionTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.ai_decision.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleCausalityAssessmentTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? fetchAbstractReviewMonitor
        : fetchAbstractReviewMonitor?.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.causality_decision.toLowerCase().includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };
  const handleStatusTagSelect = (value: string) => {
    if (value) {
      const filteredData = fetchAbstractReviewMonitor?.filter(
        (item) => item.status === value
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(fetchAbstractReviewMonitor);
    }
  };
  const handleExpertDecisionTagSelect = (value: string) => {
    if (value) {
      const filteredData = fetchAbstractReviewMonitor?.filter(
        (item) => item.expert_decision === value
      );
      setFilteredData(filteredData);
    } else {
      setFilteredData(fetchAbstractReviewMonitor);
    }
  };

  const userIsMasterAdmin = true;

  const handleSearch = (event: { target: { value: string } }) => {
    const query = event.target.value;
    setSearchQuery(query);
  };
  const handleClick = async (item: MonitorData) => {
    setIsLoading(true);
    router.push(
      `${CONSTANTS.ROUTING_PATHS.AbstractReview3}/${monitor_id}/${item.id}`
    );
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
      await dispatch(AbstractReviewMonitorIdAsync(paginationPayload));
      await dispatch(AbstractMonitorDetailsCountsAsync(monitor_id));
      await dispatch(AbstractMonitorDetailsAsync(monitor_id));
    } catch (error: unknown) {
      console.error("Error in Assign:", error);
    }
  };

  const getClass = (tag: string) => {
    let className = "";
    switch (tag) {
      case "Animal/In-Vitro":
        className = "animal-case-style";
        break;
      case "Pregnancy/fetus/foetus":
        className = "pregnancy-case-style";
        break;
      case "Elderly":
        className = "elderly-style";
        break;
      case "Pediatric":
        className = "pediatric-style";
        break;
      case "Suspected Adverse Event(AE)":
        className = "suspected-adverse-style";
        break;
      case "Abuse/Drug misuse/drug dependence":
        className = "abuse-drug-style";
        break;
      case "Occupational exposure(OC exposure)":
        className = "occupational-exposure-style";
        break;
      case "Patient":
        className = "patient-identified-style";
        break;
      case "Suspected Case":
        className = "suspected-case-style";
        break;
      default:
        className = "pregnancy-case-style";
        break;
    }
    return className;
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
      "Id,Title,Tag,Medications,Designated Medical Event,Literature Source,Country,Generative AI Assisted Reason,Generative Confidence Score,Generative Reason,Causality Assessment,Causality Assessment Confidence Score,Causality Assessment Reason,Assign To, Status,Updated By\n";
    const csvContent = selectedData
      .map((item) => {
        const LiteratureSource = item?.filter_type || "-";
        const DesignatedMedicalEvent =
          item?.designated_medical_events.toString() || "-";
        const country = item?.country || "-";
        const assignee = item?.assignee || "-";
        const status = item?.status || "-";
        const modifiedBy = item?.modified_by || "-";
        const tags = item?.tags ? Object.keys(item?.tags)?.join(", ") : "-";
        const medications = item?.ai_tags?.Medications
          ? item?.ai_tags?.Medications?.flatMap((medication) =>
              medication?.entity?.map((entity) => entity)
            ).join(", ")
          : "-";

        return `"${item?.article_id}","${item?.title}","${tags}","${medications}",${DesignatedMedicalEvent},"${LiteratureSource}",${country},"${item?.ai_decision}","${item.confidence_score}","${item?.reason}","${item?.causality_decision}","${item.causality_confidence_score}","${item?.causality_reason}","${assignee}","${status}","${modifiedBy}"`;
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
      }_AbstractDuplicatesList_${Utils.getCurrentDateAndTime()}.csv`
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
        col: "search_result_status",
        value: label,
        monitor_id: monitor_id,
        page: currentPage,
        per_page: perPage,
        count: false,
      };
      const res = await dispatch(ReviewAbstractSendMailAsync(payload));
      if (ReviewAbstractSendMailAsync.fulfilled.match(res)) {
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
          <div className="flex">
            <div className="ml-2 mt-2 flex">
              <div>
                <input
                  type="text"
                  placeholder="Search by title"
                  onChange={handleSearch}
                  className="w-[200px] h-[22px] text-14 rounded-md border-1 border-solid border-gray text-dimgray px-4 py-2"
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
            <div className="w-[25%] relative text-14 mt-2 ml-6">
              <CreatableSelect
                placeholder="Filter by Assign"
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
            <div className="w-[35%] relative text-14 mt-2 ml-4">
              <CreatableSelect
                placeholder="Filter by Causality Assessment"
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => {
                  setCausalityAssessment(newValue as Option[]);
                  handleCausalityAssessmentTagSelect(newValue as Option[]);
                }}
                options={CausalityAssessmentOption}
                isMulti
                value={causalityAssessment}
              />
            </div>
            <div className="flex absolute text-14 right-7">
              <div className="mt-2 ml-2">
                <button
                  className={`rounded-md border border-none cursor-pointer text-sm font-medium font-archivo w-[90px] h-[38px] ${
                    selectedItems.length === 0 && !selectAllChecked
                      ? "disabled-select"
                      : "bg-yellow text-white"
                  }`}
                  onClick={handleBulkUpdate}
                  disabled={selectedItems.length === 0 && !selectAllChecked}
                >
                  Bulk Update
                </button>
              </div>
              <div className="mt-2 ml-2">
                <button
                  className="text-center border bg-gray border-gray  rounded-md cursor-pointer w-[90px] h-[38px]"
                  onClick={resetFilters}
                >
                  Reset Filter
                </button>
              </div>
            </div>
          </div>
          <div className="flex text-14">
            <div className="w-[25%] relative ml-0.5 p-2">
              <CreatableSelect
                placeholder="Filter by Tag"
                isClearable
                isDisabled={isLoading}
                isLoading={isLoading}
                onChange={(newValue) => {
                  setSelectedTagBy(newValue as Option[]);
                  handleTagSelect(newValue as Option[]);
                }}
                options={defaultOptions}
                isMulti
                value={selectedTagBy}
              />
            </div>
            <div className="w-[20%] relative ml-2 mt-3">
              <select
                className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSelectedStatusValue(e.target.value);
                  handleStatusTagSelect(e.target.value);
                }}
                value={selectedStatusValue}
              >
                <option className="text-14" value={""}>
                  Filter By Status
                </option>
                {StatusData?.map((name, index) => (
                  <option className="text-14" key={index} value={name.value}>
                    {name.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-[20%] relative ml-2 mt-3">
              <select
                className="block mb-2 text-14 cursor-pointer w-[100%] px-4 py-2 pr-8 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => {
                  setSelectedExpertDecisionValue(e.target.value);
                  handleExpertDecisionTagSelect(e.target.value);
                }}
                value={selectedExpertDecisionValue}
              >
                <option className="text-14" value={""}>
                  Filter By Expert Decision
                </option>
                {ExpertDecision?.map((name, index) => (
                  <option className="text-14" key={index} value={name.value}>
                    {name.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="justify-between">
            <div className="flex mt-4 text-14 ml-2">
              {userIsMasterAdmin && (
                <AssignToTeamMember onAssign={handleAssign} />
              )}
            </div>

            <div className="mr-4 cursor-pointer justify-end flex">
              <div className="rounded-md text-14 mt-2 mr-3 text-violet">
                {selectedItems.length} Item Selected
              </div>
              <div className="mt-1">
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
          <div className="flex"></div>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
        </div>
        <div>
          <div className="overflow-style">
            <table className="w-full text-14 border border-collapse table-auto">
              <thead className="border-style text-sm text-left">
                <tr className="font-Archivo cursor-pointer header-style capitalize text-style text-sm bg-gray-50">
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
                  <th className="px-2 py-2 w-20 hover-text-style">ID</th>
                  <th className="px-4 py-2 w-40 text-right">
                    <div className="relative">
                      <span className="flex hover-text-style title-width text-right items-end hover:bg-whiteGray cursor-pointer px-6 py-2">
                        Title{" "}
                      </span>
                    </div>
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Tag
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Medications
                  </th>
                  <th className="px-2 py-4 w-32 text-center hover-text-style">
                    Designated Medical Events
                  </th>
                  <th className="px-2 py-4 w-24 text-left hover-text-style">
                    Article Published Country
                  </th>
                  <th className="px-2 py-4 w-32 text-left hover-text-style">
                    Generative AI Assisted Reason
                  </th>
                  <th className="px-2 py-4 w-32 text-left hover-text-style">
                    Causality Assessment
                  </th>
                  <th className="px-2 py-4 w-20 text-left hover-text-style">
                    Assign To
                  </th>
                  <th className="px-6 py-4 w-20 text-left hover-text-style">
                    Status
                  </th>
                  <th className="px-2 py-4 w-20 text-left hover-text-style">
                    Updated By
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedData &&
                  sortedData
                    .filter((item) =>
                      item?.title
                        ? item.title
                            ?.toLowerCase()
                            .includes(searchQuery.toLowerCase())
                        : "".includes(searchQuery.toLowerCase())
                    )
                    .map((item, index) => (
                      <tr
                        className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite mb-2"
                        key={index}
                        onClick={() => {
                          toggleRowSelection(index);
                        }}
                      >
                        <td className="cursor-pointer title-width">
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
                        <td className="px-2 w-24 items-center">
                          <div className="mt-1">
                            {item?.article_id ? item?.article_id : "-"}
                          </div>
                        </td>
                        <td
                          className="px-2 w-40"
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
                                ? item?.updated_on?.split("T")[0]
                                : "-"}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 w-40 text-dimgray text-center capitalize">
                          <>
                            {Object.keys(item?.tags)?.map(
                              (tag: string, index: number) => {
                                const entities = (item.tags as Record<string, any>)[tag][0]?.entity;
                                return (
                                  <div
                                  title={entities}
                                    key={index}
                                    className={`text-center px-3 flex-wrap mr-2 mb-1  py-1 ${getClass(
                                      tag
                                    )}`}
                                  >
                                    {tag}
                                  </div>
                                );
                              }
                            )}

                            {!Object.keys(item?.tags).length && <> - </>}
                          </>
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
                                  return (
                                    <div key={index}>
                                      <span
                                        key={index}
                                        className="designated-medical-event-selected mt-2 medications-tagging ml-1 text-center cursor-pointer"
                                      >
                                        {dme}
                                      </span>
                                    </div>
                                  );
                                }
                              )
                            ) : (
                              <div className={`text-center`}>{"-"}</div>
                            )}
                          </>
                        </td>
                        <td className="px-2 w-20 capitalize">{item.country}</td>
                        <td className="px-2 py-4 capitalize">
                          <div className="w-40">
                            <div>{item.ai_decision}</div>
                            <div className="mt-2 table-date-font text-dimgray">
                              Confidence Score : {item?.confidence_score}%
                            </div>
                            <div className="mt-2 table-date-font text-dimgray">
                              {item?.reason}
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-4 capitalize">
                          <div className=" w-40">
                            <div>{item.causality_decision}</div>
                            <div className="mt-2 table-date-font text-dimgray">
                              Confidence Score :{" "}
                              {item?.causality_confidence_score}%
                            </div>
                            <div className="mt-2 table-date-font text-dimgray">
                              {item?.causality_reason}
                            </div>
                          </div>
                        </td>
                        <td
                          className="px-2 w-20 capitalize"
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
                          className="px-2 w-24 capitalize"
                          onClick={() => {
                            handleClick(item);
                          }}
                        >
                          {item?.status}
                        </td>
                        <td
                          className="px-2 w-20 capitalize"
                          onClick={() => {
                            handleClick(item);
                          }}
                        >
                          {item.modified_by}
                        </td>
                      </tr>
                    ))}
                {message && (
                  <tr className="border-b cursor-pointer text-center text-sm border-style hover:bg-ghostwhite mb-2">
                    <td
                      className="px-2 py-2 capitalize col-span-3 text-center"
                      colSpan={8}
                    >
                      {message}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {isLoading && <LoadingSpinner />}
      </div>
      {fetchAbstractReviewMonitor.length > 0 && (
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

export default Duplicates;
