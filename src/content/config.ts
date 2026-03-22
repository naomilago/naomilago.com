import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    excerpt: z.string(),
    lang: z.enum(['en', 'pt']).default('en'),
    readTime: z.string(),
  }),
});

export const collections = { blog };
