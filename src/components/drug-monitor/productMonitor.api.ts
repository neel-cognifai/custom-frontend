import {
  AuditLogPayload,
  IExtendMonitorPayload,
  IFileUpload,
  ISendCitationEmail,
  ISendEmail,
} from "./productMonitor.model";
import axiosInstance from "@/common/axios-interceptor";
import { monitorApi } from "@/common/apiUrl";
import { getProductMonitorPayload } from "../abstract-review/abstract.model";
import { IMonitorPayload } from "../journal-search/journalSearch.model";

export const getMonitorData = async (payload: getProductMonitorPayload) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `monitor/list?expert_review_type=Abstract&page=${pageNumber}&per_page=${perPage}&count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const FileUpload = async (payload: IFileUpload) => {
  try {
    const { file_type, formData } = payload;
    const encodedFormatType = encodeURIComponent(file_type);
    let apiUrl;
    delete payload.formData;
    if (payload.article_id) {
      const urlParams = new URLSearchParams(
        Object.entries(payload).filter(([_, value]) => value !== undefined)
      )
        .toString()
        .replace(/\+/g, "%20");

      apiUrl = "monitor/upload_file?" + urlParams;
    } else {
      apiUrl = `monitor/upload_file?file_type=${encodedFormatType}`;
    }

    const response = await axiosInstance.post(apiUrl, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const ExtendMonitor = async (payload: IExtendMonitorPayload) => {
  try {
    const apiUrl = `monitor/extend_monitor`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getMonitorTotalData = async () => {
  try {
    const apiUrl = "monitor/list?expert_review_type=Abstract&count=true";
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const addDrugMonitor = async (payload: IMonitorPayload) => {
  const apiUrl = `/monitor/create`;
  try {
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const deleteMonitorData = async (id: Number) => {
  try {
    const response = await axiosInstance.delete(
      `/delete_monitor/?monitor_id=${id}`
    );
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const monitorListFileUpload = async (payload: any) => {
  const monitor = payload;
  let apiUrl = `${monitorApi.list}?monitor_id=${monitor.monitorId}&serach_data=${payload.selectedFormatType}`;
  try {
    const formData = new FormData();
    if (payload.selectedFile) {
      formData.append("file_name", payload.selectedFile);
    }
    const response = await axiosInstance.post(apiUrl, formData);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const editMonitorList = async (payload: string | number | boolean) => {
  let editApiUrl = monitorApi.edit;
  editApiUrl += `?monitor_id=${encodeURIComponent(payload)}`;
  try {
    const response = await axiosInstance.get(editApiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};
export const getTeamList = async () => {
  let editApiUrl = "team/list?count=false";
  try {
    const response = await axiosInstance.get(editApiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getDownloadItemData = async (id: string, status: string) => {
  try {
    const apiUrl = `review/abstract/search?count=false&col=monitor_status&value=${status}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAuditLogItemData = async (payload: AuditLogPayload) => {
  try {
    const { id, status, pageNumber, perPage } = payload;
    const apiUrl = `review/abstract/search?page=${pageNumber}&per_page=${perPage}&&count=false&col=monitor_status&value=${status}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAuditLogItemCountData = async (id: string, status: string) => {
  try {
    const apiUrl = `review/abstract/search?count=true&col=monitor_status&value=${status}&monitor_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const sendMonitorEmail = async (payload: ISendEmail) => {
  let editApiUrl = "monitor/send-mail";
  try {
    const response = await axiosInstance.post(editApiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const sendCitationEmail = async (payload: ISendCitationEmail) => {
  let editApiUrl = "monitor/citation_search/send_email";
  try {
    const response = await axiosInstance.post(editApiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};