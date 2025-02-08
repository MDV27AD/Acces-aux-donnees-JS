import { Connection, RowDataPacket } from "mysql2/promise";
import { ResultPromise } from "../types";

interface DatabaseCategory {
  id: string;
  name: string;
  created_at: string;
}

export default (conn: Connection) => {
  async function findAll(): ResultPromise<DatabaseCategory[]> {
    try {
      const [[categories]] = await conn.execute<RowDataPacket[][]>(
        `CALL get_all_categories()`
      );

      return [categories as DatabaseCategory[], true];
    } catch (err) {
      console.error("Error while querrying all categories:", err);
    }

    return [null, false];
  }

  return {
    findAll,
  };
};
