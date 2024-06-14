"use client";
import React from "react";
import { CONSTANTS } from "@/common/constants";
import { useSelector } from "react-redux";
import { AppState, useAppSelector } from "@/redux/store";
import Link from "next/link";
import Image from "next/image";
import { AbstractReviewDataState } from "../abstract-review.slice";

const PDFReaderFromTable = (context: { params: any }) => {
  const { params } = context;
  const monitor_id = params?.monitor_id as string;
  const File = useSelector((state: AppState) => state.selectedItemData.file);
  const { status, previewURL } = useAppSelector(AbstractReviewDataState);
  return (
    <div className="my-component flex justify-between">
      <div className="flex absolute top-6 ml-2 mt-3 items-center">
        <Link
          className="no-underline "
          href={`${CONSTANTS.ROUTING_PATHS.advancedReview2}/${monitor_id}`}
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
      <iframe
        src={previewURL.file_path}
        style={{ width: "100%", height: "600px", border: "none" }}
      ></iframe>
    </div>
  );
};

export default PDFReaderFromTable;
