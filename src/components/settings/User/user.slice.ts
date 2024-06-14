import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppState } from "@/redux/store";
import { IAxiosError } from "@/common/helper/common.modal";
import Toast from "@/common/Toast";
import {
  IAddUserData,
  ICreateRole,
  IUserList,
  User,
  UserPayload,
} from "./user.model";
import {
  addUserData,
  createRole,
  getAllUser,
  getRoleByIdData,
  getRoleData,
  getTeamMemberDetails,
  getTeamUserDetails,
  getTenantByIdData,
  getUserCount,
  getUserID,
  userStatusActivate,
  userStatusDeactivate,
} from "./user.api";
import { PaginationPayload } from "@/components/abstract-review/abstract.model";
import { Utils } from "../../../../utils/utils";

const initialState: User = {
  loading: "idle",
  UserMember: [],
  teamData: [],
  roleData: [],
  TotalUser: 0,
  getUser: <IUserList>{},
  percentage_load: 0,
  user_id: "",
  teamUser: [],
  getRoleByIdDetails: [],
  getTenantByID: []
};

export const addUserAsync = createAsyncThunk(
  "add/userData",
  async (payload: IAddUserData) => {
    try {
      const response = await addUserData(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getTeamMemberAsync = createAsyncThunk(
  "get/TeamMemberData",
  async (payload: PaginationPayload) => {
    try {
      const response = await getTeamMemberDetails(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getTeamUserAsync = createAsyncThunk(
  "TeamUserData",
  async () => {
    try {
      const response = await getTeamUserDetails();
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getRoleAsync = createAsyncThunk("get/RoleData", async () => {
  try {
    const response = await getRoleData();
    return response;
  } catch (err: any) {
    console.error(err);
    return err;
  }
});

export const getRoleByIdAsync = createAsyncThunk(
  "getRoleByID",
  async (id: string) => {
    try {
      const response = await getRoleByIdData(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const getTenantByIdAsync = createAsyncThunk(
  "getTenantByID",
  async (id: string) => {
    try {
      const response = await getTenantByIdData(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const createRoleAsync = createAsyncThunk(
  "create/Role",
  async (payload: ICreateRole) => {
    try {
      const response = await createRole(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const getUserCountAsync = createAsyncThunk("getUserCount", async () => {
  try {
    const response = await getUserCount();
    return response;
  } catch (err: any) {
    console.error(err);
    return err;
  }
});

export const AllUserListAsync = createAsyncThunk("AllUserList", async () => {
  try {
    const response = await getAllUser();
    return response;
  } catch (err: unknown) {
    const errorMessage = err as IAxiosError;
    throw errorMessage;
  }
});

export const GetUserByIDAsync = createAsyncThunk(
  "GetUserByID",
  async (id: string) => {
    try {
      const response = await getUserID(id);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const UserStatusDeactivateAsync = createAsyncThunk(
  "StatusDeactivate",
  async (payload: UserPayload) => {
    try {
      const response = await userStatusDeactivate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

export const UserStatusActivateAsync = createAsyncThunk(
  "StatusActivate",
  async (payload: UserPayload) => {
    try {
      const response = await userStatusActivate(payload);
      return response;
    } catch (err: any) {
      console.error(err);
      return err;
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    tenant: (state) => {
      return state;
    },
    handelGetUser: (state) => {
      state.getUser.email = "";
      state.getUser.name = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addUserAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(addUserAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(addUserAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTeamMemberAsync.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(getTeamMemberAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.UserMember = action.payload;
      })
      .addCase(getTeamMemberAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getRoleAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getRoleAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.roleData = action.payload;
      })
      .addCase(getRoleAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(createRoleAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(createRoleAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(createRoleAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(AllUserListAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(AllUserListAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.UserMember = action.payload;
      })
      .addCase(AllUserListAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getUserCountAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getUserCountAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.TotalUser = action.payload;
      })
      .addCase(getUserCountAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(GetUserByIDAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(GetUserByIDAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getUser = action.payload;
      })
      .addCase(GetUserByIDAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(UserStatusActivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(UserStatusActivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(UserStatusActivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(UserStatusDeactivateAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(UserStatusDeactivateAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(UserStatusDeactivateAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTeamUserAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getTeamUserAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.teamUser = action.payload
      })
      .addCase(getTeamUserAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getRoleByIdAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getRoleByIdAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getRoleByIdDetails = action.payload
      })
      .addCase(getRoleByIdAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(getTenantByIdAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(getTenantByIdAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.getTenantByID = action.payload
      })
      .addCase(getTenantByIdAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export default userSlice.reducer;
export const userState = (state: AppState) => state.user;
export const productMonitorAction = userSlice.actions;
