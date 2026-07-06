import { useNavigate, useLocation } from 'react-router-dom';
import { slugify } from '../../utils/helpers';

export default function Footer({
  settingsData,
  servicesData,
  handleNavClick,
  handleServiceClick,
  navigateTo,
  getAgencyStatus,
  newsletterEmail,
  setNewsletterEmail,
  newsletterLoading,
  newsletterSubmitted,
  newsletterError,
  handleNewsletterSubmit,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <footer className="bg-slate-50 text-slate-600 pt-16 pb-8 border-t border-slate-200">
      {/* Top CTA Banner */}
      {currentPath !== '/referanslar' && currentPath !== '/ekiplerimiz' && currentPath !== '/neden-izmir' && !currentPath.startsWith('/hizmetlerimiz/') && (
        <div className="container mx-auto px-4 mb-16">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-secondary p-[1px]">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary blur-xl opacity-50"></div>
            <div className="relative bg-slate-50/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-2xl text-slate-800">
                <h3 className="text-2xl md:text-3xl font-bold mb-3">Ege'nin Dijital Büyüme Ortağıyla Tanışın</h3>
                <p className="text-slate-600 text-lg">Markanızın dijital dünyada yeni zirvelere ulaşması ve rotanızı veriye dayalı stratejilerle çizmek için hazır mısınız?</p>
              </div>
              <div>
                <a href="/iletisim" className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-slate-800 font-bold py-4 px-8 rounded-full hover:shadow-[0_0_30px_rgba(2,132,199,0.5)] transition-all transform hover:scale-105" onClick={e => {
                  e.preventDefault();
                  handleNavClick('contact');
                }}>
                  <span>Hemen Başlayalım</span>
                  <i className="fa-solid fa-arrow-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Middle Columns */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Block */}
          <div className="flex flex-col items-start">
            <a href="/" className="inline-flex items-center gap-3 text-2xl font-bold font-heading tracking-tight text-slate-800 mb-6" onClick={e => {
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
            <p className="text-slate-400 text-sm leading-relaxed mb-6">İzmir merkezli performans pazarlama, sosyal medya reklamları ve SEO ajansı. Markanızın büyüme rotasını veriye dayalı stratejilerle çiziyoruz.</p>
            
            <div className="inline-flex items-center gap-2 bg-sky-900/30 text-sky-400 border border-sky-800 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider mb-8">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse"></span>
              <span>Ege'nin Lider Büyüme Partneri</span>
            </div>

            {/* Newsletter subscription form */}
            <div className="w-full bg-white rounded-2xl p-6 border border-slate-200/50">
              <h5 className="text-slate-800 font-bold mb-2">Büyüme Bülteni</h5>
              <p className="text-slate-400 text-xs mb-4">E-ticaret ve dijital pazarlama rehberlerimiz posta kutunuza gelsin.</p>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <input type="email" placeholder="E-posta adresiniz" value={newsletterEmail} onChange={e => setNewsletterEmail(e.target.value)} disabled={newsletterLoading} required className="flex-1 bg-slate-50/80 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:outline-none focus:border-primary transition-colors" />
                <button type="submit" disabled={newsletterLoading} aria-label="Abone Ol" className="bg-primary hover:bg-primary/90 text-slate-800 rounded-xl w-12 flex items-center justify-center transition-colors disabled:opacity-50">
                  {newsletterLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : <i className="fa-solid fa-paper-plane"></i>}
                </button>
              </form>
              {newsletterSubmitted && <span className="block mt-3 text-emerald-400 text-xs font-bold">Kayıt Başarılı! Takipte kalın.</span>}
              {newsletterError && <span className="block mt-3 text-red-400 text-xs font-bold">{newsletterError}</span>}
            </div>
          </div>

          {/* Links Block */}
          <div>
            <h4 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2"><i className="fa-solid fa-briefcase text-primary/70"></i>Hizmetlerimiz</h4>
            <ul className="flex flex-col gap-3">
              {Object.keys(servicesData).map(key => <li key={key}>
                  <a href={`/dijital-ajans/${slugify(key)}`} className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                handleServiceClick(key);
              }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span>
                    <span>{servicesData[key].title}</span>
                  </a>
                </li>)}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2"><i className="fa-solid fa-building text-primary/70"></i>Kurumsal</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="javascript:void(0)" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                handleNavClick('home');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Ana Sayfa</span></a></li>
              {!settingsData.hide_page_hakkimizda && <li><a href="/hakkimizda" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/hakkimizda');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Hakkımızda</span></a></li>}
              {!settingsData.hide_page_ekiplerimiz && <li><a href="/ekiplerimiz" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/ekiplerimiz');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Ekiplerimiz</span></a></li>}
              {!settingsData.hide_page_referanslar && <li><a href="javascript:void(0)" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                handleNavClick('testimonials');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Referanslarımız</span></a></li>}
              {!settingsData.hide_page_izmir && <li><a href="javascript:void(0)" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                handleNavClick('izmir');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Neden İzmir?</span></a></li>}
              {!settingsData.hide_page_blog && <li><a href="/blog" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/blog');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Rehber & Blog</span></a></li>}
              {!settingsData.hide_page_iletisim && <li><a href="javascript:void(0)" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                handleNavClick('contact');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>İletişime Geçin</span></a></li>}
            </ul>
          </div>

          <div>
            <h4 className="text-slate-800 font-bold text-lg mb-6 flex items-center gap-2"><i className="fa-solid fa-screwdriver-wrench text-primary/70"></i>Büyüme Araçları</h4>
            <ul className="flex flex-col gap-3">
              {!settingsData.hide_page_seo && <li><a href="/seo-analizi" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/seo-analizi');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Ücretsiz SEO Analizi</span></a></li>}
              {!settingsData.hide_page_kobi && <li><a href="/kobi-endeksi" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/kobi-endeksi');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>KOBİ Dijital Endeksi</span></a></li>}
              {!settingsData.hide_page_rakip && <li><a href="/rakip-analizi" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/rakip-analizi');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Rakip Analiz Motoru</span></a></li>}
              {!settingsData.hide_page_kreatif && <li><a href="/kreatif-vitrin" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/kreatif-vitrin');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Reklam Vitrini</span></a></li>}
              {!settingsData.hide_page_akademi && <li><a href="/akademi" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                navigateTo('/akademi');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Rota Akademi</span></a></li>}
              <li><a href="javascript:void(0)" className="text-slate-400 hover:text-primary transition-colors flex items-center gap-3 group text-sm" onClick={e => {
                e.preventDefault();
                handleNavClick('calculator');
              }}><span className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-primary transition-colors"></span><span>Büyüme Simülatörü</span></a></li>
            </ul>
          </div>
        </div>

        {/* ── Hizmet Verdiğimiz Bölgeler ── */}
        <div className="relative overflow-hidden bg-white border border-slate-200/50 rounded-3xl p-8 mb-16">
          {/* Dekoratif arka plan */}
          <div className="absolute inset-0 pointer-events-none rounded-3xl overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-[radial-gradient(circle,rgba(2,132,199,0.1)_0%,transparent_70%)]" />
            <div className="absolute -bottom-10 left-[30%] w-36 h-36 rounded-full bg-[radial-gradient(circle,rgba(124,58,237,0.08)_0%,transparent_70%)]" />
          </div>

          {/* Başlık */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-600 to-violet-600 flex items-center justify-center shadow-[0_4px_16px_rgba(2,132,199,0.3)]">
                <i className="fa-solid fa-map-pin text-slate-800 text-lg"></i>
              </div>
              <div>
                <h4 className="text-slate-800 font-bold text-lg mb-1">Hizmet Verdiğimiz Bölgeler</h4>
                <p className="text-slate-400 text-xs">Müşterimizin ayağına gidiyoruz</p>
              </div>
              <div className="hidden sm:flex bg-sky-900/30 text-sky-400 border border-sky-800/50 rounded-full px-3 py-1 text-xs font-bold">
                47 Lokasyon
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              {[
                { name: 'İzmir', color: 'text-sky-400' },
                { name: 'Manisa', color: 'text-emerald-400' },
                { name: 'Aydın', color: 'text-amber-500' },
                { name: 'Muğla', color: 'text-cyan-500' },
                { name: 'Denizli', color: 'text-violet-400' },
              ].map((il, i) => (
                <span key={i} className={`text-xs font-bold ${il.color} opacity-90`}>{il.name}{i < 4 ? ' •' : ''}</span>
              ))}
            </div>
          </div>

          {/* 5 Kolon Grid — Nüfusa Göre Sıralı */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { il: 'İzmir', emoji: '🏙️', nufus: '4.5M', color: '#38bdf8', slug: 'izmir', ilceler: [{ label: 'Bornova', slug: 'izmir-bornova' }, { label: 'Buca', slug: 'izmir-buca' }, { label: 'Karabağlar', slug: 'izmir-karabaglar' }, { label: 'Karşıyaka', slug: 'izmir-karsiyaka' }, { label: 'Konak', slug: 'izmir-konak' }] },
              { il: 'Manisa', emoji: '🏭', nufus: '1.5M', color: '#34d399', slug: 'manisa', ilceler: [{ label: 'Akhisar', slug: 'manisa-akhisar' }, { label: 'Turgutlu', slug: 'manisa-turgutlu' }, { label: 'Salihli', slug: 'manisa-salihli' }, { label: 'Alaşehir', slug: 'manisa-alasehir' }, { label: 'Soma', slug: 'manisa-soma' }] },
              { il: 'Aydın', emoji: '🌾', nufus: '1.2M', color: '#fbbf24', slug: 'aydin', ilceler: [{ label: 'Efeler', slug: 'aydin-efeler' }, { label: 'Nazilli', slug: 'aydin-nazilli' }, { label: 'Söke', slug: 'aydin-soke' }, { label: 'Kuşadası', slug: 'aydin-kusadasi' }, { label: 'Didim', slug: 'aydin-didim' }] },
              { il: 'Muğla', emoji: '🌊', nufus: '1.0M', color: '#0ea5e9', slug: 'mugla', ilceler: [{ label: 'Bodrum', slug: 'mugla-bodrum' }, { label: 'Fethiye', slug: 'mugla-fethiye' }, { label: 'Marmaris', slug: 'mugla-marmaris' }, { label: 'Milas', slug: 'mugla-milas' }, { label: 'Datça', slug: 'mugla-datca' }] },
              { il: 'Denizli', emoji: '🏔️', nufus: '1.0M', color: '#a78bfa', slug: 'denizli', ilceler: [{ label: 'Merkezefendi', slug: 'denizli-merkezefendi' }, { label: 'Pamukkale', slug: 'denizli-pamukkale' }, { label: 'Buldan', slug: 'denizli-buldan' }, { label: 'Çivril', slug: 'denizli-civril' }, { label: 'Acıpayam', slug: 'denizli-acipayam' }] },
            ].map((city, ci) => (
              <div key={ci} className="bg-slate-50/50 border border-slate-200/50 rounded-2xl p-5 transition-all duration-300 hover:bg-white hover:-translate-y-1 hover:shadow-xl" style={{ borderTop: `3px solid ${city.color}` }}>
                {/* Şehir başlığı */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{city.emoji}</span>
                    <a href={`/dijital-ajans/${city.slug}`} onClick={e => { e.preventDefault(); navigate(`/dijital-ajans/${city.slug}`); }} style={{ color: city.color }} className="text-sm font-bold uppercase tracking-wider hover:brightness-110">
                      {city.il}
                    </a>
                  </div>
                  <span className="text-[0.65rem] font-bold text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200">{city.nufus}</span>
                </div>

                {/* İlçe linkleri */}
                <div className="flex flex-col gap-1.5 mb-4">
                  {city.ilceler.map((ilce, ii) => (
                    <a key={ii} href={`/dijital-ajans/${ilce.slug}`} onClick={e => { e.preventDefault(); navigate(`/dijital-ajans/${ilce.slug}`); }} className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg text-[0.8rem] font-medium text-slate-400 hover:text-slate-800 transition-colors group">
                      <span className="w-1 h-1 rounded-full opacity-60 group-hover:opacity-100 transition-opacity group-hover:scale-150" style={{ backgroundColor: city.color }}></span>
                      {ilce.label}
                    </a>
                  ))}
                </div>

                {/* Tümünü Gör */}
                <a href={`/dijital-ajans/${city.slug}`} onClick={e => { e.preventDefault(); navigate(`/dijital-ajans/${city.slug}`); }} className="flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold transition-all" style={{ color: city.color, backgroundColor: `${city.color}15`, border: `1px solid ${city.color}30` }}>
                  Tüm İlçeler <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Details Row (Grid of Modern Glass Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {/* Card 1: Office Address */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6 flex flex-col items-start transition-all hover:bg-white">
            <div className="flex items-center gap-3 mb-4 text-slate-800">
              <i className="fa-solid fa-map-location-dot text-2xl text-primary"></i>
              <h5 className="font-bold">Ofis Adresi</h5>
            </div>
            <div className="text-slate-400 text-sm mb-6 flex-1">
              <p>{settingsData.address}</p>
            </div>
            <div>
              <a href={settingsData.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(settingsData.address)}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary text-sm font-bold hover:text-sky-400 transition-colors">
                <span>Haritada Göster</span>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            </div>
          </div>

          {/* Card 2: Contact Info */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6 flex flex-col items-start transition-all hover:bg-white">
            <div className="flex items-center gap-3 mb-4 text-slate-800">
              <i className="fa-solid fa-headset text-2xl text-secondary"></i>
              <h5 className="font-bold">Hızlı İletişim</h5>
            </div>
            <div className="text-slate-400 text-sm mb-6 flex-1 flex flex-col gap-2">
              <p><strong className="text-slate-600">Telefon:</strong> <a href={`tel:${settingsData.phone}`} className="hover:text-slate-800 transition-colors">{settingsData.phone}</a></p>
              <p><strong className="text-slate-600">E-Posta:</strong> <a href={`mailto:${settingsData.email}`} className="hover:text-slate-800 transition-colors">{settingsData.email}</a></p>
            </div>
            <div>
              <a href={`mailto:${settingsData.email}?subject=Hizmet%20Talebi`} className="inline-flex items-center gap-2 text-secondary text-sm font-bold hover:text-pink-400 transition-colors">
                <span>E-posta Gönder</span>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            </div>
          </div>

          {/* Card 3: Working Hours */}
          <div className="bg-white border border-slate-200/50 rounded-2xl p-6 flex flex-col items-start transition-all hover:bg-white">
            <div className="flex items-center gap-3 mb-4 text-slate-800">
              <i className="fa-solid fa-business-time text-2xl text-emerald-400"></i>
              <h5 className="font-bold">Çalışma Saatleri</h5>
            </div>
            <div className="text-slate-400 text-sm mb-6 flex-1">
              <p className="mb-3">{settingsData.working_hours_text || "Pazartesi – Cuma: 09:00 – 18:30"}</p>
              {(() => {
                const currentStatus = getAgencyStatus();
                return (
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${currentStatus.status === "open" ? "bg-emerald-900/30 text-emerald-400 border-emerald-800" : "bg-white text-slate-400 border-slate-200"}`}>
                    <span className={`w-2 h-2 rounded-full ${currentStatus.status === "open" ? "bg-emerald-400 animate-pulse" : "bg-slate-500"}`}></span>
                    <span>{currentStatus.text}</span>
                  </div>
                );
              })()}
            </div>
            <div>
              <a href="/iletisim" onClick={e => {
                e.preventDefault();
                handleNavClick('contact');
              }} className="inline-flex items-center gap-2 text-emerald-400 text-sm font-bold hover:text-emerald-300 transition-colors">
                <span>Toplantı Talep Et</span>
                <i className="fa-solid fa-angle-right"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-200">
          <div className="text-center md:text-left">
            <p className="text-slate-400 text-sm mb-2">&copy; 2019 – 2025 Ajans Rota. Tüm hakları saklıdır.</p>
            <p className="text-slate-400 text-xs mb-4">Dijital Pazarlama, SEO, E-Ticaret, Google, Meta, TikTok Ads Çözüm Ortağınız ; Ajans Rota.</p>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200"><i className="fa-brands fa-google text-red-500"></i> Partner</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200"><i className="fa-brands fa-meta text-blue-500"></i> Business Partner</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-600 px-3 py-1.5 rounded-lg border border-slate-200"><i className="fa-brands fa-tiktok text-slate-800"></i> Agency Partner</span>
            </div>
          </div>
          
          <div className="flex flex-col items-center md:items-end gap-6">
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-400">
              <a href="/gizlilik-politikasi" className="hover:text-slate-800 transition-colors" onClick={e => { e.preventDefault(); navigateTo('/gizlilik-politikasi'); }}>Gizlilik Politikası</a>
              <a href="/kullanim-kosullari" className="hover:text-slate-800 transition-colors" onClick={e => { e.preventDefault(); navigateTo('/kullanim-kosullari'); }}>Kullanım Koşulları</a>
              <a href="/kvkk-aydinlatma-metni" className="hover:text-slate-800 transition-colors" onClick={e => { e.preventDefault(); navigateTo('/kvkk-aydinlatma-metni'); }}>KVKK</a>
              <a href="/cerez-politikasi" className="hover:text-slate-800 transition-colors" onClick={e => { e.preventDefault(); navigateTo('/cerez-politikasi'); }}>Çerez Politikası</a>
            </div>
            <div className="flex items-center gap-4">
              <a href={settingsData.linkedin_url || "#"} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-[#0077b5] hover:text-slate-800 transition-colors text-lg" aria-label="LinkedIn" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
              <a href={settingsData.instagram_url || "#"} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-gradient-to-tr hover:from-orange-500 hover:to-purple-600 hover:text-slate-800 transition-colors text-lg" aria-label="Instagram" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-instagram"></i></a>
              <a href={settingsData.whatsapp_assistant_phone ? `https://wa.me/${settingsData.whatsapp_assistant_phone}?text=${encodeURIComponent('Merhaba, web siteniz üzerinden ulaşıyorum. Bulunduğum sayfa: ' + window.location.href)}` : (settingsData.whatsapp_url || "#")} className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 hover:bg-[#25D366] hover:text-slate-800 transition-colors text-lg" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-whatsapp"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
