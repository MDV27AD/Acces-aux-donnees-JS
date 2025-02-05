import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ProductModule } from "./product/product.module";
import { DistributorModule } from "src/distributor/distributor.module";
import { DatabaseModule } from "./database.module";

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, DistributorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
