import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort((a, b) => +b.data.date - +a.data.date);
  return rss({
    title: 'lycoris // wired',
    description: 'Embedded systems, reverse engineering, and writeups.',
    site: context.site,
    items: posts.map((p) => ({ title: p.data.title, pubDate: p.data.date, description: p.data.description ?? '', link: `${base}/blog/${p.id}/` })),
  });
}
