import { UpdateProductData } from "./schemas/update-product.schema";
import { getCategoryDistributor } from "../helper";
import { DISTRIBUTORS } from "../../constants";

export default () => {
  async function updateProduct(
    data: UpdateProductData
  ): Promise<[object, true] | [null, false]> {
    const distributor = DISTRIBUTORS.find((d) =>
      d.categories.find(
        (c) => c.toLowerCase() === data.category.toLowerCase().trim()
      )
    );
    if (!distributor) {
      return [null, false];
    }

    const res = await fetch(distributor.mongoUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...data,
        update: true,
      }),
    });
    if (!res.ok) {
      console.error("Error while posting updated product to mongo:", res);
      return [null, false];
    }

    try {
      const data = await res.json();
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

    const res = await fetch(`${productDistributor?.mongoUrl}/${serialNumber}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      console.error("Error while deleting product from mongo:", res);
      return false;
    }

    return true;
  }

  return {
    updateProduct,
    deleteProduct,
  };
};
