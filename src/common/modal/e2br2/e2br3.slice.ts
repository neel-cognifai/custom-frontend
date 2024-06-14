import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { IAxiosError } from "@/common/helper/common.modal";
import { DownloadXML, IData, IE2BR2DataPayload, IGetE2BR2Data, IUpdateE2BR2DataPayload } from "./e2br3.model";
import { FetchDownloadXMLDetail, addE2BR2Data, getE2BR2Data, updateE2BR2Data } from "./e2br3.api";

const initialState: IData = {
  loading: "idle",
  E2BR2Data: <IGetE2BR2Data>{}
};

export const GetE2BR2DataAsync = createAsyncThunk(
  "fetE2BR2Data",
  async (id: string) => {
    try {
      const response = await getE2BR2Data(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const UpdateE2BR2DataAsync = createAsyncThunk(
  "UpdateE2BR2Data",
  async (payload: IUpdateE2BR2DataPayload) => {
    try {
      const response = await updateE2BR2Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const AddE2BR2DataAsync = createAsyncThunk(
  "E2BR2Data",
  async (payload: IE2BR2DataPayload) => {
    try {
      const response = await addE2BR2Data(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const FetchXMLDetailAsync = createAsyncThunk(
  "FetchXMLDetailAsync",
  async (payload: DownloadXML) => {
    try {
      const response = await FetchDownloadXMLDetail(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

const e2br3Slice = createSlice({
  name: "e2br3",
  initialState,
  reducers: {
    e2br3: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(AddE2BR2DataAsync.fulfilled, (state, action) => {
        
        state.loading = "fulfilled";
      })
      .addCase(AddE2BR2DataAsync.rejected, (state, action) => {
        
        state.loading = "rejected";
      })
      .addCase(FetchXMLDetailAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(FetchXMLDetailAsync.fulfilled, (state, action) => {
        
        state.loading = "fulfilled";
      })
      .addCase(FetchXMLDetailAsync.rejected, (state, action) => {
        
        state.loading = "rejected";
      })
      .addCase(GetE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(GetE2BR2DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.E2BR2Data = action.payload.data
      })
      .addCase(GetE2BR2DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(UpdateE2BR2DataAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(UpdateE2BR2DataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(UpdateE2BR2DataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default e2br3Slice.reducer;
export const e2br3State = (state: AppState) => state.e2br3;
export const e2br3SliceAction = e2br3Slice.actions;
