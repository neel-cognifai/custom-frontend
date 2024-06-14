import React, { ChangeEvent } from "react";
import Image from "next/image";
import * as Yup from "yup";
import { Form, Formik } from "formik";
import InputField from "@/common/InputField";
import { DrugData } from "@/common/constants";
import Toast from "@/common/Toast";
import { IDrug } from "./e2br3.model";

interface Props {
  setDrugsOnChange:  React.Dispatch<React.SetStateAction<boolean>>
  drugsValue: IDrug
  onChange: (values: IDrug) => void;
}

export const initialDrugsValues: IDrug = {
  drugcharacterization: "",
  medicinalproduct: "",
  obtaindrugcountry: "",
  drugauthorizationnumb: "",
  drugauthorizationcountry: "",
  drugauthorizationholder: "",
  drugdosagetext: "",
  drugdosageform: "",
  drugindicationmeddraversion: "",
  drugindication: "",
  actiondrug: "",
  drugreactionassesmeddraversion: "",
  drugreactionasses: "",
  drugassessmentsource: "",
  drugassessmentmethod: "",
  drugresult: "",
};

const Drugs: React.FC<Props> = ({setDrugsOnChange,drugsValue, onChange }) => {
  if(drugsValue) {
  initialDrugsValues.drugcharacterization = drugsValue?.drugcharacterization,
  initialDrugsValues.medicinalproduct = drugsValue?.medicinalproduct,
  initialDrugsValues.obtaindrugcountry = drugsValue?.obtaindrugcountry,
  initialDrugsValues.drugauthorizationnumb = drugsValue?.drugauthorizationnumb,
  initialDrugsValues.drugauthorizationcountry = drugsValue?.drugauthorizationcountry,
  initialDrugsValues.drugauthorizationholder = drugsValue?.drugauthorizationholder,
  initialDrugsValues.drugdosagetext = drugsValue?.drugdosagetext,
  initialDrugsValues.drugdosageform = drugsValue?.drugdosageform,
  initialDrugsValues.drugindicationmeddraversion = drugsValue?.drugindicationmeddraversion,
  initialDrugsValues.drugindication = drugsValue?.drugindication,
  initialDrugsValues.actiondrug = drugsValue?.actiondrug,
  initialDrugsValues.drugreactionassesmeddraversion = drugsValue?.drugreactionassesmeddraversion,
  initialDrugsValues.drugreactionasses = drugsValue?.drugreactionasses,
  initialDrugsValues.drugassessmentsource = drugsValue?.drugassessmentsource,
  initialDrugsValues.drugassessmentmethod = drugsValue?.drugassessmentmethod,
  initialDrugsValues.drugresult = drugsValue?.drugresult
  }
  const DrugsSchema = Yup.object().shape({
    drugcharacterization: Yup.string(),
    medicinalproduct: Yup.string(),
    obtaindrugcountry: Yup.string(),
    drugauthorizationnumb: Yup.string(),
    drugauthorizationcountry: Yup.string(),
    drugauthorizationholder: Yup.string(),
    drugdosagetext: Yup.string(),
    drugdosageform: Yup.string(),
    drugindicationmeddraversion: Yup.string(),
    drugindication: Yup.string(),
    actiondrug: Yup.string(),
    drugreactionassesmeddraversion: Yup.string(),
    drugreactionasses: Yup.string(),
    drugassessmentsource: Yup.string(),
    drugassessmentmethod: Yup.string(),
    drugresult: Yup.string(),
  });

  const handleSubmit = (values: IDrug) => {
    try {
      const trimmedValue = DrugsSchema.cast(values);
      if (onChange) {
        setDrugsOnChange(true)
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
        initialValues={initialDrugsValues}
        validationSchema={DrugsSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, values, setValues }) => (
          <>
            <Form onChange={handleSubmit}>
              <div className="flex relative">
                <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-3 mb-2 ml-1">
                  {DrugData?.map((item, index) => (
                    <div className="mr-12" key={index}>
                      <InputField
                        name={item.value}
                        id={item.value}
                        label={item.label}
                        type="text"
                        value={values[item.value as keyof IDrug]}
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

export default Drugs;
