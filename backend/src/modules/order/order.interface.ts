import { Order, OrderAddress, OrderStatus, Prisma } from "@prisma/client";
import { OrderWithRelations } from "../../types/index.js";

export interface IOrderRepository {

    /**
     * Create Order
     */

    createOrder(
        tx: Prisma.TransactionClient,
        data: {
            userId: string,
            totalPrice: Prisma.Decimal,
            totalItems: number,
        }
    ) : Promise<Order>;

    /**
     * Create Order Items
     */

    createOrderItems(
        tx: Prisma.TransactionClient,
        data: Prisma.OrderItemsCreateManyInput[],
    ) : Promise<Prisma.BatchPayload>;

    /**
     * Copy Shipping Address
     */

    createOrderAddress(
        tx: Prisma.TransactionClient,
        data: {
            orderId: string,
            addressLine1: string,
            addressLine2?: string | null,
            city: string,
            state: string,
            pincode: string,
            country: string,
        },
    ) : Promise<OrderAddress>;

    /**
     * Get Single Order
     */

    getOrderById(orderId: string, userId: string) : Promise<OrderWithRelations | null>;

    /**
     * Get Order With Relations
     */

    getOrderWithItems(
        orderId: string,
    ): Promise<OrderWithRelations | null>;

    /**
     * Get Logged-in User Orders
     */

    getOrdersByUserId(
        userId: string,
    ) : Promise<OrderWithRelations[]>;

    /**
     * Admin
     */

    getAllOrders(
        page: number,
        limit: number,
    ): Promise<OrderWithRelations[]>;

    countAllOrders() : Promise<number>;

    /**
     * Update Status
     */

    updateOrderStatus(
        tx: Prisma.TransactionClient,
        orderId: string, 
        status: OrderStatus
    ) : Promise<Order>;
};