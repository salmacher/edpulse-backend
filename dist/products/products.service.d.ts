import { MemoryCacheService } from './cache/memory-cache.service';
import { GetProductsDto, PaginatedResponseDto } from './dto/get-products.dto';
export declare class ProductsService {
    private readonly cacheService;
    private readonly logger;
    private products;
    constructor(cacheService: MemoryCacheService);
    private generateMockData;
    getProducts(query: GetProductsDto): Promise<PaginatedResponseDto>;
    private generateCacheKey;
    getAllCategories(): Promise<string[]>;
    getProductsStats(): Promise<any>;
}
