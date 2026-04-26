import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updateDate: z.coerce.date().optional(),
    category: z.enum(['配当比較', '優待比較', '用語解説', '銘柄概要', 'マクロ解説']),
    relatedStocks: z.array(z.string()).optional(),
  }),
});

const stocks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stocks' }),
  schema: z.object({
    ticker: z.string(),
    name: z.string(),
    market: z.string(),
    sector: z.string(),
    dividendYield: z.number().optional(),
    recordMonths: z.array(z.number().min(1).max(12)).optional(),
    consecutiveDividendYears: z.number().min(0).optional(),
    irUrl: z.string().url(),
    description: z.string().optional(),
    publishDate: z.coerce.date(),
  }),
});

export const collections = { articles, stocks };
