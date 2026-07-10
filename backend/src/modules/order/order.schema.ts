import z from "zod";

/**
 * Create Order (Checkout)
 *
 * Frontend only sends the shipping address.
 * Products are fetched from the user's cart.
 */

export const createOrderSchema = z
    .object({
        addressId: z
            .string(),
    })
    .strict();

/**
 * Update Order Status (Admin Only)
 */

export const updateOrderStatusSchema = z
    .object({
        status: z.enum(["PENDING", "COMPLETED", "CANCELLED"]),
    })
    .strict();

/**
 * .strict()
 *  This prevents accidental or malicious extra data
 */

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusDTO = z.infer<typeof updateOrderStatusSchema>;