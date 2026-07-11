import { Prisma, Address } from "@prisma/client";
import { IAddressRepository } from "./address.interface.js";
import { prisma } from "../../lib/prisma.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressRepository implements IAddressRepository {
    async createAddress(
        data: createAddressDTO, 
        userId: string,
    ): Promise<Address> {
        const createAddress = await prisma.address.create({
            data: {
                userId,
                ...data,
            },
        });

        return createAddress;
    }

    async getAddressesByUserId(
        userId: string
    ): Promise<Address[]> {
        const addresses = await prisma.address.findMany({
            where: {
                userId,
            },
        });

        return addresses;
    }

    async findByIdAndUserId(
        addressId: string,
        userId: string,
        tx?: Prisma.TransactionClient,
    ): Promise<Address | null> {
        const db = tx ?? prisma;

        return db.address.findFirst({
            where: {
                id: addressId,
                userId,
            },
        });
    }

    async updateAddress(
        addressId: string, 
        data: updateAddressDTO
    ): Promise<Address> {
        const updatedAddress = await prisma.address.update({
            where: {
                id: addressId,
            },
            data,
        });

        return updatedAddress;
    }

    async findById(
        addressId: string, 
        tx?: Prisma.TransactionClient
    ): Promise<Address | null> {
        const db = tx ?? prisma;

        return db.address.findUnique({
            where: {
                id: addressId,
            },
        });
    }

    async deleteAddress(
        addressId: string
    ): Promise<any> {
        await prisma.address.delete({
            where: {
                id: addressId,
            },
        });
    }
}
