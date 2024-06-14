import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAxiosError } from "@/common/helper/common.modal";
import { AppState } from "@/redux/store";
import { Utils } from "../../../utils/utils";
import {
  IItem,
  IThirdPageAdvanceData,
  ReviewQcSendMailPayload,
} from "./advance.model";
import {
  advanceReviewCancelledDataAPI,
  advanceReviewCancelledTotalCountAPI,
  advanceReviewCompletedDataAPI,
  advanceReviewCompletedTotalCountAPI,
  advanceReviewInProgressDataAPI,
  advanceReviewInProgressTotalCountAPI,
  advanceReviewMonitorAbstractReviewPendingTotalRecordAPI,
  advanceReviewMonitorDataAPI as advanceReviewMonitorDataAPI,
  advanceReviewMonitorDetails,
  advanceReviewMonitorInValidICSRTotalRecordAPI,
  advanceReviewMonitorReview,
  advanceReviewMonitorValidICSRTotalRecordAPI,
  assignToAPI,
  getAdvanceMonitorDetailsCountsDetails,
  sentEmailInReviewQc,
} from "./advance-review.api";
import {
  CountData,
  IAssignPayload,
  IMonitorDetails,
  PaginationPayload,
  payloadMonitorID,
} from "../abstract-review/abstract.model";
import { IFormValues } from "../abstract-review/abstract-review-3";

const initialState = {
  advanceReviewInProgressData: [],
  advanceReviewCompletedData: [],
  advanceReviewCancelledData: [],
  status: "idle",
  advanceReviewMonitor: [],
  advanceReviewDetail: <IThirdPageAdvanceData>(<unknown>[]),
  advanceMonitorDetailsCountsDetails: <CountData | null>{},
  reviewStatus: "idle",
  errorMessage: <string | undefined>"Error occured",
  TotalInProgressCount: Number,
  TotalCompletedCount: Number,
  TotalCancelledCount: Number,
  AdvanceReviewMonitorValidICSRTotalRecord: Number,
  AdvanceReviewMonitorInValidICSRTotalRecord: Number,
  AdvanceReviewMonitorAbstractReviewPendingTotalRecord: Number
};

export const AdvancedReviewInProgressTotalCountAsync = createAsyncThunk(
  "AdvancedReviewInProgressCount",
  async () => {
    try {
      const response = await advanceReviewInProgressTotalCountAPI();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvancedReviewCompletedTotalCountAsync = createAsyncThunk(
  "AdvancedReviewCompletedCount",
  async () => {
    try {
      const response = await advanceReviewCompletedTotalCountAPI();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvancedReviewCancelledTotalCountAsync = createAsyncThunk(
  "AdvancedReviewCancelledCount",
  async () => {
    try {
      const response = await advanceReviewCancelledTotalCountAPI();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvancedReviewInProgressDataAsync = createAsyncThunk(
  "AdvancedReviewInProgress",
  async (payload: PaginationPayload) => {
    try {
        const response = await advanceReviewInProgressDataAPI(payload);
        return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvancedReviewCompletedDataAsync = createAsyncThunk(
  "AdvancedReviewCompleted",
  async (payload: PaginationPayload) => {
    try {
        const response = await advanceReviewCompletedDataAPI(payload);
        return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AdvancedReviewCancelledDataAsync = createAsyncThunk(
  "AdvancedReviewCancelled",
  async (payload: PaginationPayload) => {
    try {
        const response = await advanceReviewCancelledDataAPI(payload);
        return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvanceReviewMonitorIdAsync = createAsyncThunk(
  "advanceReview/monitor_id",
  async (payload: PaginationPayload) => {
    try {
      const response = await advanceReviewMonitorDataAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvanceReviewMonitorValidICSRTotalRecordIdAsync = createAsyncThunk(
  "advanceReview/monitor_id/ValidICSRTotalRecord",
  async (id: string) => {
    try {
      const response = await advanceReviewMonitorValidICSRTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync = createAsyncThunk(
  "advanceReview/monitor_id/InVaildICSRTotalRecord",
  async (id: string) => {
    try {
      const response = await advanceReviewMonitorInValidICSRTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvanceReviewMonitorAbstractReviewPendingTotalRecordIdAsync = createAsyncThunk(
  "advanceReview/monitor_id/AbstractReviewPendingTotalRecord",
  async (id: string) => {
    try {
      const response = await advanceReviewMonitorAbstractReviewPendingTotalRecordAPI(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvanceReviewMonitorDetailAsync = createAsyncThunk(
  "abstractReview/monitor_id/pmid",
  async (id: string) => {
    try {
      const response = await advanceReviewMonitorDetails(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);
export const AdvanceReviewMonitorReviewAsync = createAsyncThunk(
  "abstractReview/monitor_id/pmid/review",
  async (payload: IFormValues) => {
    try {
      const response = await advanceReviewMonitorReview(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

export const AdvanceMonitorDetailsCountsAsync = createAsyncThunk(
  "AbstractMonitorDetailsCounts/monitor_id/",
  async (id: string) => {
    try {
      const response = await getAdvanceMonitorDetailsCountsDetails(id);
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

export const ReviewQcSendMailAsync = createAsyncThunk(
  "ReviewQcSendMail",
  async (payload: ReviewQcSendMailPayload) => {
    try {
      const response = await sentEmailInReviewQc(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      throw err;
    }
  }
);

const advancedReviewDataSlice = createSlice({
  name: "advanceReviewDataSlice",
  initialState,
  reducers: {
    advanceData: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(AdvancedReviewInProgressTotalCountAsync.pending, (state) => {
      state.status = "pending";
    })
    .addCase(AdvancedReviewInProgressTotalCountAsync.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.TotalInProgressCount = action.payload;
    })
    .addCase(AdvancedReviewInProgressTotalCountAsync.rejected, (state, action) => {
      state.status = "rejected";
    })
    .addCase(AdvancedReviewCompletedTotalCountAsync.pending, (state) => {
      state.status = "pending";
    })
    .addCase(AdvancedReviewCompletedTotalCountAsync.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.TotalCompletedCount = action.payload;
    })
    .addCase(AdvancedReviewCompletedTotalCountAsync.rejected, (state, action) => {
      state.status = "rejected";
    })
    .addCase(AdvancedReviewCancelledTotalCountAsync.pending, (state) => {
      state.status = "pending";
    })
    .addCase(AdvancedReviewCancelledTotalCountAsync.fulfilled, (state, action) => {
      state.status = "fulfilled";
      state.TotalCancelledCount = action.payload;
    })
    .addCase(AdvancedReviewCancelledTotalCountAsync.rejected, (state, action) => {
      state.status = "rejected";
    })
    .addCase(AdvancedReviewInProgressDataAsync.pending, (state) => {
      state.status = "pending";
    })
    .addCase(AdvancedReviewInProgressDataAsync.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.status = "rejected";
      } else {
        state.status = "fulfilled";
        state.advanceReviewInProgressData = action.payload;
      }
    })
    .addCase(AdvancedReviewInProgressDataAsync.rejected, (state, action) => {
      state.status = "rejected";
    })
    .addCase(AdvancedReviewCompletedDataAsync.pending, (state) => {
      state.status = "pending";
    })
    .addCase(AdvancedReviewCompletedDataAsync.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.status = "rejected";
      } else {
        state.status = "fulfilled";
        state.advanceReviewCompletedData = action.payload;
      }
    })
    .addCase(AdvancedReviewCompletedDataAsync.rejected, (state, action) => {
      state.status = "rejected";
    })
    .addCase(AdvancedReviewCancelledDataAsync.pending, (state) => {
      state.status = "pending";
    })
    .addCase(AdvancedReviewCancelledDataAsync.fulfilled, (state, action) => {
      if (action.payload.error) {
        state.status = "rejected";
      } else {
        state.status = "fulfilled";
        state.advanceReviewCancelledData = action.payload;
      }
    })
    .addCase(AdvancedReviewCancelledDataAsync.rejected, (state, action) => {
      state.status = "rejected";
    })
      .addCase(AdvanceReviewMonitorIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AdvanceReviewMonitorIdAsync.fulfilled, (state, action) => {
        (state.status = "fulfilled"),
          (state.advanceReviewMonitor = action.payload);
      })
      .addCase(AdvanceReviewMonitorIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AdvanceReviewMonitorValidICSRTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AdvanceReviewMonitorValidICSRTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled",
        state.AdvanceReviewMonitorValidICSRTotalRecord = action.payload;
      })
      .addCase(AdvanceReviewMonitorValidICSRTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled",
        state.AdvanceReviewMonitorInValidICSRTotalRecord = action.payload;
      })
      .addCase(AdvanceReviewMonitorInVaildICSRTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AdvanceReviewMonitorAbstractReviewPendingTotalRecordIdAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AdvanceReviewMonitorAbstractReviewPendingTotalRecordIdAsync.fulfilled, (state, action) => {
        state.status = "fulfilled",
        state.AdvanceReviewMonitorAbstractReviewPendingTotalRecord = action.payload;
      })
      .addCase(AdvanceReviewMonitorAbstractReviewPendingTotalRecordIdAsync.rejected, (state, action) => {
        state.errorMessage = action?.error?.message;
        state.status = "rejected";
      })
      .addCase(AdvanceReviewMonitorDetailAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AdvanceReviewMonitorDetailAsync.fulfilled, (state, action) => {
        (state.status = "fulfilled"),
          (state.advanceReviewDetail = action.payload);
      })
      .addCase(AdvanceReviewMonitorDetailAsync.rejected, (state, action) => {
        state.reviewStatus = "rejected";
      })
      .addCase(AdvanceReviewMonitorReviewAsync.pending, (state) => {
        state.reviewStatus = "pending";
      })
      .addCase(AdvanceReviewMonitorReviewAsync.fulfilled, (state, action) => {
        state.reviewStatus = "fulfilled";
      })
      .addCase(AdvanceReviewMonitorReviewAsync.rejected, (state, action) => {
        state.reviewStatus = "rejected";
      })
      .addCase(AdvanceMonitorDetailsCountsAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(AdvanceMonitorDetailsCountsAsync.fulfilled, (state, action) => {
        state.reviewStatus = "fulfilled";
        state.advanceMonitorDetailsCountsDetails = action.payload;
      })
      .addCase(AdvanceMonitorDetailsCountsAsync.rejected, (state, action) => {
        state.status = "rejected";
        state.advanceMonitorDetailsCountsDetails = null;
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
      .addCase(ReviewQcSendMailAsync.pending, (state) => {
        state.status = "pending";
      })
      .addCase(ReviewQcSendMailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
      })
      .addCase(ReviewQcSendMailAsync.rejected, (state, action) => {
        state.status = "rejected";
      });
  },
});

export default advancedReviewDataSlice.reducer;
export const AdvanceReviewDataState = (state: AppState) => state.advanceData;
export const authAction = advancedReviewDataSlice.actions;
