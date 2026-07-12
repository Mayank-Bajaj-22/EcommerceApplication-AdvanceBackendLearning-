import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { orderService } from "./order.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createOrderController = CatchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;

        const result = await orderService.checkout(userId, req.body);

        sendResponse(res, 201, {
            success: true,
            message: "Order created successfully",
            data: result,
        });
    },
);

export const getMyOrderByIdController = CatchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;
        const orderId = req.params.orderId as string;

        const result = await orderService.getMyOrderById(userId, orderId);

        sendResponse(res, 201, {
            success: true,
            message: "Order fetched successfully",
            data: result,
        });
    },
);

export const getMyOrdersController = CatchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;

        const result = await orderService.getMyOrders(userId);

        sendResponse(res, 201, {
            success: true,
            message: "All orders fetched successfully",
            data: result,
        });
    },
);

export const getAllOrdersController = CatchAsync(
    async (req: Request, res: Response) => {
        const result = await orderService.getAllOrders();

        sendResponse(res, 201, {
            success: true,
            message: "All orders fetched successfully",
            data: result,
        });
    },
);

export const updateOrderStatusController = CatchAsync(
    async (req: Request, res: Response) => {
        const orderId = req.params.orderId as string;

        const result = await orderService.updateOrderStatus(orderId, req.body.status);

        sendResponse(res, 201, {
            success: true,
            message: "Order status updated successfully",
            data: result,
        });
    },
);

export const cancelOrderController = CatchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;

        const orderId = req.params.orderId as string;

        const result = await orderService.cancelOrder(userId, orderId);

        sendResponse(res, 200, {
            success: true,
            message: "Order cancelled successfully.",
            data: result,
        });
    },
);