import { ConnectionOptions } from "mysql2/promise";

export const getDatabaseConfig = (
  caller: "app" | "seeder"
): ConnectionOptions => {
  const uri =
    caller === "seeder"
      ? process.env.DB_ROOT_USER_URI
      : process.env.DB_CENTRAL_USER_URI;
  if (!uri) throw "Missing db uri";

  return {
    uri,
    namedPlaceholders: true,
  };
};
