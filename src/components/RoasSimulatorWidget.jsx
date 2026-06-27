import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const SECTORS = [
  { id: 'tekstil', label: 'Tekstil & Giyim', multiplier: 6.5 },
  { id: 'gida', label: 'Gıda & Tarım', multiplier: 4.2 },
  { id: 'mobilya', label: 'Mobilya & Dekorasyon', multiplier: 5.8 },
  { id: 'kozmetik', label: 'Kozmetik & Sağlık', multiplier: 7.1 },
  { id: 'b2b', label: 'B2B Endüstriyel', multiplier: 3.5 }
];

export default function RoasSimulatorWidget({ onSaveLead }) {
  const [budget, setBudget] = useState(20000);
  const [sector, setSector] = useState('tekstil');
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const selectedSector = SECTORS.find(s => s.id === sector) || SECTORS[0];

  // Generate chart data based on budget and sector
  const chartData = useMemo(() => {
    const data = [];
    let currentRevenue = budget * 1.5; // Start baseline
    
    for (let month = 1; month <= 6; month++) {
      // Exponential growth curve simulation
      const growthFactor = 1 + (selectedSector.multiplier * 0.05 * month);
      currentRevenue = currentRevenue * growthFactor;
      
      data.push({
        month: `${month}. Ay`,
        ciro: Math.round(currentRevenue)
      });
    }
    return data;
  }, [budget, selectedSector]);

  const expectedRoas = selectedSector.multiplier.toFixed(1);
  const finalRevenue = chartData[5].ciro;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) {
      if (typeof onSaveLead === 'function') {
        onSaveLead({
          fullName: 'ROAS Simülatörü Ziyaretçisi',
          email: email,
          phone: '',
          company: selectedSector.label,
          service: 'ROAS Simülasyon Raporu Talebi',
          message: `Aylık Bütçe: ${budget} TL\nBeklenen ROAS: ${expectedRoas}x\nHedef Ciro: ${new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY' }).format(finalRevenue)}`,
          trafficSource: 'Büyüme Simülatörü'
        });
      }
      setIsSubmitted(true);
    }
  };

  return (
    <div className="roas-simulator-widget glass-card" style={{
      padding: '2rem',
      borderRadius: '24px',
      margin: '2rem auto',
      maxWidth: '1000px',
      display: 'flex',
      flexDirection: 'column',
      gap: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <style>{`
        @media (max-width: 768px) {
          .roas-simulator-widget {
            padding: 1.25rem !important;
            margin: 1rem auto !important;
          }
          .roas-simulator-widget h2 {
            fontSize: 1.5rem !important;
          }
        }
      `}</style>
      {/* Decorative background glow */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, rgba(0,0,0,0) 70%)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
        <span className="section-tag" style={{ margin: '0 auto 1rem' }}>Yapay Zeka Destekli Büyüme Simülatörü</span>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.5rem' }}>E-İhracat ve Satış Potansiyelinizi Keşfedin</h2>
        <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
          Sektörünüzü ve aylık reklam bütçenizi seçin. Yapay zeka tabanlı algoritmamız, Ajans Rota'nın veri odaklı stratejileriyle 6 ay içindeki tahmini ciro büyümenizi hesaplasın.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', position: 'relative', zIndex: 1 }}>
        {/* Left: Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', backgroundColor: 'var(--bg-light)', padding: '1.5rem', borderRadius: '16px' }}>
          
          <div>
            <label style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              Aylık Reklam Bütçesi
              <span style={{ color: 'var(--primary)' }}>{new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(budget)}</span>
            </label>
            <input 
              type="range" 
              min="5000" 
              max="500000" 
              step="5000"
              value={budget} 
              onChange={(e) => setBudget(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              Sektörünüz
            </label>
            <select 
              value={sector} 
              onChange={(e) => setSector(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.75rem', 
                borderRadius: '8px', 
                border: '1px solid rgba(0,0,0,0.1)',
                backgroundColor: '#fff',
                fontSize: '1rem',
                color: 'var(--text-dark)'
              }}
            >
              {SECTORS.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'rgba(56, 189, 248, 0.1)', borderRadius: '12px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '0.875rem', color: 'var(--text-light)', marginBottom: '4px' }}>Tahmini Hedef ROAS</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--primary)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              {expectedRoas}x
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-light)', margin: '8px 0 0' }}>*Sektör ortalamalarına göre hesaplanmıştır.</p>
          </div>

        </div>

        {/* Right: Chart */}
        <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', color: 'var(--text-dark)', textAlign: 'center' }}>6 Aylık Tahmini Ciro Projeksiyonu</h3>
          <div style={{ height: '250px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCiro" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `₺${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip 
                  formatter={(value) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value)}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="ciro" stroke="#38bdf8" strokeWidth={3} fillOpacity={1} fill="url(#colorCiro)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom: Lead Capture Form */}
      <div style={{ position: 'relative', zIndex: 1, backgroundColor: 'var(--primary)', borderRadius: '16px', padding: '2rem', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '1rem' }}>
        {!isSubmitted ? (
          <>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>6. Ayın Sonunda Tahmini Ciro: {new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(finalRevenue)}</h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0 }}>Rakiplerinizin önüne geçmek ve detaylı büyüme yol haritanızı ücretsiz almak için e-posta adresinizi bırakın.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="roas-form" style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '500px', marginTop: '1rem' }}>
              <style>{`
                @media (max-width: 576px) {
                  .roas-form { flex-direction: column; }
                }
              `}</style>
              <input 
                type="email" 
                placeholder="sirket@mail.com" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: 'none', outline: 'none', fontSize: '1rem', color: '#000' }}
              />
              <button type="submit" style={{ backgroundColor: 'var(--secondary)', color: 'var(--text-dark)', fontWeight: 'bold', padding: '1rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                Raporu Gönder
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#fff', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', margin: '0 auto 1rem' }}>
              <i className="fa-solid fa-check"></i>
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#fff' }}>Talebiniz Alındı!</h3>
            <p style={{ color: 'rgba(255,255,255,0.9)' }}>Yapay zeka analizli detaylı büyüme projeksiyonunuz e-posta adresinize gönderilecektir. Hızlı iletişim için Rota AI asistanı kullanabilirsiniz.</p>
          </motion.div>
        )}
      </div>

    </div>
  );
}
