import { Controller, Get, Param } from "@nestjs/common";
import { DistributorService } from "./distributor.service";
import { FindOneParams } from "./params/find-one.params";

@Controller("distributor")
export class DistributorController {
    constructor(private readonly distributorService: DistributorService) {}

    @Get(":id")
    async findOne(@Param() params: FindOneParams) {
        return this.distributorService.findOne(params.id);
    }
}