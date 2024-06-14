import React, { useEffect, useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  handleAutoCheckboxChange,
  handleCheckboxChange,
  handleOtherCheckboxChange,
} from "../../../utils/checkboxUtils";
import { AppDispatch, useAppSelector } from "@/redux/store";
import {
  getProductMonitorAsync,
  getTeamAsync,
  productMonitorState,
} from "@/components/drug-monitor/productMonitor.slice";
import { useDispatch } from "react-redux";
import {
  IAddDrugMonitorInJournalSearch,
  ITeam,
} from "@/components/drug-monitor/productMonitor.model";
import {
  CONSTANTS,
  STATUS,
  countriesArray,
  defaultPerPage,
  systemMessage,
} from "../constants";
import Toast from "../Toast";
import { addProductMonitorAsync } from "@/components/journal-search/journalSearch.slice";
import LoadingSpinner from "../LoadingSpinner";
import { Tag } from "../tagInputMonitor/tagInput";
import {
  Citation,
  DataObject,
  PreMonitorFilter,
} from "@/components/journal-search/journalSearch.model";
import { format } from "date-fns";
import { LocalStorage } from "../../../utils/localstorage";
import CreatableSelect from "react-select/creatable";

interface ICheckboxState {
  [key: string]: boolean;
}

interface Option {
  readonly label: string;
  readonly value: string;
}

interface Props {
  search: string;
  startDate: Date | null;
  endDate: Date | null;
  includeKeywords: Tag[];
  excludeKeywords: Tag[];
  selectedCheckboxes: Citation[];
  results: DataObject[];
  handelClose?: () => void;
}

const AddMonitorModal: React.FC<Props> = ({ handelClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [countryOfOriginTags, setCountryOfOriginTags] = useState<Tag[]>([]);
  const [autoExclusionCheckbox, setAutoExclusionCheckbox] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const {
    editMonitorDataState,
    editMonitorStatus,
    errorMessage,
    teamStatus,
    teamState,
  } = useAppSelector(productMonitorState);
  const [loading, setLoading] = useState(false);
  const [abstractTeam, setAbstractTeam] = useState([]);
  const [QCTeam, setQCTeam] = useState([]);
  const [countryOptions, setCountryOptions] = useState<
    { label: string; value: string }[]
  >([]);
  const [selectedCountry, setSelectedCountry] = useState<Option[]>([]);
  const [sourceCheckboxes, setSourceCheckboxes] = useState<ICheckboxState>({
    "Animal / Invitro": false,
    "Publish before MAH date": false,
    "Without any tags (suspected AE, Patient identified & suspected Case)":
      false,
  });

  useEffect(() => {
    setCountryOptions(countriesArray);
  }, []);
  useEffect(() => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedCheckboxes: { ...sourceCheckboxes },
    }));
  }, [sourceCheckboxes]);

  useEffect(() => {
    getTeamList();
  }, []);

  useEffect(() => {
    if (teamStatus === STATUS.fulfilled) {
      const abstractReviewTeams = teamState.filter(
        (team: ITeam) => team.team_type === "Abstract Review"
      );
      const qcReviewTeams = teamState.filter(
        (team: ITeam) => team.team_type === "QC Review"
      );
      setAbstractTeam(abstractReviewTeams);
      setQCTeam(qcReviewTeams);
    }
  }, [teamState]);

  const initialFormValues: IAddDrugMonitorInJournalSearch = {
    monitorId: "",
    monitorName: "",
    description: "",
    startDate: "",
    endDate: "",
    publishBeforeMSHDate: "",
    selectedPurpose: "",
    selectedResearchUpdate: "NA",
    selectedReviewTeam: "NA",
    selectedQCTeam: "NA",
    selectedCheckboxes: sourceCheckboxes,
    non_english: false,
    sourceCheckboxes: { ...sourceCheckboxes }, // Assuming sourceCheckboxes is the initial value for checkboxes
  };
  const currentDate = new Date();
  const [formValues, setFormValues] = useState(initialFormValues);

  const handleAutoExclusionCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleAutoCheckboxChange(
      sourceCheckboxes,
      setSourceCheckboxes,
      setAutoExclusionCheckbox,
      e.target.checked
    );
    setShowDatePicker(e.target.checked);
  };

  const handleOtherCheckboxChanges = (name: string, checked: boolean) => {
    handleOtherCheckboxChange(
      name,
      checked,
      setAutoExclusionCheckbox,
      handleSourceCheckboxChange
    );
    if (name === "Publish before MAH date") {
      setShowDatePicker(checked);
    }
  };

  const handleSourceCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    handleCheckboxChange(
      e,
      sourceCheckboxes,
      setSourceCheckboxes,
      formValues,
      setFormValues,
      "selectedCheckboxes"
    );
  };

  const PreMonitorFilterData: string | null = LocalStorage.getItem(
    CONSTANTS.LOCAL_STORAGE_KEYS.PRE_MONITOR_FILTER
  );
  const MonitorFilterData: PreMonitorFilter | null = PreMonitorFilterData
    ? (JSON.parse(PreMonitorFilterData) as PreMonitorFilter)
    : null;

  useEffect(() => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      countryOfOriginTags: { ...countryOfOriginTags },
    }));
  }, [countryOfOriginTags]);

  const handleAddButtonClick = async () => {
    try {
      const formValuesData = { ...formValues };
      if (formValuesData.monitorName === "") {
        const message = systemMessage.required.replace(
          "#field#",
          "Monitor Name"
        );
        Toast(message, { type: "error" });
        return;
      }
      if (formValuesData.startDate === "") {
        const message = systemMessage.required.replace("#field#", "From Date");
        Toast(message, { type: "error" });
        return;
      }
      if (formValuesData.endDate === "") {
        const message = systemMessage.required.replace("#field#", "To Date");
        Toast(message, { type: "error" });
        return;
      }
      if (
        formValuesData.selectedReviewTeam === "" ||
        formValuesData.selectedReviewTeam === "None"
      ) {
        const message = systemMessage.required.replace(
          "#field#",
          "Assign To Abstract Review Team"
        );
        Toast(message, { type: "error" });
        return;
      }
      if (
        formValuesData.selectedQCTeam === "" ||
        formValuesData.selectedQCTeam === "None"
      ) {
        const message = systemMessage.required.replace(
          "#field#",
          "Assign To QC Review"
        );
        Toast(message, { type: "error" });
        return;
      }

      if (
        formValuesData.selectedCheckboxes["Publish before MAH date"] &&
        formValuesData.publishBeforeMSHDate === ""
      ) {
        const message = systemMessage.required.replace(
          "#field#",
          "Publish before MAH date"
        );
        Toast(message, { type: "error" });
        return;
      }

      if (
        formValuesData.selectedReviewTeam === "NA" &&
        formValuesData.selectedQCTeam !== "NA"
      ) {
        setFormValues({
          ...formValues,
          selectedQCTeam: "NA",
        });
        Toast(systemMessage.AbstractReviewNoneValidationMessage, {
          type: "warning",
        });
        return;
      }
      if (
        formValuesData.selectedPurpose === "" ||
        formValuesData.selectedPurpose === "None"
      ) {
        const message = systemMessage.required.replace("#field#", "Purpose");
        Toast(message, { type: "error" });
        return;
      }

      if (
        formValuesData.selectedResearchUpdate === "" ||
        formValuesData.selectedResearchUpdate === "None"
      ) {
        const message = systemMessage.required.replace(
          "#field#",
          "Schedule Research Update"
        );
        Toast(message, { type: "error" });
        return;
      }
      // if(selectedCountry.length === 0) {
      //   const message = systemMessage.required.replace(
      //     "#field#",
      //     "Country Of Origin"
      //   );
      //   Toast(message, { type: "error" });
      //   return;
      // }
      setLoading(true);
      const payload = {
        pre_monitor_id: MonitorFilterData?.id,
        name: formValuesData.monitorName,
        description: formValuesData.description,
        purpose: formValuesData.selectedPurpose,
        frequency: formValuesData.selectedResearchUpdate,
        from_date: formValuesData.startDate ? formValuesData.startDate : "",
        to_date: formValuesData.endDate ? formValuesData.endDate : "",
        abstract_team_id:
          formValuesData.selectedReviewTeam !== "NA"
            ? formValuesData.selectedReviewTeam
            : undefined,
        qc_team_id:
          formValuesData.selectedQCTeam !== "NA"
            ? formValuesData.selectedQCTeam
            : undefined,
        non_english: formValuesData.non_english,
        is_animal_invitro:
          formValuesData.selectedCheckboxes["Animal / Invitro"],
        is_publish_before_mah_date:
          formValuesData.selectedCheckboxes["Publish before MAH date"],
        is_without_tag:
          formValuesData.selectedCheckboxes[
            "Without any tags (suspected AE, Patient identified & suspected Case)"
          ],
        mah_date: formValuesData.publishBeforeMSHDate || undefined,
        origin_countries: selectedCountry.map((tag) => tag.label),
        query_params: MonitorFilterData?.params
      };
      const response = await dispatch(addProductMonitorAsync(payload));
      if (addProductMonitorAsync.fulfilled.match(response)) {
        if (response?.payload?.status == 422) {
          if (response.payload.data) {
            const error = response.payload.data.detail;
            error.map((error: { loc: string[]; msg: string }) =>
              Toast(`${error.loc.join(":")}-${error.msg}`, { type: "error" })
            );
            setLoading(false);
            handelClose?.();
            return;
          }
        } else if (response?.payload?.data.status === "error") {
          Toast(response?.payload?.data.message, { type: "error" });
          setLoading(false);
          return;
        } else {
          Toast(systemMessage.add, { type: "success" });
          const payload = {
            pageNumber: 1,
            perPage: defaultPerPage,
          };
          dispatch(getProductMonitorAsync(payload));
          setFormValues(initialFormValues);
          handelClose?.();
        }
        setLoading(false);
        handelClose?.();
      } else {
        if (response.error.code === "ERR_BAD_REQUEST") {
          Toast(systemMessage.InValidMonitorDetails, { type: "error" });
        }
        setLoading(false);
        console.error(CONSTANTS.errorMessage.searchFailed, response.error);
      }
    } catch (error: unknown) {
      setLoading(false);
      console.error(CONSTANTS.errorMessage.unexpectedError, error);
    }
  };

  const checkSelected = (checkArray: Array<boolean>) => {
    const isSelectedLength = checkArray.filter((item) => item === true).length;
    return isSelectedLength > 0 && isSelectedLength < checkArray.length
      ? true
      : false;
  };

  const getTeamList = async () => {
    await dispatch(getTeamAsync());
  };

  return (
    <div className="modal-style p-4">
      <div className="divide-y-2 divide-blue-300">
        <div className="flex justify-between">
          <span className="text-sm mt-2 ml-4 text-14 font-medium text-black font-archivo ">
            Add Monitor
          </span>
          <div className="flex text-14 gap-2">
            <div className="p-2">
              <button
                className="font-Archivo cursor-pointer text-dimgray bg-transparent rounded-sm"
                onClick={handelClose}
              >
                Cancel
              </button>
            </div>
            <button
              className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
              onClick={handleAddButtonClick}
            >
              Add
            </button>
          </div>
        </div>
      </div>
      <div className="h-0.5 mt-2 w-full border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 " />
      <div className="container">
        <div className="flex text-14 flex-wrap">
          <div className="mb-10 px-1 w-[40%]">
            <div className="relative m-3">
              <input
                type="text"
                id="Monitor name"
                value={formValues.monitorName}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    monitorName: e.target.value,
                  })
                }
                className="block px-3 w-full  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
                    focus:outline-none focus:ring-0 focus:border-black peer"
                placeholder=""
              />
              <label
                className="absolute text-14 text-sm text-silver duration-300  font-archivo text-[1rem]
                transform -translate-y-4 scale-75 top-2 origin-[0] bg-white  peer-focus:px-2
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 
                 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
              >
                Monitor Name *
              </label>
            </div>
            <div className="relative mt-2 m-3">
              <textarea
                id="description"
                value={formValues.description}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    description: e.target.value,
                  })
                }
                className="block px-3 w-full h-[170px]  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
                    focus:outline-none focus:ring-0 focus:border-black peer"
                placeholder=""
              />
              <label
                className="absolute text-14 text-sm text-silver duration-300  font-archivo text-[1rem]
                transform -translate-y-4 scale-75 top-2 origin-[0] bg-white  peer-focus:px-2
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/4 
                 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-2"
              >
                Description
              </label>
            </div>
            <div className="flex flex-wrap divide-y ml-3">
              <div className="border flex border-gray cursor-pointer w-[230px]">
                <DatePicker
                  selected={
                    formValues.startDate ? new Date(formValues.startDate) : null
                  }
                  onChange={(date: null) =>
                    setFormValues({
                      ...formValues,
                      startDate: date ? format(date, "yyyy-MM-dd") : null,
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Screening Start Date *"
                  className="w-full relative text-14 rounded-md"
                  maxDate={
                    formValues.endDate ? new Date(formValues.endDate) : null
                  }
                />
                <Image
                  className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
                  alt=""
                  width={10}
                  height={10}
                  src="/assets/icons/calendarday-1.svg"
                />
              </div>
              <hr className="h-0.5 my-8 bg-red-900 border"></hr>
              <div className="flex cursor-pointer w-[230px]">
                <DatePicker
                  selected={
                    formValues.endDate ? new Date(formValues.endDate) : null
                  }
                  onChange={(date: Date) =>
                    setFormValues({
                      ...formValues,
                      endDate: date ? format(date, "yyyy-MM-dd") : null,
                    })
                  }
                  dateFormat="dd/MM/yyyy"
                  placeholderText="Screening End Date *"
                  className="w-full relative text-14 rounded-md"
                  minDate={
                    formValues.startDate ? new Date(formValues.startDate) : null
                  }
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
          </div>
          <div className="flex flex-wrap mb-4 mt-4 ml-16">
            <div>
              <div className="font-archivo mt-4 text-buttonGray font-normal text-sm">
                Special Situation
              </div>
              <div className="mt-3">
                <input
                  type="checkbox"
                  id={`${
                    checkSelected(Object.values(sourceCheckboxes))
                      ? "checkbox"
                      : ""
                  }`}
                  className={`w-4 h-4 form-checkbox border cursor-pointer uppercase border-black mr-2 text-violet bg-white-900 rounded-md`}
                  name={"Automatic INCLUSION of tag :"}
                  checked={autoExclusionCheckbox}
                  onChange={(e) => handleAutoExclusionCheckboxChange(e)}
                />
                <span className={`ml-2`}>Automatic EXCLUSION of tag :</span>
                {Object.keys(sourceCheckboxes).map(
                  (item: string, index: number) => (
                    <div className="mt-4 ml-8" key={item}>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 form-checkbox border cursor-pointer uppercase border-black mr-4 text-violet bg-white-900 rounded-md"
                          name={item}
                          checked={sourceCheckboxes[item]}
                          onChange={(e) =>
                            handleOtherCheckboxChanges(item, e.target.checked)
                          }
                        />
                        <span className="ml-0 w-[250px] break-words ">
                          {item.charAt(0).toUpperCase() + item.slice(1)}
                        </span>
                      </label>
                    </div>
                  )
                )}
              </div>
              <div>
                <p className="text-dimgray">Purpose *</p>
              </div>
              <div className="relative">
                <select
                  className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      selectedPurpose: e.target.value,
                    })
                  }
                  value={formValues.selectedPurpose}
                >
                  <option value="None">None</option>
                  <option value="ICSR Processing">ICSR Processing</option>
                  <option value="Aggregate Reporting">
                    Aggregate Reporting
                  </option>
                  <option value="Signal Management">Signal Management</option>
                </select>
              </div>
              <div className="flex mt-3">
                <div className="ml-2">
                  <input
                    type="checkbox"
                    checked={formValues.non_english}
                    onChange={(e) => {
                      const value = e.target.checked;
                      setFormValues({
                        ...formValues,
                        non_english: value,
                      });
                    }}
                    className={`w-4 h-4 form-checkbox border uppercase border-black mr-4 text-violet bg-white-900 rounded-md`}
                  />
                </div>
                <div className="text-dimgray mt-1">Non-English</div>
              </div>
              {showDatePicker && (
                <div className="relative border mt-4 border-gray cursor-pointer w-[230px]">
                  <DatePicker
                    selected={
                      formValues.publishBeforeMSHDate
                        ? new Date(formValues.publishBeforeMSHDate)
                        : null
                    }
                    onChange={(date: null) =>
                      setFormValues({
                        ...formValues,
                        publishBeforeMSHDate: date
                          ? format(date, "yyyy-MM-dd")
                          : null,
                      })
                    }
                    dateFormat="dd/MM/yyyy"
                    placeholderText="Publish Before MAH Date"
                    className="w-full text-14 rounded-md"
                    maxDate={new Date()}
                  />
                  <Image
                    className="absolute right-[12px] top-[10px] w-[1.25rem] h-[1.25rem] overflow-hidden"
                    alt=""
                    width={10}
                    height={10}
                    src="/assets/icons/calendarday-1.svg"
                  />
                </div>
              )}
            </div>

            <div className="ml-6">
              <div>
                <p className="text-dimgray">Schedule Research Update</p>
              </div>
              <div className="relative">
                <select
                  className="block cursor-pointer text-14 w-[300px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      selectedResearchUpdate: e.target.value,
                    })
                  }
                  value={formValues.selectedResearchUpdate}
                >
                  <option value="NA">None</option>
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div className="mt-2">
                <p className="text-dimgray capitalize">
                  assign to Abstract review team
                </p>
              </div>
              <div className="relative">
                <select
                  className="block cursor-pointer text-14 w-[300px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormValues({
                      ...formValues,
                      selectedReviewTeam: value,
                      selectedQCTeam:
                        value === "NA" ? "NA" : formValues.selectedQCTeam,
                    });
                    if (value === "NA" && formValues.selectedQCTeam !== "NA") {
                      Toast(systemMessage.AbstractReviewNoneValidationMessage, {
                        type: "warning",
                      });
                    }
                  }}
                  value={formValues.selectedReviewTeam}
                >
                  <option value="NA"> None </option>
                  {abstractTeam.map((item: any, index: number) => (
                    <option key={index} value={item["id"]}>
                      {item["name"]}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <p className="text-dimgray capitalize">assign to QC review</p>
              </div>
              <div className="relative">
                <select
                  className="block cursor-pointer text-14 w-[300px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormValues({
                      ...formValues,
                      selectedQCTeam: value,
                    });
                  }}
                  value={formValues.selectedQCTeam}
                >
                  <option value="NA"> None </option>
                  {QCTeam.map((item: any, index: number) => (
                    <option key={index} value={item["id"]}>
                      {item["name"]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-[300px] relative mt-4">
                <CreatableSelect
                  placeholder="Exclude country of article published"
                  isClearable
                  isDisabled={loading}
                  isLoading={loading}
                  onChange={(newValue) => {
                    setSelectedCountry(newValue as Option[]);
                  }}
                  options={countryOptions}
                  isMulti
                  value={selectedCountry}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      {loading && <LoadingSpinner />}
    </div>
  );
};

export default AddMonitorModal;
