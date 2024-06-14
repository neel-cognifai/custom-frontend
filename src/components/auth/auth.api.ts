import { CONSTANTS } from "@/common/constants";
import { ILoginPayload, IResetPassword, ISignUpPayload, IUpdatePassword } from "./auth.model";
import axios, { AxiosError } from "axios";
import axiosInstance from "@/common/axios-interceptor";

export const signInAPI = async (payload: ILoginPayload) => {
  try {
    const apiUrl= `auth/login`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response;
  }
};

export const SendResetPasswordEmailAPI = async (email: string) => {
  try {
    const apiUrl= `user/reset-password/${email}`;
    const response = await axiosInstance.put(apiUrl);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response;
  }
};


export const signUpAPI = async (payload: ISignUpPayload) => {
  try {
    return {
      message: "signUp Successful",
      success: true,
      //hardcoded dummy token
      accessToken: CONSTANTS.LOCAL_STORAGE_KEYS.ACCESSTOKEN
    };
  } catch (error) {
    throw error;
  }
};

export const getByEmail = async (email: string) => {
  try {
    const apiUrl= `user/get_by_email/${email}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response;
  }
};

export const userDetail = async (id: string) => {
  try {
    const apiUrl= `user_role/list?user_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response;
  }
};

export const TenantUserID = async (id: string) => {
  try {
    const apiUrl= `tenant_user/list?user_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response;
  }
};

export const UserByTenantID = async (id: string) => {
  try {
    const apiUrl= `tenant_user/list?tenant_id=${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response;
  }
};

export const ListUserTeam = async (id: string) => {
  try {
    const apiUrl= `team_user/list_user_teams/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    throw axiosError.response;
  }
};

export const UpdatePassword = async (payload: IUpdatePassword) => {
  try {
    const apiUrl= `user/update`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response;
  }
};

export const resetPassword = async (payload: IResetPassword) => {
  try {
    const apiUrl= `user/reset/password`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response;
  }
};