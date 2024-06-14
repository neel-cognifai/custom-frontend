import React, { ChangeEvent, useState } from "react";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import InputField from "@/common/InputField";
import Toast from "@/common/Toast";
import { PatientPastDrugTherapyData } from "@/common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import { MonitorData } from "@/components/abstract-review/abstract.model";

export interface IPatientPastDrugTherapy {
  [patientdrugname: string]: string;
}

interface Props {
  PatientPastDrugTherapyValue: any;
  setPatientPastDrugTherapyOnChange: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  onChange: (values: IPatientPastDrugTherapy) => void;
  abstractReviewDetail?: MonitorData;
}

export const initialPatientPastDrugTherapyValues: IPatientPastDrugTherapy = {
  patientdrugname: "",
};

const PatientPastDrugTherapy: React.FC<Props> = ({
  PatientPastDrugTherapyValue,
  setPatientPastDrugTherapyOnChange,
  onChange,
  abstractReviewDetail,
}) => {
  
  const medications = abstractReviewDetail?.ai_tags?.Medications
    ? abstractReviewDetail?.ai_tags?.Medications?.map(
        (medication: { entity: any[] }) =>
          medication?.entity?.map((entity: any) => [entity])
      )
        .join(", ")
        .split(", ")
    : "";

  const medicationsArray = medications[0]
    ?.split(",")
    .map((item: string) => item.trim());

  const initialValues = {
    fields:
    PatientPastDrugTherapyValue && PatientPastDrugTherapyValue[0]?.fields && PatientPastDrugTherapyValue[0].fields.length > 0
        ? Object.values(PatientPastDrugTherapyValue[0].fields).map((value: any, index) => ({
            patientdrugname: value.patientdrugname || "",
          }))
        : medicationsArray?.length > 0
        ? medicationsArray?.map((medication: any) => ({
          patientdrugname: medication,
          }))
        : [
            {
              patientdrugname: "",
            },
          ],
  };

  const PatientPastDrugTherapySchema = Yup.object().shape({
    patientdrugname: Yup.string(),
  });

  const handleSubmit = (values: any) => {
    try {
      if (onChange) {
        setPatientPastDrugTherapyOnChange(true);
        onChange(values);
      }
    } catch (error: unknown) {
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={PatientPastDrugTherapySchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setValues, setFieldValue }) => (
          <Form onChange={handleSubmit}>
            <FieldArray name="fields">
              {({ insert, remove, push }) => (
                <div className="flex relative">
                  <div className="grid w-30 grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                    {values.fields.length > 0 &&
                      values.fields.map((item: any, index: any) => (
                        <>
                          <div
                            className="mr-12"
                            key={`patientdrugname_${index}`}
                          >
                            <InputField
                              name={`items.${index}.patientdrugname`}
                              id={`patientdrugname_${index}`}
                              label={`Patient Drug Name`}
                              type="text"
                              value={`${item.patientdrugname}` || ""}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setFieldValue(
                                  `fields.${index}.patientdrugname`,
                                  value
                                );
                              }}
                            />
                          </div>
                          <div className="flex" key={index}>
                            {index > 0 && (
                              <button
                                type="button"
                                className="bg-transparent"
                                onClick={() => {
                                  remove(index);
                                  handleSubmit();
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faMinusCircle}
                                  color="black"
                                  size="2x"
                                />
                              </button>
                            )}
                            {index + 1 === values.fields.length && (
                              <button
                                key={index}
                                type="button"
                                className="bg-transparent"
                                onClick={() => {
                                  push({ patientdrugname: "" });
                                  handleSubmit();
                                }}
                              >
                                <FontAwesomeIcon
                                  icon={faPlusCircle}
                                  color="black"
                                  size="2x"
                                />
                              </button>
                            )}
                          </div>
                        </>
                      ))}
                  </div>
                </div>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default PatientPastDrugTherapy;
