import { createOrderService } from "../services/order.service.js";

export const createOrder = async (req, res) => {
  try {
    const { productId, qty } = req.body;

    const order = await createOrderService(productId, qty);

    res.status(200).json({
      success: true,
      order
    });

  } catch (err) {
    res.status(400).json({ error: err.message });
    console.log('Error' , err);
  }
};
