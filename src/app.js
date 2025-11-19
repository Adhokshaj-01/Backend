import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./api/order.routes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());   // <-- FIXED

app.get("/", (req, res) => {
  res.status(200).json("Engine Running");
});

app.use("/api", orderRoutes);

export default app;
