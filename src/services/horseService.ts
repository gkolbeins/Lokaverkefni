import { pool } from "../config/db";

export const getHorsesByOwner = async (
  ownerId: number,
  options?: {
    paddockId?: number;
    stallionId?: number;
    chipId?: string;
    sort?: "name" | "age";
  }
) => {
  const values: any[] = [ownerId];
  const conditions: string[] = ["owner_id = $1"];

  let index = 2;

  if (options?.paddockId !== undefined) {
    conditions.push(`current_paddock_id = $${index}`);
    values.push(options.paddockId);
    index++;
  }

  if (options?.stallionId !== undefined) {
    conditions.push(`current_stallion_id = $${index}`);
    values.push(options.stallionId);
    index++;
  }

  if (options?.chipId !== undefined) {
    conditions.push(`chip_id = $${index}`);
    values.push(options.chipId);
    index++;
  }

  let orderBy = "ORDER BY id ASC";

  if (options?.sort === "name") {
    orderBy = "ORDER BY name ASC";
  }

  const query = `
    SELECT *
    FROM horses
    WHERE ${conditions.join(" AND ")}
    ${orderBy}
  `;

  const result = await pool.query(query, values);
  return result.rows;
};


export const getHorseById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM horses WHERE id = $1",
    [id]
  );
  return result.rows[0];
};


export const updateHorse = async (
  id: number,
  fields: Record<string, any>
) => {
  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return null;
  }
  
  const values = Object.values(fields);

  const SetClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ");

  const query = `UPDATE horses SET ${SetClause} WHERE id = $${keys.length + 1} RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

export const deleteHorse = async (id: number) => {
  const result = await pool.query(
    "DELETE FROM horses WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};