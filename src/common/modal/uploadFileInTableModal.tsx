import React, { useState } from "react";
import Image from "next/image";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
}

const UploadFileInTableModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const [formValues, setFormValues] = useState({
    selectedFormatType: "",
    selectedReview: "",
  });

  return (
    <div
      className={`modal ${
        isOpen ? "visible" : "hidden"
      } w-[775px] h-[275px] p-4`}
    >
      <div className="">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute  cursor-pointer right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <p className="font-Archivo text-violet text-Archivo">
          Full Text Attachment type :-
        </p>
        <div className="relative">
          <div className="mt-2">
            <select
              className="block mb-2 text-[14px] cursor-pointer w-42 px-4 py-2 text-sm text-black leading-tight bg-white border rounded-md appearance-none focus:outline-none focus:border-blue-500"
              onChange={(e) =>
                setFormValues({
                  ...formValues,
                  selectedReview: e.target.value,
                })
              }
              value={formValues.selectedReview}
            >
              <option>Select Option</option>
              <option value="Free PMC">Free PMC</option>
              <option value="Paid PMC">Paid PMC</option>
              <option value="translation Document">Translation Document</option>
            </select>
          </div>
        </div>
        <label className="mt-4 cursor-pointer text-base font-archivo font-medium capitalize rounded-md">
          <input type="file" onChange={handleFileChange} className="sr-only" />
          <span className="file-input-label">
            {selectedFile ? selectedFile.name : "Choose a file"}
          </span>
        </label>
        {selectedFile && (
          <button
            className="absolute bottom-4 right-[2%] bg-yellow cursor-pointer px-4 py-3 w-24 text-white text-base font-archivo font-medium capitalize rounded"
            onClick={handleUpload}
          >
            Upload
          </button>
        )}
      </div>
    </div>
  );
};

export default UploadFileInTableModal;
