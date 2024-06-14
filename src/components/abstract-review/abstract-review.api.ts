import Toast from "@/common/Toast";
import { IFormValues } from "./abstract-review-3";
import {
  IAssignPayload,
  PaginationPayload,
  ReviewAbstractSendMailPayload,
  StatusChange,
  TotalCountPayload,
} from "./abstract.model";
import axiosInstance from "@/common/axios-interceptor";
import { IAxiosError } from "@/common/helper/common.modal";
import { FullTextRequiredPayload } from "../drug-monitor/productMonitor.model";
import { CONSTANTS } from "@/common/constants";

export const AbstractReviewInProgressTotalCountAPI = async () => {
  try {
    const apiUrl = `monitor/search?expert_review_type=Abstract&count=true&col=status&value=${CONSTANTS.MONITOR_STATUS_IN_PROGRESS}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const AbstractReviewCompletedTotalCountAPI = async () => {
  try {
    const apiUrl = `monitor/search?expert_review_type=Abstract&count=true&col=status&value=${CONSTANTS.MONITOR_STATUS_COMPLETED}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const AbstractReviewCancelledTotalCountAPI = async () => {
  try {
    const apiUrl = `monitor/search?expert_review_type=Abstract&count=true&col=status&value=${CONSTANTS.MONITOR_STATUS_CANCELLED}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const abstractReviewInProgressDataAPI = async (
  payload: PaginationPayload
) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `monitor/search?expert_review_type=Abstract&page=${pageNumber}&per_page=${perPage}&count=false&col=status&value=${CONSTANTS.MONITOR_STATUS_IN_PROGRESS}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const abstractReviewCompletedDataAPI = async (
  payload: PaginationPayload
) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `monitor/search?expert_review_type=Abstract&page=${pageNumber}&per_page=${perPage}&count=false&col=status&value=${CONSTANTS.MONITOR_STATUS_COMPLETED}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const abstractReviewCancelledDataAPI = async (
  payload: PaginationPayload
) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `monitor/search?expert_review_type=Abstract&page=${pageNumber}&per_page=${perPage}&count=false&col=status&value=${CONSTANTS.MONITOR_STATUS_CANCELLED}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const StatusChangeAPI = async (payload: StatusChange) => {
  try {
    const apiUrl = `monitor/update_status`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const abstractReviewMonitorDataAPI = async (
  payload: PaginationPayload
) => {
  try {
    const { monitor_id, pageNumber, perPage, label } = payload;
    const apiUrl =
      label === CONSTANTS.SEARCH_RESULT_STATUS_DUPLICATE
        ? `review/abstract/search?page=${pageNumber}&per_page=${perPage}&count=false&col=search_result_status&value=${CONSTANTS.SEARCH_RESULT_STATUS_DUPLICATE}&monitor_id=${monitor_id}`
        : `review/abstract/search?page=${pageNumber}&per_page=${perPage}&count=false&col=ai_decision&value=${label}&monitor_id=${monitor_id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const abstractReviewMonitorValidICSRTotalRecordAPI = async (
  id: string
) => {
  try {
    const apiUrl = `review/abstract/search?count=true&col=ai_decision&value=${CONSTANTS.EXPERT_REVIEW_DECISION_VALID_ICSR}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const abstractReviewMonitorPotentialICSRTotalRecordAPI = async (
  id: string
) => {
  try {
    const apiUrl = `review/abstract/search?count=true&col=ai_decision&value=${CONSTANTS.EXPERT_REVIEW_DECISION_POTENTIAL_ICSR}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const abstractReviewMonitorInValidICSRTotalRecordAPI = async (
  id: string
) => {
  try {
    const apiUrl = `review/abstract/search?count=true&col=ai_decision&value=${CONSTANTS.EXPERT_REVIEW_DECISION_INVALID_ICSR}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const abstractReviewMonitorDuplicateTotalRecordAPI = async (
  id: string
) => {
  try {
    const apiUrl = `review/abstract/search?count=true&col=search_result_status&value=${CONSTANTS.SEARCH_RESULT_STATUS_DUPLICATE}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const fullTextAPI = async (payload: FullTextRequiredPayload) => {
  try {
    const formData = new FormData();
    if (payload.file) {
      formData.append("data_file", payload.file);
    }
    const URL = payload?.password?.length
      ? `article/upload_full_text_file?search_result_id${payload.id}&password=${payload.password}`
      : `article/upload_full_text_file?search_result_id=${payload.id}`;
    const response = await axiosInstance.post(URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error: unknown) {
    throw error;
  }
};
export const abstractReviewMoniterThirdPageDetails = async (id: string) => {
  try {
    const apiUrl = `review/abstract/get_by_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAbstractMonitorDetailsCountsDetails = async (id: string) => {
  try {
    const apiUrl = `monitor/decision_analytics?review_type=Abstract&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAbstractMonitorDetails = async (id: string) => {
  try {
    const apiUrl = `monitor/get_by_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const abstractReviewMonitorReview = async (payload: IFormValues) => {
  try {
    const apiUrl = `review/abstract/submit`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error) {
    Toast((error as IAxiosError)?.response.data.message, { type: "error" });
    throw error;
  }
};
export const abstractDetailsById = async (id: string) => {
  try {
    const apiUrl = `article/get_by_search_result_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error) {
    Toast((error as IAxiosError)?.response.data.message, { type: "error" });
    throw error;
  }
};
export const getTeamUserAPI = async (id: string) => {
  try {
    const apiUrl = `team_user/list?team_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const assignToAPI = async (payload: IAssignPayload) => {
  try {
    const apiUrl = `review/abstract/assign`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: unknown) {
    Toast((error as IAxiosError)?.response.data.message, { type: "error" });
    throw error;
  }
};

export const PreviewURlAPI = async (id: string) => {
  try {
    const apiUrl = `article/get_full_text_file/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response
  }
};

export const pdfFileDataAPI = async (id: string) => {
  try {
    const apiUrl = `article/get_full_text_file/reports/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response
  }
};

export const sentEmailInReviewAbstract = async (payload: ReviewAbstractSendMailPayload) => {
  try {
    const apiUrl = `review/abstract/send-mail`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response
  }
};
