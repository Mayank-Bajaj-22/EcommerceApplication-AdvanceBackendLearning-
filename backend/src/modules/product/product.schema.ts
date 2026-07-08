import z from "zod";

export const createProductSchema = z
    .object({
        categoryId: z.string(),
        productName: z.string().min(2, "Product name must be at least 2 characters long."),
        productDescription: z.string().min(5, "Product description must be at least 5 characters long."),
        price: z.string(),
        stock: z.string(),
    })
    .strict();

export const editProductSchema = z
    .object({
        productName: z.string().min(2, "Product name must be at least 2 characters long.").optional(),
        productDescription: z.string().min(5, "Product description must be at least 5 characters long.").optional(),
        price: z.string().optional(),
        stock: z.string().optional(),
    })
    .strict();

export type createProductDTO = z.infer<typeof createProductSchema>;
export type editProductDTO = z.infer<typeof editProductSchema>;