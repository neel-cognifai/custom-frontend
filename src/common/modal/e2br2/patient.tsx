import React, { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import { PatientData } from "@/common/constants";
import InputField from "@/common/InputField";
import Toast from "@/common/Toast";
import MedicalHistoryEpisode, {
  IMedicalhistoryepisode,
} from "./medicalhistoryepisode";
import PatientPastDrugTherapy, {
  IPatientPastDrugTherapy,
} from "./patientPastDrugTherapy";
import {
  IAbstractDetails,
  MonitorData,
} from "@/components/abstract-review/abstract.model";
import { IPatient } from "./e2br3.model";

interface Props {
  onChange: (values: IPatient) => void;
  abstractReviewDetail?: MonitorData;
  detailsData?: IAbstractDetails;
  patientValue: IPatient;
  MedicalHistoryEpisodeDataValue: IMedicalhistoryepisode;
  PatientPastDrugTherapyValue: IPatientPastDrugTherapy[];
  setMedicalHistoryEpisodeDataValue: React.Dispatch<
    React.SetStateAction<IMedicalhistoryepisode>
  >;
  setPatientPastDrugTherapyValue: React.Dispatch<
    React.SetStateAction<IPatientPastDrugTherapy[]>
  >;
  setPatientOnChange: React.Dispatch<React.SetStateAction<boolean>>;
  setMedicalHistoryEpisodeDataOnChange: React.Dispatch<
    React.SetStateAction<boolean>
  >;
  setPatientPastDrugTherapyOnChange: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}

export const initialPatientValues: IPatient = {
  patientinitial: "",
  patientonsetage: "",
  patientonsetageunit: "",
  patientsex: "",
  resultstestsprocedures: ``,
};
const Patient: React.FC<Props> = ({
  onChange,
  abstractReviewDetail,
  detailsData,
  patientValue,
  MedicalHistoryEpisodeDataValue,
  PatientPastDrugTherapyValue,
  setMedicalHistoryEpisodeDataValue,
  setPatientPastDrugTherapyValue,
  setPatientOnChange,
  setMedicalHistoryEpisodeDataOnChange,
  setPatientPastDrugTherapyOnChange,
}) => {
  if (patientValue) {
    initialPatientValues.patientinitial = patientValue?.patientinitial;
    initialPatientValues.patientonsetage = patientValue?.patientonsetage;
    initialPatientValues.patientonsetageunit =
      patientValue?.patientonsetageunit;
    initialPatientValues.patientsex = patientValue?.patientsex;
    initialPatientValues.resultstestsprocedures =
      patientValue?.resultstestsprocedures;
  }
  if (abstractReviewDetail?.ai_tags?.Patient) {
    initialPatientValues.patientinitial =
      abstractReviewDetail?.ai_tags?.Patient.map(
        (medication: { entity: any[] }) =>
          medication?.entity?.map((entity: any) => entity)
      ).join(", ");
  }

  const PatientSchema = Yup.object().shape({
    patientinitial: Yup.string(),
    patientonsetage: Yup.string(),
    patientonsetageunit: Yup.string(),
    patientsex: Yup.string(),
    resultstestsprocedures: Yup.string(),
  });

  const handleSubmit = (values: IPatient) => {
    try {
      const trimmedValue = PatientSchema.cast(values);
      if (onChange) {
        onChange(trimmedValue);
        setPatientOnChange(true);
      }
    } catch (error: unknown) {
      Toast("An error occurred. Please try again.", { type: "error" });
      console.error("Error in handleSubmit:", error);
    }
  };
  return (
    <>
      <Formik
        initialValues={initialPatientValues}
        validationSchema={PatientSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-3 mb-2 ml-1">
                  {PatientData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={String(values[item.value as keyof IPatient])}
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
      <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
      <div className="mt-2 p-2">
        <div className="divide-y-2">
          <h4 className="ml-4 mt-2">Medical History Episode</h4>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <MedicalHistoryEpisode
            MedicalHistoryEpisodeDataValue={MedicalHistoryEpisodeDataValue}
            setMedicalHistoryEpisodeDataOnChange={
              setMedicalHistoryEpisodeDataOnChange
            }
            onChange={(value: IMedicalhistoryepisode) =>
              setMedicalHistoryEpisodeDataValue(value)
            }
          />
        </div>
      </div>
      <div className="mt-2 p-2">
        <div className="divide-y-2">
          <h4 className="ml-4 mt-2">Patient Past Drug Therapy</h4>
          <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
          <PatientPastDrugTherapy
            PatientPastDrugTherapyValue={PatientPastDrugTherapyValue[0]}
            setPatientPastDrugTherapyOnChange={
              setPatientPastDrugTherapyOnChange
            }
            onChange={(value: IPatientPastDrugTherapy) =>
              setPatientPastDrugTherapyValue([value])
            }
            abstractReviewDetail={abstractReviewDetail}
          />
        </div>
      </div>
    </>
  );
};

export default Patient;
