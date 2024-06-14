export const CONSTANTS = {
  LOCAL_STORAGE_KEYS: {
    FILTER_TYPE: "FilterType",
    LIST_USER_TEAM: "TeamUserList",
    DATA_STORE: "DataStore",
    TENANT_USER_ID: "tenantUserId",
    PRE_MONITOR_FILTER: "pre_monitor_filter",
    CITATION_COUNT: "citation_count",
    USERDATA: "userData",
    TOKEN: "token",
    RecordIndex: "RecordIndex",
    ACCESSTOKEN:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRoYXJtaWtzaGFoMDkwQGdtYWlsLmNvbSIsIl9pZCI6IjY0NGEzYmMwZDMxZTliMDE4YTljMWM4ZCIsImlhdCI6MTY4NTUzMDYzMSwiZXhwIjoxNjg1NTUyMjMxfQ.ndivClP23QAH4tq0k5iLYSLiGpjYUorDiKBRDxiLpxU",
  },
  MONITOR_STATUS_IN_PROGRESS: "AI Review Completed",
  MONITOR_STATUS_COMPLETED: "Completed",
  MONITOR_STATUS_CANCELLED: "Cancelled",

  // Expert Review Decision
  EXPERT_REVIEW_DECISION_PENDING: "Decision Pending",
  EXPERT_REVIEW_DECISION_VALID_ICSR: "Valid ICSR",
  EXPERT_REVIEW_DECISION_INVALID_ICSR: "Invalid ICSR",
  EXPERT_REVIEW_DECISION_POTENTIAL_ICSR: "Potential ICSR",
  SEARCH_RESULT_STATUS_DUPLICATE : "Duplicate",
  AI_Review_Completed : "AI Review Completed",

  requireMessage: {
    patientRequired: "patient is required",
    genderRequired: "gender is required",
    ageRequired: "age is required",
    unitRequired: "Units is required",
    groupRequired: "Group is required",
    searchRequired: "Search field is required",
  },
  errorMessage: {
    searchFailed: "Search failed",
    unexpectedError: "An unexpected error occurred",
    invalidDate: "Invalid Date",
  },
  tenantConstants: {
    customer_name: {
      requireName: "Customer name is required",
    },
    description: {
      requireName: "Description is required",
    },
  },
  myTeamConstants: {
    team_name: {
      requireName: "Team name is required",
    },
    Tenant: {
      requireName: "Tenant is required",
    },
    description: {
      requireName: "description is required",
    },
    TeamType: {
      requireName: "Team Type is required",
    },
    TeamAssignType: {
      requireName: "Team Assign Type is required",
    },
  },
  generalConstants: {
    category: {
      requireCategory: "Category is required",
      requireDescription: "Description is required",
    },
    classification: {
      requireClassification: "Classification is required",
      requireDescription: "Description is required",
    },
  },
  signInConstants: {
    user_name: {
      requireName: "User Name is required",
    },
    team_name: {
      requireName: "Team name is required",
    },
    contact: {
      requireContact: "Contact no is required",
    },
    email: {
      invalidEmailFormat: "invalid email format",
      IsEmail: "Invalid email address",
      requireEmail: "Email address is required",
    },
    password: {
      requirePassword: "Password is required",
      newPassword: "New password is required",
      confirmPassword: "Confirm password is required",
    },
  },
  ROUTING_PATHS: {
    login: "/",
    dashboard: "/dashboard",
    journalSearch: "/journal-search",
    drugMonitor: "/drug-monitor",
    abstractReview: "/abstract-review",
    advancedReview: "/advanced-review",
    auditLog: "/audit-log",
    report: "/report",
    settings: "/settings",
    systemSettings: "/system-settings",
    journalSearch2: "/journal-search-2",
    AbstractReview2: "/abstract-review-2",
    AbstractReview3: "/abstract-review-3",
    AbstractReview4: "/abstract-review-bulkupdate",
    advancedReview2: "/advanced-review-2",
    advancedReview3: "/advanced-review-3",
    PDFReader: "/pdfReader",
    PDFReaderFromTable: "/pdfReaderFromTable",
    ListAuditLog: "/ListAuditLog",
    ResetPassword: "/reset-password"
  },
  navbarContent: [
    {
      id: 1,
      label: "Home",
      link: "/dashboard",
    },
    {
      id: 2,
      label: "About Us",
      link: "/about",
    },
  ],
};
export const STATUS = {
  pending: "pending",
  fulfilled: "fulfilled",
  rejected: "rejected",
};

export const CURRENT_VERSION= 'CoVigilAI (version: v1.1.13)';

export const privacyPolicyURL = 'https://covigilai.in/privacy-policy';

export const termsOfService = 'https://covigilai.in/terms-of-service';

export const status = Object.freeze({
  unchecked: 0,
  checked: 1,
  indeterminate: -1,
});

export const emailRegexPattern = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9]+.[a-zA-Z0-9]+$/;

export interface IToastOption {
  DEFAULT: string;
  WARNING: string;
  ERROR: string;
  INFO: string;
  SUCCESS: string;
}

export const API_METHOD_TYPE = {
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  DELETE: "DELETE",
};

export const RES_CODE = {
  error: {
    badRequest: 400,
    forbidden: 403,
    internalServerError: 500,
    notFound: 404,
    unauthorized: 401,
  },
  success: 200,
};

export const keyMappingOfAutomaticEXCLUSIONTag = {
  "Animal / Invitro": "animal_or_in_vitro",
  Duplicates: "duplicates",
  "Publish before start date": "publish_before_start_date",
  "Abuse / Misuse": "abuse_or_misuse",
  "Without any tags (suspected AE, Patient identified & suspected Case)":
    "without_any_tags",
};

export const abstractReviewDetailCategoryOptions = [
  { label: "Clinical Trial", value: "Clinical_trial" },
  { label: "No Patient Info Detected", value: "No_patient_info_detected" },
  { label: "Meta Analysis", value: "Meta_analysis" },
  { label: "Review Article", value: "Review_Article" },
  { label: "Off Label", value: "Off_label" },
  { label: "Animal Invitro Study", value: "Animal_invitro_study" },
  { label: "Toxilogy Study", value: "toxilogy_study" },
  { label: "SLA Study", value: "SLA_Study" },
];

export const defaultPerPage = 50;

export const abstractReviewDetailClassificationOptions = [
  { label: "Overdose", value: "Overdose" },
  {
    label: "Quality Issues/False Issues",
    value: "Quality_issues_or_false_issues",
  },
  { label: "Elderly", value: "Elderly" },
  { label: "Inefficiency", value: "inefficiency" },
];

export const fullTextDocumentTranslation = ["Free PMC", "Paid PMC"];

export const systemMessage = {
  NoUserExists: "No user exists",
  AddReportSuccess: "Report add successfully",
  DeleteCategory: "Category deleted successfully",
  DeleteClassification: "Classification deleted successfully",
  PasswordUpdate: "Password updated successfully",
  E2br2AddSuccess: "E2BR3 data added successfully",
  E2br2UpdateSuccess: "E2BR3 data updated successfully",
  review_successfully: "Review submitted successfully",
  required: "#field# is required",
  not_found: "No records found",
  pumped_file_type: "Not a valid file type",
  add: "Monitor added successfully",
  update: "Monitor updated successfully",
  Login_Success: "Login successfully",
  "Delete Success": "Delete successfully",
  "LogOut Success": "LogOut successfully",
  MarkCompleted: "Marked as completed",
  MarkInProgress: "Marked as in progress",
  MaskCancelled: "Marked as cancelled",
  ADD_TENANT: "Tenant added successfully",
  ADD_ROLE: "Role added successfully",
  ADD_TEAM: "Team added successfully",
  ADD_UPDATED: "Team update successfully",
  ROLE_UPDATED: "Role updated successfully",
  UPDATE_TENANT: "Tenant update successfully",
  InvalidCredentials: "Invalid credentials",
  ResetPasswordEmailSent: "Reset password email sent successfully",
  Something_Wrong: "Something went wrong",
  Review_Already_Submitted: "Review already submitted",
  Marked_as_unassigned : "This monitor marked as Unassigned",
  ADD_USER: "User added successfully",
  UPDATED_ROLE: "User role updated successfully",
  UPDATED_TENANT: "User tenant updated successfully",
  UserRoleExists: "User role already exists for this user",
  UserTenantExists: "User tenant already exists for this user",
  CategoryAddSuccessfully: "Category added successfully",
  CategoryUpdateSuccessfully: "Category updated successfully",
  ClassificationAddSuccessfully: "Classification added successfully",
  ClassificationUpdateSuccessfully: "Classification updated successfully",
  ErrorInCompleted: "An error occurred while processing the request:",
  AssignSuccessFully: "Member assigned successfully",
  InValidMonitorDetails: "Invalid monitor details",
  FileUploadSuccessfully: "File uploaded successfully",
  PasswordRequired: "Passcode is required",
  FullTextLinkNotAvailable: "Full text Link is not available",
  PleaseSelectValidRecord: "Please Select Valid Record",
  AfterSuccessAddMonitorMessage:
    "Abstract auto screening process has been submitted successfully",
  SendMailSuccess: "Email sent successfully",
  AbstractReviewNoneValidationMessage: "Abstract Review 'None' sets QC Review to 'None'."
};

export const StatusData = [
  { name: "Completed", value: "Completed" },
  { name: "Assigned", value: "Assigned" },
  { name: "Unassigned", value: "Unassigned" },
  { name: "Reassigned", value: "Reassigned" },
  { name: "In Progress", value: "In Progress" },
];

export const ExpertDecision = [
  { name: "Decision Pending", value: "Decision Pending" },
  { name: "Valid ICSR", value: "Valid ICSR" },
  { name: "Invalid ICSR", value: "Invalid ICSR" },
  { name: "ICSR Full Text Required", value: "ICSR Full Text Required" },
  { name: "ICSR Translation Required", value: "ICSR Translation Required" },
  {
    name: "ICSR Author Confirmation Required",
    value: "ICSR Author Confirmation Required",
  },
  {
    name: "ICSR Author Followup Required",
    value: "ICSR Author Followup Required",
  },
];

export const AllowedTypesPubmed = ["text/plain"];
export const AllowedTypesEmbase = ["xlsx"];
export const highlightedColor = {
  Patient: "red",
  "Diagnosis /Diagnostic Procedure": "brown",
  "Monitor (Target Drug)": "skyblue",
  Medications: "blue",
  "Interesting events / observations": "green",
  "Interesting section / special section": "deeppink",
  "Special situation": "rebeccapurple",
  "Special Keywords": "darkmagenta",
  "Advisory Notice": "black",
  Diseases: "Diseases",
  Branding: "Branding",
  "patient population": "turquoise",
  "Multiple Patients": "#cae41f",
  Reviewed: "orange",
  "Clinical trial": "lightgreen",
};

export const TeamName = [
  "Ariene McCoy",
  "Jerome Bell",
  "Darrell Steward",
  "Devon Lane",
];
export const SelectPurpose = [
  "Aggregate reporting",
  "Serious event",
  "Safety signal",
  "System",
  "ICSR",
  "Monitor",
];
export const SelectReporting = [
  {
    category: "Abstract-review-Aggregate-reporting",
    description: "Reports all Abstracts which has Aggregate reporting as marked from the abstract review for a given period.",
  },
  {
    category: "Abstract-review-Serious-event",
    description: "Reports all Abstracts which has Serious event as marked from the abstract review for a given period.",
  },
  {
    category: "Abstract-review-Safety-signal",
    description: "Reports all Abstracts which has Safety Signal as marked from the abstract review for a given period.",
  },
  {
    category: "Teams-Activity",
    description: "Reports Teams activity with user activity details.",
  },
  {
    category: "Product-Monitor-Monitors-List",
    description: "Export of all Monitor definitions.",
  },
  {
    category: "Expert-Review-Valid-ICSR",
    description: "Reports all Abstracts which has been in QC approved decision.",
  },
  {
    category: "Expert-Review-In-Valid-ICSR",
    description: "Reports all Abstracts which has been in QC reject decision.",
  },
  {
    category: "Abstract-Review-Pending-Cases",
    description: "Reports all Abstracts which has been in Pending along with Fulltext required and duplicates cases.",
  },
  {
    category: "Abstract-Review-Reviewed",
    description: "Reports all Abstracts which has been in reviewed status.",
  },
  {
    category: "QC-Report-Total-Rejected-Cases",
    description: "Reports all Abstracts which has been in QC reject decision with Abstract and QC decision difference.",
  },
  {
    category: "Article-Total-cases",
    description: "Reports all Article details.",
  },
  {
    category: "Total-Teams-list",
    description: "Export of all configured users and corresponding teams.",
  },
  {
    category: "Total-users-List",
    description: "Export of all configured users and corresponding teams.",
  },
  {
    category: "Category-List",
    description: "Export of all configured Categories.",
  },
  {
    category: "Classification-List",
    description: "Export of all configured Classifications.",
  },
  {
    category: "Tenant-List",
    description: "Export of all configured Tenants.",
  },
  {
    category: "Pubmed-Data-Feed-Report",
    description: "Pubmed Data feed report with count of records inserted.",
  },
  {
    category: "Full-text-search-Total-cases",
    description: "Export of all configured Citation Full text.",
  },
  {
    category: "E2B-R3-Total-cases",
    description: "Export of all configured Total Cases for E2B R3.",
  },
  // Add other categories with descriptions
];

export const SelectSubReporting = [
  "Abstract review",
  "System Activity Log",
  "Failed Logins",
  "Review Activity",
  "Reviews Summary",
  "Pending",
  "Reviewed",
  "Valid ICSR",
  "InValid ICSR",
  "QC Report - Approved",
  "QC Report - Rejected",
  "QC Report",
  "Team and User activity",
  "Team Monitor assignment",
  "Monitors",
  "Users and Teams",
  "Monitors to Team Permissions",
  "completed reviews",
];

export const ReviewName = [
  "Valid ICSR",
  "Invalid ICSR",
  "ICSR Full Text Required",
  "ICSR Translation Required",
  "ICSR Author Confirmation Required",
  "ICSR Author Followup Required",
];

export const QcReviewName = [
  "Valid ICSR",
  "Invalid ICSR",
];

export const FullTextAttachmentDocument = [
  "Free PMC",
  "Paid PMC",
  "Translation Document",
  "Encrypted document",
];

export const tagsAbstract = {
  Patient: "Patient",
  diagnosis: "Diagnosis /Diagnostic Procedure",
  "Monitor (Target Drug)": "Monitor (Target Drug)",
  Medications: "Medications",
  "Interesting events / observations": "Suspected Adverse Event(AE)",
  "Interesting section / special section":
    "Interesting section / special section",
  "Off label": "Off label",
  "Occupational exposure(OC exposure)": "Occupational exposure(OC exposure)",
  "Medication error": "Medication error",
  "Lack of efficacy": "Lack of efficacy",
  Overdose: "Overdose",
  "Drug interaction": "Drug interaction",
  "Abuse/Drug misuse/drug dependence": "Abuse/Drug misuse/drug dependence",
  "Study/Review/Clinical trial": "Study/Review/Clinical trial",
  "Special Keywords": "Special Keywords",
  Diseases: "Diseases",
  Branding: "Branding",
  "Pregnancy/fetus/foetus": "Pregnancy/fetus/foetus",
  Elderly: "Elderly",
  Pediatric: "Pediatric",
  "Patient population": "Patient population",
  "Multiple Patients": "Multiple Patients",
  History: "History",
  "Animal/In-Vitro": "Animal/In-Vitro",
  "Diagnosis /Diagnostic Procedure": "Diagnosis /Diagnostic Procedure",
};

export const SummaryTags = {
  "Animal/In-Vitro": "Animal/In-Vitro",
  "Pregnancy/fetus/foetus": "Pregnancy/fetus/foetus",
  Elderly: "Elderly",
  Pediatric: "Pediatric",
  "Suspected Adverse Event(AE)": "Suspected Adverse Event(AE)",
  PatientIdentified: "Patient",
  SuspectedCase: "Suspected Case",
  "Abuse/Drug": "Abuse/Drug misuse/drug dependence",
  OccupationalExposure: "Occupational exposure(OC exposure)",
  OffLabel: "Off Label",
  "Diagnosis /Diagnostic Procedure": "Diagnosis /Diagnostic Procedure",
};

export const FullTextAttachmentDocumentType = [
  "Encrypted Document",
  "Unencrypted Document",
];

export const monitorCheckboxes: { [key: string]: string } = {
  "Animal / Invitro": "animal_or_in_vitro",
  "Publish before MAH date": "publish_before_mah_date",
  "Abuse / Misuse": "abuse_or_misuse",
  "Without any tags (suspected AE, Patient identified & suspected Case)":
    "without_any_tags",
};

export const statusCards = [
  {
    count: 28,
    text: "In queue",
    color: "bg-cyan-400",
  },
  {
    count: 0,
    text: "Pending author follow up",
    color: "bg-violet-600",
  },
  {
    count: 11,
    text: "Pending full text",
    color: "bg-amber-300",
  },
  {
    count: 10,
    text: "Pending translation",
    color: "bg-orange-500",
  },
  {
    count: 18,
    text: "Reviewed",
    color: "bg-lime-500",
  },
];

export const PatientData = [
  { label: "Patient Initial", value: "patientinitial" },
  { label: "Patient Onset Age", value: "patientonsetage" },
  { label: "Patient Onset Age Unit", value: "patientonsetageunit" },
  { label: "Patient Sex", value: "patientsex" },
  { label: "Results Tests Procedures", value: "resultstestsprocedures" },
];

export const PrimarySourceData = [
  { label: "Reporter Given Name", value: "reportergivename" },
  { label: "Reporter Family Name", value: "reporterfamilyname" },
  { label: "Reporter Organization", value: "reporterorganization" },
  { label: "Reporter Department", value: "reporterdepartment" },
  { label: "Reporter Street", value: "reporterstreet" },
  { label: "Reporter City", value: "reportercity" },
  { label: "Reporter Postal Code", value: "reporterpostcode" },
  { label: "Reporter Country", value: "reportercountry" },
  { label: "Qualification", value: "qualification" },
  { label: "Literature Reference", value: "literaturereference" },
];

export const ReactionData = [
  { label: "Primary Source Reaction", value: "primarysourcereaction" },
  { label: "Reaction MedDRA Version LLT", value: "reactionmeddraversionllt" },
  { label: "Reaction MedDRA LLT", value: "reactionmeddrallt" },
  { label: "Reaction MedDRA Version PT", value: "reactionmeddraversionpt" },
  { label: "Reaction MedDRA PT", value: "reactionmeddrapt" },
  { label: "Reaction Outcome", value: "reactionoutcome" },
  { label: "Seriousness", value: "seriousness" },
];

export const DrugData = [
  { label: "Drug Characterization", value: "drugcharacterization" },
  { label: "Medicinal Product", value: "medicinalproduct" },
  { label: "Obtain Drug Country", value: "obtaindrugcountry" },
  { label: "Drug Authorization Number", value: "drugauthorizationnumb" },
  { label: "Drug Authorization Country", value: "drugauthorizationcountry" },
  { label: "Drug Authorization Holder", value: "drugauthorizationholder" },
  { label: "Drug Dosage Text", value: "drugdosagetext" },
  { label: "Drug Dosage Form", value: "drugdosageform" },
  {
    label: "Drug Indication MedDRA Version",
    value: "drugindicationmeddraversion",
  },
  { label: "Drug Indication", value: "drugindication" },
  { label: "Action Drug", value: "actiondrug" },
  {
    label: "Drug Reaction Assessment MedDRA Version",
    value: "drugreactionassesmeddraversion",
  },
  { label: "Drug Reaction Assessment", value: "drugreactionasses" },
  { label: "Drug Assessment Source", value: "drugassessmentsource" },
  { label: "Drug Assessment Method", value: "drugassessmentmethod" },
  { label: "Drug Result", value: "drugresult" },
];

export const SummaryData = [
  { label: "Narrative Include Clinical", value: "narrativeincludeclinical" },
  {
    label: "Sender Diagnosis MedDRA Version",
    value: "senderdiagnosismeddraversion",
  },
  { label: "Sender Diagnosis", value: "senderdiagnosis" },
];

export const MedicalHistoryEpisodeData = [
  {
    label: "Patient Episode Name MedDRA",
    value: "patientepisodenamemeddraversion",
  },
  { label: "Patient Episode Name", value: "Versionpatientepisodename" },
  { label: "Patient Medical Continue", value: "patientmedicalcontinue" },
];

export const PatientPastDrugTherapyData = [
  { label: "patient Drug Name", value: "Patientdrugname" },
];

export const SafetyReportData = [
  { label: "Safety Report Version", value: "safetyreportversion" },
  { label: "Safety Report ID", value: "safetyreportid" },
  { label: "Primary Source Country", value: "primarysourcecountry" },
  { label: "Occur Country", value: "occurcountry" },
  { label: "Transmission Date Format", value: "transmissiondateformat" },
  { label: "Transmission Date", value: "transmissiondate" },
  { label: "Report Type", value: "reporttype" },
  { label: "Serious", value: "serious" },
  { label: "Seriousness Death", value: "seriousnessdeath" },
  {
    label: "Seriousness Life Threatening",
    value: "seriousnesslifethreatening",
  },
  { label: "Seriousness Hospitalization", value: "seriousnesshospitalization" },
  { label: "Seriousness Disabling", value: "seriousnessdisabling" },
  {
    label: "Seriousness Congenital Anomaly",
    value: "seriousnesscongenitalanomali",
  },
  { label: "Seriousness Other", value: "seriousnessother" },
  { label: "Receive Date Format", value: "receivedateformat" },
  { label: "Receive Date", value: "receivedate" },
  { label: "Receipt Date Format", value: "receiptdateformat" },
  { label: "Receipt Date", value: "receiptdate" },
  { label: "Additional Document", value: "additionaldocument" },
  { label: "Document List", value: "documentlist" },
  { label: "Fulfill Expedite Criteria", value: "fulfillexpeditecriteria" },
  { label: "Company Number", value: "companynumb" },
  { label: "FDA Safety Report Type", value: "fdasafetyreporttype" },
];

export const ReceiverData = [
  { label: "Receiver Type", value: "receivertype" },
  { label: "Receiver Organization", value: "receiverorganization" },
  { label: "Receiver Department", value: "receiverdepartment" },
  { label: "Receiver Title", value: "receivertitle" },
  { label: "Receiver Given Name", value: "receivergivename" },
  { label: "Receiver Family Name", value: "receiverfamilyname" },
  { label: "Receiver Street Address", value: "receiverstreetaddress" },
  { label: "Receiver City", value: "receivercity" },
  { label: "Receiver State", value: "receiverstate" },
  { label: "Receiver Postal Code", value: "receiverpostcode" },
  { label: "Receiver Country Code", value: "receivercountrycode" },
  { label: "Receiver Telephone", value: "receivertel" },
  { label: "Receiver Telephone Country Code", value: "receivertelcountrycode" },
  { label: "Receiver Fax", value: "receiverfax" },
  { label: "Receiver Fax Country Code", value: "receiverfaxcountrycode" },
  { label: "Receiver Email Address", value: "receiveremailaddress" },
];

export const SenderData = [
  { label: "Sender Type", value: "sendertype" },
  { label: "Sender Organization", value: "senderorganizatio" },
  { label: "Sender Street Address", value: "senderstreetaddress" },
  { label: "Sender City", value: "sendercit" },
  { label: "Sender State", value: "senderstat" },
  { label: "Sender Postal Code", value: "senderpostcod" },
  { label: "Sender Country Code", value: "sendercountrycod" },
  { label: "Sender Title", value: "senderte" },
  { label: "Sender Email Address", value: "senderemailaddress" },
];

export const CategoryData = [
  {
    category: "Clinical Trial",
  },
  {
    category: "No Patient Info Detected",
  },
  {
    category: "Meta Analysis",
  },
  {
    category: "Review Article",
  },
  {
    category: "Off Label",
  },
  {
    category: "Animal Invitro Study",
  },
  {
    category: "Toxicology Study",
  },
  {
    category: "SLA Study",
  },
];

export const ClassificationData = [
  {
    classification: "Overdose",
  },
  {
    classification: "Quality Issues/False Issues",
  },
  {
    classification: "Elderly",
  },
  {
    classification: "Inefficiency",
  },
];

export const countriesArray = [
  { label: "Afghanistan", value: "AF" },
  { label: "Ã…land Islands", value: "AX" },
  { label: "Albania", value: "AL" },
  { label: "Algeria", value: "DZ" },
  { label: "American Samoa", value: "AS" },
  { label: "Andorra", value: "AD" },
  { label: "Angola", value: "AO" },
  { label: "Anguilla", value: "AI" },
  { label: "Antarctica", value: "AQ" },
  { label: "Antigua and Barbuda", value: "AG" },
  { label: "Argentina", value: "AR" },
  { label: "Armenia", value: "AM" },
  { label: "Aruba", value: "AW" },
  { label: "Australia", value: "AU" },
  { label: "Austria", value: "AT" },
  { label: "Azerbaijan", value: "AZ" },
  { label: "Bahamas", value: "BS" },
  { label: "Bahrain", value: "BH" },
  { label: "Bangladesh", value: "BD" },
  { label: "Barbados", value: "BB" },
  { label: "Belarus", value: "BY" },
  { label: "Belgium", value: "BE" },
  { label: "Belize", value: "BZ" },
  { label: "Benin", value: "BJ" },
  { label: "Bermuda", value: "BM" },
  { label: "Bhutan", value: "BT" },
  { label: "Bolivia, Plurinational State of", value: "BO" },
  { label: "Bonaire, Sint Eustatius and Saba", value: "BQ" },
  { label: "Bosnia and Herzegovina", value: "BA" },
  { label: "Botswana", value: "BW" },
  { label: "Bouvet Island", value: "BV" },
  { label: "Brazil", value: "BR" },
  { label: "British Indian Ocean Territory", value: "IO" },
  { label: "Brunei Darussalam", value: "BN" },
  { label: "Bulgaria", value: "BG" },
  { label: "Burkina Faso", value: "BF" },
  { label: "Burundi", value: "BI" },
  { label: "Cambodia", value: "KH" },
  { label: "Cameroon", value: "CM" },
  { label: "Canada", value: "CA" },
  { label: "Cape Verde", value: "CV" },
  { label: "Cayman Islands", value: "KY" },
  { label: "Central African Republic", value: "CF" },
  { label: "Chad", value: "TD" },
  { label: "Chile", value: "CL" },
  { label: "China", value: "CN" },
  { label: "Christmas Island", value: "CX" },
  { label: "Cocos (Keeling) Islands", value: "CC" },
  { label: "Colombia", value: "CO" },
  { label: "Comoros", value: "KM" },
  { label: "Congo", value: "CG" },
  { label: "Congo, the Democratic Republic of the", value: "CD" },
  { label: "Cook Islands", value: "CK" },
  { label: "Costa Rica", value: "CR" },
  { label: "Côte d'Ivoire", value: "CI" },
  { label: "Croatia", value: "HR" },
  { label: "Cuba", value: "CU" },
  { label: "Curaçao", value: "CW" },
  { label: "Cyprus", value: "CY" },
  { label: "Czech Republic", value: "CZ" },
  { label: "Denmark", value: "DK" },
  { label: "Djibouti", value: "DJ" },
  { label: "Dominica", value: "DM" },
  { label: "Dominican Republic", value: "DO" },
  { label: "Ecuador", value: "EC" },
  { label: "Egypt", value: "EG" },
  { label: "El Salvador", value: "SV" },
  { label: "Equatorial Guinea", value: "GQ" },
  { label: "Eritrea", value: "ER" },
  { label: "Estonia", value: "EE" },
  { label: "Ethiopia", value: "ET" },
  { label: "Falkland Islands (Malvinas)", value: "FK" },
  { label: "Faroe Islands", value: "FO" },
  { label: "Fiji", value: "FJ" },
  { label: "Finland", value: "FI" },
  { label: "France", value: "FR" },
  { label: "French Guiana", value: "GF" },
  { label: "French Polynesia", value: "PF" },
  { label: "French Southern Territories", value: "TF" },
  { label: "Gabon", value: "GA" },
  { label: "Gambia", value: "GM" },
  { label: "Georgia", value: "GE" },
  { label: "Germany", value: "DE" },
  { label: "Ghana", value: "GH" },
  { label: "Gibraltar", value: "GI" },
  { label: "Greece", value: "GR" },
  { label: "Greenland", value: "GL" },
  { label: "Grenada", value: "GD" },
  { label: "Guadeloupe", value: "GP" },
  { label: "Guam", value: "GU" },
  { label: "Guatemala", value: "GT" },
  { label: "Guernsey", value: "GG" },
  { label: "Guinea", value: "GN" },
  { label: "Guinea-Bissau", value: "GW" },
  { label: "Guyana", value: "GY" },
  { label: "Haiti", value: "HT" },
  { label: "Heard Island and McDonald Islands", value: "HM" },
  { label: "Holy See (Vatican City State)", value: "VA" },
  { label: "Honduras", value: "HN" },
  { label: "Hong Kong", value: "HK" },
  { label: "Hungary", value: "HU" },
  { label: "Iceland", value: "IS" },
  { label: "India", value: "IN" },
  { label: "Indonesia", value: "ID" },
  { label: "Iran, Islamic Republic of", value: "IR" },
  { label: "Iraq", value: "IQ" },
  { label: "Ireland", value: "IE" },
  { label: "Isle of Man", value: "IM" },
  { label: "Israel", value: "IL" },
  { label: "Italy", value: "IT" },
  { label: "Jamaica", value: "JM" },
  { label: "Japan", value: "JP" },
  { label: "Jersey", value: "JE" },
  { label: "Jordan", value: "JO" },
  { label: "Kazakhstan", value: "KZ" },
  { label: "Kenya", value: "KE" },
  { label: "Kiribati", value: "KI" },
  { label: "Korea, Democratic People's Republic of", value: "KP" },
  { label: "Korea, Republic of", value: "KR" },
  { label: "Kuwait", value: "KW" },
  { label: "Kyrgyzstan", value: "KG" },
  { label: "Lao People's Democratic Republic", value: "LA" },
  { label: "Latvia", value: "LV" },
  { label: "Lebanon", value: "LB" },
  { label: "Lesotho", value: "LS" },
  { label: "Liberia", value: "LR" },
  { label: "Libya", value: "LY" },
  { label: "Liechtenstein", value: "LI" },
  { label: "Lithuania", value: "LT" },
  { label: "Luxembourg", value: "LU" },
  { label: "Macao", value: "MO" },
  { label: "Macedonia, the Former Yugoslav Republic of", value: "MK" },
  { label: "Madagascar", value: "MG" },
  { label: "Malawi", value: "MW" },
  { label: "Malaysia", value: "MY" },
  { label: "Maldives", value: "MV" },
  { label: "Mali", value: "ML" },
  { label: "Malta", value: "MT" },
  { label: "Marshall Islands", value: "MH" },
  { label: "Martinique", value: "MQ" },
  { label: "Mauritania", value: "MR" },
  { label: "Mauritius", value: "MU" },
  { label: "Mayotte", value: "YT" },
  { label: "Mexico", value: "MX" },
  { label: "Micronesia, Federated States of", value: "FM" },
  { label: "Moldova, Republic of", value: "MD" },
  { label: "Monaco", value: "MC" },
  { label: "Mongolia", value: "MN" },
  { label: "Montenegro", value: "ME" },
  { label: "Montserrat", value: "MS" },
  { label: "Morocco", value: "MA" },
  { label: "Mozambique", value: "MZ" },
  { label: "Myanmar", value: "MM" },
  { label: "Namibia", value: "NA" },
  { label: "Nauru", value: "NR" },
  { label: "Nepal", value: "NP" },
  { label: "Netherlands", value: "NL" },
  { label: "New Caledonia", value: "NC" },
  { label: "New Zealand", value: "NZ" },
  { label: "Nicaragua", value: "NI" },
  { label: "Niger", value: "NE" },
  { label: "Nigeria", value: "NG" },
  { label: "Niue", value: "NU" },
  { label: "Norfolk Island", value: "NF" },
  { label: "Northern Mariana Islands", value: "MP" },
  { label: "Norway", value: "NO" },
  { label: "Oman", value: "OM" },
  { label: "Pakistan", value: "PK" },
  { label: "Palau", value: "PW" },
  { label: "Palestine, State of", value: "PS" },
  { label: "Panama", value: "PA" },
  { label: "Papua New Guinea", value: "PG" },
  { label: "Paraguay", value: "PY" },
  { label: "Peru", value: "PE" },
  { label: "Philippines", value: "PH" },
  { label: "Pitcairn", value: "PN" },
  { label: "Poland", value: "PL" },
  { label: "Portugal", value: "PT" },
  { label: "Puerto Rico", value: "PR" },
  { label: "Qatar", value: "QA" },
  { label: "Réunion", value: "RE" },
  { label: "Romania", value: "RO" },
  { label: "Russian Federation", value: "RU" },
  { label: "Rwanda", value: "RW" },
  { label: "Saint Barthélemy", value: "BL" },
  { label: "Saint Helena, Ascension and Tristan da Cunha", value: "SH" },
  { label: "Saint Kitts and Nevis", value: "KN" },
  { label: "Saint Lucia", value: "LC" },
  { label: "Saint Martin (French part)", value: "MF" },
  { label: "Saint Pierre and Miquelon", value: "PM" },
  { label: "Saint Vincent and the Grenadines", value: "VC" },
  { label: "Samoa", value: "WS" },
  { label: "San Marino", value: "SM" },
  { label: "Sao Tome and Principe", value: "ST" },
  { label: "Saudi Arabia", value: "SA" },
  { label: "Senegal", value: "SN" },
  { label: "Serbia", value: "RS" },
  { label: "Seychelles", value: "SC" },
  { label: "Sierra Leone", value: "SL" },
  { label: "Singapore", value: "SG" },
  { label: "Sint Maarten (Dutch part)", value: "SX" },
  { label: "Slovakia", value: "SK" },
  { label: "Slovenia", value: "SI" },
  { label: "Solomon Islands", value: "SB" },
  { label: "Somalia", value: "SO" },
  { label: "South Africa", value: "ZA" },
  { label: "South Georgia and the South Sandwich Islands", value: "GS" },
  { label: "South Sudan", value: "SS" },
  { label: "Spain", value: "ES" },
  { label: "Sri Lanka", value: "LK" },
  { label: "Sudan", value: "SD" },
  { label: "Suriname", value: "SR" },
  { label: "Svalbard and Jan Mayen", value: "SJ" },
  { label: "Swaziland", value: "SZ" },
  { label: "Sweden", value: "SE" },
  { label: "Switzerland", value: "CH" },
  { label: "Syrian Arab Republic", value: "SY" },
  { label: "Taiwan, Province of China", value: "TW" },
  { label: "Tajikistan", value: "TJ" },
  { label: "Tanzania, United Republic of", value: "TZ" },
  { label: "Thailand", value: "TH" },
  { label: "Timor-Leste", value: "TL" },
  { label: "Togo", value: "TG" },
  { label: "Tokelau", value: "TK" },
  { label: "Tonga", value: "TO" },
  { label: "Trinidad and Tobago", value: "TT" },
  { label: "Tunisia", value: "TN" },
  { label: "Turkey", value: "TR" },
  { label: "Turkmenistan", value: "TM" },
  { label: "Turks and Caicos Islands", value: "TC" },
  { label: "Tuvalu", value: "TV" },
  { label: "Uganda", value: "UG" },
  { label: "Ukraine", value: "UA" },
  { label: "United Arab Emirates", value: "AE" },
  { label: "United Kingdom", value: "GB" },
  { label: "United States", value: "US" },
  { label: "United States Minor Outlying Islands", value: "UM" },
  { label: "Uruguay", value: "UY" },
  { label: "Uzbekistan", value: "UZ" },
  { label: "Vanuatu", value: "VU" },
  { label: "Venezuela, Bolivarian Republic of", value: "VE" },
  { label: "Viet Nam", value: "VN" },
  { label: "Virgin Islands, British", value: "VG" },
  { label: "Virgin Islands, U.S.", value: "VI" },
  { label: "Wallis and Futuna", value: "WF" },
  { label: "Western Sahara", value: "EH" },
  { label: "Yemen", value: "YE" },
  { label: "Zambia", value: "ZM" },
  { label: "Zimbabwe", value: "ZW" },
];
