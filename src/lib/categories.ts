// カテゴリ名 → URLスラッグ（ローマ字）の対応表。
// content.config.ts の category enum と一致させること。
export const CATEGORY_SLUGS = {
  '配当比較': 'haitou-hikaku',
  '優待比較': 'yutai-hikaku',
  '用語解説': 'yougo-kaisetsu',
  '銘柄概要': 'meigara-gaiyou',
  'マクロ解説': 'macro-kaisetsu',
  '制度解説': 'seido-kaisetsu',
} as const;

export type Category = keyof typeof CATEGORY_SLUGS;

// 表示順（一覧・トップの導線で使う安定した並び）
export const CATEGORY_ORDER: Category[] = [
  '銘柄概要',
  '配当比較',
  '優待比較',
  '制度解説',
  'マクロ解説',
  '用語解説',
];

export const categorySlug = (c: string): string =>
  (CATEGORY_SLUGS as Record<string, string>)[c] ?? c;

export const SLUG_TO_CATEGORY: Record<string, Category> = Object.fromEntries(
  Object.entries(CATEGORY_SLUGS).map(([name, slug]) => [slug, name as Category]),
) as Record<string, Category>;

export const categoryHref = (c: string): string => `/articles/category/${categorySlug(c)}/`;
