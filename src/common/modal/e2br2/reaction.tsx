import React, { ChangeEvent, useState } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { FieldArray, Form, Formik } from "formik";
import InputField from "@/common/InputField";
import { ReactionData } from "@/common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faMinusCircle } from "@fortawesome/free-solid-svg-icons";
import Toast from "@/common/Toast";
import { MonitorData } from "@/components/abstract-review/abstract.model";
import { IReaction } from "./e2br3.model";


interface Props {
  setReactionOnChange:  React.Dispatch<React.SetStateAction<boolean>>;
  reactionValue?: any;
  onChange: (values: IReaction) => void;
  abstractReviewDetail?: MonitorData;
}

export const initialReactionValues: IReaction = {
  primarysourcereaction: "",
  reactionmeddraversionllt: "",
  reactionmeddrallt: "",
  reactionmeddraversionpt: "",
  reactionmeddrapt: "",
  reactionoutcome: "",
  seriousness:"",
};

const Reaction: React.FC<Props> = ({
  setReactionOnChange,
  reactionValue,
  onChange,
  abstractReviewDetail,
}) => {
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

  const SuspectedAdverseEventArray =
    SuspectedAdverseEvent?.[0]?.split(",").map((item) => item.trim()) || [];

    const initialValues = {
      fields:
        reactionValue && reactionValue.fields?.length > 0
          ? reactionValue.fields.map((value: any) => ({
              primarysourcereaction: value.primarysourcereaction || "new",
              reactionmeddraversionllt: value.reactionmeddraversionllt || "",
              reactionmeddrallt: value.reactionmeddrallt || "",
              reactionmeddraversionpt: value.reactionmeddraversionpt || "",
              reactionmeddrapt: value.reactionmeddrapt || "",
              reactionoutcome: value.reactionoutcome || "",
              seriousness: value.seriousness || "",
            }))
          : SuspectedAdverseEventArray.length > 0
          ? SuspectedAdverseEventArray.map((event) => ({
              primarysourcereaction: event || "",
              reactionmeddraversionllt: "",
              reactionmeddrallt: "",
              reactionmeddraversionpt: "",
              reactionmeddrapt: "",
              reactionoutcome: "",
              seriousness: "",
            }))
          : [
              {
                primarysourcereaction: "",
                reactionmeddraversionllt: "",
                reactionmeddrallt: "",
                reactionmeddraversionpt: "",
                reactionmeddrapt: "",
                reactionoutcome: "",
                seriousness: "",
              },
            ],
    };
  const ReactionSchema = Yup.object().shape({
    primarysourcereaction: Yup.string(),
    reactionmeddraversionllt: Yup.string(),
    reactionmeddrallt: Yup.string(),
    reactionmeddraversionpt: Yup.string(),
    reactionmeddrapt: Yup.string(),
    reactionoutcome: Yup.string(),
    seriousness: Yup.string(),
  });
  const handleSubmit = (values: any) => {
    try {
      if (onChange) {
        setReactionOnChange(true);
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
        validationSchema={ReactionSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleSubmit, setValues, setFieldValue }) => (
          <Form onChange={handleSubmit}>
            <FieldArray name="fields">
              {({ insert, remove, push }) => (
                <>
                  {values.fields.length > 0 &&
                    values.fields.map((item:any, index: any) => (
                      <>
                        <h4 className="ml-4 mt-2">Reaction {index + 1}</h4>
                        <div className="h-0.5 border-t-0 mt-4 bg-neutral-100 opacity-100 dark:opacity-50 " />
                        <div className="flex relative">
                          <div className="grid w-30 grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                            <div
                              className="mr-12"
                              key={`primarysourcereaction_${index}`}
                            >
                              <InputField
                                name={`items.${index}.primarysourcereaction`}
                                id={`primarysourcereaction_${index}`}
                                label={`Primary Source Reaction`}
                                type="text"
                                value={`${item.primarysourcereaction}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.primarysourcereaction`,
                                    value
                                  );
                                }}
                              />
                            </div>

                            <div
                              className="mr-12"
                              key={`reactionmeddraversionllt${index}`}
                            >
                              <InputField
                                name={`items.${index}.reactionmeddraversionllt`}
                                id={`reactionmeddraversionllt_${index}`}
                                label={`Reaction MedDra Version LLT`}
                                type="text"
                                value={`${item.reactionmeddraversionllt}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.reactionmeddraversionllt`,
                                    value
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="mr-12"
                              key={`reactionmeddrallt${index}`}
                            >
                              <InputField
                                name={`items.${index}.reactionmeddrallt`}
                                id={`reactionmeddrallt_${index}`}
                                label={`Reaction MedDra LLT`}
                                type="text"
                                value={`${item.reactionmeddrallt}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.reactionmeddrallt`,
                                    value
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="mr-12"
                              key={`reactionmeddraversionpt${index}`}
                            >
                              <InputField
                                name={`items.${index}.reactionmeddraversionpt`}
                                id={`reactionmeddraversionpt_${index}`}
                                label={`Reaction MedDra Version PT`}
                                type="text"
                                value={`${item.reactionmeddraversionpt}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.reactionmeddraversionpt`,
                                    value
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="mr-12"
                              key={`reactionmeddrapt${index}`}
                            >
                              <InputField
                                name={`items.${index}.reactionmeddrapt`}
                                id={`reactionmeddrapt_${index}`}
                                label={`Reaction MedDra PT`}
                                type="text"
                                value={`${item.reactionmeddrapt}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.reactionmeddrapt`,
                                    value
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="mr-12"
                              key={`reactionoutcome${index}`}
                            >
                              <InputField
                                name={`items.${index}.reactionoutcome`}
                                id={`reactionoutcome_${index}`}
                                label={`Reaction Outcome`}
                                type="text"
                                value={`${item.reactionoutcome}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.reactionoutcome`,
                                    value
                                  );
                                }}
                              />
                            </div>
                            <div
                              className="mr-12"
                              key={`seriousness${index}`}
                            >
                              <InputField
                                name={`items.${index}.seriousness`}
                                id={`seriousness_${index}`}
                                label={`Seriousness`}
                                type="text"
                                value={`${item.seriousness}` || ""}
                                onChange={(
                                  event: ChangeEvent<{ value: string }>
                                ) => {
                                  const { value } = event.target;
                                  setFieldValue(
                                    `fields.${index}.seriousness`,
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
                                      primarysourcereaction: "",
                                      reactionmeddraversionllt: "",
                                      reactionmeddrallt: "",
                                      reactionmeddraversionpt: "",
                                      reactionmeddrapt: "",
                                      reactionoutcome: "",
                                      seriousness: ""
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
                          </div>
                        </div>
                      </>
                    ))}
                </>
              )}
            </FieldArray>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Reaction;
