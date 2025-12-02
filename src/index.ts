import express from "express";
import dotenv from "dotenv";
import horseRoutes from "./routes/horseRoutes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/horses", horseRoutes);

app.get("/", (request, response) => {
  response.send("Hryssa API running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
