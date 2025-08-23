import { createSelector } from "@reduxjs/toolkit";
import { stateType } from "../store";

const selectOrderReducer = (state: stateType) => state.order;

const selectOrder = createSelector([selectOrderReducer], order => order);
const selectOrderDays = createSelector([selectOrderReducer], order => order.dayQuantity);

export { selectOrder, selectOrderDays };
