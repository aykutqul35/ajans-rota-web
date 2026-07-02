const fs = require('fs');

let content = fs.readFileSync('src/pages/SectorPageView.jsx', 'utf8');

const newAIPitchesSection = `
      {/* AI PITCHES (HOW WE DO IT) - ADVANCED BENTO BOX */}
      <section style={{ padding: '6rem 5%', background: '#f8fafc', position: 'relative', overflow: 'hidden' }}>
        <style>
          {\`
            .bento-grid {
              display: grid;
              grid-template-columns: 1fr;
              gap: 2rem;
              position: relative;
              z-index: 2;
            }
            @media (min-width: 992px) {
              .bento-grid {
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: auto auto;
              }
              .bento-item-0 {
                grid-column: span 2;
                grid-row: span 2;
              }
              .bento-item-1 {
                grid-column: span 1;
              }
              .bento-item-2 {
                grid-column: span 1;
              }
            }
            .bento-card {
              background: rgba(255, 255, 255, 0.7);
              backdrop-filter: blur(20px);
              -webkit-backdrop-filter: blur(20px);
              border: 1px solid rgba(14, 165, 233, 0.15);
              border-radius: 24px;
              padding: 3rem;
              position: relative;
              overflow: hidden;
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              box-shadow: 0 10px 40px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(255,255,255,0.5);
              display: flex;
              flex-direction: column;
              justify-content: space-between;
            }
            .bento-card:hover {
              transform: translateY(-5px);
              box-shadow: 0 20px 40px rgba(14, 165, 233, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8);
              border-color: rgba(14, 165, 233, 0.3);
            }
            .bento-card::before {
              content: '';
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              background-image: radial-gradient(circle at 100% 100%, rgba(14, 165, 233, 0.05) 0%, transparent 50%);
              z-index: 0;
              pointer-events: none;
            }
            .bento-content {
              position: relative;
              z-index: 1;
            }
            .ai-badge {
              display: inline-flex;
              align-items: center;
              gap: 8px;
              padding: 6px 12px;
              background: rgba(16, 185, 129, 0.1);
              color: #10b981;
              border-radius: 30px;
              font-size: 0.75rem;
              font-weight: 700;
              letter-spacing: 0.5px;
              margin-bottom: 2rem;
              border: 1px solid rgba(16, 185, 129, 0.2);
            }
            .ai-badge .dot {
              width: 6px;
              height: 6px;
              background: #10b981;
              border-radius: 50%;
              animation: blink 1.5s infinite;
            }
            @keyframes blink {
              0% { opacity: 0.2; }
              50% { opacity: 1; box-shadow: 0 0 8px #10b981; }
              100% { opacity: 0.2; }
            }
            .gradient-text {
              background: linear-gradient(135deg, #0f172a 0%, var(--primary) 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
            .animated-grid-bg {
              position: absolute;
              top: 0; left: 0; right: 0; bottom: 0;
              background-image: 
                linear-gradient(rgba(14,165,233,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(14,165,233,0.03) 1px, transparent 1px);
              background-size: 30px 30px;
              z-index: 1;
              transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
              opacity: 0.5;
            }
          \`}
        </style>
        
        <div className="animated-grid-bg"></div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', z-index: 2 }}>
          <FadeIn direction="up">
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', background: 'rgba(14,165,233,0.05)', color: 'var(--primary)', borderRadius: '20px', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem' }}>
                ROTA AI ENGINE™
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '900', color: '#0f172a' }}>
                Yapay Zeka <span className="gradient-text">Nasıl Çözer?</span>
              </h2>
            </div>
          </FadeIn>

          <StaggerContainer className="bento-grid">
            {data.aiPitches.map((pitch, idx) => (
              <StaggerItem key={idx} className={\`bento-item-\${idx}\`}>
                <div className="bento-card">
                  <div className="bento-content">
                    <div className="ai-badge">
                      <div className="dot"></div>
                      SİSTEM AKTİF
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.5rem', marginBottom: '1.5rem' }}>
                      <div style={{ 
                        width: idx === 0 ? '70px' : '50px', 
                        height: idx === 0 ? '70px' : '50px', 
                        borderRadius: '16px', 
                        background: 'linear-gradient(135deg, rgba(14,165,233,0.1) 0%, rgba(14,165,233,0.05) 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        border: '1px solid rgba(14,165,233,0.2)',
                        flexShrink: 0
                      }}>
                        <i className={\`fa-solid \${pitch.icon}\`} style={{ fontSize: idx === 0 ? '2rem' : '1.5rem', color: 'var(--primary)' }}></i>
                      </div>
                      <h3 style={{ fontSize: idx === 0 ? '1.8rem' : '1.3rem', fontWeight: '800', color: '#0f172a', margin: 0, alignSelf: 'center', lineHeight: '1.3' }}>
                        {pitch.title}
                      </h3>
                    </div>
                    
                    <p style={{ color: '#475569', lineHeight: '1.8', fontSize: idx === 0 ? '1.15rem' : '1rem', fontWeight: '500' }}>
                      {pitch.desc}
                    </p>
                    
                    {idx === 0 && (
                       <div style={{ marginTop: '2.5rem', padding: '1.5rem', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                         <div style={{ flex: 1 }}>
                           <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 'bold', marginBottom: '8px' }}>YAPAY ZEKA VERİ İŞLEME</div>
                           <div style={{ height: '6px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                             <div style={{ width: '85%', height: '100%', background: 'linear-gradient(90deg, var(--primary) 0%, #38bdf8 100%)', borderRadius: '4px' }}></div>
                           </div>
                         </div>
                         <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)' }}>%85</div>
                       </div>
                    )}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>
`;

const oldSectionRegex = /\{\/\* AI PITCHES \(HOW WE DO IT\) \*\/\}.*?<\/section>/s;

if (oldSectionRegex.test(content)) {
  content = content.replace(oldSectionRegex, newAIPitchesSection.trim());
  fs.writeFileSync('src/pages/SectorPageView.jsx', content);
  console.log("Successfully replaced AI Pitches section.");
} else {
  console.log("Could not find the AI Pitches section to replace.");
}

