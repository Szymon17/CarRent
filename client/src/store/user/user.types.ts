import { fullOrderData, orderData } from "../order/order.types";
import { product } from "../products/products.types";

type userOrder = { data: orderData; car: product };
type fullUserOrder = { data: fullOrderData; car: product };

type userSnapshot = {
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  orders: userOrder[];
};

type userUpdate = {
  email: string;
  newEmail?: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
};

type userPutResponse = {
  status: string;
  nextUpdateTime: number;
};

type userData = {
  email: string;
  name: string;
  surname: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

type userPayload = {
  user: userSnapshot;
  expire: string;
};

interface userCall extends userPayload {
  status: string;
}

type userInitialStateTypes = {
  user: userSnapshot | null;
  expireTime: string | null;
  nextUpdateTime: number;
  userStatus: "idle" | "loading" | "failed";
  ordersStatus: "idle" | "loading" | "failed";
  shouldFetchOrders: boolean;
};

export type { userSnapshot, userCall, userInitialStateTypes, userPayload, userData, userUpdate, userPutResponse, userOrder, fullUserOrder };
