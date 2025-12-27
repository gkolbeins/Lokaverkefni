import { pool } from "../config/db";

export const createPaddock = async (data: {
  name: string;
  location?: string;
  stallion_id: number;
}) => {
  const { name, location, stallion_id } = data;

  const result = await pool.query(
    `INSERT INTO paddocks (name, location, stallion_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, location ?? null, stallion_id]
  );

  return result.rows[0];
};
