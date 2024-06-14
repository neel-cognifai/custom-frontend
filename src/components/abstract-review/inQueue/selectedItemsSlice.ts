import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
//import { abstractReviewAPI } from "./abstract.api";
import { IAxiosError } from "@/common/helper/common.modal";
import { Utils } from "../../../../utils/utils";
import { AppState } from "@/redux/store";
import { IInQueue, IInQueueData, MonitorData } from "../abstract.model";
import { IReviewData } from "../listing";

const initialState: IInQueueData = {
    inQueue: [],
    status: 'idle',
};

export const AbstractReviewAsync = createAsyncThunk(
    "abstractReview",
    async (payload: MonitorData) => {
      try {
      const response = payload;//await abstractReviewAPI(payload);
        return response;
      } catch (err: unknown) {
        const errorMessage = err as IAxiosError;
        const errMsg = Utils.handleError(errorMessage.response.data.message);
        throw err;
      }
    }
  );

const selectedItemsSlice = createSlice({
  name: "selectedItemsSlice",
  initialState,
  reducers: {
    setSelectedItems: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(AbstractReviewAsync.pending, (state) => {
        state.status = "pending"
      })
      .addCase(AbstractReviewAsync.fulfilled , (state, action) => {
        state.status = "fulfilled"
        state.inQueue = action.payload as unknown as MonitorData[]
      })
      .addCase(AbstractReviewAsync.rejected, (state, action) => {
        state.status = "rejected"
      })
  },
});

export default selectedItemsSlice.reducer;
export const AbstractReviewState = (state: AppState) => state.selectedItems;
export const authAction = selectedItemsSlice.actions;
