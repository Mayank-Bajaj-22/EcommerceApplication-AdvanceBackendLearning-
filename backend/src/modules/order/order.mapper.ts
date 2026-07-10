import { Prisma } from "@prisma/client";
import { OrderResponseDTO } from "./order.response.js";

type OrderWithRelations = Prisma.OrderGetPayload<{
    include: {
        items: true,
        orderAddress: true,
    };
}>;

export const toOrderResponse = (
    order: OrderWithRelations,
) : OrderResponseDTO => {
    return {
        id: order.id,
        totalPrice: order.totalPrice.toString(),
        totalItems: order.totalItems,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        
        items: order.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            productImageUrl: item.productImageUrl,
            quantity: item.quantity,
            priceAtPurchase: item.priceAtPurchase.toString(),
        })),

        orderAddress: order.orderAddress 
            ? {
                addressLine1: order.orderAddress.addressLine1,
                addressLine2: order.orderAddress.addressLine2,
                city: order.orderAddress.city,
                state: order.orderAddress.state,
                pincode: order.orderAddress.pincode,
                country: order.orderAddress.country,
            }
            : null,
    };
};