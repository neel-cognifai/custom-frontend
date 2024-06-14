import { IAuthuser, ILoginPayload, IResetPassword, ISignUpPayload, IUpdatePassword } from "./auth.model";
import { ListUserTeam, SendResetPasswordEmailAPI, TenantUserID, UpdatePassword, getByEmail, resetPassword, signInAPI, signUpAPI, userDetail } from "./auth.api";
import { CONSTANTS, systemMessage } from "@/common/constants";
import Toast from "@/common/Toast";
import { AppState } from "@/redux/store";
import { LocalStorage } from "../../../utils/localstorage";
import { Utils } from "../../../utils/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IAxiosError } from "@/common/helper/common.modal";

const initialState: IAuthuser = {
  status: "idle",
  userStatus: "idle",
  isUserLoggedIn: false,
  userInfo: null as any,
};
export const LoginAsync = createAsyncThunk(
  "Login",
  async (payload: ILoginPayload) => {
    try {
      const response = await signInAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const UpdatePasswordAsync = createAsyncThunk(
  "UpdatePassword",
  async (payload: IUpdatePassword) => {
    try {
      const response = await UpdatePassword(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const resetPasswordAsync = createAsyncThunk(
  "resetPassword",
  async (payload: IResetPassword) => {
    try {
      const response = await resetPassword(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const SendRestPasswordEmailAsync = createAsyncThunk(
  "SendResetPasswordEmail",
  async (email:string) => {
    try {
      const response = await SendResetPasswordEmailAPI(email);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const getByEmailAsync = createAsyncThunk(
  "getByEmail",
  async (email: string) => {
    try {
      const response = await getByEmail(email);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const userDetailAsync = createAsyncThunk(
  "userDetail",
  async (id: string) => {
    try {
      const response = await userDetail(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const TenantUserDetailAsync = createAsyncThunk(
  "tenantUserDetail",
  async (id: string) => {
    try {
      const response = await TenantUserID(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const ListUserTeamAsync = createAsyncThunk(
  "ListUserTeam",
  async (id: string) => {
    try {
      const response = await ListUserTeam(id);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.data.detail);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const signUpAsync = createAsyncThunk(
  "signUp",
  async (payload: ISignUpPayload) => {
    try {
      const response = await signUpAPI(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      const errMsg = Utils.handleError(errorMessage.response.data.message);
      Toast(errMsg, { type: "error" });
      throw err;
    }
  }
);

export const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    auth: (state) => {
      return state;
    },
    updateIsLoggedIn: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
    updateIsLogout: (state, action) => {
      state.isUserLoggedIn = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUpAsync.pending, (state) => {
        state.status = "pending",
        state.userStatus = "loading";
      })
      .addCase(signUpAsync.fulfilled , (state, action) => {
        state.status = "fulfilled",
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.TOKEN,
          action.payload.accessToken
        );
        state.userStatus = "fulfilled";
        Toast(action.payload.message, { type: "success" });
      })
      .addCase(signUpAsync.rejected, (state, action) => {
        state.status = "rejected",
        state.userStatus = "rejected";
      })
      .addCase(LoginAsync.pending, (state) => {
        state.status = "pending";
        state.userStatus = "loading";
      })
      .addCase(LoginAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.TOKEN,
          action.payload.token
        );
        state.userStatus = "fulfilled";
        state.isUserLoggedIn = true;
        Toast(systemMessage.Login_Success, { type: "success" });
      })
      .addCase(LoginAsync.rejected, (state) => {
        state.status = "rejected";
        state.userStatus = "rejected";
      })
      .addCase(getByEmailAsync.pending, (state) => {
        state.status = "pending";
        state.userStatus = "loading";
      })
      .addCase(getByEmailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userStatus = "fulfilled";
      })
      .addCase(getByEmailAsync.rejected, (state) => {
        state.status = "rejected";
        state.userStatus = "rejected";
      })
      .addCase(SendRestPasswordEmailAsync.pending, (state) => {
        state.status = "pending";
        state.userStatus = "loading";
      })
      .addCase(SendRestPasswordEmailAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userStatus = "fulfilled";
      })
      .addCase(SendRestPasswordEmailAsync.rejected, (state) => {
        state.status = "rejected";
        state.userStatus = "rejected";
      })
      .addCase(userDetailAsync.pending, (state) => {
        state.status = "pending",
        state.userStatus = "loading";
      })
      .addCase(userDetailAsync.fulfilled , (state, action) => {
        state.status = "fulfilled";
        const response = action.payload[0]
        const details = {user_name: response.user_name, user_id:response.user_id,access_level: response.access_level, 
          role_name: response.role_name}
        const data = JSON.stringify(details)
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.USERDATA,
          data
        );
        state.userStatus = "fulfilled";
      })
      .addCase(userDetailAsync.rejected, (state, action) => {
        state.status = "rejected",
        state.userStatus = "rejected";
      })
      .addCase(TenantUserDetailAsync.pending, (state) => {
        state.status = "pending",
        state.userStatus = "loading";
      })
      .addCase(TenantUserDetailAsync.fulfilled , (state, action) => {
        state.status = "fulfilled";
        const response = action.payload[0]
        const details = {tenant_id: response.tenant_id, tenant_name: response.tenant_name}
        const data = JSON.stringify(details)
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.TENANT_USER_ID,
          data
        );
        state.userStatus = "fulfilled";
      })
      .addCase(TenantUserDetailAsync.rejected, (state, action) => {
        state.status = "rejected",
        state.userStatus = "rejected";
      })
      .addCase(ListUserTeamAsync.pending, (state) => {
        state.status = "pending",
        state.userStatus = "loading";
      })
      .addCase(ListUserTeamAsync.fulfilled , (state, action) => {
        state.status = "fulfilled";
        const response = action.payload
        const data = JSON.stringify(response)
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.LIST_USER_TEAM,
          data
        );
        state.userStatus = "fulfilled";
      })
      .addCase(ListUserTeamAsync.rejected, (state, action) => {
        state.status = "rejected",
        state.userStatus = "rejected";
      })
      .addCase(UpdatePasswordAsync.pending, (state) => {
        state.status = "pending";
        state.userStatus = "loading";
      })
      .addCase(UpdatePasswordAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userStatus = "fulfilled";
      })
      .addCase(UpdatePasswordAsync.rejected, (state) => {
        state.status = "rejected";
        state.userStatus = "rejected";
      })
      .addCase(resetPasswordAsync.pending, (state) => {
        state.status = "pending";
        state.userStatus = "loading";
      })
      .addCase(resetPasswordAsync.fulfilled, (state, action) => {
        state.status = "fulfilled";
        state.userStatus = "fulfilled";
      })
      .addCase(resetPasswordAsync.rejected, (state) => {
        state.status = "rejected";
        state.userStatus = "rejected";
      })
  },
});

export default authSlice.reducer;
export const authState = (state: AppState) => state.auth;
export const authAction = authSlice.actions;
