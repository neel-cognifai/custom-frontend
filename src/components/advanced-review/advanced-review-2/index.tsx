"use client";
import { CONSTANTS, STATUS } from "@/common/constants";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  CountData,
  IMonitorDetails,
} from "@/components/abstract-review/abstract.model";
import {
  AbstractMonitorDetailsAsync,
  AbstractReviewDataState,
} from "@/components/abstract-review/abstract-review.slice";
import Image from "next/image";
import {
  AdvanceMonitorDetailsCountsAsync,
  AdvanceReviewDataState,
  AdvanceReviewMonitorAbstractReviewPendingTotalRecordIdAsync,
  AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync,
} from "../advance-review.slice";
import LoadingSpinner from "@/common/LoadingSpinner";
import ValidICSR from "../QcReviewSecondPage/validICSR";
import InValidICSR from "../QcReviewSecondPage/inValidICSR";
import AbstractReviewPending from "../QcReviewSecondPage/AbstractReviewPending";

const AdvancedReviewSecondPage = (context: { params: any }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [abstractMonitorDetails, setAbstractMonitorDetails] =
    useState<IMonitorDetails | null>(null);
  const dispatch = useAppDispatch();
  const handleTabChange = (tabIndex: React.SetStateAction<number>) => {
    setActiveTab(tabIndex);
  };
  const [validICSRCount, setValidICSRCount] = useState<number>(0);
  const [inValidICSRCount, setInValidICSRCount] = useState<number>(0);
  const [abstractReviewPendingCount, setAbstractReviewPendingCount] =
    useState<number>(0);
  const [QCCountsDetails, setQCCountsDetails] = useState<CountData | null>(
    null
  );
  const {
    advanceReviewMonitor,
    status,
    AdvanceReviewMonitorValidICSRTotalRecord,
    AdvanceReviewMonitorInValidICSRTotalRecord,
    AdvanceReviewMonitorAbstractReviewPendingTotalRecord,
  } = useAppSelector(AdvanceReviewDataState);
  const { advanceMonitorDetailsCountsDetails } = useAppSelector(
    AdvanceReviewDataState
  );
  const { monitorDetail } = useAppSelector(AbstractReviewDataState);
  const { params } = context;
  const monitor_id = params?.monitor_id as string;

  useEffect(() => {
    setIsLoading(true);
    dispatch(AdvanceMonitorDetailsCountsAsync(monitor_id));
    dispatch(AbstractMonitorDetailsAsync(monitor_id));
    setIsLoading(false);
  }, [monitor_id, isLoading]);

  useEffect(() => {
    if (status === STATUS.fulfilled) {
      setValidICSRCount(AdvanceReviewMonitorValidICSRTotalRecord);
      setQCCountsDetails(advanceMonitorDetailsCountsDetails);
      setAbstractMonitorDetails(monitorDetail);
    } else if (status === STATUS.rejected) {
      // setFetchAdvanceReviewMonitor([]);
      setQCCountsDetails(null);
      // setAbstractMonitorDetails(null);
    } else {
      setQCCountsDetails(null);
      setAbstractMonitorDetails(null);
    }
  }, [
    advanceReviewMonitor,
    advanceMonitorDetailsCountsDetails,
    status,
    monitorDetail,
    AdvanceReviewMonitorValidICSRTotalRecord,
  ]);

  useEffect(() => {
    dispatch(
      AdvanceReviewMonitorAbstractReviewPendingTotalRecordIdAsync(monitor_id)
    );
    dispatch(AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync(monitor_id));
  }, []);

  useEffect(() => {
    setInValidICSRCount(AdvanceReviewMonitorInValidICSRTotalRecord);
    setAbstractReviewPendingCount(
      AdvanceReviewMonitorAbstractReviewPendingTotalRecord
    );
  }, [
    status,
    AdvanceReviewMonitorInValidICSRTotalRecord,
    AdvanceReviewMonitorAbstractReviewPendingTotalRecord,
  ]);

  const tabs = [
    {
      label: "Valid ICSR",
      content: <ValidICSR monitor_id={monitor_id} label={CONSTANTS.EXPERT_REVIEW_DECISION_VALID_ICSR} />,
      count: validICSRCount,
    },
    {
      label: "Invalid ICSR",
      content: <InValidICSR monitor_id={monitor_id} label={CONSTANTS.EXPERT_REVIEW_DECISION_INVALID_ICSR} />,
      count: inValidICSRCount,
    },
    {
      label: "Abstract Review Pending",
      content: (
        <AbstractReviewPending monitor_id={monitor_id} label={CONSTANTS.EXPERT_REVIEW_DECISION_PENDING} />
      ),
      count: abstractReviewPendingCount,
    },
    // {
    //   label: "Decision Pending",
    //   content: (
    //     <QcReviewSecondPage
    //       responseData={abstractReviewPending}
    //       monitor_id={monitor_id}
    //       totalRecords={totalRecords}
    //       label={"Abstract Review Pending"}
    //     />
    //   ),
    //   count: abstractReviewPending.length,
    // },
  ];
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
  };

  const statusCards = [
    {
      count: QCCountsDetails?.pending,
      text: "Decision pending",
      color: "status-card-1",
    },
    {
      count: QCCountsDetails?.author_followup_required,
      text: "Pending author follow up",
      color: "status-card-2",
    },
    {
      count: QCCountsDetails?.full_text_required,
      text: "Pending full text",
      color: "status-card-3",
    },
    {
      count: QCCountsDetails?.translation_required,
      text: "Pending translation",
      color: "status-card-4",
    },
    {
      count: QCCountsDetails?.reviewed,
      text: "Reviewed",
      color: "status-card-5",
    },
  ];

  return (
    <div>
      <div className="absolute top-[30px]">
        <div className="flex ml-2 items-center">
          <Link
            className="no-underline mt-1	flex"
            href={CONSTANTS.ROUTING_PATHS.advancedReview}
          >
            <div className="absolute w-[1.1rem]">
              <Image
                className="absolute mt-1 w-[100%]"
                width={12}
                height={12}
                alt=""
                src="/assets/icons/left-arrow.png"
              />
            </div>
            <div className=" text-black ml-6 capitalize">
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
                      text={`${QCCountsDetails?.valid_percentage ?? 0}%`}
                      value={QCCountsDetails?.valid_percentage ?? 0}
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
                      <span>{QCCountsDetails?.total ?? 0}</span>
                    </div>
                  </div>
                  <div className="flex mt-4">
                    <span className="text-white">Valid ICSR:</span>
                    <div className="text-white ml-2">
                      <span>{QCCountsDetails?.valid_icsr ?? 0}</span>
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
                className={`inline-block text-14 pl-4 pr-12 py-4 -ml-[40px] ${
                  activeTab === index ? "bg-white" : "bg-tabColor"
                } text-violet text-base font-archivo rounded-tl-md rounded-tr-md `}
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
          {/* Render active tab content */}
          {tabs[activeTab].content}
        </div>
      </section>
      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default AdvancedReviewSecondPage;
