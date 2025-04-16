import "dotenv/config";
import express = require("express");
import cookieParser = require("cookie-parser");
import api from "./routes/api.js";
import cors = require("cors");
import helmet from "helmet";
import client from "./services/pg.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(api);

app.listen(process.env.PORT, async () => {
  try {
    await client.connect();
    console.log(`starting server at port ${process.env.PORT}...`);
  } catch (err: any) {
    throw Error(err);
  }
});
