type orderData = {
  date_of_receipt: string | Date;
  date_of_return: string | Date;
  place_of_receipt: string;
  place_of_return: string;
  canclel?: boolean;
  dayQuantity: number;
};

type orderInitialState = orderData & {
  productIndex: number | null;
  canclel: boolean;
  paymentMethod: number | null;
};

export { orderData, orderInitialState };
