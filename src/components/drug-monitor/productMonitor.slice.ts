import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import {
  AuditLogPayload,
  IDownload,
  IExtendMonitorPayload,
  IFileUpload,
  ISendCitationEmail,
  ISendEmail,
} from "./productMonitor.model";
import {
  addDrugMonitor,
  getMonitorData,
  monitorListFileUpload,
  editMonitorList,
  deleteMonitorData,
  getTeamList,
  getMonitorTotalData,
  FileUpload,
  ExtendMonitor,
  getDownloadItemData,
  getAuditLogItemCountData,
  getAuditLogItemData,
  sendMonitorEmail,
  sendCitationEmail,
} from "./productMonitor.api";
import { IAxiosError } from "@/common/helper/common.modal";
import {
  PaginationPayload,
  getProductMonitorPayload,
} from "../abstract-review/abstract.model";
import { IMonitorPayload } from "../journal-search/journalSearch.model";

const initialState = {
  productMonitor: [],
  loading: "idle",
  listUpload: "idle",
  editMonitorStatus: "idle",
  editMonitorDataState: [],
  errorMessage: "",
  teamStatus: "Idle",
  status: "Idle",
  teamState: [],
  TotalMonitor: Number,
  getData: <IDownload[]>[],
  TotalAuditLog: Number,
};

export const getProductMonitorAsync = createAsyncThunk(
  "get/productMonitorData",
  async (payload: getProductMonitorPayload) => {
    try {
      const response = await getMonitorData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const getProductTotalMonitorAsync = createAsyncThunk(
  "get/productMonitorDataTotal",
  async () => {
    try {
      const response = await getMonitorTotalData();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const FileUploadAsync = createAsyncThunk(
  "FileUpload",
  async (payload: IFileUpload) => {
    try {
      const response = await FileUpload(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const ExtendMonitorAsync = createAsyncThunk(
  "ExtendMonitor",
  async (payload: IExtendMonitorPayload) => {
    try {
      const response = await ExtendMonitor(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const addProductMonitorAsync = createAsyncThunk(
  "add/productMonitor",
  async (payload: IMonitorPayload) => {
    try {
      const response = await addDrugMonitor(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const monitorListFileUploadAsync = createAsyncThunk(
  "add/listFileUpload",
  async (payload: any) => {
    try {
      const response = await monitorListFileUpload(payload);

      return response;
    } catch (err: unknown) {
      //const errorMessage = err as IAxiosError;

      throw err;
    }
  }
);

export const deleteProductMonitorAsync = createAsyncThunk(
  "delete/productMonitor",
  async (id: Number) => {
    try {
      const response = await deleteMonitorData(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetItemDownloadDataAsync = createAsyncThunk(
  "GetItemDownloadData",
  async (payload: { id: string; status: string }) => {
    try {
      const response = await getDownloadItemData(payload.id, payload.status);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetAuditLogItemAsync = createAsyncThunk(
  "GetAuditLogData",
  async (payload: AuditLogPayload) => {
    try {
      const response = await getAuditLogItemData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const GetAuditLogItemCountAsync = createAsyncThunk(
  "GetItemDownloadDataCount",
  async (payload: { id: string; status: string }) => {
    try {
      const response = await getAuditLogItemCountData(
        payload.id,
        payload.status
      );
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const editMonitorAsync = createAsyncThunk(
  "add/editMonitor",
  async (payload: any) => {
    try {
      const response = await editMonitorList(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const getTeamAsync = createAsyncThunk("add/getTeam", async () => {
  try {
    const response = await getTeamList();
    return response;
  } catch (err: unknown) {
    const errorMessage = err as IAxiosError;
    throw errorMessage;
  }
});

export const SentMonitorEmailAsync = createAsyncThunk(
  "sentEmail",
  async (payload: ISendEmail) => {
    try {
      const response = await sendMonitorEmail(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const SentCitationEmailAsync = createAsyncThunk(
  "sentCitationEmail",
  async (payload: ISendCitationEmail) => {
    try {
      const response = await sendCitationEmail(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

const productMonitorSlice = createSlice({
  name: "productMonitor",
  initialState,
  reducers: {
    productMonitor: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProductMonitorAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getProductMonitorAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";

        state.productMonitor = action.payload;
      })
      .addCase(getProductMonitorAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(FileUploadAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(FileUploadAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(FileUploadAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getProductTotalMonitorAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getProductTotalMonitorAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.TotalMonitor = action.payload;
      })
      .addCase(getProductTotalMonitorAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(addProductMonitorAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(addProductMonitorAsync.fulfilled, (state, action) => {
        if (action.payload.status == 422) {
          state.loading = "rejected";
          state.errorMessage = action.payload.data;
        }
      })
      .addCase(addProductMonitorAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(deleteProductMonitorAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(deleteProductMonitorAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(deleteProductMonitorAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(monitorListFileUploadAsync.pending, (state, action) => {
        state.listUpload = "pending";
      })
      .addCase(monitorListFileUploadAsync.fulfilled, (state, action) => {
        state.listUpload = "fulfilled";
      })
      .addCase(monitorListFileUploadAsync.rejected, (state, action) => {
        state.listUpload = "rejected";
      })
      .addCase(editMonitorAsync.pending, (state, action) => {
        state.editMonitorStatus = "pending";
      })
      .addCase(editMonitorAsync.fulfilled, (state, action) => {
        state.editMonitorStatus = "fulfilled";

        state.editMonitorDataState = action.payload.data;
      })
      .addCase(editMonitorAsync.rejected, (state, action) => {
        state.editMonitorStatus = "rejected";
      })
      .addCase(getTeamAsync.pending, (state, action) => {
        state.teamStatus = "pending";
      })
      .addCase(getTeamAsync.fulfilled, (state, action) => {
        state.teamStatus = "fulfilled";
        state.teamState = action.payload.data;
      })
      .addCase(getTeamAsync.rejected, (state, action) => {
        state.teamStatus = "rejected";
      })
      .addCase(ExtendMonitorAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(ExtendMonitorAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(ExtendMonitorAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetItemDownloadDataAsync.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(GetItemDownloadDataAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.getData = action.payload;
      })
      .addCase(GetItemDownloadDataAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(GetAuditLogItemAsync.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(GetAuditLogItemAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.getData = action.payload;
      })
      .addCase(GetAuditLogItemAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(GetAuditLogItemCountAsync.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(GetAuditLogItemCountAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.TotalAuditLog = action.payload;
      })
      .addCase(GetAuditLogItemCountAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(SentMonitorEmailAsync.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(SentMonitorEmailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(SentMonitorEmailAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(SentCitationEmailAsync.pending, (state, action) => {
        state.status = "pending";
      })
      .addCase(SentCitationEmailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(SentCitationEmailAsync.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

export default productMonitorSlice.reducer;
export const productMonitorState = (state: AppState) => state.productMonitor;
export const productMonitorAction = productMonitorSlice.actions;
