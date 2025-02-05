import { Controller, Delete, Get, Param, Query } from "@nestjs/common";
import { FindOneParams } from "./params/find-one.params";
import { ProductService } from "./product.service";
import { FindAllQuery } from "./queries/find-all.query";
import { DeleteParams } from "./params/delete.params";

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

  @Delete(":id")
  delete(@Param() params: DeleteParams) {
    return this.productService.delete(params.id);
  }
}
