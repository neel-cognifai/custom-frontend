import { NonEnglishData } from "@/common/data";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CONSTANTS, systemMessage } from "@/common/constants";
import { useAppDispatch } from "@/redux/store";
import Modal from "@/common/modal/model";
import CreatableSelect from "react-select/creatable";
import Image from "next/image";
import { SortOption } from "../../../../utils/sortingUtils";
import EmailSenderComponent from "@/common/EmailSender";
import UpdateAbstract from "@/common/modal/updateAbstract";
import AssignToTeamMember from "@/common/helper/AssignToTeamMember";
import UploadFileInTableModal from "@/common/modal/uploadFileInTableModal";
import Link from "next/link";

interface Option {
  readonly label: string;
  readonly value: string;
}

interface ITranslationData {
  ID: number;
  Title: string;
  status: string | null;
  Decision: any[];
  monitor_id: string;
  start_date: string;
  end_date: string;
  tagging_ai_response_enitity: string[];
  assign_to: string | null;
  updated_by: string | null;
  Link: string;
}

interface IUploadFile {
  index: number;
  isOpen: boolean;
}

interface IProps {
  translationRequiredData: ITranslationData[];
  monitor_id?: string;
}

const TranslationRequired: React.FC<IProps> = ({
  translationRequiredData,
  monitor_id,
}) => {
  // state
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [openAdd, setOPenAdd] = useState(false);
  const [showCheckboxes, setShowCheckboxes] = useState(false);
  const [titleDropdownOpen, setTitleDropdownOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedItems, setSelectedItems] = useState<ITranslationData[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState<ITranslationData[]>([]);
  const [selectedTags, setSelectedTags] = useState<Option[]>([]);
  const [selectedUpdatedBy, setSelectedUpdatedBy] = useState<Option[]>([]);
  const [generativeAIAssistedDecision, setGenerativeAIAssistedDecision] =
    useState<Option[]>([]);
  const [causalityAssessment, setCausalityAssessment] = useState<Option[]>([]);
  // const [options, setOptions] = useState(defaultOptions);
  const [value, setValue] = useState<Option | null>(null);
  const [message, setMessage] = useState("");
  const [formValues, setFormValues] = useState({
    selectedFile: null as File | null,
  });
  const [uploadModalOpen, setUploadModalOpen] = useState<IUploadFile>({
    index: -1,
    isOpen: false,
  });

  useEffect(() => {
    if (translationRequiredData.length) {
      setFilteredData(translationRequiredData);
      setMessage("");
    } else {
      setMessage(systemMessage.not_found);
    }
  }, [translationRequiredData]);

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

  const UpdatedByOptions = [
    createOption("Arlene McCoy"),
    createOption("Jerome Bell"),
    createOption("Darrell Steward"),
    createOption("Devon Lane"),
    createOption("John"),
  ];

  const resetFilters = () => {
    setSearchQuery("");
    setFilteredData(translationRequiredData);
    setSelectedRows([]);
    setSelectedTags([]);
    setSelectedUpdatedBy([]);
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
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter((i) => i !== index));
    } else {
      setSelectedRows([...selectedRows, index]);
    }
  };

  const [sortConfig, setSortConfig] = useState<{
    key: keyof ITranslationData;
    direction: "ascending" | "descending" | "";
  }>({
    key: "ID",
    direction: "ascending",
  });

  const handleCheckboxChange = (item: ITranslationData, isCheck: boolean) => {
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

  const handleFileDelete = () => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedFile: null,
    }));
    setUploadModalOpen({ index: -1, isOpen: false });
  };

  const sortedData = (a: ITranslationData, b: ITranslationData) => {
    const key = sortConfig.key as keyof ITranslationData;
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
        ? translationRequiredData
        : translationRequiredData.filter((item) => {
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
        ? translationRequiredData
        : translationRequiredData.filter((item) => {
            return selectedTagValues.some((selectedTag) =>
              item.updated_by?.toLowerCase().includes(selectedTag)
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

  const requestSort = (key: keyof ITranslationData) => {
    let direction: "ascending" | "descending" | "" = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
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

  const handleClick = (item: ITranslationData) => {
    router.push(
      `${CONSTANTS.ROUTING_PATHS.advancedReview3}/${monitor_id}/${item.ID}`
    );
  };

  const handleAssign = (selectedTeamMember: string) => {};
  return (
    <div>
      <div className="divide-y-2">
        <div className="flex relative">
          <div className="relative">
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
          </div>
          <div className="w-[18%] relative ml-6 mt-2">
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
          <div className="w-[18%] relative ml-2 mt-2">
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
          <div className="mt-2 ml-2 absolute right-[100px]">
            <button
              className="text-14 bg-gray border-none rounded-md cursor-pointer w-24 h-10"
              onClick={resetFilters}
            >
              Reset Filter
            </button>
          </div>
          <div className="ml-2 flex absolute top-5 right-16 cursor-pointer border-style">
            <EmailSenderComponent customClasses="right-8" />
          </div>
          <div className="absolute right-8 top-5">
            <div
              className="cursor-pointer"
              onClick={() => {
                toggleDropdown();
              }}
            >
              <Image
                alt="download"
                src="/assets/icons/download-black.svg"
                width={20}
                height={20}
                title="Download"
              />
              {isDropdownOpen && (
                <div className="w-[150px] absolute right-9 z-10 top-[0px] mt-2 bg-white shadow-style rounded-lg border-gray-300">
                  <div className="px-4 py-2">Excel: Standard</div>
                  <div className="px-4 py-2">Excel: QC Report</div>
                  <div className="px-4 py-2">HTML</div>
                  <div className="px-4 py-2">E2B R2</div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="ml-2 mt-2 flex">
          <button
            className="text-center border bg-gray border-gray  rounded-md cursor-pointer w-[150px] h-[38px]"
            onClick={handelOpen}
          >
            Update Translation
          </button>
          {userIsMasterAdmin && <AssignToTeamMember onAssign={handleAssign} />}
        </div>
        <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
      </div>
      <div>
        <div className="overflow-x-autos">
          <table className="w-full border border-collapse table-auto">
            <thead className="border-style text-sm text-left">
              <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                <th className="px-8 py-2 hover-text-style">ID</th>
                <th className="px-2 py-2 text-center">
                  <div className="relative">
                    <span
                      className="flex hover-text-style text-center items-center hover:bg-whiteGray cursor-pointer px-2 py-2"
                      onClick={() => setTitleDropdownOpen(!titleDropdownOpen)}
                    >
                      Title{" "}
                      <Image
                        src="/assets/icons/sort.svg"
                        width={20}
                        height={20}
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
                <th className="px-4 py-2 text-left hover-text-style">Tag</th>
                <th className="w-[10%] text-left hover-text-style">Language</th>
                <th className="px-2 py-2 text-left hover-text-style">Status</th>
                <th className="px-2 py-2 text-left hover-text-style">
                  Decision
                </th>
                <th className="px-2 w-[10%] py-4 text-left hover-text-style">
                  Assign To
                </th>
                <th className="px-2 w-[10%] py-4 text-left hover-text-style">
                  Updated By
                </th>
                {/* <th className="px-2 py-2 text-center hover-text-style">
                  Attachments
                </th> */}
                <th className="px-2 py-2 text-center hover-text-style">
                  Processed Fulltext Links
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData
                .filter((item) =>
                  item.Title
                    ? item.Title.toLowerCase()
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
                    <td className="px-2  items-center">
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
                      className="pl-16 w-[800px] cursor-pointer break-words text-left"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      <div className="flex relative w-60">
                        <div className="relative">
                          {item.Title ? item.Title : "-"}
                        </div>
                      </div>
                      <div className="flex">
                        <div className="mt-2 table-date-font text-dimgray">
                          Updated On : {item.updated_by}
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
                    <td
                      className="px-4 justify-center items-center py-4 max-w-[200px] text-center"
                      onClick={() => {
                        handleClick(item);
                        toggleRowSelection(index);
                      }}
                    >
                      {item.tagging_ai_response_enitity?.map(
                        (tag, tagIndex) => (
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
                        )
                      )}
                    </td>
                    <td
                      className="p-3 text-lightslategray text-left"
                      onClick={() => {
                        handleClick(item);
                        toggleRowSelection(index);
                      }}
                    >
                      {item.status}
                    </td>
                    <td
                      className="p-3 text-lightslategray text-left"
                      onClick={() => {
                        handleClick(item);
                        toggleRowSelection(index);
                      }}
                    >
                      {item.Decision}
                      {/* {item.Decision?.map((item, index) => (
                        <div key={index} className="mt-2 text-violet">
                          {item}
                        </div>
                      ))} */}
                    </td>
                    <td
                      className="p-3 text-black capitalize text-left"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      {item.assign_to}
                    </td>
                    <td
                      className="p-3 text-black capitalize text-left"
                      onClick={() => {
                        handleClick(item);
                      }}
                    >
                      {item.updated_by}
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
                              <span className="text-silver">File Uploaded</span>
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
                    {/* <td className="pr-4 py-3 text-lightslategray">
                      <Link href={item.Link}>{item.Link}</Link>
                    </td> */}
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
          <Modal
            isOpen={openAdd}
            childElement={
              <UpdateAbstract
                onClose={() => {
                  handleClose();
                }}
                isOpen={false}
              />
            }
          />
        </div>
      </div>
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
  );
};

export default TranslationRequired;
