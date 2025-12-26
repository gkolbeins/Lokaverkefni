import { pool } from "../config/db";

export const getHorsesByOwner = async (ownerId: number) => {
  const result = await pool.query("SELECT * FROM horses WHERE owner_id = $1 ORDER BY id ASC",
    [ownerId]);
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