const fs = require('fs');

let c = fs.readFileSync('src/components/SEO.jsx', 'utf8');

const newCode = `  const canonicalUrl = \`\${siteUrl}\${canonicalPath}\`;
  const absImage = image.startsWith('http') ? image : \`\${siteUrl}\${image}\`;
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
        "name": p.replace(/-/g, ' ').replace(/(^\\w{1})|(\\s+\\w{1})/g, letter => letter.toUpperCase()),
        "item": \`\${siteUrl}/\${paths.slice(0, i+1).join('/')}\`
      }))
    ]
  } : null;
`;

c = c.replace(
  `  const canonicalUrl = \`\${siteUrl}\${canonicalPath}\`;
  const absImage = image.startsWith('http') ? image : \`\${siteUrl}\${image}\`;
  const localBusinessSchema = buildSchema({ siteUrl, phone, email });`,
  newCode
);

c = c.replace(
  `      {/* ── Sayfa özel schema (opsiyonel) ── */}`,
  `      {/* ── Breadcrumb Schema ── */}
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}

      {/* ── Sayfa özel schema (opsiyonel) ── */}`
);

fs.writeFileSync('src/components/SEO.jsx', c);
