import axiosInstance from "@/common/axios-interceptor";
import { IAddReport, IDashboardPayload, IReportMail } from "./report.model";
import { PaginationPayload } from "../abstract-review/abstract.model";

export const DashboardDetails = async (payload: IDashboardPayload) => {
  try {
    const { from_date, to_date } = payload;
    const apiUrl = `analytics/dashboard?from_date=${from_date}&to_date=${to_date}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const addReport = async (payload: IAddReport) => {
  try {
    const apiUrl = `report/generate`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const sendReportEmail = async (payload: IReportMail) => {
  try {
    const apiUrl = `report/send-email`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getReport = async (id: string) => {
  try {
    const apiUrl = `report/get_signed_url/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getReportAll = async (payload: PaginationPayload) => {
  try {
    const { perPage, pageNumber  } = payload
    const apiUrl = `report/list?page=${pageNumber}&per_page=${perPage}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getReportCountAll = async () => {
  try {
    const apiUrl = `report/list?count=true`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};
