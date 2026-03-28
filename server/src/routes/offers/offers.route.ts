import protect from "../../utils/protect.js";
import { httpGetOffers, httpGetProductByIndex, httpPostOrder } from "./offers.controller.js";
import express = require("express");

const offersRoute = express.Router();

offersRoute.get("/offers", httpGetOffers);
offersRoute.get("/offers/product/:product", httpGetProductByIndex);
offersRoute.route("/offers/order").post(protect, httpPostOrder as any);

export default offersRoute;
