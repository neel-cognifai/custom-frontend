import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import React from "react";

interface CardDataStatsProps {
  title: string;
  total: number;
  icon: IconProp;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  icon,
}) => {
  return (
    <div className="rounded-lg border border-stroke mt-2 bg-white px-7 py-2 shadow-style-card dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-10 w-11.5">
        <div className="rounded-full py-1 px-1 bg-meta-2">
          <FontAwesomeIcon icon={icon} color="#667acd" size="2x" />
        </div>
        <div className="text-title-md ml-3 mt-3 font-bold text-black dark:text-white">
            {total}
          </div>
      </div>

      <div className="mt-2 ml-1 flex items-end justify-between">
        <div>
          <span className="text-sm">{title}</span>
        </div>
      </div>
    </div>
  );
};

export default CardDataStats;
