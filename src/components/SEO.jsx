import { Helmet } from 'react-helmet-async';

const AGENCY_NAME = 'Ajans Rota';

function buildSchema({ siteUrl, phone, email }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: AGENCY_NAME,
    description: 'İzmir, Urla, Alaçatı, Çeşme ve tüm Ege bölgesinde Google Ads, Meta Reklam, SEO ve sosyal medya yönetimi hizmetleri sunan dijital pazarlama ajansı.',
    url: siteUrl,
    telephone: phone,
    email: email,
    logo: `${siteUrl}/favicon.svg`,
    image: `${siteUrl}/assets/rota-og.png`,
    priceRange: '₺₺₺',
    currenciesAccepted: 'TRY',
    paymentAccepted: 'Banka Transferi, Kredi Kartı',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Kordon Caddesi',
      addressLocality: 'Konak',
      addressRegion: 'İzmir',
      postalCode: '35250',
      addressCountry: 'TR'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '38.4189',
      longitude: '27.1287'
    },
    areaServed: [
      { '@type': 'City', name: 'İzmir' },
      { '@type': 'City', name: 'Urla' },
      { '@type': 'City', name: 'Alaçatı' },
      { '@type': 'City', name: 'Çeşme' },
      { '@type': 'City', name: 'Foça' },
      { '@type': 'City', name: 'Seferihisar' },
      { '@type': 'City', name: 'Karaburun' },
      { '@type': 'City', name: 'Dikili' },
      { '@type': 'City', name: 'Bergama' },
      { '@type': 'City', name: 'Torbalı' },
      { '@type': 'City', name: 'Selçuk' },
      { '@type': 'City', name: 'Kuşadası' },
      { '@type': 'AdministrativeArea', name: 'Ege Bölgesi' }
    ],
    serviceArea: {
      '@type': 'GeoCircle',
      geoMidpoint: {
        '@type': 'GeoCoordinates',
        latitude: '38.4189',
        longitude: '27.1287'
      },
      geoRadius: '150000'
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Dijital Pazarlama Hizmetleri',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Google Ads Yönetimi', description: 'İzmir ve Ege bölgesi için performans odaklı Google Ads kampanya yönetimi' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Meta (Facebook/Instagram) Reklamları', description: 'Hedef kitleye özel Meta reklam stratejileri' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'SEO Hizmetleri', description: 'Yerel ve organik arama motoru optimizasyonu' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sosyal Medya Yönetimi', description: 'Marka kimliği ve içerik yönetimi' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'E-Ticaret Danışmanlığı', description: 'Trendyol, Hepsiburada ve Shopify yönetimi' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Dönüşüm Odaklı Web Tasarım', description: 'Hızlı, mobil uyumlu ve satış odaklı web sitesi tasarımı' } }
      ]
    },
    sameAs: [
      'https://www.instagram.com/ajansrota',
      'https://www.linkedin.com/company/ajansrota'
    ],
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00'
      }
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
      bestRating: '5'
    }
  };
}

export default function SEO({
  title = 'Ajans Rota | İzmir Dijital Pazarlama Ajansı — Google Ads, SEO, Meta Reklam',
  description = "İzmir, Urla, Alaçatı ve Çeşme'de Google Ads, SEO, Meta Reklam ve sosyal medya yönetimi. Ege bölgesinin büyüme odaklı dijital ajansı.",
  canonicalPath = '/',
  type = 'website',
  image = '/assets/rota-og.png',
  noIndex = false,
  schema = null,
  // ── Admin panelinden gelen değerler ──
  phone = '+90-232-000-0000',
  email = 'info@ajansrota.com',
  siteUrl = 'https://ajansrota.com'
}) {
  const canonicalUrl = `${siteUrl}${canonicalPath}`;
  const absImage = image.startsWith('http') ? image : `${siteUrl}${image}`;
  const localBusinessSchema = buildSchema({ siteUrl, phone, email });
  
  // Dinamik Breadcrumb Schema
  const paths = canonicalPath.split('/').filter(p => p);
  const breadcrumbSchema = paths.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Ana Sayfa",
        "item": siteUrl
      },
      ...paths.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 2,
        "name": p.replace(/-/g, ' ').replace(/(^\w{1})|(\s+\w{1})/g, letter => letter.toUpperCase()),
        "item": `${siteUrl}/${paths.slice(0, i+1).join('/')}`
      }))
    ]
  } : null;


  return (
    <Helmet>
      {/* ── Temel ── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content="izmir dijital ajans, google ads ajansı izmir, seo ajansı izmir, sosyal medya ajansı izmir, urla dijital pazarlama, alaçatı reklam ajansı, çeşme google ads, ege bölgesi dijital ajans, meta reklam izmir, e-ticaret danışmanlığı izmir, izmir reklam ajansı, foça dijital pazarlama, seferihisar reklam, dikili google ads" />
      <meta name="robots" content={noIndex ? 'noindex,nofollow' : 'index,follow,max-snippet:-1,max-image-preview:large'} />
      <link rel="canonical" href={canonicalUrl} />

      {/* ── Geo (Yerel SEO) ── */}
      <meta name="geo.region" content="TR-35" />
      <meta name="geo.placename" content="İzmir, Türkiye" />
      <meta name="geo.position" content="38.4189;27.1287" />
      <meta name="ICBM" content="38.4189, 27.1287" />

      {/* ── Open Graph ── */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={AGENCY_NAME} />
      <meta property="og:locale" content="tr_TR" />

      {/* ── Twitter Card ── */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={absImage} />
      <meta name="twitter:site" content="@ajansrota" />

      {/* ── LocalBusiness JSON-LD Schema ── */}
      <script type="application/ld+json">
        {JSON.stringify(localBusinessSchema)}
      </script>

      {/* ── Breadcrumb Schema ── */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* ── Sayfa özel schema (opsiyonel) ── */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      )}
    </Helmet>
  );
}
