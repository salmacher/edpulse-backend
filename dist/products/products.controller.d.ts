import { ProductsService } from './products.service';
import { GetProductsDto, PaginatedResponseDto } from './dto/get-products.dto';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    getProducts(query: GetProductsDto): Promise<PaginatedResponseDto>;
    getCategories(): Promise<{
        categories: string[];
    }>;
    getStats(): Promise<any>;
}
