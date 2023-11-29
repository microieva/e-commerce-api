import { z } from "zod";
import { categorySchema } from "../schemas/categorySchema";

export type CategoryDTO = z.infer<typeof categorySchema>;

export type Category = CategoryDTO & { id: string }
export type CreateCategoryInput = CategoryDTO
