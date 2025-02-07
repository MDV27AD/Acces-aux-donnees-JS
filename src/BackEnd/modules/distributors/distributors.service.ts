import { Connection, RowDataPacket } from "mysql2/promise";
import { ResultPromise } from "../types";

interface DatabaseDistributor {
  id: string;
  name: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export default (conn: Connection) => {
  async function findAll(): ResultPromise<DatabaseDistributor[]> {
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

  async function toggleStatus(id: number): ResultPromise<string> {
    try {
      const [[[{ status: updatedStatus }]]] = await conn.execute<
        RowDataPacket[][]
      >(`CALL toggle_distributor_status(:id)`, { id });

      return [updatedStatus as string, true];
    } catch (err) {
      console.error(
        `Error while toggling distributor's status with id "${id}":`,
        err
      );
    }

    return [null, false];
  }

  return {
    findAll,
    toggleStatus,
  };
};
