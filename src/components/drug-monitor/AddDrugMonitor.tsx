import Modal from "@/common/modal/model";
import UploadModal from "@/common/modal/uploadfileModal";
import React, { ChangeEvent, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import Image from "next/image";
import { STATUS, countriesArray, defaultPerPage } from "@/common/constants";
import {
  handleAutoCheckboxChange,
  handleCheckboxChange,
  handleOtherCheckboxChange,
} from "../../../utils/checkboxUtils";
import { CONSTANTS, systemMessage } from "@/common/constants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import {
  addProductMonitorAsync,
  getProductMonitorAsync,
  editMonitorAsync,
  productMonitorState,
  getTeamAsync,
} from "./productMonitor.slice";
import {
  IAddDrugMonitor,
  IAddDrugMonitorInJournalSearch,
  IEditDrugMonitor,
  IEditMonitorData,
  ITeam,
} from "./productMonitor.model";
import LoadingSpinner from "@/common/LoadingSpinner";
import Toast from "@/common/Toast";
import TagInput, { Tag } from "@/common/tagInputMonitor/tagInput";
import { format } from "date-fns";
import CreatableSelect from "react-select/creatable";

export interface IUploadFile {
  name: string | undefined;
  selectedFormatType: string;
  selectedFile: Blob | null;
  id: string;
}
export interface ICheckboxState {
  [key: string]: boolean;
}

interface Option {
  readonly label: string;
  readonly value: string;
}
interface Props {
  handelClose?: () => void;
  editMonitorId?: string;
}
const AddDrugMonitor: React.FC<Props> = ({ handelClose, editMonitorId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
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
  const [hideFileUpload, setHideFileUpload] = useState(true);
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
    getTeamList();
  }, [sourceCheckboxes]);

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
    startDate: null,
    endDate: null,
    publishBeforeMSHDate: null,
    uploadModalValues: {
      selectedFormatType: "",
      selectedFile: null,
      name: undefined,
      id: "",
    },
    non_english: false,
    selectedPurpose: "",
    selectedResearchUpdate: "",
    selectedReviewTeam: "NA",
    selectedQCTeam: "NA",
    selectedCheckboxes: sourceCheckboxes,
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

    if (e.target.checked) {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
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

  const handleCountryOfOriginTagAdded = (tag: Tag) => {
    setCountryOfOriginTags((prevTags) => [...prevTags, tag]);
  };
  const handleCountryOfOriginTagRemoved = (index: number) => {
    const updatedTags = [...countryOfOriginTags];
    updatedTags.splice(index, 1);
    setCountryOfOriginTags(updatedTags);
  };

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

      if (
        formValuesData.startDate === "" ||
        formValuesData.startDate === null
      ) {
        const message = systemMessage.required.replace("#field#", "From Date");
        Toast(message, { type: "error" });
        return;
      }
      if (formValuesData.endDate === "" || formValuesData.endDate === null) {
        const message = systemMessage.required.replace("#field#", "To Date");
        Toast(message, { type: "error" });
        return;
      }
      // if (countryOfOriginTags === null) {
      //   const message = systemMessage.required.replace(
      //     "#field#",
      //     "Country Of Origin"
      //   );
      //   Toast(message, { type: "error" });
      //   return;
      // }
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
        formValuesData.selectedPurpose === "" ||
        formValuesData.selectedPurpose === "None"
      ) {
        const message = systemMessage.required.replace("#field#", "Purpose");
        Toast(message, { type: "error" });
        return;
      }

      if (hideFileUpload) {
        if (
          formValuesData?.uploadModalValues?.selectedFormatType === "" &&
          formValuesData?.uploadModalValues?.selectedFile == null
        ) {
          const message = systemMessage.required.replace(
            "#field#",
            "Attach doc"
          );
          Toast(message, { type: "error" });
          return;
        }
      }

      if (
        formValuesData.selectedCheckboxes["Publish before MAH date"] &&
        formValuesData.publishBeforeMSHDate === null
      ) {
        const message = systemMessage.required.replace(
          "#field#",
          "Publish before MAH date"
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

      setLoading(true);
      const payload = {
        pre_monitor_id: formValuesData.uploadModalValues?.id,
        name: formValuesData.monitorName,
        description: formValuesData.description,
        purpose: formValuesData.selectedPurpose,
        frequency: formValuesData.selectedResearchUpdate || undefined,
        from_date: formValuesData.startDate ? formValuesData.startDate : "",
        to_date: formValuesData.endDate ? formValuesData.endDate : "",
        abstract_team_id: formValuesData.selectedReviewTeam !== "NA" ? formValuesData.selectedReviewTeam : undefined,
        qc_team_id: formValuesData.selectedQCTeam !== "NA" ? formValuesData.selectedQCTeam : undefined,
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
      };
      const response = await dispatch(addProductMonitorAsync(payload));
      if (addProductMonitorAsync.fulfilled.match(response)) {
        if (response.payload.status == 422) {
          if (response.payload.data) {
            const error = response.payload.data.detail;
            error.map((error: any) =>
              Toast(`${error.loc.join(":")}-${error.msg}`, { type: "error" })
            );
            setLoading(false);
            return;
          }
        } else if (response.payload.data.status === "error") {
          Toast(response.payload.data.message, { type: "error" });
          setLoading(false);
          return;
        } else {
          if (!hideFileUpload) {
            Toast(systemMessage.update, { type: "success" });
            if (handelClose) {
              handelClose();
            }
          } else {
            Toast(systemMessage.AfterSuccessAddMonitorMessage, {
              type: "success",
            });
            if (handelClose) {
              handelClose();
            }
          }
          const payload = {
            pageNumber: 1,
            perPage: defaultPerPage,
          };
          dispatch(getProductMonitorAsync(payload));
          setFormValues(initialFormValues);
        }
        setFormValues(initialFormValues);
        setLoading(false);
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

  const handleFileDelete = () => {
    setFormValues((prevFormValues) => ({
      ...prevFormValues,
      selectedFile: null,
    }));
    setUploadModalOpen(false);
  };

  const checkSelected = (checkArray: Array<boolean>) => {
    const isSelectedLength = checkArray.filter((item) => item === true).length;
    return isSelectedLength > 0 && isSelectedLength < checkArray.length
      ? true
      : false;
  };

  useEffect(() => {
    if (editMonitorId !== "" && editMonitorId !== undefined) {
      setHideFileUpload(false);
      getEditMonitorData(editMonitorId);
    } else {
      setFormValues(initialFormValues);
    }
  }, [editMonitorId]);

  useEffect(() => {
    if (
      editMonitorStatus == STATUS.fulfilled &&
      editMonitorId !== "" &&
      editMonitorId !== undefined
    ) {
      const editMonitorData =
        editMonitorDataState as unknown as IEditMonitorData;
      if (editMonitorData) {
        const {
          monitor_id,
          monitorname,
          description,
          schedule_duration,
          start_date,
          end_date,
          purpose,
          country_of_origin,
          qc_team,
          abstract_team,
        } = editMonitorData;

        const formattedStartDate = start_date
          ? new Date(start_date).toISOString()
          : null;
        const formattedEndDate = end_date
          ? new Date(end_date).toISOString()
          : null;

        if (country_of_origin) {
          country_of_origin.map((value: string) => {
            const countryArray: string[] = value.split(",");
            countryArray.map((char: string) =>
              setCountryOfOriginTags(() => [
                {
                  text: char,
                  type: "countryOfOriginTags",
                },
              ])
            );
          });
        }

        setFormValues({
          ...formValues,
          monitorId: monitor_id,
          monitorName: monitorname,
          description: description !== null ? description : "",
          selectedResearchUpdate: schedule_duration,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          selectedPurpose: purpose,
          selectedReviewTeam: abstract_team,
          selectedQCTeam: qc_team,
        });
      }
    } else {
      setFormValues(initialFormValues);
    }
  }, [editMonitorStatus, editMonitorDataState]);

  const getEditMonitorData = async (monitorId: string) => {
    setLoading(true);
    await dispatch(editMonitorAsync(monitorId));
    setLoading(false);
  };

  const getTeamList = async () => {
    await dispatch(getTeamAsync());
  };

  return (
    <React.Fragment>
      <section className="body-font text-14 cursor-pointer bg-white custom-box-shadow -mb-[110px]">
        <div className="container py-4 pr-4 divide-y-2 divide-blue-300">
          <div className="flex w-[97%] justify-between">
            <span className="text-sm mt-2 ml-4 font-medium text-black font-archivo ">
              Add Monitor
            </span>
            <div className="flex gap-2">
              <div className="p-2">
                <button
                  className="font-Archivo cursor-pointer  text-dimgray bg-transparent rounded-sm"
                  onClick={handelClose}
                >
                  Cancel
                </button>
              </div>
              {hideFileUpload && (
                <button
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={handleAddButtonClick}
                >
                  Add
                </button>
              )}
              {!hideFileUpload && (
                <button
                  className="font-Archivo cursor-pointer py-2 px-8 bg-yellow text-white rounded-md"
                  onClick={handleAddButtonClick}
                >
                  Update
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50 " />
        {/* <section className=" body-font flex"> */}
        <div className="container">
          <div className="flex flex-wrap">
            <div className="mb-10 px-4 w-[40%]">
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
                  className="block px-3 text-14 w-full h-[170px]  font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
                    focus:outline-none focus:ring-0 focus:border-black peer"
                  placeholder=""
                />
                <label
                  className="absolute text-sm text-silver duration-300  font-archivo text-[1rem]
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
                      formValues.startDate
                        ? new Date(formValues.startDate)
                        : null
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
                      formValues.startDate
                        ? new Date(formValues.startDate)
                        : null
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
              {hideFileUpload && (
                <div
                  className="flex ml-3 items-center justify-center w-full"
                  onClick={() => setUploadModalOpen(true)}
                >
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-34 border-2 border-gray border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    {!formValues?.uploadModalValues?.selectedFile ? (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image
                          src="/assets/icons/add-document.svg"
                          alt="add document"
                          width={30}
                          height={30}
                        />
                        <p className="m-2">
                          <span className="text-violet">Attach doc.*</span>
                        </p>
                        <p className="m-2 break-words w-96 items-center text-center justify-center font-Archivo text-md text-gray-100">
                          Only Pubmed NBIB / RIS, Embase Full text excel, Pubmed
                          email alerts and Custom format
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col text-14 items-center justify-center pt-5 pb-6">
                        <Image
                          src="/assets/icons/check.svg"
                          alt="add document"
                          width={30}
                          height={30}
                        />
                        <p className="m-2">
                          <span className="text-silver">File Uploaded</span>
                        </p>
                        <div className="flex flex-wrap items-center">
                          <p className="m-2 text-md text-gray-100">
                            {formValues.uploadModalValues.selectedFile.name}
                          </p>
                          <Image
                            src="/assets/icons/cross-circle.svg"
                            alt="check"
                            className="ml-2"
                            width={20}
                            height={20}
                            onClick={handleFileDelete}
                          />
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              )}
            </div>
            <div className="flex flex-wrap mb-4 mt-4 ml-16">
              <div>
                {hideFileUpload && (
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
                      <span className={`ml-2`}>
                        Automatic EXCLUSION of tag :
                      </span>
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
                                  handleOtherCheckboxChanges(
                                    item,
                                    e.target.checked
                                  )
                                }
                              />
                              <span className="ml-0 w-[250px] break-words ">
                                {item.charAt(0).toUpperCase() + item.slice(1)}
                              </span>
                            </label>
                          </div>
                        )
                      )}
                    </div>{" "}
                  </div>
                )}
                <div>
                  <p className="text-dimgray">Purpose *</p>
                </div>
                <div className="relative">
                  <select
                    className="block cursor-pointer text-14 w-[210px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        selectedPurpose: e.target.value,
                      })
                    }
                    value={formValues.selectedPurpose}
                    required
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
                  <div className="relative mt-4 border border-gray cursor-pointer w-[230px]">
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
                    className={`block cursor-pointer text-14 w-[300px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500 ${
                      !formValues.selectedResearchUpdate && "disabled-select"
                    }`}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        selectedResearchUpdate: e.target.value,
                      })
                    }
                    disabled
                    value={formValues.selectedResearchUpdate}
                  >
                    <option value="">None</option>
                    <option value="daily">Daily</option>
                    <option value="1 week">Weekly</option>
                    <option value="1 month">Monthly</option>
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
                      if (
                        value === "NA" &&
                        formValues.selectedQCTeam !== "NA"
                      ) {
                        Toast(
                          systemMessage.AbstractReviewNoneValidationMessage,
                          { type: "warning" }
                        );
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
        <Modal
          isOpen={uploadModalOpen}
          childElement={
            <UploadModal
              isOpen={uploadModalOpen}
              onClose={() => setUploadModalOpen(false)}
              onFileUpload={(file, selectedFormatType, id) => {
                setFormValues({
                  ...formValues,
                  uploadModalValues: {
                    selectedFormatType,
                    selectedFile: file,
                    name: file.name,
                    id: id,
                  },
                });
              }}
            />
          }
        />
        {loading && <LoadingSpinner />}
      </section>
    </React.Fragment>
  );
};

export default AddDrugMonitor;
