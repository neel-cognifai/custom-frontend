import axiosInstance from "@/common/axios-interceptor";
import { PaginationPayload } from "../../abstract-review/abstract.model";
import { IAddTenant, IEditTeam, TeamData, TeamPayload } from "./team.model";
import { ICreateRole } from "../User/user.model";


export const getByIdTeamData = async (id: string) => {
  try {
    const response = await axiosInstance.get(
      `team/get_by_id/${id}`
    );
    return response;
  } catch (error: unknown) {
    console.log("error")
    throw error;
  }
};

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
    const apiUrl = `user/list?count=true`
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

const config = {
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
};

export const addTeamData = async (payload: IAddTenant) => {
  try {
    const apiUrl = `team/create`
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const TeamUserCreate =  async (payload: TeamData[]) => {
  try {
    const apiUrl = `team_user/create`
    const payloadData = payload[0]
    const response = await axiosInstance.post(apiUrl, payloadData);
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const teamUserUpdate =  async (payload: TeamData[]) => {
  try {
    const apiUrl = `team_user/update`
    const payloadData = payload[0]
    const response = await axiosInstance.put(apiUrl, payloadData);
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

export const getTeamMemberCount = async () => {
  try {
    const apiUrl = `user/list?count=true`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getTeamDetails = async (payload: PaginationPayload) => {
  try {
    const {pageNumber, perPage} = payload;
    const apiUrl = `team/list?page=${pageNumber}&per_page=${perPage}&count=false`
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const getTeamCount = async () => {
  try {
    const apiUrl = `team/list?&count=true`
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

export const teamStatusDeactivate = async (payload: TeamPayload) => {
  try {    
    const apiUrl = '/team/deactivate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const teamStatusActivate = async (payload: TeamPayload) => {
  try {
    const apiUrl = '/team/activate'
    const response = await axiosInstance.put(apiUrl, payload);
    return response.data;
  } catch (error: any) {
    return error.response;
  }
};

export const editTeamData = async (payload: IEditTeam) => {
  try {
    const apiUrl = '/team/update'
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};