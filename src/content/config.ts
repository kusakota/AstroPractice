import { number } from "astro/zod";
import { z, defineCollection } from "astro:content";

const news = defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      publishedDate: z.date(),
      author: z.string(),
      number: z.number(),
    }),
  });

  export const collections = {
    news: news,
  };