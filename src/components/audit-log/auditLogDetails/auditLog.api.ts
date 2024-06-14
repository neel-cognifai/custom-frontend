import axiosInstance from "@/common/axios-interceptor";
import { IAuditLogPayload } from "./auditLog.model";

export const HistoryDetails = async (payload: IAuditLogPayload) => {
    try {
      const {review_type , search_result_id} = payload
      const apiUrl = `audit_log/audit_log?review_type=${review_type}&search_result_id=${search_result_id}`
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error: any) {
      return error.response;
    }
  };

  export const HistoryXmlDetails = async (payload: IAuditLogPayload) => {
    try {
      const { search_result_id} = payload
      const apiUrl = `xml/nodes/audit/log/${search_result_id}`
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error: any) {
      return error.response;
    }
  };