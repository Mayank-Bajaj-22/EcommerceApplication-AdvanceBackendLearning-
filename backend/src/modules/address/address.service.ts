import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "./address.interface.js";
import { cleanCreateAddressData, cleanUpdateAddressData } from "./address.request.js";
import { createAddressDTO, updateAddressDTO } from "./address.schema.js";

export class AddressService {
    constructor(
        private addressRepo: IAddressRepository,
    ) {}

    async createAddress(data: createAddressDTO, userId: string) {

        // clean data
        const cleanedData = cleanCreateAddressData(data);

        // address limit
        const addressCount = await this.addressRepo.countAddressesByUserId(userId);

        if (addressCount >= 5) {
            throw new AppError("Maximum address limit reached.", 400);
        }

        // check duplicate address
        const duplicate = await this.addressRepo.findDuplicateAddress(userId, cleanedData);

        if (duplicate) {
            throw new AppError(
                "Address already exists.",
                409,
            );
        }

        const createdAddress = await this.addressRepo.createAddress(cleanedData, userId);

        return createdAddress;
    }

    async getAddressByUserId(userId: string) {
        const addresses = await this.addressRepo.getAddressesByUserId(userId);

        return addresses;
    }

    async updateAddress(userId: string, addressId: string, data: updateAddressDTO) {        
        const existingAddress = 
            await this.addressRepo.findByIdAndUserId(userId, addressId);
        
        if (!existingAddress) {
            throw new AppError(
                "Address not found.",
                404,
            );
        }

        if (Object.keys(data).length === 0) {
            throw new AppError(
                "No fields provided for update",
                400,
            );
        }

        const cleanedData = cleanUpdateAddressData(data);

        const duplicate = await this.addressRepo.findDuplicateAddressForUpdate(
            userId,
            addressId,
            cleanedData,
        );

        if (duplicate) {
            throw new AppError(
                "Another address with same details already exists.",
                409,
            );
        }

        const updatedData = await this.addressRepo.updateAddress(
            addressId,
            cleanedData,
        );

        return updatedData;
    }

    async deleteAddress(userId: string, addressId: string) {
        const existingAddress = 
            await this.addressRepo.findByIdAndUserId(userId, addressId);

        if (!existingAddress) {
            throw new AppError(
                "Address not found or you are unauthorized to perform this action.",
                401,
            );
        }

        await this.addressRepo.deleteAddress(addressId);
    }
}