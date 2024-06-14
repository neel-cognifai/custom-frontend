import { Tag } from "@/common/tagInput/tagInput";
import { ICheckboxState, IUploadFile } from "./AddDrugMonitor";

export interface IStatus {
  loading: "idle" | "pending" | "fulfilled" | "rejected";
}

export interface FileResponse {
  id: string;
  filter_type: string;
  params: {};
  created_on: string;
  modified_on: string;
}

export interface IFileUpload {
  file_type: string;
  formData?: FormData;
  article_id?: string;
  title?: string;
  abstract?: string;
  citation?: string;
  author?: string;
  affiliation?: string;
  country?: string;
  doi_sources?: string;
  keywords?: string;
  language?: string;
  publisher?: string;
  published_on?: string;
  updated_on?: string;
}

export interface IExtendMonitorPayload {
  pre_monitor_id: string;
  monitor_id: string;
}

export interface FullTextRequiredPayload {
  id?: string;
  password?: string;
  file: File | null;
}

export interface IAddDrugMonitor {
  monitorId: string;
  monitorName: string;
  description: string;
  startDate: Date | null;
  endDate: Date | null;
  publishBeforeMSHDate: Date | null;
  uploadModalValues: IUploadFile;
  selectedResearchUpdate: string;
  selectedPurpose: string;
  selectedReviewTeam: string;
  selectedQCTeam: string;
  sourceCheckboxes: ICheckboxState;
  selectedCheckboxes: ICheckboxState;
  countryOfOriginTags: Tag[];
}

export interface IAddDrugMonitorInJournalSearch {
  monitorId: string;
  monitorName: string;
  description: string;
  startDate: string | null;
  endDate: string | null;
  publishBeforeMSHDate: string | null;
  selectedResearchUpdate: string;
  selectedPurpose: string;
  selectedReviewTeam: string;
  selectedQCTeam: string;
  uploadModalValues?: IUploadFile;
  sourceCheckboxes: ICheckboxState;
  selectedCheckboxes: ICheckboxState;
  non_english: boolean;
}

export interface IDrugMonitor {
  id: string;
  monitor_id: string;
  new: boolean;
  name: string;
  description: string;
  to_date: string;
  "Pending Case": string;
  total_records: string;
  "Monitor status": string;
  Database?: string;
  status?: string;
}

export interface IAddDrugMonitorData extends IStatus {
  productMonitor: IDrugMonitor[];
}

export interface IListDrugMonitor {
  selectedFile: IUploadFile;
  MonitorData: [];
  selectedFormatType: string;
}

export interface IEditDrugMonitor {
  ID: string;
  Title: string;
  Abstract: string;
  Mesh_Terms: string[] | null;
  Literature_source: string;
  Updated_On: string;
  Published_on: string;
  Country: string;
  Author: string;
  Article_Literature_ID: string;
  Full_text_Link: string | null;
  Publication: string;
  DOI_Sources: string;
  Affiliation: string;
  Language: string;
  Keywords: string[] | null;
}
interface JournalDetail {
  ID: string;
  Title: string;
  Abstract: string;
  Mesh_Terms: string[] | null;
  Literature_source: string | null;
  Updated_On: string | null;
  Country: string;
  Author: string | null;
  Article_Literature_ID: string | null;
  Full_text_Link: string | null;
  Publication: string | null;
  DOI_Sources: string | null;
  Published_on: string;
  Affiliation: string | null;
  Language: string;
  Keywords: string;
}

export interface IEditMonitorData {
  end_date: string;
  purpose: string;
  monitorname: string;
  description: string;
  qc_team: string;
  schedule_date: string;
  database: string;
  excluded_id: number;
  updated_at: string;
  delete_status: boolean;
  monitor_id: string;
  start_date: string;
  abstract_team: string;
  schedule_duration: string;
  country_of_origin: [];
  journal_details: JournalDetail[];
}

export interface ITeam {
  id: number;
  teamname: string;
  description: string;
  team_status: string;
  team_type: string;
  assign_type: string;
  tenant_id: number;
}

export interface createMonitor {
  pre_monitor_id: string;
  name: string;
  description: string;
  purpose: string;
  frequency: string;
  from_date: string;
  to_date: string;
  abstract_team_id: string;
  qc_team_id: string;
  non_english: boolean;
  is_animal_invitro: boolean;
  is_publish_before_mah_date: boolean;
  is_abuse: boolean;
  is_without_tag: boolean;
  mah_date: string;
  origin_countries: string[];
}

export interface IDownload {
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
  filter_type: string;
  ai_decision: string;
  confidence_score: number;
  reason: string;
  causality_decision: string;
  causality_confidence_score: number;
  causality_reason: string;
  designated_medical_events: string[];
  ai_tags: string[];
  tags: string[];
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}

export interface AuditLogPayload {
  id?: string;
  status?: string;
  pageNumber?: number;
  perPage?: number;
}

export interface ISendEmail {
  expert_review_type: string;
  page: number;
  per_page: number;
  count: boolean;
  emails: string[];
  col?: string;
  value?: string;
}

export interface ISendCitationEmail {
  search_query: string;
  start_date: string;
  end_date: string;
  emails: string[];
  page: number;
  per_page: number;
}
