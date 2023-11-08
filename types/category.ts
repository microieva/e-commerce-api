/*export type Category = {
  id: number;
  name: string;
  description: string;
};*/

import { z } from "zod";
import { categorySchema } from "../schemas/categorySchema.js";

export type CategoryDTO = z.infer<typeof categorySchema>
export type Category = CategoryDTO & {id: number}