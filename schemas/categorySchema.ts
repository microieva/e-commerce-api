import { z } from "zod"

export const categorySchema = z.object({
  name: z.string({
    required_error: "Name is required",
  }),
  image: z.string()
    .url({
      message: "Image must be a valid URL if provided",
    })
    .default("https://api.lorem.space/image/fashion?w=640&h=480&r=4278")
})

export const requestSchema = z.object({
  body: categorySchema,
})