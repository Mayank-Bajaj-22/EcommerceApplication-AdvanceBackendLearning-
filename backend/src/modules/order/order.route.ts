import express from "express";
import { verifyAdmin, verifyUser } from "../../middlewares/auth.middleware.js";
import { validate } from "../../middlewares/validate.middleware.js";
import { createOrderSchema, updateOrderStatusSchema } from "./order.schema.js";
import { cancelOrderController, createOrderController, getAllOrdersController, getMyOrderByIdController, getMyOrdersController, updateOrderStatusController } from "./order.controller.js";

const router = express.Router();

router
    .route("/create-order")
    .post(verifyUser, validate(createOrderSchema), createOrderController);

router
    .route("/current-order/:orderId")
    .get(verifyUser, getMyOrderByIdController);

router
    .route("/my-orders")
    .get(verifyUser, getMyOrdersController);

router
    .route("/all-orders")
    .get(verifyUser, verifyAdmin, getAllOrdersController);

router
    .route("/update-order-status/:orderId")
    .patch(verifyUser, verifyAdmin, validate(updateOrderStatusSchema), updateOrderStatusController);

router
    .route("/cancel-order/:orderId")
    .delete(verifyUser, cancelOrderController);

export default router;