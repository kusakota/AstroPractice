import { z, defineCollection } from "astro:content";

const news = defineCollection({
    type: "content",
    schema: z.object({
      title: z.string(),
      publishedDate: z.date(),
      author: z.string(),
    }),
  });

  export const collections = {
    news: news,
  };