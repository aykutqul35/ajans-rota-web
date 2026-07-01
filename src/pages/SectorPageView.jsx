import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FadeIn from '../components/FadeIn';
import { sectorData } from '../data/sectorData';
import NotFoundPage from './NotFoundPage';

const getDashboardData = (slug) => {
  const dataMap = {
    'saglik-turizmi': {
      audience: [75, 15, 10], 
      funnel: [100, 80, 50, 30],
      traffic: [85, 75, 40], 
      trafficLabels: ['Google (Avrupa)', 'Instagram', 'Tiktok'],
      kpi2Note: '* Sağlık verileri ve semptom bazlı aramalara göre eğitilen AI modelimiz, nitelikli hasta formlarını %40 artırır.',
      pathArea: "M0,150 L0,120 Q50,140 100,90 T200,50 T300,10 T400,60 T500,20 L500,150 Z",
      pathLine: "M0,120 Q50,140 100,90 T200,50 T300,10 T400,60 T500,20",
      nodeX: [300, 500], nodeY: [10, 20]
    },
    'gayrimenkul-insaat': {
      audience: [40, 45, 15], 
      funnel: [100, 60, 30, 10],
      traffic: [95, 60, 45],
      trafficLabels: ['Sahibinden', 'Meta (VIP)', 'Google'], 
      kpi2Note: '* Yüksek bütçeli lüks konut yatırımcılarını filtreleyen algoritmamız ile satıcının vaktini boşa harcamayız.',
      pathArea: "M0,150 L0,100 Q50,130 100,80 T200,60 T300,10 T400,90 T500,40 L500,150 Z",
      pathLine: "M0,100 Q50,130 100,80 T200,60 T300,10 T400,90 T500,40",
      nodeX: [300, 400], nodeY: [10, 90]
    },
    'b2b-ihracat': {
      audience: [85, 10, 5], 
      funnel: [100, 90, 60, 40],
      traffic: [90, 40, 20],
      trafficLabels: ['Google Ads', 'LinkedIn', 'Direkt/Fuar'],
      kpi2Note: '* Uluslararası B2B satın almacı davranışlarını analiz ederek sahte/ilgisiz talepleri otomatik olarak eler.',
      pathArea: "M0,150 L0,140 Q50,120 100,80 T200,50 T300,30 T400,20 T500,5 L500,150 Z",
      pathLine: "M0,140 Q50,120 100,80 T200,50 T300,30 T400,20 T500,5",
      nodeX: [300, 500], nodeY: [30, 5]
    },
    'e-ticaret': {
      audience: [60, 30, 10], 
      funnel: [100, 85, 55, 35],
      traffic: [95, 80, 50],
      trafficLabels: ['Trendyol/HB', 'Instagram', 'Google Shop'],
      kpi2Note: '* Sepet terk etme ve gezinme verilerini işleyerek sadece satın almaya en yakın müşterileri hedefleriz.',
      pathArea: "M0,150 L0,110 Q50,120 100,100 T200,80 T300,40 T400,70 T500,30 L500,150 Z",
      pathLine: "M0,110 Q50,120 100,100 T200,80 T300,40 T400,70 T500,30",
      nodeX: [300, 500], nodeY: [40, 30]
    }
  };
  return dataMap[slug] || {
    audience: [65, 20, 15], 
    funnel: [100, 75, 45, 25],
    traffic: [85, 60, 30],
    trafficLabels: ['Google', 'Meta', 'Direct'],
    kpi2Note: '* Sektörel dil işleme algoritmalarımız sayesinde müşteri (lead) kalitesi %30 oranında artırılmıştır.',
    pathArea: "M0,150 L0,100 Q50,130 100,80 T200,60 T300,10 T400,90 T500,40 L500,150 Z",
    pathLine: "M0,100 Q50,130 100,80 T200,60 T300,10 T400,90 T500,40",
    nodeX: [300, 400], nodeY: [10, 90]
  };
}

export default function SectorPageView({ onNavToContact }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = sectorData[slug];
  const dashData = getDashboardData(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!data) return <NotFoundPage />;

  return (
    <div className="dashboard-page" style={{ background: '#f4f7f9', minHeight: '100vh', color: '#1e293b', paddingTop: '100px', paddingBottom: '60px', fontFamily: '"Inter", system-ui, sans-serif' }}>
      <Helmet>
        <title>{data.title} | Ajans Rota AI Büyüme Dashboard</title>
        <meta name="description" content={data.heroDescription} />
      </Helmet>

      <style>
        {`
          .dashboard-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 5%;
          }
          
          /* Dashboard Header */
          .dash-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-bottom: 3rem;
            position: relative;
            z-index: 10;
          }
          
          .dash-title {
            font-size: clamp(2.5rem, 5vw, 4rem);
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 1rem;
            letter-spacing: -1px;
            line-height: 1.1;
          }
          
          .dash-subtitle {
            font-size: 1.15rem;
            color: #64748b;
            max-width: 600px;
            margin-bottom: 2rem;
            line-height: 1.6;
          }
          
          .dash-btn {
            background: linear-gradient(135deg, #0ea5e9, #0284c7);
            color: white;
            border: none;
            padding: 14px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 1.05rem;
            cursor: pointer;
            box-shadow: 0 10px 25px rgba(14, 165, 233, 0.3);
            transition: all 0.3s;
          }
          .dash-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 15px 30px rgba(14, 165, 233, 0.4);
          }

          /* Bento Grid */
          .bento-dashboard {
            display: grid;
            grid-template-columns: 1fr;
            gap: 1.5rem;
            width: 100%;
          }
          @media (min-width: 768px) {
            .bento-dashboard {
              grid-template-columns: repeat(2, 1fr);
            }
            .b-card-performance { grid-column: 1 / -1; }
            .b-card-results, .b-card-traffic { grid-column: 1 / -1; }
          }
          @media (min-width: 1024px) {
            .bento-dashboard {
              grid-template-columns: repeat(12, 1fr);
              grid-auto-rows: auto;
              align-items: stretch;
            }
            
            /* Row 1 */
            .b-card-performance { grid-column: 1 / 7; grid-row: 1; }
            .b-card-audience { grid-column: 7 / 10; grid-row: 1; }
            .b-card-funnel { grid-column: 10 / 13; grid-row: 1; }
            
            /* Row 2 */
            .b-card-traffic { grid-column: 1 / 5; grid-row: 2; }
            .b-card-kpi-1 { grid-column: 5 / 9; grid-row: 2; }
            .b-card-ai-1 { grid-column: 9 / 13; grid-row: 2; }
            
            /* Row 3 */
            .b-card-kpi-2 { grid-column: 1 / 5; grid-row: 3; }
            .b-card-ai-2 { grid-column: 5 / 9; grid-row: 3; }
            .b-card-results { grid-column: 9 / 13; grid-row: 3; }
          }

          /* Card Styling */
          .d-card {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 1);
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 
              inset 0 0 10px rgba(255,255,255,0.5), 
              0 8px 30px rgba(0, 0, 0, 0.03);
            display: flex;
            flex-direction: column;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
          }
          .d-card:hover {
            transform: translateY(-3px);
            box-shadow: 
              inset 0 0 15px rgba(255,255,255,0.8), 
              0 15px 40px rgba(14, 165, 233, 0.08);
          }
          
          .d-card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
          }
          
          .d-card-title {
            font-size: 1.1rem;
            font-weight: 700;
            color: #0f172a;
          }
          
          .d-card-menu {
            color: #94a3b8;
            cursor: pointer;
          }

          /* Chart Styling */
          .chart-line {
            fill: none;
            stroke-width: 3;
            stroke-linecap: round;
          }
          .chart-area {
            opacity: 0.1;
          }
          .chart-grid {
            stroke: #e2e8f0;
            stroke-width: 1;
            stroke-dasharray: 4;
          }
          
          /* Background Waves */
          .bg-waves {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100vh;
            background-image: 
              radial-gradient(circle at 10% 20%, rgba(14, 165, 233, 0.05) 0%, transparent 40%),
              radial-gradient(circle at 90% 40%, rgba(14, 165, 233, 0.05) 0%, transparent 40%);
            z-index: 0;
            pointer-events: none;
          }
          
          /* Funnel Bars */
          .funnel-row {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 8px;
            margin-bottom: 1rem;
          }
          .funnel-bar {
            background: linear-gradient(90deg, #0284c7, #38bdf8);
            height: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 10px rgba(14,165,233,0.2);
          }
          
          /* Traffic Bars */
          .traffic-row {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 1rem;
          }
          .traffic-label { width: 60px; font-size: 0.9rem; font-weight: 600; color: #475569; }
          .traffic-bar-bg { flex: 1; height: 16px; background: #e2e8f0; border-radius: 8px; position: relative; }
          .traffic-bar-fill { height: 100%; background: linear-gradient(90deg, #0ea5e9, #38bdf8); border-radius: 8px; }
          
          /* KPI Huge Text */
          .kpi-value {
            font-size: clamp(1.5rem, 2.5vw, 2.2rem);
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.2rem;
            display: flex;
            align-items: baseline;
            gap: 8px;
            flex-wrap: wrap;
          }
          .kpi-trend {
            font-size: 1rem;
            color: #10b981;
            font-weight: 600;
          }
          .kpi-label {
            font-size: 0.95rem;
            color: #64748b;
            font-weight: 500;
          }
          
          /* AI Recommendations */
          .ai-rec-item {
            display: flex;
            gap: 1rem;
            align-items: flex-start;
          }
          .ai-rec-icon {
            width: 36px; height: 36px;
            background: rgba(14,165,233,0.1);
            color: #0ea5e9;
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            font-size: 1.1rem;
          }
          .ai-rec-text h4 { margin: 0 0 4px 0; font-size: 0.95rem; font-weight: 700; color: #0f172a; }
          .ai-rec-text p { margin: 0; font-size: 0.85rem; color: #64748b; line-height: 1.5; }

        `}
      </style>

      <div className="bg-waves"></div>

      <div className="dashboard-container">
        
        {/* DASHBOARD HEADER */}
        <FadeIn direction="up">
          <div className="dash-header">
            <h1 className="dash-title">
              {data.title.split(' İçin ')[0]} <br/>
              <span style={{ color: '#0ea5e9' }}>Yapay Zeka Büyüme Paneli</span>
            </h1>
            <p className="dash-subtitle">
              Sektörünüze özel yapay zeka analiz platformu. {data.heroDescription}
            </p>
            <button className="dash-btn" onClick={onNavToContact}>
              Sistemi Kurmaya Başlayalım
            </button>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="bento-dashboard">
            
            {/* 1. PERFORMANCE OVERVIEW */}
            <div className="d-card b-card-performance">
              <div className="d-card-header">
                <div className="d-card-title">Performans Büyüme Grafiği</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Grid Lines */}
                  {[0, 50, 100, 150].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} className="chart-grid" />
                  ))}
                  
                  {/* Area */}
                  <path d={dashData.pathArea} fill="url(#areaGradient)" />
                  <path d="M0,150 L0,130 Q50,150 100,110 T200,90 T300,50 T400,130 T500,70 L500,150 Z" fill="#94a3b8" opacity="0.05" />
                  
                  {/* Lines */}
                  <path d={dashData.pathLine} stroke="#0ea5e9" strokeWidth="3" fill="none" filter="url(#glow)" />
                  <path d="M0,130 Q50,150 100,110 T200,90 T300,50 T400,130 T500,70" stroke="#94a3b8" strokeWidth="2" strokeDasharray="5" fill="none" />
                  
                  {/* Nodes */}
                  <circle cx={dashData.nodeX[0]} cy={dashData.nodeY[0]} r="6" fill="#fff" stroke="#0ea5e9" strokeWidth="3" filter="url(#glow)" />
                  <circle cx={dashData.nodeX[1]} cy={dashData.nodeY[1]} r="6" fill="#fff" stroke="#0ea5e9" strokeWidth="3" filter="url(#glow)" />
                  
                  {/* Labels */}
                  <text x="50" y="175" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">1. Çyr</text>
                  <text x="250" y="175" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">2. Çyr</text>
                  <text x="450" y="175" fill="#94a3b8" fontSize="11" fontWeight="600" textAnchor="middle">3. Çyr</text>
                </svg>
              </div>
            </div>

            {/* 2. AUDIENCE INSIGHTS */}
            <div className="d-card b-card-audience">
              <div className="d-card-header">
                <div className="d-card-title">Kitle Segmentasyonu</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '2rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                  <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="4"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0ea5e9" strokeWidth="4" strokeDasharray={`${dashData.audience[0]} ${100-dashData.audience[0]}`} strokeDashoffset="0"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#38bdf8" strokeWidth="4" strokeDasharray={`${dashData.audience[1]} ${100-dashData.audience[1]}`} strokeDashoffset={`-${dashData.audience[0]}`}></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="4" strokeDasharray={`${dashData.audience[2]} ${100-dashData.audience[2]}`} strokeDashoffset={`-${dashData.audience[0] + dashData.audience[1]}`}></circle>
                  </svg>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: '#0f172a' }}>
                    <i className="fa-solid fa-users"></i>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0ea5e9' }}></div> Hazır Alıcı %{dashData.audience[0]}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8' }}></div> Araştırmacı %{dashData.audience[1]}</div>
                  <div style={{ fontSize: '0.75rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#94a3b8' }}></div> İlgisiz %{dashData.audience[2]}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                * Müşterileri satın alma niyetine göre mikro segmentlere ayırarak reklam bütçesi israfını önleriz.
              </div>
            </div>

            {/* 3. CONVERSION FUNNEL */}
            <div className="d-card b-card-funnel">
              <div className="d-card-header">
                <div className="d-card-title">Yapay Zeka Hunisi</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Ziyaretçi</div>
                  <div className="funnel-bar" style={{ width: `${dashData.funnel[0]}%`, opacity: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>%{dashData.funnel[0]}</div>
                </div>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Yapay Zeka Filtresi</div>
                  <div className="funnel-bar" style={{ width: `${dashData.funnel[1]}%`, opacity: 0.85, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>%{dashData.funnel[1]}</div>
                </div>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Potansiyel Müşteri</div>
                  <div className="funnel-bar" style={{ width: `${dashData.funnel[2]}%`, opacity: 0.7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>%{dashData.funnel[2]}</div>
                </div>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Satış / Dönüşüm</div>
                  <div className="funnel-bar" style={{ width: `${dashData.funnel[3]}%`, opacity: 0.5, background: 'linear-gradient(90deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 'bold' }}>%{dashData.funnel[3]}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                * AI destekli huni, sahte tıklamaları ve ilgisiz ziyaretçileri eleyerek satış ekibinize sadece sıcak fırsatları yönlendirir.
              </div>
            </div>

            {/* 4. TRAFFIC SOURCES */}
            <div className="d-card b-card-traffic">
              <div className="d-card-header">
                <div className="d-card-title">Trafik Kaynakları Analizi</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="traffic-row">
                  <div className="traffic-label" style={{ minWidth: '90px' }}>{dashData.trafficLabels[0]}</div>
                  <div className="traffic-bar-bg"><div className="traffic-bar-fill" style={{ width: `${dashData.traffic[0]}%` }}></div></div>
                  <div style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: '#0ea5e9' }}>%{dashData.traffic[0]}</div>
                </div>
                <div className="traffic-row">
                  <div className="traffic-label" style={{ minWidth: '90px' }}>{dashData.trafficLabels[1]}</div>
                  <div className="traffic-bar-bg"><div className="traffic-bar-fill" style={{ width: `${dashData.traffic[1]}%`, background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}></div></div>
                  <div style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: '#8b5cf6' }}>%{dashData.traffic[1]}</div>
                </div>
                <div className="traffic-row">
                  <div className="traffic-label" style={{ minWidth: '90px' }}>{dashData.trafficLabels[2]}</div>
                  <div className="traffic-bar-bg"><div className="traffic-bar-fill" style={{ width: `${dashData.traffic[2]}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div></div>
                  <div style={{ minWidth: '35px', textAlign: 'right', fontSize: '0.75rem', fontWeight: 'bold', color: '#10b981' }}>%{dashData.traffic[2]}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                * Bütçenizi tıklama tuzaklarına değil, sektörünüze özel en yüksek dönüşüm getiren kanallara aktarırız.
              </div>
            </div>

            {/* 5. KPI 1 (From data.stats) */}
            <div className="d-card b-card-kpi-1" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ zIndex: 2, position: 'relative' }}>
                <div className="kpi-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{data.stats && data.stats[0] ? data.stats[0].label : 'Total Reach'}</span>
                  <i className="fa-solid fa-chart-simple" style={{ color: '#0ea5e9', opacity: 0.5 }}></i>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <div className="kpi-value" style={{ background: 'linear-gradient(90deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {data.stats && data.stats[0] ? data.stats[0].value : '63,980'}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 'bold', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fa-solid fa-arrow-trend-up"></i> Geçen aya göre +%24 artış
                </div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, fontSize: '0.65rem', color: '#94a3b8', marginTop: '1rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                * Gerçek hedeflenen, nitelikli kitle erişim kapasitesi.
              </div>
              <svg viewBox="0 0 100 30" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', opacity: 0.1, zIndex: 1 }} preserveAspectRatio="none">
                 <path d="M0,30 L0,20 Q25,10 50,15 T100,5 L100,30 Z" fill="#0ea5e9" />
              </svg>
            </div>

            {/* 6. KPI 2 (From data.stats) */}
            <div className="d-card b-card-kpi-2" style={{ position: 'relative', overflow: 'hidden' }}>
              <div style={{ zIndex: 2, position: 'relative' }}>
                <div className="kpi-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{data.stats && data.stats[1] ? data.stats[1].label : 'Leads Generated'}</span>
                  <i className="fa-solid fa-bullseye" style={{ color: '#8b5cf6', opacity: 0.5 }}></i>
                </div>
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', marginTop: '10px' }}>
                  <div className="kpi-value" style={{ background: 'linear-gradient(90deg, #0f172a, #334155)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {data.stats && data.stats[1] ? data.stats[1].value : '1,256'}
                  </div>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#8b5cf6', fontWeight: 'bold', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <i className="fa-solid fa-bolt"></i> Yapay Zeka Hızlandırması aktif
                </div>
              </div>
              <div style={{ position: 'relative', zIndex: 2, fontSize: '0.65rem', color: '#94a3b8', marginTop: '1rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                {dashData.kpi2Note || '* Sektörel dil işleme algoritmalarımız sayesinde müşteri (lead) kalitesi %30 oranında artırılmıştır.'}
              </div>
              <svg viewBox="0 0 100 30" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', height: '40px', opacity: 0.1, zIndex: 1 }} preserveAspectRatio="none">
                 <path d="M0,30 L0,15 Q25,25 50,10 T100,10 L100,30 Z" fill="#8b5cf6" />
              </svg>
            </div>

            {/* 7. AI REC 1 (From data.aiPitches) */}
            <div className="d-card b-card-ai-1" style={{ padding: '1.25rem', justifyContent: 'center' }}>
              <div className="ai-rec-item">
                <div className="ai-rec-icon"><i className={`fa-solid ${data.aiPitches && data.aiPitches[0] ? data.aiPitches[0].icon : 'fa-brain'}`}></i></div>
                <div className="ai-rec-text">
                  <h4>{data.aiPitches && data.aiPitches[0] ? data.aiPitches[0].title : 'AI Optimization'}</h4>
                  <p>{data.aiPitches && data.aiPitches[0] ? data.aiPitches[0].desc : 'System is actively learning and optimizing.'}</p>
                </div>
              </div>
              <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: '1rem', fontStyle: 'italic', lineHeight: '1.4', textAlign: 'center' }}>
                * Algoritmamız 7/24 pazar verisini tarayarak bütçenizi en verimli kampanyalara kaydırır.
              </div>
            </div>

            {/* 8. AI REC 2 (From data.aiPitches) */}
            <div className="d-card b-card-ai-2" style={{ padding: '1.25rem', justifyContent: 'center' }}>
              <div className="ai-rec-item">
                <div className="ai-rec-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className={`fa-solid ${data.aiPitches && data.aiPitches[1] ? data.aiPitches[1].icon : 'fa-bolt'}`}></i></div>
                <div className="ai-rec-text">
                  <h4>{data.aiPitches && data.aiPitches[1] ? data.aiPitches[1].title : 'Smart Targeting'}</h4>
                  <p>{data.aiPitches && data.aiPitches[1] ? data.aiPitches[1].desc : 'Engaging high-intent users automatically.'}</p>
                </div>
              </div>
            </div>

            {/* 9. RECENT RESULTS (From data.caseStudy) */}
            <div className="d-card b-card-results" style={{ position: 'relative' }}>
              <div className="d-card-header">
                <div className="d-card-title">Başarı Analizi Sonuçları</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #0ea5e9, #38bdf8)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                     {data.caseStudy ? data.caseStudy.client.charAt(0) : 'C'}
                   </div>
                   <div>
                     <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#0f172a' }}>{data.caseStudy ? data.caseStudy.client : 'Client'}</div>
                     <div style={{ fontSize: '0.75rem', color: '#64748b' }}><i className="fa-solid fa-check-circle" style={{ color: '#10b981' }}></i> Doğrulanmış Partner Büyümesi</div>
                   </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>ROAS Oranı</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0ea5e9' }}>{data.caseStudy ? data.caseStudy.resultRoas : '%0'}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>Müşteri (Lead)</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0ea5e9' }}>{data.caseStudy ? data.caseStudy.resultLeads : '0'}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: '600', color: '#475569' }}>Edinme Maliyeti</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10b981' }}>{data.caseStudy ? data.caseStudy.resultCpa : '0'}</span>
                </div>
              </div>
              <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1.25rem', borderTop: '1px solid #e2e8f0', paddingTop: '0.75rem', fontStyle: 'italic', lineHeight: '1.4' }}>
                * Bu metrikler, sistemin aynı sektördeki örnek bir partnerimizde sağladığı doğrulanmış büyüme verileridir.
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </div>
  );
}
