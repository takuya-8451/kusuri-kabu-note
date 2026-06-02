import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

// 記事フィード（/rss.xml）。検索流入に依存しない購読導線。
export async function GET(context) {
  const articles = await getCollection('articles');
  const sorted = articles.sort(
    (a, b) => b.data.publishDate.valueOf() - a.data.publishDate.valueOf(),
  );

  return rss({
    title: 'くすりの株ノート',
    description: '医療セクターの配当・優待情報を薬剤師・FP2級・医療法人事務長の視点で集約',
    site: context.site,
    items: sorted.map((a) => ({
      title: a.data.title,
      description: a.data.description,
      pubDate: a.data.publishDate,
      link: `/articles/${a.id}/`,
      categories: [a.data.category],
    })),
    customData: '<language>ja</language>',
  });
}
