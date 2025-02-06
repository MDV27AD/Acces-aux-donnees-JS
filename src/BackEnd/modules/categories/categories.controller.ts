import { Request, Response, Router } from "express";
import { Connection, RowDataPacket } from "mysql2/promise";
import { sendMessage } from "../../messages";
import categoriesService from "./categories.service";

export default (conn: Connection) => {
  const router = Router();
  const service = categoriesService(conn);

  router.get("/", findAll);

  async function findAll(req: Request, res: Response) {
    const [categories, success] = await service.findAll();
    if (!success) {
      return sendMessage(res, "internalError");
    }

    const names = categories!.map((c) => c.name);
    res.json(names);
  }

  return {
    path: "/category",
    router,
  };
};
