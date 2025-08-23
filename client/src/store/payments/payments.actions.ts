import { createAsyncThunk } from "@reduxjs/toolkit";
import { getPaymentMethodsFetch } from "../../utils/fetchFunctions";

const getPayments = createAsyncThunk("getPayments", async () => {
  const payments = await getPaymentMethodsFetch();

  return payments;
});

export { getPayments };
