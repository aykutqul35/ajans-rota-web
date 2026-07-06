import { useLocation } from 'react-router-dom';
import { slugify } from '../../utils/helpers';

export default function Navbar({
  isScrolled,
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeMobileDropdown,
  setActiveMobileDropdown,
  settingsData,
  servicesData,
  handleNavClick,
  handleServiceClick,
  handleCalculatorNavClick,
  navigateTo,
}) {
  const location = useLocation();

  return (
    <nav className={`fixed top-0 left-0 right-0 w-full z-[1000] flex items-center transition-all duration-300 ${
      isScrolled 
        ? 'bg-white/90 backdrop-blur-xl border-b border-glass h-[70px] shadow-[0_10px_30px_rgba(0,0,0,0.1)]' 
        : location.pathname.startsWith('/dijital-ajans/') 
          ? 'bg-slate-900/60 backdrop-blur-md border-b border-white/10 h-[80px]' 
          : 'bg-white/80 backdrop-blur-md border-b border-white/30 h-[80px]'
    }`}>
      <div className="container mx-auto px-4 md:px-8 w-full flex items-center justify-between h-full">
        <a href="/" className={`text-2xl font-bold flex items-center gap-2 transition-colors ${
          !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'text-white' : 'text-slate-800'
        }`} onClick={e => {
            e.preventDefault();
            handleNavClick('home');
          }}>
          {settingsData.logo_light || settingsData.logo_dark ? <picture>
              {settingsData.logo_light_mobile && <source media="(max-width: 768px)" srcSet={settingsData.logo_light_mobile} />}
              <img src={settingsData.logo_light || settingsData.logo_dark} alt="AJANS ROTA Logo" className="h-8 object-contain" />
            </picture> : <>
              <i className="fa-solid fa-compass text-primary"></i>
              <span className="tracking-tight">AJANS ROTA</span>
            </>}
        </a>
        
        <ul className={`fixed lg:static top-[70px] lg:top-auto left-0 w-full lg:w-auto bg-white lg:bg-transparent flex flex-col lg:flex-row items-start lg:items-center gap-2 lg:gap-8 p-6 lg:p-0 transition-all duration-300 lg:translate-y-0 lg:opacity-100 lg:visible ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100 visible shadow-xl lg:shadow-none border-b border-glass lg:border-none' : '-translate-y-4 opacity-0 invisible lg:opacity-100 lg:visible'
        }`}>
          <li className="w-full lg:w-auto">
            <a href="/" className={`flex items-center gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            }`} onClick={e => {
              e.preventDefault();
              handleNavClick('home');
              setIsMobileMenuOpen(false);
            }}>
              <i className="fa-solid fa-house w-5 text-center"></i>Ana Sayfa
            </a>
          </li>
          
          <li className="w-full lg:w-auto relative group">
            <a href="javascript:void(0)" onClick={e => {
              e.preventDefault();
              setActiveMobileDropdown(activeMobileDropdown === 'services' ? null : 'services');
            }} className={`flex items-center justify-between lg:justify-start gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            } ${activeMobileDropdown === 'services' ? 'text-primary' : ''}`}>
              <span className="flex items-center gap-2"><i className="fa-solid fa-briefcase w-5 text-center"></i>Hizmetlerimiz</span> 
              <i className={`fa-solid fa-chevron-down text-xs opacity-60 transition-transform ${activeMobileDropdown === 'services' ? 'rotate-180' : ''}`}></i>
            </a>
            <ul className={`lg:absolute top-full left-0 lg:bg-white lg:rounded-xl lg:min-w-[260px] lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:border lg:border-glass lg:py-4 flex-col lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-200 ${
              activeMobileDropdown === 'services' ? 'flex bg-slate-50/50 rounded-lg p-3' : 'hidden lg:flex'
            }`}>
              {Object.keys(servicesData || {}).map(key => {
                let iconClass = 'fa-solid fa-chevron-right';
                if (key === 'google') iconClass = 'fa-brands fa-google';
                if (key === 'meta') iconClass = 'fa-brands fa-facebook';
                if (key === 'seo') iconClass = 'fa-solid fa-magnifying-glass-chart';
                if (key === 'social') iconClass = 'fa-solid fa-share-nodes';
                if (key === 'ecommerce') iconClass = 'fa-solid fa-cart-shopping';
                return <li key={key}>
                  <a href={`/dijital-ajans/${slugify(key)}`} className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => {
                    e.preventDefault();
                    handleServiceClick(key);
                    setIsMobileMenuOpen(false);
                  }}>
                    <i className={`${iconClass} w-5 text-center text-primary/70`}></i>{servicesData[key].title}
                  </a>
                </li>;
              })}
            </ul>
          </li>

          <li className="w-full lg:w-auto relative group">
            <a href="javascript:void(0)" onClick={e => {
              e.preventDefault();
              setActiveMobileDropdown(activeMobileDropdown === 'sectors' ? null : 'sectors');
            }} className={`flex items-center justify-between lg:justify-start gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            } ${activeMobileDropdown === 'sectors' ? 'text-primary' : ''}`}>
              <span className="flex items-center gap-2"><i className="fa-solid fa-chart-pie w-5 text-center"></i>Sektörler</span> 
              <i className={`fa-solid fa-chevron-down text-xs opacity-60 transition-transform ${activeMobileDropdown === 'sectors' ? 'rotate-180' : ''}`}></i>
            </a>
            <ul className={`lg:absolute top-full left-0 lg:bg-white lg:rounded-xl lg:min-w-[260px] lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:border lg:border-glass lg:py-4 flex-col lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-200 ${
              activeMobileDropdown === 'sectors' ? 'flex bg-slate-50/50 rounded-lg p-3' : 'hidden lg:flex'
            }`}>
              <li><a href="/sektorler/saglik-turizmi" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/sektorler/saglik-turizmi'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-user-doctor w-5 text-center text-primary/70"></i>Sağlık Turizmi</a></li>
              <li><a href="/sektorler/gayrimenkul-insaat" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/sektorler/gayrimenkul-insaat'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-building-shield w-5 text-center text-primary/70"></i>Gayrimenkul & İnşaat</a></li>
              <li><a href="/sektorler/b2b-ihracat" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/sektorler/b2b-ihracat'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-industry w-5 text-center text-primary/70"></i>B2B & İhracat</a></li>
              <li><a href="/sektorler/turizm-otelcilik" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/sektorler/turizm-otelcilik'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-umbrella-beach w-5 text-center text-primary/70"></i>Turizm & Otelcilik</a></li>
            </ul>
          </li>

          <li className="w-full lg:w-auto relative group">
            <a href="javascript:void(0)" className={`flex items-center justify-between lg:justify-start gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            } ${activeMobileDropdown === 'corporate' ? 'text-primary' : ''}`} onClick={e => {
              e.preventDefault();
              if (window.innerWidth <= 1024) setActiveMobileDropdown(activeMobileDropdown === 'corporate' ? null : 'corporate');
            }}>
              <span className="flex items-center gap-2"><i className="fa-solid fa-building w-5 text-center"></i>Kurumsal</span> 
              <i className={`fa-solid fa-chevron-down text-xs opacity-60 transition-transform ${activeMobileDropdown === 'corporate' ? 'rotate-180' : ''}`}></i>
            </a>
            <ul className={`lg:absolute top-full left-0 lg:bg-white lg:rounded-xl lg:min-w-[260px] lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:border lg:border-glass lg:py-4 flex-col lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-200 ${
              activeMobileDropdown === 'corporate' ? 'flex bg-slate-50/50 rounded-lg p-3' : 'hidden lg:flex'
            }`}>
              {!settingsData.hide_page_hakkimizda && <li><a href="/hakkimizda" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/hakkimizda'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-address-card w-5 text-center text-primary/70"></i>Hakkımızda</a></li>}
              {!settingsData.hide_page_ekiplerimiz && <li><a href="/ekiplerimiz" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/ekiplerimiz'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-users w-5 text-center text-primary/70"></i>Ekiplerimiz</a></li>}
              {!settingsData.hide_page_blog && <li><a href="/blog" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/blog'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-newspaper w-5 text-center text-primary/70"></i>Blog</a></li>}
              {!settingsData.hide_page_izmir && <li><a href="/neden-izmir" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/neden-izmir'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-map-location-dot w-5 text-center text-primary/70"></i>Neden İzmir?</a></li>}
              {!settingsData.hide_page_iletisim && <li><a href="/iletisim" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/iletisim'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-envelope w-5 text-center text-primary/70"></i>İletişim</a></li>}
              {!settingsData.hide_page_referanslar && <li><a href="/referanslar" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/referanslar'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-star w-5 text-center text-primary/70"></i>Referanslarımız</a></li>}
            </ul>
          </li>

          <li className="w-full lg:w-auto relative group">
            <a href="javascript:void(0)" className={`flex items-center justify-between lg:justify-start gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            } ${activeMobileDropdown === 'calculators' ? 'text-primary' : ''}`} onClick={e => {
              e.preventDefault();
              if (window.innerWidth <= 1024) {
                setActiveMobileDropdown(activeMobileDropdown === 'calculators' ? null : 'calculators');
              } else {
                handleNavClick('calculator');
              }
            }}>
              <span className="flex items-center gap-2"><i className="fa-solid fa-calculator w-5 text-center"></i>Hesaplayıcılar</span> 
              <i className={`fa-solid fa-chevron-down text-xs opacity-60 transition-transform ${activeMobileDropdown === 'calculators' ? 'rotate-180' : ''}`}></i>
            </a>
            <ul className={`lg:absolute top-full left-0 lg:bg-white lg:rounded-xl lg:min-w-[260px] lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:border lg:border-glass lg:py-4 flex-col lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-200 ${
              activeMobileDropdown === 'calculators' ? 'flex bg-slate-50/50 rounded-lg p-3' : 'hidden lg:flex'
            }`}>
              <li><a href="javascript:void(0)" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); handleCalculatorNavClick('fee'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-file-invoice-dollar w-5 text-center text-primary/70"></i>Ajans hizmet planlayıcısı</a></li>
              <li><a href="javascript:void(0)" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); handleCalculatorNavClick('roas_ecommerce'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-cart-shopping w-5 text-center text-primary/70"></i>E-Ticaret Büyüme Simülatörü</a></li>
              <li><a href="javascript:void(0)" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); handleCalculatorNavClick('roas_b2b'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-phone-volume w-5 text-center text-primary/70"></i>B2B / Hizmet Simülatörü</a></li>
            </ul>
          </li>

          <li className="w-full lg:w-auto relative group">
            <a href="javascript:void(0)" className={`flex items-center justify-between lg:justify-start gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            } ${activeMobileDropdown === 'tools' ? 'text-primary' : ''}`} onClick={e => {
              e.preventDefault();
              if (window.innerWidth <= 1024) setActiveMobileDropdown(activeMobileDropdown === 'tools' ? null : 'tools');
            }}>
              <span className="flex items-center gap-2"><i className="fa-solid fa-screwdriver-wrench w-5 text-center"></i>Büyüme Araçları</span> 
              <i className={`fa-solid fa-chevron-down text-xs opacity-60 transition-transform ${activeMobileDropdown === 'tools' ? 'rotate-180' : ''}`}></i>
            </a>
            <ul className={`lg:absolute top-full left-0 lg:bg-white lg:rounded-xl lg:min-w-[260px] lg:shadow-[0_10px_40px_rgba(0,0,0,0.1)] lg:border lg:border-glass lg:py-4 flex-col lg:opacity-0 lg:invisible lg:group-hover:opacity-100 lg:group-hover:visible lg:translate-y-2 lg:group-hover:translate-y-0 transition-all duration-200 ${
              activeMobileDropdown === 'tools' ? 'flex bg-slate-50/50 rounded-lg p-3' : 'hidden lg:flex'
            }`}>
              {!settingsData.hide_page_seo && <li><a href="/seo-analizi" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/seo-analizi'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-magnifying-glass-chart w-5 text-center text-primary/70"></i>Ücretsiz SEO Analizi</a></li>}
              {!settingsData.hide_page_kobi && <li><a href="/kobi-endeksi" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/kobi-endeksi'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-chart-line w-5 text-center text-primary/70"></i>KOBİ Dijitalleşme Endeksi</a></li>}
              {!settingsData.hide_page_rakip && <li><a href="/rakip-analizi" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/rakip-analizi'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-code-compare w-5 text-center text-primary/70"></i>Siz vs. Rakibiniz</a></li>}
              {!settingsData.hide_page_kreatif && <li><a href="/kreatif-vitrin" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/kreatif-vitrin'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-wand-magic-sparkles w-5 text-center text-primary/70"></i>Kreatif Reklam Vitrini</a></li>}
              {!settingsData.hide_page_akademi && <li><a href="/akademi" className="flex items-center gap-3 px-4 py-2.5 text-slate-700 hover:text-primary hover:bg-sky-50 transition-colors font-medium text-sm" onClick={e => { e.preventDefault(); navigateTo('/akademi'); setIsMobileMenuOpen(false); }}><i className="fa-solid fa-graduation-cap w-5 text-center text-primary/70"></i>Rota Akademi</a></li>}
            </ul>
          </li>

          {!settingsData.hide_page_iletisim && <li className="w-full lg:w-auto">
            <a href="/iletisim" className={`flex items-center gap-2 font-semibold text-[1.05rem] py-2 lg:py-6 transition-colors hover:text-primary w-full ${
              !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'lg:text-white/85 lg:hover:text-sky-400 text-slate-800' : 'text-slate-800'
            }`} onClick={e => {
              e.preventDefault();
              handleNavClick('contact');
              setIsMobileMenuOpen(false);
            }}>
              <i className="fa-solid fa-envelope w-5 text-center"></i>İletişim
            </a>
          </li>}
          
          <li className="w-full lg:hidden flex flex-col gap-3 mt-4 pt-4 border-t border-glass">
            <a href="/client-portal-secure" className="w-full text-center py-2.5 rounded-full border-2 border-slate-200 text-slate-700 font-bold hover:bg-slate-50 transition-colors" onClick={e => {
              e.preventDefault();
              navigateTo('/client-portal-secure');
              setIsMobileMenuOpen(false);
            }}>
              <i className="fa-solid fa-lock mr-2"></i>Müşteri Girişi
            </a>
            <a href="/iletisim" className="w-full text-center py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg transition-all" onClick={e => {
              e.preventDefault();
              handleNavClick('contact');
              setIsMobileMenuOpen(false);
            }}>Teklif Al</a>
          </li>
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <a href="/client-portal-secure" className={`px-5 py-2 rounded-full font-bold transition-colors border-2 ${
            !isScrolled && location.pathname.startsWith('/dijital-ajans/') 
              ? 'border-white/20 text-white hover:bg-white/10' 
              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
          }`} onClick={e => {
            e.preventDefault();
            navigateTo('/client-portal-secure');
          }}>
            <i className="fa-solid fa-lock mr-2"></i>Müşteri Girişi
          </a>

          <a href="/iletisim" className="px-5 py-2.5 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-bold hover:shadow-lg transition-all" onClick={e => {
            e.preventDefault();
            handleNavClick('contact');
          }}>Teklif Al</a>
        </div>

        <button className={`lg:hidden ml-auto text-2xl w-10 h-10 flex items-center justify-center transition-colors ${
          !isScrolled && location.pathname.startsWith('/dijital-ajans/') ? 'text-white' : 'text-slate-800'
        }`} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menüyü Aç/Kapa">
          <i className={isMobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
        </button>
      </div>
    </nav>
  );
}
