type orderData = {
  date_of_receipt: string | Date;
  date_of_return: string | Date;
  add_date: string | Date;
  place_of_receipt: string;
  place_of_return: string;
  canclel?: boolean;
  dayQuantity: number;
};

type fullOrderData = orderData & {
  id: string;
};

type orderInitialState = orderData & {
  productIndex: number | null;
  canclel: boolean;
  paymentMethod: number | null;
};

export type { orderData, orderInitialState, fullOrderData };
