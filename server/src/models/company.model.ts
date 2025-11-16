import client from "../services/pg.js";

export async function DBgetAssistanceInfo() {
  try {
    const res = await client.query("SELECT attribute_name,attribute_value FROM company_info WHERE type = 'assistance'");

    return res.rows;
  } catch (error) {
    console.error(error);
    return [];
  }
}
