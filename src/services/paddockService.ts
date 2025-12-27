import { pool } from "../config/db";

export const createPaddock = async ({
  name,
  location,
  owner_id,
}: {
  name: string;
  location?: string;
  owner_id: number;
}) => {
  const result = await pool.query(
    `INSERT INTO paddocks (name, location, owner_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, location ?? null, owner_id]
  );

  return result.rows[0];
};

export const getPaddocksByOwner = async (ownerId: number) => {
  const result = await pool.query(
    `SELECT *
     FROM paddocks
     WHERE owner_id = $1
     ORDER BY id`,
    [ownerId]
  );

  return result.rows;
};

export const getPaddockById = async (id: number) => {
  const result = await pool.query(
    "SELECT * FROM paddocks WHERE id = $1",
    [id]
  );

  return result.rows[0];
};
