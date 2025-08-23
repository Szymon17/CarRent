import { Request } from "express";

type userOrder = {
  carIndex: number;
  id: string;
};

type userSnapshot = {
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
  orders: userOrder[];
  user_id: number;
};

type logInWithToken = {
  email: string;
  password: string;
};

type CustomRequest<T> = Request<unknown, unknown, T, unknown>;

interface UserRequest extends Request {
  user: userSnapshot;
}

type userData = {
  password: string;
  email: string;
  name: string;
  surname: string;
  phonenumber: string;
};

interface user extends userData {
  createdAt: Date;
  orders: string[];
}

type update = { newEmail?: string; name?: string; surname?: string; phonenumber?: number };

type RequestWithQuery<Q> = Request<unknown, unknown, unknown, Q>;

type aditionalfilters = {
  number_of_seats?: string;
  fuel_type?: string;
  drive_type?: string;
  brand?: string;
  type?: string;
};

type queryBasicData = aditionalfilters & {
  rd?: string;
  rtd?: string;
  pul?: string;
  rl?: string;
  index?: string;
  price_from?: string;
  price_to?: string;
  count?: string;
};

type orderData = {
  date_of_receipt: string;
  date_of_return: string;
  place_of_receipt: string;
  place_of_return: string;
};

type order = orderData & {
  car_id: string;
  user_id: string;
  cancel: boolean;
  payment_method_id: number;
};

type dataToGetoffers = {
  receiptDate: Date;
  returnDate: Date;
  receiptLocation: string;
  price_from: number;
  price_to: number;
};

type fetchType = {
  status: string;
  message: string;
  payload?: any;
};

export {
  CustomRequest,
  userData,
  user,
  logInWithToken,
  userSnapshot,
  UserRequest,
  update,
  RequestWithQuery,
  queryBasicData,
  orderData,
  order,
  dataToGetoffers,
  aditionalfilters,
  fetchType,
  userOrder,
};
