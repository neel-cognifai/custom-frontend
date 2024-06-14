"use client";
import { CONSTANTS, STATUS } from "@/common/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAppSelector, useAppDispatch } from "@/redux/store";
import {
  AbstractMonitorDetailsAsync,
  AbstractMonitorDetailsCountsAsync,
  AbstractReviewDataState,
  AbstractReviewMonitorDuplicateTotalRecordIdAsync,
  AbstractReviewMonitorInValidICSRTotalRecordIdAsync,
  AbstractReviewMonitorPotentialICSRTotalRecordIdAsync,
} from "../abstract-review.slice";
import Image from "next/image";
import LoadingSpinner from "@/common/LoadingSpinner";
import { CountData, IMonitorDetails } from "../abstract.model";
import ValidICSR from "../AbstractReviewSecondPage/ValidICSR";
import Duplicates from "../Duplicates";
import PotentialICSR from "../AbstractReviewSecondPage/Potential ICSR";
import InVaildICSR from "../AbstractReviewSecondPage/inValidICSR";

const AbstractReviewSecondPage = (context: { params: any }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [abstractCountsDetails, setAbstractCountsDetails] =
    useState<CountData | null>(null);
  const [abstractMonitorDetails, setAbstractMonitorDetails] =
    useState<IMonitorDetails | null>(null);
  const dispatch = useAppDispatch();
  const handleTabChange = (tabIndex: React.SetStateAction<number>) => {
    setActiveTab(tabIndex);
  };
  const {
    status,
    abstractReviewMontior,
    abstractMonitorDetailsCountsDetails,
    monitorDetail,
    AbstractReviewMonitorValidICSRTotalRecord,
    AbstractReviewMonitorPotentialICSRTotalRecord,
    AbstractReviewMonitorInValidICSRTotalRecord,
    AbstractReviewMonitorDuplicatesTotalRecord,
  } = useAppSelector(AbstractReviewDataState);
  const { params } = context;
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validICSRCount, setValidICSRCount] = useState<number>(0);
  const [inValidICSRCount, setInValidICSRCount] = useState<number>(0);
  const [potentialICSRCount, setPotentialICSRCount] = useState<number>(0);
  const [duplicatesCount, setDuplicatesCount] = useState<number>(0);

  const monitor_id = params?.monitor_id as string;

  useEffect(() => {
    setIsLoading(true);
    dispatch(AbstractMonitorDetailsCountsAsync(monitor_id));
    dispatch(AbstractMonitorDetailsAsync(monitor_id));
    setIsLoading(false);
  }, [monitor_id]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setValidICSRCount(AbstractReviewMonitorValidICSRTotalRecord);
      setAbstractCountsDetails(abstractMonitorDetailsCountsDetails);
      setAbstractMonitorDetails(monitorDetail);
    } else if (status === STATUS.rejected) {
      setAbstractCountsDetails(null);
    } else {
      setAbstractCountsDetails(null);
      setAbstractMonitorDetails(null);
    }
  }, [
    abstractReviewMontior,
    abstractMonitorDetailsCountsDetails,
    status,
    monitorDetail,
    AbstractReviewMonitorValidICSRTotalRecord,
  ]);

  useEffect(() => {
    dispatch(AbstractReviewMonitorPotentialICSRTotalRecordIdAsync(monitor_id));
    dispatch(AbstractReviewMonitorInValidICSRTotalRecordIdAsync(monitor_id));
    dispatch(AbstractReviewMonitorDuplicateTotalRecordIdAsync(monitor_id));
  }, []);

  useEffect(() => {
    setPotentialICSRCount(AbstractReviewMonitorPotentialICSRTotalRecord);
    setInValidICSRCount(AbstractReviewMonitorInValidICSRTotalRecord);
    setDuplicatesCount(AbstractReviewMonitorDuplicatesTotalRecord);
  }, [
    status,
    AbstractReviewMonitorPotentialICSRTotalRecord,
    AbstractReviewMonitorInValidICSRTotalRecord,
    AbstractReviewMonitorDuplicatesTotalRecord,
  ]);

  const tabs = [
    {
      label: "Valid ICSR",
      content: (
        <ValidICSR
          monitor_id={monitor_id}
          label={CONSTANTS.EXPERT_REVIEW_DECISION_VALID_ICSR}
        />
      ),
      count: validICSRCount,
    },
    {
      label: "Potential ICSR",
      content: (
        <PotentialICSR
          monitor_id={monitor_id}
          label={CONSTANTS.EXPERT_REVIEW_DECISION_POTENTIAL_ICSR}
        />
      ),
      count: potentialICSRCount,
    },
    {
      label: "Invalid ICSR",
      content: (
        <InVaildICSR
          monitor_id={monitor_id}
          label={CONSTANTS.EXPERT_REVIEW_DECISION_INVALID_ICSR}
        />
      ),
      count: inValidICSRCount,
    },
    {
      label: "Duplicates",
      content: (
        <Duplicates
          monitor_id={monitor_id}
          label={CONSTANTS.SEARCH_RESULT_STATUS_DUPLICATE}
        />
      ),
      count: duplicatesCount,
    },
  ];

  const statusCards = [
    {
      count: abstractCountsDetails?.pending,
      text: "In queue",
      color: "status-card-1",
    },
    {
      count: abstractCountsDetails?.author_followup_required,
      text: "Pending author follow up",
      color: "status-card-2",
    },
    {
      count: abstractCountsDetails?.full_text_required,
      text: "Pending full text",
      color: "status-card-3",
    },
    {
      count: abstractCountsDetails?.translation_required,
      text: "Pending translation",
      color: "status-card-4",
    },
    {
      count: abstractCountsDetails?.reviewed,
      text: "Reviewed",
      color: "status-card-5",
    },
  ];
  return (
    <React.Fragment>
      <div>
        <div className="absolute top-[30px]">
          <div className="flex ml-2 items-center">
            <Link
              className="no-underline"
              href={CONSTANTS.ROUTING_PATHS.abstractReview}
            >
              <div className="absolute w-[1.1rem]">
                <Image
                  className="absolute w-[100%]"
                  alt=""
                  src="/assets/icons/left-arrow.png"
                  width={15}
                  height={15}
                />
              </div>
              <div className="absolute left-[25px] text-black ml-2 top-[2%] capitalize">
                <span className="no-underline text-14">Back</span>
              </div>
            </Link>
          </div>
        </div>
        <section className="mt-0 w-100 h-auto text-14 bg-white  custom-box-shadow">
          <div className="flex justify-between">
            <div className="m-2 flex">
              <div className="mt-2 w-[5px] h-[130px] bg-violet rounded-lg border border-gray-300"></div>
              <div className="ml-6 my-2">
                <div className="text-violet mt-2 mb-4 monitor-name-font"></div>
                <div className="text-black mb-2">
                  ID : {abstractMonitorDetails?.monitor_id ?? ""}
                </div>
                <div className="text-black mb-2">
                  Monitor Name : {abstractMonitorDetails?.name ?? ""}
                </div>
                <div className="text-dimgray mb-2">
                  Date Created :{" "}
                  {abstractMonitorDetails?.created_on
                    ? abstractMonitorDetails?.created_on.split("T")[0]
                    : "-"}
                </div>
                <div className="text-dimgray mb-2">
                  Screening Start Date:{" "}
                  {abstractMonitorDetails?.from_date ?? ""}
                </div>
                <div className="text-dimgray mb-2">
                  Screening End Date : {abstractMonitorDetails?.to_date ?? ""}
                </div>
              </div>
            </div>
            <div className="bg-violet px-4 py-4 mt-4 w-60 mb-4 circle-progress-bar-style">
              <span className="text-white text-14"> % Valid ICSR</span>
              <div className="flex text-14 mt-2">
                <div className="w-2/5">
                  <div className="circular-progressbar-style w-1/2">
                    <CircularProgressbar
                      text={`${abstractCountsDetails?.valid_percentage ?? 0}%`}
                      value={abstractCountsDetails?.valid_percentage ?? 0}
                      styles={{
                        path: {
                          stroke: "#F39200",
                        },
                        text: {
                          fill: "#F6C946",
                          fontSize: "16px",
                        },
                      }}
                    />
                  </div>
                </div>
                <div className="w-full ml-12 status-text">
                  <div className="flex">
                    <span className="text-white ml-6"> Total:</span>
                    <div className="text-white ml-2">
                      <span>{abstractCountsDetails?.total ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex mt-4">
                    <span className="text-white">Valid ICSR:</span>
                    <div className="text-white ml-2">
                      <span>{abstractCountsDetails?.valid_icsr ?? 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="my-4 p-2 mb-4">
              <span className="text-xs mt-1 pt-1">Status Progress</span>
              <div className="items-center mt-1">
                {/* Creating 5 sections */}
                {statusCards.map((card, index) => (
                  <div
                    key={index}
                    className="inline-block rounded-lg text-white text-center relative"
                  >
                    <div
                      className={`w-10 h-10 rounded-border ${card.color} flex items-center justify-center rounded-sm mx-4 my-1`}
                    >
                      <span className="text-white font-bold">
                        {card.count ? card.count : 0}
                      </span>
                    </div>
                    <div className="absolute w-full h-full rounded-full flex items-center justify-center">
                      <div className="p-2 rounded-md text-black">
                        <p className="status-text">{card.text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="main bg-white mt-0 w-[100%] custom-box-shadow">
            <ul className="flex flex-wrap bg-tabColor cursor-pointer text-sm font-medium text-center border-b border-gray-200 ">
              {tabs.map((tab, index) => (
                <span
                  key={index}
                  className={`inline-block pl-4 pr-12 py-4 -ml-[40px] ${
                    activeTab === index ? "bg-white" : "bg-tabColor"
                  } text-violet  text-base font-medium text-14 font-archiv rounded-tl-md rounded-tr-md `}
                  onClick={() => handleTabChange(index)}
                >
                  {tab.label}
                  {tab.count !== 0 ? (
                    <span className="bg-violet text-white rounded-2xl ml-2 px-3 py-2">
                      {tab.count}
                    </span>
                  ) : (
                    <span className="bg-violet text-white rounded-2xl ml-2 px-3 py-2">
                      {"0"}
                    </span>
                  )}
                </span>
              ))}
            </ul>
            {tabs[activeTab].content}
          </div>
        </section>
        {isLoading && <LoadingSpinner />}
      </div>
    </React.Fragment>
  );
};

export default AbstractReviewSecondPage;
