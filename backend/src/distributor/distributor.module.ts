import { Module } from "@nestjs/common";
import { DistributorService } from "./distributor.service";
import { DistributorController } from "./distributor.controller";
import { DatabaseModule } from "src/modules/database.module";

@Module({
  imports: [DatabaseModule],
  controllers: [DistributorController],
  providers: [DistributorService],
})
export class DistributorModule {}
