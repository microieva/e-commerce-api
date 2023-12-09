import { z } from "zod";
import { productSchema } from '../schemas/productSchema'

export interface ProductDTO extends z.infer<typeof productSchema> {};
export interface Product extends ProductDTO { id: string };
export type ProductToCreate = Omit<ProductDTO, "category"> & {
  categoryId?: string;
};