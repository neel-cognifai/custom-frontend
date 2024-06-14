import React from "react";
import Image from "next/image";

interface Props {
  handelClose?: () => void;
  items: string[];
}

const MeSHtermsModal: React.FC<Props> = ({ handelClose, items }) => {
  return (
    <div className="delete-modal p-4 text-14">
      <Image
        src="/assets/icons/Vector.svg"
        alt="close"
        className="absolute cursor-pointer right-4 top-4 w-3"
        onClick={handelClose}
        width={10}
        height={10}
      />
      <div>
        {items?.length !== 0 ? (
          <ul>
            {items?.map((item, index) => (
              <li className="m-1" key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          <>{"-"}</>
        )}
      </div>
    </div>
  );
};

export default MeSHtermsModal;
