import { OrderStatus } from "@prisma/client";

export type OrderItemResponseDTO = {
    productId: string,
    productName: string,
    productImageUrl: string,
    quantity: number,
    priceAtPurchase: string,
};

export type OrderAddressResponseDTO = {
    addressLine1: string,
    addressLine2: string | null,
    city: string,
    state: string,
    pincode: string,
    country: string,
};

export type OrderResponseDTO = {
    id: string;
    totalPrice: string;
    totalItems: number;
    status: OrderStatus;
    createdAt: Date;
    updatedAt: Date;

    items: OrderItemResponseDTO[],

    orderAddress: OrderAddressResponseDTO | null,
};