import { OrderStatus, Prisma } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "../address/address.interface.js";
import { ICartRepository } from "../cart/cart.interface.js";
import { IOrderRepository } from "./order.interface.js";
import { CreateOrderDTO } from "./order.schema.js";
import { prisma } from "../../lib/prisma.js";
import { IProductRepository } from "../product/product.interface.js";
import { toOrderResponse } from "./order.mapper.js";
import { OrderResponseDTO } from "./order.response.js";
import { PaginatedOrdersResponse } from "./order.pagination.js";

export class OrderService {
    constructor(
        private orderRepo: IOrderRepository,
        private addressRepo: IAddressRepository,
        private cartRepo: ICartRepository,
        private productRepo: IProductRepository,
    ) {}

    async checkout(
        userId: string,
        data: CreateOrderDTO,
    ) : Promise<OrderResponseDTO> {
        /**
         * Step 1
         * Validate Shipping Address
         */
        
        const address = 
            await this.addressRepo.findByIdAndUserId(
                userId,
                data.addressId,
            );

        if (!address) {
            throw new AppError(
                "Shipping address not found",
                404,
            );
        }

        /**
         * Step 2
         * Get User Cart
         */

        const cart = await this.cartRepo.getCartWithItems(userId);

        if (!cart) {
            throw new AppError(
                "Cart not found",
                404,
            );
        }

        /**
         * Step 3
         * Cart Empty ?
         */

        if (cart.items.length === 0) {
            throw new AppError(
                "Your cart is empty.",
                400,
            );
        }

        /**
         * Step 4
         * Prepare Order Data
         */

        let totalItems = 0;

        let totalPrice = new Prisma.Decimal(0);

        const orderItemsData: Prisma.OrderItemsCreateManyInput[] = [];

        for (const cartItem of cart.items) {
            const product = cartItem.product;

            /**
             * Product Exists?
             */

            if (!product) {
                throw new AppError(
                    "One or more products are no longer available.",
                    400,
                );
            }

            /**
             * Product Active?
             */

            if (!product.isActive) {
                throw new AppError(
                    `${product.productName} is unavailable.`,
                    400,
                );
            }

            /**
             * Stock Validation
             */

            if (product.stock < cartItem.quantity) {
                throw new AppError(
                    `${product.productName} has only ${product.stock} items left.`,
                    400,
                );
            }

            /**
             * Calculate Totals
             */

            totalItems += cartItem.quantity;

            totalPrice = totalPrice.add(
                product.price.mul(cartItem.quantity),
            );

            /**
             * Prepare Snapshot
             */

            orderItemsData.push({
                orderId: "",
                productId: product.id,
                productName: product.productName,
                productImageUrl:
                    product.productImagesUrls[0],
                quantity: cartItem.quantity,
                priceAtPurchase: product.price,
            });
        }

        /**
         * Step 5
         * Transaction
         */

        const orderId = await prisma.$transaction(async (tx) => {
            /**
             * Create Order
             */

            const order = await this.orderRepo.createOrder(tx, {
                userId,
                totalPrice,
                totalItems,
            });

            /**
             * Attach Order Id to every Order Item
             */

            const finalOrderItems = orderItemsData.map((item) => ({
                ...item,
                orderId: order.id,
            }));

            /**
             * Create Order Items
             */

            await this.orderRepo.createOrderItems(
                tx,
                finalOrderItems,
            );

            /**
             * Copy Shipping Address
             */

            await this.orderRepo.createOrderAddress(tx, {
                orderId: order.id,
                addressLine1: address.addressLine1,
                addressLine2: address.addressLine2,
                city: address.city,
                state: address.state,
                pincode: address.pincode,
                country: address.country,
            });

            /**
             * Reduce Product Stock
             */

            await Promise.all(
                cart.items.map((item) => 
                    this.productRepo.decreaseStock(
                        tx,
                        item.productId,
                        item.quantity,
                    ),
                ),
            );

            /**
             * Clear User Cart
             */

            await this.cartRepo.clearCart(
                tx,
                cart.id,
            );

            /**
             * Return Created Order
             */

            return order.id;
        });

        /**
         * Fetch Complete Order
         */

        const createdOrder = await this.orderRepo.getOrderWithItems(orderId);

        if (!createdOrder) {
            throw new AppError(
                "Unable to fetch created order.",
                400,
            );
        }

        return toOrderResponse(createdOrder);
    }

    async getMyOrderById(
        userId: string,
        orderId: string,
    ) : Promise<OrderResponseDTO> {
        const order = await this.orderRepo.getOrderById(
            orderId,
            userId,
        );

        if (!order) {
            throw new AppError(
                "Order not found",
                404,
            );
        }

        return toOrderResponse(order);
    }

    async getMyOrders(
        userId: string,
    ) : Promise<OrderResponseDTO[]> {
        const orders = await this.orderRepo.getOrdersByUserId(userId);

        if (orders.length === 0) {
            return [];
        }

        return orders.map(order => toOrderResponse(order));
    }

    async getAllOrders(page: number, limit: number) : Promise<PaginatedOrdersResponse> {
        if (page < 1) {
            throw new AppError(
                "Page must be greater than 0.",
                400,
            );
        }

        if (limit < 1 || limit > 100) {
            throw new AppError(
                "Limit must be between 1 and 100.",
                400,
            );
        }

        const totalItems = await this.orderRepo.countAllOrders();

        const orders = await this.orderRepo.getAllOrders(page, limit);

        return {
            orders: orders.map(toOrderResponse),

            pagination: {
                page, 
                limit,
                totalItems,
                totalPages: Math.ceil(
                    totalItems / limit,
                ),
                hasNextPage: page * limit < totalItems,
                hasPreviousPage: page > 1,
            },
        };
    }

    async updateOrderStatus(
        orderId: string,
        status: OrderStatus,
    ) : Promise<OrderResponseDTO> {
        const exisitingOrder = await this.orderRepo.getOrderWithItems(orderId);

        if (!exisitingOrder) {
            throw new AppError(
                "Order not found",
                404,
            );
        }

        if (exisitingOrder.status === OrderStatus.COMPLETED) {
            throw new AppError(
                "Completed order cannot be updated.",
                400,
            );
        }

        if (exisitingOrder.status === OrderStatus.CANCELLED) {
            throw new AppError(
                "Cancelled order cannot be updated.",
                400,
            );
        }

        await prisma.$transaction(async (tx) => {
            await this.orderRepo.updateOrderStatus(
                tx,
                orderId,
                status,
            );
        });

        const updatedOrder = await this.orderRepo.getOrderWithItems(orderId);

        if (!updatedOrder) {
            throw new AppError(
                "Unable to fetch updated order.",
                500,
            );
        }   

        return toOrderResponse(updatedOrder);
    }

    async cancelOrder(
        userId: string,
        orderId: string,
    ) : Promise<OrderResponseDTO> {
        /**
         * Fetch Order
         */

        const order = await this.orderRepo.getOrderById(
            orderId,
            userId,
        );

        if (!order) {
            throw new AppError(
                "Order not found",
                404,
            );
        }

        if (order.status === OrderStatus.COMPLETED) {
            throw new AppError(
                "Completed orders cannot be cancelled.",
                400,
            );
        }

        if (order.status === OrderStatus.CANCELLED) {
            throw new AppError(
                "Order is already cancelled.",
                400,
            );
        }

        /**
         * Transaction
         */

        await prisma.$transaction(async (tx) => {
            /**
             * Restore Product Stock
             */

            await Promise.all(
                order.items.map((item) => 
                    this.productRepo.increaseStock(
                        tx,
                        item.productId,
                        item.quantity,
                    ),
                ),
            );

            /**
             * Update Order Status
             */

            await this.orderRepo.updateOrderStatus(
                tx,
                order.id,
                OrderStatus.CANCELLED,
            );
        });

        /**
         * Fetch Updated Order
         */

        const cancelledOrder = await this.orderRepo.getOrderWithItems(order.id);

        if (!cancelledOrder) {
            throw new AppError(
                "Unable to fetch cancelled order.",
                500,
            )
        }

        /**
         * Return Response
         */

        return toOrderResponse(cancelledOrder);
    }
}