import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IDownload } from "@/components/drug-monitor/productMonitor.model";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import {
  AuditLogState,
  HistoryXmlDataAsync,
} from "../auditLogDetails/auditLog.slice";
import LoadingSpinner from "@/common/LoadingSpinner";
import { STATUS } from "@/common/constants";
import { XmlData } from "../auditLogDetails/auditLog.model";
import { Utils } from "../../../../utils/utils";

interface IProps {
  selectedItems: IDownload;
  label: string;
  MonitorName: string;
}

const E2BXML: React.FC<IProps> = ({ selectedItems, label, MonitorName }) => {
  const dispatch = useAppDispatch();
  const [historyData, setHistoryData] = useState<XmlData>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { loading, HistoryXmlData } = useAppSelector(AuditLogState);
  const [isExportLoading, setIsExportLoading] = useState<boolean>(false);

  const decodedMonitorName = decodeURIComponent(MonitorName);

  useEffect(() => {
    setIsLoading(true);
    const payload = {
      search_result_id: selectedItems.search_result_id,
    };
    dispatch(HistoryXmlDataAsync(payload));
    setIsLoading(false);
  }, [selectedItems]);

  useEffect(() => {
    setIsLoading(true);
    if (loading === STATUS.fulfilled) {
      setHistoryData(HistoryXmlData);
      setIsLoading(false);
    }
    setIsLoading(false);
  }, [loading, HistoryXmlData]);

  const handleDownload = () => {
    setIsExportLoading(true);
    let selectedData: any[] = [];
    if(historyData) {
      selectedData = [historyData];
    } else {
      selectedData = []
    }

    const monitorIdRow = `Monitor ID,${selectedItems?.monitor_id || "-"}\n`;
    const monitorNameRow = `Monitor Name,${decodedMonitorName || "-"}\n`;
    const articleIdRow = `Article Id, ${selectedItems?.article_id || "-"}\n`;
    const articleTitleRow = `Article Title, ${selectedItems?.title || "-"}\n`;
    const CommentsRow = `Comments, ${selectedItems.comments || "-"}\n`;

    const csvHeader = `Created On,Created By,Updated On,Updated By\n`;
    const csvContent =  selectedData
      .map((item) => {
        return `"${
          item?.audits?.map((item: { created_on: string; }) => item?.created_on?.split("T")[0]) || "-"
        }","${
          item?.audits?.map((item: { created_by: string; }) => item?.created_by?.split("T")[0]) || "-"
        }","${
          item?.audits?.map((item: { modified_on: string; }) => item?.modified_on?.split("T")[0]) || "-"
        }, "${
          item?.audits?.map((item: { modified_by: string; }) => item?.modified_by?.split("T")[0]) || "-"
        }"`;
      })
      .join("\n");

    const fullCsvContent =
      monitorIdRow +
      monitorNameRow +
      articleIdRow +
      articleTitleRow +
      CommentsRow +
      csvHeader +
      csvContent;

    const blob = new Blob([fullCsvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `Audit_${decodedMonitorName}_ArticleId_${
        selectedItems?.article_id
      }_QC_auditlog_${Utils.getCurrentDateAndTime()}.csv`
    );

    link.click();

    URL.revokeObjectURL(url);
    setIsExportLoading(false);
  };
  return (
    <>
      <div className="container mb-12 mt-2">
        <div className=" absolute right-14 top-3">
          <button
            className={`rounded-md bg-yellow text-white text-14 border ml-2 cursor-pointer border-gray text-sm font-medium font-archivo py-2 px-8`}
            onClick={handleDownload}
          >
            Export
          </button>
          <div className="absolute cursor-pointer top-0 ml-2">
            <Image
              src="/assets/icons/download-white.svg"
              alt="download icon"
              width={15}
              height={15}
              className={`left-0 ml-2 top-0 mt-2`}
            />
          </div>
        </div>
        {isExportLoading && <LoadingSpinner text={"Downloading"} />}
        <div className="flex flex-column text-14 w-12/12">
          <div className="border-right w-[550px]">
            <div className="flex flex-wrap m-2">
              <div className="m-2">
                <div className="text-dimgray m-1">Monitor ID</div>
                <div className="text-black m-1">
                  {selectedItems.monitor_id || "-"}
                </div>
              </div>
              <div className="m-2">
                <div className="text-dimgray m-1">Monitor Name</div>
                <div className="text-black m-1">{decodedMonitorName}</div>
              </div>
            </div>
            <div className="flex flex-wrap m-2">
              <div className="m-2">
                <div className="text-dimgray m-1">Article Id</div>
                <div className="text-black m-1">
                  {selectedItems.article_id || "-"}
                </div>
              </div>
              <div className="m-2">
                <div className="text-dimgray m-1">Article Title</div>
                <div className="text-black m-1">
                  {selectedItems.title || "-"}
                </div>
              </div>
            </div>
            <div className="mt-8 ml-4">
              <div className="text-dimgray m-1">Comments</div>
              <div className="text-black m-1">
                {selectedItems.comments || "-"}
              </div>
            </div>
          </div>
          <div className="mt-4 ml-4">
            <div className="flex flex-wrap">
              <div className="m-2">
                <Image
                  src="/assets/icons/time-past.png"
                  width={15}
                  height={15}
                  alt="search icon"
                  className="ml-4"
                />
              </div>
              <div className="ml-2 mt-2 text-dimgray">History</div>
            </div>
            <div className="overflow-y-auto max-h-96 w-80">
              {historyData?.audits?.map((item, index) => (
                <div className="border-style m-4" key={index}>
                  <div className="text-dimgray m-2">
                    Created On:{" "}
                    <span className="text-black">
                      {item?.created_on.split("T")[0] || "-"}
                    </span>{" "}
                  </div>
                  <div className="text-dimgray m-2">
                    Created By:{" "}
                    <span className="text-black">
                      {item?.created_by || "-"}
                    </span>
                  </div>
                  <div className="text-dimgray m-2">
                    Updated On:{" "}
                    <span className="text-black">
                      {item?.modified_on.split("T")[0] || "-"}
                    </span>{" "}
                  </div>
                  <div className="text-dimgray m-2">
                    Updated By:{" "}
                    <span className="text-black">
                      {item?.modified_by || "-"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner modelClass={"modelClass"} />}
    </>
  );
};

export default E2BXML;
