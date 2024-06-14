import axiosInstance from "@/common/axios-interceptor";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { IAddUserData, ICreateRole, UserPayload } from "./user.model";
import { TenantPayload } from "../Tenant/tenant.model";



export const getUserCount = async () => {
  try {
    const apiUrl = `/user/list?count=true`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllUser = async () => {
  try {
    const apiUrl = `user/list?count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getRoleData = async () => {
  try {
    const apiUrl = `/role/list?count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getRoleByIdData = async (id:string) => {
  try {
    const apiUrl = `user_role/list?user_id=${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getTenantByIdData = async (id:string) => {
  try {
    const apiUrl = `tenant_user/list?user_id=${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const addUserData = async (payload: IAddUserData) => {
  try {
    const apiUrl = `user/register`
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getTeamMemberDetails = async (payload: PaginationPayload) => {
  try {
    const {pageNumber, perPage} = payload
    const apiUrl = `user/list?page=${pageNumber}&per_page=${perPage}&count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getTeamUserDetails = async () => {
  try {
    const apiUrl = `team_user/list`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getTeamMemberCount = async () => {
  try {
    const apiUrl = `user/list?count=true`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getTeamDetails = async () => {
  try {
    const apiUrl = `team/list?count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const createRole = async (payload: ICreateRole) => {
  try {
    const apiUrl = '/user_role/create'
    const response = await axiosInstance.post(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getUserID = async (id: string) => {
  try {
    const apiUrl = `/user/get_by_id/${id}`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const userStatusDeactivate = async (payload: UserPayload) => {
  try {    
    const apiUrl = '/user/deactivate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const userStatusActivate = async (payload: UserPayload) => {
  try {
    const apiUrl = '/user/activate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};