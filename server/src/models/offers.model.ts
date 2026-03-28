import client from "../services/pg.js";
import { aditionalfilters, dataToGetoffers, order } from "../types/basicTypes.js";

async function getAvilableCars(lastIndex: number, filters: aditionalfilters, count: number, basicFiltersData: dataToGetoffers) {
  const { receiptDate, returnDate, receiptLocation, price_from, price_to } = basicFiltersData;
  // TODO: add validate filtres logic here
  // safe for now because values are whitelisted before

  // TODO: parametrize orders instead of join() for SQL safety
  // safe for now because values come from DB only

  if (count > 12) count = 12;

  const filterConditions = [];
  const filterValues = [lastIndex, price_from, price_to, receiptLocation, count];

  for (const [key, value] of Object.entries(filters)) {
    if (value) {
      filterConditions.push(`"${key}" = $${filterValues.length + 1}`);
      filterValues.push(value);
    }
  }

  const query = `
   SELECT 
    c.*,
    COALESCE(
        jsonb_object_agg(a.code, a.description) FILTER (WHERE a.id IS NOT NULL),
        '{}'::jsonb
    ) AS addons
FROM cars c
LEFT JOIN car_addons_map am ON am.car_id = c.id
LEFT JOIN car_addons a ON a.id = am.addon_id
WHERE 
    c.borrowed = FALSE
    AND c.id < $1
    AND c.daily_price BETWEEN $2 AND $3
    AND c.localisation = $4
    ${filterConditions.length > 0 ? `AND ${filterConditions.join(" AND ")}` : ""}
GROUP BY c.id
ORDER BY c.id DESC
LIMIT $5;
  `;

  try {
    const result = await client.query(query, filterValues);
    return result.rows;
  } catch (error) {
    console.error("Błąd podczas wykonywania zapytania:", error);
  }
}

async function getOfferByIndex(index: number): Promise<Car | void> {
  try {
    const res = await client.query(`SELECT * FROM cars WHERE id = $1 AND borrowed = FALSE`, [index]);

    return res.rows[0];
  } catch (error) {
    console.error("Błąd podczas wykonywania zapytania:", error);
  }
}

async function getOfferByName(fullName: string) {
  const [brand, model] = fullName.split("-");

  try {
    const res = await client.query(`SELECT * FROM cars WHERE brand = $1 AND model = $2 AND borrowed = FALSE`, [brand, model]);

    return res.rows[0];
  } catch (error) {
    console.error("Błąd podczas wykonywania zapytania:", error);
  }
}

async function getOffersById(carsId: string[]) {
  return (await client.query<Car>(`SELECT * FROM cars WHERE id = ANY($1)`, [carsId])).rows;
}

async function saveOrder(order: order) {
  const query = `
    INSERT INTO orders (car_id, user_id, add_date, expected_return_date, place_of_receipt, place_of_return, payment_method_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    order.car_id,
    order.user_id,
    order.date_of_receipt,
    order.date_of_return,
    order.place_of_receipt,
    order.place_of_return,
    order.payment_method_id,
  ];

  try {
    await client.query("BEGIN");

    const result = await client.query<order>(query, values);
    await client.query("UPDATE cars SET borrowed = TRUE WHERE id = $1", [order.car_id]);

    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
  }
}

async function getOrders(ordersId: string[]) {
  const query = `
  SELECT *
  FROM orders
  WHERE id = ANY($1)
  ORDER BY id DESC;
`;
  try {
    const res = await client.query<Reservation>(query, [ordersId]);
    return res.rows;
  } catch (err) {
    console.error(err);
  }
}

export { getAvilableCars, getOfferByIndex, saveOrder, getOrders, getOffersById, getOfferByName };
