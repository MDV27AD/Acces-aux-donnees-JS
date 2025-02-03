import { Module } from "@nestjs/common";
import { createPool } from "mysql2/promise";

export const MYSQL_CONNECTION = "MYSQL_CONNECTION";

@Module({
  providers: [
    {
      provide: MYSQL_CONNECTION,
      useFactory: () => {
        const dbUri = process.env.DB_URI;
        if (!dbUri) throw "Missing DB_URI";

        return createPool(dbUri);
      },
    },
  ],
  exports: [MYSQL_CONNECTION],
})
export class DatabaseModule {}
