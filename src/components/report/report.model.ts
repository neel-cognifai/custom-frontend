
export interface IDashboardData {
  abstract_screened: number;
  gen_ai_review_valid: number;
  gen_ai_review_invalid: number;
  gen_ai_review_potential: number;
  expert_review_valid: number;
  expert_review_invalid: number;
  expert_review_pending: number;
  full_text_expert_review: number;
  xml_generated_e2b: number;
}

export interface IDashboardPayload {
    from_date: string;
    to_date: string;
}

export interface IAddReport{
  report_category: string,
  from_date: string | Date,
  to_date: string | Date
}

export interface IReportResponse {
 data : {
  id: string;
  report_id: string;
  s3_identifier: string | null;
  is_encrypted: boolean;
  password: string | null;
  created_on: string;
  modified_on: string;
  status: string;
  user_name: string;
  from_date: string;
  to_date: string;
 }
}

export interface IGetReportSignedUrl {
  report_id: string,
  url: string,
  status: string
}

export interface IReportMail {
  report_category: string,
  from_date: string | Date,
  to_date: string | Date
  emails: string[]
}

export interface IGetReportAll {
  id: string;
  report_id: string;
  category: string;
  s3_identifier: string | null;
  is_encrypted: boolean;
  password: string | null;
  created_on: string;
  modified_on: string;
  status: string;
  user_name: string;
  from_date: string;
  to_date: string;
}
  