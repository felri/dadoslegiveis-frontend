import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from "../../app/store";
import { Range } from "@src/app/types";

export const initialState: Range = {
  startDate: new Date(2022, 0, 1),
  endDate: new Date(2022, 11, 31),
};

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {
    getCalendarSuccess(state, action: PayloadAction<Range>) {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
    },
  },
});

export const { getCalendarSuccess } = calendarSlice.actions;

export default calendarSlice.reducer;

export const setDates =
  ({ startDate, endDate }: Range): AppThunk =>
  (dispatch) => {
    dispatch(getCalendarSuccess({ startDate, endDate }));
  }
