import { Helmet } from 'react-helmet-async';
import { SITE } from '@/config/site';

// Reusable SEO component: dynamic meta tags + JSON-LD structured data.
export default function Seo({ title, description, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — Premium Gifts & Stationery`;
  const desc = description || 'Premium gifts, customized gifts, school & office stationery, art supplies and festival hampers.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
