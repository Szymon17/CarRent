import express = require("express");
import { httpGETassistanceInfo } from "./company.controller";

const companyRoute = express.Router();

companyRoute.get("/assistance_info", httpGETassistanceInfo);

export default companyRoute;
