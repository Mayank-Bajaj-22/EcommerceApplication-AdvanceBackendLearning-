import { AppError } from "../../utils/AppError.js";
import { IAddressRepository } from "../address/address.interface.js";
import { IOrderRepository } from "./order.interface.js";
import { CreateOrderDTO } from "./order.schema.js";

export class OrderService {
    constructor(
        private orderRepo: IOrderRepository,
        private addressRepo: IAddressRepository,
    ) {}

    async checkout(
        userId: string,
        data: CreateOrderDTO,
    ) {
        /**
         * Step 1
         * Validate Shipping Address
         */
        
        const address = 
            await this.addressRepo.findByIdAndUserId(
                data.addressId,
                userId,
            );

        if (!address) {
            throw new AppError(
                "Shipping address not found",
                404,
            );
        }

        /**
         * Step 2
         * Get User Cart
         */
    }
}