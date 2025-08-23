import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { paymentState, paymentsInintialState } from "./payments.types";
import { getPayments } from "./payments.actions";

const initialState: paymentsInintialState = {
  payments: [],
  status: "idle",
};

const paymentsSlice = createSlice({
  name: "locations-slice",
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getPayments.pending, state => {
        state.status = "loading";
      })
      .addCase(getPayments.fulfilled, (state, action: PayloadAction<paymentState[] | undefined>) => {
        const { payload } = action;

        if (payload) {
          state.payments = payload;
          state.status = "idle";
        } else state.status = "failed";
      });
  },
});

export default paymentsSlice.reducer;
