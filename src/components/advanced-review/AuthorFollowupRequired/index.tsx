import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface FormValues {
  selectedDate: Date | null;
  subject: string;
  email: string;
  body: string;
}

const AuthorFollowupRequired = () => {
  const router = useRouter();

  const [formValues, setFormValues] = useState<FormValues>({
    selectedDate: null,
    subject: "",
    email: "",
    body: "",
  });

  const [tableData, setTableData] = useState<FormValues[]>([]);

  const handleSend = () => {
    if (
      !formValues.selectedDate ||
      !formValues.subject ||
      !formValues.email ||
      !formValues.body
    ) {
      alert("Please fill in all fields before sending.");
      return;
    }

    setTableData([...tableData, formValues]);

    setFormValues({
      selectedDate: null,
      subject: "",
      email: "",
      body: "",
    });
  };

  return (
    <div>
      <div className="divide-y-2">
        <div className="flex ml-6">
          <div className="flex cursor-pointer w-[230px]">
            <DatePicker
              selected={formValues.selectedDate}
              onChange={(date: null) =>
                setFormValues({ ...formValues, selectedDate: date })
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="Selected date"
              className="w-full relative rounded-md"
            />
            <Image
              className="w-[1.25rem] mt-2 z-10 h-[1.25rem] overflow-hidden"
              alt=""
              src="assets/icons/calendarday-1.svg"
              width={25}
              height={25}
            />
          </div>
          <div className="ml-6">
            <textarea
              className="rounded-lg h-6 w-48"
              placeholder="Subject of email"
              value={formValues.subject}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormValues({ ...formValues, subject: e.target.value });
              }}
            ></textarea>
          </div>
          <div className="ml-2">
            <textarea
              className="rounded-lg h-6 w-48"
              value={formValues.email}
              placeholder="please Enter email"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormValues({ ...formValues, email: e.target.value });
              }}
            ></textarea>
          </div>
          <div className="ml-2">
            <textarea
              className="rounded-lg h-6 w-48"
              value={formValues.body}
              placeholder="body of email"
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                setFormValues({ ...formValues, body: e.target.value });
              }}
            ></textarea>
          </div>
          <button
            className="bg-violet px-6 py-1 text-white h-10 rounded-lg ml-2"
            onClick={handleSend}
          >
            Send
          </button>
        </div>
        <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
      </div>
      <div>
        <div className="overflow-x-autos">
          <table className="w-full border border-collapse table-auto">
            <thead className="border-style text-sm text-left">
              <tr className="font-Archivo capitalize text-style text-sm bg-gray-50">
                <th className="px-2 py-2 hover-text-style">Subject</th>
                <th className="px-4 py-2 text-left hover-text-style">Email</th>
                <th className="px-4 py-2 text-left hover-text-style">body</th>
                <th className="px-2 py-2 text-left hover-text-style">date</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((rowData, index) => (
                <tr
                  className="border-b cursor-pointer text-left text-sm border-style hover:bg-ghostwhite"
                  key={index}
                >
                  <td className="px-2 justify-center items-center py-4 max-w-[200px] text-left">
                    {rowData.subject}
                  </td>
                  <td className="px-2 justify-center items-center py-4 max-w-[200px] text-left">
                    {rowData.email}
                  </td>
                  <td className="px-2 justify-center items-center py-4 max-w-[200px] text-left">
                    {rowData.body}
                  </td>
                  <td className="px-2 justify-center items-center py-4 max-w-[200px] text-left">
                    {rowData.selectedDate?.toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AuthorFollowupRequired;
