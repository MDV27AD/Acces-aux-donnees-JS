import { DISTRIBUTORS } from "../constants";

export const getCategoryDistributor = (category: string) =>
  DISTRIBUTORS.find((d) =>
    d.categories.find((c) => c.toLowerCase() === category.toLowerCase().trim())
  );
