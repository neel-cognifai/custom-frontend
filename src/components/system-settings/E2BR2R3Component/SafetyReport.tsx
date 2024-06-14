import React, { ChangeEvent } from "react";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import InputField from "@/common/InputField";
import { SafetyReportData } from "@/common/constants";
import Toast from "@/common/Toast";

export interface ISafetyReport {
  safetyreportversion?: string;
  safetyreportid?: string;
  primarysourcecountry?: string;
  occurcountry?: string;
  transmissiondateformat?: string;
  transmissiondate?: string;
  reporttype?: string;
  serious?: string;
  seriousnessdeath?: string;
  seriousnesslifethreatening?: string;
  seriousnesshospitalization?: string;
  seriousnessdisabling?: string;
  seriousnesscongenitalanomali?: string;
  seriousnessother?: string;
  receivedateformat?: string;
  receivedate?: string;
  receiptdateformat?: string;
  receiptdate?: string;
  additionaldocument?: string;
  documentlist?: string;
  fulfillexpeditecriteria?: string;
  companynumb?: string;
  fdasafetyreporttype?: string;
}

export let initialSafetyReportValues: ISafetyReport = {
  safetyreportversion: "",
  safetyreportid: "",
  primarysourcecountry: "",
  occurcountry: "",
  transmissiondateformat: "",
  transmissiondate: "",
  reporttype: "",
  serious: "",
  seriousnessdeath: "",
  seriousnesslifethreatening: "",
  seriousnesshospitalization: "",
  seriousnessdisabling: "",
  seriousnesscongenitalanomali: "",
  seriousnessother: "",
  receivedateformat: "",
  receivedate: "",
  receiptdateformat: "",
  receiptdate: "",
  additionaldocument: "",
  documentlist: "",
  fulfillexpeditecriteria: "",
  companynumb: "",
  fdasafetyreporttype: "",
};

interface Props {
  safetyReportValue: ISafetyReport;
  setSafetyReportOnChange: React.Dispatch<React.SetStateAction<boolean>>
  onChange: (values: ISafetyReport) => void;
}

const SafetyReport: React.FC<Props> = ({ safetyReportValue, setSafetyReportOnChange, onChange }) => {

  
  if (safetyReportValue) {
    initialSafetyReportValues.safetyreportversion = safetyReportValue?.safetyreportversion;
    initialSafetyReportValues.safetyreportid = safetyReportValue?.safetyreportid;
    initialSafetyReportValues.primarysourcecountry = safetyReportValue?.primarysourcecountry;
    initialSafetyReportValues.occurcountry = safetyReportValue?.occurcountry;
    initialSafetyReportValues.transmissiondateformat = safetyReportValue?.transmissiondateformat;
    initialSafetyReportValues.transmissiondate = safetyReportValue?.transmissiondate;
    initialSafetyReportValues.reporttype = safetyReportValue?.reporttype;
    initialSafetyReportValues.serious = safetyReportValue?.serious;
    initialSafetyReportValues.seriousnessdeath = safetyReportValue?.seriousnessdeath;
    initialSafetyReportValues.seriousnesslifethreatening = safetyReportValue?.seriousnesslifethreatening;
    initialSafetyReportValues.seriousnesshospitalization = safetyReportValue?.seriousnesshospitalization;
    initialSafetyReportValues.seriousnessdisabling = safetyReportValue?.seriousnessdisabling;
    initialSafetyReportValues.seriousnesscongenitalanomali = safetyReportValue?.seriousnesscongenitalanomali;
    initialSafetyReportValues.seriousnessother = safetyReportValue?.seriousnessother;
    initialSafetyReportValues.receivedateformat = safetyReportValue?.receivedateformat;
    initialSafetyReportValues.receivedate = safetyReportValue?.receivedate;
    initialSafetyReportValues.receiptdateformat = safetyReportValue?.receiptdateformat;
    initialSafetyReportValues.receiptdate = safetyReportValue?.receiptdate;
    initialSafetyReportValues.additionaldocument = safetyReportValue?.additionaldocument;
    initialSafetyReportValues.documentlist = safetyReportValue?.documentlist;
    initialSafetyReportValues.fulfillexpeditecriteria = safetyReportValue?.fulfillexpeditecriteria;
    initialSafetyReportValues.companynumb = safetyReportValue?.companynumb;
    initialSafetyReportValues.fdasafetyreporttype = safetyReportValue?.fdasafetyreporttype;
  }  

  const validationSchema = Yup.object({
    safetyreportversion: Yup.string(),
    safetyreportid: Yup.string(),
    primarysourcecountry: Yup.string(),
    occurcountry: Yup.string(),
    transmissiondateformat: Yup.string(),
    transmissiondate: Yup.string(),
    reporttype: Yup.string(),
    serious: Yup.string(),
    seriousnessdeath: Yup.string(),
    seriousnesslifethreatening: Yup.string(),
    seriousnesshospitalization: Yup.string(),
    seriousnessdisabling: Yup.string(),
    seriousnesscongenitalanomali: Yup.string(),
    seriousnessother: Yup.string(),
    receivedateformat: Yup.string(),
    receivedate: Yup.string(),
    receiptdateformat: Yup.string(),
    receiptdate: Yup.string(),
    additionaldocument: Yup.string(),
    documentlist: Yup.string(),
    fulfillexpeditecriteria: Yup.string(),
    companynumb: Yup.string(),
    fdasafetyreporttype: Yup.string(),
  });

  const handleSubmit = (values: ISafetyReport) => {
    try {
      const trimmedValue = validationSchema.cast(values);
      if (onChange) {
        setSafetyReportOnChange(false)
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
          initialValues={initialSafetyReportValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleSubmit, values, setValues }) => (
            <>
              <Form onChange={handleSubmit}>
                <div className="flex relative">
                  <div className="grid w-full grid-cols-6 md:grid-cols-4 lg:grid-cols-4 mb-2 ml-1">
                    {SafetyReportData?.map((item, index) => (
                      <div className="mr-12" key={index}>
                        <InputField
                          name={item.value}
                          id={item.value}
                          label={item.label}
                          type="text"
                        value={values[item.value as keyof ISafetyReport]}
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

export default SafetyReport;
