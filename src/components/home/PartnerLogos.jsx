import React from 'react';
import { motion } from 'framer-motion';

// External real logos from Wikipedia and Official CDNs
const PartnerImages = {
  google: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
  meta: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg",
  tiktok: "https://upload.wikimedia.org/wikipedia/en/a/a9/TikTok_logo.svg",
  shopify: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
  amazon: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg"
};

// Inline SVGs for local brands to bypass all AdBlock/CORS issues and guarantee 100% visibility.
// These are crafted to closely match the original brand typography.
const PartnerSVGs = {
  n11: () => (
    <svg viewBox="0 0 200 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="50" y="55" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="48" fill="#5C2D91" letterSpacing="-2">n</text>
      <text x="78" y="55" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="48" fill="#E31837" letterSpacing="-2">11</text>
    </svg>
  ),
  ciceksepeti: () => (
    <svg viewBox="0 0 200 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="5" y="52" fontFamily="'Segoe UI', Roboto, Helvetica, sans-serif" fontWeight="800" fontSize="28" fill="#013A81" letterSpacing="-1">çiçeksepeti</text>
    </svg>
  ),
  ideasoft: () => (
    <svg viewBox="0 0 200 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="20" y="52" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="34" fill="#004C97" letterSpacing="-1">IdeaSoft</text>
    </svg>
  ),
  ticimax: () => (
    <svg viewBox="0 0 200 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="25" y="52" fontFamily="'Segoe UI', Roboto, Helvetica, sans-serif" fontWeight="900" fontSize="34" fill="#E30613" letterSpacing="-1">Ticimax</text>
    </svg>
  ),
  tsoft: () => (
    <svg viewBox="0 0 200 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="35" y="52" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="36" fill="#00478F" letterSpacing="-2">T-</text>
      <text x="72" y="52" fontFamily="Arial, sans-serif" fontWeight="900" fontSize="36" fill="#F15A24" letterSpacing="-1">Soft</text>
    </svg>
  ),
  ikas: () => (
    <svg viewBox="0 0 200 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <text x="60" y="55" fontFamily="'Segoe UI', Roboto, Helvetica, sans-serif" fontWeight="800" fontSize="42" fill="#000000" letterSpacing="-2">ikas</text>
    </svg>
  )
};

export default function PartnerLogos({ settingsData }) {
  // Check if there is data from admin panel, if not use fallback default list
  const defaultPartners = [
    { id: 'google', name: 'Google Partner', type: 'Reklam Ağı' },
    { id: 'meta', name: 'Meta Business', type: 'Reklam Ağı' },
    { id: 'tiktok', name: 'TikTok Ads', type: 'Reklam Ağı' },
    { id: 'trendyol', name: 'Trendyol', type: 'Pazaryeri' },
    { id: 'hepsiburada', name: 'Hepsiburada', type: 'Pazaryeri' },
    { id: 'shopify', name: 'Shopify', type: 'Altyapı' },
    { id: 'ideasoft', name: 'IdeaSoft', type: 'Altyapı' },
    { id: 'ticimax', name: 'Ticimax', type: 'Altyapı' },
    { id: 'tsoft', name: 'T-Soft', type: 'Altyapı' },
    { id: 'ikas', name: 'İkas', type: 'Altyapı' },
    { id: 'n11', name: 'N11', type: 'Pazaryeri' },
    { id: 'ciceksepeti', name: 'Çiçeksepeti', type: 'Pazaryeri' },
    { id: 'amazon', name: 'Amazon', type: 'Pazaryeri' },
  ];

  // Try to read active partners from settings string (e.g. "google,meta,trendyol")
  // Or just use the default array for now. Admin panel integration will toggle these.
  const activePartnerIds = settingsData?.active_partners 
    ? settingsData.active_partners.split(',') 
    : defaultPartners.map(p => p.id);

  const visiblePartners = defaultPartners.filter(p => activePartnerIds.includes(p.id));

  // Split into two rows for a more advanced, dense grid feel
  const half = Math.ceil(visiblePartners.length / 2);
  const row1 = visiblePartners.slice(0, half);
  const row2 = visiblePartners.slice(half);

  // Duplicate for infinite scroll
  const marquee1Items = [...row1, ...row1, ...row1, ...row1];
  const marquee2Items = [...row2, ...row2, ...row2, ...row2];

  // Container variants for text animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-slate-50 border-y border-slate-200">
      {/* Advanced Background Gradients & Grid */}
      
      {/* Background glowing orbs matching brand colors */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-[128px] pointer-events-none"></div>

      <motion.div 
        className="container mx-auto px-4 mb-20 md:mb-28 relative z-10 text-center"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        <motion.span variants={itemVariants} className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary font-bold text-xs uppercase tracking-wider mb-5 border border-primary/20 backdrop-blur-md shadow-sm">
          Entegre Büyüme Ekosistemi
        </motion.span>
        <motion.h2 variants={itemVariants} className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight">
          Resmi Partnerliklerimiz ve <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-accent">
            Uçtan Uca Entegrasyon Ağımız
          </span>
        </motion.h2>
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed mt-4">
          Dijital büyüme yolculuğunuzda, Türkiye'nin ve dünyanın en büyük altyapılarıyla tam entegre çalışarak kesintisiz veri akışı ve yüksek performans sağlıyoruz.
        </motion.p>
      </motion.div>

      {/* Double Marquee Container */}
      <div className="relative flex flex-col gap-8 overflow-hidden group">
        {/* Left/Right Fade Masks (Light Mode) */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
        
        {/* Row 1: Scrolling Left */}
        <div className="animate-marquee flex whitespace-nowrap items-center hover:[animation-play-state:paused] ml-4 md:ml-12">
          {marquee1Items.map((partner, index) => {
            const logoUrl = PartnerImages[partner.id];
            const SvgLogo = PartnerSVGs[partner.id];
            if (!logoUrl && !SvgLogo) return null;
            
            return (
              <div key={`row1-${partner.id}-${index}`} className="flex-shrink-0 mx-3 md:mx-6 group/logo relative">
                <div className="w-32 h-16 md:w-52 md:h-28 bg-white backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center p-3 md:p-8 transition-all duration-500 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2 cursor-pointer overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain filter transition-all duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center filter transition-all duration-500">
                      <SvgLogo />
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 pointer-events-none bg-slate-800 text-white text-[10px] md:text-xs font-bold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-lg z-20 border border-slate-700">
                  {partner.name} • {partner.type}
                </div>
              </div>
            );
          })}
        </div>

        {/* Row 2: Scrolling Right */}
        <div className="animate-marquee-reverse flex whitespace-nowrap items-center hover:[animation-play-state:paused] mr-4 md:mr-12">
          {marquee2Items.map((partner, index) => {
            const logoUrl = PartnerImages[partner.id];
            const SvgLogo = PartnerSVGs[partner.id];
            if (!logoUrl && !SvgLogo) return null;
            
            return (
              <div key={`row2-${partner.id}-${index}`} className="flex-shrink-0 mx-3 md:mx-6 group/logo relative">
                <div className="w-32 h-16 md:w-52 md:h-28 bg-white backdrop-blur-md rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center p-3 md:p-8 transition-all duration-500 filter grayscale opacity-60 hover:grayscale-0 hover:opacity-100 hover:border-secondary/30 hover:shadow-xl hover:shadow-secondary/10 hover:-translate-y-2 cursor-pointer overflow-hidden">
                  {logoUrl ? (
                    <img src={logoUrl} alt={partner.name} className="max-w-full max-h-full object-contain filter transition-all duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center filter transition-all duration-500">
                      <SvgLogo />
                    </div>
                  )}
                </div>
                
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/logo:opacity-100 transition-opacity duration-300 pointer-events-none bg-slate-800 text-white text-[10px] md:text-xs font-bold py-1.5 px-3 rounded-lg whitespace-nowrap shadow-lg z-20 border border-slate-700">
                  {partner.name} • {partner.type}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
