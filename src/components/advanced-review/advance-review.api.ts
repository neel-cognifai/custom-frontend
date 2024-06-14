import axiosInstance from "@/common/axios-interceptor";
import { IAssignPayload, PaginationPayload, payloadMonitorID } from "../abstract-review/abstract.model";
import { IFormValues } from "../abstract-review/abstract-review-3";
import Toast from "@/common/Toast";
import { IAxiosError } from "@/common/helper/common.modal";
import { CONSTANTS } from "@/common/constants";
import { ReviewQcSendMailPayload } from "./advance.model";

export const advanceReviewInProgressTotalCountAPI = async () => {
  try {
    const apiUrl = `monitor/search?expert_review_type=QC&count=true&col=status&value=${CONSTANTS.MONITOR_STATUS_IN_PROGRESS}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewCompletedTotalCountAPI = async () => {
  try {
    const apiUrl = `monitor/search?expert_review_type=QC&count=true&col=status&value=${CONSTANTS.MONITOR_STATUS_COMPLETED}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewCancelledTotalCountAPI = async () => {
  try {
    const apiUrl = `monitor/search?expert_review_type=QC&count=true&col=status&value=${CONSTANTS.MONITOR_STATUS_CANCELLED}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewInProgressDataAPI = async (payload: PaginationPayload) => {
  try {
    const {pageNumber, perPage} = payload;
    const apiUrl = `monitor/search?expert_review_type=QC&page=${pageNumber}&per_page=${perPage}&count=false&col=status&value=${CONSTANTS.MONITOR_STATUS_IN_PROGRESS}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewCompletedDataAPI = async (payload: PaginationPayload) => {
  try {
    const {pageNumber, perPage} = payload;
    const apiUrl = `monitor/search?expert_review_type=QC&page=${pageNumber}&per_page=${perPage}&count=false&col=status&value=${CONSTANTS.MONITOR_STATUS_COMPLETED}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const advanceReviewCancelledDataAPI = async (payload: PaginationPayload) => {
  try {
    const {pageNumber, perPage} = payload;
    const apiUrl = `monitor/search?expert_review_type=QC&page=${pageNumber}&per_page=${perPage}&count=false&col=status&value=${CONSTANTS.MONITOR_STATUS_CANCELLED}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewMonitorDataAPI = async (payload: PaginationPayload) => {
  try {
    const {monitor_id, pageNumber, perPage, label} = payload;
    const apiUrl = `review/qc/search?page=${pageNumber}&per_page=${perPage}&count=false&col=abstract_review_decision&value=${label}&monitor_id=${monitor_id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewMonitorValidICSRTotalRecordAPI = async (id: string) => {
  try {
    const apiUrl = `review/qc/search?count=true&col=abstract_review_decision&value=${CONSTANTS.EXPERT_REVIEW_DECISION_VALID_ICSR}&monitor_id=${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewMonitorInValidICSRTotalRecordAPI = async (id: string) => {
  try {
    const apiUrl = `review/qc/search?count=true&col=abstract_review_decision&value=${CONSTANTS.EXPERT_REVIEW_DECISION_INVALID_ICSR}&monitor_id=${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewMonitorAbstractReviewPendingTotalRecordAPI = async (id: string) => {
  try {
    const apiUrl = `review/qc/search?count=true&col=abstract_review_decision&value=${CONSTANTS.EXPERT_REVIEW_DECISION_PENDING}&monitor_id=${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};


export const getAdvanceMonitorDetailsCountsDetails = async (
  id: string
) => {
  try {
    const apiUrl = `monitor/decision_analytics?review_type=QC&monitor_id=${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data; 
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewMonitorDetails = async (id:string) => {
  try {
    const apiUrl = `review/qc/get_by_id/${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const advanceReviewMonitorReview = async (payload: IFormValues) => {
  try {
    const apiUrl = `review/qc/submit`
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const assignToAPI = async (payload: IAssignPayload) => {
  try {
    const apiUrl = `review/qc/assign`
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: unknown) {
    Toast((error as IAxiosError)?.response.data.message, {type : "error"})
    throw error;
  }
};

export const sentEmailInReviewQc = async (payload: ReviewQcSendMailPayload) => {
  try {
    const apiUrl = `review/qc/send-mail`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response
  }
};
