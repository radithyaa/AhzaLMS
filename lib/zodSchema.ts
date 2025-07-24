import {z} from "zod";
import extractTextFromJson from "./extractTextFromJson";

export const courseLevels = ["Beginner", "Intermediate", "Advanced"] as const
export const courseStatus = ["Draft", "Published", "Advanced"] as const
export const courseCategories = [
    "Development",
    "Business",
    "Finance",
    "IT & Software",
    "Office Productivity",
    "Personal Development",
    "Design",
    "Marketing",
    "Health & Fitness",
    "Music",
    "Teaching & Academics"
] as const

export const courseSchema = z.object({
    title: z.string().min(3, {error: "Title must be at least 3 characters long"}).max(100, {error: "Title must be at most 100 characters long"}),
    fileKey: z.string().min(1, {error: "File is required"}),
    price: z.coerce.number().min(1, {error: "Price must be a positive number"}) as z.ZodNumber,
    duration: z.coerce.number().min(1, {error: "Duration must be at least 1 hour"}).max(500, {error: "Duration must be at most 500 hours"}) as z.ZodNumber,
    level: z.enum(courseLevels, {error: "Levels is required"}),
    category: z.enum(courseCategories, {error: "Category is required"}),
    smallDescription: z.string().min(3, {error: "Small Description must be at least 3 characters long"}).max(200, {error: "Small Description must be at most 100 characters long"}),
    status: z.enum(courseStatus,{error: "Status is required "}),
    description: z.string().refine((value) => {
    try {
    // Function validation json from description field
      const parsed = JSON.parse(value);
      const plain = extractTextFromJson(parsed);
      return plain.trim().length >= 50;
    } catch (e) {
      return e;
    }
    }, {
        error: "Description must be at least 50 characters long",
    }),

    // Don't include the validate of the slug because this will auto generated in server
    // slug:z.string().min(3, {error: "Slug must be at least 3 characters long"}),
    });

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, {error: "File name is requires"}),
  contentType: z.string().min(1, {error: "Content type is requires"}),
  size: z.number().min(1, {error: "Content type is requires"}),
  isImage: z.boolean(),
})

