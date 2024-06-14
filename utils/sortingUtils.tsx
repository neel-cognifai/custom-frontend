import React from "react";
import Image from "next/image";

interface SortOptionProps {
  label: string;
  direction: "ascending" | "descending" | "" ;
  active: "ascending" | "descending" | "" ;
  onClick: (direction: "ascending" | "descending" | "") => void;
  iconSrc: string;
  iconAlt: string;
}

export function SortOption({
  label,
  direction,
  active,
  onClick,
  iconSrc,
  iconAlt,
}: SortOptionProps) {
  const isActive = active === direction;

  return (
    <div
      className={`cursor-pointer px-4 py-2 hover-text-style hover:bg-whiteGray ${
        isActive ? "bg-indigo-100" : ""
      }`}
      onClick={() => onClick(direction)}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={25}
        height={15}
        className="ml-1 mr-2 w-4"
      />{" "}
      {label}
    </div>
  );
}
