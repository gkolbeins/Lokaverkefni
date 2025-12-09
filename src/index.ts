import express from "express";
import dotenv from "dotenv";
import horseRoutes from "./routes/horseRoutes";
import { pool } from "./config/db";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/horses", horseRoutes);

app.get("/", (req, res) => {
  res.send("Hryssa API running");
});

// Til að testa database-inn
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Database error");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
