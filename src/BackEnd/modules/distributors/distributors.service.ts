import { Connection, RowDataPacket } from "mysql2/promise";

interface Distributor {
  name: string;
}

const SELECT_DISTRIBUTOR = `
SELECT name
FROM distributor
`;

export default (conn: Connection) => {
  async function findAll(): Promise<[Distributor[], true] | [null, false]> {
    try {
      const [distributors] =
        await conn.execute<RowDataPacket[]>(SELECT_DISTRIBUTOR);

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
