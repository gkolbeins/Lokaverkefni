import express from "express";
import dotenv from "dotenv";
import horseRoutes from "./routes/horseRoutes";
import { pool } from "./config/db";
import authRoutes from "./routes/authRoutes";
import stallionRoutes from "./routes/stallionRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/horses", horseRoutes);

app.get("/", (req, res) => {
  res.send("Hryssa API running");
});

app.use("/stallions", stallionRoutes);

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

export default app;