import { Prisma, Product } from "@prisma/client";
import { IProductRepository } from "./product.interface.js";
import { prisma } from "../../lib/prisma.js";

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
}
