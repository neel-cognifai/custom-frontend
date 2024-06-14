import React, { ChangeEvent } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/InputField";
import { SenderData } from "@/common/constants";
import Toast from "@/common/Toast";

export interface ISender {
  sendertype?: string,
  senderorganizatio?: string,
  senderstreetaddress?: string,
  sendercit?: string,
  senderstat?: string,
  senderpostcod?: string,
  sendercountrycod?: string,
  senderte?: string,
  senderemailaddress?: string
}

export const initialSenderValues: ISender = {
  sendertype: "",
  senderorganizatio: "",
  senderstreetaddress: "",
  sendercit: "",
  senderstat: "",
  senderpostcod: "",
  sendercountrycod: "",
  senderte: "",
  senderemailaddress: ""
};

interface Props {
  senderValue: ISender
  setSenderValueOnChange: React.Dispatch<React.SetStateAction<boolean>>
  onChange: (values: ISender) => void;
}
const Sender: React.FC<Props> = ({senderValue,setSenderValueOnChange, onChange }) => {
  if(senderValue) {
    initialSenderValues.sendertype = senderValue?.sendertype,
    initialSenderValues.senderorganizatio = senderValue?.senderorganizatio,
    initialSenderValues.senderstreetaddress = senderValue?.senderstreetaddress,
    initialSenderValues.sendercit = senderValue?.sendercit,
    initialSenderValues.senderstat = senderValue?.senderstat,
    initialSenderValues.senderpostcod = senderValue?.senderpostcod,
    initialSenderValues.sendercountrycod = senderValue?.sendercountrycod,
    initialSenderValues.senderemailaddress = senderValue?.senderemailaddress
  }
  const validationSchema = Yup.object({
    sendertype: Yup.string(),
    senderorganizatio: Yup.string(),
    senderstreetaddress: Yup.string(),
    sendercit: Yup.string(),
    senderstat: Yup.string(),
    senderpostcod: Yup.string(),
    sendercountrycod: Yup.string(),
    senderte: Yup.string(),
    senderemailaddress: Yup.string(),
  });

  const handleSubmit = (values: ISender) => {
    try {
      const trimmedValue = validationSchema.cast(values);
      if (onChange) {
        setSenderValueOnChange(false)
        onChange(trimmedValue);
      }
    } catch (error: unknown) {
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialSenderValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                  {SenderData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof ISender]}
                        onChange={(event: ChangeEvent<{ value: string }>) => {
                          const { value } = event.target;
                          setValues({
                            ...values,
                            [item.value]: value,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default Sender;
