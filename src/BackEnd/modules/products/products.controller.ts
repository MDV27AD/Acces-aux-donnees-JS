import { Request, Response, Router } from "express";
import { Connection } from "mysql2/promise";
import { sendMessage } from "../../messages";
import productsService from "./products.service";
import * as v from "valibot";

export default (conn: Connection) => {
  const router = Router();
  const service = productsService(conn);

  router.get("/", findAll);
  router.get("/:id", findOne);
  router.delete("/:id", deleteProduct);
  router.put("/:id", updateProduct);

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

  async function deleteProduct(req: Request<{ id: string }>, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      res.status(400).json("Invalid id param");
    }

    const [_, success] = await service.deleteProduct(id);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.send();
  }

  async function updateProduct(req: Request<{ id: string }>, res: Response) {
    const id = v.safeParse(v.number(), req.params.id);
  }

  return {
    path: "/product",
    router,
  };
};
