"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Highlighter, { Chunk, FindChunks } from "react-highlight-words";
import {
  CONSTANTS,
  STATUS,
  defaultPerPage,
  systemMessage,
} from "@/common/constants";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Modal from "@/common/modal/model";
import AddMonitorModal from "@/common/modal/addMonitorModal";
import Image from "next/image";
import { Tag } from "@/common/tagInput/tagInput";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, AppState, useAppSelector } from "@/redux/store";
import EmailSenderComponent from "@/common/EmailSender";
import {
  journalSearchState,
  searchJournalAsync,
  setSearch,
} from "../journal-search/journalSearch.slice";
import {
  Citation,
  FilterPayload,
  IPayload,
  PreMonitorFilter,
} from "../journal-search/journalSearch.model";
import { ThunkDispatch } from "@reduxjs/toolkit";
import LoadingSpinner from "@/common/LoadingSpinner";
import { LocalStorage } from "../../../utils/localstorage";
import CustomPagination from "@/common/Pagination/CustomPagination";
import { Utils } from "../../../utils/utils";
import Toast from "@/common/Toast";
import { SentCitationEmailAsync } from "../drug-monitor/productMonitor.slice";
import { format } from "date-fns";
import MeSHtermsModal from "@/common/modal/MeSHtermsModal";

interface ICheckboxState {
  [key: string]: boolean;
}
export interface RecordCheckboxes {
  [key: string]: boolean;
}
interface DataItem {
  Title?: string;
  Abstract?: string;
  Author?: string;
  Updated_On?: string;
  ID: number;
}

interface SearchResults {
  citations: Citation[];
}

export interface JournalEntry {
  ID?: number;
  Title?: string;
  Abstract?: string;
  Keywords?: string;
  Mesh_Terms?: string;
  Literature_source?: string;
  Updated_On?: string;
  Published_on?: string;
  Country?: string;
  Author?: string;
  Article_Literature_ID?: string;
  Full_text_Link?: string;
  Publication?: string;
  DOI_Sources?: string;
  Affiliation?: string;
  Language?: string;
}

const JournalSearchSecondPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { loading, results } = useAppSelector(journalSearchState);
  const filters = useSelector((state: AppState) => state.journalSearch);
  const [selectedItems, setSelectedItems] = useState<Citation[]>([]);
  const [openAdd, setOPenAdd] = useState(false);
  const [openMeSHterms, setOpenMeSHterms] = useState(false);
  const [recordCheckboxes, setRecordCheckboxes] = useState<RecordCheckboxes>();
  const [selectAll, setSelectAll] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [searchString, setSearchString] = useState<string>("");
  const [filteredResults, setFilteredResults] = useState<Citation[]>(
    filters.results || []
  );
  const [startIndex, setStartIndex] = useState(0);
  const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
  const [selectedRecordTitle, setSelectedRecordTitle] = useState<string>("");
  const [expandedAbstracts, setExpandedAbstracts] = useState<
    Record<number, boolean>
  >(
    Array.isArray(filteredResults)
      ? filteredResults.reduce((acc, item) => {
          acc[item.id] = false;
          return acc;
        }, {} as Record<number, boolean>)
      : {}
  );
  const [sourceCheckboxes, setSourceCheckboxes] = useState<ICheckboxState>({
    PubMed: true,
    Embase: false,
    MEDLINE: false,
  });
  const [includeTags, setIncludeTags] = useState<Tag[]>([]);
  const [excludeTags, setExcludeTags] = useState<Tag[]>([]);
  const [MeSHtermsArray, setMeSHtermsArray] = useState<string[]>([]);
  const [anyFieldFilled, setAnyFieldFilled] = useState(false);
  const [synonymsTags, setSynonymsTags] = useState<Tag[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectAllTriggered, setSelectAllTriggered] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(defaultPerPage);
  useEffect(() => {
    if (selectAllTriggered) {
      handleSelectAllCheckboxChange(selectAll);
      setSelectAllTriggered(false);
    }
  }, [selectAll, selectAllTriggered]);

  useEffect(() => {
    const FilterData: string | null = localStorage.getItem(
      CONSTANTS.LOCAL_STORAGE_KEYS.FILTER_TYPE
    );
    if (FilterData) {
      try {
        const Filters: FilterPayload | null = JSON.parse(
          FilterData
        ) as FilterPayload;
        setSearchInput(Filters?.values.search);
        setSearchString(Filters?.values.search);
        setStartDate(new Date(Filters?.filters.start_date));
        setEndDate(new Date(Filters?.filters.end_date));
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    }
  }, [loading]);

  const search = useSelector((state: AppState) => state.journalSearch.search);
  const startDateFromState = useSelector(
    (state: AppState) => state.journalSearch.startDate
  );
  const endDateFromState = useSelector(
    (state: AppState) => state.journalSearch.endDate
  );
  const selectedCheckboxes = useSelector(
    (state: AppState) => state.journalSearch.selectedCheckboxes
  );
  const includeKeywords = useSelector(
    (state: AppState) => state.journalSearch.includeKeywords
  );
  const excludeKeywords = useSelector(
    (state: AppState) => state.journalSearch.excludeKeywords
  );
  const synonyms = useSelector(
    (state: AppState) => state.journalSearch.synonyms
  );

  const localStorageKey = "filteredResultsData";
  const saveToLocalStorage = (data: React.SetStateAction<Citation[]>) => {
    localStorage.setItem(localStorageKey, JSON.stringify(data));
  };

  useEffect(() => {
    if (loading === STATUS.fulfilled && results) {
      const { citations } = results as unknown as SearchResults;
      if (citations) {
        setFilteredResults(citations);
        updateFilteredResults(citations);
      }
      setIsLoading(false);
    }
  }, [results]);

  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (isInitialLoad.current) {
      isInitialLoad.current = false;
      return;
    }
    setIsLoading(true);
    if (searchInput && startDate && endDate) {
      const payload = {
        values: { search: searchInput },
        perPage,
        PageNumber: 1,
        filters: { start_date: startDate!, end_date: endDate! },
      };
      dispatch(searchJournalAsync(payload))
        .then(() => {
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [isInitialLoad.current]);

  useEffect(() => {
    if (search) {
      setSearchInput(search);
      setRecordCheckboxes({});
      setSelectAllChecked(false);
    }
  }, [search]);

  const handleSelectAllCheckboxChange = (isCheck: boolean) => {
    const updatedCheckboxes: RecordCheckboxes = {};
    filteredResults.forEach((item, index) => {
      updatedCheckboxes[`recordCheckbox${startIndex + index}`] = isCheck;
    });
    const newSelectedItems = isCheck ? filteredResults : [];
    setSelectedItems(newSelectedItems);
    setRecordCheckboxes({ ...recordCheckboxes, ...updatedCheckboxes });
    const areAllSelected = Object.values({
      ...recordCheckboxes,
      ...updatedCheckboxes,
    }).every((value) => value);
    setSelectAllChecked(areAllSelected);
  };

  const handleRecordCheckboxChange = (
    item: Citation,
    index: number,
    isCheck: boolean
  ) => {
    if (isCheck) {
      const updatedSelectedItems = [...selectedItems, item];
      setSelectedItems(updatedSelectedItems);
    } else {
      const removeSelectedItem = selectedItems.filter(
        (data) => data.id !== item.id
      );
      setSelectedItems(removeSelectedItem);
    }
    const updatedRecordCheckboxes: RecordCheckboxes = {
      ...recordCheckboxes,
      [`recordCheckbox${index}`]: isCheck,
    };
    setRecordCheckboxes(updatedRecordCheckboxes);
    const areAllSelected = Object.values(updatedRecordCheckboxes).every(
      (value) => value
    );
    setSelectAllChecked(
      areAllSelected &&
        Object.values(updatedRecordCheckboxes).length === filteredResults.length
    );
    setSelectedRecordTitle(item.title as string);
  };

  const handleDownload = () => {
    setIsExportLoading(true);
    let selectedData = [];
    if (selectAllChecked) {
      selectedData = filteredResults;
    } else {
      selectedData = selectedItems;
    }
    const startDateFormatted = Utils.formatDate(startDate);
    const endDateFormatted = Utils.formatDate(endDate);

    const searchRow = `Search String,${searchInput}\n`;
    const startRow = `Start Date, ${startDateFormatted}\n`;
    const endRow = `End Date, ${endDateFormatted}\n`;

    const csvHeader = `Title,Abstract,Keywords,Article Date(Electronic),Published Date,Country,Author,Doi Sources,Affiliation,Language,Citation,PMID\n`;
    const csvContent = selectedData
      .map((item) => {
        const keywords = Array.isArray(item?.keywords)
          ? item?.keywords.join(", ")
          : item?.keywords;
        return `"${item.title}","${item?.abstract?.replace(
          /"/g,
          '""'
        )}","${keywords?.replace(/"/g, '""')}","${item.updated_on}","${
          item.published_on
        }","${item.country}","${item.author}","${item.doi_sources}","${
          item.affiliation
        }","${item.language}","${item.citation}",${item.pmid}`;
      })
      .join("\n");

    const fullCsvContent =
      searchRow + startRow + endRow + csvHeader + csvContent;

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
      }_CitationRecord_${Utils.getCurrentDateAndTime()}.csv`
    );

    link.click();

    URL.revokeObjectURL(url);
    setIsExportLoading(false);
  };

  const updateFilteredResults = (data: React.SetStateAction<Citation[]>) => {
    setFilteredResults(data);
    saveToLocalStorage(data);
  };

  const handlePageChange = async (pageNumber: number) => {
    setIsLoading(true);
    setCurrentPage(pageNumber);

    const filters = {
      include_keyword: includeKeywords.map((tag: { text: any }) => tag.text),
      exclude_keyword: excludeKeywords.map((tag) => tag.text),
      start_date: startDate,
      end_date: endDate,
    };

    const payload: IPayload = {
      values: {
        search: search,
      },
      perPage: perPage,
      PageNumber: pageNumber,
      filters: {
        start_date: filters.start_date!,
        end_date: filters.end_date,
      },
    };

    const dispatchTyped = dispatch as ThunkDispatch<AppState, void, any>;

    const response = await dispatchTyped(searchJournalAsync(payload));

    if (searchJournalAsync.fulfilled.match(response)) {
      setRecordCheckboxes(undefined);
      setSelectAllChecked(false);
      setSelectedItems([]);
      setIsLoading(false);
    } else {
      console.error(CONSTANTS.errorMessage.searchFailed, response.error);
    }
  };

  const handlePerPageChange = async (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setIsLoading(true);
    const newPerPage = Number(event.target.value);
    setPerPage(newPerPage);
    setCurrentPage(1);
    const filters = {
      include_keyword: includeKeywords.map((tag: { text: string }) => tag.text),
      exclude_keyword: excludeKeywords.map((tag) => tag.text),
      start_date: startDate,
      end_date: endDate,
    };

    const payload: IPayload = {
      values: {
        search: search,
      },
      perPage: newPerPage,
      PageNumber: 1,
      filters: {
        start_date: filters.start_date!,
        end_date: filters.end_date,
      },
    };

    const dispatchTyped = dispatch as ThunkDispatch<AppState, void, any>;

    const response = await dispatchTyped(searchJournalAsync(payload));

    if (searchJournalAsync.fulfilled.match(response)) {
      setRecordCheckboxes(undefined);
      setSelectAllChecked(false);
      setSelectedItems([]);
      setIsLoading(false);
    } else {
      console.error(CONSTANTS.errorMessage.searchFailed, response.error);
    }
  };

  const handleSelectAllChange = () => {
    const updatedCheckboxes = { ...sourceCheckboxes };
    for (const key in updatedCheckboxes) {
      updatedCheckboxes[key] = !selectAll;
    }
    setSourceCheckboxes(updatedCheckboxes);
    setSelectAll(!selectAll);
  };

  const handleSourceCheckboxChange = (e: { target: { name: string } }) => {
    const { name } = e.target;
    setSourceCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
    const areAllSelected = Object.values(sourceCheckboxes).every(
      (value) => value
    );
    setSelectAll(areAllSelected);
  };

  const handelOpen = (selectedRecordTitle: string) => {
    setOPenAdd(true);
  };

  function handleClose() {
    setOPenAdd(false);
  }

  const handelMeSHtermsOpen = () => {
    setOpenMeSHterms(true);
  };

  function handleMeSHtermsClose() {
    setOpenMeSHterms(false);
  }

  const TotalRecord = LocalStorage.getItem("citation_count");

  const handleDateChange = (date: Date | null, dateType: string) => {
    if (date) {
      if (dateType === "startDate") {
        setStartDate(date);
      } else {
        setEndDate(date);
      }
    }
  };

  const handleClearAll = () => {
    setSynonymsTags([]);
    setAnyFieldFilled(false);
    setSelectAll(false);
    setSourceCheckboxes({
      PubMed: false,
      Embase: false,
      MEDLINE: false,
    });
    setStartDate(null);
    setEndDate(null);
    setSearchInput("");

    setIncludeTags([]);
    setExcludeTags([]);

    // setSelectedDates({
    //   startDate: new Date(),
    //   endDate: null,
    // });
  };

  const handleIncludeTagAdded = (tag: Tag) => {
    setIncludeTags((prevTags) => [...prevTags, tag]);
  };

  const handleExcludeTagAdded = (tag: Tag) => {
    setExcludeTags((prevTags) => [...prevTags, tag]);
  };

  const handleSearch = async () => {
    setIsLoading(true);
    const filters = {
      start_date: startDate ?? new Date(),
      end_date: endDate ?? new Date(),
    };
    const PageNumber = 1;
    const perPage = defaultPerPage;
    dispatch(setSearch(searchInput));
    const filterPayload = {
      values: { search: searchInput },
      filters,
    };
    const filterData = JSON.stringify(filterPayload);
    LocalStorage.setItem(CONSTANTS.LOCAL_STORAGE_KEYS.FILTER_TYPE, filterData);
    const payload = {
      values: { search: searchInput },
      perPage,
      PageNumber,
      filters,
    };
    const response = await dispatch(searchJournalAsync(payload));
    if (searchJournalAsync.fulfilled.match(response)) {
      setIsLoading(false);
      router.push(CONSTANTS.ROUTING_PATHS.journalSearch2);
    } else {
      console.error(CONSTANTS.errorMessage.searchFailed, response.error);
      setIsLoading(false);
    }
    // const filtered = results?.filter((item) =>
    //   item.Title.toLowerCase().includes(searchInput.toLowerCase())
    // );
    // setFilteredResults(filtered);
    setIsLoading(false);
  };

  // Custom findChunks function to highlight specific words
  const findChunks = ({
    textToHighlight,
    searchWords,
  }: FindChunks): Chunk[] => {
    let chunks: Chunk[] = [];
    const updatedArray: any = searchWords;
    const filteredArray = updatedArray.filter(
      (word: string) => word.trim() !== ""
    );
    filteredArray.forEach((word: string) => {
      const regex = new RegExp(`\\b${word}\\w*`, "gi");

      textToHighlight = textToHighlight.replace(regex, (match, offset) => {
        chunks.push({ start: offset, end: offset + match.length });
        return match;
      });
    });

    return chunks;
  };

  function extractKeywords(inputString: string): string[] {
    const firstChar = inputString.charAt(0);
    const lastChar = inputString.charAt(inputString.length - 1);
    if (firstChar !== "(") {
      inputString = "(" + inputString;
    }
    if (lastChar !== ")") {
      inputString = inputString + ")";
    }
    const pattern = /\((.*?)\)/g; // Regular expression pattern to match words within parentheses
    const matches = inputString.match(pattern); // Find all matches

    // if (!matches) return []; // If no matches found, return empty array

    const keywords: string[] = [];

    // Iterate through matches and split by 'AND, 'OR', 'NOT' to extract individual keywords
    if (matches) {
      matches.forEach((match) => {
        let matchKeywords: string[] = [];
        if (match.includes(" OR ")) {
          matchKeywords = match.slice(1, -1).split(" OR "); // Remove parentheses and split by 'OR'
        } else if (match.includes(" AND ")) {
          matchKeywords = match.slice(1, -1).split(" AND "); // Remove parentheses and split by 'AND'
        } else if (match.includes(" NOT ")) {
          matchKeywords = match.slice(1, -1).split(" NOT "); // Remove parentheses and split by 'NOT'
        } else {
          matchKeywords = match.slice(1, -1).split(" OR ");
        }
        keywords.push(...matchKeywords);
        // Add empty string to separate each keyword
        for (let i = 0; i < matchKeywords.length - 1; i++) {
          keywords.push("");
        }
      });
    } else {
      keywords.push(inputString);
    }
    return keywords;
  }

  const handleEmailSend = async (tags: string[]) => {
    try {
      setIsLoading(true);

      const payload = {
        search_query: searchString,
        start_date: format(startDate || new Date(), "yyyy-MM-dd"),
        end_date: format(endDate || new Date(), "yyyy-MM-dd"),
        page: currentPage,
        per_page: perPage,
        emails: tags,
      };
      const res = await dispatch(SentCitationEmailAsync(payload));
      if (SentCitationEmailAsync.fulfilled.match(res)) {
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
    <>
      <div>
        <div className="absolute top-5">
          <div className="flex ml-4 items-center">
            <Link
              href={CONSTANTS.ROUTING_PATHS.journalSearch}
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
            <div className="ml-2 flex">
              <input
                type="text"
                placeholder="Enter / edit your search query here"
                className="text-black text-14 border-none search-journal py-2"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <div>
                <Image
                  className="absolute cursor-pointer right-[12px] top-[14px] w-4 h-4 overflow-hidden"
                  alt=""
                  width={22}
                  height={22}
                  src="/assets/icons/search-5-1.svg"
                  onClick={handleSearch}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="custom-width">
            <div className="box-style text-14 scrollable-content-journal relative bg-gray-900 p-4">
              <div className="divide-y-2">
                <div className="flex">
                  <span className="text-sm mt-1 font-medium text-black font-archivo ">
                    Search results (Total search count:{" "}
                    {localStorage.getItem("citation_count")})
                  </span>
                  <div className="flex absolute right-2">
                    <div className="flex gap-2">
                      <div className="rounded-md p-2 text-silver">
                        {/* {selectedItems.length} item selected */}
                      </div>
                      <div className="flex">
                        <input
                          type="checkbox"
                          checked={selectAllChecked}
                          onChange={(e) => {
                            const { checked } = e.target;
                            handleSelectAllCheckboxChange(checked);
                          }}
                          className="border cursor-pointer mt-3 border-black text-violet bg-white-900 rounded-md"
                        />
                        <div className="ml-2 mt-3">Select All</div>
                      </div>
                      <div className="mt-2">
                        <EmailSenderComponent
                          handleSend={(tags: string[]) => {
                            handleEmailSend(tags);
                          }}
                          customClasses="right-0"
                        />
                      </div>
                      <div
                        className={`${
                          !selectAllChecked && selectedItems.length === 0
                            ? "disabled-download-icon"
                            : ""
                        }`}
                      >
                        <button
                          className={`rounded-md border ml-1 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8 ${
                            !selectAllChecked && selectedItems.length === 0
                              ? "disabled-select"
                              : "bg-yellow text-white text-14"
                          }`}
                          onClick={handleDownload}
                          disabled={
                            !selectAllChecked && selectedItems.length === 0
                          }
                        >
                          Export
                        </button>
                        {!selectAllChecked && selectedItems.length === 0 ? (
                          <>
                            <div className="absolute cursor-pointer top-0 ml-2">
                              <Image
                                src="/assets/icons/download-black.svg"
                                alt="download icon"
                                width={15}
                                aria-disabled={
                                  !selectAllChecked &&
                                  selectedItems.length === 0
                                }
                                height={15}
                                className={`left-0 ml-2 top-0 mt-2 ${
                                  !selectAllChecked &&
                                  selectedItems.length === 0
                                    ? "disabled-download-icon"
                                    : ""
                                }`}
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="absolute cursor-pointer top-0 ml-2">
                              <Image
                                src="/assets/icons/download-white.svg"
                                alt="download icon"
                                width={15}
                                aria-disabled={
                                  !selectAllChecked &&
                                  selectedItems.length === 0
                                }
                                height={15}
                                className={`left-0 ml-2 top-0 mt-2 ${
                                  !selectAllChecked &&
                                  selectedItems.length === 0
                                    ? "disabled-download-icon"
                                    : ""
                                }`}
                              />
                            </div>
                          </>
                        )}
                      </div>
                      {isExportLoading && (
                        <LoadingSpinner text={"Downloading"} />
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-0.5 border-t-0 mt-5 bg-neutral-100 opacity-100 dark:opacity-50 " />
              {filteredResults?.length ? (
                <div className="overflow-style">
                  <div className="relative mt-6 ml-2 w-auto h-[7.38rem]">
                    {filteredResults?.map((item, index) => (
                      <>
                        <div>
                          <div
                            key={index}
                            className="capitalize font-sm text-violet text-14"
                          >
                            <div className="flex text-14">
                              <input
                                type="checkbox"
                                name={`recordCheckbox${index}`}
                                checked={
                                  recordCheckboxes &&
                                  Object.values(
                                    recordCheckboxes ? recordCheckboxes : {}
                                  ).length
                                    ? recordCheckboxes[`recordCheckbox${index}`]
                                    : false
                                }
                                onChange={(e) => {
                                  const { checked } = e.target;
                                  handleRecordCheckboxChange(
                                    item,
                                    index,
                                    checked
                                  );
                                }}
                                className="border cursor-pointer border-black mr-4 text-violet bg-white-900 rounded-md"
                              />
                              <div className="mr-2">
                                {startIndex + index + 1}.
                              </div>
                              <Highlighter
                                highlightClassName="highlight-class"
                                searchWords={extractKeywords(searchString)}
                                // searchWords={search
                                //   .replace(
                                //     /\b(AND|OR|NOT)\b|\*|[()]/gi,
                                //     ""
                                //   )
                                //   .trim()
                                //   .split(" ")}
                                autoEscape={true}
                                findChunks={findChunks}
                                textToHighlight={item.title ? item.title : ""}
                              />
                            </div>
                          </div>
                          <div className="ml-12 m-2">
                            <div className="font-sm capitalize font-light journal-search-content-style text-gray-100 m-2">
                              {item.abstract ? (
                                expandedAbstracts[item.id] ? (
                                  <>
                                    <div className=" items-start">
                                      <Highlighter
                                        highlightClassName="highlight-class"
                                        searchWords={extractKeywords(
                                          searchString
                                        )}
                                        // searchWords={search
                                        //   .replace(
                                        //     /\b(AND|OR|NOT)\b|\*|[()]/gi,
                                        //     ""
                                        //   )
                                        //   .trim()
                                        //   .split(" ")}
                                        autoEscape={true}
                                        findChunks={findChunks}
                                        textToHighlight={
                                          item.abstract ? item.abstract : ""
                                        }
                                      />
                                    </div>
                                    <span
                                      className="text-violet cursor-pointer ml-2"
                                      onClick={() =>
                                        setExpandedAbstracts((prevState) => ({
                                          ...prevState,
                                          [item.id]: false,
                                        }))
                                      }
                                    >
                                      Read less
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Highlighter
                                      highlightClassName="highlight-class"
                                      searchWords={extractKeywords(
                                        searchString
                                      )}
                                      // searchWords={search
                                      //   .replace(
                                      //     /\b(AND|OR|NOT)\b|\*|[()]/gi,
                                      //     ""
                                      //   )
                                      //   .trim()
                                      //   .split(" ")}
                                      autoEscape={true}
                                      findChunks={findChunks}
                                      textToHighlight={
                                        item.abstract.substring(0, 200) + "..."
                                      }
                                    />
                                    <span
                                      className="text-violet cursor-pointer ml-2"
                                      onClick={() =>
                                        setExpandedAbstracts((prevState) => ({
                                          ...prevState,
                                          [item.id]: true,
                                        }))
                                      }
                                    >
                                      Read more
                                    </span>
                                  </>
                                )
                              ) : (
                                "No abstract available"
                              )}
                            </div>
                            <div className="flex mb-4">
                              <div className="capitalize font-sm font-light inline-block ml-2 mt-2">
                                <div>
                                  Published date:{" "}
                                  {item?.updated_on ? item?.updated_on : "-"}
                                </div>
                                <div className="mt-2">
                                  <div className="capitalize font-sm font-light inline-block mt-2">
                                    Article date( Electronic):{" "}
                                    {item.published_on
                                      ? item.published_on
                                      : "-"}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-3 mt-2">
                                <div className="capitalize font-sm font-light">
                                  PMID: {item.pmid}
                                </div>
                                <div className="capitalize mt-4 font-sm font-light">
                                  Article published: {item.country}
                                </div>
                              </div>
                              <div className="ml-3">
                                <div className="m-2 flex">
                                  <div>DOI Sources:</div>
                                  <div className="ml-2">
                                    <Link
                                      legacyBehavior
                                      className="text-violet"
                                      href={`https://doi.org/${item?.doi_sources
                                        .replace("[doi]", "")
                                        .replace(/\s/g, "")}`}
                                    >
                                      <a target="_blank">
                                        {item?.doi_sources
                                          .replace("[doi]", "")
                                          .replace(/\s/g, "")}
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                                <div className="ml-2 mt-4">
                                  <div className="capitalize font-sm font-light mt-2">
                                    Language: {item.language}
                                  </div>
                                </div>
                              </div>
                              <div className="ml-3 mt-2">
                                <div
                                  className="capitalize underline cursor-pointer text-violet font-sm font-light"
                                  onClick={() => {
                                    handelMeSHtermsOpen();
                                    setMeSHtermsArray(
                                      item?.mesh_terms ? item?.mesh_terms : []
                                    );
                                  }}
                                >
                                  MeSH terms
                                </div>
                                <div className="capitalize mt-4 font-sm font-light">
                                  Publication type:{" "}
                                  {item.publication_types ?? "-"}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              ) : (
                <Image
                  alt="No data Found"
                  src="/assets/icons/nodata.jpg"
                  width={400}
                  height={400}
                  className="flex items-center justify-center text-violet mt-12 ml-72"
                />
              )}
            </div>
            {filteredResults?.length > 0 ? (
              <div className="mt-2">
                <CustomPagination
                  currentPage={currentPage}
                  perPage={perPage}
                  totalRecords={Number(TotalRecord)}
                  handlePageChange={handlePageChange}
                  handlePerPageChange={handlePerPageChange}
                />
              </div>
            ) : (
              <div>{""}</div>
            )}
          </div>
          {isLoading && <LoadingSpinner />}
          <div className="box-style1 scrollable-filter bg-red-900 px-4 py-4">
            <div className="divide-y">
              <div>
                <button
                  className="rounded-md w-full bg-yellow cursor-pointer px-8 py-3 text-white text-14 text-base font-archivo font-medium capitalize"
                  onClick={() => handelOpen(selectedRecordTitle)}
                >
                  Add monitor
                </button>
              </div>
              <div className="flex justify-between mt-6">
                <span className="text-black text-14">Filters</span>
                <span
                  className={`text-14 cursor-pointer text-black`}
                  onClick={handleClearAll}
                >
                  Clear All
                </span>
              </div>
              <hr className="h-px bg-gray-200 border-0"></hr>
              <div className="relative">
                <div className="relative w-[90%] h-[3.88rem]">
                  <div className="relative mb-2 top-0">
                    <div className="text-grey text-14">Date range</div>
                  </div>
                  <div className="flex cursor-pointer w-[300px]">
                    <DatePicker
                      onChange={(date: Date) =>
                        handleDateChange(date, "startDate")
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="From"
                      className="w-full relative text-14 rounded-md"
                      selected={startDate}
                      maxDate={endDate ? new Date(endDate) : null}
                    />
                    <Image
                      className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                      alt=""
                      width={10}
                      height={10}
                      src="/assets/icons/calendarday-1.svg"
                    />
                  </div>
                  <div className="flex mt-4 cursor-pointer top-[10px] w-[300px]">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      placeholderText="To"
                      selected={endDate}
                      onChange={(date: Date) =>
                        handleDateChange(date, "endDate")
                      }
                      className="w-full relative text-14 rounded-md"
                      minDate={startDate ? new Date(startDate) : null}
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
                  <div className="mt-5 text-14">
                    <p className="text-grey-200">Search from</p>
                  </div>
                  <div className="relative text-14 mt-2">
                    <div className="mt-1">
                      <div className="space-y-2">
                        <div className="border-bottom"></div>
                        <div className="checkbox-filter-container">
                          {Object.keys(sourceCheckboxes).map(
                            (source, index) => (
                              <label className="flex items-center" key={index}>
                                <input
                                  type="checkbox"
                                  className={
                                    source === "PubMed"
                                      ? `form-checkbox border cursor-pointer  border-black mr-4 text-violet bg-white-900 rounded-md`
                                      : `disabled-select form-checkbox border cursor-pointer  border-black mr-4 text-violet bg-white-900 rounded-md`
                                  }
                                  name={source}
                                  disabled={!(source === "PubMed")}
                                  checked={sourceCheckboxes[source]}
                                  onChange={handleSourceCheckboxChange}
                                />
                                <span className="ml-0">
                                  {source.charAt(0).toUpperCase() +
                                    source.slice(1)}
                                </span>
                              </label>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      className="rounded-md w-[250px] bg-yellow cursor-pointer px-8 py-3 text-white text-14 text-base font-archivo font-medium capitalize"
                      onClick={handleSearch}
                    >
                      Apply Filter
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={openAdd}
          childElement={
            <AddMonitorModal
              search={search}
              results={results}
              startDate={startDate}
              endDate={endDate}
              includeKeywords={includeKeywords}
              excludeKeywords={excludeKeywords}
              selectedCheckboxes={selectedItems}
              handelClose={() => {
                handleClose();
              }}
            />
          }
        />
        <Modal
          isOpen={openMeSHterms}
          childElement={
            <MeSHtermsModal
              items={MeSHtermsArray}
              handelClose={() => {
                handleMeSHtermsClose();
              }}
            />
          }
        />
      </div>
    </>
  );
};

export default JournalSearchSecondPage;
