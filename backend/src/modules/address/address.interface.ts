import { Address, Prisma } from "@prisma/client";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export interface IAddressRepository {
    createAddress(
        data: createAddressDTO,
        userId: string,
    ) : Promise<Address>;
    
    /**
     * Find a specific address that belongs to a user.
     * Used during checkout to ensure the user owns the address.
     */
    findByIdAndUserId(
        addressId: string,
        userId: string,
        tx?: Prisma.TransactionClient
    ) : Promise<Address | null>;

    /**
     * Find an address by its ID.
     * Useful for admin operations or internal use.
     */

    findById(
        addressId: string,
        tx?: Prisma.TransactionClient
    ) : Promise<Address | null>;

    getAddressesByUserId(
        userId: string,
    ) : Promise<Address[]>;

    updateAddress(
        addressId: string,
        data: updateAddressDTO,
    ) : Promise<Address>;

    deleteAddress(
        addressId: string,
    ) : Promise<any>;
};