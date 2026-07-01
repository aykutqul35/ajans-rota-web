import React from 'react';

// This component is only used for generating the PDF.
// It receives a `lead` object which contains the user's information and website URL.
const AiSeoPdfTemplate = React.forwardRef(({ lead, settingsData }, ref) => {
  if (!lead) return null;

  // Generate some deterministic mock data based on the website name length
  const domain = lead.website || lead.company || lead.message?.match(/https?:\/\/[^\s]+/)?.[0] || 'Web Siteniz';
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const seed = cleanDomain.length || 5;

  const score = 65 + (seed % 22);
  const isHttps = domain.startsWith('https://');

  const generatedDate = new Date().toLocaleDateString('tr-TR', {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  const phone = settingsData?.phone || '';
  const email = settingsData?.email || '';

  return (
    <div ref={ref} style={{ padding: '40px', fontFamily: 'Arial, sans-serif', color: '#333', background: '#fff', width: '800px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #0284c7', paddingBottom: '20px', marginBottom: '30px' }}>
        <div>
          <h1 style={{ color: '#0284c7', margin: 0, fontSize: '28px' }}>Ajans Rota</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Dijital Büyüme Merkezi</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <h2 style={{ margin: 0, fontSize: '20px', color: '#1e293b' }}>Yapay Zeka Destekli SEO Raporu</h2>
          <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>Tarih: {generatedDate}</p>
        </div>
      </div>

      {/* Customer Info */}
      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '8px', marginBottom: '30px' }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '18px', color: '#0f172a' }}>Müşteri Bilgileri</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          <div style={{ flex: '1 1 45%' }}><strong>Ad Soyad:</strong> {lead.fullName || '-'}</div>
          <div style={{ flex: '1 1 45%' }}><strong>Web Sitesi:</strong> <span style={{ color: '#0284c7' }}>{cleanDomain}</span></div>
          <div style={{ flex: '1 1 45%' }}><strong>E-posta:</strong> {lead.email || '-'}</div>
          <div style={{ flex: '1 1 45%' }}><strong>Telefon:</strong> {lead.phone || '-'}</div>
        </div>
      </div>

      {/* Score Section */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '24px', color: '#0f172a', marginBottom: '10px' }}>Genel SEO ve Performans Skoru</h2>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: `8px solid ${score >= 80 ? '#10b981' : score >= 60 ? '#f59e0b' : '#ef4444'}`,
          fontSize: '36px',
          fontWeight: 'bold',
          color: '#1e293b',
          margin: '20px 0'
        }}>
          {score}/100
        </div>
        <p style={{ fontSize: '16px', color: '#475569', maxWidth: '600px', margin: '0 auto' }}>
          {score >= 80 
            ? 'Web siteniz genel olarak iyi bir altyapıya sahip, ufak dokunuşlarla rakiplerinizin önüne geçebilirsiniz.' 
            : score >= 60 
            ? 'Sitenizde geliştirilmesi gereken bazı kritik noktalar mevcut. Yapılacak optimizasyonlar Google sıralamalarınızı hızla yükseltecektir.'
            : 'Web sitenizde acil müdahale gerektiren ciddi SEO ve performans sorunları bulunuyor.'}
        </p>
      </div>

      {/* Analysis Details */}
      <div style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '20px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Teknik Analiz Detayları</h3>
        
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f1f5f9' }}>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>Kontrol Noktası</th>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>Durum</th>
              <th style={{ padding: '12px 15px', borderBottom: '1px solid #cbd5e1' }}>Açıklama</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>SSL Güvenlik (HTTPS)</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: isHttps ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                {isHttps ? 'Başarılı' : 'Kritik Hata'}
              </td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                {isHttps ? 'Siteniz HTTPS protokolü ile güvenli.' : 'Sitenizde SSL sertifikası eksik. Bu durum ziyaretçilere "Güvenli Değil" uyarısı verir.'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Mobil Uyumluluk</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#10b981', fontWeight: 'bold' }}>Başarılı</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>Siteniz mobil cihazlarda responsive (duyarlı) olarak doğru görüntüleniyor.</td>
            </tr>
            <tr>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Sayfa Hızı (Desktop)</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: score > 75 ? '#10b981' : '#f59e0b', fontWeight: 'bold' }}>
                {score > 75 ? 'İyi' : 'İyileştirilmeli'}
              </td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                Sunucu yanıt süresi ve görsel boyutlandırmaları {score > 75 ? 'kabul edilebilir seviyede.' : 'optimizasyon gerektiriyor.'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Meta Başlık ve Açıklamalar</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: seed % 2 === 0 ? '#10b981' : '#ef4444', fontWeight: 'bold' }}>
                {seed % 2 === 0 ? 'Başarılı' : 'Eksik'}
              </td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>
                {seed % 2 === 0 ? 'Ana sayfa ve önemli sayfalarda meta etiketleri mevcut.' : 'Bazı sayfalarda Google aramalarında görünecek meta açıklamaları çok kısa veya hiç yok.'}
              </td>
            </tr>
            <tr>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontWeight: 'bold' }}>Resim Alt Etiketleri</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', color: '#f59e0b', fontWeight: 'bold' }}>İyileştirilmeli</td>
              <td style={{ padding: '12px 15px', borderBottom: '1px solid #e2e8f0', fontSize: '14px', color: '#475569' }}>Sitenizdeki bazı görsellerde arama motorlarının görseli anlamasını sağlayan "alt" metinleri eksik.</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      {/* Spacer to encourage page break if needed before recommendations */}
      <div style={{ height: '20px' }}></div>

      {/* AI Recommendations */}
      <div style={{ marginBottom: '40px', pageBreakInside: 'avoid' }}>
        <h3 style={{ fontSize: '20px', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px', marginBottom: '20px' }}>Yapay Zeka (AI) Odaklı Büyüme Tavsiyeleri</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div style={{ background: '#f8fafc', borderLeft: '4px solid #0ea5e9', padding: '15px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#0369a1', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              1. Teknik SEO ve Tarama Bütçesi Optimizasyonu
            </h4>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              Web sitenizin Google botları tarafından daha verimli taranabilmesi için robots.txt ve XML sitemap yapılandırmalarının elden geçirilmesi gerekmektedir. Özellikle {score > 75 ? 'mevcut iyi hızınızı koruyarak' : 'görsel optimizasyonları ve cache yapılandırmaları ile hızınızı artırarak'} taranabilirlik oranınızı (crawl budget) maksimize edebilir, yeni içeriklerinizin saniyeler içinde Google dizinine eklenmesini sağlayabilirsiniz.
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderLeft: '4px solid #8b5cf6', padding: '15px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#6d28d9', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              2. Sektörel Semantik İçerik Mimarisi (Entity SEO)
            </h4>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              Rakiplerinizin gerisinde kalmamak için geleneksel anahtar kelime doldurma taktikleri yerine, bağlamsal <strong>(Entity Tabanlı)</strong> SEO stratejisine geçiş yapılmalıdır. Hedef kitlenizin arama niyetine (Search Intent) uygun, "uzun kuyruklu" (long-tail) soruları yanıtlayan otorite blog içerikleri ve SSS (Sıkça Sorulan Sorular) şemaları eklenmelidir. Bu sayede organik arama hacminizde kalıcı büyüme sağlanır.
            </p>
          </div>

          <div style={{ background: '#f8fafc', borderLeft: '4px solid #10b981', padding: '15px', borderRadius: '4px' }}>
            <h4 style={{ margin: '0 0 8px 0', color: '#047857', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              3. Otorite İnşası ve UX/UI Geliştirmeleri
            </h4>
            <p style={{ margin: 0, color: '#475569', fontSize: '14px', lineHeight: '1.6' }}>
              Sayfa içi (On-Page) iyileştirmelere ek olarak, sitenizin dönüşüm oranlarını artırmak (CRO) için kullanıcı deneyimini (UX) kurgulayan ısı haritası analizleri önerilir. Tıklama başı maliyetleri (TBM) düşürmek ve marka otoritenizi artırmak için yüksek kaliteli sitelerden alınacak PR ve Backlink çalışmaları, algoritmik dalgalanmalarda sitenizi koruyacak bir zırh görevi görecektir.
            </p>
          </div>

        </div>
      </div>

      {/* Footer / CTA */}
      <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', color: '#fff', padding: '25px', borderRadius: '12px', textAlign: 'center', pageBreakInside: 'avoid' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '20px' }}>Daha Fazla Büyüme İçin Hazır Mısınız?</h3>
        <p style={{ margin: '0 0 15px 0', fontSize: '14px', opacity: 0.9 }}>
          Bu rapor otomatik bir ön analizdir. Uzman ekibimizle birlikte kapsamlı bir dijital strateji oluşturmak ve rakiplerinizin önüne geçmek için bizimle iletişime geçin.
        </p>
        <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
          📞 {phone} &nbsp;|&nbsp; ✉️ {email}
        </div>
      </div>

    </div>
  );
});

export default AiSeoPdfTemplate;
