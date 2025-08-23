import { Request, Response } from "express";
import client from "../../services/pg";

async function GET_payments_methods(req: Request, res: Response) {
  try {
    const payment_methods = await client.query("SELECT id,name,code FROM payment_methods WHERE is_active = true");

    if (payment_methods.rowCount) return res.status(200).json({ status: "ok", payload: payment_methods.rows });
  } catch (error) {
    console.error(error);
  }

  return res.status(400).json({ status: "error", message: "fetch failed" });
}

export { GET_payments_methods };
