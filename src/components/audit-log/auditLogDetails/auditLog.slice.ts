import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { HistoryDetails, HistoryXmlDetails } from "./auditLog.api";
import { HistoryResult, IAuditLogPayload, XmlData } from "./auditLog.model";

const initialState = {
  loading: "idle",
  HistoryData: <HistoryResult[]>[],
  HistoryXmlData: <XmlData>{}
};

export const HistoryDataAsync = createAsyncThunk(
  "get/HistoryDetails",
  async (payload: IAuditLogPayload) => {
    try {
      const response = await HistoryDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const HistoryXmlDataAsync = createAsyncThunk(
  "get/HistoryXmlDetails",
  async (payload: IAuditLogPayload) => {
    try {
      const response = await HistoryXmlDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

const AuditLogSlice = createSlice({
  name: "auditLog",
  initialState,
  reducers: {
    auditLog: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HistoryDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(HistoryDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.HistoryData = action.payload;
      })
      .addCase(HistoryDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(HistoryXmlDataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(HistoryXmlDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.HistoryXmlData = action.payload;
      })
      .addCase(HistoryXmlDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
  },
});

export default AuditLogSlice.reducer;
export const AuditLogState = (state: AppState) => state.auditLog;
export const AuditLogAction = AuditLogSlice.actions;
