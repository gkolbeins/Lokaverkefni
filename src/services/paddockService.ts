import { pool } from "../config/db";

export const createPaddock = async ({
  name,
  location,
  owner_id,
  stallion_id = null,
}: {
  name: string;
  location?: string;
  owner_id: number;
  stallion_id?: number | null;
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


export const getPaddockById = async (paddockId: number) => {
  const result = await pool.query(
    `SELECT
      p.id AS paddock_id,
      p.name AS paddock_name,
      p.location,

      s.id AS stallion_id,
      s.name AS stallion_name,

      h.id AS horse_id,
      h.name AS horse_name,
      h.is_number,
      h.chip_id,
      h.needs_vet,
      h.pregnancy_confirmed,
      h.arrival_date
    FROM paddocks p
    LEFT JOIN stallions s ON p.stallion_id = s.id
    LEFT JOIN horses h ON h.current_paddock_id = p.id
    WHERE p.id = $1`, [paddockId]);

  return result.rows;
};

