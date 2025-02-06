import { Connection, RowDataPacket } from "mysql2/promise";

interface Category {
  name: string;
}

export default (conn: Connection) => {
  async function findAll(): Promise<[Category[], true] | [null, false]> {
    try {
      const [[categories]] = await conn.execute<RowDataPacket[][]>(
        `CALL get_all_categories()`
      );

      return [categories as Category[], true];
    } catch (err) {
      console.error("Error while querrying all categories:", err);
    }

    return [null, false];
  }

  return {
    findAll,
  };
};
