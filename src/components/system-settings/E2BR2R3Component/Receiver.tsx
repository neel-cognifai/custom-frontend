import React, { ChangeEvent } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/InputField";
import { ReceiverData } from "@/common/constants";
import Toast from "@/common/Toast";

export interface IReceiver {
    receivertype?: string,
    receiverorganization?: string,
    receiverdepartment?: string,
    receivertitle?: string,
    receivergivename?: string,
    receiverfamilyname?: string,
    receiverstreetaddress?: string,
    receivercity?: string,
    receiverstate?: string,
    receiverpostcode?: string,
    receivercountrycode?: string,
    receivertel?: string,
    receivertelcountrycode?: string,
    receiverfax?: string,
    receiverfaxcountrycode?: string,
    receiveremailaddress?: string,
}

export const initialReceiverValues: IReceiver = {
  receivertype: "",
  receiverorganization: "",
  receiverdepartment: "",
  receivertitle: "",
  receivergivename: "",
  receiverfamilyname: "",
  receiverstreetaddress: "",
  receivercity: "",
  receiverstate: "",
  receiverpostcode: "",
  receivercountrycode: "",
  receivertel: "",
  receivertelcountrycode: "",
  receiverfax: "3",
  receiverfaxcountrycode: "",
  receiveremailaddress: "",
};

interface Props {
  receiverValue: IReceiver
  setReceiverValueOnChange:React.Dispatch<React.SetStateAction<boolean>>
  onChange: (values: IReceiver) => void;
}
const Receiver: React.FC<Props> = ({receiverValue, setReceiverValueOnChange, onChange }) => {

  if(receiverValue) {
    initialReceiverValues.receivertype =receiverValue?.receivertype,
    initialReceiverValues.receiverorganization =receiverValue?.receiverorganization,
    initialReceiverValues.receiverdepartment =receiverValue?.receiverdepartment,
    initialReceiverValues.receivertitle =receiverValue?.receivertitle,
    initialReceiverValues.receivergivename =receiverValue?.receivergivename,
    initialReceiverValues.receiverfamilyname =receiverValue?.receiverfamilyname,
    initialReceiverValues.receiverstreetaddress =receiverValue?.receivercity,
    initialReceiverValues.receivercity =receiverValue?.receivercity,
    initialReceiverValues.receiverstate =receiverValue?.receiverstate,
    initialReceiverValues.receiverpostcode =receiverValue?.receiverpostcode,
    initialReceiverValues.receivercountrycode =receiverValue?.receivercountrycode,
    initialReceiverValues.receivertel =receiverValue?.receivertel,
    initialReceiverValues.receivertelcountrycode =receiverValue?.receivertelcountrycode,
    initialReceiverValues.receiverfax =receiverValue?.receiverfax,
    initialReceiverValues.receiverfaxcountrycode =receiverValue?.receiverfaxcountrycode,
    initialReceiverValues.receiveremailaddress =receiverValue?.receiveremailaddress
  }

    const validationSchema = Yup.object({
        receivertype: Yup.string(),
        receiverorganization: Yup.string(),
        receiverdepartment: Yup.string(),
        receivertitle: Yup.string(),
        receivergivename: Yup.string(),
        receiverfamilyname: Yup.string(),
        receiverstreetaddress: Yup.string(),
        receivercity: Yup.string(),
        receiverstate: Yup.string(),
        receiverpostcode: Yup.string(),
        receivercountrycode: Yup.string(),
        receivertel: Yup.string(),
        receivertelcountrycode: Yup.string(),
        receiverfax: Yup.string(),
        receiverfaxcountrycode: Yup.string(),
        receiveremailaddress: Yup.string(),
      });
    
      const handleSubmit = (values: IReceiver) => {
        try {
          const trimmedValue = validationSchema.cast(values);
          if(onChange) {
            setReceiverValueOnChange(false)
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
        initialValues={initialReceiverValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                  {ReceiverData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IReceiver]}
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

export default Receiver;
