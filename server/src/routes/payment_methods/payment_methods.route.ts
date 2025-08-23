import express = require("express");
import { GET_payments_methods } from "./payment_methods.controller.js";

const payment_methodsRoute = express.Router();

payment_methodsRoute.get("/payment_methods", GET_payments_methods);

export default payment_methodsRoute;
