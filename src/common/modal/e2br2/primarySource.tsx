import React, { ChangeEvent } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputField from "@/common/InputField";
import { PatientData, PrimarySourceData } from "@/common/constants";
import Toast from "@/common/Toast";
import { IPrimarySource } from "./e2br3.model";


interface Props {
  setPrimarySourceOnChange:  React.Dispatch<React.SetStateAction<boolean>>
  primarySourceValue: IPrimarySource;
  onChange: (values: IPrimarySource) => void;
}

export const initialPrimarySourceValues: IPrimarySource = {
  reportergivename: "",
  reporterfamilyname: "",
  reporterorganization: "",
  reporterdepartment: "",
  reporterstreet: "",
  reportercity: "",
  reporterpostcode: "",
  reportercountry: "",
  qualification: "",
  literaturereference: "",
};

const PrimarySource: React.FC<Props> = ({ setPrimarySourceOnChange, primarySourceValue, onChange}) => {
  if(primarySourceValue) {
    initialPrimarySourceValues.reportergivename = primarySourceValue?.reportergivename
    initialPrimarySourceValues.reporterfamilyname = primarySourceValue?.reporterfamilyname
    initialPrimarySourceValues.reporterorganization = primarySourceValue?.reporterorganization
    initialPrimarySourceValues.reporterdepartment = primarySourceValue?.reporterdepartment
    initialPrimarySourceValues.reporterstreet = primarySourceValue?.reporterstreet
    initialPrimarySourceValues.reportercity = primarySourceValue?.reportercity
    initialPrimarySourceValues.reporterpostcode = primarySourceValue?.reporterpostcode
    initialPrimarySourceValues.reportercountry = primarySourceValue?.reportercountry
    initialPrimarySourceValues.qualification = primarySourceValue?.qualification
    initialPrimarySourceValues.literaturereference = primarySourceValue?.literaturereference
  }
  const PrimarySourceSchema = Yup.object().shape({
    reportergivename: Yup.string(),
    reporterfamilyname: Yup.string(),
    reporterorganization: Yup.string(),
    reporterdepartment: Yup.string(),
    reporterstreet: Yup.string(),
    reportercity: Yup.string(),
    reporterpostcode: Yup.string(),
    reportercountry: Yup.string(),
    qualification: Yup.string(),
    literaturereference: Yup.string(),
  });

  const handleSubmit = (values: IPrimarySource) => {
    try {
      const trimmedValue = PrimarySourceSchema.cast(values);
      if (onChange) {
        setPrimarySourceOnChange(true)
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
        initialValues={initialPrimarySourceValues}
        validationSchema={PrimarySourceSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative text-14">
                <div className="grid text-14 w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-3 mb-2 ml-1">
                  {PrimarySourceData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IPrimarySource]}
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

export default PrimarySource;
