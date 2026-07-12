import { Order, OrderAddress, OrderStatus, Prisma } from "@prisma/client";
import { IOrderRepository } from "./order.interface.js";
import { prisma } from "../../lib/prisma.js";
import { Decimal } from "@prisma/client/runtime/client";
import { OrderWithRelations } from "../../types/index.js";

export class OrderRepository implements IOrderRepository {
    async createOrder(
        tx: Prisma.TransactionClient, 
        data: { 
            userId: string; 
            totalPrice: Decimal; 
            totalItems: number; 
        },
    ): Promise<Order> {
        return await tx.order.create({
            data: {
                userId: data.userId,
                totalPrice: data.totalPrice,
                totalItems: data.totalItems,
            },
        });
    }

    async createOrderItems(
        tx: Prisma.TransactionClient, 
        data: Prisma.OrderItemsCreateManyInput[]
    ): Promise<Prisma.BatchPayload> {
        return await tx.orderItems.createMany({
            data,
        });
    }

    async createOrderAddress(
        tx: Prisma.TransactionClient, 
        data: { 
            orderId: string; 
            addressLine1: string; 
            addressLine2?: string | null; 
            city: string; 
            state: string; 
            pincode: string; 
            country: string;
        }): Promise<OrderAddress> {
        return await tx.orderAddress.create({
            data,
        });
    }

    async getOrderById(
        orderId: string,
        userId: string,
    ): Promise<OrderWithRelations | null> {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                orderAddress: true,
            },
        });

        return order;
    }

    async getOrderWithItems(
        orderId: string
    ): Promise<OrderWithRelations | null> {
        return await prisma.order.findUnique({
            where: {
                id: orderId,
            },
            include: {
                items: true,
                orderAddress: true,
            },
        });
    }

    async getOrdersByUserId(
        userId: string
    ) : Promise<OrderWithRelations[]> {
        const orders = await prisma.order.findMany({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                orderAddress: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return orders;
    }

    async getAllOrders(): Promise<OrderWithRelations[]> {
        return await prisma.order.findMany({
            include: {
                items: true,
                orderAddress: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    }
    async updateOrderStatus(
        tx: Prisma.TransactionClient,
        orderId: string, 
        status: OrderStatus
    ): Promise<Order> {
        const updatedOrder = await tx.order.update({
            where: {
                id: orderId,
            },
            data: {
                status,
            },
        });

        return updatedOrder;
    }
}