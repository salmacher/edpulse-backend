export declare class GetProductsDto {
    page?: number;
    limit?: number;
    category?: string;
    stock_status?: string;
}
export declare class PaginatedResponseDto {
    data: any[];
    meta: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
}
