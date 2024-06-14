import { Tag } from "@/common/tagInput/tagInput";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  IMonitorPayload,
  IPayload,
  SearchResponse,
} from "./journalSearch.model";
import { addDrugMonitor, searchJournal } from "./journalSearch.api";
import { AppState } from "@/redux/store";
import { IAxiosError } from "@/common/helper/common.modal";
import { LocalStorage } from "../../../utils/localstorage";
import { CONSTANTS } from "@/common/constants";

interface ExtendedSearchResponse extends SearchResponse {
  search: string;
  startDate: Date | null;
  endDate: Date | null;
  selectedCheckboxes: Record<string, boolean>;
  includeKeywords: Tag[];
  excludeKeywords: Tag[];
  notKeywords: Tag[];
  synonyms: Tag[];
}

const initialState: ExtendedSearchResponse = {
  results: [],
  loading: "idle",
  error: null,
  search: "",
  startDate: null,
  endDate: null,
  selectedCheckboxes: {},
  includeKeywords: [],
  excludeKeywords: [],
  notKeywords: [],
  synonyms: [],
};

export const searchJournalAsync = createAsyncThunk(
  "search/journalSearch",
  async (payload: IPayload) => {
    const response = await searchJournal(payload);
    return response;
  }
);

export const addProductMonitorAsync = createAsyncThunk(
  "add/productMonitorInJournalSearch",
  async (payload: IMonitorPayload) => {
    try {
      const response = await addDrugMonitor(payload);
      return response;
    } catch (err: unknown) {
      const errorMessage = err as IAxiosError;
      throw errorMessage;
    }
  }
);

const journalSearchSlice = createSlice({
  name: "journalSearch",
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    setSelectedCheckboxes: (state, action) => {
      state.selectedCheckboxes = action.payload;
    },
    setIncludeKeywords: (state, action) => {
      state.includeKeywords = action.payload;
    },
    setExcludeKeywords: (state, action) => {
      state.excludeKeywords = action.payload;
    },
    setSynonyms: (state, action) => {
      state.synonyms = action.payload;
    },
    setNotKeywords: (state, action) => {
      state.notKeywords = action.payload;
    },
    journalSearch: (state) => {
      return state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(searchJournalAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(searchJournalAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
        state.results = action.payload?.data;
        const filterData = JSON.stringify(
          action.payload?.data?.pre_monitor_filter
        );
        const citationSearchCount = JSON.stringify(action.payload?.data?.count);
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.PRE_MONITOR_FILTER,
          filterData
        );
        LocalStorage.setItem(
          CONSTANTS.LOCAL_STORAGE_KEYS.CITATION_COUNT,
          citationSearchCount
        );
      })
      .addCase(searchJournalAsync.rejected, (state, action) => {
        state.loading = "rejected";
      })
      .addCase(addProductMonitorAsync.pending, (state, action) => {
        state.loading = "pending";
      })
      .addCase(addProductMonitorAsync.fulfilled, (state, action) => {
        state.loading = "fulfilled";
      })
      .addCase(addProductMonitorAsync.rejected, (state, action) => {
        state.loading = "rejected";
      });
  },
});

export const journalSearchAction = journalSearchSlice.actions;
export const {
  setSearch,
  setStartDate,
  setEndDate,
  setSelectedCheckboxes,
  setIncludeKeywords,
  setExcludeKeywords,
  setSynonyms,
  setNotKeywords,
} = journalSearchSlice.actions;
export const journalSearchState = (state: AppState) => state.journalSearch;
export default journalSearchSlice.reducer;
