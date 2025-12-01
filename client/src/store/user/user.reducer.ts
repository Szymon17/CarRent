import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { userInitialStateTypes, userOrder } from "./user.types";
import { addUserOrders, logInUser } from "./user.actions";

const initialState: userInitialStateTypes = {
  user: null,
  expireTime: null,
  nextUpdateTime: 0,
  userStatus: "idle",
  ordersStatus: "idle",
  shouldFetchOrders: true,
};

const userSlice = createSlice({
  name: "user-slice",
  initialState: initialState,
  reducers: {
    updateUserState: (state, action: PayloadAction<number>) => {
      const { payload } = action;

      state.nextUpdateTime = payload;
    },

    logOut: state => {
      state.user = null;
      state.expireTime = null;
      state.shouldFetchOrders = true;
    },
  },

  extraReducers: builder => {
    builder
      .addCase(logInUser.pending, state => {
        state.userStatus = "loading";
      })
      .addCase(logInUser.fulfilled, (state, action) => {
        const { payload } = action;

        if (payload) {
          const { user, expire } = payload;

          state.expireTime = expire;
          state.user = user;
          state.userStatus = "idle";
        } else state.userStatus = "failed";
      });
    builder
      .addCase(addUserOrders.pending, state => {
        state.ordersStatus = "loading";
      })
      .addCase(addUserOrders.fulfilled, (state, action) => {
        const { payload } = action;

        if (state.user) {
          if (payload) {
            state.user.orders = [...state.user.orders, ...payload];
          } else state.shouldFetchOrders = false;
        } else state.ordersStatus = "failed";
      });
  },
});

export const { logOut, updateUserState } = userSlice.actions;

export default userSlice.reducer;
