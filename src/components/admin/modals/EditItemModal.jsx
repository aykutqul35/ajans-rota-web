import { useState } from 'react';
export default function EditItemModal({
  editingItem, setEditingItem, editingType, setEditingType,
  modalFormData, setModalFormData,
  testimonialsData, setTestimonialsData,
  teamMembersData, setTeamMembersData,
  blogsData, setBlogsData, handleSaveAll, settingsData
}) {
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');
  const [blogEditTab, setBlogEditTab] = useState('edit');

  const openEditModal = (type, item) => {
    setEditingType(type);
    setEditingItem(item);
    if (type === 'blog') {
      setBlogEditTab('edit');
    }
    if (item === 'new') {
      if (type === 'testimonial') {
        setModalFormData({
          name: '',
          company: '',
          role: '',
          category: 'google-ads',
          rating: 5,
          quote: '',
          metric: '',
          initials: ''
        });
      } else if (type === 'team') {
        setModalFormData({
          name: '',
          role: '',
          init: '',
          gradient: 'linear-gradient(135deg, #00ebd6, #00b4d8)',
          desc: '',
          dept: 'performance',
          stars: 5,
          exp: ''
        });
      } else if (type === 'blog') {
        setModalFormData({
          title: '',
          category: 'google',
          excerpt: '',
          date: new Date().toLocaleDateString('tr-TR'),
          readTime: '5 dk okuma',
          author: '',
          content: ''
        });
      }
    } else {
      setModalFormData({
        ...item
      });
    }
  };

  const handleModalSave = e => {
    e.preventDefault();
    if (editingType === 'testimonial') {
      if (editingItem === 'new') {
        const initials = modalFormData.initials || (modalFormData.name ? modalFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'YK');
        const newItem = {
          ...modalFormData,
          initials,
          id: Date.now()
        };
        setTestimonialsData([newItem, ...testimonialsData]);
      } else {
        setTestimonialsData(testimonialsData.map(item => item.id === editingItem.id ? modalFormData : item));
      }
    } else if (editingType === 'team') {
      if (editingItem === 'new') {
        const init = modalFormData.init || (modalFormData.name ? modalFormData.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'UZ');
        const newItem = {
          ...modalFormData,
          init,
          id: Date.now()
        };
        setTeamMembersData([...teamMembersData, newItem]);
      } else {
        setTeamMembersData(teamMembersData.map(item => item.name === editingItem.name ? modalFormData : item));
      }
    } else if (editingType === 'blog') {
      if (editingItem === 'new') {
        const newItem = {
          ...modalFormData,
          id: Date.now()
        };
        setBlogsData([newItem, ...blogsData]);
      } else {
        setBlogsData(blogsData.map(item => item.id === editingItem.id ? modalFormData : item));
      }
    }
    setEditingItem(null);
    setEditingType('');
  };

  const handleDeleteItem = (type, item) => {
    if (!window.confirm('Bu öğeyi silmek istediğinizden emin misiniz?')) return;
    if (type === 'testimonial') {
      setTestimonialsData(testimonialsData.filter(i => i.id !== item.id));
    } else if (type === 'team') {
      setTeamMembersData(teamMembersData.filter(i => i.name !== item.name));
    } else if (type === 'blog') {
      setBlogsData(blogsData.filter(i => i.id !== item.id));
    }
  };

  const handleModalFieldChange = (key, val) => {
    setModalFormData(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const insertHTMLTag = tagType => {
    const textarea = document.getElementById('blog-content-textarea');
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selectedText = text.substring(start, end);
    let replacement = '';
    switch (tagType) {
      case 'bold':
        replacement = `<strong>${selectedText || 'kalın metin'}</strong>`;
        break;
      case 'italic':
        replacement = `<em>${selectedText || 'eğik metin'}</em>`;
        break;
      case 'h2':
        replacement = `<h2>${selectedText || 'Alt Başlık 2'}</h2>\n`;
        break;
      case 'h3':
        replacement = `<h3>${selectedText || 'Alt Başlık 3'}</h3>\n`;
        break;
      case 'p':
        replacement = `<p>${selectedText || 'Yeni paragraf...'}</p>\n`;
        break;
      case 'link':
        const url = prompt('Bağlantı adresi (URL):', 'https://');
        if (url === null) return;
        replacement = `<a href="${url}" target="_blank" rel="noopener noreferrer">${selectedText || 'Bağlantı Metni'}</a>`;
        break;
      case 'quote':
        replacement = `<blockquote>\n  ${selectedText || 'Alıntı metni...'}\n</blockquote>\n`;
        break;
      case 'ul':
        replacement = `<ul>\n  <li>${selectedText || 'Liste elemanı 1'}</li>\n  <li>Liste elemanı 2</li>\n</ul>\n`;
        break;
      case 'li':
        replacement = `<li>${selectedText || 'Liste elemanı'}</li>`;
        break;
      case 'img':
        const src = prompt('Resim adresi (URL):', '/images/logo.png');
        if (src === null) return;
        const alt = prompt('Resim açıklaması (Alt):', 'Görsel açıklaması');
        if (alt === null) return;
        replacement = `<img src="${src}" alt="${alt}" style="max-width:100%; height:auto; border-radius:8px; margin: 1rem 0;" />\n`;
        break;
      case 'table':
        replacement = `<table style="width:100%; border-collapse:collapse; margin:1rem 0;">\n  <thead>\n    <tr style="background:#f1f5f9;">\n      <th style="border:1px solid #cbd5e1; padding:8px;">Başlık 1</th>\n      <th style="border:1px solid #cbd5e1; padding:8px;">Başlık 2</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="border:1px solid #cbd5e1; padding:8px;">Veri 1</td>\n      <td style="border:1px solid #cbd5e1; padding:8px;">Veri 2</td>\n    </tr>\n  </tbody>\n</table>\n`;
        break;
      default:
        return;
    }
    const newValue = text.substring(0, start) + replacement + text.substring(end);
    handleModalFieldChange('content', newValue);

    // Refocus and select
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + replacement.length, start + replacement.length);
    }, 50);
  };

  const handleSuggestKeywords = async (e) => {
    e.preventDefault();
    setAiLoading(true);
    setAiError('');
    
    const currentCategory = modalFormData.category || 'google';
    let categoryName = currentCategory;
    switch(currentCategory) {
      case 'google': categoryName = 'Google Ads / Reklam'; break;
      case 'meta': categoryName = 'Meta Ads (Facebook/Instagram)'; break;
      case 'seo': categoryName = 'SEO & İçerik Pazarlaması'; break;
      case 'social': categoryName = 'Sosyal Medya Yönetimi'; break;
      case 'ecommerce': categoryName = 'E-Ticaret'; break;
      case 'design': categoryName = 'Web Tasarım / UX'; break;
      default: categoryName = 'Dijital Pazarlama';
    }

    if (settingsData.gemini_api_key) {
      try {
        const prompt = `Dijital pazarlama ajansı blogu için "${categoryName}" kategorisinde en çok aranan, SEO değeri yüksek ve uzun kuyruklu (long-tail) 5 adet anahtar kelime veya konu başlığı öner. Lütfen kelimeleri virgülle ayırarak (Örn: seo uyumlu makale, e-ticaret sepet terk etme) ver. Başlık, numara veya açıklama ekleme; sadece virgülle ayrılmış kelime listesi ver.`;
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${settingsData.gemini_api_key}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        });
        
        const resData = await response.json();
        if (resData.candidates && resData.candidates[0]?.content?.parts[0]?.text) {
          const suggestedKeywords = resData.candidates[0].content.parts[0].text.trim().replace(/\n/g, '').replace(/,\s*$/, '');
          setAiKeywords(suggestedKeywords);
        } else {
           throw new Error('API yanıtı anlaşılamadı.');
        }
      } catch (err) {
        setAiError('Kelime önerisi alınırken hata: ' + err.message);
      }
    } else {
      // Local fallback suggestions
      let fallbackKeywords = '';
      if (currentCategory === 'google') fallbackKeywords = 'google ads dönüşüm izleme, tıklama başı maliyet düşürme, roas artırma';
      else if (currentCategory === 'meta') fallbackKeywords = 'facebook piksel, instagram reklam algoritması, advantage+ kampanyaları';
      else if (currentCategory === 'seo') fallbackKeywords = 'semantik seo, teknik seo, long-tail anahtar kelime';
      else if (currentCategory === 'social') fallbackKeywords = 'instagram etkileşim artırma, reels izlenme, sosyal medya stratejisi';
      else if (currentCategory === 'ecommerce') fallbackKeywords = 'e-ticaret sepet terk etme, CRO artırma, shopify seo';
      else if (currentCategory === 'design') fallbackKeywords = 'kullanıcı deneyimi optimizasyonu, hızlı web tasarım, mobil uyumlu site';
      else fallbackKeywords = 'dijital pazarlama taktikleri, marka bilinirliği';
      
      setAiKeywords(fallbackKeywords);
    }
    setAiLoading(false);
  };

  const handleGenerateAIBlog = async e => {
    e.preventDefault();
    if (!aiKeywords.trim()) {
      setAiError('Lütfen anahtar kelime girin.');
      return;
    }
    setAiLoading(true);
    setAiError('');
    const keywordsLower = aiKeywords.toLowerCase();

    // Check if Gemini API key is configured
    if (settingsData.gemini_api_key) {
      try {
        const prompt = `Aşağıdaki anahtar kelimelere göre Türkçe, profesyonel, SEO uyumlu ve zengin içerikli bir blog yazısı taslağı oluştur.
Anahtar kelimeler: ${aiKeywords}
Çıktıyı kesinlikle başka hiçbir şey yazmadan (markdown blokları kullanmadan, düz JSON string olarak) şu JSON formatında ver:
{
  "title": "makale başlığı",
  "excerpt": "makale kısa özeti",
  "content": "h3, p, ul, li ve strong etiketleriyle zenginleştirilmiş, konunun derinliğine göre 800 ile 1500 kelime arasında değişen detaylı makale gövde HTML içeriği"
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
          throw new Error('Gemini API isteği başarısız oldu.');
        }
        const resData = await response.json();
        let textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text || '';

        // Clean markdown code blocks if Gemini returns them
        textResult = textResult.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
        const parsed = JSON.parse(textResult);
        if (parsed.title && parsed.excerpt && parsed.content) {
          setModalFormData(prev => ({
            ...prev,
            title: parsed.title,
            excerpt: parsed.excerpt,
            content: parsed.content
          }));
          setAiKeywords('');
          setAiLoading(false);
          return;
        } else {
          throw new Error('JSON formatı eksik veya hatalı.');
        }
      } catch (err) {
        console.warn("Gemini API error, falling back to local Turkish template generator:", err);
      }
    }

    // LOCAL TEMPLATE FALLBACK
    setTimeout(() => {
      let title = '';
      let excerpt = '';
      let content = '';
      if (keywordsLower.includes('seo') || keywordsLower.includes('arama') || keywordsLower.includes('optimizasyon')) {
        title = "Lokal SEO ile İzmir’de Google Aramalarında En Üste Çıkma Rehberi";
        excerpt = "İzmir’deki yerel işletmelerin Google Haritalar ve arama sonuçlarında görünürlüğünü artıracak 5 pratik lokal SEO taktiği.";
        content = `<h3>1. Google Haritalar (My Business) Optimizasyonu</h3>
<p>İzmir'deki müşterilerinize ulaşmanın en hızlı yolu yerel harita kaydınızı optimize etmektir. Profilinizin eksiksiz doldurulması, çalışma saatlerinin güncelliği ve düzenli müşteri yorumu toplanması harita sıralamanızı doğrudan etkiler.</p>
<h3>2. Ege Bölgesi Odaklı Anahtar Kelimeler</h3>
<p>İçeriklerinizde sadece genel kelimeler kullanmak yerine, <strong>"İzmir dijital pazarlama ajansı"</strong> veya <strong>"Karşıyaka e-ticaret danışmanlığı"</strong> gibi lokasyon bazlı ve arama hacmi yüksek uzun kuyruklu anahtar kelimelere yer verin.</p>
<h3>3. Mobil Uyumluluk ve Sayfa Hızı</h3>
<p>Google mobil uyumlu ve 2 saniyenin altında açılan siteleri lokal aramalarda daha yukarılara taşır. Resim sıkıştırma ve verimli kod yapılarıyla sitenizin hızını sürekli optimize edin.</p>
<h3>4. Yerel İçerik Üretimi</h3>
<p>İzmir ve Ege bölgesindeki sektörel gelişmeleri, yerel fuarları ve başarı hikayelerini konu alan blog yazıları yazarak hem otoritenizi kanıtlayın hem de Google botlarına yerellik sinyalleri gönderin.</p>`;
      } else if (keywordsLower.includes('google') || keywordsLower.includes('ads') || keywordsLower.includes('reklam') || keywordsLower.includes('roas')) {
        title = "Google Ads Reklam Bütçesini Doğru Yöneterek ROAS Artırma Yolları";
        excerpt = "Tıklama başına maliyetlerin yükseldiği dijital dünyada, reklam bütçenizi en verimli şekilde kullanarak satışlarınızı katlamanın yolları.";
        content = `<h3>1. Negatif Anahtar Kelime Yönetimi</h3>
<p>Gereksiz aramalarla reklam bütçenizi boşa harcamamak için negatif anahtar kelimeleri haftalık olarak güncelleyin. Alakasız tıklamaları elemek dönüşüm oranınızı (CR) artırır.</p>
<h3>2. Dönüşüm Kurulumlarının Doğruluğu</h3>
<p>Google Ads akıllı teklif algoritmalarının (ROAS Hedefi, Dönüşümleri Artırma vb.) en iyi performansı göstermesi için dönüşüm verilerinin eksiksiz gitmesi gerekir. Google Gelişmiş Dönüşümler (Enhanced Conversions) kurulumunu mutlaka yapın.</p>
<h3>3. Kalite Puanı Optimizasyonu</h3>
<p>Reklam metniniz, anahtar kelimeniz ve yönlendirdiğiniz açılış sayfası (landing page) arasındaki uyum ne kadar yüksekse kalite puanınız o kadar artar. Yüksek kalite puanı, daha düşük tıklama başı maliyet (CPC) demektir.</p>
<h3>4. Akıllı Teklif Stratejileri ve Kampanya Yapısı</h3>
<p>Kampanya yapınızı basitleştirin. PMax (Maksimum Performans) ve Arama Ağı kampanyalarını doğru bütçe dağılımıyla besleyerek yapay zeka algoritmalarının işletmeniz için en karlı kitleyi bulmasını sağlayın.</p>`;
      } else if (keywordsLower.includes('meta') || keywordsLower.includes('facebook') || keywordsLower.includes('instagram') || keywordsLower.includes('kreatif')) {
        title = "Instagram ve Meta Reklamlarında Dönüşüm Hunisi (Funnel) Tasarımı";
        excerpt = "Meta reklamlarında doğrudan soğuk kitleye satış yerine, potansiyel müşteriyi keşiften satın almaya götüren dönüşüm hunisi kurgusu.";
        content = `<h3>1. Kreatif Odaklı Reklamcılık</h3>
<p>Meta algoritmaları artık kreatifleri hedefleme olarak kullanıyor. Farklı görsel, video ve UGC (kullanıcı yapımı samimi video) formatlarını sürekli test ederek en düşük maliyetli kombinasyonu bulun.</p>
<h3>2. Özel ve Benzer (Lookalike) Hedef Kitleler</h3>
<p>Sitenizi ziyaret eden, sepete ekleme yapan veya Instagram sayfanızla etkileşime giren kişilerden oluşan özel kitleler kurup bunlara özel kampanyalar oluşturun. Benzer kitlelerle erişiminizi genişletin.</p>
<h3>3. Retargeting (Yeniden Hedefleme)</h3>
<p>Bütçenizin bir kısmını her zaman sitenizden alışveriş yapmamış kişileri yakalamak üzere dinamik ürün kataloğu reklamlarıyla yeniden hedeflemeye ayırın. Hatırlatıcı reklamlar dönüşümleri hızlandırır.</p>
<h3>4. Advantage+ Kampanyaları</h3>
<p>Meta'nın yapay zeka destekli Advantage+ alışveriş kampanyalarını kullanarak bütçe optimizasyonunu platformun zekasına bırakın. Bu modeller doğru kreatiflerle birleştiğinde mükemmel sonuçlar vermektedir.</p>`;
      } else if (keywordsLower.includes('eticaret') || keywordsLower.includes('e-ticaret') || keywordsLower.includes('sepet') || keywordsLower.includes('satış')) {
        title = "E-Ticaret Sitelerinde Dönüşüm Oranını (CR) Artırmanın Yolları";
        excerpt = "Ziyaretçilerinizi müşteriye dönüştürmek ve sepeti yarıda bırakma oranlarını düşürmek için uygulayabileceğiniz 4 UX adımı.";
        content = `<h3>1. Kolay ve Hızlı Ödeme Aşaması</h3>
<p>Üyeliği zorunlu tutmayın, üyeliksiz alışveriş imkanı sunun. Ödeme adımlarını 3 ekranı geçmeyecek şekilde sadeleştirin ve en popüler ödeme yöntemlerini entegre edin.</p>
<h3>2. Güven Unsurları ve Sosyal İspat</h3>
<p>Ürün sayfalarında müşteri yorumları, yıldız puanlamaları ve SSL sertifikası gibi güven unsurlarını belirgin şekilde sergileyin. Güven veren siteler her zaman daha çok satar.</p>
<h3>3. Sepeti Terk Edenleri Geri Kazanma</h3>
<p>Sepette ürün bırakıp giden kullanıcılara e-posta veya WhatsApp entegrasyonuyla otomatik hatırlatmalar ve küçük indirim kuponları göndererek satın almaya teşvik edin.</p>
<h3>4. Mobil Arayüz Optimizasyonu</h3>
<p>E-ticaret trafiğinin %90'ı mobilden gelmektedir. Sitenizin mobil hızını artırın, butonların parmak dostu boyutlarda olduğundan ve filtreleme sisteminin pürüzsüz çalıştığından emin olun.</p>`;
      } else {
        const firstKw = aiKeywords.split(',')[0].trim();
        const formattedKw = firstKw.toLocaleLowerCase('tr-TR').split(' ').map(word => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1)).join(' ');
        title = `${formattedKw} Odaklı Dijital Pazarlama ve Büyüme Rehberi`;
        excerpt = `${aiKeywords} odaklı iş modelleri için veriye dayalı reklam, SEO ve sosyal medya stratejileriyle dijitalde öne çıkma rehberi.`;
        content = `<h3>1. Hedef Kitle Analizi ve Segmentasyon</h3>
<p>${aiKeywords} alanında pazarlamaya başlamadan önce ideal müşteri profilinizi (persona) belirleyin ve onların dijitaldeki ilgi alanlarına göre doğru mecra tercihi yapın.</p>
<h3>2. Çok Kanallı (Omnichannel) Pazarlama Stratejisi</h3>
<p>Müşterilerinizin karşısına hem Google aramalarında hem de sosyal medyada çıkarak marka bilinirliğinizi pekiştirin. Çok kanallı varlık güveni artırır.</p>
<h3>3. Veri Odaklı Performans Ölçümü</h3>
<p>Yaptığınız tüm dijital yatırımların geri dönüşünü (ROI/ROAS) analiz araçlarıyla takip edin. Verimsiz reklam kanallarını hızla eleyip bütçeyi karlı kampanyalara kaydırın.</p>
<h3>4. Sürekli İçerik ve A/B Testleri</h3>
<p>Reklam kreatiflerinizde, başlıklarınızda ve web sitesi açılış sayfalarında sürekli A/B testleri yapın. En küçük optimizasyon bile uzun vadede yüksek kar getirecektir.</p>`;
      }
      setModalFormData(prev => ({
        ...prev,
        title,
        excerpt,
        content
      }));
      setAiKeywords('');
      setAiLoading(false);
    }, 1500);
  };

  if (!editingItem) return null;

  return (
          
      <div className="lead-modal-overlay" onClick={() => {
      setEditingItem(null);
      setEditingType('');
    }}>
          <div className="lead-modal-card" onClick={e => e.stopPropagation()} style={{
        maxWidth: editingType === 'blog' ? '800px' : '550px'
      }}>
            <div className="lead-modal-header">
              <h3>
                {editingItem === 'new' ? 'Yeni Ekle' : 'Öğeyi Düzenle'} - {editingType === 'testimonial' ? 'Yorum' : editingType === 'team' ? 'Ekip Üyesi' : 'Blog'}
              </h3>
              <button className="btn-icon" onClick={() => {
            setEditingItem(null);
            setEditingType('');
          }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleModalSave}>
              <div className="lead-modal-body">
                {/* 1. TESTIMONIAL FORM */}
                {editingType === 'testimonial' && <>
                    <div className="admin-form-group">
                      <label>Ad Soyad</label>
                      <input type="text" required value={modalFormData.name || ''} onChange={e => handleModalFieldChange('name', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)'
                }} />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Şirket</label>
                        <input type="text" required value={modalFormData.company || ''} onChange={e => handleModalFieldChange('company', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>Unvan / Rol</label>
                        <input type="text" required value={modalFormData.role || ''} onChange={e => handleModalFieldChange('role', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Kategori</label>
                        <select value={modalFormData.category || 'google-ads'} onChange={e => handleModalFieldChange('category', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="google-ads">Google Ads</option>
                          <option value="meta-ads">Meta Ads</option>
                          <option value="seo">SEO &amp; İçerik</option>
                          <option value="social-media">Sosyal Medya</option>
                          <option value="ecommerce">E-Ticaret</option>
                          <option value="web-design">Web Tasarım</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Puan (1-5)</label>
                        <select value={modalFormData.rating || 5} onChange={e => handleModalFieldChange('rating', parseInt(e.target.value))} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="5">5 Yıldız</option>
                          <option value="4">4 Yıldız</option>
                          <option value="3">3 Yıldız</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Metrik Başarısı (Örn: 8.4x ROAS)</label>
                        <input type="text" value={modalFormData.metric || ''} onChange={e => handleModalFieldChange('metric', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>İsim Kısaltması (Boşsa ad/soyad ilk harflerinden oluşur)</label>
                        <input type="text" value={modalFormData.initials || ''} onChange={e => handleModalFieldChange('initials', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} placeholder="Örn: MÇ" />
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Yorum Metni</label>
                      <textarea required rows="4" value={modalFormData.quote || ''} onChange={e => handleModalFieldChange('quote', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  fontFamily: 'sans-serif'
                }}></textarea>
                    </div>
                  </>}

                {/* 2. TEAM MEMBER FORM */}
                {editingType === 'team' && <>
                    <div className="admin-form-group">
                      <label>Ad Soyad</label>
                      <input type="text" required value={modalFormData.name || ''} onChange={e => handleModalFieldChange('name', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)'
                }} />
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Görev / Unvan</label>
                        <input type="text" required value={modalFormData.role || ''} onChange={e => handleModalFieldChange('role', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>Deneyim Süresi (Örn: 8 Yıl)</label>
                        <input type="text" required value={modalFormData.exp || ''} onChange={e => handleModalFieldChange('exp', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Departman (Grup)</label>
                        <select value={modalFormData.dept || 'performance'} onChange={e => handleModalFieldChange('dept', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="management">Yönetim</option>
                          <option value="performance">Performans Pazarlama</option>
                          <option value="creative">Kreatif / Tasarım</option>
                        </select>
                      </div>
                      <div className="admin-form-group">
                        <label>Derece (Yıldız 1-5)</label>
                        <select value={modalFormData.stars || 5} onChange={e => handleModalFieldChange('stars', parseInt(e.target.value))} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    background: '#fff'
                  }}>
                          <option value="5">5 Yıldız</option>
                          <option value="4">4 Yıldız</option>
                          <option value="3">3 Yıldız</option>
                        </select>
                      </div>
                    </div>
                    <div className="admin-form-row">
                      <div className="admin-form-group">
                        <label>Kısaltma (Baş harfler, örn: MK)</label>
                        <input type="text" value={modalFormData.init || ''} onChange={e => handleModalFieldChange('init', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                      </div>
                      <div className="admin-form-group">
                        <label>Renk Gradyanı (CSS Değeri)</label>
                        <input type="text" value={modalFormData.gradient || ''} onChange={e => handleModalFieldChange('gradient', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)',
                    marginBottom: '0.5rem'
                  }} placeholder="linear-gradient(135deg, #00ebd6, #00b4d8)" />
                        <div style={{
                    display: 'flex',
                    gap: '8px',
                    flexWrap: 'wrap',
                    alignItems: 'center'
                  }}>
                          <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)'
                    }}>Hazır Renkler:</span>
                          {[{
                      name: 'Ege Turkuazı',
                      val: 'linear-gradient(135deg, #00ebd6, #00b4d8)'
                    }, {
                      name: 'Gün Batımı',
                      val: 'linear-gradient(135deg, #ff2a85, #ff758c)'
                    }, {
                      name: 'Kozmik Mor',
                      val: 'linear-gradient(135deg, #7b2cbf, #ff2a85)'
                    }, {
                      name: 'Sörf Mavisi',
                      val: 'linear-gradient(135deg, #7b2cbf, #00ebd6)'
                    }, {
                      name: 'Mavi & Mor',
                      val: 'linear-gradient(135deg, #00b4d8, #7b2cbf)'
                    }, {
                      name: 'Pembe & Mavi',
                      val: 'linear-gradient(135deg, #ff758c, #00b4d8)'
                    }].map((preset, idx) => <button key={idx} type="button" onClick={() => handleModalFieldChange('gradient', preset.val)} style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      background: preset.val,
                      border: modalFormData.gradient === preset.val ? '2px solid var(--primary)' : '1px solid var(--glass-border)',
                      cursor: 'pointer',
                      padding: 0,
                      transform: modalFormData.gradient === preset.val ? 'scale(1.15)' : 'none',
                      transition: 'all 0.2s ease',
                      boxShadow: modalFormData.gradient === preset.val ? '0 0 6px rgba(0,235,214,0.4)' : 'none'
                    }} title={preset.name} />)}
                        </div>
                      </div>
                    </div>
                    <div className="admin-form-group">
                      <label>Kısa Biyografi / Açıklama</label>
                      <textarea required rows="4" value={modalFormData.desc || ''} onChange={e => handleModalFieldChange('desc', e.target.value)} style={{
                  width: '100%',
                  padding: '0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--glass-border)',
                  fontFamily: 'sans-serif'
                }}></textarea>
                    </div>
                  </>}

                {/* 3. BLOG POST FORM */}
                {editingType === 'blog' && <>
                    {/* Live Preview Tabs */}
                    <div style={{
                display: 'flex',
                borderBottom: '1px solid var(--glass-border)',
                marginBottom: '1.25rem',
                gap: '0.25rem'
              }}>
                      <button type="button" onClick={() => setBlogEditTab('edit')} style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderBottom: blogEditTab === 'edit' ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  color: blogEditTab === 'edit' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}>
                        <i className="fa-solid fa-pen" style={{
                    marginRight: '6px'
                  }}></i> Düzenle
                      </button>
                      <button type="button" onClick={() => setBlogEditTab('preview')} style={{
                  padding: '0.5rem 1rem',
                  border: 'none',
                  borderBottom: blogEditTab === 'preview' ? '2px solid var(--primary)' : '2px solid transparent',
                  background: 'none',
                  color: blogEditTab === 'preview' ? 'var(--primary)' : 'var(--text-muted)',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}>
                        <i className="fa-solid fa-eye" style={{
                    marginRight: '6px'
                  }}></i> Canlı Önizleme
                      </button>
                    </div>

                    {blogEditTab === 'edit' ? <>
                        <div className="ai-writer-container" style={{
                  background: 'rgba(2, 132, 199, 0.03)',
                  border: '1px dashed var(--glass-border-hover)',
                  borderRadius: '8px',
                  padding: '1rem',
                  marginBottom: '1.25rem'
                }}>
                          <div className="ai-writer-header" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '0.5rem'
                  }}>
                            <span style={{
                      fontWeight: '700',
                      color: 'var(--primary)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.85rem'
                    }}>
                              <i className="fa-solid fa-robot"></i> Yapay Zeka Blog Yazarı
                            </span>
                            {settingsData.gemini_api_key ? <span style={{
                      fontSize: '0.7rem',
                      color: '#16a34a',
                      backgroundColor: 'rgba(22, 163, 74, 0.08)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid rgba(22, 163, 74, 0.15)'
                    }}>
                                Gemini API Aktif
                              </span> : <span style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      backgroundColor: 'rgba(15, 23, 42, 0.03)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--glass-border)'
                    }}>
                                Yerel Motor Aktif
                              </span>}
                          </div>
                          <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap',
                    marginBottom: '0.5rem'
                  }}>
                            <input type="text" placeholder="Anahtar kelimeleri girin (örn: seo, google ads, e-ticaret)..." value={aiKeywords} onChange={e => setAiKeywords(e.target.value)} disabled={aiLoading} style={{
                      flex: 1,
                      minWidth: '200px',
                      padding: '0.5rem 0.75rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)',
                      fontSize: '0.8rem',
                      background: '#fff',
                      color: 'var(--text-light)',
                      outline: 'none'
                    }} />
                            <button type="button" onClick={handleSuggestKeywords} disabled={aiLoading} className="btn" style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px',
                      backgroundColor: 'rgba(2, 132, 199, 0.1)',
                      color: 'var(--primary)',
                      border: '1px solid rgba(2, 132, 199, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      cursor: 'pointer'
                    }}>
                              <i className="fa-solid fa-lightbulb"></i> Öneri Al
                            </button>
                            <button type="button" onClick={handleGenerateAIBlog} disabled={aiLoading} className="btn btn-primary" style={{
                      padding: '0.5rem 1rem',
                      fontSize: '0.8rem',
                      borderRadius: '6px'
                    }}>
                              {aiLoading ? 'İşlem Sürüyor...' : 'Yazı Üret'}
                            </button>
                          </div>
                          {aiError && <div style={{
                    fontSize: '0.75rem',
                    color: '#ef4444',
                    marginTop: '0.25rem'
                  }}>{aiError}</div>}
                          {aiLoading && <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)'
                  }}>
                              <div className="seo-spinner" style={{
                      width: '16px',
                      height: '16px',
                      borderWidth: '2px'
                    }}></div>
                              <span>Yapay zeka başlık, özet ve zengin makale gövdesini hazırlıyor...</span>
                            </div>}
                        </div>

                        <div className="admin-form-group">
                          <label>Blog Başlığı</label>
                          <input type="text" required value={modalFormData.title || ''} onChange={e => handleModalFieldChange('title', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Kategori</label>
                            <select value={modalFormData.category || 'google'} onChange={e => handleModalFieldChange('category', e.target.value)} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)',
                      background: '#fff'
                    }}>
                              <option value="google">Google Ads</option>
                              <option value="meta">Meta Ads</option>
                              <option value="seo">SEO &amp; İçerik</option>
                              <option value="social">Sosyal Medya</option>
                              <option value="ecommerce">E-Ticaret</option>
                              <option value="design">Web Tasarım</option>
                            </select>
                          </div>
                          <div className="admin-form-group">
                            <label>Yazar</label>
                            <select required value={modalFormData.author || ''} onChange={e => handleModalFieldChange('author', e.target.value)} style={{
                              width: '100%',
                              padding: '0.65rem',
                              borderRadius: '6px',
                              border: '1px solid var(--glass-border)',
                              background: '#fff'
                            }}>
                              <option value="">Yazar Seçin</option>
                              {teamMembersData.filter(member => member.dept !== 'management').map(member => (
                                <option key={member.name} value={member.name}>
                                  {member.name} - {member.role}
                                </option>
                              ))}
                              {modalFormData.author && !teamMembersData.filter(member => member.dept !== 'management').some(m => m.name === modalFormData.author) && (
                                <option value={modalFormData.author}>{modalFormData.author} (Mevcut)</option>
                              )}
                            </select>
                          </div>
                        </div>
                        <div className="admin-form-row">
                          <div className="admin-form-group">
                            <label>Tarih</label>
                            <input type="text" required value={modalFormData.date || ''} onChange={e => handleModalFieldChange('date', e.target.value)} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                          </div>
                          <div className="admin-form-group">
                            <label>Okuma Süresi (Örn: 5 dk okuma)</label>
                            <input type="text" required value={modalFormData.readTime || ''} onChange={e => handleModalFieldChange('readTime', e.target.value)} style={{
                      width: '100%',
                      padding: '0.65rem',
                      borderRadius: '6px',
                      border: '1px solid var(--glass-border)'
                    }} />
                          </div>
                        </div>
                        <div className="admin-form-group">
                          <label>Kısa Özet (Excerpt)</label>
                          <input type="text" required value={modalFormData.excerpt || ''} onChange={e => handleModalFieldChange('excerpt', e.target.value)} style={{
                    width: '100%',
                    padding: '0.65rem',
                    borderRadius: '6px',
                    border: '1px solid var(--glass-border)'
                  }} />
                        </div>
                        <div className="admin-form-group">
                          <label style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                            <span>Yazı İçeriği (Desteklenen Metin)</span>
                            <span style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      fontWeight: 'normal'
                    }}>HTML etiketlerini kullanabilirsiniz</span>
                          </label>
                          
                          {/* HTML Toolbar Editor */}
                          <div className="html-toolbar" style={{
                            display: 'flex',
                            gap: '4px',
                            padding: '0.5rem',
                            background: 'rgba(15, 23, 42, 0.03)',
                            border: '1px solid var(--glass-border)',
                            borderBottom: 'none',
                            borderTopLeftRadius: '6px',
                            borderTopRightRadius: '6px',
                            flexWrap: 'wrap'
                          }}>
                            <button type="button" onClick={() => insertHTMLTag('h2')} className="btn-icon" title="H2 Başlık" style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>H2</button>
                            <button type="button" onClick={() => insertHTMLTag('h3')} className="btn-icon" title="H3 Başlık" style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>H3</button>
                            <button type="button" onClick={() => insertHTMLTag('p')} className="btn-icon" title="Paragraf" style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>P</button>
                            <button type="button" onClick={() => insertHTMLTag('bold')} className="btn-icon" title="Kalın (Bold)" style={{ padding: '4px 8px' }}><i className="fa-solid fa-bold"></i></button>
                            <button type="button" onClick={() => insertHTMLTag('italic')} className="btn-icon" title="Eğik (Italic)" style={{ padding: '4px 8px' }}><i className="fa-solid fa-italic"></i></button>
                            <button type="button" onClick={() => insertHTMLTag('ul')} className="btn-icon" title="Liste (UL)" style={{ padding: '4px 8px' }}><i className="fa-solid fa-list-ul"></i></button>
                            <button type="button" onClick={() => insertHTMLTag('li')} className="btn-icon" title="Liste Elemanı (LI)" style={{ padding: '4px 8px', fontSize: '0.8rem', fontWeight: 'bold' }}>LI</button>
                            <button type="button" onClick={() => insertHTMLTag('link')} className="btn-icon" title="Bağlantı (Link)" style={{ padding: '4px 8px' }}><i className="fa-solid fa-link"></i></button>
                            <button type="button" onClick={() => insertHTMLTag('img')} className="btn-icon" title="Resim Ekle" style={{ padding: '4px 8px' }}><i className="fa-regular fa-image"></i></button>
                            <button type="button" onClick={() => insertHTMLTag('quote')} className="btn-icon" title="Alıntı (Blockquote)" style={{ padding: '4px 8px' }}><i className="fa-solid fa-quote-right"></i></button>
                            <button type="button" onClick={() => insertHTMLTag('table')} className="btn-icon" title="Tablo Ekle" style={{ padding: '4px 8px' }}><i className="fa-solid fa-table"></i></button>
                          </div>
                          <textarea id="blog-content-textarea" required rows="14" value={modalFormData.content || ''} onChange={e => handleModalFieldChange('content', e.target.value)} style={{
                            width: '100%',
                            padding: '0.65rem',
                            borderBottomLeftRadius: '6px',
                            borderBottomRightRadius: '6px',
                            border: '1px solid var(--glass-border)',
                            fontFamily: 'monospace',
                            fontSize: '0.85rem',
                            lineHeight: '1.5',
                            resize: 'vertical'
                          }}></textarea>
                        </div>
                      </> : (/* Live Preview Tab rendering */
              <div className="blog-live-preview" style={{
                padding: '1.25rem',
                border: '1px solid var(--glass-border)',
                borderRadius: '8px',
                background: '#fff',
                maxHeight: '480px',
                overflowY: 'auto',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
              }}>
                        <h1 style={{
                  fontSize: '1.6rem',
                  fontWeight: '800',
                  marginBottom: '0.5rem',
                  color: 'var(--text-light)'
                }}>{modalFormData.title || 'Başlıksız Yazı'}</h1>
                        <div style={{
                  display: 'flex',
                  gap: '0.75rem',
                  flexWrap: 'wrap',
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  marginBottom: '1rem',
                  borderBottom: '1px solid var(--glass-border)',
                  paddingBottom: '0.5rem'
                }}>
                          <span><i className="fa-regular fa-user" style={{
                      marginRight: '4px'
                    }}></i> {modalFormData.author || 'Ajans Rota'}</span>
                          <span><i className="fa-regular fa-calendar" style={{
                      marginRight: '4px'
                    }}></i> {modalFormData.date || new Date().toLocaleDateString('tr-TR')}</span>
                          <span><i className="fa-regular fa-clock" style={{
                      marginRight: '4px'
                    }}></i> {modalFormData.readTime || '5 dk okuma'}</span>
                          <span style={{
                    textTransform: 'uppercase',
                    fontWeight: '700',
                    color: 'var(--primary)'
                  }}>Kategori: {modalFormData.category || 'Genel'}</span>
                        </div>
                        {modalFormData.excerpt && <p style={{
                  fontStyle: 'italic',
                  color: 'var(--text-muted)',
                  fontSize: '0.95rem',
                  borderLeft: '3px solid var(--primary)',
                  paddingLeft: '0.75rem',
                  marginBottom: '1.25rem',
                  lineHeight: '1.5'
                }}>
                            {modalFormData.excerpt}
                          </p>}
                        <div className="blog-content-preview" style={{
                  fontSize: '0.9rem',
                  lineHeight: '1.6',
                  color: 'var(--text-light)'
                }} dangerouslySetInnerHTML={{
                  __html: modalFormData.content || '<p style="color:var(--text-muted); font-style:italic;">Yazı içeriği boş...</p>'
                }} />
                      </div>)}
                  </>}
              </div>
              <div className="lead-modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
              setEditingItem(null);
              setEditingType('');
            }} style={{
              marginRight: '8px'
            }}>İptal</button>
                <button type="submit" className="btn btn-primary">Kaydet</button>
              </div>
            </form>
          </div>
        </div>
  );
}
