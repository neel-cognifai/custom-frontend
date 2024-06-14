export interface  HistoryResult {
    search_result_id: string;
    review_type: string;
    from_user_id: string;
    to_user_id: string;
    from_assignee: string;
    to_assignee: string;
    from_status: string;
    to_status: string;
    from_decision: string;
    to_decision: string;
    from_is_aggregate_reporting: boolean;
    to_is_aggregate_reporting: boolean;
    from_is_safety_signal: boolean;
    to_is_safety_signal: boolean;
    from_is_serious_event: boolean;
    to_is_serious_event: boolean;
    from_categories: string[];
    to_categories: string[];
    from_classifications: string[];
    to_classifications: string[];
    from_comments: string;
    to_comments: string;
    from_modified_by: string;
    to_modified_by: string;
    created_on: string;
  }

export interface IAuditLogPayload {
    review_type?: string;
    search_result_id: string;
}

export interface Drug {
  actiondrug: string;
  drugresult: string;
  drugdosageform: string;
  drugdosagetext: string;
  drugindication: string;
  medicinalproduct: string;
  drugreactionasses: string;
  obtaindrugcountry: string;
  drugassessmentmethod: string;
  drugassessmentsource: string;
  drugcharacterization: string;
  drugauthorizationnumb: string;
  drugauthorizationholder: string;
  drugauthorizationcountry: string;
  drugindicationmeddraversion: string;
  drugreactionassesmeddraversion: string;
}

export interface MedicalHistoryEpisode {
  patientepisodename: string;
  patientmedicalcontinue: string;
  patientepisodenamemeddraversion: string;
}

export interface PatientPastDrugTherapy {
  patientdrugname: string;
}

export interface Patient {
  patientsex: string;
  patientinitial: string;
  patientonsetage: string;
  patientonsetageunit: string;
  medicalhistoryepisode: MedicalHistoryEpisode[];
  patientpastdrugtherapy: PatientPastDrugTherapy[];
  resultstestsprocedures: string;
}

export interface Summary {
  senderdiagnosis: string;
  narrativeincludeclinical: string;
  senderdiagnosismeddraversion: string;
}

export interface Reaction {
  reactionoutcome: string;
  reactionmeddrapt: string;
  reactionmeddrallt: string;
  primarysourcereaction: string;
  reactionmeddraversionpt: string;
  reactionmeddraversionllt: string;
  seriousness: string;
}

export interface PrimarySource {
  reportercity: string;
  qualification: string;
  reporterstreet: string;
  reportercountry: string;
  reportergivename: string;
  reporterpostcode: string;
  reporterdepartment: string;
  reporterfamilyname: string;
  literaturereference: string;
  reporterorganization: string;
}

export interface Audit {
  nodes: {
    drug: Drug;
    patient: Patient;
    summary: Summary;
    reaction: Reaction[];
    primary_source: PrimarySource;
  };
  created_by: string;
  created_on: string;
  modified_by: string;
  modified_on: string;
}

export interface XmlData {
  tenant_id: null;
  config_id: string;
  audits: Audit[];
}
