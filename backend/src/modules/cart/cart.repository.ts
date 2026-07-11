import { Cart, CartItems } from "@prisma/client";
import { ICartRepository } from "./cart.interface.js";
import { prisma } from "../../lib/prisma.js";
import { CartWithItems } from "../../types/index.js";

export class CartRepository implements ICartRepository {
    async getCartByUserId(userId: string): Promise<Cart | null> {
        const cart = await prisma.cart.findUnique({
            where: {
                userId,
            },
        });

        return cart;
    }

    async createCart(userId: string): Promise<Cart> {
        const createdCart = await prisma.cart.create({
            data: {
                userId,
            },
        });

        return createdCart;
    }

    async getCartWithItems(userId: string): Promise<CartWithItems | null> {
        const cartWithItems = await prisma.cart.findUnique({
            where: {
                userId,
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        return cartWithItems;
    }

    async getCartItemsById(cartItemId: string): Promise<any> {
        const cartItemWithProduct = await prisma.cartItems.findUnique({
            where: {
                id: cartItemId,
            },
            include: {
                product: true,
            },
        });

        return cartItemWithProduct;
    }

    async addItem(cartId: string, productId: string, quantity: number): Promise<CartItems> {
        const existingItem = await prisma.cartItems.findUnique({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
        });

        if (existingItem) {
            return prisma.cartItems.update({
                where: {
                    id: existingItem.id,
                },
                data: {
                    quantity: {
                        increment: quantity,
                    },
                },
            });
        }

        return prisma.cartItems.create({
            data: {
                cartId,
                productId,
                quantity,
            },
        });
    }

    async updateItemQuantity(cartItemId: string, quantity: number): Promise<CartItems> {
        return prisma.cartItems.update({
            where: {
                id: cartItemId,
            },
            data: {
                quantity,
            },
        });
    }

    async removeItem(cartItemId: string): Promise<void> {
        await prisma.cartItems.delete({
            where: {
                id: cartItemId,
            },
        });
    }

    async clearCart(cartId: string): Promise<void> {
        await prisma.cartItems.deleteMany({
            where: {
                cartId,
            },
        });
    }
}