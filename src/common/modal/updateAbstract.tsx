import React from "react";
import Image from "next/image";

interface IUpdateAbstract {
  isOpen: boolean;
  onClose: () => void;
}

const UpdateAbstract: React.FC<IUpdateAbstract> = ({ onClose }) => {
  return (
    <div>
      <div className="update-abstract-modal p-4">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute cursor-pointer right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <div>
          <div className="text-18 text-black">Update Abstract</div>
          <div className="border-bottom mt-3"></div>
        </div>
        <div className="mt-4 ml-2">
            <textarea className="rounded-md relative w-[560px] h-48" />    
        </div>
        <div className="absolute right-5">
            <button className="font-Archivo mt-2  cursor-pointer add-button-font py-2 px-8 bg-yellow text-white rounded-md">Update Review Decision</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateAbstract;
