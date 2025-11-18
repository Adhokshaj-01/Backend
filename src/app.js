import e from "express";
import cors from "cors";
import dotenv from "dotenv";
import orderRoutes from "./api/order.routes.js"
dotenv.config();

const app = e();
app.use(cors());
app.use(e.json());

app.use('/api' , orderRoutes);

export default app;
