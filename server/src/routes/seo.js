import { Router } from 'express';

const router = Router();
const BASE = process.env.SITE_URL || 'https://saistationary.com';

// robots.txt
router.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send(
    `User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /account\nDisallow: /checkout\n\nSitemap: ${BASE}/sitemap.xml\n`
  );
});

// Dynamic sitemap. In production, enumerate product slugs from Firestore.
router.get('/sitemap.xml', async (_req, res) => {
  const staticPaths = ['/', '/products', '/corporate-enquiry'];
  // TODO: const products = await db().collection('products').get();
  const productPaths = []; // products.docs.map(d => `/product/${d.data().slug}`)
  const urls = [...staticPaths, ...productPaths]
    .map((p) => `  <url><loc>${BASE}${p}</loc><changefreq>weekly</changefreq></url>`)
    .join('\n');
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`
  );
});

export default router;
