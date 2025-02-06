import { ConnectionOptions, createPool } from "mysql2/promise";

export const getDatabaseConfig = (
  caller: "app" | "seeder"
): ConnectionOptions => {
  const uri =
    caller === "seeder"
      ? process.env.DB_ROOT_USER_URI
      : process.env.DB_CENTRAL_USER_URI;
  if (!uri) throw "Missing db uri";

  console.log(`Got database config for caller: ${caller}`);

  return {
    uri,
    namedPlaceholders: true,
  };
};

export const pool = createPool(getDatabaseConfig("app"));
