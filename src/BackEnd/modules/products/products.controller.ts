import { Request, Response, Router } from "express";
import { Connection } from "mysql2/promise";
import { DISTRIBUTORS } from "../../constants";
import { sendMessage } from "../../messages";
import { getCategoryDistributor } from "../helper";
import productsService from "./products.service";
import {
  UpdateProductData,
  updateProductSchema,
} from "./schemas/update-product.schema";

export default (conn: Connection) => {
  const router = Router();
  const service = productsService(conn);

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

    const [deletedProductCategory, success] =
      await service.deleteProduct(serialNumber);
    if (!success) {
      return sendMessage(res, "internalError");
    }

    const mongoDeleteSuccess = await deleteMongoProduct(
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

    const { data, success } = await updateProductSchema.safeParseAsync(
      req.body
    );
    if (!success) {
      return sendMessage(res, "badRequest");
    }

    const [_, updateSuccess] = await service.updateProduct(id, data);
    if (!updateSuccess) {
      return sendMessage(res, "internalError");
    }

    const [updatedProduct, mongoUpdateSuccess] = await updateMongoProduct(data);
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

async function updateMongoProduct(
  data: UpdateProductData
): Promise<[object, true] | [null, false]> {
  const productDistributor = DISTRIBUTORS.find((d) =>
    d.categories.find(
      (c) => c.toLowerCase() === data.category.toLowerCase().trim()
    )
  );
  if (!productDistributor) {
    return [null, false];
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
    return [null, false];
  }

  try {
    const data = await mongoRes.json();
    return [data.product, true];
  } catch (err) {
    console.error("Error while parsing mongo's update response:", err);
  }

  return [null, false];
}

async function deleteMongoProduct(
  serialNumber: number,
  category: string
): Promise<boolean> {
  const productDistributor = getCategoryDistributor(category);
  if (!productDistributor) {
    return false;
  }

  const mongoRes = await fetch(
    `${productDistributor?.mongoUrl}/${serialNumber}`,
    {
      method: "DELETE",
    }
  );
  if (!mongoRes.ok) {
    console.error("Error while deleting product from mongo:", mongoRes);
    return false;
  }

  return true;
}
