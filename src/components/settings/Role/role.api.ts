import axiosInstance from "@/common/axios-interceptor";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { AddRolePayload, IEditRole, RolePayload } from "./role.model";

export const getRoleCount = async () => {
  try {
    const apiUrl = `role/list?count=true`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getRole = async (payload: PaginationPayload) => {
    try {
      const { pageNumber, perPage } = payload
      const apiUrl = `role/list?page=${pageNumber}&per_page=${perPage}&count=false`
      const response = await axiosInstance.get(apiUrl);
      return response;
    } catch (error: unknown) {
      throw error;
    }
};

export const addRole = async (payload: AddRolePayload) => {
    try {
      const apiUrl = `role/create`
      const response = await axiosInstance.post(apiUrl, payload);
      return response;
    } catch (error: unknown) {
      throw error;
    }
};

export const getRoleByID = async (id: string) => {
    try {
      const apiUrl = `/role/get_by_id/${id}`
      const response = await axiosInstance.get(apiUrl);
      return response.data;
    } catch (error: any) {
      return error.response;
    }
  };

  export const EditRoleData = async (payload: IEditRole) => {
    try {
      const apiUrl = `role/update`
      const response = await axiosInstance.put(apiUrl, payload);
      return response;
    } catch (error: any) {
      return error.response;
    }
  };

export const roleStatusDeactivate = async (payload: RolePayload) => {
    try {    
      const apiUrl = '/role/deactivate'
      const response = await axiosInstance.put(apiUrl, payload);
      return response.data;
    } catch (error: any) {
      return error.response;
    }
  };
  
  export const roleStatusActivate = async (payload: RolePayload) => {
    try {
      const apiUrl = '/role/activate'
      const response = await axiosInstance.put(apiUrl, payload);
      return response.data;
    } catch (error: any) {
      return error.response;
    }
  };