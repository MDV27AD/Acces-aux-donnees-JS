import { Type } from "class-transformer";
import { IsNumber } from "class-validator";

export class DeleteParams {
  @IsNumber()
  @Type(() => Number)
  id: number;
}
