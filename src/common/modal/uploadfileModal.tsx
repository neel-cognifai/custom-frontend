import React, { useState } from "react";
import Image from "next/image";
import * as XLSX from "xlsx";
import Toast from "../Toast";
import LoadingSpinner from "../LoadingSpinner";
import { CONSTANTS, systemMessage } from "../constants";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { FileUploadAsync } from "@/components/drug-monitor/productMonitor.slice";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File, selectedFormatType: string, id: string) => void;
}

const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [fileColumns, setFileColumns] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  let customFileColumns: { field: string; columnValue: string }[] = [];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (e: any) {
        if (e) {
          var data = e.target.result;
          let readedData = XLSX.read(data, { type: "binary" });
          const wsname = readedData.SheetNames[0];
          const ws = readedData.Sheets[wsname];
          const dataParse: string[][] = XLSX.utils.sheet_to_json(ws, {
            header: 1,
          });
          setFileColumns(dataParse[0].slice().sort());
        }
      };
      reader.readAsBinaryString(file);
      setSelectedFile(file);
    }
  };

  const areRequiredFieldsPresent = (
    arrayOfObjects: {
      field: string;
      columnValue: string;
    }[],
    requiredFields: string[]
  ) => {
    return requiredFields.every((field) =>
      arrayOfObjects.some((obj) => obj.field === field)
    );
  };

  const handleUpload = async () => {
    try {
      const requiredFields = [
        "id",
        "title",
        "abstract",
        "author",
        "affiliation",
        "publishedOn",
        "DOI",
      ];
      const isAllRequiredFieldsAreAvailable = areRequiredFieldsPresent(
        customFileColumns,
        requiredFields
      );
      if (
        !isAllRequiredFieldsAreAvailable &&
        formValues.selectedFormatType === "Custom"
      ) {
        Toast("Please set all fields ", { type: "error" });
        return;
      }
      if (selectedFile && formValues.selectedFormatType) {
        setLoading(true);
        const formData = new FormData();
        formData.append("data_file", selectedFile);
        let payload;
        if (formValues.selectedFormatType === "Custom") {
          payload = {
            file_type: formValues.selectedFormatType,
            formData: formData,
            article_id: findColumnValue("id"),
            title: findColumnValue("title"),
            abstract: findColumnValue("abstract"),

            author: findColumnValue("author"),
            affiliation: findColumnValue("affiliation"),
            country: findColumnValue("country"),

            doi_sources: findColumnValue("DOI"),
            language: findColumnValue("language"),
            published_on: findColumnValue("publishedOn"),
          };
        } else {
          payload = {
            file_type: formValues.selectedFormatType,
            formData: formData,
          };
        }
        const response = await dispatch(FileUploadAsync(payload));

        if (FileUploadAsync.fulfilled.match(response)) {
          onFileUpload(
            selectedFile,
            formValues.selectedFormatType,
            response.payload?.id
          );
          setSelectedFile(null);
          onClose();
          setLoading(false);
          Toast(systemMessage.FileUploadSuccessfully, { type: "success" });
        } else {
          Toast(systemMessage.Something_Wrong, { type: "error" });
          setLoading(false);
          console.error(CONSTANTS.errorMessage.searchFailed, response.error);
        }
      }
    } catch (error: unknown) {
      setLoading(false);
      console.error(CONSTANTS.errorMessage.unexpectedError, error);
    }
  };

  const [formValues, setFormValues] = useState({
    selectedFormatType: "",
  });

  const findColumnValue = (fieldValue: string) => {
    const foundItem = customFileColumns.find(
      (item) => item.field === fieldValue
    );
    return foundItem ? foundItem.columnValue : undefined;
  };
  const setCustomFields = (field: string, value: string) => {
    const index = customFileColumns.findIndex((item) => item.field === field);
    if (index !== -1) {
      customFileColumns[index].columnValue = value;
    } else {
      customFileColumns.push({ field, columnValue: value });
    }
    customFileColumns = customFileColumns.filter(
      (item) => item.columnValue !== "Select"
    );
  };

  return (
    <div className={`modal ${isOpen ? "visible" : "hidden"} w-[550px]  p-4`}>
      <div className="text-14 cursor-pointer">
        <Image
          src="/assets/icons/Vector.svg"
          alt="close"
          className="absolute right-4 top-4 w-3"
          onClick={onClose}
          width={10}
          height={10}
        />
        <p className="font-Archivo text-violet text-Archivo">
          CoVigilAI supports below file formats:-
        </p>
        <div className="relative">
          <select
            className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
            onChange={(e) =>
              setFormValues({
                ...formValues,
                selectedFormatType: e.target.value,
              })
            }
            value={formValues.selectedFormatType}
          >
            <option value="">Select format type</option>
            <option value="PubMed Nbib Reference Format">
              Pubmed NBIB / RIS Format
            </option>
            <option value="Embase Full Text Search CSV">
              Embase full text search CSV
            </option>
            {/* <option value="ProQuest Excel">ProQuest Excel</option> */}
            <option value="PubMed Email Alerts File">
              PubMed email alerts as eml email file ( nbib reference format)
            </option>
            <option value="Custom">Custom (Embase / ProQuest / MEDLINE)</option>
          </select>
        </div>
        {formValues.selectedFormatType === "Custom" && (
          <>
            <p>
              Ensure your file has a first-row header with accurate labels.Only
              .xls files are allowed.
            </p>
          </>
        )}
        <label className="mt-4 cursor-pointer text-14 text-base font-archivo font-medium capitalize rounded-md">
          <input
            type="file"
            onChange={handleFileChange}
            className="sr-only" // visually hide the file input text
          />
          <span className="file-input-label">
            {selectedFile ? selectedFile.name : "Choose a file"}
          </span>
        </label>
        {formValues.selectedFormatType === "Custom" && selectedFile && (
          <>
            <div className="flex text-14 mb-2">
              <input
                type="text"
                id="id"
                value={"ID*"}
                disabled={true}
                className="block px-3 rounded-md text-14 border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("id", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex mb-2">
              <input
                type="text"
                id="title"
                value={"Title*"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("title", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex  mb-2">
              <input
                type="text"
                id="abstract"
                value={"Abstract*"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("abstract", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex text-14 mb-2">
              <input
                type="text"
                id="author"
                value={"Author*"}
                disabled={true}
                className="block px-3 rounded-md text-14 border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("author", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex text-14 mb-2">
              <input
                type="text"
                id="affiliation"
                value={"Affiliation*"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("affiliation", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex text-14 mb-2">
              <input
                type="text"
                id="publishedOn"
                value={"Published On*"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("publishedOn", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex text-14 mb-2">
              <input
                type="text"
                id="DOI"
                value={"DOI*"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("DOI", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex text-14  mb-2">
              <input
                type="text"
                id="language"
                value={"Language"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("language", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex text-14 mb-2">
              <input
                type="text"
                id="country"
                value={"Country"}
                disabled={true}
                className="block px-3 text-14 rounded-md border-1 mr-4"
              />
              <select
                className="block cursor-pointer text-14 w-[200px] px-4 py-2 pr-8 text-sm leading-tight bg-white border border-gray-300 rounded-md appearance-none focus:outline-none focus:border-blue-500"
                onChange={(e) => setCustomFields("country", e.target.value)}
              >
                <option>
                  <select value="" id="select">
                    Select
                  </select>
                </option>
                {fileColumns.map((item: string, index: number) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
        {selectedFile && (
          <button
            className="absolute text-14 bottom-4 right-[2%] bg-yellow cursor-pointer px-4 py-3 w-24 text-white text-base font-archivo font-medium capitalize rounded"
            onClick={handleUpload}
          >
            Upload
          </button>
        )}
      </div>
      {loading && <LoadingSpinner modelClass={"modelClass"} />}
    </div>
  );
};

export default UploadModal;
