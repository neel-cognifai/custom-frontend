import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { IAddReport, IDashboardData, IDashboardPayload, IGetReportAll, IGetReportSignedUrl, IReportMail, IReportResponse } from "./report.model";
import { DashboardDetails, addReport, getReport, getReportAll, getReportCountAll, sendReportEmail } from "./report.api";
import { PaginationPayload } from "../abstract-review/abstract.model";

const initialState = {
  loading: "idle",
  DashboardData : <IDashboardData>{},
  Report: <IReportResponse>{},
  GetReport: <IGetReportSignedUrl>{},
  status: "idle",
  GetAllReport: [],
  TotalReport: Number
};

export const DashboardDataAsync = createAsyncThunk(
  "add/userData",
  async (payload: IDashboardPayload) => {
    try {
      const response = await DashboardDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const addReportAsync = createAsyncThunk(
  "add/Report",
  async (payload: IAddReport) => {
    try {
      const response = await addReport(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getReportAsync = createAsyncThunk(
  "get/Report",
  async (id: string) => {
    try {
      const response = await getReport(id);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const SendEmailAsync = createAsyncThunk(
  "sendEmail",
  async (payload: IReportMail) => {
    try {
      const response = await sendReportEmail(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const GetAllReportAsync = createAsyncThunk(
  "getAllReport",
  async (payload: PaginationPayload) => {
    try {
      const response = await getReportAll(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const GetAllCountReportAsync = createAsyncThunk(
  "getAllCountReport",
  async () => {
    try {
      const response = await getReportCountAll();
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);





const ReportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    report: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(DashboardDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(DashboardDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.DashboardData = action.payload;
      })
      .addCase(DashboardDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(addReportAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(addReportAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.Report = action.payload;
      })
      .addCase(addReportAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(getReportAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(getReportAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.GetReport = action.payload;
      })
      .addCase(getReportAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(SendEmailAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(SendEmailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(SendEmailAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(GetAllReportAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(GetAllReportAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.GetAllReport = action.payload;
      })
      .addCase(GetAllReportAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(GetAllCountReportAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(GetAllCountReportAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.TotalReport = action.payload;
      })
      .addCase(GetAllCountReportAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
  },
});

export default ReportSlice.reducer;
export const reportState = (state: AppState) => state.report;
export const productMonitorAction = ReportSlice.actions;
