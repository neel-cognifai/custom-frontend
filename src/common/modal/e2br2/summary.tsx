import React, { ChangeEvent, useEffect } from "react";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputField from "@/common/InputField";
import { SummaryData } from "@/common/constants";
import Toast from "@/common/Toast";
import {
  IAbstractDetails,
  MonitorData,
} from "@/components/abstract-review/abstract.model";
import { ISummary } from "./e2br3.model";

interface Props {
  setSummaryOnChange:  React.Dispatch<React.SetStateAction<boolean>>
  summaryValue: ISummary
  onChange: (values: ISummary) => void;
  abstractReviewDetail?: MonitorData;
  detailsData?: IAbstractDetails;
}

export const initialSummaryValues: ISummary = {
  narrativeincludeclinical: "",
  senderdiagnosismeddraversion: "",
  senderdiagnosis: "",
};

const Summary: React.FC<Props> = ({
  setSummaryOnChange,
  summaryValue,
  onChange,
  abstractReviewDetail,
  detailsData,
}) => {
  const getPublishedOnDate = () => {
      return detailsData?.published_on?.split("T")[0] || ""
  };

  const getAffiliation = () => {
    return detailsData?.affiliation || "";
  };

  const getPatient = () => {
    if (abstractReviewDetail?.ai_tags?.Patient) {
      const patient = abstractReviewDetail?.ai_tags?.Patient.map(
        (medication: { entity: any[] }) =>
          medication?.entity?.map((entity: any) => entity)
      ).join(", ");
      return patient;
    } else {
      return "";
    }
  };

  const getSuspectedAdverseEvent = () => {
    if (abstractReviewDetail?.ai_tags["Suspected Adverse Event(AE)"]) {
      const SuspectedAdverseEvent = abstractReviewDetail?.ai_tags[
        "Suspected Adverse Event(AE)"
      ]
        ? abstractReviewDetail?.ai_tags["Suspected Adverse Event(AE)"]
            ?.map((event: { entity: any[] }) =>
              event?.entity?.map((entity: any) => [entity])
            )
            .join(", ")
            .split(", ")
        : [];
        return SuspectedAdverseEvent;
    } else {
      return ""
    }
  };

  const getMedications = () => {
    if (abstractReviewDetail?.ai_tags?.Medications) {
      const medications = abstractReviewDetail?.ai_tags?.Medications
        ? abstractReviewDetail?.ai_tags?.Medications?.map(
            (medication: { entity: any[] }) =>
              medication?.entity?.map((entity: any) => [entity])
          )
            .join(", ")
            .split(", ")
        : "-";
      return medications;
    } else {
      return "";
    }
  };

  const getAuthors = () => {
    return detailsData?.author || "";
  };

  const getTitle = () => {
    return detailsData?.title || "";
  };

  const getDoi = () => {
    return detailsData?.doi || "";
  };

  const initialSummaryValues: ISummary = {
    narrativeincludeclinical: `This is literature case report received on ${getPublishedOnDate()},
    derived from ${getAffiliation()}., pertaining to ${getPatient()} who developed ${getSuspectedAdverseEvent()} while receiving ${getMedications()}.
    Citation: ${getAuthors()}. ${getTitle()}. ${getDoi()}.
    Past drug of patient:
    Author's discussion:
    `,
    senderdiagnosismeddraversion: "",
    senderdiagnosis: "",
  };
  if(summaryValue?.narrativeincludeclinical) {
    initialSummaryValues.narrativeincludeclinical = summaryValue?.narrativeincludeclinical || '',
    initialSummaryValues.senderdiagnosis = summaryValue?.senderdiagnosis || '',
    initialSummaryValues.senderdiagnosismeddraversion = summaryValue?.senderdiagnosismeddraversion || ''
  }


  const SummarySchema = Yup.object().shape({
    narrativeincludeclinical: Yup.string(),
    senderdiagnosismeddraversion: Yup.string(),
    senderdiagnosis: Yup.string(),
  });

  const handleSubmit = (values: ISummary) => {
    try {
      const trimmedValue = SummarySchema.cast(values);
      if (onChange) {
        setSummaryOnChange(true)
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
        initialValues={initialSummaryValues}
        validationSchema={SummarySchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full text-14 mt-2 mb-2 ml-1">
                  {SummaryData?.map((item, index) => (
                    <div className="mr-12 text-14" key={index}>
                      {item?.value === "narrativeincludeclinical" ? (
                        <>
                          <textarea
                            name={item.value}
                            id={item.value}
                            value={values[item.value]}
                            onChange={(
                              event: ChangeEvent<{ value: string }>
                            ) => {
                              const { value } = event.target;
                              setValues({
                                ...values,
                                [item.value]: value,
                              });
                            }}
                            className="summary-inputs text-14 rounded-md relative w-[560px] h-48
                      block px-3 w-full font-archivo text-sm text-black bg-transparent rounded-md border-1 border-gray appearance-none
        focus:outline-none focus:ring-0 focus:border-black peer
                      "
                          />
                          <label
                            className={`absolute label-font text-buttonGray duration-300  font-archivo 
                transform -translate-y-1 scale-75 top-2 z-10 origin-[0] bg-white  peer-focus:px-1
                 peer-focus:text-buttonGray peer-placeholder-shown:scale-100 
                 peer-placeholder-shown:-translate-y-[-6px] peer-placeholder-shown:top-[14%]  
                 peer-focus:top-1 peer-focus:scale-75 peer-focus:-translate-y-2 left-3
                 text-black"
                 }
                 `}
                          >
                            Narrative Include Clinical
                          </label>
                        </>
                      ) : (
                        <InputField
                          name={item.value}
                          id={item.value}
                          label={item.label}
                          type="text"
                          customClasses="summary-inputs"
                          value={values[item.value as keyof ISummary]}
                          onChange={(event: ChangeEvent<{ value: string }>) => {
                            const { value } = event.target;
                            setValues({
                              ...values,
                              [item.value]: value,
                            });
                          }}
                        />
                      )}
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

export default Summary;
