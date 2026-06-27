const fs = require('fs');
let c = fs.readFileSync('src/components/ClientTransparencyPageView.jsx', 'utf8');

// 1. Fix dark mode colors
c = c.replace(/backgroundColor:\s*['"]#fff['"]/g, "backgroundColor: '#1e293b'");
c = c.replace(/background:\s*['"]#fff['"]/g, "background: '#1e293b'");
c = c.replace(/color:\s*['"]var\(--text-dark\)['"]/g, "color: '#f8fafc'");
c = c.replace(/color:\s*['"]var\(--text-light\)['"]/g, "color: '#94a3b8'");
c = c.replace(/color:\s*['"]var\(--text-muted\)['"]/g, "color: '#64748b'");
c = c.replace(/background:\s*['"]#f8fafc['"]/g, "background: 'rgba(255,255,255,0.05)'");
c = c.replace(/background:\s*['"]#f1f5f9['"]/g, "background: 'rgba(255,255,255,0.02)'");

// 2. Add Meta Ads and SEO sections right after Google Ads
const googleAdsEnd = `                    </table>
                  </div>
                </div>`;
                
const extraSections = `
                {/* Meta Ads Section */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(236, 72, 153, 0.1)', color: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-brands fa-meta" style={{ fontSize: '1rem' }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>Meta Ads Performansı</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Kampanya Adı</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Harcama</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>Tıklama</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>{activeBrand === 'ecommerce' ? 'ROAS' : 'CPL'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.metaAds.map((camp, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{camp.name}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#94a3b8' }}>{camp.spend}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>{camp.clicks}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#16a34a', textAlign: 'right' }}>{camp.roas}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* SEO Section */}
                <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(15, 23, 42, 0.06)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <i className="fa-solid fa-magnifying-glass" style={{ fontSize: '1rem' }}></i>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>SEO Kelime Sıralamaları</h3>
                  </div>
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Anahtar Kelime</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700 }}>Sıra</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'center' }}>Aylık Hacim</th>
                          <th style={{ padding: '0.75rem 0.5rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textAlign: 'right' }}>Trend</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.seo.map((item, idx) => (
                          <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.03)' }}>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{item.keyword}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', fontWeight: 700, color: '#0ea5e9' }}>{item.rank}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>{item.volume}</td>
                            <td style={{ padding: '0.9rem 0.5rem', fontSize: '0.8rem', textAlign: 'right', color: item.trend === 'up' ? '#16a34a' : '#94a3b8' }}>
                              <i className={\`fa-solid fa-arrow-\${item.trend === 'up' ? 'trend-up' : 'right'}\`}></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
`;

c = c.replace(googleAdsEnd, googleAdsEnd + "\n" + extraSections);

fs.writeFileSync('src/components/ClientTransparencyPageView.jsx', c);
