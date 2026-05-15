import { Injectable, Logger } from '@nestjs/common';
import { Product, StockStatus } from './entities/product.entity';
import { MemoryCacheService } from './cache/memory-cache.service';
import { GetProductsDto, PaginatedResponseDto } from './dto/get-products.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);
  private products: Product[] = [];

  constructor(private readonly cacheService: MemoryCacheService) {
    this.generateMockData();
  }

  private generateMockData(): void {
    const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Toys', 'Home', 'Beauty'];
    const stockStatuses = [StockStatus.IN_STOCK, StockStatus.LOW_STOCK, StockStatus.OUT_OF_STOCK];
    const productNames = {
      Electronics: ['Laptop', 'Smartphone', 'Tablet', 'Headphones', 'Keyboard', 'Mouse', 'Monitor', 'Speaker'],
      Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Dress', 'Shirt', 'Shoes', 'Hat', 'Socks'],
      Food: ['Pizza', 'Burger', 'Salad', 'Pasta', 'Rice', 'Bread', 'Cheese', 'Fruit'],
      Books: ['Novel', 'Textbook', 'Magazine', 'Comic', 'Biography', 'Cookbook', 'Dictionary', 'Encyclopedia'],
      Sports: ['Ball', 'Racket', 'Gloves', 'Bat', 'Helmet', 'Shoes', 'Bag', 'Bottle'],
      Toys: ['Doll', 'Action Figure', 'Puzzle', 'Board Game', 'Car', 'Plush Toy', 'Lego', 'Drone'],
      Home: ['Lamp', 'Chair', 'Table', 'Sofa', 'Bed', 'Mirror', 'Clock', 'Rug'],
      Beauty: ['Shampoo', 'Soap', 'Lotion', 'Perfume', 'Makeup', 'Brush', 'Cream', 'Oil'],
    };

    let id = 1;
    for (let i = 0; i < 200; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const nameList = productNames[category] || productNames.Electronics;
      const name = `${nameList[Math.floor(Math.random() * nameList.length)]} ${Math.floor(Math.random() * 1000)}`;
      
      this.products.push({
        id: id++,
        name: name,
        category: category,
        price: Math.floor(Math.random() * 1000) + 10,
        stock_status: stockStatuses[Math.floor(Math.random() * stockStatuses.length)],
      });
    }

    this.logger.log(`${this.products.length} mock products generated`);
  }

  async getProducts(query: GetProductsDto): Promise<PaginatedResponseDto> {
    const cacheKey = this.generateCacheKey(query);
    
    // Check cache first
    const cachedResult = this.cacheService.get(cacheKey);
    if (cachedResult) {
      return cachedResult;
    }

    // Apply filters
    let filteredProducts = [...this.products];

    // Filter by category if provided
    if (query.category && query.category.trim() !== '') {
      const categoryLower = query.category.toLowerCase();
      filteredProducts = filteredProducts.filter(
        p => p.category.toLowerCase() === categoryLower
      );
    }

    // Filter by stock status if provided
    if (query.stock_status && query.stock_status.trim() !== '') {
      filteredProducts = filteredProducts.filter(
        p => p.stock_status === query.stock_status
      );
    }

    // Apply pagination
    const page = query.page || 1;
    const limit = query.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    const total = filteredProducts.length;
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponseDto = {
      data: paginatedProducts,
      meta: {
        page: page,
        limit: limit,
        total: total,
        totalPages: totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };

    // Store in cache
    this.cacheService.set(cacheKey, response);

    return response;
  }

  private generateCacheKey(query: GetProductsDto): string {
    const keyParams = {
      page: query.page || 1,
      limit: query.limit || 10,
      category: query.category || '',
      stock_status: query.stock_status || ''
    };
    return JSON.stringify(keyParams);
  }

  async getAllCategories(): Promise<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return categories.sort();
  }

  async getProductsStats(): Promise<any> {
    const totalProducts = this.products.length;
    const categories = await this.getAllCategories();
    const stockStats = {
      in_stock: this.products.filter(p => p.stock_status === StockStatus.IN_STOCK).length,
      low_stock: this.products.filter(p => p.stock_status === StockStatus.LOW_STOCK).length,
      out_of_stock: this.products.filter(p => p.stock_status === StockStatus.OUT_OF_STOCK).length,
    };

    return {
      totalProducts,
      categoriesCount: categories.length,
      categories,
      stockStats,
      cacheStats: this.cacheService.getStats(),
    };
  }
}