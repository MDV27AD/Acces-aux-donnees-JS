import { Controller, Get, Param } from "@nestjs/common";
import { FindOneParams } from "./params/find-one.params";
import { ProductService } from "./product.service";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll() {
    return this.productService.findAll();
  }

  @Get(":id")
  findOne(@Param() params: FindOneParams) {
    return this.productService.findOne(params.id);
  }
}
