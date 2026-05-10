import path from "path";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";

import api from "./routes/api.js";
import client from "./services/pg.js";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use(helmet());

app.use("/api", api);

app.listen(process.env.PORT, async () => {
  console.log("Starting server...");

  try {
    await client.connect();
    console.log(`starting server at port ${process.env.PORT}...`);
  } catch (err) {
    console.log(err);
  }
});
