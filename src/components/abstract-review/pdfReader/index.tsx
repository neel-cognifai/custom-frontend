"use client";
import React, { useEffect, useState } from "react";
import { CONSTANTS, STATUS, tagsAbstract } from "@/common/constants";
import { useSelector } from "react-redux";
import { AppState, useAppDispatch, useAppSelector } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import {
  AbstractReviewDataState,
  pdfFileDataAPIAsync,
} from "../abstract-review.slice";
import { IThirdPageAbstractData } from "../abstract.model";
const PDFReader = (context: { params: any }) => {
  const dispatch = useAppDispatch();
  type tag = string;
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const pmid = params?.pmid as string;
  const search_result_id = params?.search_result_id as string;
  const File = useSelector((state: AppState) => state.selectedItemData.file);
  const [selectedAITags, setSelectedAITags] = useState<any>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<tag[]>([]);
  const { status, previewURL } = useAppSelector(AbstractReviewDataState);
  const { abstractReviewDetail, pdfFileDetils } = useAppSelector(
    AbstractReviewDataState
  );
  const [fetchAbstractReviewDetail, setFetchAbstractReviewDetail] =
    useState<IThirdPageAbstractData | null>(null);

  useEffect(() => {
    if (status === STATUS.fulfilled && abstractReviewDetail) {
      setFetchAbstractReviewDetail(abstractReviewDetail);
    }
  }, [abstractReviewDetail, status]);

  useEffect(() => {
    if (selectedAITags) {
      setKeys(Object.keys(selectedAITags));
      setSelectedTags(Object.keys(selectedAITags));
    }
  }, [selectedAITags]);

  useEffect(() => {
    if (search_result_id) {
      dispatch(pdfFileDataAPIAsync(search_result_id));
    }
  }, [search_result_id]);

  useEffect(() => {
    if (fetchAbstractReviewDetail !== undefined) {
      if (fetchAbstractReviewDetail) {
        setSelectedAITags(fetchAbstractReviewDetail.ai_tags);
      }
    }
  }, [fetchAbstractReviewDetail]);

  const isTagSelected = (tag: tag) => selectedTags.includes(tag);
  return (
    <div className="my-component flex justify-between">
      <div className="flex absolute top-6 ml-2 mt-3 items-center">
        <Link
          className="no-underline "
          href={`${CONSTANTS.ROUTING_PATHS.AbstractReview3}/${monitor_id}/${pmid}`}
        >
          <div className="absolute w-[1.1rem]">
            <Image
              className="absolute w-[100%]"
              width={15}
              height={15}
              alt=""
              src="/assets/icons/left-arrow.png"
            />
          </div>
          <div className="left-[25px] text-black ml-8 top-[2%] capitalize">
            <span className="no-underline">Back</span>
          </div>
        </Link>
      </div>
      <div className="abstract-box-style">
        <div className="bg-gray-900 p-4">
          <iframe
            src={previewURL.file_path}
            style={{ width: "100%", height: "600px", border: "none" }}
          ></iframe>
        </div>
        <div className="text-14 absolute box-border-style w-fit rounded-lg mt-4">
          <div className="w-auto flex m-3">
            <div className="ml-3 font-semibold flex text-black">
              Generative AI Assisted Decision :
              <span className="font-bold ml-2 text-violet">
                {pdfFileDetils?.decision ?? "-"}
              </span>
            </div>
            <div className="mx-2">|</div>
            <div className="flex ml-3">
              <div className="font-semibold text-black">Confidence Score:</div>
              <div className="ml-1">
                {pdfFileDetils?.confidence_score ?? "-"}
              </div>
            </div>
            <div className="mx-2">|</div>
            <div className="ml-2">
              <span className="font-semibold text-black">Reasons</span>:
              {pdfFileDetils?.reason ?? "-"}
            </div>
          </div>
          <div className="mt-4 ml-6 mb-2 mr-2 content-box text-14">
            Summary : {pdfFileDetils?.summary ?? "-"}
          </div>
        </div>
      </div>
      <div className="w-full tagging-box text-14 bg-red-900 py-4 px-4">
        <div>
          <div className="text-14">
            <div>
              <p className="text-14 font-semibold ml-2 text-silvers">
                Main entities
              </p>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap patient-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected("Patient") ? "patient-selected" : ""
                  } ${!keys.includes("Patient") ? "disable-div" : ""}`}
                >
                  Patient
                  <div
                    className={`${
                      !keys.includes("Patient")
                        ? "disable-circle"
                        : "bg-[#ed6060]"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap animal-in-vitro-tagging ml-1 cursor-pointer px-1 py-1 ${
                    isTagSelected("Animal/In-Vitro")
                      ? "animal-in-vitro-selected"
                      : ""
                  } ${keys.includes("Animal/In-Vitro") ? "" : "disable-div"}`}
                >
                  Animal/In-Vitro
                  <div
                    className={`${
                      keys.includes("Animal/In-Vitro")
                        ? "bg-[#0e75a1]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap interesting-events-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected(
                      tagsAbstract["Interesting events / observations"]
                    )
                      ? "interesting-events-selected"
                      : ""
                  }${
                    keys.includes(
                      tagsAbstract["Interesting events / observations"]
                    )
                      ? ""
                      : "disable-div"
                  }`}
                >
                  Adverse event
                  <div
                    className={`${
                      keys.includes(
                        tagsAbstract["Interesting events / observations"]
                      )
                        ? "bg-[#ed6060]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>
                </div>
                <div
                  className={`flex flex-wrap  medications-tagging ml-1 cursor-pointer px-1 py-1 ${
                    isTagSelected("Medications") ? "medications-selected" : ""
                  } ${keys.includes("Medications") ? "" : "disable-div"}`}
                >
                  Medications
                  <div
                    className={`${
                      keys.includes("Medications")
                        ? "bg-[#1a96e1]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap">
                <div
                  className={`flex flex-wrap branding-tagging cursor-pointer mb-2 px-1 py-1 ${
                    isTagSelected("Branding") ? "branding-selected" : ""
                  } ${keys.includes("Branding") ? "" : "disable-div"}`}
                >
                  Branding
                  <div
                    className={`${
                      keys.includes("Branding")
                        ? "bg-[#c3bebe]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap pediatric-tagging cursor-pointer mb-2 mt-1 ml-1 px-1 py-2 ${
                    isTagSelected(tagsAbstract.Pediatric)
                      ? "pediatric-selected"
                      : ""
                  } ${keys.includes("Pediatric") ? "" : "disable-div"}`}
                >
                  Pediatric
                  <div
                    className={`${
                      keys.includes("Pediatric")
                        ? "bg-[#9cf79c]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex flex-wrap pregnancy-fetus-foetus-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected(tagsAbstract["Pregnancy/fetus/foetus"])
                      ? "pregnancy-fetus-foetus-selected"
                      : ""
                  } ${
                    keys.includes("Pregnancy/fetus/foetus") ? "" : "disable-div"
                  }`}
                >
                  Pregnancy/fetus/foetus
                  <div
                    className={`${
                      keys.includes("Pregnancy/fetus/foetus")
                        ? "bg-[#ed6060]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                <div
                  className={`flex flex-wrap elderly-tagging cursor-pointer ml-1 px-1 py-1 ${
                    isTagSelected(tagsAbstract.Elderly)
                      ? "elderly-selected"
                      : ""
                  } ${keys.includes("Elderly") ? "" : "disable-div"}`}
                >
                  Elderly
                  <div
                    className={`${
                      keys.includes("Elderly")
                        ? "bg-[#ade0ff]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
              </div>
            </div>
            <div>
              <p className="text-14 font-semibold ml-2 text-silvers">
                Medical Event
              </p>
              <div className="flex flex-wrap mb-2">
                <div
                  className={`flex mb-2 flex-wrap designated-medical-event-tagging cursor-pointer px-1 py-1 ${
                    isTagSelected("Designated Medical Event")
                      ? "designated-medical-event-selected"
                      : ""
                  }  ${
                    keys.includes("Designated Medical Event")
                      ? ""
                      : "disable-div"
                  }`}
                >
                  Designated Medical Event
                  <div
                    className={`${
                      keys.includes("Designated Medical Event")
                        ? "bg-[#fab44a]"
                        : "disable-circle"
                    } rounded-lg w-4 h-4`}
                  ></div>{" "}
                </div>
                {/* <div
                      className={`flex flex-wrap mb-2 important-medical-event-tagging cursor-pointer px-1 py-1 ${
                        isTagSelected("Important medical event(IME)")
                          ? "important-medical-event-selected"
                          : ""
                      }  ${
                        keys.includes("Important medical event(IME")
                          ? ""
                          : "disable-div"
                      }`}
                      onClick={() => toggleTag("Important medical event(IME)")}
                    >
                      Important medical event(IME)
                      <div className="rounded-lg bg-[#A85D67] w-4 h-4"></div>
                    </div> */}
              </div>
            </div>
            <p className="text-14 font-semibold ml-2 text-silvers">
              Additional entities{" "}
            </p>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap  diagnosis-tagging ml-1 cursor-pointer px-1 py-1 ${
                isTagSelected("Diagnosis /Diagnostic Procedure")
                  ? "diagnosis-selected"
                  : ""
              } ${
                keys.includes("Diagnosis /Diagnostic Procedure")
                  ? ""
                  : "disable-div"
              }`}
            >
              Diagnosis
              <div
                className={`${
                  keys.includes("Diagnosis /Diagnostic Procedure")
                    ? "bg-[#9b769c]"
                    : "disable-circle"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
            <div
              className={`flex flex-wrap off-label-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["Off label"])
                  ? "off-label-selected"
                  : ""
              }  ${
                keys.includes(tagsAbstract["Off label"]) ? "" : "disable-div"
              }`}
            >
              {tagsAbstract["Off label"]}
              <div
                className={`${
                  keys.includes(tagsAbstract["Off label"])
                    ? "bg-[#7A727A]"
                    : "disable-circle"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap">
            <div
              className={`flex flex-wrap  diseases-tagging ml-1 cursor-pointer mb-2 px-1 py-1 ${
                isTagSelected("Diseases") ? "diseases-selected" : ""
              }${keys.includes("Diseases") ? "" : "disable-div"}`}
            >
              Diseases
              <div
                className={`${
                  keys.includes("Diseases") ? "bg-[#C595F5]" : "disable-circle"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
            <div
              className={`flex flex-wrap overdose-tagging cursor-pointer ml-1 mb-2 px-1 py-1 ${
                isTagSelected(tagsAbstract["Overdose"])
                  ? "overdose-selected"
                  : ""
              } ${keys.includes("Overdose") ? "" : "disable-div"}`}
            >
              Overdose
              <div
                className={`${
                  keys.includes("Overdose") ? "bg-[#40e0d0]" : "disable-circle"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap reviewed-tagging cursor-pointer px-1 py-1 ${
                isTagSelected(tagsAbstract["Study/Review/Clinical trial"])
                  ? "reviewed-selected"
                  : ""
              }${
                keys.includes(tagsAbstract["Study/Review/Clinical trial"])
                  ? ""
                  : "disable-div"
              }`}
            >
              Study / Review /Clinical trial
              <div
                className={`${
                  !keys.includes(tagsAbstract["Study/Review/Clinical trial"])
                    ? "disable-circle"
                    : "bg-[#ed6060]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap special-keywords-tagging cursor-pointer px-1 py-1 ${
                isTagSelected("Special Keywords")
                  ? "special-keywords-selected"
                  : ""
              }${keys.includes("Special Keywords") ? "" : "disable-div"}`}
            >
              Special Keywords
              <div
                className={`${
                  !keys.includes("Special Keywords")
                    ? "disable-circle"
                    : "bg-[#FA78FA]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap  patient-population-tagging ml-1 cursor-pointer px-1 py-1 ${
                isTagSelected("Patient population")
                  ? "patient-population-selected"
                  : ""
              }  ${keys.includes("Patient population") ? "" : "disable-div"}`}
            >
              Patient population
              <div
                className={`${
                  !keys.includes("Patient population")
                    ? "disable-circle"
                    : "bg-[#40E0D0]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap multiple-patients-tagging cursor-pointer px-1 py-1 ${
                isTagSelected("Multiple Patients")
                  ? "multiple-patients-selected"
                  : ""
              }  ${keys.includes("Multiple Patients") ? "" : "disable-div"}`}
            >
              Multiple Patients
              <div
                className={`${
                  !keys.includes("Multiple Patients")
                    ? "disable-circle"
                    : "bg-[#88fa73]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
            <div
              className={`flex flex-wrap history-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["History"]) ? "history-selected" : ""
              }  ${
                keys.includes(tagsAbstract["History"]) ? "" : "disable-div"
              }`}
            >
              {tagsAbstract["History"]}
              <div
                className={`${
                  !keys.includes(tagsAbstract["History"])
                    ? "disable-circle"
                    : "bg-[#EAE713]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap diagnosis-diagnostic-procedure-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["Diagnosis /Diagnostic Procedure"])
                  ? "diagnosis-diagnostic-procedure-selected"
                  : ""
              }  ${
                keys.includes(tagsAbstract["Diagnosis /Diagnostic Procedure"])
                  ? ""
                  : "disable-div"
              }`}
            >
              {tagsAbstract["Diagnosis /Diagnostic Procedure"]}
              <div
                className={`${
                  !keys.includes(
                    tagsAbstract["Diagnosis /Diagnostic Procedure"]
                  )
                    ? "disable-circle"
                    : "bg-[#9B769C]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap occupational-exposure-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(
                  tagsAbstract["Occupational exposure(OC exposure)"]
                )
                  ? "occupational-exposure-selected"
                  : ""
              }  ${
                keys.includes(
                  tagsAbstract["Occupational exposure(OC exposure)"]
                )
                  ? ""
                  : "disable-div"
              }`}
            >
              {tagsAbstract["Occupational exposure(OC exposure)"]}
              <div
                className={`${
                  !keys.includes(
                    tagsAbstract["Occupational exposure(OC exposure)"]
                  )
                    ? "disable-circle"
                    : "bg-[#ffdead]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap lack-of-efficacy-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["Lack of efficacy"])
                  ? "lack-of-efficacy-selected"
                  : ""
              }  ${
                keys.includes(tagsAbstract["Lack of efficacy"])
                  ? ""
                  : "disable-div"
              }`}
            >
              {tagsAbstract["Lack of efficacy"]}
              <div
                className={`${
                  !keys.includes(tagsAbstract["Lack of efficacy"])
                    ? "disable-circle"
                    : "bg-[#918e8e]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
            <div
              className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["Drug interaction"])
                  ? "drug-interaction-selected"
                  : ""
              }  ${
                keys.includes(tagsAbstract["Drug interaction"])
                  ? ""
                  : "disable-div"
              }`}
            >
              {tagsAbstract["Drug interaction"]}
              <div
                className={`${
                  !keys.includes(tagsAbstract["Drug interaction"])
                    ? "disable-circle"
                    : "bg-[#a85d67]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap drug-interaction-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["Abuse/Drug misuse/drug dependence"])
                  ? "drug-interaction-selected"
                  : ""
              }  ${
                keys.includes(tagsAbstract["Abuse/Drug misuse/drug dependence"])
                  ? ""
                  : "disable-div"
              }`}
            >
              {tagsAbstract["Abuse/Drug misuse/drug dependence"]}
              <div
                className={`${
                  !keys.includes(
                    tagsAbstract["Abuse/Drug misuse/drug dependence"]
                  )
                    ? "disable-circle"
                    : "bg-[#ed6060]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
          <div className="flex flex-wrap mb-2">
            <div
              className={`flex flex-wrap medication-error-tagging cursor-pointer px-1 py-1 ml-1 ${
                isTagSelected(tagsAbstract["Medication error"])
                  ? "medication-error-selected"
                  : ""
              }  ${
                keys.includes(tagsAbstract["Medication error"])
                  ? ""
                  : "disable-div"
              }`}
            >
              {tagsAbstract["Medication error"]}
              <div
                className={`${
                  !keys.includes(tagsAbstract["Medication error"])
                    ? "disable-circle"
                    : "bg-[#c595f5]"
                } rounded-lg w-4 h-4`}
              ></div>{" "}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFReader;
