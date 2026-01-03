import { pool } from "../src/config/db";

export default async function () {
  console.log("Global test DB reset");

  await pool.query(`TRUNCATE TABLE
      horses,
      stallions,
      paddocks,
      users
    RESTART IDENTITY
    CASCADE;`);
}
