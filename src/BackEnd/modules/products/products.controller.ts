import { Request, Response, Router } from "express";
import { Connection, RowDataPacket } from "mysql2/promise";
import { sendMessage } from "../../messages";
import productsService from "./products.service";

export default (conn: Connection) => {
  const router = Router();
  const service = productsService(conn);

  router.get("/", findAll);
  router.get("/:id", findOne);

  async function findAll(req: Request, res: Response) {
    let limit: number = 0;
    if (req.query["limit"]) {
      limit = parseInt(req.query["limit"].toString());
    }

    if (isNaN(limit)) {
      return sendMessage(res, "badRequest");
    }

    const [products, success] = await service.findAll(limit);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.json(products);
  }

  async function findOne(req: Request<{ id: string }>, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json("Invalid id param");
    }

    const [product, success] = await service.findOne(id);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.json(product);
  }

  return {
    path: "/product",
    router,
  };
};
