import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import {
  IAddTenant,
  IEditTeam,
  ITeam,
  TeamData,
  TeamPayload,
} from "./team.model";
import {
  TeamUserCreate,
  addTeamData,
  editTeamData,
  getByIdTeamData,
  getTeamCount,
  getTeamDetails,
  teamStatusActivate,
  teamStatusDeactivate,
  teamUserUpdate,
} from "./team.api";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { UserByTenantID } from "@/components/auth/auth.api";

const initialState: ITeam = {
  loading: "idle",
  teamData: [],
  teamDataById: {},
  teamTotal: 0,
  getTenantByID: [],
};

export const addTeamAsync = createAsyncThunk(
  "add/TeamData",
  async (payload: IAddTenant) => {
    try {
      const response = await addTeamData(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const TeamUserCreateAsync = createAsyncThunk(
  "create/TeamUserCreate",
  async (payload: TeamData[]) => {
    try {
      const response = await TeamUserCreate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const TeamUserUpdateAsync = createAsyncThunk(
  "update/TeamUserUpdate",
  async (payload: TeamData[]) => {
    try {
      const response = await teamUserUpdate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getByIdTeamAsync = createAsyncThunk(
  "getById/TeamData",
  async (id: string) => {
    try {
      const response = await getByIdTeamData(id);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getTeamAsync = createAsyncThunk(
  "get/TeamData",
  async (payload: PaginationPayload) => {
    try {
      const response = await getTeamDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getTeamCountAsync = createAsyncThunk("get/TeamCount", async () => {
  try {
    const response = await getTeamCount();
    return response;
  } catch (err: any) {
    console.error(err);
    return err;
  }
});

export const TeamStatusDeactivateAsync = createAsyncThunk(
  "StatusDeactivate",
  async (payload: TeamPayload) => {
    try {
      const response = await teamStatusDeactivate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const TeamStatusActivateAsync = createAsyncThunk(
  "StatusActivate",
  async (payload: TeamPayload) => {
    try {
      const response = await teamStatusActivate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const UserDetailByTenantIDAsync = createAsyncThunk(
  "UserDetailByTenantID",
  async (id: string) => {
    try {
      const response = await UserByTenantID(id);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const EditTeamDataAsync = createAsyncThunk(
  "EditTeamData",
  async (payload: IEditTeam) => {
    try {
      const response = await editTeamData(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    team: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(TeamUserCreateAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(TeamUserCreateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(TeamUserCreateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(addTeamAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addTeamAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(addTeamAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTeamAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getTeamAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.teamData = action.payload;
      })
      .addCase(getTeamAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getByIdTeamAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getByIdTeamAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.teamDataById = action.payload.data;
      })
      .addCase(getByIdTeamAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTeamCountAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getTeamCountAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.teamTotal = action.payload;
      })
      .addCase(getTeamCountAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(TeamStatusDeactivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(TeamStatusDeactivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(TeamStatusDeactivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(TeamStatusActivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(TeamStatusActivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(TeamStatusActivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(UserDetailByTenantIDAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(UserDetailByTenantIDAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getTenantByID = action.payload;
      })
      .addCase(UserDetailByTenantIDAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(EditTeamDataAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(EditTeamDataAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(EditTeamDataAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(TeamUserUpdateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(TeamUserUpdateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(TeamUserUpdateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default teamSlice.reducer;
export const teamState = (state: AppState) => state.team;
export const productMonitorAction = teamSlice.actions;
