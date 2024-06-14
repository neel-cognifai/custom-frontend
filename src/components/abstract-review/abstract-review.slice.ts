import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAxiosError } from "@/common/helper/common.modal";
import { AppState } from "@/redux/store";
import {
  CountData,
  FileResponse,
  IAbstractDetails,
  IAssignPayload,
  IMonitorDetails,
  IPdfFileDetails,
  PaginationPayload,
  ReviewAbstractSendMailPayload,
  StatusChange,
} from "./abstract.model";
import { Utils } from "../../../utils/utils";
import {
  StatusChangeAPI,
  abstractReviewMonitorDataAPI,
  abstractReviewMoniterThirdPageDetails,
  abstractReviewMonitorReview,
  fullTextAPI,
  getAbstractMonitorDetailsCountsDetails,
  getAbstractMonitorDetails,
  getTeamUserAPI,
  assignToAPI,
  abstractDetailsById,
  PreviewURlAPI,
  AbstractReviewInProgressTotalCountAPI,
  AbstractReviewCompletedTotalCountAPI,
  AbstractReviewCancelledTotalCountAPI,
  abstractReviewInProgressDataAPI,
  abstractReviewCompletedDataAPI,
  abstractReviewCancelledDataAPI,
  abstractReviewMonitorValidICSRTotalRecordAPI,
  abstractReviewMonitorPotentialICSRTotalRecordAPI,
  abstractReviewMonitorInValidICSRTotalRecordAPI,
  abstractReviewMonitorDuplicateTotalRecordAPI,
  sentEmailInReviewAbstract,
  pdfFileDataAPI,
} from "./abstract-review.api";
import { IFormValues } from "./abstract-review-3";
import Toast from "@/common/Toast";
import { FullTextRequiredPayload } from "../drug-monitor/productMonitor.model";

const initialState = {
  abstractReviewInProgressData: [],
  abstractReviewCompletedData: [],
  abstractReviewCancelledData: [],
  status: "idle",
  file: <any>[],
  abstractReviewMontior: [],
  abstractMonitorDetailsCountsDetails: <CountData | null>{},
  abstractReviewDetail: <any>[],
  reviewStatus: "idle",
  errorMessage: <string | undefined>"Error occured",
  previewURL: <FileResponse>(<unknown>{}),
  monitorDetail: <IMonitorDetails>(<unknown>[]),
  teamUsers: [],
  pdfFileDetils: <IPdfFileDetails>(<unknown>{}),
  AbstractDetails: <IAbstractDetails>(<unknown>{}),
  TotalInProgressCount: Number,
  TotalCompletedCount: Number,
  TotalCancelledCount: Number,
  AbstractReviewMonitorValidICSRTotalRecord: Number,
  AbstractReviewMonitorPotentialICSRTotalRecord: Number,
  AbstractReviewMonitorInValidICSRTotalRecord: Number,
  AbstractReviewMonitorDuplicatesTotalRecord: Number
};

export const AbstractReviewInProgressTotalCountAsync = createAsyncThunk(
  "abstractReviewInProgressCount",
  async () => {
    try {
      const response = await AbstractReviewInProgressTotalCountAPI();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AbstractReviewCompletedTotalCountAsync = createAsyncThunk(
  "abstractReviewCompletedCount",
  async () => {
    try {
      const response = await AbstractReviewCompletedTotalCountAPI();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AbstractReviewCancelledTotalCountAsync = createAsyncThunk(
  "abstractReviewCancelledCount",
  async () => {
    try {
      const response = await AbstractReviewCancelledTotalCountAPI();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AbstractReviewInProgressDataAsync = createAsyncThunk(
  "abstractReviewInProgress",
  async (payload: PaginationPayload) => {
    try {
        const response = await abstractReviewInProgressDataAPI(payload);
        return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AbstractReviewCompletedDataAsync = createAsyncThunk(
  "abstractReviewCompleted",
  async (payload: PaginationPayload) => {
    try {
        const response = await abstractReviewCompletedDataAPI(payload);
        return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewCancelledDataAsync = createAsyncThunk(
  "abstractReviewCancelled",
  async (payload: PaginationPayload) => {
    try {
        const response = await abstractReviewCancelledDataAPI(payload);
        return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const FullTextRequiredAsync = createAsyncThunk(
  "fullTextRequired",
  async (payload: FullTextRequiredPayload) => {
    try {
      const response = await fullTextAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewMonitorIdAsync = createAsyncThunk(
  "abstractReview/monitor_id",
  async (payload: PaginationPayload) => {
    try {
      const response = await abstractReviewMonitorDataAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewMonitorValidICSRTotalRecordIdAsync = createAsyncThunk(
  "abstractReview/monitor_id/ValidICSRTotalRecord",
  async (id: string) => {
    try {
      const response = await abstractReviewMonitorValidICSRTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewMonitorPotentialICSRTotalRecordIdAsync = createAsyncThunk(
  "abstractReview/monitor_id/PotentialICSRTotalRecord",
  async (id: string) => {
    try {
      const response = await abstractReviewMonitorPotentialICSRTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewMonitorInValidICSRTotalRecordIdAsync = createAsyncThunk(
  "abstractReview/monitor_id/InValidICSRTotalRecord",
  async (id: string) => {
    try {
      const response = await abstractReviewMonitorInValidICSRTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewMonitorDuplicateTotalRecordIdAsync = createAsyncThunk(
  "abstractReview/monitor_id/DuplicateTotalRecord",
  async (id: string) => {
    try {
      const response = await abstractReviewMonitorDuplicateTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const StatusChangeAsync = createAsyncThunk(
  "statusChange/monitor_id",
  async (payload: StatusChange) => {
    try {
      const response = await StatusChangeAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractMonitorDetailsCountsAsync = createAsyncThunk(
  "AbstractMonitorDetailsCounts/monitor_id/",
  async (id: string) => {
    try {
      const response = await getAbstractMonitorDetailsCountsDetails(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AbstractMonitorDetailsAsync = createAsyncThunk(
  "AbstractMonitorDetails/monitor_id/",
  async (id: string) => {
    try {
      const response = await getAbstractMonitorDetails(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AbstractReviewMonitorDetailAsync = createAsyncThunk(
  "abstractReview/monitor_id/pmid",
  async (id: string) => {
    try {
      const response = await abstractReviewMoniterThirdPageDetails(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AbstractReviewMoniterReviewAsync = createAsyncThunk(
  "abstractReview/monitor_id/pmid/review",
  async (payload: IFormValues) => {
    try {
      const response = await abstractReviewMonitorReview(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const abstractDetailsByIdAsync = createAsyncThunk(
  "get/abstract",
  async (id: string) => {
    try {
      const response = await abstractDetailsById(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const GetTeamUserAsync = createAsyncThunk(
  "get/TeamUser",
  async (id: string) => {
    try {
      const response = await getTeamUserAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AssignToAsync = createAsyncThunk(
  "assignTO",
  async (payload: IAssignPayload) => {
    try {
      const response = await assignToAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const PreviewURlAsync = createAsyncThunk(
  "PreviewURl",
  async (id: string) => {
    try {
      const response = await PreviewURlAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const ReviewAbstractSendMailAsync = createAsyncThunk(
  "ReviewAbstractSendMail",
  async (payload: ReviewAbstractSendMailPayload) => {
    try {
      const response = await sentEmailInReviewAbstract(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const pdfFileDataAPIAsync = createAsyncThunk(
  "pdfFileDataAPI",
  async (id: string) => {
    try {
      const response = await pdfFileDataAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

const abstractReviewDataSlice = createSlice({
  name: "abstractReviewDataSlice",
  initialState,
  reducers: {
    selectedItemData: (state, action) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AbstractReviewInProgressTotalCountAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewInProgressTotalCountAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.TotalInProgressCount = action.payload;
      })
      .addCase(AbstractReviewInProgressTotalCountAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AbstractReviewCompletedTotalCountAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewCompletedTotalCountAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.TotalCompletedCount = action.payload;
      })
      .addCase(AbstractReviewCompletedTotalCountAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AbstractReviewCancelledTotalCountAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewCancelledTotalCountAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.TotalCancelledCount = action.payload;
      })
      .addCase(AbstractReviewCancelledTotalCountAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AbstractReviewInProgressDataAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewInProgressDataAsync.fulfilled, (state, action) => {
        if (action.payload.error) {
          state.status = "rejected";
        } else {
          state.status = "fulfilled";
          state.abstractReviewInProgressData = action.payload;
        }
      })
      .addCase(AbstractReviewInProgressDataAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AbstractReviewCompletedDataAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewCompletedDataAsync.fulfilled, (state, action) => {
        if (action.payload.error) {
          state.status = "rejected";
        } else {
          state.status = "fulfilled";
          state.abstractReviewCompletedData = action.payload;
        }
      })
      .addCase(AbstractReviewCompletedDataAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AbstractReviewCancelledDataAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewCancelledDataAsync.fulfilled, (state, action) => {
        if (action.payload.error) {
          state.status = "rejected";
        } else {
          state.status = "fulfilled";
          state.abstractReviewCancelledData = action.payload;
        }
      })
      .addCase(AbstractReviewCancelledDataAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AbstractReviewMonitorIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewMonitorIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.abstractReviewMontior = action.payload;
      })
      .addCase(AbstractReviewMonitorIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AbstractReviewMonitorValidICSRTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewMonitorValidICSRTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.AbstractReviewMonitorValidICSRTotalRecord = action.payload;
      })
      .addCase(AbstractReviewMonitorValidICSRTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AbstractReviewMonitorPotentialICSRTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewMonitorPotentialICSRTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.AbstractReviewMonitorPotentialICSRTotalRecord = action.payload;
      })
      .addCase(AbstractReviewMonitorPotentialICSRTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AbstractReviewMonitorInValidICSRTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewMonitorInValidICSRTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.AbstractReviewMonitorInValidICSRTotalRecord
        = action.payload;
      })
      .addCase(AbstractReviewMonitorInValidICSRTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AbstractReviewMonitorDuplicateTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewMonitorDuplicateTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.AbstractReviewMonitorDuplicatesTotalRecord = action.payload;
      })
      .addCase(AbstractReviewMonitorDuplicateTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AbstractReviewMonitorDetailAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractReviewMonitorDetailAsync.fulfilled, (state, action) => {
        state.abstractReviewDetail = action.payload;
        state.status = "fulfilled";
      })
      .addCase(AbstractReviewMonitorDetailAsync.rejected, (state, action) => {
        state.reviewStatus = "rejected";
      })
      .addCase(AbstractReviewMoniterReviewAsync.pending, (state) => {
        state.reviewStatus = "pending";
      })
      .addCase(AbstractReviewMoniterReviewAsync.fulfilled, (state, action) => {
        state.reviewStatus = "fulfilled";
      })
      .addCase(AbstractReviewMoniterReviewAsync.rejected, (state, action) => {
        state.reviewStatus = "rejected";
        state.errorMessage = action?.error?.message;
      })
      .addCase(AbstractMonitorDetailsCountsAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractMonitorDetailsCountsAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.abstractMonitorDetailsCountsDetails = action.payload;
      })
      .addCase(AbstractMonitorDetailsCountsAsync.rejected, (state, action) => {
        state.abstractMonitorDetailsCountsDetails = null;
        state.status = "rejected";
      })
      .addCase(AbstractMonitorDetailsAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AbstractMonitorDetailsAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.monitorDetail = action.payload;
      })
      .addCase(AbstractMonitorDetailsAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(FullTextRequiredAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(FullTextRequiredAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.file = action.payload;
      })
      .addCase(FullTextRequiredAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(StatusChangeAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(StatusChangeAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(StatusChangeAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(GetTeamUserAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(GetTeamUserAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.teamUsers = action.payload;
      })
      .addCase(GetTeamUserAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(AssignToAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AssignToAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(AssignToAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(abstractDetailsByIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(abstractDetailsByIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.AbstractDetails = action.payload;
      })
      .addCase(abstractDetailsByIdAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(PreviewURlAsync.pending, (state) => {
        state.reviewStatus = "pending";
      })
      .addCase(PreviewURlAsync.fulfilled, (state, action) => {
        state.reviewStatus = "fulfilled";
        state.previewURL = action.payload;
      })
      .addCase(PreviewURlAsync.rejected, (state, action) => {
        state.reviewStatus = "rejected";
        state.previewURL = { status: 400 } as FileResponse
      })
      .addCase(ReviewAbstractSendMailAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(ReviewAbstractSendMailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(ReviewAbstractSendMailAsync.rejected, (state, action) => {
        state.status = "rejected";
      })
      .addCase(pdfFileDataAPIAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(pdfFileDataAPIAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.pdfFileDetils = action.payload
      })
      .addCase(pdfFileDataAPIAsync.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

export const AbstractReviewDataState = (state: AppState) =>
  state.selectedItemData;
export const { selectedItemData } =
  abstractReviewDataSlice.actions;
export default abstractReviewDataSlice.reducer;
