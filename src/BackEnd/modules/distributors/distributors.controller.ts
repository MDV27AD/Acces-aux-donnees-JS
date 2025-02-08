import { Request, Response, Router } from "express";
import { Connection } from "mysql2/promise";
import { sendMessage } from "../../messages";
import distributorsService from "./distributors.service";

export default (conn: Connection) => {
  const router = Router();
  const service = distributorsService(conn);

  router.get("/", findAll);
  router.get("/:id/toggle-status", toggleStatus);

  const storesIdMap:any = {'GameEZ' : 1, 'GamEZ' : 1, 'MEDIDONC' : 2, 'SPORT SALUT' : 3};

  async function findAll(req: Request, res: Response) {
    const [distributors, success] = await service.findAll();
    if (!success) {
      return sendMessage(res, "internalError");
    }

    const formattedDistributors = distributors.map((d) => ({
      id: d.id,
      name: d.name,
      status: d.status,
      store: `store${storesIdMap[d.name]}`,
    }));
    res.json(formattedDistributors);
  }

  async function toggleStatus(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendMessage(res, "invalidId");
    }

    const [updatedStatus, success] = await service.toggleStatus(id);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.json(updatedStatus);
  }

  return {
    path: "/distributor",
    router,
  };
};
