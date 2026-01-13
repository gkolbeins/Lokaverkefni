import express from "express";
import dotenv from "dotenv";
import horseRoutes from "./routes/horseRoutes";
import { pool } from "./config/db";
import authRoutes from "./routes/authRoutes";
import stallionRoutes from "./routes/stallionRoutes";
import paddockRoutes from "./routes/paddockRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/horses", horseRoutes);

app.get("/", (request, response) => {
  response.send("Hryssa API running");
});

app.use("/stallions", stallionRoutes);

app.use("/paddocks", paddockRoutes);

//til að testa database-inn á meðan verið er að þróa verkefnið
app.get("/db-test", async (request, response) => {
  try {
    const result = await pool.query("SELECT NOW()");
    response.json(result.rows);
  } catch (error) {
    console.error(error);
    response.status(500).send("Database error");
  }
});

const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}

export default app;
