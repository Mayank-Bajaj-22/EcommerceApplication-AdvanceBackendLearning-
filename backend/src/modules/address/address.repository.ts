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
        userId: string,
        addressId: string,
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
    ): Promise<void> {
        await prisma.address.delete({
            where: {
                id: addressId,
            },
        });
    }

    async countAddressesByUserId(userId: string): Promise<number> {
        return prisma.address.count({
            where: {
                userId,
            },
        });
    }

    async findDuplicateAddress(userId: string, data: createAddressDTO): Promise<Address | null> {
        return prisma.address.findFirst({
            where: {
                userId,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2 ?? null,
                city: data.city,
                state: data.state,
                pincode: data.pincode,
                country: data.country,
            },
        });
    }

    async findDuplicateAddressForUpdate(userId: string, addressId: string, data: updateAddressDTO): Promise<Address | null> {
        const existing = await prisma.address.findUnique({
            where: {
                id: addressId,
            },
        });

        if (!existing) {
            return null;
        }

        return prisma.address.findFirst({
            where: {
                userId,

                NOT: {
                    id: addressId,
                },

                addressLine1: data.addressLine1 ?? existing.addressLine1,
                addressLine2: data.addressLine2 ?? existing.addressLine2,
                city: data.city ?? existing.city,
                state: data.state ?? existing.state,
                pincode: data.pincode ?? existing.pincode,
                country: data.country ?? existing.country,
            },
        });
    }
}
