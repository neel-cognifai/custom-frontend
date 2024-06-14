import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { EditRoleData, addRole, getRole, getRoleByID, getRoleCount, roleStatusActivate, roleStatusDeactivate } from "./role.api";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { IAxiosError } from "@/common/helper/common.modal";
import { AddRolePayload, IEditRole, IGetRole, RoleData, RolePayload } from "./role.model";

const initialState: RoleData = {
  role: [],
  loading: "idle",
  getRole: <IGetRole>{},
  TotalRole: 0,
};

export const getRoleCountAsync = createAsyncThunk(
    "getRoleCount",
    async () => {
      try {
        const response = await getRoleCount();
        return response;
      } catch (err: any) {
        console.error(err);
        return err;
      }
    }
  );

  export const getRoleAsync = createAsyncThunk(
    "get/RoleData",
    async (payload: PaginationPayload) => {
      try {
        const response = await getRole(payload);
        return response;
      } catch (err: unknown) {
        const errorMessage = err as IAxiosError;
        throw errorMessage;
      }
    }
  );

  export const RoleStatusDeactivateAsync = createAsyncThunk(
    "StatusDeactivate",
    async (payload: RolePayload) => {
      try {
        const response = await roleStatusDeactivate(payload);
        return response;
      } catch (err: any) {
        console.error(err);
        return err;
      }
    }
  );
  
  export const RoleStatusActivateAsync = createAsyncThunk(
    "StatusActivate",
    async (payload: RolePayload) => {
      try {
        const response = await roleStatusActivate(payload);
        return response;
      } catch (err: any) {
        console.error(err);
        return err;
      }
    }
  );

  export const AddRoleAsync = createAsyncThunk(
    "AddRole",
    async (payload: AddRolePayload) => {
      try {
        const response = await addRole(payload);
        return response;
      } catch (err: any) {
        console.error(err);
        return err;
      }
    }
  );

  export const GetRoleByIDAsync = createAsyncThunk(
    "GetRoleByID",
    async (id: string) => {
      try {
        const response = await getRoleByID(id);
        return response;
      } catch (err: any) {
        console.error(err);
        return err;
      }
    }
  );

  export const EditRoleAsync = createAsyncThunk(
    "edit/RoleData",
    async (payload: IEditRole) => {
      try {
        const response = await EditRoleData(payload);
        return response;
      } catch (err: unknown) {
        const errorMessage = err as IAxiosError;
        throw errorMessage;
      }
    }
  );

const roleSlice = createSlice({
  name: "role",
  initialState,
  reducers: {
    role: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(getRoleCountAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getRoleCountAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.TotalRole = action.payload;
      })
      .addCase(getRoleCountAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getRoleAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getRoleAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.role = action.payload.data;
      })
      .addCase(getRoleAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(RoleStatusDeactivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(RoleStatusDeactivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(RoleStatusDeactivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(RoleStatusActivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(RoleStatusActivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(RoleStatusActivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(AddRoleAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(AddRoleAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(AddRoleAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetRoleByIDAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(GetRoleByIDAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getRole = action.payload;
      })
      .addCase(GetRoleByIDAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(EditRoleAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(EditRoleAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(EditRoleAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
  },
});

export default roleSlice.reducer;
export const roleState = (state: AppState) => state.role;
export const roleAction = roleSlice.actions;
