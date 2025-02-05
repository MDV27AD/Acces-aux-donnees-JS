import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { DistributorModule } from "./distributor/distributor.module";
import { ProductModule } from "./product/product.module";

@Module({
  imports: [ConfigModule.forRoot(), ProductModule, DistributorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
