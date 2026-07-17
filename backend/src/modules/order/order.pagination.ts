import { OrderResponseDTO } from "./order.response.js"

export type PaginatedOrdersResponse = {
    orders: OrderResponseDTO[];

    pagination: {
        page: number;
        limit: number;
        totalItems: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};