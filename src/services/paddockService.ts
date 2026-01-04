import { pool } from "../config/db";

export const createPaddock = async ({
  name,
  location,
  owner_id,
  stallion_id,
}: {
  name: string;
  location?: string;
  owner_id: number;
  stallion_id: number;
}) => {
  const result = await pool.query(
    `INSERT INTO paddocks (name, location, owner_id, stallion_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, location ?? null, owner_id, stallion_id]
  );

  return result.rows[0];
};

export const getPaddocksByOwner = async (ownerId: number) => {
  const result = await pool.query(
    `SELECT
      paddocks.id,
      paddocks.name,
      paddocks.location,
      CASE
        WHEN s.id IS NULL THEN NULL
        ELSE json_build_object(
          'id', s.id,
          'name', s.name,
          'is_number', s.is_number
        )
      END AS stallion
    FROM paddocks
    LEFT JOIN stallions s ON paddocks.stallion_id = s.id
    WHERE paddocks.owner_id = $1
    ORDER BY paddocks.id`,
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
