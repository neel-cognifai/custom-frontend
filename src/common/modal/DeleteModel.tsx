import React from "react";
import Image from "next/image";

interface IDelete {
  label: string;
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteModal: React.FC<IDelete> = ({ label, onClose, onDelete }) => {
  return (
    <div>
      <div className="delete-modal p-4">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute cursor-pointer right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <div>
          <div className="text-14 text-black">Delete {label}</div>
          <div className="border-bottom mt-3"></div>
          <div className="text-14 text-black mt-4">
            Are you sure want to delete this {label}?
          </div>
          <div className="flex mt-4 float-right mb-2">
            <button
              className="px-4 py-2 border-none bg-violet text-white rounded-md cursor-pointer"
              onClick={onDelete}
            >
              Yes
            </button>
            <button
              className="px-4 py-2 ml-2 border-none bg-violet text-white rounded-md cursor-pointer"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
