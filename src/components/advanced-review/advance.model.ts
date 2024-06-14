import { IStatus } from "../auth/auth.model";

export interface IValidICSR
{
  ID: string;
  Title: string;
  Tag: string[];
  Links: string[];
  Status: string;
  Decision: string;
  description: string;
}

export interface IThirdPageAdvanceData {
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
  designated_medical_events: any[]; 
  ai_tags: any[];
  tags: any[];
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
  abstract_reviewed_by: string;
  abstract_review_status: string;
  abstract_review_decision: string;
  abstract_review_is_aggregate_reporting: boolean;
  abstract_review_is_safety_signal: boolean;
  abstract_review_is_serious_event: boolean;
  abstract_review_categories: string[];
  abstract_review_classifications: string[];
  abstract_review_comments: string;
  mesh_terms: string[]
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
}

export interface IIValidICSRData extends IStatus {
  inQueue: IValidICSR[];
}


export interface IAdvancedReviewData extends IStatus {
    advancedReviewData : IItem
}


export interface IDetail {
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
  Database: string;
  generative_ai_decision: string;
  generative_ai_confidence_score: string;
  generative_ai_summary: string;
  causality_assessment_decision: string;
  causality_assessment_confidence_score: string;
  causality_assessment_summary: string;
  advance_decision: "",
  review_decision: [];
  comment: '' 
  classification: [];
  category: [];
  designated_response_entity: {
    Medications: { entity: string; start: number; end: number }[];
    // Add other properties as needed
  };
  Tags: {
    Medications: { entity: string; start: number; end: number }[];
    // Add other properties as needed
  };
  summary:{
    text:string,
  }[]
}

export interface ReviewQcSendMailPayload {
  emails: string[],
  col: string,
  value: string,
  monitor_id: string,
  page: number,
  per_page: number,
  count: boolean
}