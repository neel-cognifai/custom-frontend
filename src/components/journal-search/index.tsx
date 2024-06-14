"use client";
import React, { ChangeEvent, Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { CONSTANTS } from "@/common/constants";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TagInput, { Tag } from "@/common/tagInput/tagInput";
import { useDispatch } from "react-redux";
import {
  setEndDate,
  setSearch,
  setSelectedCheckboxes,
  setStartDate,
} from "./journalSearch.slice";
import { AppDispatch } from "@/redux/store";
import LoadingSpinner from "@/common/LoadingSpinner";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { LocalStorage } from "../../../utils/localstorage";

interface ICheckboxState {
  [key: string]: boolean;
}
const Journalsearch = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [sourceCheckboxes, setSourceCheckboxes] = useState<ICheckboxState>({
    PubMed: true,
    Embase: false,
    MEDLINE: false,
  });

  const [selectedDate, setSelectedDates] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)),
    endDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  });

  let synonymsKeywords: Tag[] = [
    { text: "methofill", type: "synonyms" },
    { text: "zlatal", type: "synonyms" },
    { text: "folex", type: "synonyms" },
    { text: "novatrex", type: "synonyms" },
    { text: "farmitrexat", type: "synonyms" },
    { text: "antifolan", type: "synonyms" },
    { text: "xatmep", type: "synonyms" },
    { text: "methobin", type: "synonyms" },
    { text: "breanel", type: "synonyms" },
    { text: "metotressato", type: "synonyms" },
    { text: "amethopterin", type: "synonyms" },
    { text: "velos", type: "synonyms" },
    { text: "methotrexate", type: "synonyms" },
    { text: "immutrex", type: "synonyms" },
    { text: "abitrexate", type: "synonyms" },
    { text: "afslamet", type: "synonyms" },
    { text: "tullex", type: "synonyms" },
    { text: "ebetrex", type: "synonyms" },
    { text: "izixate", type: "synonyms" },
    { text: "emtexate", type: "synonyms" },
    { text: "methotrexate sodium", type: "synonyms" },
    { text: "methylaminopterin", type: "synonyms" },
  ];
  const [values, setValues] = useState({ search: "" });
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [includeTags, setIncludeTags] = useState<Tag[]>([]);
  const [excludeTags, setExcludeTags] = useState<Tag[]>([]);
  const [notTags, setNotTags] = useState<Tag[]>([]);
  const [synonymsTags, setSynonymsTags] = useState<Tag[]>([]);
  const [queryString, setQueryString] = useState("");
  const [query, setQuery] = useState("");
  const [currentOperation, setCurrentOperation] = useState("ADD");
  const [searchHistory, setSearchHistory] = useState<
    { timestamp: number; queryString: string }[]
  >([]);

  const handleClearAll = () => {
    setSynonymsTags([]);
  };
  const handleIncludeTagAdded = (tag: Tag) => {
    setIncludeTags((prevTags) => [...prevTags, tag]);
  };

  const handleExcludeTagAdded = (tag: Tag) => {
    setExcludeTags((prevTags) => [...prevTags, tag]);
  };
  const handleNotTagAdded = (tag: Tag) => {
    setNotTags((prevTags) => [...prevTags, tag]);
  };
  const handleDateChange = (date: Date | null, dateType: string) => {
    setSelectedDates((prevState) => ({
      ...prevState,
      [dateType]: date,
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await handleSearch({ search: query });
    } catch (error) {
      setLoading(false);
    }
  };

  const handleSearch = async (values: { search: string }) => {
    const filters = {
      start_date: startDate,
      end_date: endDate,
    };
    const payload = { values, filters };
    try {
      setSearchValue(values.search);
      dispatch(setSearch(values.search));
      dispatch(setStartDate(startDate));
      dispatch(setEndDate(endDate));
      dispatch(setSelectedCheckboxes(sourceCheckboxes));
      const filterData = JSON.stringify(payload);
      LocalStorage.setItem(
        CONSTANTS.LOCAL_STORAGE_KEYS.FILTER_TYPE,
        filterData
      );
      router.push(CONSTANTS.ROUTING_PATHS.journalSearch2);
    } catch (error) {
      console.error(CONSTANTS.errorMessage.unexpectedError, error);
    }
  };

  const generateQueryStringWithLabels = (
    search: string,
    includeTags: Tag[],
    excludeTags: Tag[],
    notTags: Tag[]
  ) => {
    const includeStr =
      includeTags.length > 0
        ? ` AND ${includeTags.map((tag) => tag.text).join(" AND ")}`
        : "";
    const excludeStr =
      excludeTags.length > 0
        ? ` OR ${excludeTags.map((tag) => tag.text).join(" OR ")}`
        : "";
    const notStr =
      notTags.length > 0
        ? ` NOT ${notTags.map((tag) => tag.text).join(" NOT ")}`
        : "";

    return `${search}${includeStr}${excludeStr}${notStr}`;
  };

  const generateCitationQuery = (operation: string) => {
    let word = values.search;
    let newWord =
      operation === "ADD" || query.split(" ").length < 1
        ? query.length
          ? query + " " + operation + " " + word
          : word
        : "(" + query + ")" + " " + operation + " " + "(" + word + ")";
    setQuery(newWord);
    values.search = "";
  };

  const clearQuery = () => {
    setQuery("");
    setCurrentOperation("ADD");
  };

  const createQuery = (operation: string) => {
    if (query.length === 0) setCurrentOperation("AND");
    generateCitationQuery(operation);
  };

  const handleSourceCheckboxChange = (e: { target: { name: string } }) => {
    const { name } = e.target;
    setSourceCheckboxes((prevCheckboxes) => ({
      ...prevCheckboxes,
      [name]: !prevCheckboxes[name],
    }));
  };
  const { startDate, endDate } = selectedDate;

  const lastWeek = async () => {
    handleDateChange(
      new Date(new Date().setDate(new Date().getDate() - 7)),
      "startDate"
    );
    handleDateChange(new Date(), "endDate");
  };

  const lastMonth = async () => {
    handleDateChange(
      new Date(new Date().setDate(new Date().getDate() - 30)),
      "startDate"
    );
    handleDateChange(new Date(), "endDate");
  };

  const lastYear = async () => {
    handleDateChange(
      new Date(new Date().setDate(new Date().getDate() - 365)),
      "startDate"
    );
    handleDateChange(new Date(), "endDate");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      if (values.search.length) {
        createQuery(currentOperation);
      }
    }
  };

  const getCurrentOperation = (currentOperation: string) => {
    let operation = "";
    switch (currentOperation) {
      case "AND":
        operation = "And";
        break;
      case "OR":
        operation = "Or";
        break;
      case "NOT":
        operation = "Not";
        break;
      default:
        operation = "Add";
    }
    return operation;
  };
  // Added below commented code for further use, Need to modify it according to backend requirement

  // Generate AST //

  // function generateAST(expression: string) {
  //   const tokens = expression.split(/\s+/);
  //   const stack: any  = [];

  //   for (const token of tokens) {
  //     if (token === 'NOT') {
  //       const operand = stack.pop();
  //       stack.push({ type: 'NOT', argument: operand });
  //     } else if (token === 'AND' || token === 'OR') {
  //       const right = stack.pop();
  //       const left = stack.pop();
  //       stack.push({ type: token, left, right });
  //     } else {
  //       stack.push({ type: 'identifier', name: token });
  //     }
  //   }

  //   // Combine remaining elements in the stack to form the final AST
  //   while (stack.length > 1) {
  //     const right = stack.pop();
  //     const left = stack.pop();
  //     stack.push({ type: 'OR', left, right });
  //   }

  //   return stack[0];
  // }

  // const logicalExpression = '(((paracetamol) AND (head)) OR (eye)) NOT (lag)';
  // const ast = generateAST(logicalExpression);

  // console.log(JSON.stringify(ast, null, 2));
  //

  return (
    <div>
      <div className="relative">
        <div className="search-box [backdrop-filter:blur(10px)] rounded-lg shadow-lg">
          <div className="items-center top-2 text-styles">
            <div className="pt-6">
              <div className="mt-2 content-text-heading">
                CoVigilAI Advanced Search Builder
              </div>
            </div>
          </div>
          <div className="absolute mt-2 text-14 w-[92%]">
            <div className="custom-box-shadow scrollable-searchBox pb-4 h-auto bg-white mx-16 mt-2 w-full">
              <div className="search-filters-text text-14">
                <div className="px-4 py-4">Search Filters</div>
              </div>

              <div className="relative text-14 flex mt-4 mb-4 mx-6 w-[80%]">
                <input
                  type="text"
                  name="search"
                  placeholder="Enter a search term"
                  className="flex w-full text-14 text-start rounded-md"
                  value={values.search}
                  onKeyDown={(e) => {
                    onKeyDown(e);
                  }}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const { value } = e.target;
                    setValues({ ...values, search: value });
                  }}
                />
                <button
                  disabled={!values.search.length}
                  onClick={() => createQuery(currentOperation)}
                  className={`text-white rounded-left-style bg-violet w-[100px] ml-2 h-10  cursor-pointer ${
                    !values.search.length ? "disabled-select" : ""
                  }`}
                >
                  {getCurrentOperation(currentOperation)}
                </button>
                <Menu
                  as="div"
                  className="relative inline-block text-14 text-left"
                >
                  <div>
                    <Menu.Button
                      disabled={currentOperation === "ADD"}
                      className={`inline-flex bg-violet w-full justify-center gap-x-1.5 cursor-pointer  px-3 py-2 text-sm font-semibold text-white rounded-right-style ${
                        currentOperation === "ADD" ? "disabled-select" : ""
                      }`}
                    >
                      <ChevronDownIcon
                        className="-mr-1 h-6 w-5 text-white-400"
                        aria-hidden="true"
                      />
                    </Menu.Button>
                  </div>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="text-14 absolute right-0 z-10 mt-2 citation-drop-down-width  origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="py-1">
                        <Menu.Item>
                          <span
                            onClick={() => setCurrentOperation("AND")}
                            className="cursor-pointer hover:bg-whiteGray text-gray-700 block px-4 py-2 text-sm"
                          >
                            Add with And
                          </span>
                        </Menu.Item>
                        <Menu.Item>
                          <span
                            onClick={() => setCurrentOperation("OR")}
                            className="cursor-pointer hover:bg-whiteGray text-gray-700 block px-4 py-2 text-sm"
                          >
                            Add with Or
                          </span>
                        </Menu.Item>
                        <Menu.Item>
                          <span
                            onClick={() => setCurrentOperation("NOT")}
                            className="cursor-pointer hover:bg-whiteGray text-gray-700 block px-4 py-2 text-sm"
                          >
                            Add with Not
                          </span>
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
              <div className="mt-4 mx-6">Query box[Title/Abstract]</div>
              <div className="flex text-14 mx-6 w-[80%]">
                <input
                  type="text"
                  maxLength={1000}
                  className="mt-2 h-10 rounded-md flex w-full text-start"
                  value={query}
                  onChange={(e) => {
                    const { value } = e.target;
                    if (!value.length) setCurrentOperation("ADD");
                    setQuery(value);
                  }}
                  placeholder="Enter / edit your search query here"
                ></input>
                <button
                  type="submit"
                  className={`citation-clear-button ml-2 rounded-lg  cursor-pointer text-14 text-white bg-violet ${
                    !query.length ? "disabled-select" : ""
                  }`}
                  onClick={clearQuery}
                  disabled={!query.length}
                >
                  Clear
                </button>
              </div>
              <div className="query-count ml-36">{query.length}/1000</div>
              <div className="mx-6 flex flex-wrap">
                <div>
                  <div className="mt-2 mb-2">Search from</div>
                  <div className="checkbox-container mt-4">
                    {Object.keys(sourceCheckboxes).map((source, index) => (
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
                          {source.charAt(0).toUpperCase() + source.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ml-6 mt-2 flex">
                <div className=" mt-4"></div>
                <div>
                  <div className="text-black mt-2">
                    Filter by publication date
                  </div>
                  <div className="mt-3 flex">
                    <DatePicker
                      selected={startDate}
                      onChange={(date: Date) =>
                        handleDateChange(date, "startDate")
                      }
                      dateFormat="dd/MM/yyyy"
                      placeholderText="From Date"
                      className="w-full relative text-14 rounded-md"
                      isClearable
                      maxDate={endDate ? new Date(endDate) : null}
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
                        onChange={(date: Date) =>
                          handleDateChange(date, "endDate")
                        }
                        dateFormat="dd/MM/yyyy"
                        placeholderText="End Date"
                        className="w-full relative text-14 rounded-md"
                        minDate={startDate ? new Date(startDate) : null}
                      />
                      <Image
                        className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                        alt=""
                        width={10}
                        height={10}
                        src="/assets/icons/calendarday-1.svg"
                      />
                    </div>
                    <div className="flex ml-6">
                      <button
                        type="submit"
                        className="px-6 mr-3 rounded-lg  cursor-pointer text-14 py-3 text-white bg-violet"
                        onClick={lastWeek}
                      >
                        Week
                      </button>
                      <button
                        type="submit"
                        className="px-6  mr-3 rounded-lg cursor-pointer text-14 py-3 text-white bg-violet"
                        onClick={lastMonth}
                      >
                        Month
                      </button>
                      <button
                        type="submit"
                        className="px-6 cursor-pointer rounded-lg text-14 py-3 text-white bg-violet"
                        onClick={lastYear}
                      >
                        Year
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="ml-6 mt-2">
                <button
                  type="submit"
                  className={`text-14 rounded-lg cursor-pointer w-32 py-3 text-white bg-violet ${
                    !query.length ||
                    !Object.values(sourceCheckboxes).some(
                      (checked) => checked
                    ) ||
                    !startDate ||
                    isNaN(startDate.getTime()) ||
                    !endDate ||
                    isNaN(endDate.getTime())
                      ? "disabled-select"
                      : ""
                  }`}
                  onClick={handleSave}
                  disabled={
                    !query.length ||
                    !Object.values(sourceCheckboxes).some(
                      (checked) => checked
                    ) ||
                    !startDate ||
                    isNaN(startDate.getTime()) ||
                    !endDate ||
                    isNaN(endDate.getTime())
                  }
                >
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
        {loading && <LoadingSpinner />}
      </div>
    </div>
  );
};

export default Journalsearch;
