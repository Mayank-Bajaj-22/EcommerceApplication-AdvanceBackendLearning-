import { Prisma, Product } from "@prisma/client";

export interface IProductRepository {
    createProduct(data: {
        userId: string,
        categoryId: string,
        productName: string,
        productDescription: string,
        productImagesUrls: string[],
        price: any,
        stock: number,
    }) : Promise<Product>;
    getProductById(productId: string) : Promise<Product | null>;
    findProductByIdAndSellerId(productId: string, sellerId: string) : Promise<Product | null>;
    getAllProducts() : Promise<Product[]>;
    getProductsByCategoryId(categoryId: string) : Promise<Product[]>;
    editProduct(data: Prisma.ProductUpdateInput, productId: string, sellerId: string) : Promise<Product>;
};