import { createSelector } from "@reduxjs/toolkit";
import { stateType } from "../store";

const selectPaymentsReducer = (state: stateType) => state.payments;

const getPayments = createSelector([selectPaymentsReducer], ({ payments }) => payments);

export { getPayments };
