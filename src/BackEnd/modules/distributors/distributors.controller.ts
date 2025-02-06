import { Request, Response, Router } from "express";
import { Connection, RowDataPacket } from "mysql2/promise";
import { sendMessage } from "../../messages";
import distributorsService from "./distributors.service";

export default (conn: Connection) => {
  const router = Router();
  const service = distributorsService(conn);

  router.get("/", findAll);

  async function findAll(req: Request, res: Response) {
    const [distributors, success] = await service.findAll();
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.json(distributors);
  }

  return {
    path: "/distributor",
    router,
  };
};
