import { Router } from "express";
import { createOrder } from "../controllers/order.controller.js";

const router = Router();

router.post("/order", createOrder);
router.get("/order", (req,res)=>{
   res.status(200).json({data:"Ok"})
})

export default router;
