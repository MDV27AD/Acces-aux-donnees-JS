import { Controller, Get, Param, Query } from "@nestjs/common";
import { FindOneParams } from "./params/find-one.params";
import { ProductService } from "./product.service";
import { FindAllQuery } from "./queries/find-all.query";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  findAll(@Query() query: FindAllQuery) {
    return this.productService.findAll(query.limit);
  }

  @Get(":id")
  findOne(@Param() params: FindOneParams) {
    return this.productService.findOne(params.id);
  }
}
