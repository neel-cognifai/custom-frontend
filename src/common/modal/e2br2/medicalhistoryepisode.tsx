import React, { ChangeEvent, useState } from "react";
import * as Yup from "yup";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import InputField from "@/common/InputField";
import Toast from "@/common/Toast";
import { MedicalHistoryEpisodeData } from "@/common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";

export interface IMedicalhistoryepisode {
  fields: {
    patientepisodename: string;
    patientmedicalcontinue: string;
    patientepisodenamemeddraversion: string;
  }[];
}

interface Props {
  MedicalHistoryEpisodeDataValue: IMedicalhistoryepisode
  setMedicalHistoryEpisodeDataOnChange:  React.Dispatch<React.SetStateAction<boolean>>;
  onChange: (values: IMedicalhistoryepisode) => void;
}

export const initialMedicalHistoryEpisodeValues: IMedicalhistoryepisode = {
  fields: [
    {
      patientepisodenamemeddraversion: "",
      patientepisodename: "",
      patientmedicalcontinue: "",
    }
  ],
};

const MedicalHistoryEpisode: React.FC<Props> = ({
  MedicalHistoryEpisodeDataValue,
  setMedicalHistoryEpisodeDataOnChange,
  onChange,
}) => {
  
  const MedicalHistorySchema = Yup.object().shape({
    patientepisodenamemeddraversion: Yup.string(),
    patientepisodename: Yup.string(),
    patientmedicalcontinue: Yup.string(),
  });

  const defaultFieldValues = {
    patientepisodenamemeddraversion: "",
    patientepisodename: "",
    patientmedicalcontinue: "",
  };
  
  const initialValues = {
    fields: MedicalHistoryEpisodeDataValue?.fields || defaultFieldValues,
  };

  const handleSubmit = (values: any) => {
    try {
      if (onChange) {
        setMedicalHistoryEpisodeDataOnChange(true);
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
        validationSchema={MedicalHistorySchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setValues, setFieldValue }) => (
          <Form onChange={handleSubmit}>
            <FieldArray name="fields">
              {({ insert, remove, push }) => (
                <div className="flex relative">
                  <div className="grid w-30 grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                    {values.fields.length > 0 &&
                      values.fields.map((item, index) => (
                        <>
                          <div
                            className="mr-12"
                            key={`patientepisodenamemeddraversion_${index}`}
                          >
                            <InputField
                              name={`items.${index}.patientepisodenamemeddraversion`}
                              id={`patientepisodenamemeddraversion_${index}`}
                              label={`Patient Episode Name MedDRA`}
                              type="text"
                              value={
                                `${item.patientepisodenamemeddraversion}` || ""
                              }
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setFieldValue(
                                  `fields.${index}.patientepisodenamemeddraversion`,
                                  value
                                );
                              }}
                            />
                          </div>

                          <div
                            className="mr-12"
                            key={`patientepisodename${index}`}
                          >
                            <InputField
                              name={`items.${index}.patientepisodename`}
                              id={`patientepisodename_${index}`}
                              label={`Patient Episode Name`}
                              type="text"
                              value={`${item.patientepisodename}` || ""}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setFieldValue(
                                  `fields.${index}.patientepisodename`,
                                  value
                                );
                              }}
                            />
                          </div>
                          <div
                            className="mr-12"
                            key={`patientmedicalcontinue${index}`}
                          >
                            <InputField
                              name={`items.${index}.patientmedicalcontinue`}
                              id={`patientmedicalcontinue_${index}`}
                              label={`Patient Medical Continue`}
                              type="text"
                              value={`${item.patientmedicalcontinue}` || ""}
                              onChange={(
                                event: ChangeEvent<{ value: string }>
                              ) => {
                                const { value } = event.target;
                                setFieldValue(
                                  `fields.${index}.patientmedicalcontinue`,
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
                                  push({
                                    patientepisodenamemeddraversion: "",
                                    patientepisodename: "",
                                    patientmedicalcontinue: "",
                                  });
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

export default MedicalHistoryEpisode;
