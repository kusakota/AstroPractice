import { z, defineCollection } from "astro:content";
import { glob, file } from 'astro/loaders';

const news = defineCollection({
  loader: glob({ pattern: "**/[^_]*.md", base: "./src/content/news" }),
  schema: z.object({
    title: z.string(),
    publishedDate: z.date(),
    author: z.string(),
    number: z.number(),
  }),
});

const kikaku = defineCollection({
  loader: file("./src/content/kikaku/kikakuList.json"),
  schema: z.object({ // zodでスキーマを定義
    project_id: z.number(),
    name: z.string(),
    genre: z.union([z.literal('展示系'), z.literal('パフォーマンス系'), z.literal('飲食系'), z.literal('学術系')]),
    place: z.string(),
    area: z.string(),
    date: z.string(),
    // ...
  })
});

export const collections = {
  'news': news,
  'kikaku': kikaku,
};