import { IReceiver } from "./E2BR2R3Component/Receiver";
import { ISafetyReport } from "./E2BR2R3Component/SafetyReport";
import { ISender } from "./E2BR2R3Component/Sender";

export interface IStatus {
    loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export default interface TenantUserData {
  tenant_id: string;
}

export interface IAddCategoryPayload {
  tenant_id: string;
  name: string;
  description?: string
}

export interface IAddClassificationPayload {
  tenant_id: string;
  name: string;
  description?: string
}

export interface ICategory {
  id: string;
  tenant_id: string;
  name: string;
  description: string;
  created_on: string;
  modified_on: string;
}

export interface IClassification {
    id: string;
    tenant_id: string;
    name: string;
    description: string;
    created_on: string;
    modified_on: string;
}

export interface IData extends IStatus {
    Category: ICategory[];
    Classification: IClassification[];
    TotalCategory: number
    TotalClassification: number
    getCategory: ICategory
    getClassification: IClassification
    E2BR2Data: IGetE2BR2Data
}

export interface IE2BR2DataPayload {
  tenant_id: string | undefined,
  nodes: {
    safety_report : ISafetyReport
    sender: ISender
    receiver: IReceiver
  }
}

export interface IUpdateE2BR2DataPayload {
  id: string,
  nodes: {
    safety_report : ISafetyReport
    sender: ISender
    receiver: IReceiver
  }
}

export interface IGetE2BR2Data {
  id: string;
  tenant_id: string;
  nodes: {
      safety_report: ISafetyReport;
      sender: ISender;
      receiver: IReceiver;
  };
}

export interface EditCategoryPayload {
  review_category_id: string,
  name?: string
  description?: string
}


export interface EditClassificationPayload {
  review_classification_id: string,
  name?: string
  description?: string
}
