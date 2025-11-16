import express = require("express");
import accountRoute from "./account/account.route.js";
import offersRoute from "./offers/offers.route.js";
import localizationsRoute from "./localizations/localizations.route.js";
import payment_methodsRoute from "./payment_methods/payment_methods.route.js";
import companyRoute from "./company/company.route.js";

const api = express.Router();

api.use(accountRoute);
api.use(offersRoute);
api.use(localizationsRoute);
api.use(payment_methodsRoute);
api.use(companyRoute);

export default api;
