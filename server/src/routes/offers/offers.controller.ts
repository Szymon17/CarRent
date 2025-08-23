import { Response } from "express";
import { getAvilableCars, getOfferByIndex, saveOrder } from "../../models/offers.model.js";
import { CustomRequest, RequestWithQuery, UserRequest, aditionalfilters, orderData, queryBasicData } from "../../types/basicTypes.js";
import { updateUserOrders } from "../../models/account.model.js";

const validateOrderData = (userDataOb: orderData): boolean => {
  const { date_of_receipt, date_of_return, place_of_receipt, place_of_return } = userDataOb;

  if (date_of_receipt && date_of_return && place_of_receipt && place_of_return && new Date(date_of_receipt) < new Date(date_of_return)) return true;
  else return false;
};

const validateGetOffersData = (reciptDate: Date, returnDate: Date): boolean => {
  return (
    reciptDate !== null &&
    !isNaN(reciptDate.getDate()) &&
    returnDate !== null &&
    !isNaN(returnDate.getDate()) &&
    reciptDate < returnDate &&
    reciptDate > new Date()
  );
};

const createFilters = (query: queryBasicData): aditionalfilters => {
  const filters: aditionalfilters = {};

  if (query.drive_type) filters.drive_type = query.drive_type;
  if (query.fuel_type) filters.fuel_type = query.fuel_type;
  if (query.fuel_type) filters.fuel_type = query.fuel_type;
  if (query.number_of_seats) filters.number_of_seats = query.number_of_seats;
  if (query.brand) filters.brand = query.brand;
  if (query.type) filters.type = query.type;

  return filters;
};

async function httpGetOffers(req: RequestWithQuery<queryBasicData>, res: Response) {
  const tenDaysInMs = 864000000;
  const lastIndex = req.query.index ? Number(req.query.index) : 2147483647;

  const receiptDate = req.query.rd ? new Date(req.query.rd) : null;
  const returnDate = req.query.rtd ? new Date(req.query.rtd) : null;

  const receiptLocation = req.query.pul;
  const returnLocation = req.query.rl;

  const price_from = Number(req.query.price_from) || 0;
  const price_to = Number(req.query.price_to) || 500;

  const count = req.query.count ? (Number(req.query.count) >= 7 ? 4 : Number(req.query.count)) : 4;

  const filters = createFilters(req.query);

  if (
    receiptLocation &&
    receiptDate &&
    returnDate &&
    validateGetOffersData(receiptDate, returnDate) &&
    receiptLocation !== null &&
    returnLocation !== null
  ) {
    const timeDiff = returnDate.getTime() - receiptDate.getTime();

    if (timeDiff > tenDaysInMs) return res.status(404).json({ status: "error", message: "your rent time is too long" });

    const avilableCars = await getAvilableCars(lastIndex, filters, count, { returnDate, receiptLocation, receiptDate, price_from, price_to });

    if (avilableCars.length === 0) return res.status(404).json({ status: "error", message: "your filtres propably are too demanding" });
    else return res.status(200).json({ status: "ok", message: "Send avilable cars", payload: avilableCars });
  } else return res.status(404).json({ status: "error", message: "your data in filters is invalid" });
}

async function httpPostOrder(req: CustomRequest<{ userData: orderData; productIndex: number }> & UserRequest, res: Response) {
  if (req.user && req.body.productIndex && req.body.payment_id && validateOrderData(req.body.userData)) {
    const product = await getOfferByIndex(req.body.productIndex);

    const chargedAccount = true;

    if (product && chargedAccount) {
      const user_id = req.user.user_id;
      const car_id = product.id as string;
      const order = { ...req.body.userData, user_id, car_id, cancel: false, payment_method_id: req.body.payment_id };

      const orderResult = await saveOrder(order);

      if (orderResult && product.index) {
        const userResult = await updateUserOrders(orderResult.user_id.toString(), product.index, req.user);
        if (userResult) res.status(202).json({ status: "ok", message: "Created order" });
        else res.status(404).json({ status: "error", message: "This order is unvilable" });
      } else res.status(404).json({ status: "error", message: "This order is unvilable" });
    }
  } else res.status(404).json({ status: "error", message: "bad data request" });
}

async function httpGetProductByIndex(req: RequestWithQuery<{ index: number }>, res: Response) {
  const index = Number(req.query.index) || -1;

  if (index !== -1) {
    const product = await getOfferByIndex(index);
    if (product) return res.status(200).json({ status: "ok", message: "Responsed product", payload: product });
    else return res.status(404).json({ status: "error", message: "Your product index is invalid" });
  } else return res.status(404).json({ status: "error", message: "There is nothing to return" });
}

export { httpGetOffers, httpPostOrder, httpGetProductByIndex };
