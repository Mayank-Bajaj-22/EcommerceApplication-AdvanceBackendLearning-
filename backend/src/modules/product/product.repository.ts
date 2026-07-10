import { Prisma, Product } from "@prisma/client";
import { IProductRepository } from "./product.interface.js";
import { prisma } from "../../lib/prisma.js";
import { ProductQueryOptions } from "../../types/index.js";

export class ProductRepository implements IProductRepository {
    async createProduct(data: {
        userId: string;
        categoryId: string;
        productName: string;
        productDescription: string;
        productImagesUrls: string[];
        price: any;
        stock: number;
    }): Promise<Product> {
        const newProduct = await prisma.product.create({
            data,
        });

        return newProduct;
    };

    async getProductById(productId: string) {
        const product = await prisma.product.findUnique({
            where: {
                id: productId,
            },
        });

        return product;
    }

    async getAllProducts() : Promise<Product[]> {
        const products = await prisma.product.findMany();

        return products;
    };

    async getProductsByCategoryId(categoryId: string) : Promise<Product[]> {
        const products = await prisma.product.findMany({
            where: {
                categoryId,
            },
        });

        return products;
    };

    async findProductByIdAndSellerId(productId: string, sellerId:string) : Promise<Product | null> {
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                userId: sellerId,
            },
        });

        return product;
    };

    async editProduct(data: Prisma.ProductUpdateInput, productId: string, sellerId: string): Promise<Product> {
        const product = await prisma.product.update({
            where: {
                id: productId,
                userId: sellerId,
            },
            data,
        });

        return product;
    }

    async toggleActiveProduct(productId: string, sellerId: string, isActive: boolean): Promise<Product> {
        const product = await prisma.product.update({
            where: {
                id: productId,
                userId: sellerId,
            },
            data: {
                isActive,
            },
        });

        return product;
    }

    async getAllActiveProducts(filters: ProductQueryOptions): Promise<{ products: Product[]; nextCursor: string | null; hasMore: boolean; }> {
        const {
            categoryId,
            minPrice,
            maxPrice,
            sortBy,
            limit = 10,
            cursor,
        } = filters;

        const where: Prisma.ProductWhereInput = {
            isActive: true,
        }

        // filter by category
        if (categoryId) {
            where.categoryId = categoryId;
        }

        // filter by minPrice and maxPrice
        if (minPrice || maxPrice) {
            where.price = {};

            if (minPrice) {
                where.price.gte = new Prisma.Decimal(minPrice);
            }

            if (maxPrice) {
                where.price.gte = new Prisma.Decimal(maxPrice);
            }
        }

        // cursor 
        if (cursor) {
            where.createdAt = {
                lt: new Date(cursor),
            };
        }

        // sorting
        let orderBy: Prisma.ProductOrderByWithRelationInput = {
            createdAt: "desc",
        }

        if (sortBy === "latest") {
            orderBy = {
                createdAt: "desc",
            };
        }

        if (sortBy === "oldest") {
            orderBy = {
                createdAt: "asc",
            };
        }

        if (sortBy === "priceAsc") {
            orderBy = {
                price: "asc",
            };
        }

        if (sortBy === "priceDesc") {
            orderBy = {
                price: "desc",
            };
        }

        const products = await prisma.product.findMany({
            where,
            orderBy,
            take: limit + 1,
        });

        let nextCursor: string | null = null;

        if (products.length > limit) {
            const nextItem = products.pop();
            nextCursor = nextItem?.createdAt.toISOString() || null;
        }

        return {
            products,
            nextCursor,
            hasMore: !!nextCursor,
        };
    }

    async deleteProduct(productId: string, sellerId: string) : Promise<any> {
        await prisma.product.delete({
            where: {
                id: productId, 
                userId: sellerId,
            },
        });
    }
}
