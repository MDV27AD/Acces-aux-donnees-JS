import { Request, Response, Router } from "express";
import { Connection } from "mysql2/promise";
import { sendMessage } from "../../messages";
import productsService from "./products.service";
import {
  UpdateProductData,
  updateProductSchema,
} from "./schemas/update-product.schema";
import { distributors } from "../../distributors";

export default (conn: Connection) => {
  const router = Router();
  const service = productsService(conn);

  router.get("/", findAll);
  router.get("/:id", findOne);
  router.delete("/:id", deleteProduct);
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

    const [_, success] = await service.deleteProduct(serialNumber);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    res.send();
  }

  async function updateProduct(req: Request<{ id: string }>, res: Response) {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return sendMessage(res, "invalidId");
    }

    const { data, success } = await updateProductSchema.safeParseAsync(
      req.body
    );
    if (!success) {
      return sendMessage(res, "badRequest");
    }

    const mongoUpdateSuccess = await updateMongoProduct(data);
    if (!mongoUpdateSuccess) {
      return sendMessage(res, "internalError");
    }

    const [_, updateSuccess] = await service.updateProduct(id, data);
    if (!updateSuccess) {
      return sendMessage(res, "internalError");
    }

    res.send();
  }

  return {
    path: "/product",
    router,
  };
};

async function updateMongoProduct(data: UpdateProductData) {
  const productDistributor = distributors.find((d) =>
    d.categories.find(
      (c) => c.toLowerCase() === data.category.toLowerCase().trim()
    )
  );
  if (!productDistributor) {
    return false;
  }

  const mongoRes = await fetch(productDistributor?.mongoUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...data,
      update: true,
    }),
  });
  if (!mongoRes.ok) {
    console.error("Error while posting updated product to mongo:", mongoRes);
    return false;
  }

  return true;
}
