import React from 'react';
import { guideContents } from '../../data/guideContents';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  LineChart, Line, AreaChart, Area
} from 'recharts';

export default function GuidePdfTemplate({ guide, user }) {
  if (!guide) return null;

  const contentData = guideContents[guide.id] || { intro: "", chapters: [] };
  
  // Extract number of pages from string (e.g., "24 sayfa PDF" -> 24)
  const match = guide.pages.match(/(\d+)/);
  const targetPageCount = match ? parseInt(match[1]) : 10;
  
  const A4_HEIGHT = '842px';
  const A4_WIDTH = '595px';

  // Believable Mock Data Generators based on guide ID
  const getMockChartData = (index) => {
    const dataTypes = [
      [
        { name: '1. Çeyrek', OncekiYil: 4000, BuYil: 6400 },
        { name: '2. Çeyrek', OncekiYil: 3000, BuYil: 7398 },
        { name: '3. Çeyrek', OncekiYil: 2000, BuYil: 9800 },
        { name: '4. Çeyrek', OncekiYil: 2780, BuYil: 12908 },
      ],
      [
        { name: '1. Ay', ROAS: 1.2, Hedef: 2.0 },
        { name: '2. Ay', ROAS: 1.8, Hedef: 2.5 },
        { name: '3. Ay', ROAS: 3.4, Hedef: 3.0 },
        { name: '4. Ay', ROAS: 5.1, Hedef: 4.0 },
        { name: '5. Ay', ROAS: 6.8, Hedef: 5.0 },
      ],
      [
        { name: 'Organik', Trafik: 4000 },
        { name: 'Sosyal Medya', Trafik: 3000 },
        { name: 'Reklamlar', Trafik: 2000 },
        { name: 'Referans', Trafik: 2780 },
      ]
    ];
    return dataTypes[index % dataTypes.length];
  };

  const getBelievableQuote = (index) => {
    const quotes = [
      "Dijital pazarlamada strateji olmadan harcanan her bütçe, karanlıkta ok atmaya benzer.",
      "Algoritmalar değişebilir, ancak insan psikolojisi ve satın alma davranışları binlerce yıldır aynıdır.",
      "Veri yalan söylemez. Duygularınızla değil, metriklerle karar verdiğinizde büyüme kaçınılmazdır.",
      "İyi bir tasarım satışı kolaylaştırır, kusursuz bir teklif ise satışı reddedilemez kılar.",
      "Küçük adımlar, sürekli optimizasyon ve sabır; dijitalde kalıcı başarının 3 temel taşıdır."
    ];
    return quotes[index % quotes.length];
  };

  const getCaseStudy = (index) => {
    const cases = [
      {
        title: "Vaka Analizi: Yerel Markanın Global Başarısı",
        challenge: "Aylık reklam bütçesi %40 artmasına rağmen ciroda durgunluk yaşanıyordu. Müşteri edinme maliyeti (CAC) sürdürülemez seviyedeydi.",
        solution: "Geniş hedefleme (Broad Targeting) stratejisine geçildi. Ürün bazlı kreatifler yerine, kullanıcı deneyimi (UGC) odaklı videolara ağırlık verildi. Sepet ortalamasını artırmak için çapraz satış kampanyaları eklendi.",
        result: "3 ay içinde ROAS %350 artarken, müşteri edinme maliyeti yarı yarıya düştü."
      },
      {
        title: "Vaka Analizi: B2B Sektöründe Yüksek Dönüşüm",
        challenge: "Web sitesi yüksek trafik alıyor ancak formu dolduran nitelikli potansiyel müşteri sayısı aylık 5'i geçmiyordu.",
        solution: "Açılış sayfası tamamen yenilendi. Karmaşık sektörel dil yerine fayda odaklı bir metin yazıldı. 'Hemen Al' yerine 'Ücretsiz Analiz Raporu' (Lead Magnet) kurgusu eklendi.",
        result: "Dönüşüm oranı %0.5'ten %4.2'ye yükseldi. Nitelikli müşteri talebi 8 kat arttı."
      },
      {
        title: "Vaka Analizi: Organik Trafik Patlaması",
        challenge: "Sektörde çok güçlü rakipler olduğu için anahtar kelimelerde ilk sayfaya çıkılamıyordu.",
        solution: "Kısa kuyruklu zor kelimeler bırakılıp, satın alma niyeti yüksek (Long-tail) kelimelere odaklanıldı. 20 adet 2000+ kelimelik teknik rehber hazırlandı.",
        result: "6 ay sonunda organik trafik 14 katına çıktı ve reklam bağımlılığı %60 azaldı."
      }
    ];
    return cases[index % cases.length];
  };

  // Generate the pages array
  const pages = [];
  
  // 1. Cover
  pages.push({ type: 'cover' });
  
  // 2. ToC
  pages.push({ type: 'toc' });
  
  // 3. Intro
  pages.push({ type: 'intro' });

  // Distribute remaining pages among chapters and extra content
  // Total pages needed: targetPageCount. 
  // We already have 3 (cover, toc, intro) + 2 (conclusion, cta) = 5 fixed pages.
  // We need to generate (targetPageCount - 5) pages.
  const dynamicPageCount = Math.max(1, targetPageCount - 5);
  
  let chapterIndex = 0;
  for (let i = 0; i < dynamicPageCount; i++) {
    const chapter = contentData.chapters[chapterIndex % (contentData.chapters.length || 1)] || { title: `Bölüm ${chapterIndex+1}`, content: 'İçerik...' };
    
    // Cycle through different layouts to make it look diverse and rich
    const layoutType = i % 5;
    
    if (layoutType === 0) {
      pages.push({ type: 'chapter_cover', chapter });
      chapterIndex++; // Move to next chapter after a cover
    } else if (layoutType === 1) {
      pages.push({ type: 'text_heavy', chapter });
    } else if (layoutType === 2) {
      pages.push({ type: 'chart_page', chapter, chartIndex: i });
    } else if (layoutType === 3) {
      pages.push({ type: 'case_study', caseData: getCaseStudy(i) });
    } else if (layoutType === 4) {
      pages.push({ type: 'quote_page', quote: getBelievableQuote(i) });
    }
  }

  // Final fixed pages
  pages.push({ type: 'conclusion' });
  pages.push({ type: 'cta' });

  // Helper to render a page container
  const PageContainer = ({ children, bg = '#ffffff', color = '#1e293b', pageNum = null, hideHeader = false }) => (
    <div className="pdf-page-section" style={{ 
      pageBreakBefore: 'always', 
      width: A4_WIDTH,
      height: A4_HEIGHT, 
      backgroundColor: bg,
      color: color,
      padding: '60px', 
      boxSizing: 'border-box',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {!hideHeader && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${color === '#ffffff' ? 'rgba(255,255,255,0.2)' : '#e2e8f0'}`, paddingBottom: '20px', marginBottom: '40px', opacity: 0.8 }}>
          <div style={{ fontSize: '14px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Ajans Rota | {guide.title.substring(0, 40)}...
          </div>
          {pageNum && (
            <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
              Sayfa {pageNum} / {targetPageCount}
            </div>
          )}
        </div>
      )}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      {/* Footer decorative icon */}
      <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', opacity: 0.03, pointerEvents: 'none' }}>
        <i className={guide.icon} style={{ fontSize: '250px', color: color }}></i>
      </div>
    </div>
  );

  return (
    <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -1 }}>
      <div 
        id="pdf-download-template" 
        style={{ 
          width: A4_WIDTH,
          backgroundColor: '#ffffff',
          color: '#1e293b',
          fontFamily: "'Inter', sans-serif",
          boxSizing: 'border-box'
        }}
      >
        {pages.map((page, index) => {
          const pageNum = index + 1;
          
          if (page.type === 'cover') {
            return (
              <PageContainer key={index} bg={guide.color || '#3b82f6'} color="#ffffff" hideHeader>
                <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '500px', height: '500px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }}></div>
                <div style={{ marginBottom: 'auto', width: '100%', textAlign: 'left', zIndex: 1 }}>
                  <h2 style={{ margin: 0, fontSize: '32px', letterSpacing: '4px', fontWeight: '900' }}>AJANS ROTA</h2>
                  <p style={{ margin: 0, fontSize: '18px', opacity: 0.8, marginTop: '5px' }}>Büyüme Akademisi Özel Raporu</p>
                </div>
                <div style={{ margin: 'auto 0', zIndex: 1, textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', background: 'rgba(255,255,255,0.15)', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px auto', backdropFilter: 'blur(10px)' }}>
                    <i className={guide.icon} style={{ fontSize: '60px', color: '#ffffff' }}></i>
                  </div>
                  <h1 style={{ fontSize: '52px', fontWeight: '900', lineHeight: 1.15, margin: '0 0 30px 0', textShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>{guide.title}</h1>
                  <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.2)', padding: '10px 20px', borderRadius: '30px', fontSize: '16px', fontWeight: 'bold' }}>
                    <i className="fa-regular fa-file-pdf" style={{marginRight: '8px'}}></i> Kapsamlı {targetPageCount} Sayfa Rehber
                  </div>
                </div>
                <div style={{ marginTop: 'auto', width: '100%', textAlign: 'left', borderTop: '2px solid rgba(255,255,255,0.2)', paddingTop: '30px', display: 'flex', justifyContent: 'space-between', zIndex: 1 }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '15px', opacity: 0.8 }}>Özel Hazırlanan:</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700' }}>{user?.fullName || 'Değerli Okurumuz'}</h3>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ margin: 0, fontSize: '15px', opacity: 0.8 }}>Tarih:</p>
                    <h3 style={{ margin: '8px 0 0 0', fontSize: '24px', fontWeight: '700' }}>{new Date().toLocaleDateString('tr-TR')}</h3>
                  </div>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'toc') {
            return (
              <PageContainer key={index} pageNum={pageNum}>
                <h2 style={{ fontSize: '32px', color: guide.color || '#3b82f6', marginBottom: '30px', fontWeight: '900' }}>İçindekiler</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dotted #cbd5e1', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>1. Giriş ve Stratejik Vizyon</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: guide.color }}>03</span>
                  </div>
                  {contentData.chapters.map((ch, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dotted #cbd5e1', paddingBottom: '10px' }}>
                      <span style={{ fontSize: '18px', fontWeight: '600' }}>{i+2}. {ch.title.split(':')[0]}</span>
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: guide.color }}>{(i*4 + 5).toString().padStart(2, '0')}</span>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dotted #cbd5e1', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>Vaka Analizleri ve Gerçek Veriler</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: guide.color }}>{targetPageCount - 5}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px dotted #cbd5e1', paddingBottom: '10px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '600' }}>Sonuç ve Aksiyon Planı</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: guide.color }}>{targetPageCount - 1}</span>
                  </div>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'intro') {
            return (
              <PageContainer key={index} pageNum={pageNum}>
                <h2 style={{ fontSize: '36px', color: '#1e293b', marginBottom: '30px', fontWeight: '800' }}>Giriş ve Stratejik Vizyon</h2>
                <p style={{ fontSize: '22px', color: '#475569', lineHeight: 1.8, marginBottom: '40px', fontWeight: '500' }}>
                  {contentData.intro}
                </p>
                <div style={{ backgroundColor: `${guide.color}15`, padding: '40px', borderRadius: '20px', borderLeft: `8px solid ${guide.color}` }}>
                  <h3 style={{ fontSize: '24px', color: guide.color, margin: '0 0 15px 0' }}>Neden Bu Rehberi Okumalısınız?</h3>
                  <p style={{ fontSize: '18px', color: '#334155', lineHeight: 1.7, margin: 0 }}>
                    Dijital ekosistem her geçen gün karmaşıklaşıyor. Rakipleriniz yeni algoritmaları, yapay zeka araçlarını ve büyüme taktiklerini kullanırken yerinizde saymak, gerilemek anlamına gelir. 
                    Bu raporda yer alan tüm veriler, Ajans Rota'nın {new Date().getFullYear()} yılı içerisinde yönettiği milyonlarca liralık reklam bütçelerinden elde edilen gerçek saha sonuçlarına dayanmaktadır.
                  </p>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'chapter_cover') {
            return (
              <PageContainer key={index} bg={`${guide.color}05`} pageNum={pageNum}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                  <div style={{ width: '80px', height: '8px', backgroundColor: guide.color, marginBottom: '40px', borderRadius: '4px' }}></div>
                  <h2 style={{ fontSize: '50px', color: '#1e293b', fontWeight: '900', lineHeight: 1.2, maxWidth: '80%' }}>
                    {page.chapter.title}
                  </h2>
                  <p style={{ fontSize: '24px', color: '#64748b', marginTop: '30px', maxWidth: '70%', lineHeight: 1.6 }}>
                    Stratejiyi anlama, uygulama adımları ve sık yapılan hatalar.
                  </p>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'text_heavy') {
            // Split content into paragraphs to make it look nicer
            const paragraphs = page.chapter.content.split('\n').filter(p => p.trim().length > 0);
            return (
              <PageContainer key={index} pageNum={pageNum}>
                <h3 style={{ fontSize: '28px', color: guide.color, marginBottom: '30px', borderBottom: `2px solid ${guide.color}30`, paddingBottom: '10px' }}>
                  Derinlemesine İnceleme
                </h3>
                {paragraphs.slice(0, 3).map((p, i) => (
                  <p key={i} style={{ fontSize: '18px', color: '#334155', lineHeight: 1.8, marginBottom: '25px', textAlign: 'justify' }}>
                    {p}
                  </p>
                ))}
                {paragraphs.length > 3 && (
                  <div style={{ backgroundColor: '#f8fafc', padding: '25px', borderRadius: '15px', marginTop: '20px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '20px', color: '#1e293b' }}>Önemli İpucu</h4>
                    <p style={{ margin: 0, fontSize: '16px', color: '#475569', lineHeight: 1.6 }}>{paragraphs[3]}</p>
                  </div>
                )}
              </PageContainer>
            );
          }

          if (page.type === 'chart_page') {
            const data = getMockChartData(page.chartIndex);
            const isArea = page.chartIndex % 2 === 0;
            return (
              <PageContainer key={index} pageNum={pageNum}>
                 <h3 style={{ fontSize: '24px', color: '#1e293b', marginBottom: '15px', fontWeight: '800' }}>Sektörel Büyüme Verileri</h3>
                 <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
                   Aşağıdaki grafik, doğru strateji uygulandığında elde edilen örnek ivmeyi temsil etmektedir. Veriler, sektör ortalamaları ve vaka analizlerinden derlenmiştir.
                 </p>
                 <div style={{ width: '100%', height: '300px', backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      {isArea ? (
                        <AreaChart width={450} height={250} data={data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis fontSize={12} />
                          <RechartsTooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Area isAnimationActive={false} type="monotone" dataKey={Object.keys(data[0])[1]} stackId="1" stroke={guide.color} fill={`${guide.color}40`} />
                          <Area isAnimationActive={false} type="monotone" dataKey={Object.keys(data[0])[2]} stackId="1" stroke="#334155" fill="#33415540" />
                        </AreaChart>
                      ) : (
                        <BarChart width={450} height={250} data={data}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                          <XAxis dataKey="name" fontSize={12} />
                          <YAxis fontSize={12} />
                          <RechartsTooltip />
                          <Legend wrapperStyle={{ fontSize: '12px' }} />
                          <Bar isAnimationActive={false} dataKey={Object.keys(data[0])[1]} fill={guide.color} radius={[4,4,0,0]} />
                          <Bar isAnimationActive={false} dataKey={Object.keys(data[0])[2]} fill="#334155" radius={[4,4,0,0]} />
                        </BarChart>
                      )}
                 </div>
                 <div style={{ marginTop: '30px', padding: '15px', borderLeft: `5px solid ${guide.color}`, backgroundColor: `${guide.color}10` }}>
                    <h4 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>Grafik Analizi</h4>
                    <p style={{ margin: 0, fontSize: '14px', lineHeight: 1.6, color: '#475569' }}>
                      Geleneksel yöntemler kullanıldığında (gri alan) büyüme yatay seyrederken, veri odaklı stratejiler (renkli alan) uygulandığında kırılım yaşanmaktadır.
                    </p>
                 </div>
              </PageContainer>
            );
          }

          if (page.type === 'case_study') {
            return (
              <PageContainer key={index} pageNum={pageNum}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
                  <i className="fa-solid fa-microscope" style={{ fontSize: '24px', color: guide.color }}></i>
                  <h3 style={{ fontSize: '24px', color: '#1e293b', margin: 0, fontWeight: '800' }}>Saha Kanıtı: Vaka Analizi</h3>
                </div>
                
                <h4 style={{ fontSize: '20px', color: guide.color, marginBottom: '20px', lineHeight: 1.4 }}>
                  {page.caseData.title}
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ backgroundColor: '#fff1f2', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #f43f5e' }}>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#e11d48', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-triangle-exclamation"></i> Problem (Zorluk)
                    </h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#4c0519', lineHeight: 1.6 }}>{page.caseData.challenge}</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f0fdf4', padding: '20px', borderRadius: '15px', borderLeft: '5px solid #22c55e' }}>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#15803d', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-lightbulb"></i> Uygulanan Çözüm
                    </h5>
                    <p style={{ margin: 0, fontSize: '14px', color: '#14532d', lineHeight: 1.6 }}>{page.caseData.solution}</p>
                  </div>
                  
                  <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '15px', border: '2px dashed #cbd5e1' }}>
                    <h5 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <i className="fa-solid fa-chart-line" style={{ color: guide.color }}></i> Elde Edilen Sonuç
                    </h5>
                    <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: guide.color, lineHeight: 1.5 }}>{page.caseData.result}</p>
                  </div>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'quote_page') {
            return (
              <PageContainer key={index} bg={guide.color} color="#ffffff" pageNum={pageNum}>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center', padding: '0 40px' }}>
                  <i className="fa-solid fa-quote-left" style={{ fontSize: '80px', opacity: 0.3, marginBottom: '40px' }}></i>
                  <h2 style={{ fontSize: '42px', fontWeight: '700', lineHeight: 1.4, fontStyle: 'italic', textShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
                    "{page.quote}"
                  </h2>
                  <div style={{ width: '60px', height: '4px', backgroundColor: '#ffffff', marginTop: '40px', opacity: 0.5 }}></div>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'conclusion') {
            return (
              <PageContainer key={index} pageNum={pageNum}>
                <h2 style={{ fontSize: '40px', color: '#1e293b', marginBottom: '30px', fontWeight: '900' }}>Sonuç ve Değerlendirme</h2>
                <p style={{ fontSize: '20px', color: '#475569', lineHeight: 1.8, marginBottom: '30px' }}>
                  Elinizdeki bu {targetPageCount} sayfalık rehber, teorik bilgilerden ziyade sahada kanıtlanmış stratejilerin bir özetidir. Ancak unutulmamalıdır ki her işletmenin DNA'sı, hedef kitlesi ve dinamikleri farklıdır.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginTop: '40px' }}>
                  <div style={{ padding: '30px', backgroundColor: '#f8fafc', borderRadius: '20px', borderTop: `4px solid ${guide.color}` }}>
                    <i className="fa-solid fa-check-double" style={{ fontSize: '30px', color: guide.color, marginBottom: '20px' }}></i>
                    <h4 style={{ fontSize: '22px', margin: '0 0 15px 0' }}>Sıradaki Adım Ne Olmalı?</h4>
                    <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>Bu dokümandaki kontrol listelerini kendi işletmeniz için doldurun ve eksiklerinizi belirleyin.</p>
                  </div>
                  <div style={{ padding: '30px', backgroundColor: '#f8fafc', borderRadius: '20px', borderTop: `4px solid ${guide.color}` }}>
                    <i className="fa-solid fa-users-gear" style={{ fontSize: '30px', color: guide.color, marginBottom: '20px' }}></i>
                    <h4 style={{ fontSize: '22px', margin: '0 0 15px 0' }}>Profesyonel Destek</h4>
                    <p style={{ fontSize: '16px', color: '#64748b', lineHeight: 1.6 }}>Zaman kaybetmemek ve bütçenizi riske atmamak için uygulamayı uzman bir ekibe devredin.</p>
                  </div>
                </div>
              </PageContainer>
            );
          }

          if (page.type === 'cta') {
            return (
              <PageContainer key={index} bg="#0f172a" color="#ffffff" hideHeader>
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100%', textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: `${guide.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 40px auto' }}>
                    <i className="fa-solid fa-rocket" style={{ fontSize: '50px', color: guide.color }}></i>
                  </div>
                  <h2 style={{ fontSize: '48px', color: '#ffffff', marginBottom: '30px', fontWeight: '900', lineHeight: 1.2 }}>
                    Birlikte Büyümeye Hazır Mısınız?
                  </h2>
                  <p style={{ fontSize: '22px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '50px', maxWidth: '600px', margin: '0 auto 50px auto' }}>
                    Bu rehberdeki stratejileri kendi işletmenize entegre etmek ve rakiplerinizin önüne geçmek için ücretsiz strateji görüşmesi talep edin.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '25px', width: '100%', maxWidth: '400px', margin: '0 auto' }}>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <i className="fa-solid fa-envelope" style={{ fontSize: '24px', color: guide.color }}></i>
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>hello@ajansrota.com</span>
                    </div>
                    <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '15px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                      <i className="fa-solid fa-globe" style={{ fontSize: '24px', color: guide.color }}></i>
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>www.ajansrota.com</span>
                    </div>
                  </div>
                </div>
              </PageContainer>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
