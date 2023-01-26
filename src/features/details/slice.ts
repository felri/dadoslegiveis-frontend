import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk, RootState } from "../../app/store";
// import { getDetailsData } from "app/api";

export interface DetailsState {
  data: any | null;
  error: string | null;
  loading: boolean;
}

export const initialState: DetailsState = {
  data: null,
  error: null,
  loading: false,
};

const detailsSlice = createSlice({
  name: "details",
  initialState,
  reducers: {
    getDetailsSuccess(
      state,
      action: PayloadAction<DetailsState>
    ) {
      state.data = action.payload;
      state.error = null;
      state.loading = false;
    },
    detailsError(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
    },
    detailsLoading(state) {
      state.loading = true;
      state.data = null;
    },
  },
});

export const {
  getDetailsSuccess,
  detailsError,
  detailsLoading,
} = detailsSlice.actions;

export default detailsSlice.reducer;

export const fetchDetails =
  (date: string, name: string, byParty: boolean): AppThunk =>
  async (dispatch) => {
    try {
      // const res = await getDetailsData(date, name, byParty);
      // dispatch(getDetailsSuccess(res.data));
    } catch (err: any) {
      dispatch(detailsError(err.toString()));
    }
  };
