import { Connection } from "mysql2/promise";
import { UpdateProductData } from "./schemas/update-product.schema";
import { getCategoryDistributor } from "../helper";
import { DISTRIBUTORS } from "../../constants";

export default () => {
  async function updateProduct(
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

  async function deleteProduct(
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

  return {
    updateProduct,
    deleteProduct,
  };
};
