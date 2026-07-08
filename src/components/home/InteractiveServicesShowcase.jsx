import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveServicesShowcase({ settingsData, servicesData, onServiceClick }) {
  const serviceKeys = Object.keys(servicesData || {});
  const [activeIndex, setActiveIndex] = useState(0);

  if (!serviceKeys.length) return null;

  const activeKey = serviceKeys[activeIndex] || serviceKeys[0];
  const activeService = servicesData[activeKey];

  return (
    <section id="services" className="py-24 bg-slate-50 overflow-hidden relative">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0284c7 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="mb-16 md:mb-24 text-center lg:text-left">
          <span className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 border border-primary/20 shadow-sm">
            {settingsData?.services_section_tag || "Uzmanlık Alanlarımız"}
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-3xl">
            {settingsData?.services_section_title || "Büyümenizi Hızlandıracak Çözümler"}
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-500 max-w-2xl font-medium">
            {settingsData?.services_section_desc || "E-ticaret ve dijital satış hunilerinde en yüksek verimi alabilmeniz için veriye dayalı stratejiler geliştiriyoruz."}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-20 items-start">
          
          {/* Left Column: Menu (Scrollable on mobile, sticky-ish on desktop) */}
          <div className="w-full lg:w-5/12 flex flex-col gap-2 relative z-20">
            {/* Vertical Line for tracking (Desktop) */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-200 rounded-full hidden lg:block"></div>
            
            {serviceKeys.map((key, index) => {
              const isActive = index === activeIndex;
              return (
                <div 
                  key={key}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => onServiceClick(key)}
                  className={`relative pl-0 lg:pl-10 py-4 lg:py-6 cursor-pointer transition-all duration-300 group ${isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'}`}
                >
                  {/* Active Indicator Line (Desktop) */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeServiceIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full hidden lg:block"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <div className="flex items-center gap-4 lg:block">
                    {/* Icon for mobile only */}
                    <div className={`lg:hidden w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                      <i className={servicesData[key].iconName || "fa-solid fa-compass"}></i>
                    </div>
                    
                    <h3 className={`text-2xl md:text-3xl font-extrabold transition-all duration-300 ${isActive ? 'text-primary lg:translate-x-3' : 'text-slate-900 lg:translate-x-0'}`}>
                      {servicesData[key].title}
                    </h3>
                  </div>

                  {/* Show description on mobile via accordion */}
                  <div 
                    className="lg:hidden overflow-hidden transition-all duration-500 ease-in-out" 
                    style={{ maxHeight: isActive ? '500px' : '0px', opacity: isActive ? 1 : 0, marginTop: isActive ? '1rem' : '0' }}
                  >
                     <p className="text-slate-600 mb-4 text-base font-medium pl-16">{servicesData[key].description}</p>
                     <button className="text-primary font-bold text-sm pl-16" onClick={(e) => { e.stopPropagation(); onServiceClick(key); }}>
                       Stratejiyi İncele <i className="fa-solid fa-arrow-right ml-1"></i>
                     </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Interactive Showcase Box (Desktop only) */}
          <div className="hidden lg:block w-full lg:w-7/12 sticky top-32">
            <div className="relative w-full min-h-[550px] bg-white rounded-[2.5rem] border border-slate-200/80 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden flex flex-col p-14 group">
              
              {/* Soft decorative glows */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 transition-all duration-1000 group-hover:bg-primary/10"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 transition-all duration-1000 group-hover:bg-secondary/10"></div>

              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeKey}
                  initial={{ opacity: 0, y: 30, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -30, filter: 'blur(4px)' }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="relative z-10 w-full flex flex-col h-full flex-grow"
                >
                  <div className="w-24 h-24 rounded-[1.25rem] bg-slate-50 border border-slate-100 flex items-center justify-center mb-10 shadow-sm transition-transform hover:scale-105">
                    <i className={`${activeService.iconName || "fa-solid fa-compass"} text-[2.5rem] text-primary drop-shadow-sm`}></i>
                  </div>
                  
                  <h3 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">
                    {activeService.title}
                  </h3>
                  
                  <p className="text-slate-500 text-xl leading-relaxed mb-12 font-medium max-w-lg">
                    {activeService.description}
                  </p>

                  {activeService.features && activeService.features.length > 0 && (
                    <ul className="grid grid-cols-2 gap-x-8 gap-y-4 mb-auto">
                      {activeService.features.slice(0, 4).map((f, idx) => (
                        <li key={idx} className="flex items-start text-[0.95rem] font-semibold text-slate-700 leading-snug">
                          <i className="fa-solid fa-check text-primary mt-1 mr-3 opacity-80 text-sm"></i> 
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <i className="fa-solid fa-chart-line text-slate-500 text-sm"></i>
                      </div>
                      <span className="text-slate-500 font-semibold text-sm">Veri Odaklı Büyüme</span>
                    </div>
                    
                    <button 
                      onClick={() => onServiceClick(activeKey)}
                      className="group/btn flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary transition-colors shadow-lg hover:shadow-primary/30"
                    >
                      Detayları Gör 
                      <i className="fa-solid fa-arrow-right transition-transform group-hover/btn:translate-x-1"></i>
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
