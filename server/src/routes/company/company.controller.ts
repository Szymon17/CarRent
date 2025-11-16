import { Request, Response } from "express";
import { DBgetAssistanceInfo } from "../../models/company.model";

export async function httpGETassistanceInfo(req: Request, res: Response) {
  const assistance = await DBgetAssistanceInfo();

  return res.json({ status: "ok", data: assistance });
}
