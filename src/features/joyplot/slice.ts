import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { JoyplotState } from "@src/app/types";

export const initialState: JoyplotState = {
  byParty: true,
  search: "",
};

const joyplotSlice = createSlice({
  name: "joyplot",
  initialState,
  reducers: {
    setByParty(state, action: PayloadAction<boolean>) {
      state.byParty = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.search = action.payload;
    },
  },
});

export const {
  setByParty,
  setSearch,
} = joyplotSlice.actions;

export default joyplotSlice.reducer;
