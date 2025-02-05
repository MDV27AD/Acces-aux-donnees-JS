import { Type } from "class-transformer";
import { IsNumber, IsOptional, Max } from "class-validator";

export class FindAllQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit: number = 0;
}
