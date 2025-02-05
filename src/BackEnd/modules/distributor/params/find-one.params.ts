import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class FindOneParams {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
