import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./user/user.reducer";
import productsReducer from "./products/products.reducer";
import orderReducer from "./order/order.reducer";
import locationsReducer from "./locations/locations.reducer";
import appReducer from "./app/app.reducer";
import paymentsReducer from "./payments/payments.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  products: productsReducer,
  order: orderReducer,
  locations: locationsReducer,
  payments: paymentsReducer,
  app: appReducer,
});

export default rootReducer;
