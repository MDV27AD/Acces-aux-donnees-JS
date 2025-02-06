import * as v from "valibot";

export const UpdateProductSchema = v.object({
  sku: v.pipe(v.string()),
  serialNumber: v.pipe(v.number()),
  name: v.pipe(v.string()),
  description: v.pipe(v.string()),
  price: v.pipe(v.number()),
  status: v.pipe(v.string()),
  category: v.pipe(v.string()),
  supplier: v.pipe(v.string()),
});
