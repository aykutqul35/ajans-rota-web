const fs = require('fs');

const code = `import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import FadeIn from '../components/FadeIn';
import { sectorData } from '../data/sectorData';
import NotFoundPage from './NotFoundPage';

export default function SectorPageView({ onNavToContact }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const data = sectorData[slug];

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
        {\`
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
          }
          @media (min-width: 1024px) {
            .bento-dashboard {
              grid-template-columns: repeat(12, 1fr);
              grid-auto-rows: minmax(100px, auto);
            }
            
            .b-card-performance { grid-column: 1 / 7; grid-row: span 3; }
            .b-card-audience { grid-column: 7 / 10; grid-row: span 3; }
            .b-card-funnel { grid-column: 10 / 13; grid-row: span 3; }
            
            .b-card-traffic { grid-column: 1 / 5; grid-row: span 2; }
            .b-card-kpi-1 { grid-column: 5 / 7; grid-row: span 1; }
            .b-card-kpi-2 { grid-column: 5 / 7; grid-row: span 1; }
            
            .b-card-ai-1 { grid-column: 7 / 10; grid-row: span 1; }
            .b-card-ai-2 { grid-column: 7 / 10; grid-row: span 1; }
            
            .b-card-results { grid-column: 10 / 13; grid-row: span 2; }
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
            font-size: 2.2rem;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 0.2rem;
            display: flex;
            align-items: baseline;
            gap: 8px;
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

        \`}
      </style>

      <div className="bg-waves"></div>

      <div className="dashboard-container">
        
        {/* DASHBOARD HEADER */}
        <FadeIn direction="up">
          <div className="dash-header">
            <h1 className="dash-title">
              {data.title.split(' İçin ')[0]} <br/>
              <span style={{ color: '#0ea5e9' }}>AI Growth Dashboard</span>
            </h1>
            <p className="dash-subtitle">
              Sektörünüze özel yapay zeka analiz platformu. {data.heroDescription}
            </p>
            <button className="dash-btn" onClick={onNavToContact}>
              Request AI Demo
            </button>
          </div>
        </FadeIn>

        <FadeIn direction="up" delay={0.2}>
          <div className="bento-dashboard">
            
            {/* 1. PERFORMANCE OVERVIEW */}
            <div className="d-card b-card-performance">
              <div className="d-card-header">
                <div className="d-card-title">Performance Overview</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <svg viewBox="0 0 500 200" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                  {/* Grid Lines */}
                  {[0, 50, 100, 150].map(y => (
                    <line key={y} x1="0" y1={y} x2="500" y2={y} className="chart-grid" />
                  ))}
                  {/* Area */}
                  <path d="M0,150 L0,100 Q50,130 100,80 T200,60 T300,10 T400,90 T500,40 L500,150 Z" fill="#0ea5e9" className="chart-area" />
                  <path d="M0,150 L0,130 Q50,150 100,110 T200,90 T300,50 T400,130 T500,70 L500,150 Z" fill="#94a3b8" opacity="0.1" />
                  
                  {/* Lines */}
                  <path d="M0,100 Q50,130 100,80 T200,60 T300,10 T400,90 T500,40" stroke="#0ea5e9" className="chart-line" />
                  <path d="M0,130 Q50,150 100,110 T200,90 T300,50 T400,130 T500,70" stroke="#94a3b8" className="chart-line" />
                  
                  {/* Nodes */}
                  <circle cx="300" cy="10" r="5" fill="#fff" stroke="#0ea5e9" strokeWidth="3" />
                  <circle cx="400" cy="90" r="5" fill="#fff" stroke="#0ea5e9" strokeWidth="3" />
                </svg>
              </div>
            </div>

            {/* 2. AUDIENCE INSIGHTS */}
            <div className="d-card b-card-audience">
              <div className="d-card-header">
                <div className="d-card-title">Audience Insights</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, gap: '2rem' }}>
                <div style={{ position: 'relative', width: '140px', height: '140px' }}>
                  <svg viewBox="0 0 36 36" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#e2e8f0" strokeWidth="6"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#0ea5e9" strokeWidth="6" strokeDasharray="65 35" strokeDashoffset="0"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#38bdf8" strokeWidth="6" strokeDasharray="20 80" strokeDashoffset="-65"></circle>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#94a3b8" strokeWidth="6" strokeDasharray="15 85" strokeDashoffset="-85"></circle>
                  </svg>
                  <div style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#0f172a' }}>
                    <i className="fa-solid fa-users"></i>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0ea5e9' }}></div> High Intent (65%)</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#38bdf8' }}></div> Researching (20%)</div>
                  <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#94a3b8' }}></div> Casual (15%)</div>
                </div>
              </div>
            </div>

            {/* 3. CONVERSION FUNNEL */}
            <div className="d-card b-card-funnel">
              <div className="d-card-header">
                <div className="d-card-title">AI Conversion Funnel</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Traffic (Targeted)</div>
                  <div className="funnel-bar" style={{ width: '100%', opacity: 1 }}></div>
                </div>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>AI Filtering</div>
                  <div className="funnel-bar" style={{ width: '75%', opacity: 0.85 }}></div>
                </div>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Qualified Leads</div>
                  <div className="funnel-bar" style={{ width: '45%', opacity: 0.7 }}></div>
                </div>
                <div className="funnel-row">
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Conversion</div>
                  <div className="funnel-bar" style={{ width: '25%', opacity: 0.5, background: '#10b981' }}></div>
                </div>
              </div>
            </div>

            {/* 4. TRAFFIC SOURCES */}
            <div className="d-card b-card-traffic">
              <div className="d-card-header">
                <div className="d-card-title">Traffic Sources</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div className="traffic-row">
                  <div className="traffic-label">Google</div>
                  <div className="traffic-bar-bg"><div className="traffic-bar-fill" style={{ width: '85%' }}></div></div>
                </div>
                <div className="traffic-row">
                  <div className="traffic-label">Meta</div>
                  <div className="traffic-bar-bg"><div className="traffic-bar-fill" style={{ width: '60%', background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}></div></div>
                </div>
                <div className="traffic-row">
                  <div className="traffic-label">Direct</div>
                  <div className="traffic-bar-bg"><div className="traffic-bar-fill" style={{ width: '30%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div></div>
                </div>
              </div>
            </div>

            {/* 5. KPI 1 (From data.stats) */}
            <div className="d-card b-card-kpi-1">
              <div className="kpi-label">{data.stats[0] ? data.stats[0].label : 'Total Reach'}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div className="kpi-value">
                  {data.stats[0] ? data.stats[0].value : '63,980'}
                  <i className="fa-solid fa-arrow-trend-up kpi-trend"></i>
                </div>
              </div>
            </div>

            {/* 6. KPI 2 (From data.stats) */}
            <div className="d-card b-card-kpi-2">
              <div className="kpi-label">{data.stats[1] ? data.stats[1].label : 'Leads Generated'}</div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <div className="kpi-value">
                  {data.stats[1] ? data.stats[1].value : '1,256'}
                  <i className="fa-solid fa-arrow-trend-up kpi-trend"></i>
                </div>
              </div>
            </div>

            {/* 7. AI REC 1 (From data.aiPitches) */}
            <div className="d-card b-card-ai-1" style={{ padding: '1.25rem' }}>
              <div className="ai-rec-item">
                <div className="ai-rec-icon"><i className={\`fa-solid \${data.aiPitches[0] ? data.aiPitches[0].icon : 'fa-brain'}\`}></i></div>
                <div className="ai-rec-text">
                  <h4>{data.aiPitches[0] ? data.aiPitches[0].title : 'AI Optimization'}</h4>
                  <p>{data.aiPitches[0] ? data.aiPitches[0].desc : 'System is actively learning and optimizing.'}</p>
                </div>
              </div>
            </div>

            {/* 8. AI REC 2 (From data.aiPitches) */}
            <div className="d-card b-card-ai-2" style={{ padding: '1.25rem' }}>
              <div className="ai-rec-item">
                <div className="ai-rec-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}><i className={\`fa-solid \${data.aiPitches[1] ? data.aiPitches[1].icon : 'fa-bolt'}\`}></i></div>
                <div className="ai-rec-text">
                  <h4>{data.aiPitches[1] ? data.aiPitches[1].title : 'Smart Targeting'}</h4>
                  <p>{data.aiPitches[1] ? data.aiPitches[1].desc : 'Engaging high-intent users automatically.'}</p>
                </div>
              </div>
            </div>

            {/* 9. RECENT RESULTS (From data.caseStudy) */}
            <div className="d-card b-card-results">
              <div className="d-card-header">
                <div className="d-card-title">Case Study Results</div>
                <div className="d-card-menu"><i className="fa-solid fa-ellipsis"></i></div>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem', fontStyle: 'italic' }}>
                  "{data.caseStudy.client}" için alınan sonuçlar:
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>ROAS Oranı</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0ea5e9' }}>{data.caseStudy.resultRoas}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.8rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Müşteri (Lead)</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#0ea5e9' }}>{data.caseStudy.resultLeads}</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#475569' }}>Edinme Maliyeti</span>
                  <span style={{ fontSize: '1rem', fontWeight: '800', color: '#10b981' }}>{data.caseStudy.resultCpa}</span>
                </div>
              </div>
            </div>

          </div>
        </FadeIn>
      </div>
    </div>
  );
}
`

fs.writeFileSync('src/pages/SectorPageView.jsx', code);
console.log("Successfully rewrote SectorPageView.jsx for Dashboard layout.");
