import { Request, Response } from "express";
import { CatchAsync } from "../../utils/CatchAsync.js";
import { productService } from "./product.container.js";
import { sendResponse } from "../../utils/sendResponse.js";

export const createProductController = CatchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user.id;

        const result = await productService.createProduct(
            req.body,
            userId,
            req.files as Express.Multer.File[],
        );

        sendResponse(res, 201, {
            success: true,
            message: "Product created successfully",
            data: result,
        });
    },
);

export const getAllProductsController = CatchAsync(
    async (req: Request, res: Response) => {
        const result = await productService.getAllProducts();

        sendResponse(res, 200, {
            success: true,
            message: "All Products fetched successfully",
            data: result,
        });
    },
);

export const getProductsByCategoryController = CatchAsync(
    async (req: Request, res: Response) => {
        const categoryId = req.params.catId as string;

        const result = await productService.getProductsByCategory(categoryId);

        sendResponse(res, 200, {
            success: true,
            message: "All Products fetched by Category successfully",
            data: result,
        });
    },
);

export const editProductController = CatchAsync(
    async (req: Request, res: Response) => {
        const productId = req.params.prodId as string;
        const sellerId = req.user.id as string;

        const result = await productService.editProduct(
            req.body,
            productId,
            sellerId,
        );

        sendResponse(res, 200, {
            success: true,
            message: "Product edited successfully",
            data: result,
        });
    },
);