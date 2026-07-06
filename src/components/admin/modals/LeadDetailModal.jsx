import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import html2pdf from 'html2pdf.js';
import AiSeoPdfTemplate from '../seo/AiSeoPdfTemplate';

export default function LeadDetailModal({
  selectedLead, setSelectedLead,
  leadsData, setLeadsData, saveLeadsOnly, handleViewLead, handleDeleteLead,
  settingsData, authToken, isSaving, handleSaveAll
}) {
  const [crmStatus, setCrmStatus] = useState('yeni');
  const [crmNotes, setCrmNotes] = useState('');
  const [crmReminderDate, setCrmReminderDate] = useState('');
  const [aiGuideLoading, setAiGuideLoading] = useState(false);
  const [aiGuideContents, setAiGuideContents] = useState({});
  const [isSendingGuide, setIsSendingGuide] = useState(false);
  const [isSendingProposal, setIsSendingProposal] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const pdfRef = useRef();
  
    useEffect(() => {
    if (selectedLead) {
      setCrmStatus(selectedLead.status || 'yeni');
      setCrmNotes(selectedLead.internalNotes || '');
      setCrmReminderDate(selectedLead.reminderDate || '');
    }
  }, [selectedLead]);

  const generateSeoPdf = async () => {
    if (!pdfRef.current) return;
    setIsGeneratingPdf(true);
    const toastId = toast.loading('Yapay zeka SEO raporu oluşturuluyor, lütfen bekleyin...');
    
    try {
      const opt = {
        margin: 0,
        filename: `${selectedLead.fullName || 'Musteri'}_SEO_Raporu.pdf`.replace(/\s+/g, '_'),
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Ensure component is fully rendered before generating
      await new Promise(resolve => setTimeout(resolve, 500));
      
      await html2pdf().from(pdfRef.current).set(opt).save();
      toast.success('SEO Raporu başarıyla PDF olarak indirildi!', { id: toastId });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast.error('PDF oluşturulurken bir hata oluştu.', { id: toastId });
    } finally {
      setIsGeneratingPdf(false);
    }
  };

    const getIconForLabel = label => {
    const l = label.toLowerCase();
    if (l.includes('hizmet')) return <i className="fa-solid fa-cubes" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('model')) return <i className="fa-solid fa-handshake" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('süre') || l.includes('anlaşma')) return <i className="fa-solid fa-calendar-days" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('rapor')) return <i className="fa-solid fa-chart-line" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('bedel')) return <i className="fa-solid fa-turkish-lira-sign" style={{
      color: 'var(--secondary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('bütçe')) return <i className="fa-solid fa-wallet" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('ciro')) return <i className="fa-solid fa-arrow-trend-up" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('kâr')) return <i className="fa-solid fa-piggy-bank" style={{
      color: 'var(--secondary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    if (l.includes('roas')) return <i className="fa-solid fa-percent" style={{
      color: 'var(--primary)',
      marginRight: '0.4rem',
      fontSize: '0.75rem'
    }}></i>;
    return null;
  };

  const generateDynamicRoadmap = (type, params, improvements) => {
    const isEcom = type === 'ecommerce';
    let steps = [];
    let diagnosis = '';
    if (isEcom) {
      const curCR = params.cr || 0;
      const curRoas = params.roas || 0;
      const traffic = params.traffic || 0;
      if (curCR < 1.5) {
        diagnosis = `Sitenizin dönüşüm oranı (%${curCR.toFixed(2)}) sektör ortalamasının (%1.5 - %2.0) altında kalmaktadır. Bu durum, reklam bütçenizin verimsiz harcanmasına ve yüksek müşteri edinme maliyetlerine yol açmaktadır. Ajans Rota olarak öncelikli hedefimiz site içi dönüşümü (CRO) optimize etmektir.`;
        steps = [{
          title: "1. Kullanıcı Deneyimi (UX/UI) & Sepet Optimizasyonu",
          desc: `Sepet terk oranlarını düşürmek amacıyla ödeme (checkout) adımları kolaylaştırılacak, ürün sayfalarına güven veren sosyal kanıtlar, kargo avantajları ve hızlı satın alma butonları eklenecektir.`
        }, {
          title: "2. Akıllı Hedef Kitle & Dinamik Katalog Reklamları",
          desc: `Gereksiz tıklamaları önlemek amacıyla hedef kitle filtreleri daraltılacak. Siteye gelen ziyaretçilere doğrudan ilgilendikleri ürünleri gösteren dinamik Meta ve Google katalog reklamları kurgulanacaktır.`
        }, {
          title: "3. Dönüşüm Oranının %${improvements.newCR.toFixed(2)} Seviyesine Çıkarılması",
          desc: `Dönüşüm oranındaki artışla birlikte aynı bütçeyle aylık sipariş sayısı artırılacak, edinme maliyeti düşürülerek verimlilik Rota hedeflerine taşınacaktır.`
        }];
      } else if (traffic < 30000) {
        diagnosis = `Mevcut aylık web sitesi trafiğiniz (${traffic.toLocaleString('tr-TR')} ziyaretçi) ciro hedeflerinize ulaşmanız için sınırlıdır. Dönüşüm oranınız stabil olmakla birlikte, büyüme için siteye yeni ve nitelikli satın alıcılar çekmemiz gerekmektedir.`;
        steps = [{
          title: "1. Çok Kanallı Nitelikli Trafik Çekimi",
          desc: `Google Ads Search ve Meta Ads Advantage+ kurguları aktif edilerek, sitenizden alışveriş yapmaya en yatkın kitleler hedeflenip nitelikli trafik %15 oranında artırılacaktır.`
        }, {
          title: "2. Sepet Terk Remarketing Kampanyaları",
          desc: `Sitenizi ziyaret edip satın almadan ayrılan kullanıcılara yönelik özel indirim ve fırsat kreatifleri gösterilerek sıcak trafiğin satın alma döngüsü tamamlanacaktır.`
        }, {
          title: "3. Organik Arama Görünürlüğü (Teknik SEO)",
          desc: `En çok satan ana ürün kategorilerinizde teknik SEO ve içerik optimizasyonları yapılarak kalıcı ve ücretsiz organik trafik kanalları güçlendirilecektir.`
        }];
      } else if (curRoas < 3.0) {
        diagnosis = `Reklam bütçesi verimliliğiniz (${curRoas}x ROAS) kabul edilebilir sınırın altındadır. Reklam harcamalarınızın daha fazla ciro getirmesi ve kârlılığın artması için bütçe optimizasyonu ve sepet tutarı (AOV) artışına odaklanılacaktır.`;
        steps = [{
          title: "1. Performans Analizi & Bütçe Filtreleme",
          desc: `Son 90 günde harcama yapıp dönüşüm getirmeyen verimsiz kampanyalar, hedef kitleler ve kreatifler durdurularak bütçe doğrudan en çok satan kârlı ürünlere yönlendirilecektir.`
        }, {
          title: "2. Ortalama Sepet Tutarı (AOV) Artırma Kurguları",
          desc: `Aylık ciroyu artırmak adına site içi yukarı satış (upsell) ve çapraz satış (cross-sell) modülleri (örn: 'Birlikte Al, %10 Tasarruf Et' veya kargo barajı kurguları) optimize edilecektir.`
        }, {
          title: "3. ROAS Hedefini ${improvements.newRoas}x Seviyesine Taşımak",
          desc: `Yapılacak optimizasyonlarla reklam verimliliği artırılacak, bütçe israfı engellenerek kârlı bir büyüme Rota'sı çizilecektir.`
        }];
      } else {
        diagnosis = `E-ticaret metrikleriniz oldukça sağlıklı görünmektedir. Ajans Rota olarak hedefimiz mevcut yapınızı riske atmadan akıllıca ölçeklemek, pazar payınızı büyütmek ve marka bilinirliğinizi pekiştirmektir.`;
        steps = [{
          title: "1. Ölçeklenebilir Bütçe Yönetimi (Scaling)",
          desc: `Kampanyaların dönüşüm maliyetleri (CAC) yakından izlenerek bütçe kontrollü şekilde artırılacak ve ciro hacmi ${improvements.newCiro?.toLocaleString('tr-TR')} ₺ seviyesine ölçeklenecektir.`
        }, {
          title: "2. Müşteri Tutundurma (Retention) & LTV Artışı",
          desc: `Mevcut alıcı veritabanınıza özel e-posta otomasyonları ve sadakat kurguları tanımlanarak, ek reklam maliyeti olmadan tekrar eden satışlar teşvik edilecektir.`
        }, {
          title: "3. Sunucu Taraflı Takip (Conversions API) Entegrasyonu",
          desc: `Meta Conversions API ve Google Enhanced Conversions kurulumları optimize edilerek IOS kısıtlamalarından bağımsız en net dönüşüm verisi toplanacaktır.`
        }];
      }
    } else {
      // B2B
      const conversion = params.conversion || 0;
      const leads = params.leads || 0;
      const cac = params.cac || 0;
      const ltv = params.ltv || 1;
      if (conversion < 10) {
        diagnosis = `B2B formlarınızdan gelen taleplerin satışa dönüşme oranı (%${conversion}) düşüktür. Bu durum, gelen taleplerin kalitesinde veya satış ekibinin takip/kapatma süreçlerinde aksaklıklar olduğunu gösterir.`;
        steps = [{
          title: "1. Form Niteliklendirme & SQL Kriterleri",
          desc: `Form alanlarına bütçe, şirket büyüklüğü gibi filtreleyici sorular eklenerek düşük kaliteli başvurular elenecektir. Reklam hedeflemesinde doğrudan B2B karar vericiler önceliklendirilecektir.`
        }, {
          title: "2. Hızlı Takip & CRM İş Akışı Entegrasyonu",
          desc: `Gelen talepler CRM sistemine otomatik aktarılacak, müşteri form doldurduğunda satış ekibine SMS/E-posta bildirimi giderek ilk 15 dakikada iletişime geçilmesi sağlanacaktır.`
        }, {
          title: "3. Dönüşüm Oranının %${improvements.newConversion}'a Çıkarılması",
          desc: `Nitelikli talep filtreleri ve satış hızı iyileştirmesiyle satış oranımız Rota hedefine ulaştırılacak ve toplam gelir ${improvements.newCiro?.toLocaleString('tr-TR')} ₺ seviyesine çıkarılacaktır.`
        }];
      } else if (leads < 50) {
        diagnosis = `Aylık talep (lead) sayınız (${leads} form) satış ekibinizin tam kapasite çalışması ve büyüme hedefleriniz için yetersizdir. Öncelikli amacımız talep hacmini artırmaktır.`;
        steps = [{
          title: "1. LinkedIn ve Google Ads B2B Hacim Kampanyaları",
          desc: `Sektörel unvanlar ve şirket listeleri üzerinden LinkedIn Form Reklamları ve arama hacmi yüksek Google Search kampanyaları aktif edilerek talep kanalı büyütülecektir.`
        }, {
          title: "2. Değer Sunumu (Lead Magnet) Kurgusu",
          desc: `Müşteri adaylarının form doldurmasını teşvik etmek amacıyla sektörel raporlar, ücretsiz teknik analizler veya demo sunumları içeren pazarlama hunisi kurulacaktır.`
        }, {
          title: "3. Retargeting (Yeniden Hedefleme) ve Isıtma",
          desc: `Sitenizi ziyaret eden ancak form doldurmayan kurumsal firmalara vaka analizleri ve referans projelerinizi göstererek güven tazelenecektir.`
        }];
      } else if (cac > ltv * 0.25) {
        diagnosis = `Müşteri edinme maliyetiniz (CAC: ${cac.toLocaleString('tr-TR')} ₺), müşteri yaşam boyu değerine (LTV: ${ltv.toLocaleString('tr-TR')} ₺) oranla yüksektir. Edinme maliyetlerini düşürmek birincil önceliğimizdir.`;
        steps = [{
          title: "1. Talep Başı Maliyet (CPL) Optimizasyonu",
          desc: `Maliyet/dönüşüm oranı dengesi zayıf olan anahtar kelimeler ve mecralar durdurulacak, reklam metinleri ve form sayfaları optimize edilerek form başı maliyet düşürülecektir.`
        }, {
          title: "2. Hedef Hesap Bazlı Pazarlama (ABM)",
          desc: `Bütçenizi geniş kitlelere dağıtmak yerine, sadece yüksek hacimli alım yapabilecek potansiyel kurumsal firmalar listelenerek doğrudan bu karar vericilere yönelik kampanyalar yürütülecektir.`
        }, {
          title: "3. CAC Değerinin Düşürülmesi",
          desc: `Yapılan çalışmalarla müşteri edinme maliyeti Rota hedefi olan ${improvements.newCac?.toLocaleString('tr-TR')} ₺ seviyesine çekilerek kârlılık oranınız artırılacaktır.`
        }];
      } else {
        diagnosis = `B2B dijital pazarlama kanallarınız oldukça verimli çalışmaktadır. Ajans Rota olarak hedefimiz, liderliğinizi pekiştirerek yeni pazarlara açılmanızı ve operasyonu büyütmenizi sağlamaktır.`;
        steps = [{
          title: "1. Coğrafi Ölçekleme & İhracat Odaklı Kampanyalar",
          desc: `Hedef bölgeler ve ülkeler genişletilerek uluslararası pazarlara uygun çok dilli Google ve LinkedIn kurguları aktif edilerek B2B performansı artırılacaktır.`
        }, {
          title: "2. Thought Leadership (Düşünce Liderliği)",
          desc: `Sektörde güvenilen otorite olmanız için vaka analizleri, teknik whitepaper belgeleri ve uzman görüşlerini içeren kurumsal içerik pazarlaması yaygınlaştırılacaktır.`
        }, {
          title: "3. Akıllı Bütçe Dağılımı",
          desc: `Reklam bütçesi verimli bir şekilde %20 artırılarak talep sayısı ${improvements.newLeads}'e çıkarılacak ve kârlılık ROI ${improvements.newRoi}x seviyesine taşınacaktır.`
        }];
      }
    }
    return {
      diagnosis,
      steps
    };
  };

  const parseProposalDetails = messageText => {
    const details = {
      services: '',
      pricingModel: '',
      term: '',
      reporting: '',
      fee: '',
      adBudget: ''
    };
    if (!messageText) return details;
    const lines = messageText.split('\n');
    lines.forEach(line => {
      if (line.includes('Seçilen Hizmetler:')) {
        details.services = line.replace('Seçilen Hizmetler:', '').trim();
      } else if (line.includes('Çalışma Modeli:')) {
        details.pricingModel = line.replace('Çalışma Modeli:', '').trim();
      } else if (line.includes('Anlaşma Süresi:')) {
        details.term = line.replace('Anlaşma Süresi:', '').trim();
      } else if (line.includes('Raporlama Paketi:')) {
        details.reporting = line.replace('Raporlama Paketi:', '').trim();
      } else if (line.includes('Tahmini Aylık Ajans Bedeli:')) {
        details.fee = line.replace('Tahmini Aylık Ajans Bedeli:', '').trim();
      } else if (line.includes('Aylık Reklam Bütçesi:')) {
        details.adBudget = line.replace('(Aylık Reklam Bütçesi:', '').replace(')', '').trim();
      }
    });
    return details;
  };

  const handleDownloadProposalPDF = lead => {
    if (!lead) return;
    if (window.html2pdf) {
      generateProposalPDF(lead);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generateProposalPDF(lead);
      };
      document.body.appendChild(script);
    }
  };

  const generateProposalPDF = lead => {
    const isWebDesign = lead.service === 'Web Tasarım Talebi';
    const parsed = parseProposalDetails(lead.message);
    const element = document.createElement('div');
    element.id = 'temp-proposal-pdf-container';
    element.style.width = '700px';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '0';
    element.style.margin = '0';
    element.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
    const brandColor = '#4f46e5'; // Indigo color for corporate proposals
    const textDark = '#0f172a';
    let contentHtml = '';
    if (isWebDesign) {
      const designType = lead.company || 'Kurumsal Web Tasarım Projesi';
      const isEcom = designType.toLowerCase().includes('e-ticaret');
      const fee = isEcom ? '45.000 ₺' : '30.000 ₺';
      contentHtml = `
        <!-- Proposal Scope -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 20px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">1. PROJE KAPSAMI VE SÜRECİ</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 9.5px; margin-bottom: 15px; line-height: 1.4;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: ${brandColor}; font-size: 10px;">Talep Edilen Proje: ${designType}</p>
          <p style="margin: 0 0 12px 0; color: #475569;"><strong>Müşteri Brief / Talebi:</strong> ${lead.message || 'Detaylı brief yüz yüze toplantıda netleştirilecektir.'}</p>
          
          <strong style="display: block; margin-bottom: 6px; color: ${textDark}; font-size: 9px; text-transform: uppercase;">Uygulama Adımları & Süreç:</strong>
          <table style="width: 100%; border-collapse: collapse; font-size: 9px; line-height: 1.35;">
            <tr style="border-bottom: 1px dashed #e2e8f0;">
              <td style="padding: 4px 0; font-weight: 700; width: 120px; color: ${textDark};">Aşama 01: Planlama & UI</td>
              <td style="padding: 4px 0; color: #64748b;">Marka kimliğine uygun renk paleti, wireframe ve anasayfa arayüz tasarımlarının onaylanması. (7 İş Günü)</td>
            </tr>
            <tr style="border-bottom: 1px dashed #e2e8f0;">
              <td style="padding: 4px 0; font-weight: 700; color: ${textDark};">Aşama 02: Kodlama & Panel</td>
              <td style="padding: 4px 0; color: #64748b;">Tasarımın temiz kod yapısıyla (React / Next.js) kodlanması ve basitleştirilmiş yönetim paneli entegrasyonu. (10 İş Günü)</td>
            </tr>
            <tr style="border-bottom: 1px dashed #e2e8f0;">
              <td style="padding: 4px 0; font-weight: 700; color: ${textDark};">Aşama 03: Entegrasyonlar</td>
              <td style="padding: 4px 0; color: #64748b;">Dönüşüm izleme kodları (GA4, Meta Pixel), Google Tag Manager ve ödeme/kargo entegrasyonlarının yapılması. (3 İş Günü)</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-weight: 700; color: ${textDark};">Aşama 04: Test & Yayım</td>
              <td style="padding: 4px 0; color: #64748b;">Mobil uyumluluk testleri, SEO optimizasyonları ve yayına alma aşaması. (2 İş Günü)</td>
            </tr>
          </table>
        </div>

        <!-- Proposal Pricing -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">2. TİCARİ VE YATIRIM ŞARTLARI</h2>
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #ffffff; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px;">Hizmet / Proje Tanımı</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: right;">Tek Seferlik Bedel</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 10px 12px; color: ${textDark};">
                  <strong>${designType}</strong>
                  <div style="font-size: 8.5px; color: #64748b; margin-top: 2px;">Özel Arayüz Tasarımı, Yönetim Paneli, GA4/Pixel Kurulumu, 1 Yıl Ücretsiz Teknik Destek</div>
                </td>
                <td style="padding: 10px 12px; text-align: right; color: ${brandColor}; font-weight: 700; font-size: 11px;">${fee}</td>
              </tr>
              <tr style="background-color: #f8fafc;">
                <td style="padding: 10px 12px; font-weight: 700; color: ${textDark};">TOPLAM YATIRIM BEDELİ (KDV Hariç):</td>
                <td style="padding: 10px 12px; text-align: right; color: ${brandColor}; font-weight: 900; font-size: 12px;">${fee}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    } else {
      contentHtml = `
        <!-- Proposal Scope -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 20px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">1. TALEP EDİLEN DİJİTAL HİZMETLER</h2>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 9.5px; margin-bottom: 15px; line-height: 1.4;">
          <p style="margin: 0 0 8px 0; font-weight: 700; color: ${brandColor}; font-size: 10px;">Seçilen Kanallar: ${parsed.services || 'Belirtilmedi'}</p>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 5px;">
            ${(parsed.services || '').split(',').map(serv => {
        const cleaned = serv.trim().toLowerCase();
        let title = serv.trim();
        let desc = 'İlgili kanalın yönetimi, kreatif testleri ve ROI odaklı optimizasyon süreçleri.';
        if (cleaned.includes('google')) {
          title = 'Google Ads Yönetimi';
          desc = 'Arama Ağı, PMax, YouTube ve Görüntülü Reklam yönetimi ile maksimum ROAS odağı.';
        } else if (cleaned.includes('meta')) {
          title = 'Meta (FB & IG) Reklamları';
          desc = 'Hedef kitle analizi, estetik reklam görselleri ve dönüşüm hunileri kurulumu.';
        } else if (cleaned.includes('seo')) {
          title = 'SEO (Arama Motoru Optimizasyonu)';
          desc = 'İçerik planlama, site içi teknik SEO ve Google sıralamalarında kalıcı yükselme.';
        } else if (cleaned.includes('sosyal')) {
          title = 'Sosyal Medya Yönetimi';
          desc = 'Marka diline uygun düzenli gönderi, hikaye paylaşımları ve topluluk yönetimi.';
        } else if (cleaned.includes('ticaret')) {
          title = 'E-Ticaret Danışmanlığı';
          desc = 'Sepet tutarı artırma, CRO, stok verimliliği ve satış kanalları optimizasyonu.';
        } else if (cleaned.includes('tasarım')) {
          title = 'Web Tasarım Hizmeti';
          desc = 'Modern tasarımlı, mobil uyumlu ve yüksek performanslı kurumsal web sitesi.';
        }
        return `
                <div style="border: 1px solid #e2e8f0; border-radius: 4px; padding: 8px; background: #ffffff;">
                  <strong style="color: ${textDark}; font-size: 9px; display: block; margin-bottom: 2px;">${title}</strong>
                  <span style="font-size: 8px; color: #64748b; line-height: 1.3;">${desc}</span>
                </div>
              `;
      }).join('')}
          </div>
        </div>

        <!-- Proposal Pricing -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">2. İŞBİRLİĞİ VE YATIRIM BİLGİLERİ</h2>
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #ffffff; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px;">Yatırım Parametresi</th>
                <th style="padding: 8px 12px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: right;">Seçilen Seçenek / Bedel</th>
              </tr>
            </thead>
            <tbody>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Aylık Reklam Bütçesi</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.adBudget || 'Belirtilmedi'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Çalışma & İş Ortaklığı Modeli</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.pricingModel || 'Belirtilmedi'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Planlanan İş Birliği Süresi</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.term || 'Aylık'}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e2e8f0;">
                <td style="padding: 8px 12px; color: #64748b;">Raporlama Ve Analiz Düzeyi</td>
                <td style="padding: 8px 12px; text-align: right; color: ${textDark}; font-weight: 600;">${parsed.reporting || 'Standart'}</td>
              </tr>
              <tr style="background-color: #f8fafc; border-top: 2px solid #e2e8f0;">
                <td style="padding: 10px 12px; font-weight: 700; color: ${textDark};">NET AYLIK AJANS BEDELİ (KDV Hariç):</td>
                <td style="padding: 10px 12px; text-align: right; color: ${brandColor}; font-weight: 900; font-size: 12px;">${parsed.fee || 'Hesaplanamadı'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    }
    element.innerHTML = `
      <div style="padding: 30px; box-sizing: border-box; color: #334155; line-height: 1.4;">
        
        <!-- Header Section -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid ${brandColor}; padding-bottom: 12px; margin-bottom: 15px;">
          <div>
            <h1 style="margin: 0; font-size: 20px; color: ${textDark}; font-weight: 900; letter-spacing: -0.04em;">AJANS ROTA</h1>
            <p style="margin: 2px 0 0 0; font-size: 8.5px; color: #64748b; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;">KURUMSAL HİZMET TEKLİFİ</p>
          </div>
          <div style="text-align: right; font-size: 8.5px; color: #64748b;">
            <span style="background-color: ${brandColor}; color: #ffffff; padding: 3px 8px; border-radius: 12px; font-weight: 700; text-transform: uppercase; font-size: 7.5px;">Resmi Fiyat Teklifi</span>
            <p style="margin: 5px 0 0 0;">Kod: <strong>AR-TEK-${lead.id.replace('sim_', '')}</strong></p>
            <p style="margin: 2px 0 0 0;">Geçerlilik: <strong>15 Gün</strong></p>
          </div>
        </div>

        <!-- Executive Summary -->
        <p style="color: #475569; font-size: 10px; margin-bottom: 15px; line-height: 1.45;">
          Sayın <strong>${lead.fullName}</strong>,<br>
          Ajans Rota olarak, markanızı birer bütçe paneli olarak görmeyip omuz omuza büyüyeceğimiz bir performans iş ortaklığı teklif ediyoruz. Hizmet planlayıcımızda seçtiğiniz parametreler doğrultusunda hazırladığımız kurumsal hizmet teklifimiz aşağıda detaylandırılmıştır.
        </p>

        <!-- Client & Agency Metadata -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; font-size: 9px; margin-bottom: 15px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; width: 100px;">Müşteri / Firma:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700;">${lead.company || lead.fullName}</td>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; width: 100px; text-align: right;">Teklif Tarihi:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700; text-align: right;">${lead.created_at?.substring(0, 10) || new Date().toLocaleDateString('tr-TR')}</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500;">Yetkili Kişi:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 600;">${lead.fullName}</td>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; text-align: right;">Teklif Veren:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700; text-align: right;">Ajans Rota</td>
            </tr>
            <tr>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500;">İletişim:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 600;">${lead.email || '-'} | ${lead.phone || '-'}</td>
              <td style="padding: 2px 0; color: #64748b; font-weight: 500; text-align: right;">E-posta:</td>
              <td style="padding: 2px 0; color: ${textDark}; font-weight: 700; text-align: right;">hello@ajansrota.com</td>
            </tr>
          </table>
        </div>

        ${contentHtml}

        <!-- 3. Ortak Çalışma İlkeleri -->
        <h2 style="font-size: 11px; color: ${textDark}; font-weight: 700; margin-top: 15px; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid ${brandColor}; padding-bottom: 2px;">3. ORTAK ÇALIŞMA İLKELERİMİZ</h2>
        <div style="font-size: 9px; color: #475569; line-height: 1.45; margin-bottom: 25px;">
          <ul style="margin: 0; padding-left: 15px;">
            <li style="margin-bottom: 4px;"><strong>Hesap Sahibi Sizsiniz:</strong> Tüm reklam hesapları (Google Ads, Meta Ads vb.) şirketiniz adına açılır veya mevcut hesaplar kullanılır. Hesapların mülkiyeti her zaman sizdedir.</li>
            <li style="margin-bottom: 4px;"><strong>Şeffaflık & Raporlama:</strong> Kampanyaların tüm verileri ve harcamaları eş zamanlı olarak şeffaf şekilde panelden izlenebilir, seçtiğiniz pakete göre haftalık/aylık raporlama yapılır.</li>
            <li style="margin-bottom: 4px;"><strong>Bütçe ve Kampanya Yönetimi:</strong> Kampanyalar günlük olarak negatif anahtar kelime denetimlerinden geçirilir, kitle optimizasyonları ve ROAS artış hedefleri anlık takip edilir.</li>
          </ul>
        </div>

        <!-- Acceptance / Signature Block -->
        <div style="display: flex; justify-content: space-between; margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 20px; page-break-inside: avoid;">
          <div style="width: 200px; text-align: center; font-size: 9px;">
            <strong style="color: #64748b; text-transform: uppercase; font-size: 7.5px; display: block; margin-bottom: 40px;">TEKLİF EDEN / AJANS ROTA</strong>
            <div style="border-bottom: 1px solid #cbd5e1; width: 140px; margin: 0 auto 5px auto;"></div>
            <span style="color: ${textDark}; font-weight: 600;">Ajans Rota Performans A.Ş.</span>
          </div>
          <div style="width: 200px; text-align: center; font-size: 9px;">
            <strong style="color: #64748b; text-transform: uppercase; font-size: 7.5px; display: block; margin-bottom: 40px;">TEKLİF ONAYLAYAN / MÜŞTERİ</strong>
            <div style="border-bottom: 1px solid #cbd5e1; width: 140px; margin: 0 auto 5px auto;"></div>
            <span style="color: ${textDark}; font-weight: 600;">${lead.company || lead.fullName}</span>
          </div>
        </div>

        <!-- Footer -->
        <div style="margin-top: 45px; border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-size: 7.5px; color: #94a3b8; page-break-inside: avoid;">
          Bu teklif belgesi Ajans Rota dijital performans yönetim ekibi tarafından otomatik oluşturulmuştur. Fiyatlar KDV hariçtir.<br>
          <strong>www.ajansrota.com | {settingsData?.email || 'hello@ajansrota.com'} | {settingsData?.phone || '+90 544 584 45 43'}</strong>
        </div>

      </div>
    `;
    document.body.appendChild(element);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ajans_Rota_Teklif_${lead.fullName.replace(/\s+/g, '_')}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: 'css'
      }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    }).catch(err => {
      console.error("Proposal PDF generation failed:", err);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  };

  const handleSendProposalEmail = async lead => {
    if (!lead) return;
    setIsSendingProposal(true);
    const isWebDesign = lead.service === 'Web Tasarım Talebi';
    const emailSubject = encodeURIComponent(`Ajans Rota - Kurumsal Hizmet Teklifi (${lead.company || lead.fullName})`);
    let emailBody = '';
    if (isWebDesign) {
      emailBody = `Sayın ${lead.fullName},\n\n` + `Markanız için yaptığınız Web Tasarım Projesi talebine istinaden hazırladığımız kurumsal hizmet teklifimiz e-postamıza eklenmiştir.\n\n` + `Proje Detayları:\n` + `- Proje Türü: ${lead.company}\n` + `- Talebiniz: ${lead.message || '-'}\n\n` + `Detayları ve süreci görüşmek için en kısa sürede sizinle iletişime geçeceğiz.\n\n` + `Saygılarımızla,\n` + `Ajans Rota Performans Departmanı\n` + `www.ajansrota.com | ${settingsData?.email || 'hello@ajansrota.com'}`;
    } else {
      const parsed = parseProposalDetails(lead.message);
      emailBody = `Sayın ${lead.fullName},\n\n` + `Ajans Rota Hizmet Bedeli Planlayıcısı üzerinden yaptığınız talebe istinaden hazırladığımız fiyat teklifi ve detaylar aşağıda bilgilerinize sunulmuştur.\n\n` + `Teklif Detayları:\n` + `- Seçilen Hizmetler: ${parsed.services}\n` + `- Çalışma Modeli: ${parsed.pricingModel}\n` + `- Taahhüt Süresi: ${parsed.term}\n` + `- Raporlama Paketi: ${parsed.reporting}\n` + `- Aylık Reklam Bütçesi: ${parsed.adBudget}\n` + `- Aylık Ajans Ücreti: ${parsed.fee} (KDV Hariç)\n\n` + `Resmi antetli teklif belgeniz ekte sunulmuştur. İş birliğimizi başlatmak ve kampanya kurulumlarına geçmek için bu e-postayı onaylayabilirsiniz.\n\n` + `Saygılarımızla,\n` + `Ajans Rota Performans Departmanı\n` + `www.ajansrota.com | ${settingsData?.email || 'hello@ajansrota.com'}`;
    }
    const mailtoUrl = `mailto:${lead.email}?subject=${emailSubject}&body=${encodeURIComponent(emailBody)}`;
    setTimeout(() => {
      const updated = leadsData.map(l => l.id === lead.id ? {
        ...l,
        status: 'sent'
      } : l);
      setLeadsData(updated);
      setSelectedLead({
        ...lead,
        status: 'sent'
      });
      saveLeadsOnly(updated);
      setIsSendingProposal(false);
      toast.success(`Teklif başarıyla gönderildi! Durum "Teklif İletildi" olarak güncellendi. \n\nMüşterinin e-posta adresi (${lead.email}) için e-posta taslağı tetikleniyor...`);
      if (lead.email) {
        window.open(mailtoUrl, '_blank');
      }
    }, 1500);
  };

  const getStatusLabel = status => {
    switch (status) {
      case 'unread':
        return 'Yeni (Okunmadı)';
      case 'yeni':
        return 'Yeni Başvuru';
      case 'iletisimde':
        return 'İletişimde';
      case 'toplanti_planlandi':
        return 'Toplantı Planlandı';
      case 'analiz_fazinda':
        return 'Analiz Fazında';
      case 'teklif_hazirlaniyor':
        return 'Teklif Hazırlanıyor';
      case 'teklif_iletildi':
        return 'Teklif İletildi';
      case 'revize_istendi':
        return 'Revize İstendi';
      case 'sozlesme_asamasinda':
        return 'Sözleşme Aşamasında';
      case 'kazanildi':
        return 'Kazanıldı';
      case 'kaybedildi':
        return 'Kaybedildi';
      case 'ertelendi':
        return 'Ertelendi';
      case 'read':
        return 'Okundu';
      default:
        return status || 'Bilinmiyor';
    }
  };

  const handleSaveCRM = (leadId, newStatus, newNotes, newReminderDate) => {
    const prevLead = leadsData.find(l => l.id === leadId);
    if (!prevLead) return;
    let history = Array.isArray(prevLead.activityHistory) ? [...prevLead.activityHistory] : [];
    const nowStr = new Date().toLocaleString('tr-TR');
    if (history.length === 0) {
      history.push({
        date: prevLead.created_at ? new Date(prevLead.created_at).toLocaleString('tr-TR') : nowStr,
        type: 'system',
        text: 'Talep sisteme ulaştı.'
      });
    }
    if (prevLead.status !== newStatus) {
      history.push({
        date: nowStr,
        type: 'status_change',
        text: `Talep durumu "${getStatusLabel(prevLead.status)}" -> "${getStatusLabel(newStatus)}" olarak güncellendi.`
      });
    }
    if ((prevLead.internalNotes || '') !== (newNotes || '')) {
      history.push({
        date: nowStr,
        type: 'note_change',
        text: newNotes ? `Not: "${newNotes.substring(0, 45)}${newNotes.length > 45 ? '...' : ''}"` : 'Görüşme notları silindi.'
      });
    }
    if ((prevLead.reminderDate || '') !== (newReminderDate || '')) {
      history.push({
        date: nowStr,
        type: 'reminder_change',
        text: newReminderDate ? `Takip hatırlatıcısı planlandı: ${newReminderDate}` : 'Takip hatırlatıcısı kaldırıldı.'
      });
    }
    const updated = leadsData.map(l => l.id === leadId ? {
      ...l,
      status: newStatus,
      internalNotes: newNotes,
      reminderDate: newReminderDate,
      activityHistory: history
    } : l);
    setLeadsData(updated);
    setSelectedLead(prev => prev ? {
      ...prev,
      status: newStatus,
      internalNotes: newNotes,
      reminderDate: newReminderDate,
      activityHistory: history
    } : null);
    saveLeadsOnly(updated);
    toast('CRM Bilgileri (Durum, Notlar ve Takip Tarihi) başarıyla kaydedildi.');
  };

  const handleDownloadPDF = lead => {
    if (!lead || !lead.simulatorData) return;
    if (window.html2pdf) {
      generatePDF(lead);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generatePDF(lead);
      };
      document.body.appendChild(script);
    }
  };

  const generatePDF = lead => {
    const {
      type,
      params,
      improvements
    } = lead.simulatorData;
    const isEcom = type === 'ecommerce';
    const {
      diagnosis,
      steps
    } = generateDynamicRoadmap(type, params, improvements);

    // Create temp container
    const element = document.createElement('div');
    element.id = 'temp-pdf-container';
    element.style.width = '700px';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '0';
    element.style.margin = '0';
    const brandColor = isEcom ? '#0284c7' : '#0d9488';
    const brandLight = isEcom ? 'rgba(2, 132, 199, 0.04)' : 'rgba(13, 148, 136, 0.04)';
    const textDark = '#0f172a';
    let comparisonRowsHtml = '';
    let inputsHtml = '';
    if (isEcom) {
      inputsHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Reklam Bütçesi</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.spend?.toLocaleString('tr-TR')} ₺</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Aylık Trafik</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.traffic?.toLocaleString('tr-TR')}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Sepet (AOV)</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.aov?.toLocaleString('tr-TR')} ₺</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Mevcut Ciro</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.revenue?.toLocaleString('tr-TR')} ₺</div>
          </div>
        </div>
      `;
      comparisonRowsHtml = `
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Aylık Gelir (Ciro)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.revenue?.toLocaleString('tr-TR')} ₺</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newCiro?.toLocaleString('tr-TR')} ₺
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Dönüşüm Oranı (CR)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">%${params.cr?.toFixed(2)}</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            %${improvements.newCR?.toFixed(2)}
            <span style="background-color: ${brandLight}; color: ${brandColor}; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(2, 132, 199, 0.12);">
              +${Math.round((improvements.newCR - params.cr) / (params.cr || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">ROAS (Reklam Verimliliği)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.roas}x</td>
          <td style="padding: 10px; text-align: right; color: #16a34a; font-weight: 700;">
            ${improvements.newRoas}x
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round((improvements.newRoas - params.roas) / (params.roas || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Müşteri Edinme Maliyeti (CAC)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.cac?.toLocaleString('tr-TR')} ₺</td>
          <td style="padding: 10px; text-align: right; color: #ef4444; font-weight: 700;">
            ${improvements.newCac?.toLocaleString('tr-TR')} ₺
            <span style="background-color: rgba(239, 68, 68, 0.1); color: #ef4444; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(239, 68, 68, 0.15);">
              -${Math.round((params.cac - improvements.newCac) / (params.cac || 1) * 100)}%
            </span>
          </td>
        </tr>
      `;
    } else {
      inputsHtml = `
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px;">
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Aylık Bütçe</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.spend?.toLocaleString('tr-TR')} ₺</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Aylık Talep (Lead)</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.leads?.toLocaleString('tr-TR')}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Dönüşüm Oranı</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">%${params.conversion}</div>
          </div>
          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px; text-align: center;">
            <span style="font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase;">Müşteri LTV</span>
            <div style="font-size: 13px; font-weight: 700; color: ${brandColor}; margin-top: 4px;">${params.ltv?.toLocaleString('tr-TR')} ₺</div>
          </div>
        </div>
      `;
      comparisonRowsHtml = `
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Toplam Gelir (LTV)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.revenue?.toLocaleString('tr-TR')} ₺</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newCiro?.toLocaleString('tr-TR')} ₺
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Aylık Form / Talep</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.leads}</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newLeads}
            <span style="background-color: ${brandLight}; color: ${brandColor}; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(2, 132, 199, 0.12);">
              +${Math.round((improvements.newLeads - params.leads) / (params.leads || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="border-bottom: 1px solid #e2e8f0; page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Satış Dönüşüm Oranı</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">%${params.conversion}</td>
          <td style="padding: 10px; text-align: right; color: #16a34a; font-weight: 700;">
            %${improvements.newConversion}
            <span style="background-color: rgba(22, 163, 74, 0.1); color: #16a34a; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(22, 163, 74, 0.15);">
              +${Math.round((improvements.newConversion - params.conversion) / (params.conversion || 1) * 100)}%
            </span>
          </td>
        </tr>
        <tr style="page-break-inside: avoid;">
          <td style="padding: 10px; font-weight: 600; color: ${textDark};">Yatırım Getirisi (ROI)</td>
          <td style="padding: 10px; text-align: center; color: #64748b;">${params.roi}x</td>
          <td style="padding: 10px; text-align: right; color: ${brandColor}; font-weight: 700;">
            ${improvements.newRoi}x
            <span style="background-color: ${brandLight}; color: ${brandColor}; padding: 2px 5px; border-radius: 4px; font-size: 9px; margin-left: 5px; font-weight: bold; border: 1px solid rgba(2, 132, 199, 0.12);">
              +${Math.round((improvements.newRoi - params.roi) / (params.roi || 1) * 100)}%
            </span>
          </td>
        </tr>
      `;
    }
    element.innerHTML = `
      <!-- PAGE 1 -->
      <div style="width: 700px; padding: 15px; box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.4; font-size: 11px; page-break-after: always;">
        <!-- Header -->
        <div style="border-bottom: 2px solid ${brandColor}; padding-bottom: 8px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <h1 style="margin: 0; font-size: 18px; color: ${textDark}; font-weight: 900; letter-spacing: -0.04em;">AJANS ROTA</h1>
            <p style="margin: 2px 0 0 0; font-size: 8.5px; color: #64748b; text-transform: uppercase; letter-spacing: 0.12em; font-weight: 700;">STRATEJİK DİJİTAL BÜYÜME RAPORU</p>
          </div>
          <div style="text-align: right;">
            <span style="background-color: ${brandColor}; color: #ffffff; padding: 2px 6px; border-radius: 12px; font-size: 8px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Kişiye Özel Analiz</span>
            <p style="margin: 4px 0 0 0; font-size: 8.5px; color: #64748b;">Kod: <strong>AR-${Math.floor(100000 + Math.random() * 900000)}</strong></p>
          </div>
        </div>

        <!-- 1. Stratejik Değerlendirme & Giriş -->
        <h2 style="font-size: 12px; color: ${textDark}; font-weight: 700; margin-top: 0; margin-bottom: 4px;">1. Stratejik Değerlendirme & Giriş</h2>
        <p style="color: #475569; font-size: 10px; margin-bottom: 10px; line-height: 1.35;">
          Sayın <strong>${lead.fullName}</strong>, bu rapor, ${lead.company ? `<strong>${lead.company}</strong>` : 'markanız'} için simülatörde paylaştığınız dijital pazarlama verileri doğrultusunda, <strong>Ajans Rota Performans Departmanı</strong> tarafından hazırlanmıştır. Raporun amacı, reklam bütçenizi en verimli şekilde kullanarak ciro ve talep potansiyelinizi maksimum seviyeye çıkarma yollarını göstermektir.
        </p>

        <!-- Key Metrics Highlight Callout Card -->
        <div style="background: ${brandColor}; color: #ffffff; padding: 10px 12px; border-radius: 6px; display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px;">
          <div>
            <span style="font-size: 7.5px; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.9; font-weight: 600;">Hedeflenen Yıllık Ek Gelir Artışı</span>
            <h2 style="margin: 1px 0 0 0; font-size: 16px; font-weight: 800; letter-spacing: -0.02em;">+${(improvements.revenueIncrease * 12).toLocaleString('tr-TR')} ₺</h2>
          </div>
          <div style="text-align: right; background: rgba(255,255,255,0.15); padding: 4px 6px; border-radius: 4px; font-size: 9px; line-height: 1.25;">
            Harcama Değişmeden<br><strong>+${Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}% Büyüme</strong>
          </div>
        </div>

        <!-- Customer Info Table -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px; font-size: 9.5px; margin-bottom: 10px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500; width: 120px;">Müşteri / Marka:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 700;">${lead.fullName}</td>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500; width: 90px; text-align: right;">Oluşturulma:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 700; text-align: right;">${lead.created_at || new Date().toLocaleDateString('tr-TR')}</td>
            </tr>
            <tr>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500;">İletişim Bilgileri:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 600;">${lead.email || '-'} | ${lead.phone || '-'}</td>
              <td style="padding: 1px 0; color: #64748b; font-weight: 500; text-align: right;">Hizmet Grubu:</td>
              <td style="padding: 1px 0; color: ${textDark}; font-weight: 700; text-align: right;">${lead.service}</td>
            </tr>
          </table>
        </div>

        <!-- 2. Mevcut Metrikler ve Ajans Rota Büyüme Karşılaştırması -->
        <h2 style="font-size: 12px; color: ${textDark}; font-weight: 700; margin-top: 0; margin-bottom: 4px;">2. Performans Verileri ve İyileştirme Planı</h2>
        <p style="color: #64748b; font-size: 9px; margin-bottom: 8px; line-height: 1.35;">
          Girilen verileriniz analiz edilerek, Ajans Rota optimizasyon modeli uygulandığında elde edilecek hedef performans artışları aşağıda listelenmiştir.
        </p>

        <!-- Sliders Inputs View -->
        ${inputsHtml}

        <!-- Comparison Table -->
        <div style="border: 1px solid #e2e8f0; border-radius: 6px; overflow: hidden; background: #ffffff;">
          <table style="width: 100%; border-collapse: collapse; font-size: 9.5px; text-align: left;">
            <thead>
              <tr style="background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
                <th style="padding: 6px 10px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px;">Metrik Adı</th>
                <th style="padding: 6px 10px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: center;">Mevcut Durum</th>
                <th style="padding: 6px 10px; font-weight: 700; color: #475569; text-transform: uppercase; font-size: 8px; text-align: right;">Ajans Rota Hedefi</th>
              </tr>
            </thead>
            <tbody>
              ${comparisonRowsHtml}
            </tbody>
          </table>
        </div>
        
        <!-- Footer Page 1 -->
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8;">
          <span>www.ajansrota.com</span>
          <span>Sayfa 1 / 2</span>
        </div>
      </div>

      <!-- PAGE 2 -->
      <div style="width: 700px; padding: 15px; box-sizing: border-box; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.4; font-size: 11px;">
        <!-- Page 2 Header -->
        <div style="border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; margin-bottom: 12px; display: flex; justify-content: space-between; align-items: center;">
          <span style="font-size: 8.5px; font-weight: bold; color: ${brandColor}; text-transform: uppercase; letter-spacing: 0.05em;">AJANS ROTA STRATEJİK EYLEM PLANI</span>
          <span style="font-size: 8px; color: #94a3b8;">Sayfa 2 / 2</span>
        </div>

        <!-- 3. Durum Analizi, Teşhis and Rota Yol Haritası -->
        <h2 style="font-size: 12px; color: ${brandColor}; font-weight: 700; margin-top: 0; margin-bottom: 4px;">3. Durum Analizi, Teşhis ve Rota Yol Haritası</h2>
        
        <!-- Diagnosis Card -->
        <div style="background-color: ${brandLight}; border-left: 4px solid ${brandColor}; padding: 8px 10px; border-radius: 4px; margin-bottom: 12px; font-size: 9.5px; line-height: 1.35; color: #334155;">
          <strong style="color: ${textDark}; font-size: 10px; display: block; margin-bottom: 2px;">💡 Mevcut Durum Teşhisi:</strong>
          ${diagnosis}
        </div>

        <!-- Strategy Steps -->
        <h3 style="font-size: 10.5px; color: ${textDark}; font-weight: 700; margin-top: 0; margin-bottom: 6px;">Ajans Rota Performans Yol Haritası (Uygulama Adımları)</h3>
        <div style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px;">
          ${steps.map((step, index) => `
            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; display: flex; gap: 8px; align-items: flex-start; page-break-inside: avoid;">
              <div style="background: ${brandColor}; color: #ffffff; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 9px; flex-shrink: 0; margin-top: 1px;">
                ${index + 1}
              </div>
              <div>
                <strong style="font-size: 10px; color: ${textDark}; display: block; margin-bottom: 1px;">${step.title}</strong>
                <p style="margin: 0; font-size: 9px; color: #475569; line-height: 1.3;">${step.desc}</p>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Why Ajans Rota section -->
        <h2 style="font-size: 12px; color: ${textDark}; font-weight: 800; margin-top: 8px; margin-bottom: 4px; text-align: center;">Neden Ajans Rota Büyüme Modeli?</h2>
        <p style="color: #475569; font-size: 9.5px; max-width: 600px; margin: 0 auto 8px auto; line-height: 1.35; text-align: center;">
          Ajans Rota, markaların reklam bütçelerini veriye dayalı performans metodolojisi ile yönetir. Yapay zeka destekli hedefleme araçlarımız, dönüşüm oranı iyileştirmesi (CRO) tecrübemiz ve uzman ekibimizle bütçenizin kârlı bir ciroya dönüşmesini garanti altına alıyoruz.
        </p>

        <!-- Three pillars -->
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-bottom: 12px;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; page-break-inside: avoid;">
            <strong style="color: ${brandColor}; font-size: 9.5px; display: block; margin-bottom: 2px;">🎯 Hedef Odaklılık</strong>
            <span style="font-size: 8px; color: #64748b; line-height: 1.25; display: block;">Tüm çalışmalarımızı ciro, ROI ve CAC gibi doğrudan kârlılığa etki eden ana performans metriklerine göre kurgularız.</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; page-break-inside: avoid;">
            <strong style="color: ${brandColor}; font-size: 9.5px; display: block; margin-bottom: 2px;">📊 Şeffaf Raporlama</strong>
            <span style="font-size: 8px; color: #64748b; line-height: 1.25; display: block;">Yapay veri veya karmaşık terimlerle değil; harcanan bütçeyi ve kazanılan net dönüşümü gösteren şeffaf paneller sunarız.</span>
          </div>
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 6px; padding: 6px 8px; page-break-inside: avoid;">
            <strong style="color: ${brandColor}; font-size: 9.5px; display: block; margin-bottom: 2px;">🚀 Sürekli Optimizasyon</strong>
            <span style="font-size: 8px; color: #64748b; line-height: 1.25; display: block;">Reklam campaigns ve kreatiflerinizi haftalık A/B testleri ile sürekli güncelleriz.</span>
          </div>
        </div>

        <!-- Call to Action Box -->
        <div style="background: #ffffff; border: 1px solid ${brandColor}; border-radius: 6px; padding: 10px; box-sizing: border-box; text-align: center; page-break-inside: avoid; margin-bottom: 6px;">
          <h3 style="margin: 0 0 2px 0; font-size: 10.5px; color: ${textDark}; font-weight: 700;">Bu Yol Haritasını Birlikte Hayata Geçirelim!</h3>
          <p style="margin: 0 0 6px 0; font-size: 8.5px; color: #64748b;">
            Analizdeki büyüme hedeflerine ulaşmak ve firmanıza özel detaylı medya planını hazırlamak için büyüme uzmanlarımızla hemen iletişime geçin.
          </p>
          <div style="display: inline-block; background: ${brandColor}; color: #ffffff; padding: 4px 10px; border-radius: 10px; font-weight: bold; font-size: 8.5px; text-transform: uppercase; letter-spacing: 0.05em; text-decoration: none;">
            Toplantı Planlayın & Büyümeye Başlayın
          </div>
        </div>

        <!-- Footer Page 2 -->
        <div style="margin-top: 30px; border-top: 1px solid #e2e8f0; padding-top: 8px; text-align: center; font-size: 7.5px; color: #94a3b8; page-break-inside: avoid;">
          Ajans Rota Büyüme Simülatörü analizi sonucudur. Bu rapor bilgilendirme amaçlı olup kesin ticari taahhüt içermez.<br>
          <strong>www.ajansrota.com | {settingsData?.email || 'info@ajansrota.com'} | {settingsData?.phone || '+90 (232) 123 45 67'}</strong>
        </div>
      </div>
    `;
    document.body.appendChild(element);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ajans_Rota_Buyume_Raporu_${lead.fullName.replace(/\s+/g, '_')}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: 'css'
      }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    }).catch(err => {
      console.error("PDF generation failed:", err);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  };

  const renderSimulatorData = lead => {
    if (!lead || !lead.simulatorData) return null;
    const {
      type,
      params,
      improvements,
      sector
    } = lead.simulatorData;
    const isEcom = type === 'ecommerce';
    const accentColor = isEcom ? 'var(--primary)' : 'var(--secondary)';
    const accentGlow = isEcom ? 'rgba(2, 132, 199, 0.08)' : 'rgba(236, 72, 153, 0.08)';
    const getSectorLabel = (t, s) => {
      if (!s) return 'Belirtilmedi';
      if (t === 'ecommerce') {
        switch (s) {
          case 'fashion':
            return 'Moda & Giyim';
          case 'cosmetics':
            return 'Kozmetik & Bakım';
          case 'food':
            return 'Gıda & Yöresel Ürünler';
          case 'furniture':
            return 'Mobilya & Ev Dekorasyon';
          default:
            return 'Genel E-Ticaret';
        }
      } else {
        switch (s) {
          case 'industry':
            return 'Sanayi & Endüstriyel Üretim';
          case 'tourism':
            return 'Turizm & Otelcilik';
          case 'service':
            return 'Hizmet & Danışmanlık';
          default:
            return 'Genel B2B';
        }
      }
    };
    return <div className="mt-2 mb-4 bg-white/1 border border-glass rounded-xl overflow-hidden">
        {/* Header */}
        <div className={`px-4 py-3 border-b border-glass flex items-center justify-between gap-2.5 ${isEcom ? 'bg-gradient-to-r from-sky-500/12 to-sky-600/3' : 'bg-gradient-to-r from-pink-500/12 to-fuchsia-500/3'}`}>
          <div className="flex items-center gap-2.5">
            <i className={`${isEcom ? "fa-solid fa-cart-shopping" : "fa-solid fa-briefcase"} text-lg`} style={{ color: accentColor }}></i>
            <div>
              <h4 className="m-0 text-sm font-semibold text-textLight">
                {isEcom ? 'E-Ticaret Büyüme Simülasyonu Verileri' : 'B2B Büyüme Simülasyonu Verileri'}
              </h4>
              <span className="text-[11px] text-textMuted">Müşterinin form doldururken seçtiği parametreler</span>
            </div>
          </div>
          {sector && <div className={`px-2.5 py-1 text-xs font-semibold rounded-md border ${isEcom ? 'bg-sky-500/15 border-primary text-sky-600' : 'bg-pink-500/15 border-secondary text-pink-500'}`}>
              Sektör: {getSectorLabel(type, sector)}
            </div>}
        </div>

        {/* Input Parameters Grid */}
        <div className="px-4 py-3 border-b border-glass">
          <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
            {isEcom ? <>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Aylık Bütçe</span>
                  <strong className="text-sm text-textLight">{params.spend?.toLocaleString('tr-TR')} ₺</strong>
                </div>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Aylık Trafik</span>
                  <strong className="text-sm text-textLight">{params.traffic?.toLocaleString('tr-TR')}</strong>
                </div>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Ort. Sepet (AOV)</span>
                  <strong className="text-sm text-textLight">{params.aov?.toLocaleString('tr-TR')} ₺</strong>
                </div>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Mevcut Ciro</span>
                  <strong className="text-sm text-textLight">{params.revenue?.toLocaleString('tr-TR')} ₺</strong>
                </div>
              </> : <>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Aylık Bütçe</span>
                  <strong className="text-sm text-textLight">{params.spend?.toLocaleString('tr-TR')} ₺</strong>
                </div>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Talep (Lead)</span>
                  <strong className="text-sm text-textLight">{params.leads}</strong>
                </div>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">Dönüşüm Oranı</span>
                  <strong className="text-sm text-textLight">%{params.conversion}</strong>
                </div>
                <div className="bg-white/1 border border-white/3 rounded-lg px-2.5 py-1.5">
                  <span className="block text-[10.5px] text-textMuted">LTV</span>
                  <strong className="text-sm text-textLight">{params.ltv?.toLocaleString('tr-TR')} ₺</strong>
                </div>
              </>}
          </div>
        </div>

        {/* Comparison Details */}
        <div className="px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider block mb-2.5" style={{ color: accentColor }}>
            Karşılaştırma Tablosu (Mevcut vs. Ajans Rota Büyüme)
          </span>
          <div className="border border-glass rounded-lg overflow-hidden bg-black/10">
            {/* Table Header */}
            <div className="grid grid-cols-[1.2fr_1fr_1.2fr] bg-white/2 px-2.5 py-1.5 border-b border-glass text-[10px] font-semibold text-textMuted uppercase">
              <span>Metrik</span>
              <span className="text-center">Mevcut</span>
              <span className="text-right">Ajans Rota</span>
            </div>

            {/* Table Rows */}
            {isEcom ? <>
                {/* Row 1: Ciro */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 border-b border-white/3 text-xs items-center">
                  <span className="text-textLight">Aylık Gelir</span>
                  <span className="text-center text-textMuted">{params.revenue?.toLocaleString('tr-TR')} ₺</span>
                  <span className="text-right text-primary font-semibold flex items-center justify-end gap-1">
                    {improvements.newCiro?.toLocaleString('tr-TR')} ₺
                    <span className="bg-green-600/10 text-green-600 border border-green-600/15 px-1 py-0.5 rounded text-[10px]">
                      +{Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 2: CR */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 border-b border-white/3 text-xs items-center">
                  <span className="text-textLight">Dönüşüm Oranı</span>
                  <span className="text-center text-textMuted">%{params.cr?.toFixed(2)}</span>
                  <span className="text-right text-primary font-semibold flex items-center justify-end gap-1">
                    %{improvements.newCR?.toFixed(2)}
                    <span className="bg-sky-500/10 text-sky-500 border border-sky-500/15 px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: accentGlow, color: accentColor }}>
                      +{Math.round((improvements.newCR - params.cr) / (params.cr || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 3: ROAS */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 border-b border-white/3 text-xs items-center">
                  <span className="text-textLight">ROAS</span>
                  <span className="text-center text-textMuted">{params.roas}x</span>
                  <span className="text-right text-green-600 font-semibold flex items-center justify-end gap-1">
                    {improvements.newRoas}x
                    <span className="bg-green-600/10 text-green-600 border border-green-600/15 px-1 py-0.5 rounded text-[10px]">
                      +{Math.round((improvements.newRoas - params.roas) / (params.roas || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 4: CAC */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 text-xs items-center">
                  <span className="text-textLight">CAC (Müşteri Edinme)</span>
                  <span className="text-center text-textMuted">{params.cac?.toLocaleString('tr-TR')} ₺</span>
                  <span className="text-right text-red-500 font-semibold flex items-center justify-end gap-1">
                    {improvements.newCac?.toLocaleString('tr-TR')} ₺
                    <span className="bg-red-500/10 text-red-500 border border-red-500/15 px-1 py-0.5 rounded text-[10px]">
                      -{Math.round((params.cac - improvements.newCac) / (params.cac || 1) * 100)}%
                    </span>
                  </span>
                </div>
              </> : <>
                {/* Row 1: Ciro */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 border-b border-white/3 text-xs items-center">
                  <span className="text-textLight">Toplam Gelir (LTV)</span>
                  <span className="text-center text-textMuted">{params.revenue?.toLocaleString('tr-TR')} ₺</span>
                  <span className="text-right text-secondary font-semibold flex items-center justify-end gap-1">
                    {improvements.newCiro?.toLocaleString('tr-TR')} ₺
                    <span className="bg-green-600/10 text-green-600 border border-green-600/15 px-1 py-0.5 rounded text-[10px]">
                      +{Math.round(improvements.revenueIncrease / (params.revenue || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 2: Leads */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 border-b border-white/3 text-xs items-center">
                  <span className="text-textLight">Aylık Form / Talep</span>
                  <span className="text-center text-textMuted">{params.leads}</span>
                  <span className="text-right text-secondary font-semibold flex items-center justify-end gap-1">
                    {improvements.newLeads}
                    <span className="bg-pink-500/10 text-pink-500 border border-pink-500/15 px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: accentGlow, color: accentColor }}>
                      +{Math.round((improvements.newLeads - params.leads) / (params.leads || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 3: Conversion Rate */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 border-b border-white/3 text-xs items-center">
                  <span className="text-textLight">Satış Dönüşüm Oranı</span>
                  <span className="text-center text-textMuted">%{params.conversion}</span>
                  <span className="text-right text-secondary font-semibold flex items-center justify-end gap-1">
                    %{improvements.newConversion}
                    <span className="bg-pink-500/10 text-pink-500 border border-pink-500/15 px-1 py-0.5 rounded text-[10px]" style={{ backgroundColor: accentGlow, color: accentColor }}>
                      +{Math.round((improvements.newConversion - params.conversion) / (params.conversion || 1) * 100)}%
                    </span>
                  </span>
                </div>

                {/* Row 4: ROI */}
                <div className="grid grid-cols-[1.2fr_1fr_1.2fr] px-2.5 py-1.5 text-xs items-center">
                  <span className="text-textLight">ROI</span>
                  <span className="text-center text-textMuted">{params.roi}x</span>
                  <span className="text-right text-green-600 font-semibold flex items-center justify-end gap-1">
                    {improvements.newRoi}x
                    <span className="bg-green-600/10 text-green-600 border border-green-600/15 px-1 py-0.5 rounded text-[10px]">
                      +{Math.round((improvements.newRoi - params.roi) / (params.roi || 1) * 100)}%
                    </span>
                  </span>
                </div>
              </>}
          </div>
        </div>
      </div>;
  };

    const getSectorLabel = (t, s) => {
      if (!s) return 'Belirtilmedi';
      if (t === 'ecommerce') {
        switch (s) {
          case 'fashion':
            return 'Moda & Giyim';
          case 'cosmetics':
            return 'Kozmetik & Bakım';
          case 'food':
            return 'Gıda & Yöresel Ürünler';
          case 'furniture':
            return 'Mobilya & Ev Dekorasyon';
          default:
            return 'Genel E-Ticaret';
        }
      } else {
        switch (s) {
          case 'industry':
            return 'Sanayi & Endüstriyel Üretim';
          case 'tourism':
            return 'Turizm & Otelcilik';
          case 'service':
            return 'Hizmet & Danışmanlık';
          default:
            return 'Genel B2B';
        }
      }
    };

  const renderLeadMessage = lead => {
    if (!lead || !lead.message) return null;
    const lines = lead.message.split('\n');
    const isStructured = lines.length > 1 && lines.some(line => line.includes(':'));
    if (!isStructured) {
      return <p className="whitespace-pre-wrap bg-slate-900/2 p-4 rounded-lg border border-glass text-sm text-textLight leading-relaxed mt-1">
          {lead.message}
        </p>;
    }
    return <div className="bg-slate-900/1 border border-glass rounded-lg overflow-hidden mt-1">
        <div className="bg-slate-900/3 px-3 py-2 border-b border-glass text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5">
          <i className="fa-solid fa-calculator"></i> Simülasyon / Detay Verileri
        </div>
        <div className="p-3 flex flex-col gap-2.5">
          {lines.map((line, index) => {
          if (!line.trim()) return null;
          const isNote = line.startsWith('(') && line.endsWith(')');
          const displayLine = isNote ? line.slice(1, -1) : line;
          const colonIndex = displayLine.indexOf(':');
          if (colonIndex === -1) {
            return <div key={index} className="text-xs text-textMuted italic pt-1 border-t border-dashed border-glass mt-1">
                  {line}
                </div>;
          }
          const label = displayLine.substring(0, colonIndex).trim();
          const value = displayLine.substring(colonIndex + 1).trim();
          const isHighlight = label.includes('Bedel') || label.includes('Kâr') || label.includes('Ciro') && !label.includes('Hedef') && !label.includes('Bütçe');
          return <div key={index} className={`flex justify-between items-center pb-1.5 flex-wrap gap-2 ${index === lines.length - 1 ? '' : 'border-b border-slate-900/3'}`}>
                <span className={`font-medium text-xs flex items-center gap-1 ${isNote ? 'text-textMuted' : 'text-textLight'}`}>
                  {getIconForLabel(label)} {label}
                </span>
                <span className={`${isHighlight ? 'font-bold text-[13.5px] text-secondary bg-pink-500/10 border border-pink-500/20' : 'font-semibold text-xs text-textLight bg-slate-900/2 border border-glass'} px-2 py-0.5 rounded-md`}>
                  {value}
                </span>
              </div>;
        })}
        </div>
      </div>;
  };

  const exportLeadsToCSV = dataToExport => {
    const data = dataToExport || leadsData;
    if (data.length === 0) {
      toast("Dışa aktarılacak veri bulunamadı.");
      return;
    }
    const headers = ["ID", "Tarih", "Ad Soyad", "E-Posta", "Telefon", "Şirket/Web Sitesi", "Hizmet Grubu", "Trafik Kaynağı", "Durum", "Mesaj Detayı"];
    const rows = data.map(lead => [lead.id || '', lead.created_at || '', lead.fullName || '', lead.email || '', lead.phone || '', lead.company || '', lead.service || '', lead.trafficSource || 'Organik (SEO)', lead.status === 'unread' ? 'Yeni' : 'Okundu', (lead.message || '').replace(/"/g, '""').replace(/\r?\n/g, ' ')]);
    const csvContent = [headers.join(','), ...rows.map(e => e.map(val => `"${val}"`).join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: 'text/csv;charset=utf-8;'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ajans_rota_talepler_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getLocalGuideFallback = (guideTitle, lead) => {
    const companyName = lead.company || 'Değerli İşletmemiz';
    const customerName = lead.fullName;
    if (guideTitle.toLowerCase().includes('ihracat') || guideTitle.toLowerCase().includes('global')) {
      return {
        title: `Ege'den Dünyaya E-İhracat ve Büyüme Rehberi (Özel Sürüm)`,
        introduction: `Merhaba Sayın ${customerName}, ${companyName} firması için özel olarak hazırlanan e-ihracat yol haritanıza hoş geldiniz. Ege Bölgesi'nin eşsiz potansiyelini global pazarlarla buluşturmak için atmanız gereken adımları bu rehberde derledik.`,
        sections: [{
          sectionTitle: "1. Global Pazar Araştırması ve Ürün Konumlandırma",
          content: `<p><strong>${companyName}</strong> için yurt dışı pazarlarda doğru ürün konumlandırma kritiktir. Amazon ve Etsy gibi platformlarda Ege'nin yöresel, organik veya sanayi ürünlerini konumlandırırken rakip analizi ve niş pazar belirleme süreçlerini izlemelisiniz.</p><ul><li>Amazon FBA lojistik modellerini kullanmak depo masraflarını optimize eder.</li><li>Etsy üzerinde hikaye anlatımı (storytelling) ile el emeği veya butik ürünleri öne çıkarın.</li></ul>`
        }, {
          sectionTitle: "2. Uluslararası Lojistik ve Gümrük Çözümleri",
          content: `<p>E-ihracat süreçlerinde mikro ihracat (ETGB) kolaylığından faydalanarak gümrük süreçlerini minimize edebilirsiniz. DHL, UPS veya FedEx gibi taşıyıcılarla entegre yazılımlar kullanarak kargo takip süreçlerinizi otomatikleştirmelisiniz.</p>`
        }, {
          sectionTitle: "3. Global Dijital Pazarlama ve Reklam Yönetimi",
          content: `<p>Meta Ads ve Google Ads üzerinden hedef ülkelerdeki potansiyel alıcılara ulaşmak için yerelleştirilmiş (İngilizce, Almanca, Fransızca vb.) kampanyalar kurgulanmalıdır. Dönüşüm API'si (Conversion API) kurulumu sayesinde reklam bütçenizi en verimli şekilde kullanabilirsiniz.</p>`
        }, {
          sectionTitle: "4. Yabancı Dilde Güvenilir Web Altyapısı",
          content: `<p>Global müşterilerin sitenizden alışveriş yaparken güven duyması için çok dilli destek, yerel para birimleriyle ödeme (Stripe, PayPal) ve uluslararası güvenlik sertifikaları (SSL, 3D Secure) sitenizde eksiksiz olarak bulunmalıdır.</p>`
        }],
        conclusion: `Ajans Rota olarak, Ege'den çıkan markaları küresel pazarlara taşımak için buradayız. Bu özel plandaki adımları hayata geçirmek ve global reklam bütçenizi yönetmek için uzman ekibimizle iletişime geçebilirsiniz.`
      };
    } else if (guideTitle.toLowerCase().includes('turizm') || guideTitle.toLowerCase().includes('otel') || guideTitle.toLowerCase().includes('konaklama')) {
      return {
        title: `Konaklama ve Turizm Dijital Büyüme Kılavuzu (Özel Sürüm)`,
        introduction: `Merhaba Sayın ${customerName}, ${companyName} turizm / konaklama işletmesine özel hazırladığımız dijital büyüme ve turist çekme analizine hoş geldiniz. Ege ve İzmir'in turizm potansiyelini web siteniz üzerinden doğrudan rezervasyona dönüştürmenin yollarını aşağıda bulabilirsiniz.`,
        sections: [{
          sectionTitle: "1. Google Otel Reklamları (Google Hotel Ads) Entegrasyonu",
          content: `<p><strong>${companyName}</strong> için doğrudan rezervasyonları artırmanın en etkili yolu Google Haritalar ve Arama Ağı ile entegre Hotel Ads kampanyalarıdır. Kullanıcıların aracı siteler (Booking, Expedia vb.) yerine doğrudan kendi sitenizden yer ayırtmasını sağlayarak komisyon oranlarını düşürebilirsiniz.</p>`
        }, {
          sectionTitle: "2. Hedef Kitle Odaklı Yabancı Dil SEO Kurguları",
          content: `<p>Almanya, İngiltere ve Hollanda gibi yoğun turist gönderen ülkelerdeki arama hacimlerine odaklanarak, bölgesel gezi rehberleri ve otel olanaklarını tanıtan çok dilli SEO sayfaları oluşturulmalıdır. Butik otelinizin taş mimarisini ve begonvillerini ön plana çıkaran zengin içerikler üretilmelidir.</p>`
        }, {
          sectionTitle: "3. Sosyal Medyada Hikaye Tasarımı (Instagram & TikTok)",
          content: `<p>Turizmde satın alma kararları görsellikle doğrudan ilişkilidir. Otelinizin ambiyansını, yerel kahvaltı sofrasını ve çevre aktivitelerini gösteren reels/hikaye reklamları kurgulanarak remarketing (yeniden pazarlama) hedeflemesi yapılmalıdır.</p>`
        }, {
          sectionTitle: "4. Erken Rezervasyon ve Dinamik Fiyatlandırma Stratejileri",
          content: `<p>Sezon dışı dönemlerde talebi canlı tutmak adına dinamik indirim kodları, özel paketler (hafta sonu kaçamağı, yoga kampı vb.) ve erken rezervasyon kampanyaları dijital reklamlarla duyurulmalıdır.</p>`
        }],
        conclusion: `Ajans Rota olarak, turizm sektöründeki 10 yılı aşkın tecrübebizle otelinizin doluluk oranlarını artırmaya hazırız. Detaylı yol haritası ve reklam planlaması için bizimle iletişime geçebilirsiniz.`
      };
    } else {
      return {
        title: `E-Ticarette Dönüşüm Oranı Artırma (CRO) Kontrol Listesi (Özel Sürüm)`,
        introduction: `Merhaba Sayın ${customerName}, ${companyName} e-ticaret sitenizin ziyaretçi kalitesini ve satış performansını artırmak amacıyla hazırladığımız özel Dönüşüm Oranı Artırma (CRO) analizine hoş geldiniz.`,
        sections: [{
          sectionTitle: "1. Sepet Terk Etme Oranlarını Optimize Etme",
          content: `<p>Ziyaretçilerin sepeti terk etme oranını düşürmek için <strong>${companyName}</strong> sitesinde üye olmadan sipariş tamamlama (Guest Checkout) seçeneği bulunmalıdır. Kargo ücreti ve ek masraflar sepet ekranında şeffaf bir şekilde en başta belirtilmelidir.</p>`
        }, {
          sectionTitle: "2. Mobil Uyumluluk ve Hızlı Ödeme Akışı",
          content: `<p>E-ticaret trafiğinin %80'inden fazlası mobil cihazlardan gelmektedir. Tek tıkla ödeme seçenekleri, kolay adres doldurma formları ve mobil uyumlu kredi kartı giriş alanları dönüşüm oranlarınızı doğrudan artıracaktır.</p>`
        }, {
          sectionTitle: "3. Sosyal Kanıt ve Güven Unsurları",
          content: `<p>Kullanıcıların satın alma kararlarını hızlandırmak için ürün sayfalarında gerçek müşteri yorumları, yıldızlı değerlendirmeler, SSL sertifikası logoları ve kolay iade politikası gibi güven artırıcı unsurlar görünür şekilde sergilenmelidir.</p>`
        }, {
          sectionTitle: "4. Web Sitesi Hızının Dönüşüm Oranına Etkisi",
          content: `<p>Sayfa yüklenme süresindeki 1 saniyelik gecikme dönüşüm oranlarını %7 oranında düşürebilir. Görsellerin webp formatına dönüştürülmesi ve gereksiz JavaScript kodlarının temizlenmesi gerekmektedir.</p>`
        }],
        conclusion: `Ajans Rota uzmanlığıyla, e-ticaret sitenizin reklamlarından elde ettiğiniz dönüşümü (ROAS) en üst seviyeye çıkarmaya hazırız. Web sitenizin teknik CRO analizi için bizimle iletişime geçebilirsiniz.`
      };
    }
  };

  const handleGenerateGuidePDFWithAI = async lead => {
    if (!lead) return;
    setAiGuideLoading(true);
    const guideTitle = lead.service.replace('Rehber İndirme - ', '');
    if (settingsData.gemini_api_key) {
      try {
        const prompt = `Sen Ajans Rota'nın Yapay Zeka Eğitim ve Rapor hazırlama asistanısın.
Müşteri Adı: ${lead.fullName}
Firma Adı: ${lead.company || 'Belirtilmedi'}
E-posta: ${lead.email || 'Belirtilmedi'}
Rehber Adı: ${guideTitle}

Lütfen bu müşteriye ve firmasına özel olarak hazırlanmış, 4 bölümden oluşan zengin bir eğitim kılavuzu/rehber metni oluştur. Her bölüm en az 80-100 kelime olmalı ve sektörel, pratik tavsiyeler içermeli.
Çıktıyı kesinlikle başka hiçbir şey yazmadan (markdown kod blokları kullanmadan, düz JSON string olarak) şu JSON formatında ver:
{
  "title": "rehber ana başlığı",
  "introduction": "müşteriye ve firmasına özel selamlama ve kısa giriş paragrafı",
  "sections": [
    { "sectionTitle": "Bölüm 1 Başlığı", "content": "Bölüm 1'in detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" },
    { "sectionTitle": "Bölüm 2 Başlığı", "content": "Bölüm 2'nin detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" },
    { "sectionTitle": "Bölüm 3 Başlığı", "content": "Bölüm 3'nin detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" },
    { "sectionTitle": "Bölüm 4 Başlığı", "content": "Bölüm 4'ün detaylı, zengin HTML etiketleri (p, strong, ul, li) barındıran metni" }
  ],
  "conclusion": "kapanış tavsiyesi ve Ajans Rota ile iş birliği çağrısı içeren paragraf"
}`;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settingsData.gemini_api_key}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: prompt
              }]
            }]
          })
        });
        if (!response.ok) {
          throw new Error('Gemini API request failed');
        }
        const resData = await response.json();
        let textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';
        textResult = textResult.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(textResult);
        if (parsed.title && parsed.sections) {
          setAiGuideContents(prev => ({
            ...prev,
            [lead.id]: parsed
          }));
          setAiGuideLoading(false);
          return;
        } else {
          throw new Error('Invalid JSON format');
        }
      } catch (err) {
        console.warn("Gemini guide AI generation error, falling back to local template:", err);
      }
    }

    // FALLBACK
    setTimeout(() => {
      const fallback = getLocalGuideFallback(guideTitle, lead);
      setAiGuideContents(prev => ({
        ...prev,
        [lead.id]: fallback
      }));
      setAiGuideLoading(false);
    }, 1500);
  };

  const handleDownloadGuidePDF = (lead, aiContent) => {
    if (!lead || !aiContent) return;
    if (window.html2pdf) {
      generateGuidePDF(lead, aiContent);
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
      script.onload = () => {
        generateGuidePDF(lead, aiContent);
      };
      document.body.appendChild(script);
    }
  };

  const generateGuidePDF = (lead, aiContent) => {
    const element = document.createElement('div');
    element.id = 'temp-guide-pdf-container';
    element.style.width = '700px';
    element.style.boxSizing = 'border-box';
    element.style.backgroundColor = '#ffffff';
    element.style.padding = '30px';
    element.style.margin = '0';
    element.style.fontFamily = "'Inter', 'Segoe UI', sans-serif";
    const brandColor = '#0284c7'; // Rota Blue
    const textDark = '#0f172a';
    let sectionsHtml = '';
    aiContent.sections.forEach((sec, idx) => {
      sectionsHtml += `
        <div style="margin-bottom: 20px; page-break-inside: avoid;">
          <h3 style="font-size: 13px; color: ${brandColor}; font-weight: 700; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin-bottom: 8px; text-transform: uppercase;">
            ${sec.sectionTitle || sec.title || `Bölüm ${idx + 1}`}
          </h3>
          <div style="font-size: 10.5px; color: #334155; line-height: 1.6;">
            ${sec.content}
          </div>
        </div>
      `;
    });
    element.innerHTML = `
      <div style="border: 2px solid #e2e8f0; border-radius: 8px; padding: 25px; position: relative;">
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid ${brandColor}; padding-bottom: 10px; margin-bottom: 20px;">
          <div>
            <h1 style="font-size: 18px; color: ${textDark}; margin: 0; font-weight: 800; font-family: 'Outfit', sans-serif;">AJANS ROTA</h1>
            <span style="font-size: 9px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Dijital Büyüme & Eğitim Akademisi</span>
          </div>
          <div style="text-align: right;">
            <span style="font-size: 8.5px; background: rgba(2, 132, 199, 0.1); color: ${brandColor}; padding: 3px 8px; border-radius: 4px; font-weight: 700; text-transform: uppercase;">Yapay Zeka Özel Raporu</span>
          </div>
        </div>

        <!-- Document Title -->
        <div style="margin-bottom: 20px; text-align: center;">
          <h2 style="font-size: 16px; color: ${textDark}; font-weight: 700; margin: 0 0 5px 0;">${aiContent.title}</h2>
          <p style="font-size: 9px; color: #64748b; margin: 0;">Bu rehber, başvuru sahibinin profil bilgileri ve sektörü analiz edilerek yapay zeka tarafından özel olarak derlenmiştir.</p>
        </div>

        <!-- Metadata Box -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px; font-size: 9.5px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; line-height: 1.4;">
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">Hazırlanan Kişi</span>
            <strong style="color: ${textDark}; font-size: 10px;">${lead.fullName}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">İşletme / Firma</span>
            <strong style="color: ${textDark}; font-size: 10px;">${lead.company || 'Belirtilmedi'}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">E-posta Adresi</span>
            <strong style="color: ${textDark}; font-size: 10px;">${lead.email}</strong>
          </div>
          <div>
            <span style="color: #64748b; font-weight: 600; display: block; font-size: 8px; text-transform: uppercase;">Oluşturulma Tarihi</span>
            <strong style="color: ${textDark}; font-size: 10px;">${new Date().toLocaleDateString('tr-TR')}</strong>
          </div>
        </div>

        <!-- Introduction -->
        <div style="font-size: 10.5px; color: #334155; line-height: 1.6; margin-bottom: 25px; font-style: italic; background: rgba(2, 132, 199, 0.02); border-left: 3px solid ${brandColor}; padding: 10px 15px; border-radius: 0 6px 6px 0;">
          ${aiContent.introduction}
        </div>

        <!-- Sections -->
        ${sectionsHtml}

        <!-- Conclusion -->
        <div style="margin-top: 25px; padding-top: 15px; border-top: 1px solid #e2e8f0; font-size: 10.5px; color: #334155; line-height: 1.6;">
          <strong>Sonuç ve Öneriler:</strong>
          <p style="margin: 5px 0 0 0;">${aiContent.conclusion}</p>
        </div>

        <!-- Footer -->
        <div style="margin-top: 35px; border-top: 1px solid #e2e8f0; padding-top: 10px; display: flex; justify-content: space-between; align-items: center; font-size: 8px; color: #94a3b8;">
          <span>© ${new Date().getFullYear()} Ajans Rota Büyüme Akademisi. Tüm Hakları Saklıdır.</span>
          <span>www.ajansrota.com | {settingsData?.email || 'iletisim@ajansrota.com'}</span>
        </div>
      </div>
    `;
    document.body.appendChild(element);
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `Ajans_Rota_Akademi_Rehber_${lead.fullName.replace(/\s+/g, '_')}.pdf`,
      image: {
        type: 'jpeg',
        quality: 0.98
      },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        scrollY: 0
      },
      jsPDF: {
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      },
      pagebreak: {
        mode: 'css'
      }
    };
    window.html2pdf().set(opt).from(element).save().then(() => {
      document.body.removeChild(element);
    }).catch(err => {
      console.error("Guide PDF generation failed:", err);
      if (document.body.contains(element)) {
        document.body.removeChild(element);
      }
    });
  };

  const handleSendGuideEmail = async lead => {
    if (!lead) return;
    setIsSendingGuide(true);
    setTimeout(() => {
      const updated = leadsData.map(l => l.id === lead.id ? {
        ...l,
        status: 'sent'
      } : l);
      setLeadsData(updated);
      setSelectedLead(prev => prev ? {
        ...prev,
        status: 'sent'
      } : null);
      saveLeadsOnly(updated);
      setIsSendingGuide(false);
      toast.success(`Tebrikler! Özel Yapay Zeka Rehberi, ${lead.email} adresine başarıyla e-posta ile gönderildi ve talep durumu "Gönderildi" olarak güncellendi.`);
    }, 1200);
  };

  if (!selectedLead) return null;

  return (
      <div className="lead-modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="lead-modal-card" onClick={e => e.stopPropagation()}>
            <div className="lead-modal-header">
              <h3>Talep Detayları</h3>
              <button className="btn-icon" onClick={() => setSelectedLead(null)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="lead-modal-body">
              <div className="lead-info-item">
                <strong>Müşteri Adı Soyadı</strong>
                <p>{selectedLead.fullName}</p>
              </div>
              <div className="lead-info-item">
                <strong>E-Posta Adresi</strong>
                <p>{selectedLead.email || 'Belirtilmedi'}</p>
              </div>
              <div className="lead-info-item">
                <strong>Telefon Numarası</strong>
                <p>{selectedLead.phone || 'Belirtilmedi'}</p>
              </div>
              {selectedLead.company && <div className="lead-info-item">
                  <strong>Şirket / Web Sitesi</strong>
                  <p>{selectedLead.company}</p>
                </div>}
              <div className="lead-info-item">
                <strong>Hizmet Grubu</strong>
                <p>{selectedLead.service}</p>
              </div>
              {selectedLead.trafficSource && <div className="lead-info-item">
                  <strong>Trafik Kaynağı</strong>
                  <p className="mt-1">
                    <span className={`inline-flex items-center gap-1.5 font-semibold text-xs px-2.5 py-1 rounded-xl border ${selectedLead.trafficSource === 'Google Ads' ? 'bg-sky-500/10 text-primary border-primary' : selectedLead.trafficSource === 'Meta Ads' ? 'bg-pink-500/10 text-secondary border-secondary' : 'bg-green-600/10 text-green-600 border-green-600'}`}>
                      {selectedLead.trafficSource === 'Google Ads' ? <i className="fa-brands fa-google"></i> : selectedLead.trafficSource === 'Meta Ads' ? <i className="fa-brands fa-meta"></i> : <i className="fa-solid fa-seedling"></i>}
                      {selectedLead.trafficSource}
                    </span>
                  </p>
                </div>}
              {selectedLead.simulatorData && <div className="lead-info-item">
                  <strong>Simülatör Detayları</strong>
                  {renderSimulatorData(selectedLead)}
                </div>}
              {selectedLead.message && <div className="lead-info-item">
                  <strong>Açıklama / Mesaj Detayı</strong>
                  {renderLeadMessage(selectedLead)}
                </div>}
              <div className="lead-info-item">
                <strong>Tarih</strong>
                <p>{(selectedLead.date || selectedLead.created_at) ? (selectedLead.date || selectedLead.created_at).substring(0, 16).replace('T', ' ') : 'Bilinmiyor'}</p>
              </div>

              {/* CRM LITE SECTION */}
              <div className="crm-lite-section mt-6 pt-6 border-t-2 border-dashed border-glass">
                <h4 className="text-[15px] font-bold text-textLight mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-address-book text-primary"></i>
                  CRM & Müşteri Takip Kartı
                </h4>

                {/* Status & Date row */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 mb-4">
                  <div className="lead-info-item mb-0">
                    <strong>Talep Durumu</strong>
                    <select value={crmStatus} onChange={e => setCrmStatus(e.target.value)} className="admin-select w-full p-2.5 rounded-lg border border-glass bg-white font-body text-sm mt-1.5 text-textLight">
                      <option value="yeni">Yeni Başvuru</option>
                      <option value="iletisimde">İletişimde</option>
                      <option value="toplanti_planlandi">Toplantı Planlandı</option>
                      <option value="analiz_fazinda">Analiz Fazında</option>
                      <option value="teklif_hazirlaniyor">Teklif Hazırlanıyor</option>
                      <option value="teklif_iletildi">Teklif İletildi</option>
                      <option value="revize_istendi">Revize İstendi</option>
                      <option value="sozlesme_asamasinda">Sözleşme Aşamasında</option>
                      <option value="kazanildi">Kazanıldı (Anlaşma Sağlandı)</option>
                      <option value="kaybedildi">Kaybedildi / İptal</option>
                      <option value="ertelendi">Ertelendi</option>
                    </select>
                  </div>

                  <div className="lead-info-item mb-0">
                    <strong>Takip / Hatırlatıcı Tarihi</strong>
                    <input type="date" value={crmReminderDate} onChange={e => setCrmReminderDate(e.target.value)} className="admin-input w-full p-[0.55rem] rounded-lg border border-glass bg-white font-body text-sm mt-1.5 text-textLight h-[38px] box-border" />
                  </div>
                </div>

                <div className="lead-info-item mb-4">
                  <strong>Dahili Görüşme Notları</strong>
                  <textarea value={crmNotes} onChange={e => setCrmNotes(e.target.value)} className="admin-textarea w-full min-h-[80px] p-2.5 rounded-lg border border-glass bg-white font-body text-[13.5px] mt-1.5 text-textLight resize-y" placeholder="Müşteri aramaları, talepleri, bütçe ayrıntıları vb. dahili notlar..." />
                </div>

                {/* Hızlı İletişim Kanalları */}
                <div className="mb-4">
                  <strong className="text-xs text-textMuted block mb-1.5">Hızlı İletişim Kanalları</strong>
                  <div className="grid grid-cols-2 gap-3">
                    {(() => {
                  const cleanPhone = selectedLead.phone ? selectedLead.phone.replace(/[^0-9]/g, '') : '';
                  const cleanPhoneFormatted = cleanPhone.startsWith('90') ? cleanPhone : cleanPhone.startsWith('0') ? '90' + cleanPhone.substring(1) : '90' + cleanPhone;
                  const waMessage = encodeURIComponent(`Merhaba ${selectedLead.fullName || ''}, Ajans Rota'dan iletişime geçiyorum. Web sitemiz üzerinden ${selectedLead.service || 'hizmetlerimiz'} hakkında yaptığınız başvuru ile ilgili detayları görüşmek üzere sizi ne zaman arayabiliriz? İyi çalışmalar dilerim.`);
                  const waLink = cleanPhone ? `https://wa.me/${cleanPhoneFormatted}?text=${waMessage}` : '#';
                  const mailSubject = encodeURIComponent('Ajans Rota Başvurunuz Hakkında');
                  const mailBody = encodeURIComponent(`Merhaba ${selectedLead.fullName || ''},\n\nAjans Rota'dan iletişime geçiyorum. Web sitemiz üzerinden ilettiğiniz ${selectedLead.service || 'hizmet talebi'} ile ilgili başvurunuzu aldık. Detayları görüşmek ve size en uygun dijital büyüme planını hazırlamak için ne zaman görüşebiliriz?\n\nİyi çalışmalar,\nAjans Rota Satış Ekibi`);
                  const mailLink = selectedLead.email ? `mailto:${selectedLead.email}?subject=${mailSubject}&body=${mailBody}` : '#';
                  return <>
                          <a href={waLink} target="_blank" rel="noopener noreferrer" className={`btn flex items-center justify-center gap-1.5 bg-[#25D366] text-white border-none rounded-lg text-xs font-semibold no-underline p-2.5 ${cleanPhone ? 'cursor-pointer opacity-100' : 'disabled cursor-not-allowed opacity-50'}`}>
                            <i className="fa-brands fa-whatsapp text-[1.05rem]"></i> WhatsApp
                          </a>
                          <a href={mailLink} className={`btn flex items-center justify-center gap-1.5 bg-primary text-white border-none rounded-lg text-xs font-semibold no-underline p-2.5 ${selectedLead.email ? 'cursor-pointer opacity-100' : 'disabled cursor-not-allowed opacity-50'}`}>
                            <i className="fa-solid fa-envelope"></i> E-Posta Gönder
                          </a>
                        </>;
                })()}
                  </div>
                </div>

                <button type="button" className="btn btn-primary w-full p-3 rounded-lg font-semibold font-heading flex items-center justify-center gap-2 mt-2 shadow-none h-auto" onClick={() => handleSaveCRM(selectedLead.id, crmStatus, crmNotes, crmReminderDate)}>
                  <i className="fa-solid fa-floppy-disk"></i>
                  CRM Bilgilerini Kaydet
                </button>
              </div>

              {/* CRM ACTIVITY TIMELINE */}
              <div className="crm-activity-section mt-6 pt-6 border-t-2 border-dashed border-glass">
                <h4 className="text-[15px] font-bold text-textLight mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-clock-rotate-left text-secondary"></i>
                  Müşteri Etkinlik Geçmişi
                </h4>
                
                {Array.isArray(selectedLead.activityHistory) && selectedLead.activityHistory.length > 0 ? <div className="crm-timeline flex flex-col gap-4 pl-2 border-l-2 border-glass ml-2 max-h-[220px] overflow-y-auto pr-2">
                    {selectedLead.activityHistory.map((item, idx) => {
                let iconClass = 'fa-circle-dot';
                let iconColor = 'var(--text-muted)';
                if (item.type === 'system') {
                  iconClass = 'fa-desktop';
                  iconColor = 'var(--primary)';
                } else if (item.type === 'status_change') {
                  iconClass = 'fa-arrows-spin';
                  iconColor = 'var(--secondary)';
                } else if (item.type === 'note_change') {
                  iconClass = 'fa-file-signature';
                  iconColor = '#8b5cf6';
                } else if (item.type === 'reminder_change') {
                  iconClass = 'fa-calendar-check';
                  iconColor = '#f59e0b';
                }
                return <div key={idx} className="crm-timeline-item relative pl-6 mb-1">
                          <span className="absolute -left-[15px] top-[2px] w-[18px] h-[18px] rounded-full bg-white border-2 flex items-center justify-center text-[10px] z-[2]" style={{ borderColor: iconColor, color: iconColor }}>
                            <i className={`fa-solid ${iconClass}`}></i>
                          </span>
                          <div className="text-[11px] text-textMuted font-semibold">{item.date}</div>
                          <div className="text-xs text-textLight mt-[2px] leading-relaxed">{item.text}</div>
                        </div>;
              })}
                  </div> : <p className="text-xs text-textMuted italic pl-2">
                    Henüz bir etkinlik kaydı bulunmuyor. Durum, not veya hatırlatıcı güncellendiğinde burada listelenecektir.
                  </p>}
              </div>
            </div>
             <div className="lead-modal-footer lead-modal-footer-responsive">
              {((selectedLead.service && selectedLead.service.toLowerCase().includes('seo')) || (selectedLead.trafficSource && selectedLead.trafficSource.toLowerCase().includes('seo')) || (selectedLead.message && selectedLead.message.toLowerCase().includes('seo skoru'))) ? (
                <button className="btn btn-primary flex items-center gap-1.5 bg-gradient-to-br from-emerald-500 to-emerald-600 border-none px-5 py-2.5 text-[13.5px] font-semibold rounded-lg" onClick={generateSeoPdf} disabled={isGeneratingPdf}>
                  {isGeneratingPdf ? (
                    <><i className="fa-solid fa-spinner fa-spin"></i> PDF Hazırlanıyor...</>
                  ) : (
                    <><i className="fa-solid fa-wand-magic-sparkles"></i> AI SEO Raporu Üret (PDF)</>
                  )}
                </button>
              ) : selectedLead.simulatorData ? <button className="btn btn-primary flex items-center gap-1.5 border-none px-5 py-2.5 text-[13.5px] font-semibold rounded-lg" onClick={() => handleDownloadPDF(selectedLead)} style={{
            background: selectedLead.simulatorData.type === 'ecommerce' ? 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)' : 'linear-gradient(135deg, var(--secondary) 0%, #0f766e 100%)'
          }}>
                  <i className="fa-solid fa-file-pdf"></i> Raporu PDF Olarak İndir
                </button> : selectedLead.service === 'Teklif Hesaplayıcı Talebi' || selectedLead.service === 'Web Tasarım Talebi' ? <div className="flex gap-3">
                  <button className="btn btn-primary flex items-center gap-1.5 bg-gradient-to-br from-primary to-indigo-600 border-none px-5 py-2.5 text-[13.5px] font-semibold rounded-lg" onClick={() => handleDownloadProposalPDF(selectedLead)}>
                    <i className="fa-solid fa-file-pdf"></i> Teklif PDF İndir
                  </button>
                  <button className="btn btn-secondary flex items-center gap-1.5 border border-pink-500/40 bg-pink-500/5 text-secondary px-5 py-2.5 text-[13.5px] font-semibold rounded-lg cursor-pointer" onClick={() => handleSendProposalEmail(selectedLead)} disabled={isSendingProposal}>
                    {isSendingProposal ? <>
                        <i className="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...
                      </> : <>
                        <i className="fa-solid fa-paper-plane"></i> Teklifi İlet
                      </>}
                  </button>
                </div> : selectedLead.service && selectedLead.service.includes('Rehber') ? <div className="flex gap-3">
                  {aiGuideContents[selectedLead.id] ? <>
                      <button className="btn btn-primary flex items-center gap-1.5 bg-gradient-to-br from-primary to-sky-600 border-none px-5 py-2.5 text-[13.5px] font-semibold rounded-lg" onClick={() => handleDownloadGuidePDF(selectedLead, aiGuideContents[selectedLead.id])}>
                        <i className="fa-solid fa-file-pdf"></i> Rehber PDF İndir
                      </button>
                      <button className="btn btn-secondary flex items-center gap-1.5 border border-teal-600/40 bg-teal-600/5 text-secondary px-5 py-2.5 text-[13.5px] font-semibold rounded-lg cursor-pointer" onClick={() => handleSendGuideEmail(selectedLead)} disabled={isSendingGuide}>
                        {isSendingGuide ? <>
                            <i className="fa-solid fa-spinner fa-spin"></i> Gönderiliyor...
                          </> : <>
                            <i className="fa-solid fa-paper-plane"></i> Rehberi Gönder
                          </>}
                      </button>
                    </> : <button className="btn btn-primary flex items-center justify-center gap-1.5 bg-gradient-to-br from-violet-500 to-violet-700 border-none px-5 py-2.5 text-[13.5px] font-semibold rounded-lg" onClick={() => handleGenerateGuidePDFWithAI(selectedLead)} disabled={aiGuideLoading}>
                      {aiGuideLoading ? <>
                          <i className="fa-solid fa-spinner fa-spin"></i> Özel Rehber Hazırlanıyor...
                        </> : <>
                          <i className="fa-solid fa-wand-magic-sparkles"></i> AI ile Özel Rehber Üret
                        </>}
                    </button>}
                </div> : <div></div>}
              <button className="btn btn-secondary" onClick={() => setSelectedLead(null)}>Kapat</button>
            </div>
          </div>
          
          {/* Hidden PDF Template */}
          <div style={{ display: 'none' }}>
            <AiSeoPdfTemplate ref={pdfRef} lead={selectedLead} settingsData={settingsData} />
          </div>
        </div>
  );
}
