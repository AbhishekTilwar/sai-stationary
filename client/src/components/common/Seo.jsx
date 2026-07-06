import { Helmet } from 'react-helmet-async';
import { SITE } from '@/config/site';

// Reusable SEO component: dynamic meta tags + JSON-LD structured data.
export default function Seo({ title, description, image, type = 'website', jsonLd }) {
  const fullTitle = title ? `${title} · ${SITE.name}` : `${SITE.name} — Gifts, Stationery & Xerox`;
  const desc =
    description ||
    'Gifts, customized gifts, school & office stationery, art supplies, festival hampers and xerox/printing. Order on WhatsApp with fast local delivery.';
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content={type} />
      <meta property="og:locale" content="en_IN" />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={desc} />
      {image && <meta name="twitter:image" content={image} />}
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  );
}
