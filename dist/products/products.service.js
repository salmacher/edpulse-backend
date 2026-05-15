"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ProductsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const product_entity_1 = require("./entities/product.entity");
const memory_cache_service_1 = require("./cache/memory-cache.service");
let ProductsService = ProductsService_1 = class ProductsService {
    constructor(cacheService) {
        this.cacheService = cacheService;
        this.logger = new common_1.Logger(ProductsService_1.name);
        this.products = [];
        this.generateMockData();
    }
    generateMockData() {
        const categories = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Toys', 'Home', 'Beauty'];
        const stockStatuses = [product_entity_1.StockStatus.IN_STOCK, product_entity_1.StockStatus.LOW_STOCK, product_entity_1.StockStatus.OUT_OF_STOCK];
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
    async getProducts(query) {
        const cacheKey = this.generateCacheKey(query);
        const cachedResult = this.cacheService.get(cacheKey);
        if (cachedResult) {
            return cachedResult;
        }
        let filteredProducts = [...this.products];
        if (query.category && query.category.trim() !== '') {
            const categoryLower = query.category.toLowerCase();
            filteredProducts = filteredProducts.filter(p => p.category.toLowerCase() === categoryLower);
        }
        if (query.stock_status && query.stock_status.trim() !== '') {
            filteredProducts = filteredProducts.filter(p => p.stock_status === query.stock_status);
        }
        const page = query.page || 1;
        const limit = query.limit || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
        const total = filteredProducts.length;
        const totalPages = Math.ceil(total / limit);
        const response = {
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
        this.cacheService.set(cacheKey, response);
        return response;
    }
    generateCacheKey(query) {
        const keyParams = {
            page: query.page || 1,
            limit: query.limit || 10,
            category: query.category || '',
            stock_status: query.stock_status || ''
        };
        return JSON.stringify(keyParams);
    }
    async getAllCategories() {
        const categories = [...new Set(this.products.map(p => p.category))];
        return categories.sort();
    }
    async getProductsStats() {
        const totalProducts = this.products.length;
        const categories = await this.getAllCategories();
        const stockStats = {
            in_stock: this.products.filter(p => p.stock_status === product_entity_1.StockStatus.IN_STOCK).length,
            low_stock: this.products.filter(p => p.stock_status === product_entity_1.StockStatus.LOW_STOCK).length,
            out_of_stock: this.products.filter(p => p.stock_status === product_entity_1.StockStatus.OUT_OF_STOCK).length,
        };
        return {
            totalProducts,
            categoriesCount: categories.length,
            categories,
            stockStats,
            cacheStats: this.cacheService.getStats(),
        };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = ProductsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [memory_cache_service_1.MemoryCacheService])
], ProductsService);
//# sourceMappingURL=products.service.js.map