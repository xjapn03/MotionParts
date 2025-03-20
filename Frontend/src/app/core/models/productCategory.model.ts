import { Product } from "./product.model";
import { Category } from "./category.model";

export interface ProductCategory {
  id: number;
  product: Product;
  category: Category;
}
