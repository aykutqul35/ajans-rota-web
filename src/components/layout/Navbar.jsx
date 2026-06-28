import { useLocation } from 'react-router-dom';

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
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''} ${location.pathname.startsWith('/dijital-ajans/') ? 'dark-hero' : ''}`}>
      <div className="nav-container container">
        <a href="#" className="logo" onClick={e => {
            e.preventDefault();
            handleNavClick('home');
          }}>
          {settingsData.logo_light || settingsData.logo_dark ? <picture>
              {settingsData.logo_light_mobile && <source media="(max-width: 768px)" srcSet={settingsData.logo_light_mobile} />}
              <img src={settingsData.logo_light || settingsData.logo_dark} alt="AJANS ROTA Logo" style={{
                height: '32px',
                objectFit: 'contain'
              }} />
            </picture> : <>
              <i className="fa-solid fa-compass logo-icon"></i>
              <span>AJANS ROTA</span>
            </>}
        </a>
        
        <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`}>
          <li className="nav-link"><a href="#" onClick={e => {
            e.preventDefault();
            handleNavClick('home');
          }}><i className="fa-solid fa-house nav-icon"></i>Ana Sayfa</a></li>
          <li className={`nav-link dropdown ${activeMobileDropdown === 'services' ? 'active' : ''}`}>
            <a href="#services" onClick={e => {
            e.preventDefault();
            if (window.innerWidth <= 768) {
              setActiveMobileDropdown(activeMobileDropdown === 'services' ? null : 'services');
            } else {
              handleNavClick('services');
            }
          }} className="dropdown-toggle">
                <span><i className="fa-solid fa-briefcase nav-icon"></i>Hizmetlerimiz</span> <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
              </a>
              <ul className={`dropdown-menu ${activeMobileDropdown === 'services' ? 'mobile-active' : ''}`}>
                {Object.keys(servicesData).map(key => {
                let iconClass = 'fa-solid fa-chevron-right';
                if (key === 'google') iconClass = 'fa-brands fa-google';
                if (key === 'meta') iconClass = 'fa-brands fa-facebook';
                if (key === 'seo') iconClass = 'fa-solid fa-magnifying-glass-chart';
                if (key === 'social') iconClass = 'fa-solid fa-share-nodes';
                if (key === 'ecommerce') iconClass = 'fa-solid fa-cart-shopping';
                return <li key={key}>
                      <a href="#" onClick={e => {
                    e.preventDefault();
                    handleServiceClick(key);
                  }}>
                        <i className={`${iconClass} nav-icon`}></i>{servicesData[key].title}
                      </a>
                    </li>;
              })}
              </ul>
            </li>
            <li className={`nav-link dropdown ${activeMobileDropdown === 'corporate' ? 'active' : ''}`}>
              <a href="#" className="dropdown-toggle" onClick={e => {
              e.preventDefault();
              if (window.innerWidth <= 768) {
                setActiveMobileDropdown(activeMobileDropdown === 'corporate' ? null : 'corporate');
              }
            }}>
                <span><i className="fa-solid fa-building nav-icon"></i>Kurumsal</span> <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
              </a>
              <ul className={`dropdown-menu ${activeMobileDropdown === 'corporate' ? 'mobile-active' : ''}`}>
                {!settingsData.hide_page_hakkimizda && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/hakkimizda');
                }}><i className="fa-solid fa-address-card nav-icon"></i>Hakkımızda</a></li>}
                {!settingsData.hide_page_ekiplerimiz && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/ekiplerimiz');
                }}><i className="fa-solid fa-users nav-icon"></i>Ekiplerimiz</a></li>}
                {!settingsData.hide_page_blog && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/blog');
                }}><i className="fa-solid fa-newspaper nav-icon"></i>Blog</a></li>}
                {!settingsData.hide_page_izmir && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/neden-izmir');
                }}><i className="fa-solid fa-map-location-dot nav-icon"></i>Neden İzmir?</a></li>}
                {!settingsData.hide_page_iletisim && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/iletisim');
                }}><i className="fa-solid fa-envelope nav-icon"></i>İletişim</a></li>}
              </ul>
            </li>
            <li className={`nav-link dropdown ${activeMobileDropdown === 'calculators' ? 'active' : ''}`}>
              <a href="#" className="dropdown-toggle" onClick={e => {
              e.preventDefault();
              if (window.innerWidth <= 768) {
                setActiveMobileDropdown(activeMobileDropdown === 'calculators' ? null : 'calculators');
              } else {
                handleNavClick('calculator');
              }
            }}>
                <span><i className="fa-solid fa-calculator nav-icon"></i>Hesaplayıcılar</span> <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
              </a>
              <ul className={`dropdown-menu ${activeMobileDropdown === 'calculators' ? 'mobile-active' : ''}`}>
                <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleCalculatorNavClick('fee');
                }}><i className="fa-solid fa-file-invoice-dollar nav-icon"></i>Ajans hizmet planlayıcısı</a></li>
                <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleCalculatorNavClick('roas_ecommerce');
                }}><i className="fa-solid fa-cart-shopping nav-icon"></i>E-Ticaret Büyüme Simülatörü</a></li>
                <li><a href="#" onClick={e => {
                  e.preventDefault();
                  handleCalculatorNavClick('roas_b2b');
                }}><i className="fa-solid fa-phone-volume nav-icon"></i>B2B / Hizmet Simülatörü</a></li>
              </ul>
            </li>
            <li className={`nav-link dropdown ${activeMobileDropdown === 'tools' ? 'active' : ''}`}>
              <a href="#" className="dropdown-toggle" onClick={e => {
              e.preventDefault();
              if (window.innerWidth <= 768) {
                setActiveMobileDropdown(activeMobileDropdown === 'tools' ? null : 'tools');
              }
            }}>
                <span><i className="fa-solid fa-screwdriver-wrench nav-icon"></i>Büyüme Araçları</span> <i className="fa-solid fa-chevron-down dropdown-arrow"></i>
              </a>
              <ul className={`dropdown-menu ${activeMobileDropdown === 'tools' ? 'mobile-active' : ''}`}>
                {!settingsData.hide_page_seo && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/seo-analizi');
                }}><i className="fa-solid fa-magnifying-glass-chart nav-icon"></i>Ücretsiz SEO Analizi</a></li>}
                {!settingsData.hide_page_kobi && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/kobi-endeksi');
                }}><i className="fa-solid fa-chart-line nav-icon"></i>KOBİ Dijitalleşme Endeksi</a></li>}
                {!settingsData.hide_page_rakip && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/rakip-analizi');
                }}><i className="fa-solid fa-code-compare nav-icon"></i>Siz vs. Rakibiniz</a></li>}
                {!settingsData.hide_page_kreatif && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/kreatif-vitrin');
                }}><i className="fa-solid fa-wand-magic-sparkles nav-icon"></i>Kreatif Reklam Vitrini</a></li>}
                {!settingsData.hide_page_seffaf && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/client-portal-secure');
                }}><i className="fa-solid fa-chart-pie nav-icon"></i>Müşteri Raporlama Paneli</a></li>}
                {!settingsData.hide_page_akademi && <li><a href="#" onClick={e => {
                  e.preventDefault();
                  navigateTo('/akademi');
                }}><i className="fa-solid fa-graduation-cap nav-icon"></i>Rota Akademi</a></li>}
              </ul>
            </li>
            {!settingsData.hide_page_referanslar && <li className="nav-link"><a href="#testimonials" onClick={e => {
              e.preventDefault();
              handleNavClick('testimonials');
            }}><i className="fa-solid fa-star nav-icon"></i>Referanslarımız</a></li>}
            {!settingsData.hide_page_iletisim && <li className="nav-link"><a href="#contact" onClick={e => {
              e.preventDefault();
              handleNavClick('contact');
            }}><i className="fa-solid fa-envelope nav-icon"></i>İletişim</a></li>}
          </ul>

          <div className="nav-actions">
            <a href="#" className="btn btn-secondary" style={{ background: 'transparent', color: 'var(--text-dark)', border: '1px solid var(--glass-border)' }} onClick={e => {
              e.preventDefault();
              navigateTo('/client-portal-secure');
              setIsMobileMenuOpen(false);
            }}>
              <i className="fa-solid fa-lock" style={{ marginRight: '6px' }}></i>
              Müşteri Girişi
            </a>
            <a href="#contact" className="btn btn-secondary" onClick={e => {
              e.preventDefault();
              handleNavClick('contact');
            }}>Teklif Al</a>
          </div>

          <button className="menu-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Menüyü Aç/Kapa">
            <i className={isMobileMenuOpen ? "fa-solid fa-xmark" : "fa-solid fa-bars"}></i>
          </button>
        </div>
      </nav>
  );
}
