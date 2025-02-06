import { z } from "zod";

export const updateProductSchema = z.object({
  sku: z.string(),
  serial_number: z.number(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  status: z.enum(["available", "out_of_stock"]),
  category: z.string(),
  supplier: z.string(),
});

export type UpdateProductData = z.infer<typeof updateProductSchema>;
