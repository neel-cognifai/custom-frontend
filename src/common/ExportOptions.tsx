import React from "react";

interface ExportOptionsProps {
  selectedOption: string;
  onChange: (option: string) => void;
}

const ExportOptions: React.FC<ExportOptionsProps> = ({
  selectedOption,
  onChange,
}) => {
  return (
    <div className="flex text-14 items-center ml-4">
      <label className="mr-2">Export As:</label>
      <div className="flex items-center">
        <input
          type="radio"
          id="pdf"
          name="exportOption"
          value="pdf"
          checked={selectedOption == "pdf"}
          onChange={() => onChange("pdf")}
          className="radio-input"
        />
        <label htmlFor="pdf" className="ml-2">PDF</label>
      </div>
      <div className="flex items-center ml-4">
        <input
          type="radio"
          id="csv"
          name="exportOption"
          value="csv"
          checked={selectedOption === "csv"}
          onChange={() => onChange("csv")}
          className="radio-input"
        />
        <label htmlFor="csv" className="ml-2">CSV</label>
      </div>
    </div>
  );
};

export default ExportOptions;