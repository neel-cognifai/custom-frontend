import axiosInstance from "@/common/axios-interceptor";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { ICreateTenant, IEditTenantDetail, IEditTenants, ITenants, TenantPayload } from "./tenant.model";

export const addTenantData = async (payload: ITenants) => {
  try {
    const apiUrl = `tenant/create`
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const EditTenantData = async (payload: IEditTenantDetail) => {
  try {
    const apiUrl = `tenant/update`
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getTenantCount = async () => {
  try {
    const apiUrl = `/tenant/list?count=true`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getTenantData = async (payload: PaginationPayload) => {
  try {
    const {pageNumber, perPage} = payload;
    const apiUrl = `/tenant/list?page=${pageNumber}&per_page=${perPage}&count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllTenant = async () => {
  try {
    const apiUrl = `/tenant/list?count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};
export const createTenant = async (payload: ICreateTenant) => {
  try {
    const apiUrl = '/tenant_user/create'
    const response = await axiosInstance.post(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getTenantByID = async (id: string) => {
  try {
    const apiUrl = `/tenant/get_by_id/${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const tenantStatusDeactivate = async (payload: TenantPayload) => {
  try {    
    const apiUrl = '/tenant/deactivate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const tenantStatusActivate = async (payload: TenantPayload) => {
  try {
    const apiUrl = '/tenant/activate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};