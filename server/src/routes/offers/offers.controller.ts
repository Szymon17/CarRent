import { Response } from "express";
import { getAvilableCars, getOfferByIndex, getOfferByName, saveOrder } from "../../models/offers.model.js";
import { CustomRequest, RequestWithQuery, UserRequest, aditionalfilters, orderData, queryBasicData } from "../../types/basicTypes.js";
import { updateUserOrders } from "../../models/account.model.js";

const parseOrderDate = (value: unknown): Date | null => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;

  const [year, month, day] = value.split("-").map(Number);
  const parsedDate = new Date(year, month - 1, day);

  if (parsedDate.getFullYear() !== year || parsedDate.getMonth() !== month - 1 || parsedDate.getDate() !== day) return null;
  return parsedDate;
};

const validateOrderData = (userDataOb: unknown): userDataOb is orderData => {
  if (!userDataOb || typeof userDataOb !== "object" || Array.isArray(userDataOb)) return false;

  const data = userDataOb as Record<string, unknown>;
  const receiptDate = parseOrderDate(data.date_of_receipt);
  const returnDate = parseOrderDate(data.date_of_return);

  if (
    !receiptDate ||
    !returnDate ||
    typeof data.place_of_receipt !== "string" ||
    !data.place_of_receipt.trim() ||
    typeof data.place_of_return !== "string" ||
    !data.place_of_return.trim()
  ) {
    return false;
  }

  const now = new Date();
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const receiptDay = Date.UTC(receiptDate.getFullYear(), receiptDate.getMonth(), receiptDate.getDate());
  const returnDay = Date.UTC(returnDate.getFullYear(), returnDate.getMonth(), returnDate.getDate());

  return receiptDate >= tomorrow && returnDate > receiptDate && returnDay - receiptDay < 10 * 24 * 60 * 60 * 1000;
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

  const count = req.query.count ? (Number(req.query.count) > 9 ? 9 : Number(req.query.count)) : 9;

  //whitelist of filtres keys
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

    const basicFiltres = { returnDate, receiptLocation, receiptDate, price_from, price_to };
    const avilableCars = await getAvilableCars(lastIndex, filters, count, basicFiltres);

    if (avilableCars && avilableCars.length === 0)
      return res.status(404).json({ status: "error", message: "your filtres propably are too demanding" });
    else return res.status(200).json({ status: "ok", message: "Send avilable cars", payload: avilableCars });
  } else return res.status(404).json({ status: "error", message: "your data in filters is invalid" });
}

async function httpPostOrder(req: CustomRequest<{ userData: orderData; productIndex: number }> & UserRequest, res: Response) {
  const body = req.body;
  const paymentId = Number(body?.payment_id);

  if (
    !req.user ||
    !body ||
    typeof body !== "object" ||
    !Number.isSafeInteger(body.productIndex) ||
    body.productIndex <= 0 ||
    !Number.isSafeInteger(paymentId) ||
    paymentId <= 0 ||
    !validateOrderData(body.userData)
  ) {
    return res.status(400).json({ status: "error", message: "bad data request" });
  }

  const product = await getOfferByIndex(body.productIndex);
  if (!product) return res.status(404).json({ status: "error", message: "This order is unvilable" });

  const user_id = req.user.user_id;
  const car_id = product.id as string;
  const order = { ...body.userData, user_id, car_id, payment_method_id: paymentId };

  const orderResult = await saveOrder(order);

  if (orderResult) {
    const userResult = await updateUserOrders(orderResult.user_id.toString(), +product.id, req.user);
    if (userResult) return res.status(202).json({ status: "ok", message: "Created order" });
  }

  return res.status(404).json({ status: "error", message: "This order is unvilable" });
}

async function httpGetProductByIndex(req: RequestWithQuery<{ index: number }>, res: Response) {
  const productParams = decodeURIComponent((req.params as any).product).split("-");
  const index = productParams[2] ? Number(productParams[2]) : null;

  if (index) {
    const product = await getOfferByIndex(index);

    if (product) return res.status(200).json({ status: "ok", message: "Responsed product", payload: product });
    else return res.status(404).json({ status: "error", message: "Your product index is invalid" });
  } else return res.status(404).json({ status: "error", message: "There is nothing to return" });
}

export { httpGetOffers, httpPostOrder, httpGetProductByIndex };
