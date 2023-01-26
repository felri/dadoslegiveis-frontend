import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
import { getBarplotData, getListOfExpensesByDeputyData } from "app/api";
import { BarplotState } from "@src/app/types";


export const initialState: BarplotState = {
  data: {
    barplot: null,
    expenses: []
  },
  error: null,
  loading: false,
};

const barplotSlice = createSlice({
  name: "barplot",
  initialState,
  reducers: {
    getListExpensesByDeputySuccess(
      state,
      action: PayloadAction<BarplotState>
    ) {
      state.data.expenses = action.payload;
      state.error = null;
      state.loading = false;
    },
    getBarplotSuccess(
      state,
      action: PayloadAction<BarplotState>
    ) {
      state.data.barplot = action.payload;
      state.error = null;
      state.loading = false;
    },
    barplotError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    barplotLoading(state) {
      state.loading = true;
    },
  },
});

export const {
  getBarplotSuccess,
  barplotError,
  barplotLoading,
  getListExpensesByDeputySuccess,
} = barplotSlice.actions;

export default barplotSlice.reducer;

export const fetchBarplotData =
  (description: string, startDate: string, endDate: string): AppThunk =>
  async (dispatch) => {
    try {
      // const res = await getBarplotData(description, startDate, endDate);
      // dispatch(getBarplotSuccess(res.data));
    } catch (err: any) {
      dispatch(barplotError(err.toString()));
    }
  };

export const fetchListOfExpensesByDeputy =
  (description: string, startDate: string, endDate: string, name: string): AppThunk =>
  async (dispatch) => {
    try {
      // dispatch(barplotLoading());
      // const res = await getListOfExpensesByDeputyData(description, startDate, endDate, name);
      // dispatch(getListExpensesByDeputySuccess(res.data));
    } catch (err: any) {
      dispatch(barplotError(err.toString()));
    }
  };

