import { IStatus } from "../auth/auth.model";

export interface IInQueue {
  ID: string;
  Title: string;
  Tag: string[];
  Links: string[];
  Status: string;
  description: string;
}

export interface IReview {
  ID: string;
  Title: string;
  Tag: string[];
  Links: string[];
  Status: string;
  Decision: string;
  description: string;
}

export interface PaginationPayload {
  monitor_id?: string;
  pageNumber?: number;
  perPage?: number;
  label?: string
}

export interface getProductMonitorPayload {
  monitor_id?: string;
  pageNumber?: number;
  perPage?: number;
}

export interface IMissingAbstract {
  ID: string;
  Title: string;
  Tag: string[];
  Links: string[];
  Status: string;
  Decision: string;
  description: string;
}
export interface IDuplicates {
  ID: string;
  Title: string;
  Tag: string[];
  Links: string[];
  Status: string;
  Decision: string;
  description: string;
}

export interface IInQueueData extends IStatus {
  inQueue: MonitorData[];
}

export interface IMissingAbstractData extends IStatus {
  missingAbstract: IMissingAbstract[];
}
export interface IDuplicatesData extends IStatus {
  duplicates: IDuplicates[];
}

export interface IItem {
  id: string;
  monitor_id: string;
  name: string;
  description: string;
  purpose: string;
  status: string;
  frequency: string;
  from_date: string;
  to_date: string;
  abstract_team_id: string;
  abstract_team_name: string;
  qc_team_id: string;
  qc_team_name: string;
  citation_db: string;
  is_active: boolean;
  total_records: number;
  pending_records: number;
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
  filter_type: string
}

export interface IAbstractReviewData extends IStatus {
  abstractReviewData: [];
}

export interface IAbstractReviewMonitor extends IStatus {
  abstractReviewMontior: [];
}

export interface IReviewDetail {
  Title: string;
  Abstract: string;
  Keywords: string;
  Author: string;
  Article_Literature_ID: string;
  Full_text_Link: string;
  Publication: string;
  DOI_Sources: string;
  Country: string;
  Published_on: string;
  Affiliation: string;
  decision: string;
  Database: string;
  generative_ai_decision: string;
  generative_ai_confidence_score: string;
  generative_ai_summary: string;
  causality_assessment_decision: string;
  causality_assessment_confidence_score: string;
  causality_assessment_summary: string;
  designated_response_entity: {
    Medications: { entity: string; start: number; end: number }[];
    // Add other properties as needed
  };
  Tags: {
    Medications: { entity: string; start: number; end: number }[];
    // Add other properties as needed
  };
  summary: {
    text: string;
  }[];
}

export interface CountData {
  monitor_id: string;
  review_type: string;
  pending: number;
  valid_icsr: number;
  reviewed: number;
  full_text_required: number;
  translation_required: number;
  author_confirmation_required: number;
  author_followup_required: number;
  total: number;
  valid_percentage: number;
}

export interface IThirdPageAbstractData {
  id: string;
  monitor_id: string;
  citation_db: string;
  search_result_id: string;
  title: string;
  user_id: string;
  assignee: string;
  review_type: string;
  status: string;
  expert_decision: string;
  is_aggregate_reporting: boolean;
  is_safety_signal: boolean;
  is_serious_event: boolean;
  categories: [];
  classifications: [];
  comments: string;
  search_result_status: string;
  monitor_status: string;
  is_active: boolean;
  country: string;
  updated_on: string;
  article_id: string;
  ai_decision: string;
  confidence_score: number;
  reason: string;
  causality_decision: string;
  causality_confidence_score: number;
  causality_reason: string;
  designated_medical_events: any[];
  ai_tags: Tags;
  tags: any[];
  publication_types: string;
  mesh_terms: string[]
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}

interface Entity {
  entity: string[];
}

interface Tags {
  map: any;
  "Patient": Entity[];
  "Suspected Adverse Event(AE)": Entity[];
  "Medications": Entity[];
  "Suspected Case": Entity[];
  "Diagnosis /Diagnostic Procedure": Entity[];
  [key: string]: Entity[];
}

export interface MonitorData {
  id: string;
  monitor_id: string;
  citation_db: string;
  filter_type: string;
  search_result_id: string;
  title: string;
  user_id: string;
  assignee: string;
  review_type: string;
  status: string;
  expert_decision: string;
  abstract_review_decision: string;
  is_aggregate_reporting: boolean;
  is_safety_signal: boolean;
  is_serious_event: boolean;
  categories: string[];
  classifications: string[];
  comments: string;
  search_result_status: string;
  monitor_status: string;
  is_active: boolean;
  country: string;
  updated_on: string;
  article_id: string;
  ai_decision: string;
  confidence_score: number;
  reason: string;
  causality_decision: string;
  causality_confidence_score: number;
  causality_reason: string;
  designated_medical_events: string[];
  ai_tags: Tags;
  tags: string[];
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}

export interface IMonitorDetails {
  id: string;
  monitor_id: string;
  name: string;
  description: string;
  purpose: string;
  status: string;
  frequency: string;
  from_date: string;
  to_date: string;
  abstract_team_id: string;
  abstract_team_name: string;
  qc_team_id: string;
  qc_team_name: string;
  citation_db: string;
  is_active: boolean;
  total_records: number;
  pending_records: number;
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}
export interface AbstractDetailPayload {
  expert_review_ids: string[];
  decision: string;
  is_aggregate_reporting: boolean;
  is_safety_signal: boolean;
  is_serious_event: boolean;
  categories: string[];
  classifications: string[];
  comments: string;
}
export interface IMonitorData {
  monitor_id: string;
  start_date: string;
  end_date: string;
  counts: {
    Inprogress: number;
    Reviewed: number;
    "Missing Abstract": number;
    Duplicates: number;
    "Non-English": number;
    valid_icsr_count: number;
    valid_icsr_count_per: number;
    pending_count_per: number;
    total_counts: number;
    author_followup_count: number;
    invalid_icsr_count: number;
    fulltext_icsr_count: number;
    translation_icsr_count: number;
    author_confirmation_count: number;
  };
}
export interface payloadMonitorID {
  monitor_id: string;
  pmid: string;
}

export interface StatusChange {
  id: string;
  status: string;
}

export interface FileResponse {
  status: number;
  file_path?: string;
  message: string
}

export interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  email: string;
  user_name: string;
  team_name: string;
  team_type: string;
  task_assignment: string;
  percentage_load: number;
  is_active: boolean;
  is_team_active: boolean;
  is_user_active: boolean;
  created_on: string;
  modified_on: string;
}

export interface IAssignPayload {
  expert_review_ids: string[];
  user_id: string;
  comments?: string;
}

export interface IPdfFileDetails {
    summary: string
    decision: string
    confidence_score: number,
    reason: string
}

export interface IAbstractDetails {
  id: string;
  citation_db: string;
  metadata_id: string;
  article_id: string;
  title: string;
  abstract: string;
  author: string;
  doi: string;
  published_on: string;
  updated_on: string;
  affiliation: string;
  publisher: string;
  language: string;
  keywords: string;
  country: string;
  filter_type: string;
}

export interface CSVFileDetails {
  metadata_id: string;
  article_id: string;
  abstract: string;
  author: string;
  doi: string;
  published_on: string;
  affiliation: string;
  publisher: string;
  language: string;
  keywords: string;
  filter_type: string;
  citation_db: string;
  title: string;
  assignee: string;
  review_type: string;
  status: string;
  expert_decision: string;
  is_aggregate_reporting: boolean;
  is_safety_signal: boolean;
  is_serious_event: boolean;
  categories: [];
  classifications: [];
  comments: string;
  search_result_status: string;
  monitor_status: string;
  is_active: boolean;
  country: string;
  updated_on: string;
  ai_decision: string;
  confidence_score: number;
  reason: string;
  causality_decision: string;
  causality_confidence_score: number;
  causality_reason: string;
  designated_medical_events: any[];
  ai_tags: Tags;
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}

export interface DataEntity {
  Patient: {
    entity: string[];
  }[];
  "Suspected Adverse Event(AE)": {
    entity: string[];
  }[];
  Medications: {
    entity: string[];
  }[];
  "Special Situation": {
    entity: string[];
  };
  "Animal/In-Vitro": {
    entity: string[];
  }[];
  "Diagnosis /Diagnostic Procedure": {
    entity: string[];
  }[];
  "Special Keywords": {
    entity: string[];
  }[];
  "Study/Review/Clinical trial": {
    entity: string[];
  }[];
  Diseases: {
    entity: string[];
  }[];
  "Multiple Patients": {
    entity: string[];
  }[];
  History: {
    entity: string[];
  }[];
}

export interface TotalCountPayload {
  label: string
  id: string
}

export interface ReviewAbstractSendMailPayload {
    emails: string[],
    col: string,
    value: string,
    monitor_id: string,
    page: number,
    per_page: number,
    count: boolean
}
