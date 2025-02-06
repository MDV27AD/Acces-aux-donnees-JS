import { Connection, RowDataPacket } from "mysql2/promise";

interface Distributor {
  name: string;
}

export default (conn: Connection) => {
  async function findAll(): Promise<[Distributor[], true] | [null, false]> {
    try {
      const [[distributors]] = await conn.execute<RowDataPacket[][]>(
        `CALL get_all_distributors()`
      );

      return [distributors as Distributor[], true];
    } catch (err) {
      console.error("Error while querrying all distributors:", err);
    }

    return [null, false];
  }

  return {
    findAll,
  };
};
