import { Module } from "@nestjs/common";
import { ConnectionOptions, createPool } from "mysql2/promise";

export const MYSQL_CONNECTION = "MYSQL_CONNECTION";

export const getDatabaseConfig = (
  user: "central" | "root"
): ConnectionOptions => {
  const uri =
    user === "root"
      ? process.env.DB_ROOT_USER_URI
      : process.env.DB_CENTRAL_USER_URI;
  if (!uri) throw "Missing db uri";

  return {
    uri,

    namedPlaceholders: true,
  };
};

@Module({
  providers: [
    {
      provide: MYSQL_CONNECTION,
      useFactory: () => createPool(getDatabaseConfig("central")),
    },
  ],
  exports: [MYSQL_CONNECTION],
})
export class DatabaseModule {}
