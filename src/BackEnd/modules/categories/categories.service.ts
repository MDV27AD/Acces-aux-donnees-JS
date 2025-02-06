import { Connection, RowDataPacket } from "mysql2/promise";

interface Category {
  name: string;
}

const SELECT_CATEGORY = `
SELECT name
FROM category
`;

export default (conn: Connection) => {
  async function findAll(): Promise<[Category[], true] | [null, false]> {
    try {
      const [categories] = await conn.execute<RowDataPacket[]>(SELECT_CATEGORY);

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
