import { pool } from "../config/db";

export const getHorsesByOwner = async (
  ownerId: number,
  options?: {
    paddockId?: number;
    stallionId?: number;
    chipId?: string;
    sort?: "name" | "age";
    search?: string;
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

  if (options?.search !== undefined) {
  conditions.push(`
    (name ILIKE $${index}
      OR chip_id ILIKE $${index}
      OR is_number ILIKE $${index}
      OR other_info_1 ILIKE $${index}
      OR other_info_2 ILIKE $${index})`
    );
  values.push(`%${options.search}%`);
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
    `SELECT
      h.id,
      h.name,
      h.is_number,
      h.chip_id,
      h.owner_id,
      h.owner_name,
      h.owner_phone,
      h.owner_email,
      h.needs_vet,
      h.pregnancy_confirmed,
      h.notes,
      h.other_info_1,
      h.other_info_2,
      h.created_at,

      p.id AS paddock_id,
      p.name AS paddock_name,

      s.id AS stallion_id,
      s.name AS stallion_name

    FROM horses h
    LEFT JOIN paddocks p ON h.current_paddock_id = p.id
    LEFT JOIN stallions s ON h.current_stallion_id = s.id
    WHERE h.id = $1`,[id]);

  if (!result.rows[0]) return null;

  const row = result.rows[0];

  return {
    id: row.id,
    name: row.name,
    is_number: row.is_number,
    chip_id: row.chip_id,

    owner: {
      id: row.owner_id,
      name: row.owner_name,
      phone: row.owner_phone,
      email: row.owner_email,
    },

    paddock: row.paddock_id
      ? { id: row.paddock_id, name: row.paddock_name }
      : null,

    stallion: row.stallion_id
      ? { id: row.stallion_id, name: row.stallion_name }
      : null,

    needs_vet: row.needs_vet,
    pregnancy_confirmed: row.pregnancy_confirmed,

    notes: row.notes,
    other_info_1: row.other_info_1,
    other_info_2: row.other_info_2,
    created_at: row.created_at,
  };
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