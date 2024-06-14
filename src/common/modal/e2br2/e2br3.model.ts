import { IMedicalhistoryepisode } from "./medicalhistoryepisode";
import { IPatientPastDrugTherapy } from "./patientPastDrugTherapy";

export interface IStatus {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export interface IData extends IStatus {
  E2BR2Data: IGetE2BR2Data;
}

export interface IPatient {
  patientinitial?: string;
  patientonsetage?: string;
  patientonsetageunit?: string;
  patientsex?: string;
  resultstestsprocedures?: string;
  medicalhistoryepisode? :IMedicalhistoryepisode;
  patientpastdrugtherapy? : IPatientPastDrugTherapy
}

export interface IPrimarySource {
  reportergivename?: string;
  reporterfamilyname?: string;
  reporterorganization?: string;
  reporterdepartment?: string;
  reporterstreet?: string;
  reportercity?: string;
  reporterpostcode?: string;
  reportercountry?: string;
  qualification?: string;
  literaturereference?: string;
}

export interface IReaction {
  primarysourcereaction: string;
  reactionmeddraversionllt: string;
  reactionmeddrallt: string;
  reactionmeddraversionpt: string;
  reactionmeddrapt: string;
  reactionoutcome: string;
  seriousness: string
}

export interface IDrug {
  drugcharacterization?: string;
  medicinalproduct?: string;
  obtaindrugcountry?: string;
  drugauthorizationnumb?: string;
  drugauthorizationcountry?: string;
  drugauthorizationholder?: string;
  drugdosagetext?: string;
  drugdosageform?: string;
  drugindicationmeddraversion?: string;
  drugindication?: string;
  actiondrug?: string;
  drugreactionassesmeddraversion?: string;
  drugreactionasses?: string;
  drugassessmentsource?: string;
  drugassessmentmethod?: string;
  drugresult?: string;
}

export interface ISummary {
  narrativeincludeclinical?: string;
  senderdiagnosismeddraversion?: string;
  senderdiagnosis?: string;
}


export interface IE2BR2DataPayload {
  tenant_id: string | undefined;
  config_id: string | undefined
  nodes: {
    primary_source: IPrimarySource;
    patient: IPatient;
    reaction: IReaction[];
    drug: IDrug;
    summary: ISummary;
  };
}

export interface DownloadXML {
  tenant_id: string | undefined;
  config_id: string | undefined
}

export interface IUpdateE2BR2DataPayload {
  id: string;
  nodes: {
    primarysource: IPrimarySource;
    patient: IPatient;
    reaction: IReaction;
    drug: IDrug;
    summary: ISummary;
  };
}

export interface IGetE2BR2Data {
  id: string;
  tenant_id: string;
  nodes: {
    primary_source: IPrimarySource;
    patient: IPatient;
    reaction: IReaction[];
    drug: IDrug;
    summary: ISummary;
  };
  status?: string
}
