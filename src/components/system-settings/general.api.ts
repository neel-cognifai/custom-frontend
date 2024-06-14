import axiosInstance from "@/common/axios-interceptor";
import {
  EditCategoryPayload,
  EditClassificationPayload,
  IAddCategoryPayload,
  IAddClassificationPayload,
  IE2BR2DataPayload,
  IUpdateE2BR2DataPayload,
} from "./general.model";
import { PaginationPayload } from "../abstract-review/abstract.model";
import { IAxiosError } from "@/common/helper/common.modal";

export const addCategoryData = async (payload: IAddCategoryPayload) => {
  try {
    const apiUrl = `review_category/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const addClassificationData = async (
  payload: IAddClassificationPayload
) => {
  try {
    const apiUrl = `review_classification/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getE2BR2Data = async (
  id: string
) => {
  try {
    const apiUrl = `xml/static/nodes/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error) {
    const err = error as IAxiosError
    return err.response;
  }
};

export const addE2BR2Data = async (
  payload: IE2BR2DataPayload
) => {
  try {
    const apiUrl = `xml/static/nodes/create`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const updateE2BR2Data = async (
  payload: IUpdateE2BR2DataPayload
) => {
  try {
    const apiUrl = `xml/static/nodes/update`;
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCategoryData = async (payload: PaginationPayload) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `review_category/list?page=${pageNumber}&per_page=${perPage}&count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllCategoryData = async () => {
  try {
    const apiUrl = `review_category/list?count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCategoryCount = async () => {
  try {
    const apiUrl = `review_category/list?count=true`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getCategoryByID = async (id: string) => {
  try {
    const apiUrl = `review_category/get_by_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteCategoryByID = async (id: string) => {
  try {
    const apiUrl = `review_category/delete_by_id/${id}`;
    const response = await axiosInstance.delete(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const editCategoryByID = async (payload: EditCategoryPayload) => {
  try {
    const apiUrl = `review_category/update`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getClassificationData = async (payload: PaginationPayload) => {
  try {
    const { pageNumber, perPage } = payload;
    const apiUrl = `review_classification/list?page=${pageNumber}&per_page=${perPage}&count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getAllClassificationData = async () => {
  try {
    const apiUrl = `review_classification/list?count=false`;
    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const getClassificationCount = async () => {
  try {
    const apiUrl = `review_classification/list?count=true`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const getClassificationByID = async (id: string) => {
  try {
    const apiUrl = `review_classification/get_by_id/${id}`;
    const response = await axiosInstance.get(apiUrl);
    return response.data;
  } catch (error: unknown) {
    throw error;
  }
};

export const deleteClassificationByID = async (id: string) => {
  try {
    const apiUrl = `review_classification/delete_by_id/${id}`;
    const response = await axiosInstance.delete(apiUrl);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};

export const editClassificationByID = async (payload: EditClassificationPayload) => {
  try {
    const apiUrl = `review_classification/update`;
    const response = await axiosInstance.put(apiUrl, payload);
    return response;
  } catch (error: unknown) {
    throw error;
  }
};