import { Module } from "@nestjs/common";
import { ConnectionOptions, createPool } from "mysql2/promise";

export const MYSQL_CONNECTION = "MYSQL_CONNECTION";

export const getDatabaseConfig = (): ConnectionOptions => {
    const dbUri = process.env.DB_URI;
    if (!dbUri) throw "Missing DB_URI";

    return {
        uri: dbUri,
        namedPlaceholders: true,
    };
};

@Module({
    providers: [
        {
            provide: MYSQL_CONNECTION,
            useFactory: () => createPool(getDatabaseConfig()),
        },
    ],
    exports: [MYSQL_CONNECTION],
})
export class DatabaseModule {}