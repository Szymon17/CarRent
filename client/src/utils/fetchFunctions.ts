import { orderData, orderInitialState } from "../store/order/order.types";
import { paymentState } from "../store/payments/payments.types";
import { product } from "../store/products/products.types";
import { userCall, userData, userOrder, userPayload, userPutResponse, userUpdate } from "../store/user/user.types";

export const serverUrl = "http://localhost:8000";

type fetchType<T> = {
  status: string;
  message: string;
  payload?: T;
};

const registerUserFetch = async (user: userData): Promise<fetchType<undefined> | void> => {
  try {
    const res = await fetch(`${serverUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.assign(user, { orders: [] })),
    });

    return await res.json();
  } catch (err) {
    return;
  }
};

const getTokenByEmailAndPassword = async (email: string, password: string): Promise<userPayload | void> => {
  try {
    const res = await fetch(`${serverUrl}/log-in`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data: userCall = await res.json();
    if (data.user && data.expire) return data;
  } catch (error) {
    return;
  }
};

const logOutUser = async () => {
  try {
    await fetch(`${serverUrl}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    return;
  }
};

const updateUserFetch = async (userToUpdate: userUpdate): Promise<userPutResponse | undefined> => {
  try {
    const res = await fetch(`${serverUrl}/account`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "PUT",
      credentials: "include",
      body: JSON.stringify(userToUpdate),
    });

    const status = (await res.json()) as userPutResponse;

    return status;
  } catch (err) {
    console.error(err);
  }
};

const deleteUserFetch = async (email: string): Promise<fetchType<null> | undefined> => {
  try {
    const res = await fetch(`${serverUrl}/account`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email }),
    });

    const status: fetchType<null> = await res.json();

    return status;
  } catch (err) {
    console.log(err);
  }
};

const getProductsFetch = async (params: string): Promise<product[] | void> => {
  try {
    const res = await fetch(`${serverUrl}/offers${params}`);
    const status: fetchType<product[]> = await res.json();

    if (status.status === "ok") return status.payload;
  } catch (error) {
    console.log(error);
  }
};

const getProductByNameFetch = async (name: string): Promise<product | void> => {
  try {
    console.log(name);
    const res = await fetch(`${serverUrl}/offers/product/${name}`);
    const status: fetchType<product> = await res.json();

    if (status.status === "ok") return status.payload;
    else console.log("Get request to server failed");
  } catch (error) {
    console.log(error);
  }
};

const getLocationsFetch = async () => {
  try {
    const res = await fetch(`${serverUrl}/localizations`);
    const status: fetchType<string[]> = await res.json();

    if (status.status === "ok") return status.payload;
    else console.log("Get request to server failed");
  } catch (error) {
    console.log(error);
  }
};

const getPaymentMethodsFetch = async () => {
  try {
    const res = await fetch(`${serverUrl}/payment_methods`);
    const data: fetchType<paymentState[]> = await res.json();

    if (data.status === "ok") return data.payload;
    else console.log("Get request to server failed");
  } catch (error) {
    console.log(error);
  }
};

const saveOrderFetch = async (data: orderInitialState) => {
  const userData: orderData = {
    date_of_receipt: data.date_of_receipt,
    date_of_return: data.date_of_return,
    place_of_receipt: data.place_of_receipt,
    place_of_return: data.place_of_return,
    dayQuantity: data.dayQuantity,
  };
  const productIndex = data.productIndex;

  try {
    const res = await fetch(`${serverUrl}/offers/order`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ userData, productIndex, payment_id: data.paymentMethod }),
    });
    const status: fetchType<null> = await res.json();

    if (status.status === "ok") return status.status;
    else console.log("request to server failed");
  } catch (error) {
    console.log(error);
  }
};

const getUserOrders = async (lastOrderIndex: number, itemsCount: number) => {
  try {
    const res = await fetch(`${serverUrl}/user_orders?index=${lastOrderIndex}&itemsCount=${itemsCount}`, { credentials: "include" });
    const status: fetchType<userOrder[]> = await res.json();

    if (status.status === "ok") return status.payload;
  } catch (error) {
    console.log(error);
  }
};

export {
  registerUserFetch,
  getTokenByEmailAndPassword,
  logOutUser,
  updateUserFetch,
  deleteUserFetch,
  getProductsFetch,
  getProductByNameFetch,
  getLocationsFetch,
  saveOrderFetch,
  getUserOrders,
  getPaymentMethodsFetch,
};
