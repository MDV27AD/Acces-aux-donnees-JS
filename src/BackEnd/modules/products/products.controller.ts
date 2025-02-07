import { Request, Response, Router } from "express";
import { Connection } from "mysql2/promise";
import { sendMessage } from "../../messages";
import productsMongo from "./products.mongo";
import productsService from "./products.service";
import { updateProductSchema } from "./schemas/update-product.schema";

export default (conn: Connection) => {
  const router = Router();
  const service = productsService(conn);
  const mongo = productsMongo();

  router.get("/", findAll);
  router.get("/:id", findOne);
  router.delete("/:serialNumber", deleteProduct);
  router.put("/:id", updateProduct);

  async function findAll(req: Request, res: Response) {
    const [products, success] = await service.findAll();
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.json(products);
  }

  async function findOne(req: Request<{ id: string }>, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendMessage(res, "invalidId");
    }

    const [product, success] = await service.findOne(id);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.json(product);
  }

  async function deleteProduct(
    req: Request<{ serialNumber: string }>,
    res: Response
  ) {
    const serialNumber = parseInt(req.params.serialNumber);
    if (isNaN(serialNumber)) {
      return sendMessage(res, "invalidSerial");
    }

    const [deletedProductCategory, dbDeleteSuccess] =
      await service.deleteProduct(serialNumber);
    if (!dbDeleteSuccess) {
      return sendMessage(res, "internalError");
    }

    const mongoDeleteSuccess = await mongo.deleteProduct(
      serialNumber,
      deletedProductCategory
    );
    if (!mongoDeleteSuccess) {
      return sendMessage(res, "internalError");
    }

    res.send();
  }

  async function updateProduct(req: Request<{ id: string }>, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendMessage(res, "invalidId");
    }

    const { data, success: parseSuccess } =
      await updateProductSchema.safeParseAsync(req.body);
    if (!parseSuccess) {
      return sendMessage(res, "badRequest");
    }

    const [_, dbUpdateSuccess] = await service.updateProduct(id, data);
    if (!dbUpdateSuccess) {
      return sendMessage(res, "internalError");
    }

    const [updatedProduct, mongoUpdateSuccess] =
      await mongo.updateProduct(data);
    if (!mongoUpdateSuccess) {
      return sendMessage(res, "internalError");
    }

    res.json(updatedProduct);
  }

  return {
    path: "/product",
    router,
  };
};
