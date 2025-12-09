import { pool } from "../config/db";

export const getHorses = async () => {
  const result = await pool.query("SELECT * FROM horses ORDER BY id ASC");
  return result.rows;
};
