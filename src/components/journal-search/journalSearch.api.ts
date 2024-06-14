import { format } from "date-fns";
import { IMonitorPayload, IPayload } from "./journalSearch.model";
import axiosInstance from "@/common/axios-interceptor";
import { CONSTANTS } from "@/common/constants";
import { monitorApi } from "@/common/apiUrl";
import { AxiosError } from 'axios';


export const searchJournal = async (payload: IPayload) => {
  try {
    const queryParam = payload.values.search;
    const startDateString = payload.filters.start_date;
    const endDateString = payload.filters.end_date;
    const page = payload.PageNumber;
    const per_page = payload.perPage

    let apiUrl = `/monitor/citation_search?search_query=${queryParam}&page=${page}&per_page=${per_page}`;

    if (startDateString && endDateString) {
      const startDateObject = new Date(startDateString);
      const formattedStartDate = format(startDateObject, "yyyy-MM-dd");
      const endDateObject = new Date(endDateString);
      const formattedEndDate = format(endDateObject, "yyyy-MM-dd");

      apiUrl += `&start_date=${formattedStartDate}&end_date=${formattedEndDate}`;
    }

    const response = await axiosInstance.get(apiUrl);
    return response;
  } catch (error) {
    console.log({ error: CONSTANTS.errorMessage.unexpectedError });
  }
};

export const addDrugMonitor = async (payload: IMonitorPayload) => {
  const apiUrl = `/monitor/create`;
  try {
    const response = await axiosInstance.post(apiUrl, payload);
    return response;
  } catch (error) {
    const axiosError = error as AxiosError;
    return axiosError.response;
  }
};
