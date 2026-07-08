import { Prisma } from "@prisma/client";
import { AppError } from "../../utils/AppError.js";
import { uploadToCloudinary } from "../../utils/cloudinary.helper.js";
import { IProductRepository } from "./product.interface.js";
import { createProductDTO, editProductDTO } from "./product.schema.js";
import { toProductListResponse, toProductResponse } from "./product.mapper.js";

export class ProductService {
    constructor(private productRepo: IProductRepository) {}

    async createProduct(
        data: createProductDTO,
        userId: string,
        files: Express.Multer.File[],
    ) {
        if (!files || files.length === 0) {
            throw new AppError("At least one product image is required", 400);
        }

        const imageUrls = await Promise.all(
            files.map((file) => uploadToCloudinary(file.buffer)),
        );

        const newProduct = await this.productRepo.createProduct({
            userId,
            categoryId: data.categoryId,
            productName: data.productName,
            productDescription: data.productDescription,
            productImagesUrls: imageUrls,
            price: new Prisma.Decimal(data.price),
            stock: Number(data.stock),
        });

        return toProductResponse(newProduct);
    }

    async getAllProducts() {
        const products = await this.productRepo.getAllProducts();

        return toProductListResponse(products);
    }

    async getProductsByCategory(categoryId: string) {
        const products = await this.productRepo.getProductsByCategoryId(categoryId);

        return toProductListResponse(products);
    }

    async editProduct(data: editProductDTO, productId: string, sellerId: string) {
        const existingProduct = await this.productRepo.findProductByIdAndSellerId(productId, sellerId);

        if (!existingProduct) {
            throw new AppError("Product not found", 404);
        }

        const updateData: Prisma.ProductUpdateInput = {};

        if (data.productName !== undefined) {
            updateData.productName = data.productName;
        }

        if (data.productDescription !== undefined) {
            updateData.productDescription = data.productDescription;
        }

        if (data.price !== undefined) {
            updateData.price = new Prisma.Decimal(data.price);
        }

        if (data.stock !== undefined) {
            updateData.stock = Number(data.stock);
        }

        if (Object.keys(updateData).length === 0) {
            throw new AppError("No valid fields provided to update.", 400);
        }

        const editedProduct = await this.productRepo.editProduct(
            updateData,
            productId,
            sellerId,
        );

        if (!editedProduct) {
            throw new AppError("Product not found or unauthorized", 404);
        }

        return toProductResponse(editedProduct);
    }
}