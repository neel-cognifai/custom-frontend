import authSlice from "@/components/auth/auth.slice";
import selectedItemsReducer from "../components/abstract-review/inQueue/selectedItemsSlice";
import advanceDataReducer from "../components/advanced-review/advance-review.slice"
import selectedItemsDataReducer from "../components/abstract-review/abstract-review.slice"
import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import journalSearchReducer from "@/components/journal-search/journalSearch.slice";
import productMonitorReducer from "@/components/drug-monitor/productMonitor.slice";
import tenantReducer from "@/components/settings/Tenant/tenant.slice"
import generalReducer from "@/components/system-settings/general.slice"
import userReducer from "@/components/settings/User/user.slice"
import teamReducer from "@/components/settings/Team/team.slice"
import reportReducer from "@/components/report/report.slice"
import auditLogReducer from "@/components/audit-log/auditLogDetails/auditLog.slice"
import e2br3Reducer from "@/common/modal/e2br2/e2br3.slice"
import roleReducer from "@/components/settings/Role/role.slice"

const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
      selectedItems: selectedItemsReducer,
      selectedItemData: selectedItemsDataReducer,
      advanceData: advanceDataReducer,
      journalSearch: journalSearchReducer,
      productMonitor: productMonitorReducer,
      tenant: tenantReducer,
      user: userReducer,
      team : teamReducer,
      general: generalReducer,
      report: reportReducer,
      auditLog: auditLogReducer,
      e2br3: e2br3Reducer,
      role: roleReducer
    },
    middleware: getDefaultMiddleware({
      serializableCheck: false,
    }),


  });
};
const store = makeStore();
export default store;

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
