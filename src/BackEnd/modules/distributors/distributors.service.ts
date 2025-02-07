import { Connection, RowDataPacket } from "mysql2/promise";

interface DatabaseDistributor {
  id: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default (conn: Connection) => {
  async function findAll(): Promise<
    [DatabaseDistributor[], true] | [null, false]
  > {
    try {
      const [[distributors]] = await conn.execute<RowDataPacket[][]>(
        `CALL get_all_distributors()`
      );

      return [distributors as DatabaseDistributor[], true];
    } catch (err) {
      console.error("Error while querrying all distributors:", err);
    }

    return [null, false];
  }

  return {
    findAll,
  };
};
