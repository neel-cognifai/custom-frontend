import { ReviewData } from "@/common/data";
import ListDrugMonitor from "@/components/drug-monitor/ListDrugMonitor";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { SortOption } from "../../../../utils/sortingUtils";
import { CONSTANTS, systemMessage } from "@/common/constants";
import { AbstractReviewAsync } from "../inQueue/selectedItemsSlice";
import { IInQueue, MonitorData } from "../abstract.model";
import { useAppDispatch } from "@/redux/store";
import { useRouter } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import EmailSenderComponent from "@/common/EmailSender";
import AssignToTeamMember from "@/common/helper/AssignToTeamMember";
import LoadingSpinner from "@/common/LoadingSpinner";
import { format } from "date-fns";

interface Option {
  readonly label: string;
  readonly value: string;
}

export interface IReviewData {
  ID: string;
  Title: string;
  "Literature Source": string;
  Country: string;
  monitor_id: string;
  start_date: string;
  end_date: string;
  abstarctinfo_div_status: string;
  generative_ai_decision: string;
  generative_ai_confidence_score: string;
  causality_assessment_decision: string;
  generative_ai_summary: string;
  causality_assessment_confidence_score: string;
  tagging_ai_response_enitity: string[];
  assign_to: number;
  updated_by: string | null;
  Published_on: string | null;
  decision:string;
}

interface IProps {
  inReviewData: IReviewData[];
  monitor_id?: string;
}

const Review: React.FC<IProps> = ({ inReviewData, monitor_id }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<IReviewData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState<IReviewData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [generativeAIAssistedDecision, setGenerativeAIAssistedDecision] =
    useState<Option[]>([]);
  const [causalityAssessment, setCausalityAssessment] = useState<Option[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => {
    setIsLoading(true);
    if (inReviewData.length) {
      setFilteredData(inReviewData);
      setIsLoading(false);
    } else {
      setIsLoading(false);
      setMessage(systemMessage.not_found);
    }
  }, [inReviewData]);

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

  const AssignToOptions = [
    createOption("Arlene McCoy"),
    createOption("Jerome Bell"),
    createOption("Darrell Steward"),
    createOption("Devon Lane"),
  ];

  const UpdatedByOptions = [
    createOption("Arlene McCoy"),
    createOption("Jerome Bell"),
    createOption("Darrell Steward"),
    createOption("Devon Lane"),
    createOption("John"),
  ];

  const StatusOption = [createOption("Inprogress"), createOption("Reviewed")];

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
    setFilteredData(inReviewData);
    setSelectedItems([]);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
  };

  const dispatch = useAppDispatch();
  const toggleRowSelection = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };
  const [sortConfig, setSortConfig] = useState<{
    key: keyof IReviewData;
    direction: "ascending" | "descending" | "";
  }>({
    key: "ID",
    direction: "ascending",
  });

  const handleCheckboxChange = (item: IReviewData, isCheck: boolean) => {
    if (isCheck) {
      const updatedSelectedItems = [...selectedItems, item];
      setSelectedItems(updatedSelectedItems);
    } else {
      const removeSelectedItem = selectedItems.filter(
        (data) => data.ID !== item.ID
      );
      setSelectedItems(removeSelectedItem);
    }
  };

  const handleBulkUpdate = () => {
    dispatch(AbstractReviewAsync(selectedItems as unknown as MonitorData));
    router.push(CONSTANTS.ROUTING_PATHS.AbstractReview4);
  };

  const sortedData = (a: IReviewData, b: IReviewData) => {
    const key = sortConfig.key as keyof IReviewData;
    if (a[key]! !== undefined && b[key]! !== undefined) {
      const nameA = (a[key] as string).toLowerCase();
      const nameB = (b[key] as string).toLowerCase();
      if (sortConfig.direction === "ascending") {
        return nameA > nameB ? 1 : -1;
      } else {
        return nameA < nameB ? 1 : -1;
      }
    }
    return 0;
  };

  filteredData.sort(sortedData);
  const handleTagSelect = (newValues: Option[]) => {
    const selectedTagValues = newValues.map(
      (value) => value?.label.toLowerCase() || ""
    );
    const filteredData =
      selectedTagValues.length === 0
        ? inReviewData
        : inReviewData.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.tagging_ai_response_enitity
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
        ? inReviewData
        : inReviewData.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.updated_by?.toLowerCase().includes(selectedTag)
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
        ? inReviewData
        : inReviewData.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.abstarctinfo_div_status.toLowerCase().includes(selectedTag)
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
        ? inReviewData
        : inReviewData.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.causality_assessment_decision
                .toLowerCase()
                .includes(selectedTag)
            );
          });
    setFilteredData(filteredData);
  };

  const handleTitleSort = (direction: "ascending" | "descending" | "") => {
    if (sortConfig.key === "Title" && sortConfig.direction === direction) {
      return;
    }

    requestSort("Title");
    setTitleDropdownOpen(false);
  };

  const userIsMasterAdmin = false;

  const requestSort = (key: keyof IReviewData) => {
    let direction: "ascending" | "descending" | "" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };
  const handleSearch = (event: { target: { value: string } }) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const handleClick = async (item: IReviewData) => {
    router.push(
      `${CONSTANTS.ROUTING_PATHS.AbstractReview3}/${monitor_id}/${item.ID}`
    );
  };

  const handleAssign = (selectedTeamMember: string) => {};
  return (
    <div>
      <div className="divide-y-2">
        <div className="flex">
          <div className="ml-2 mt-2 flex">
            <div>
              <input
                type="text"
                placeholder="Search"
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
          <div className="w-[25%] relative ml-4 p-2">
            <CreatableSelect
              placeholder="Filter by Tag"
              isClearable
              isDisabled={isLoading}
              isLoading={isLoading}
              onChange={(newValue) => {
                setSelectedTags(newValue as Option[]);
                handleTagSelect(newValue as Option[]);
              }}
              options={defaultOptions}
              isMulti
              value={selectedTags}
            />
          </div>
          <div className="w-[25%] relative mt-2">
            <CreatableSelect
              placeholder="Filter by updated By"
              isClearable
              isDisabled={isLoading}
              isLoading={isLoading}
              onChange={(newValue) => {
                setSelectedUpdatedBy(newValue as Option[]);
                handleUpdatedByTagSelect(newValue as Option[]);
              }}
              options={UpdatedByOptions}
              isMulti
              value={selectedUpdatedBy}
            />
          </div>
          <div className="flex absolute right-7">
            <div className="mt-2 ml-2 relative">
              <button
                className="rounded-md border cursor-pointer border-gray text-sm font-medium font-Archivo w-[80px] h-[38px]"
                onClick={() => setShowCheckboxes(!showCheckboxes)}
              >
                {showCheckboxes ? "Cancel" : "Select"}
              </button>
            </div>
            <div className="mt-2 ml-2">
              <button
                className={`rounded-md border cursor-pointer border-yellow text-sm font-medium text-yellow font-archivo w-[90px] h-[38px] bg-orange-100`}
                onClick={handleBulkUpdate}
                disabled={!showCheckboxes}
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
        <div className="flex justify-between">
          <div className="w-[38%] relative mt-2 ml-2">
            <CreatableSelect
              placeholder="Filter by Status"
              isClearable
              isDisabled={isLoading}
              isLoading={isLoading}
              onChange={(newValue) => {
                setGenerativeAIAssistedDecision(newValue as Option[]);
                handleGenerativeAIAssistedDecisionTagSelect(
                  newValue as Option[]
                );
              }}
              options={StatusOption}
              isMulti
              value={generativeAIAssistedDecision}
            />
          </div>
          <div className="w-[38%] relative mr-[400px] mt-2 ml-2">
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
          <div className="flex mt-2 justify-end">
            <div className="rounded-md mt-4 mr-16 text-violet">
              {selectedItems.length} Item Selected
            </div>
            <div className="absolute right-8 mt-4">
              <EmailSenderComponent customClasses="right-8" />
            </div>
          </div>
        </div>
        <div className="flex">
          {userIsMasterAdmin && <AssignToTeamMember onAssign={handleAssign} />}
        </div>
        <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
      </div>
      <div>
        <div className="overflow-x-autos">
          <table className="w-full border border-collapse table-auto">
            <thead className="border-style text-sm text-left">
              <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                <th className="px-6 py-2 hover-text-style">ID</th>
                <th className="px-8 py-2 text-right">
                  <div className="relative">
                    <span
                      className="flex hover-text-style text-right items-end hover:bg-whiteGray cursor-pointer px-6 py-2"
                      onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                    >
                      Title{" "}
                      <Image
                        src="/assets/icons/sort.svg"
                        width={15}
                        height={15}
                        alt="sort"
                        className={`ml-2 ${
                          sortConfig.direction === "ascending"
                            ? "rotate-180"
                            : ""
                        }`}
                      />
                    </span>
                    {titleDropdownOpen && (
                      <div className="absolute top-14 w-[190px] bg-white border rounded shadow-lg">
                        <SortOption
                          label="Sort Ascending"
                          direction="ascending"
                          active={sortConfig.direction}
                          onClick={handleTitleSort}
                          iconSrc="/assets/icons/up-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                        <SortOption
                          label="Sort Descending"
                          direction="descending"
                          active={sortConfig.direction}
                          onClick={handleTitleSort}
                          iconSrc="/assets/icons/down-arrow-svgrepo-com.svg"
                          iconAlt="arrow"
                        />
                      </div>
                    )}
                  </div>
                </th>
                <th className="px-6 w-[10%] py-4 text-left hover-text-style">
                  Tag
                </th>
                <th className="pl-12 w-[20%] py-4 text-left hover-text-style">
                  literature Source
                </th>
                <th className="px-2 w-[10%] py-4 text-left hover-text-style">
                  Country
                </th>
                <th className="px-2 w-[20%] py-4 text-left hover-text-style">
                  Generative AI Assisted Reason
                </th>
                <th className="px-2 w-[20%] py-4 text-left hover-text-style">
                  Causality Assessment
                </th>
                <th className="px-2 w-[10%] py-4 text-left hover-text-style">
                  Decision
                </th>
                <th className="px-2 w-[10%] py-4 text-left hover-text-style">
                  Assign To
                </th>
                <th className="px-2 w-[10%] py-4 text-left hover-text-style">
                  Updated By
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                  .filter((item) =>
                  item.Title ? item.Title.toLowerCase() :''
                    .includes(searchQuery.toLowerCase())
                )
                .map((item, index) => (
                  <tr
                    className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite mb-2"
                    key={index}
                    onClick={() => {
                      toggleRowSelection(index);
                    }}
                  >
                    <td className="px-2  items-center" onClick={() => {handleClick(item);}}>
                      <div className="flex">
                        <div>
                          {showCheckboxes && (
                            <input
                              type="checkbox"
                              onChange={(event) => {
                                const { checked } = event.target;
                                handleCheckboxChange(item, checked);
                              }}
                              className="border cursor-pointer border-black mr-4 text-violet bg-white-900 rounded-md"
                            />
                          )}
                        </div>
                        <div className="mt-1">{item.ID}</div>
                      </div>
                    </td>
                    <td
                      className="px-2"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      <div className="flex relative w-60">
                        <div className="relative">{item.Title ? item.Title : '-'}</div>
                      </div>
                      <div className="flex">
                        <div className="mt-2 table-date-font text-dimgray">
                        Published On :{item.Published_on}
                        </div>
                      </div>
                    </td>
                    <td
                      className="px-2 py-2"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      { item.tagging_ai_response_enitity.length > 0 ? item.tagging_ai_response_enitity.map((tag, tagIndex) => (
                        <div
                          key={tagIndex}
                          className={`${tagIndex > 0 ? "mt-1" : ""} ${
                            tag === "Suspected event" ||
                            tag === "Branding" ||
                            tag === "Pediatric" ||
                            tag === "Occupational exposure(OC exposure)" ||
                            tag === "Overdose" ||
                            tag === "Off label"
                              ? "suspected-event-style cursor-pointer px-4 py-2"
                              : tag === "Suspected Adverse Event  (AE)" ||
                                tag === "Patient identified" ||
                                tag === "Pregnancy/fetus/foetus" ||
                                // tag === "Important medical event(IME)" ||
                                tag === "Medication error" ||
                                tag === "Drug interaction" ||
                                tag === "Lack of efficacy"
                              ? "suspected-adverse-style cursor-pointer border-violet-900 px-4 py-2 "
                              : tag === "Suspected case" ||
                                tag === "Animal/In-Vitro" ||
                                tag === "Elderly" ||
                                tag === "Abuse/Drug misuse / drug dependence"
                              ? "suspected-case-style cursor-pointer px-4 py-2 "
                              : ""
                          }`}
                        >
                          {tag}
                        </div>
                      )) : <div> None </div> }
                    </td>
                    <td
                      className="px-2 text-dimgray text-center capitalize"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      {item["Literature Source"]}
                      <div className="mt-2 table-date-font text-dimgray">
                        {item["updated_by"]}
                      </div>
                    </td>
                    <td className="px-2 capitalize">{item.Country}</td>
                    <td className="px-2 py-4 capitalize">
                      {item.generative_ai_decision}
                      <div className="mt-2 table-date-font text-dimgray">
                        Confidence Score : {item.generative_ai_confidence_score}%
                      </div>
                      <div className="mt-2 table-date-font text-dimgray">
                        {item.generative_ai_summary}
                      </div>
                    </td>
                    <td className="px-2">
                      {item.causality_assessment_decision}
                      <div className="mt-2 table-date-font text-dimgray">
                        Confidence Score :
                        {item.causality_assessment_confidence_score}%
                      </div>
                    </td>
                       <td
                      className="px-2 capitalize"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      {item.decision}
                    </td>
                    <td
                      className="px-2 capitalize"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      {item.assign_to}
                    </td>
                    <td
                      className="px-2 capitalize"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      {item.updated_by}
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
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default Review;
