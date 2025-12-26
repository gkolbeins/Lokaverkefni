import { pool } from "../config/db";

export const createStallion = async (data: {
  name: string;
  is_number?: string;
  chip_id?: string;
  notes?: string;
  owner_id: number;
}) => {
  const { name, is_number, chip_id, notes, owner_id } = data;

  const result = await pool.query(
    `INSERT INTO stallions (name, is_number, chip_id, notes, owner_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [name, is_number ?? null, chip_id ?? null, notes ?? null, owner_id]
  );

  return result.rows[0];
};

export const getStallionsByOwner = async (ownerId: number) => {
  const result = await pool.query(
    `SELECT * FROM stallions WHERE owner_id = $1 ORDER BY id ASC`,
    [ownerId]
  );

  return result.rows;
};

export const getStallionById = async (id: number) => {
  const result = await pool.query(
    `SELECT * FROM stallions WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

export const updateStallion = async (
  id: number,
  fields: Record<string, any>
) => {
  const keys = Object.keys(fields);

  if (keys.length === 0) {
    return null;
  }

  const values = Object.values(fields);

  const setClause = keys
    .map((key, index) => `${key} = $${index + 1}`)
    .join(", ");

  const query = `UPDATE stallions
    SET ${setClause}
    WHERE id = $${keys.length + 1}
    RETURNING *`;

  const result = await pool.query(query, [...values, id]);
  return result.rows[0];
};

export const deleteStallion = async (id: number) => {
  const result = await pool.query(
    `DELETE FROM stallions WHERE id = $1 RETURNING *`,
    [id]
  );

  return result.rows[0];
};
