import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const logDatabase = [
  { agent: "Nova AI", type: "INTERVENTION", msg: "Arama Ağı tıklama maliyetlerinde %18 artış tespit edildi. Bütçe otonom olarak YouTube Shorts'a kaydırıldı.", metric: "ROAS Korundu" },
  { agent: "Lexis AI", type: "ANALYSIS", msg: "Meta Ads kreatiflerinde 'reklam yorgunluğu' (ad fatigue) algılandı. Alternatif setler %85 güven skoruyla yayına alındı.", metric: "CTR +%2.4" },
  { agent: "Nova AI", type: "WARNING", msg: "Rakip firmanın agresif teklif artışı tespit edildi. Hedef ROAS stratejisi tROAS üzerinden esnetildi.", metric: "Gösterim Payı %88" },
  { agent: "Lexis AI", type: "EXECUTION", msg: "Sepeti terk etme anomalisi işlendi. 'cart_abandoners' kitlesine özel %5 indirimli retargeting başlatıldı.", metric: "CPA Düşüşü Öngörüsü" },
  { agent: "Nova AI", type: "SECURITY", msg: "Geçersiz tıklama (Click Fraud) sızıntıları algılandı. 14 adet şüpheli IP adresi ağ düzeyinde bloklandı.", metric: "-2,450₺ Kayıp Önlendi" },
  { agent: "Lexis AI", type: "SCALING", msg: "İlgili arama terimlerinde (search terms) hacim artışı var. Günlük bütçe tavanı otonom olarak esnetildi.", metric: "Trafik +%35" },
  { agent: "Nova AI", type: "OPTIMIZATION", msg: "Video A/B Testi Sonucu: Varyasyon B %24 daha düşük CPL getirdi. Trafiğin %100'ü Varyasyon B'ye yönlendirildi.", metric: "CPL -%24" },
  { agent: "Lexis AI", type: "SEO_SYNC", msg: "Rakip boşluk analizi (Gap Analysis): Rakiplerin organik sıralama kaybettiği 4 anahtar kelimede agresif reklam çıkıldı.", metric: "Pazar Payı Kazanımı" },
  { agent: "Nova AI", type: "PREDICTIVE", msg: "Meteorolojik veri entegrasyonu: Hafta sonu beklenen yoğun yağışa bağlı e-ticaret talebi modellendi. Bütçe artırılıyor.", metric: "Talep Tahmini %92" },
  { agent: "Lexis AI", type: "LEARNING", msg: "Akıllı teklif stratejisi model eğitimi tamamlandı. Algoritma artık mikro-dönüşümleri de ana hedef olarak sayıyor.", metric: "Model Doğruluğu %96.4" },
  { agent: "Nova AI", type: "FILTERING", msg: "PMax (Maksimum Performans) kampanyasında alakasız yerleşimler (placements) otonom olarak temizlendi.", metric: "Bütçe Verimliliği" },
  { agent: "Lexis AI", type: "UX_SYNC", msg: "Ortalama oturum süresi düştü. Dinamik açılış sayfası (Dynamic LP) hızı sunucu tarafında optimize edildi.", metric: "LCP < 1.2s" },
  { agent: "Nova AI", type: "EXPLORATION", msg: "TikTok Ads API entegrasyon sinyali: Z kuşağı etkileşim ivmesi tespit edildi. Bütçenin %15'i bu kanala kaydırıldı.", metric: "Yeni Kitle Erişimi" },
  { agent: "Lexis AI", type: "SCHEDULING", msg: "Hafta sonu dönüşüm maliyetleri limitin üzerinde. Reklam yayın planı (Ad Schedule) hafta içi yoğunluklu revize edildi.", metric: "CPA Optimizasyonu" }
];

const generateHexAddress = () => {
  return '0x' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0').toUpperCase();
};

const getBadgeColor = (type) => {
  switch(type) {
    case 'INTERVENTION': return '#f59e0b'; // Amber
    case 'ANALYSIS': return '#3b82f6'; // Blue
    case 'WARNING': return '#ef4444'; // Red
    case 'EXECUTION': return '#10b981'; // Emerald
    case 'SECURITY': return '#8b5cf6'; // Purple
    case 'SCALING': return '#06b6d4'; // Cyan
    default: return '#10b981';
  }
};

export default function AILiveTerminal() {
  const [currentLogs, setCurrentLogs] = useState([]);

  useEffect(() => {
    const initial = [];
    for(let i=0; i<3; i++) {
      const data = logDatabase[Math.floor(Math.random() * logDatabase.length)];
      initial.push({
        id: Date.now() + i,
        time: new Date(Date.now() - (3-i)*7000).toLocaleTimeString('tr-TR', { hour12: false }),
        address: generateHexAddress(),
        ...data
      });
    }
    setCurrentLogs(initial);

    const interval = setInterval(() => {
      const data = logDatabase[Math.floor(Math.random() * logDatabase.length)];
      const newLog = {
        id: Date.now(),
        time: new Date().toLocaleTimeString('tr-TR', { hour12: false }),
        address: generateHexAddress(),
        ...data
      };
      
      setCurrentLogs(prev => {
        const next = [...prev, newLog];
        if(next.length > 4) next.shift(); // Keep last 4 for dense look
        return next;
      });
    }, 6500); // Slower interval for readability and realism

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="ai-terminal" style={{ margin: '1.5rem 0', background: '#020617', borderRadius: '12px', border: '1px solid var(--glass-border)', padding: '1rem', boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)' }}>
      {/* Terminal Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px dashed rgba(14, 165, 233, 0.3)', paddingBottom: '0.75rem' }}>
        <i className="fa-solid fa-satellite-dish ai-glitch-text" style={{ color: 'var(--cyber-blue)', fontSize: '1.1rem' }}></i>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '1.5px', color: 'var(--text-main)' }}>ROTA AI CORE // LIVE TELEMETRY</span>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>CONNECTION: SECURE | LATENCY: 14ms | ENGINE: ONLINE</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="pulse-glow" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--cyber-green)' }}></div>
          <span style={{ fontSize: '0.7rem', color: 'var(--cyber-green)', fontFamily: 'monospace', fontWeight: 600 }}>SYNCING</span>
        </div>
      </div>
      
      {/* Terminal Logs Area */}
      <div style={{ minHeight: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '0.5rem' }}>
        <AnimatePresence initial={false}>
          {currentLogs.map(log => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: -15, height: 0 }}
              animate={{ opacity: 1, x: 0, height: 'auto' }}
              exit={{ opacity: 0, scale: 0.98, height: 0, filter: 'blur(2px)' }}
              transition={{ duration: 0.4 }}
              style={{ display: 'flex', flexDirection: 'column', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', borderLeft: `2px solid ${getBadgeColor(log.type)}` }}
            >
              {/* Meta row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', fontFamily: 'monospace', fontSize: '0.7rem' }}>
                <span style={{ color: 'var(--text-muted)' }}>{log.time}</span>
                <span style={{ color: 'var(--text-muted)', opacity: 0.5 }}>{log.address}</span>
                <span style={{ 
                  color: getBadgeColor(log.type), 
                  border: `1px solid ${getBadgeColor(log.type)}40`,
                  background: `${getBadgeColor(log.type)}15`,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  letterSpacing: '0.5px'
                }}>
                  [{log.type}]
                </span>
                <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                  {log.metric}
                </span>
              </div>
              
              {/* Message row */}
              <div style={{ fontSize: '0.85rem', lineHeight: '1.4', fontFamily: 'var(--font-body)' }}>
                <strong style={{ color: log.agent === 'Nova AI' ? 'var(--cyber-blue)' : 'var(--cyber-purple)', marginRight: '6px', textShadow: `0 0 5px ${log.agent === 'Nova AI' ? 'rgba(14,165,233,0.5)' : 'rgba(168,85,247,0.5)'}` }}>
                  {log.agent}:
                </strong>
                <span style={{ color: 'var(--text-light)' }}>
                  {log.msg}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
