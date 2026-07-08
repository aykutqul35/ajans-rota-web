import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TypewriterText = ({ text = "" }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    if (!text) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15); 
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}<span className="animate-pulse font-bold text-primary">|</span></span>;
};

const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useEffect(() => {
    function updateSize() { setSize([window.innerWidth, window.innerHeight]); }
    window.addEventListener('resize', updateSize);
    updateSize();
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export default function AiCommandCenter({ settingsData, servicesData, onServiceClick }) {
  const serviceKeys = Object.keys(servicesData || {});
  const [activeKey, setActiveKey] = useState(serviceKeys[0]);
  const [windowWidth] = useWindowSize();
  const isMobile = windowWidth > 0 && windowWidth < 1024;

  if (!serviceKeys.length) return null;

  const activeService = servicesData[activeKey];
  const activeIndex = serviceKeys.indexOf(activeKey);
  
  // Calculate rotation for the compass needle.
  const compassRotation = (activeIndex / serviceKeys.length) * 360;

  // Custom positioning for 6 nodes to prevent overlap on mobile screens
  // We place them in a rough 3x2 oval/grid to fit portrait mode perfectly.
  const getMobilePos = (index) => {
    const pos = [
      { x: 25, y: 12 }, // 0: Top Left
      { x: 75, y: 12 }, // 1: Top Right
      { x: 82, y: 50 }, // 2: Mid Right
      { x: 75, y: 88 }, // 3: Bot Right
      { x: 25, y: 88 }, // 4: Bot Left
      { x: 18, y: 50 }, // 5: Mid Left
    ];
    return pos[index % 6];
  };

  return (
    <section id="services" className="py-24 bg-slate-50 text-slate-900 overflow-hidden relative border-y border-slate-200/60">
      
      {/* Subtle Background Cyber Grid (Light Theme) */}
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(2, 132, 199, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(2, 132, 199, 0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_0%,#f8fafc_80%)]"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[60px] rounded-full pointer-events-none"></div>
          
          <span className="inline-block px-5 py-2 rounded-full bg-white text-primary font-bold text-sm mb-6 border border-primary/20 shadow-sm uppercase tracking-wider">
            <i className="fa-solid fa-microchip mr-2"></i> Rota AI Core v2.0
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            {settingsData?.services_section_title || "Büyümenizi Hızlandıracak Çözümler"}
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
            Otonom karar alma mekanizmalarıyla güçlendirilmiş, veriye dayalı dijital büyüme ekosistemi.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-8 items-center lg:items-stretch max-w-7xl mx-auto">
          
          {/* Left: Neural Core Network (Visual) */}
          <div className="w-full lg:w-1/2 flex items-center justify-center overflow-visible py-4 lg:py-0">
            {/* Taller container on mobile to accommodate the 3 rows of nodes */}
            <div className="relative w-full max-w-[380px] h-[550px] lg:max-w-none md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px] my-4 lg:my-0">
               
               {/* Render SVG Connecting Wires */}
               <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible">
                  {serviceKeys.map((key, i) => {
                    let x, y;
                    if (isMobile) {
                      const pos = getMobilePos(i);
                      x = pos.x; y = pos.y;
                    } else {
                      const angle = (Math.PI * 2 * i) / serviceKeys.length - Math.PI / 2;
                      const r = 38;
                      x = 50 + r * Math.cos(angle);
                      y = 50 + r * Math.sin(angle);
                    }
                    const isActive = key === activeKey;
                    return (
                      <g key={`wire-${key}`}>
                        {/* Dim base wire */}
                        <line 
                          x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`}
                          stroke="rgba(148, 163, 184, 0.3)" // slate-400 with opacity
                          strokeWidth="2"
                        />
                        {/* Active glowing wire */}
                        {isActive && (
                          <line 
                            x1="50%" y1="50%" x2={`${x}%`} y2={`${y}%`}
                            stroke="var(--color-primary, #0284c7)"
                            strokeWidth="3"
                            className="drop-shadow-[0_0_8px_rgba(2,132,199,0.4)]"
                            strokeDasharray="4 4"
                            initial={{ strokeDashoffset: 100 }}
                            animate={{ strokeDashoffset: 0 }}
                          />
                        )}
                      </g>
                    )
                  })}
               </svg>
               
               {/* The Central AI Brain / Compass */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 md:w-28 md:h-28 rounded-full bg-white border-2 border-primary/40 shadow-[0_0_40px_rgba(2,132,199,0.2)] flex items-center justify-center z-20">
                 
                 {/* Rotating Compass SVG */}
                 <div 
                   className="absolute inset-0 flex items-center justify-center transition-transform duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)]"
                   style={{ transform: `rotate(${compassRotation}deg)` }}
                 >
                   <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary drop-shadow-md">
                     {/* Compass Needle Pointing UP */}
                     <path d="M12 2L15 12L12 22L9 12L12 2Z" fill="currentColor" opacity="0.9"/>
                     <path d="M12 2L15 12L12 12L12 2Z" fill="#0369a1" /> {/* Darker right half for 3D effect */}
                   </svg>
                 </div>
                 
                 {/* Orbital UI rings */}
                 <div className="absolute inset-[-15px] md:inset-[-20px] rounded-full border border-primary/20 animate-[spin_4s_linear_infinite] pointer-events-none"></div>
                 <div className="absolute inset-[-30px] md:inset-[-40px] rounded-full border border-dashed border-primary/15 animate-[spin_8s_linear_infinite_reverse] pointer-events-none"></div>
               </div>

               {serviceKeys.map((key, i) => {
                    let x, y;
                    if (isMobile) {
                      const pos = getMobilePos(i);
                      x = pos.x; y = pos.y;
                    } else {
                      const angle = (Math.PI * 2 * i) / serviceKeys.length - Math.PI / 2;
                      const r = 38;
                      x = 50 + r * Math.cos(angle);
                      y = 50 + r * Math.sin(angle);
                    }
                    const isActive = key === activeKey;

                    return (
                      <div 
                        key={key}
                        onMouseEnter={() => setActiveKey(key)}
                        onClick={() => setActiveKey(key)}
                        className={`absolute w-[130px] h-[76px] md:w-40 md:h-20 -ml-[65px] -mt-[38px] md:-ml-20 md:-mt-10 flex items-center justify-center cursor-pointer transition-all duration-500 z-30 group`}
                        style={{ top: `${y}%`, left: `${x}%` }}
                      >
                        <div className={`px-2 py-2 w-full h-full text-center rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col items-center justify-center gap-1.5 shadow-sm ${isActive ? 'bg-white border-primary shadow-[0_10px_25px_rgba(2,132,199,0.15)] scale-110 z-40' : 'bg-white/80 border-slate-200/80 text-slate-500 hover:border-primary/40 hover:text-primary hover:bg-white hover:shadow-md'}`}>
                          <i className={`${servicesData[key].iconName || 'fa-solid fa-microchip'} text-xl md:text-2xl transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}></i>
                          <span className={`text-[10px] md:text-[11px] font-bold uppercase tracking-widest leading-tight ${isActive ? 'text-slate-800' : 'text-slate-500'}`}>{servicesData[key].title}</span>
                        </div>
                      </div>
                    )
               })}
            </div>
          </div>

          {/* Right: Clean AI Analysis Panel */}
          <div className="w-full lg:w-1/2 flex items-center">
            <div className="w-full h-[450px] md:h-[500px] bg-white/90 backdrop-blur-xl border border-slate-200/80 rounded-3xl overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] flex flex-col relative z-20">
              
              {/* Fake UI Header */}
              <div className="h-14 bg-slate-50/80 border-b border-slate-100 flex items-center px-6 justify-between shrink-0">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-200"></div>
                </div>
                <div className="text-slate-400 font-bold text-xs tracking-widest flex items-center gap-2">
                  <i className="fa-solid fa-bolt text-primary"></i> YAPAY ZEKA ANALİZİ
                </div>
                <div className="w-12 text-right text-slate-300 font-mono text-xs">v2.0</div> 
              </div>

              {/* Panel Body */}
              <div className="flex-1 p-8 md:p-10 overflow-y-auto relative custom-scrollbar">
                <AnimatePresence mode="wait">
                  <motion.div 
                    key={activeKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-8"
                  >
                    
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 mb-4">{activeService.title}</h3>
                      <div className="border-l-4 border-primary pl-5 py-1 text-slate-600 text-lg font-medium leading-relaxed min-h-[80px]">
                        <TypewriterText text={activeService.description} />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <div className="text-primary font-bold mb-4 text-sm tracking-wide uppercase">AI Destekli Çözümlerimiz:</div>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-6">
                        {(activeService.features || []).map((f, idx) => (
                          <motion.li 
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (idx * 0.1) }}
                            className="flex items-start text-slate-700 text-sm font-medium"
                          >
                            <span className="text-primary mr-3 mt-0.5"><i className="fa-solid fa-circle-check"></i></span> 
                            <span>{f}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Panel Footer */}
              <div className="p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 flex justify-end">
                 <button 
                   onClick={() => onServiceClick(activeKey)}
                   className="bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-[0_10px_20px_rgba(2,132,199,0.2)] hover:shadow-[0_15px_30px_rgba(2,132,199,0.3)] hover:-translate-y-0.5 flex items-center gap-3 group"
                 >
                   Stratejiyi İncele <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-1"></i>
                 </button>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
