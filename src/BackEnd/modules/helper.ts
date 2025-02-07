import { distributors } from "../distributors";

export const getCategoryDistributor = (category: string) =>
  distributors.find((d) =>
    d.categories.find((c) => c.toLowerCase() === category.toLowerCase().trim())
  );
