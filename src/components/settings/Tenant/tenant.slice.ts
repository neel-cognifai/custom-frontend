import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { IAxiosError } from "@/common/helper/common.modal";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { EditTenantData, addTenantData, createTenant, getAllTenant, getTenantByID, getTenantCount, getTenantData, tenantStatusActivate, tenantStatusDeactivate } from "./tenant.api";
import { ICreateTenant, IEditTenantDetail, IGetTenant, ITenants, TenantData, TenantPayload } from "./tenant.model";

const initialState: TenantData = {
  tenant: [],
  loading: "idle",
  getTenant: <IGetTenant>{},
  TotalTenant: 0,
};

export const getTenantAsync = createAsyncThunk(
  "get/tenantData",
  async (payload: PaginationPayload) => {
    try {
      const response = await getTenantData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const AllTenantListAsync = createAsyncThunk(
  "AllTenantList",
  async () => {
    try {
      const response = await getAllTenant();
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const addTenantAsync = createAsyncThunk(
  "add/tenantData",
  async (payload: ITenants) => {
    try {
      const response = await addTenantData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const EditTenantAsync = createAsyncThunk(
  "edit/tenantData",
  async (payload: IEditTenantDetail) => {
    try {
      const response = await EditTenantData(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

export const createTenantAsync = createAsyncThunk(
  "create/Tenant",
  async (payload: ICreateTenant) => {
    try {
      const response = await createTenant(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const TenantStatusDeactivateAsync = createAsyncThunk(
  "StatusDeactivate",
  async (payload: TenantPayload) => {
    try {
      const response = await tenantStatusDeactivate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const TenantStatusActivateAsync = createAsyncThunk(
  "StatusActivate",
  async (payload: TenantPayload) => {
    try {
      const response = await tenantStatusActivate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const GetTenantByIDAsync = createAsyncThunk(
  "GetTenantByID",
  async (id: string) => {
    try {
      const response = await getTenantByID(id);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getTenantCountAsync = createAsyncThunk(
  "getTenantCount",
  async () => {
    try {
      const response = await getTenantCount();
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    tenant: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTenantAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addTenantAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(addTenantAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(EditTenantAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(EditTenantAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(EditTenantAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTenantAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getTenantAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tenant = action.payload;
      })
      .addCase(getTenantAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(createTenantAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(createTenantAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createTenantAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(TenantStatusDeactivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(TenantStatusDeactivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(TenantStatusDeactivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(TenantStatusActivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(TenantStatusActivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(TenantStatusActivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetTenantByIDAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(GetTenantByIDAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getTenant = action.payload;
      })
      .addCase(GetTenantByIDAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTenantCountAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getTenantCountAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.TotalTenant = action.payload;
      })
      .addCase(getTenantCountAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(AllTenantListAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(AllTenantListAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.tenant = action.payload;
      })
      .addCase(AllTenantListAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
  },
});

export default tenantSlice.reducer;
export const tenantState = (state: AppState) => state.tenant;
export const productMonitorAction = tenantSlice.actions;
