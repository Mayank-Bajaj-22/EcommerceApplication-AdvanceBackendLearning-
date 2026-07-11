import { AddressType } from "@prisma/client";
import z from "zod";

export const createAddressSchema = z
    .object({
        addressType: z.enum(AddressType),
        addressLine1: z.string().min(1, "Address line 1 cannot be empty."),
        addressLine2: z.string().optional(),
        city: z.string().min(1, "City cannot be empty."),
        state: z.string().min(1, "State cannot be empty."),
        pincode: z.string().min(1, "Pincode cannot be empty."),
        country: z.string().min(1, "Country cannot be empty."),
    })
    .strict();

export const updateAddressSchema = z
    .object({
        addressType: z.enum(AddressType).optional(),
        addressLine1: z.string().min(1, "Address line 1 cannot be empty.").optional(),
        addressLine2: z.string().min(1, "Address line 2 cannot be empty.").optional(),
        city: z.string().min(1, "City cannot be empty.").optional(),
        state: z.string().min(1, "State cannot be empty.").optional(),
        pincode: z.string().min(1, "Pincode cannot be empty.").optional(),
        country: z.string().min(1, "Country cannot be empty.").optional(),
    })
    .strict();

export type createAddressDTO = z.infer<typeof createAddressSchema>;
export type updateAddressDTO = z.infer<typeof updateAddressSchema>;