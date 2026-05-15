import { Controller, Get, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductsService } from './products.service';
import { GetProductsDto, PaginatedResponseDto } from './dto/get-products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getProducts(@Query() query: GetProductsDto): Promise<PaginatedResponseDto> {
    return this.productsService.getProducts(query);
  }

  @Get('categories')
  async getCategories(): Promise<{ categories: string[] }> {
    const categories = await this.productsService.getAllCategories();
    return { categories };
  }

  @Get('stats')
  async getStats(): Promise<any> {
    return this.productsService.getProductsStats();
  }
}