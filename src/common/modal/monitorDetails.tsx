import React, { useState } from "react";
import Image from "next/image";
import { IDownload } from "@/components/drug-monitor/productMonitor.model";
import Abstract from "@/components/audit-log/Abstract";
import Qc from "@/components/audit-log/Qc";
import E2BXML from "@/components/audit-log/E2BXML";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  selectedItems: IDownload;
  MonitorName: string;
}

const MonitorDetails: React.FC<Props> = ({
  isOpen,
  onClose,
  selectedItems,
  MonitorName,
}) => {
  const [tabs, setTabs] = useState(1);
  const handleTab = (tabIndex: React.SetStateAction<number>) => {
    setTabs(tabIndex);
  };
  return (
    <div className="monitor-style text-14 p-2">
      <div className="bg-white w-full text-14 rounded-[15px]">
        <ul className="flex flex-wrap justify-between bg-tabColor mt-0 w-[960px] cursor-pointer text-sm font-medium text-center border-b border-gray-200 mb-0">
          <div>
            <span
              className={`inline-block text-14 p-4 -ml-[40px] ${
                tabs === 1 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 1 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(1)}
            >
              {" "}
              Abstract
            </span>
            <span
              className={`inline-block text-14 p-4 text-tabText  ${
                tabs === 2 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 2 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(2)}
            >
              {" "}
              QC
            </span>
            <span
              className={`inline-block text-14 p-4 text-tabText  ${
                tabs === 3 ? "bg-violet" : "bg-tabColor"
              } ${
                tabs === 3 ? "text-white" : "text-buttonGray"
              } text-base font-medium font-archivo rounded-tl-md rounded-tr-md `}
              onClick={() => handleTab(3)}
            >
              {" "}
              E2B XML
            </span>
          </div>
          <div className="flex gap-2 float-right">
            <button
              className="font-Archivo cursor-pointer text-14 text-silver bg-transparent rounded-sm"
              onClick={onClose}
            >
              <Image
                src="/assets/icons/Vector.svg"
                width={12}
                height={12}
                alt="search icon"
                className="mr-2"
              />
            </button>
          </div>
        </ul>

        {tabs === 1 ? (
          <Abstract
            selectedItems={selectedItems}
            label={"Abstract"}
            MonitorName={MonitorName}
          />
        ) : tabs === 2 ? (
          <Qc
            selectedItems={selectedItems}
            label={"QC"}
            MonitorName={MonitorName}
          />
        ) : (
          <E2BXML
            selectedItems={selectedItems}
            label={"E2b XML"}
            MonitorName={MonitorName}
          />
        )}
      </div>
    </div>
  );
};

export default MonitorDetails;
