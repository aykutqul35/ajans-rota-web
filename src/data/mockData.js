export const budgetSteps = [30000, 50000, 75000, 100000, 150000, 250000, 350000, 500000]

export const initialServicePagesData = {
  google: {
    baseFee: 20000,
    title: "Google Ads Danışmanlığı",
    tagline: "Minimum Bütçe, Maksimum ROAS ve İzmir/Ege Firmalarına Özel Stratejiler",
    iconName: "fa-brands fa-google",
    description: "İzmir ve Ege bölgesindeki e-ticaret markaları, üreticiler ve ihracatçılar için Google Ads aramalarında, Alışveriş (PMax), YouTube ve Görüntülü Reklam ağlarında yüksek dönüşüm odaklı performans kampanyaları yönetiyoruz. Reklam bütçenizin her kuruşunu ciroya dönüştürüyoruz.",
    features: [
      "Maksimum ROAS ve Satış Odaklı PMax Kurulumu",
      "Detaylı Rakip Reklam Analizleri ve Anahtar Kelime Tespiti",
      "İhracatçılar İçin Çok Dilli Küresel Kampanya Kurulumları",
      "Dönüşüm İzleme, Google Analytics 4 (GA4) Entegrasyonu",
      "Aylık Bütçe Optimizasyonu ve Düzenli Performans Raporları"
    ],
    caseStudy: {
      brand: "Ege Zeytin Evi",
      industry: "Gurme Gıda & Organik E-Ticaret",
      challenge: "Yüksek tıklama maliyetleri ve %150 seviyesindeki düşük ROAS oranları nedeniyle reklam yatırımlarının zarar etmesi.",
      solution: "Ürün feed optimizasyonu yapıldı, PMax kampanyaları segmentlere ayrıldı ve yerel Ege temalı arama kampanyaları kuruldu.",
      metrics: [
        { label: "Ortalama ROAS", val: "8.4x", icon: "fa-solid fa-chart-line" },
        { label: "Ciro Artışı", val: "+320%", icon: "fa-solid fa-arrow-up-right-dots" },
        { label: "Maliyet Tasarrufu", val: "-35%", icon: "fa-solid fa-percent" }
      ]
    },
    testimonial: {
      name: "Mustafa Çelik",
      company: "Ege Zeytin Evi",
      role: "Kurucu",
      rating: 5,
      quote: "Ajans Rota ile çalışmaya başladıktan sonra Google Ads bütçemizi optimize ettik. ROAS değerimiz kısa sürede 2.5x'ten 8.4x seviyesine yükseldi. İzmir'den tüm Türkiye'ye satış yapıyoruz.",
      initials: "MÇ"
    },
    process: [
      { step: "01", title: "Detaylı Hesap Denetimi", desc: "Mevcut kampanyalarınızı, reklam geçmişinizi ve dönüşüm kodlarınızı teknik analize alıyoruz." },
      { step: "02", title: "Büyüme Stratejisi", desc: "Hedef kitlenize ve rakiplerinize özel, İzmir pazarı dinamiklerini gözeten PMax ve arama ağı planı hazırlıyoruz." },
      { step: "03", title: "Kurulum & Optimizasyon", desc: "Negatif kelimeler, kreatifler, kitle sinyalleri ve yapay zeka destekli teklif stratejilerini kuruyoruz." },
      { step: "04", title: "Ölçekleme & Raporlama", desc: "Haftalık ve aylık performans analizleriyle bütçenizi en yüksek ROAS getiren kanallara kaydırarak ciroyu büyütüyoruz." }
    ],
    faqs: [
      { q: "Google Ads hesabım kimin adına açılacak? Hesap mülkiyeti bana ait kalacak mı?", a: "Sektördeki en büyük eksiklerden biri, reklam hesaplarının ajanslar tarafından kendi adlarına açılıp mülkiyetinin müşteriye verilmemesidir. Biz tüm kurulumları doğrudan sizin adınıza açılmış kurumsal hesapta yapıyoruz. Çalışmayı bıraksak dahi tüm geçmiş verileriniz ve hesabınız tamamen sizin kalır." },
      { q: "Bize sadece tıklama ve gösterim sayılarını mı raporlayacaksınız?", a: "Kesinlikle hayır. Tıklama veya gösterim gibi aldatıcı (vanity) metriklerle göz boyamıyoruz; doğrudan net cironuza, ROAS (Reklam Getirisi) oranınıza ve dönüşüm başına maliyetinize odaklanıyoruz. GA4 entegrasyonuyla hangi reklamın kaç liralık satış getirdiğini canlı olarak görürsünüz." },
      { q: "Reklamlar kurulduktan sonra bütçemizin boşa gitmeyeceğini nasıl garanti ediyorsunuz?", a: "Sektörde sıkça görülen 'kur ve unut' yaklaşımının aksine, günlük negatif anahtar kelime denetimleri yapıyor ve reklamları en yüksek dönüşüm getiren saat ile bölgelere optimize ediyoruz. Ayrıca kendi marka isminizden gereksiz yere bütçe tüketilmesini engelliyoruz." },
      { q: "Google PMax kampanyalarının (Performans Maksimum) bütçeyi kontrolsüz tüketmesini nasıl engelliyorsunuz?", a: "PMax kampanyalarını tamamen Google algoritmalarına teslim etmiyoruz. Negatif kelime listeleri, marka hariç tutmaları, kitle sinyalleri ve ürün feed segmentasyonu kullanarak bütçenizi kontrol altında tutuyor ve sadece satacak ürün gruplarını öne çıkarıyoruz." },
      { q: "Sorularımız olduğunda muhatap bulabilecek miyiz?", a: "İletişim kopukluğu ajans dünyasının en büyük şikayetidir. Ajans Rota'da size özel atanan hesap uzmanınız bulunur. WhatsApp destek grubumuz üzerinden mesai saatleri içerisinde en geç 15 dakika içinde sorularınıza yanıt alırsınız." }
    ]
  },
  meta: {
    baseFee: 20000,
    title: "Meta (FB / IG) Reklamları",
    tagline: "Begonvil Pembesi Yaratıcılıkla Satış Odaklı Sosyal Medya Hunileri",
    iconName: "fa-brands fa-meta",
    description: "Instagram ve Facebook'un gelişmiş hedefleme algoritmalarını ve Ege'nin dinamik görsel estetiğini kullanarak, markanız için satın alma odaklı dönüşüm hunileri tasarlıyoruz. Kreatif testler ve video reklamlarla kitlenizin dikkatini çekip onları sadık müşterilere dönüştürüyoruz.",
    features: [
      "Facebook Piksel & Conversions API (CAPI) Kusursuz Kurulumu",
      "Dinamik Katalog Reklamları ve Yeniden Pazarlama (Retargeting)",
      "UGC (Kullanıcı Tarafından Oluşturulan İçerik) Reklam Stratejileri",
      "Yüksek Dönüşümlü Kreatif A/B Performans Testleri",
      "Lookalike (Benzer Hedef Kitleler) ile Satış Genişletme"
    ],
    caseStudy: {
      brand: "Bodrum Sandalet",
      industry: "Ayakkabı & Tasarım Giyim",
      challenge: "Sosyal medyada yüksek takipçi olmasına rağmen reklamlardan web sitesine doğrudan satış dönüşümünün düşük olması.",
      solution: "Özel indirim hunileri ve dinamik katalog reklamları kuruldu, UGC video kreatifleri ile hedef kitle ısıtıldı.",
      metrics: [
        { label: "Satış Büyümesi", val: "+240%", icon: "fa-solid fa-chart-line" },
        { label: "Meta Ads ROAS", val: "5.8x", icon: "fa-solid fa-bullseye" },
        { label: "Sepet Terk Oranı", val: "-45%", icon: "fa-solid fa-cart-arrow-down" }
      ]
    },
    testimonial: {
      name: "Derin Yılmaz",
      company: "Bodrum Sandalet",
      role: "Pazarlama Müdürü",
      rating: 5,
      quote: "Meta reklamlarındaki kreatif testler ve dinamik hedef kitle kurgularıyla satışlarımız rekor kırdı. Begonvil esintili görsel şablonları tam kitlemize ulaştı.",
      initials: "DY"
    },
    process: [
      { step: "01", title: "Kreatif & Rakip Analizi", desc: "Mevcut sosyal medya görsel gücünüzü, videolarınızı ve rakiplerinizin reklam kütüphanelerini analiz ediyoruz." },
      { step: "02", title: "Dönüşüm Hunisi Kurgusu", desc: "Soğuk kitleler için dikkat çekici video (UGC) kurguları, sıcak kitleler için dinamik katalog reklamları kuruyoruz." },
      { step: "03", title: "Piksel & API Dönüşümleri", desc: "Meta Piksel ve Conversions API (CAPI) entegrasyonu ile veri kaybını önlüyor, iOS 14+ sonrası ölçümlemeyi optimize ediyoruz." },
      { step: "04", title: "A/B Kreatif Testleri & Ölçekleme", desc: "Sürekli yeni görsel ve başlık kombinasyonları test ederek en iyi satış getiren kreatifleri buluyor ve bütçeyi ölçekliyoruz." }
    ],
    faqs: [
      { q: "Aynı reklam görselleriyle aylarca bütçe eritilmesini nasıl engelliyorsunuz?", a: "Sektörün en büyük hatalarından biri, kreatiflerin güncellenmeyip 'kreatif yorgunluğu' (ad fatigue) yaşamasıdır. Biz her hafta en az 3 yeni görsel veya video varyasyonu A/B testine sokuyor, iyi çalışanları ölçeklendirirken zayıfları hemen durduruyoruz." },
      { q: "Yayınlanacak reklam tasarımlarını yayına girmeden önce görebilecek miyiz?", a: "Evet. Marka kalitenizi düşürecek hiçbir reklam metni veya tasarım izniniz olmadan yayına alınmaz. Hazırlanan tüm kreatifler, aylık paylaşımlı onay panellerimizde onayınızdan geçtikten sonra aktif edilir." },
      { q: "iOS 14+ sonrası Instagram reklamlarındaki veri ölçüm kayıplarını nasıl çözüyorsunuz?", a: "Yalnızca tarayıcı pikseline bağımlı kalmıyoruz. Meta Conversions API (CAPI) entegrasyonu kurarak veriyi doğrudan sunucudan (server-side) aktarıyoruz. Bu sayede iOS engellemelerini aşarak reklam hedeflemelerini tam isabet optimize ediyoruz." },
      { q: "Reklamlar doğrudan satış mı getirecek yoksa sadece takipçi mi?", a: "Bütçenizi aldatıcı 'beğeni/etkileşim' reklamlarıyla harcamıyoruz. E-ticaret reklamlarında doğrudan 'Alışveriş (Dönüşüm)' odaklı huniler kuruyoruz. Amacımız sadece takipçi toplamak değil, sepeti tamamlatarak doğrudan ciro yazdırmaktır." },
      { q: "Instagram Reels ve video reklamlar için video çekimlerini kim organize ediyor?", a: "Sizi yalnız bırakmıyoruz. Kreatif ekibimiz en çok satan reklam kancalarını analiz ederek size video senaryoları ve konuşma metinleri hazırlar. Siz telefonla çekip bize yollarsınız, profesyonel montaj ve kurgusunu biz yaparız." }
    ]
  },
  seo: {
    baseFee: 25000,
    title: "Arama Motoru Optimizasyonu (SEO)",
    tagline: "Kalıcı, Reklamsız Organik Trafik ve Google Haritalar Sıralaması",
    iconName: "fa-solid fa-chart-line",
    description: "Google aramalarında kalıcı olarak üst sıralarda yer alın. Teknik SEO analizleri, kelime boşluğu araştırmaları ve e-ticaret sitelerine özel kategori/ürün optimizasyonları ile web sitenizin organik değerini ve ziyaretçi sayısını katlayarak artırıyoruz.",
    features: [
      "Teknik ve Site İçi (On-Page) SEO Denetimleri & Hız Optimizasyonu",
      "Rakip Kelime Analizleri ve Ege/İzmir Yerel SEO Kurguları",
      "E-Ticaret Kategori ve Ürün Odaklı SEO Çalışmaları",
      "Semantik İçerik Stratejisi ve İçerik Geliştirme Danışmanlığı",
      "Google Search Console ve Backlink Profili Analizleri"
    ],
    caseStudy: {
      brand: "Smyrna Figs",
      industry: "Kuru Meyve & Tarım Ürünleri İhracatı",
      challenge: "Yurt dışı pazarında toptan alıcılara ulaşmak için Google aramalarında görünürlüğün olmaması.",
      solution: "İngilizce ve Almanca dillerinde lokal SEO yapıldı. Ürün sayfaları teknik SEO kurallarına göre yeniden yapılandırıldı.",
      metrics: [
        { label: "Organik Trafik", val: "+310%", icon: "fa-solid fa-arrow-trend-up" },
        { label: "İlk 3 Sıra Kelime", val: "45+", icon: "fa-solid fa-trophy" },
        { label: "Yabancı Talep Artışı", val: "2.8x", icon: "fa-solid fa-globe" }
      ]
    },
    testimonial: {
      name: "Ayla Karaca",
      company: "Smyrna Figs",
      role: "İhracat Müdürü",
      rating: 5,
      quote: "İngilizce ve Almanca dillerinde yaptığımız teknik SEO çalışmaları ile yurt dışı organik trafiğimiz zirveye ulaştı. Toptan ihracat talepleri almaya başladık.",
      initials: "AK"
    },
    process: [
      { step: "01", title: "Teknik SEO Denetimi", desc: "Sitenizin tarama hatalarını, hız skorlarını (Core Web Vitals), şema yapılarını ve mobil uyumluluğunu denetliyoruz." },
      { step: "02", title: "Anahtar Kelime Araştırması", desc: "Rakiplerinizin organik hit aldığı kelimeleri, kelime boşluklarını ve yüksek dönüşüm getirecek satın alma odaklı aramaları buluyoruz." },
      { step: "03", title: "Site İçi (On-Page) SEO", desc: "Kategori açıklamaları, ürün başlıkları, URL yapıları ve meta etiketlerini semantik SEO kurallarına uygun olarak optimize ediyoruz." },
      { step: "04", title: "Otorite İnşası & Backlink", desc: "Sektörünüzle alakalı, güvenilir ve yüksek otoriteye sahip web sitelerinden doğal bağlantılar (backlink) sağlayarak Google güvenini artırıyoruz." }
    ],
    faqs: [
      { q: "Piyasadaki ucuz 'hazır backlink paketleri' gibi siteme zarar verecek bağlantılar kullanıyor musunuz?", a: "Asla. Sektörde satılan 500-1000 linklik spam paketler sitenizin Google'dan ceza (sandbox) yemesine neden olur. Biz sadece sektörünüzle ilgili, gerçek trafiğe sahip otoriter web sitelerinden doğal PR tanıtım yazıları alarak güvenli link inşası yapıyoruz." },
      { q: "Web siteme eklenecek SEO içerikleri yapay zeka kopyası mı olacak?", a: "Doğrudan yapay zekadan kopyalanan yazılar Google algoritmalarınca fark edilerek sitenizin değerini düşürür. İçerik ekibimiz, sektördeki gerçek arama niyetini (Search Intent) hedefleyen, uzman yazarlarca kaleme alınmış semantik, özgün makaleler üretir." },
      { q: "Sitedeki teknik SEO hatalarını (hız, kodlama) yazılımcımızla kim koordine edecek?", a: "Hataları raporlayıp kenara çekilmiyoruz. Yazılımcınıza doğrudan Jira veya Trello üzerinden teknik dilde görev tanımları (task) açıyor, yapılan düzenlemeleri bizzat denetleyip yayına alınmasına destek oluyoruz." },
      { q: "Kelime sıralamalarımızı ve organik büyümemizi şeffaf takip edebilecek miyiz?", a: "Evet. Ahrefs ve Semrush verileriyle entegre ettiğimiz şeffaf Looker Studio panellerimiz sayesinde, hedef kelimelerinizde kaçıncı sıradan kaçıncı sıraya yükseldiğinizi ve organik tıklamalarınızı haftalık olarak izleyebilirsiniz." }
    ]
  },
  social: {
    baseFee: 18000,
    title: "Sosyal Medya Yönetimi",
    tagline: "Ege Ruhuyla Sosyal Platformlarda Marka Sesi ve Etkileşim Uçuşu",
    iconName: "fa-solid fa-hashtag",
    description: "Markanızın dijital kimliğini profesyonelce yönetiyoruz. Özel tasarım şablonları, video (Reels & TikTok) senaryoları, düzenli paylaşım takvimleri ve etkileşim stratejileriyle sosyal platformlarda takipçilerinizi sadık müşteriler haline getiriyoruz.",
    features: [
      "Özgün Feed, Story ve Reels Tasarım Şablonları",
      "Trendlere Uygun Video (Reels/TikTok) Senaryoları & Kurgusu",
      "Aylık İçerik Paylaşım Takvimi & Marka Sesi Yönetimi",
      "Topluluk Yönetimi, Yorum & DM Yanıtlama Stratejisi",
      "Aylık Etkileşim, Takipçi ve Rakip Analiz Raporları"
    ],
    caseStudy: {
      brand: "Urla Bağ Evleri",
      industry: "Turizm & Butik Otelcilik",
      challenge: "Zayıf sosyal medya varlığı ve düşük etkileşim oranları nedeniyle butik otel rezervasyonlarının dolmaması.",
      solution: "Fotoğraf ve Reels odaklı estetik Ege konsepti oluşturuldu, lokal hedef kitleye yönelik içerikler düzenli paylaşıldı.",
      metrics: [
        { label: "Reels Gösterimi", val: "10x+", icon: "fa-solid fa-eye" },
        { label: "Instagram Takipçi", val: "+45k", icon: "fa-solid fa-users" },
        { label: "Rezervasyon Artışı", val: "+180%", icon: "fa-solid fa-calendar-check" }
      ]
    },
    testimonial: {
      name: "Canan Şen",
      company: "Urla Bağ Evleri",
      role: "Genel Müdür",
      rating: 5,
      quote: "Ajans Rota'nın hazırladığı video ve fotoğraf kurguları Instagram'da binlerce kişiye ulaştı. Sezon dışı dönemlerde bile otelimiz tamamen doldu.",
      initials: "CŞ"
    },
    process: [
      { step: "01", title: "Marka Kimliği & Konsept", desc: "Markanızın ses tonunu, renk paletini, görsel estetiğini ve rakip konumlandırmasını belirliyoruz." },
      { step: "02", title: "Aylık İçerik Takvimi", desc: "Feed tasarımları, Story şablonları ve Reels fikirlerini içeren 30 günlük planı onayınıza sunuyoruz." },
      { step: "03", title: "Tasarım & Video Üretimi", desc: "İzmir'deki ekibimizle premium grafik tasarımları, illüstrasyonlar ve dikkat çekici kısa video (Reels/TikTok) kurguları hazırlıyoruz." },
      { step: "04", title: "Etkileşim & Topluluk", desc: "Gelen yorumları ve DM'leri marka sesinize uygun yanıtlıyor, etkileşim oranını ve takipçi kalitesini artırıyoruz." }
    ],
    faqs: [
      { q: "Bize sunacağınız tasarımlar jenerik/hazır şablonlardan mı oluşacak?", a: "Sektörün en büyük eksikliği, her markaya aynı hazır Canva şablonlarını sunmaktır. Tasarım ekibimiz, markanızın kurumsal kimliğine ve İzmir/Ege esintili tarzına uygun olarak sıfırdan vektörel ve grid tasarımlar çizer." },
      { q: "Hesabımızda paylaşım yaptıktan sonra DM'leri ve yorumları tamamen boşluyor musunuz?", a: "Hayır. Paylaşım yapıp kenara çekilen ajanslardan değiliz. Müşteri etkileşimi için ortak bir SSS (Soru-Cevap) kılavuzu hazırlarız; gelen DM ve yorumları bu kılavuz doğrultusunda gün içinde düzenli olarak proaktif bir şekilde yanıtlarız." },
      { q: "Hesabımızı hızlı büyütmek için bot/takipçi satın alıyor musunuz?", a: "Kesinlikle hayır. Bot veya sahte takipçi almak hesabın etkileşim oranını (Engagement Rate) yok eder ve Instagram algoritmasında görünmez (shadowban) olmanıza neden olur. Büyümeyi tamamen özgün Reels içerikleri ve mikro-reklamlar ile doğal yoldan yapıyoruz." },
      { q: "Sosyal medya yönetiminin ciromuza etkisini nasıl ölçebiliriz?", a: "Sosyal medya gönderilerinize ve biyografinize özel UTM linkleri ve indirim kodları tanımlıyoruz. Google Analytics üzerinden sosyal medyadan gelerek alışveriş yapan kitleyi doğrudan raporlayarak yaptığımız tasarımların ciro etkisini gösteriyoruz." }
    ]
  },
  ecommerce: {
    baseFee: 25000,
    title: "E-Ticaret & Pazaryeri Yönetimi",
    tagline: "Çok Kanallı Satış Yapıları: Trendyol, Hepsiburada, Amazon ve Shopify",
    iconName: "fa-solid fa-cart-shopping",
    description: "Markanızın e-ticaret sitenizi (Shopify, Woocommerce) ve pazaryeri (Trendyol, Hepsiburada, Amazon) mağazalarınızı entegre ve optimize bir şekilde yönetiyoruz. Ürün listelemelerinden reklam yönetimine, stok takibinden buybox optimizasyonuna kadar uçtan uca destek veriyoruz.",
    features: [
      "Pazaryeri Ürün Giriş, SEO ve Başlık Optimizasyonları",
      "Trendyol ve Hepsiburada Reklamlarının Yönetimi & ROAS Takibi",
      "Shopify / Woocommerce Site Kurulumu ve Entegrasyon Desteği",
      "Stok, Fiyatlama ve Buybox Rekabet Yönetimi",
      "E-İhracat ve Amazon Global Satış Danışmanlığı"
    ],
    caseStudy: {
      brand: "Ege Deri Tasarım",
      industry: "Deri Aksesuar Üreticisi",
      challenge: "Sadece fiziksel toptan satış yapan fabrikanın dijital pazaryerlerinde perakende satışa başlamak istemesi fakat teknik altyapı eksikliği.",
      solution: "Trendyol, Hepsiburada ve Amazon mağazaları açıldı, Shopify entegrasyonu sağlandı ve lansman reklamları yönetildi.",
      metrics: [
        { label: "Aylık Sipariş", val: "3x", icon: "fa-solid fa-cart-arrow-down" },
        { label: "Hepsiburada ROAS", val: "6.2x", icon: "fa-solid fa-chart-line" },
        { label: "Shopify Cirosu", val: "+180%", icon: "fa-solid fa-money-bill-trend-up" }
      ]
    },
    testimonial: {
      name: "Volkan Can",
      company: "Ege Deri Tasarım",
      role: "Kurucu",
      rating: 5,
      quote: "Trendyol ve Hepsiburada mağazalarımızın optimizasyonu ve entegrasyonu sayesinde aylık sipariş adetlerimiz 3 katına çıktı. Shopify sitemizle pazaryeri entegrasyonumuz kusursuz çalışıyor.",
      initials: "VC"
    },
    process: [
      { step: "01", title: "Altyapı & Entegrasyon Kontrolü", desc: "Stok, fatura, kargo ve pazaryeri (Trendyol, HB, Amazon) entegrasyonlarının doğruluğunu ve veri akışını denetliyoruz." },
      { step: "02", title: "Katalog & SEO Optimizasyonu", desc: "Ürün başlıkları, açıklamaları, varyantları ve görsellerini arama algoritmalarına uygun optimize ediyoruz." },
      { step: "03", title: "Fiyat & Rakip İzleme", desc: "Pazaryerlerindeki Buybox durumunu ve rakiplerin anlık fiyat değişimlerini izleyerek stratejik aksiyonlar alıyoruz." },
      { step: "04", title: "Kampanya & Bütçe Yönetimi", desc: "Trendyol ve Hepsiburada'nın dönemsel kampanyalarını planlıyor, pazaryeri içi reklam bütçelerini verimli ROAS ile yönetiyoruz." }
    ],
    faqs: [
      { q: "Trendyol ve Hepsiburada komisyonları altında eziliyoruz, bizi kendi web sitemize nasıl taşıyacaksınız?", a: "Sektördeki en büyük eksiklik markaları tamamen pazaryerlerine bağımlı kılmaktır. Biz pazaryerlerini nakit akışı ve kitle edinimi için kullanırken, edinilen bu kitleyi Shopify web sitenize çekmek için kargo içi broşürler, özel kuponlar ve remarketing reklamları uyguluyoruz." },
      { q: "Farklı pazaryerlerindeki ve web sitemizdeki stokların senkronize olmamasından ceza yer miyiz?", a: "Entegrasyon hatalarını kökten çözüyoruz. Mağazalarınızı ortak bir entegratör (Sentos, Birfatura, Stockmount vb.) altyapısına bağlayarak tek bir merkezden stok ve sipariş takibi sağlıyoruz. Bir kanalda satılan ürün tüm kanallarda saniyeler içinde güncellenir." },
      { q: "Pazaryeri içi reklam bütçemizin verimli kullanılacağını nasıl garanti ediyorsunuz?", a: "Trendyol/Hepsiburada reklamlarını ezbere açmıyoruz. Mağaza puanı, Buybox durumu, ürün yorum sayısı ve dönüşüm oranlarına göre sadece en kârlı ürünleri reklama sokuyor, dönüşüm getirmeyen arama terimlerini negatif listeye alıyoruz." },
      { q: "Rakipler sürekli fiyat kırarak Buybox'ımızı çalıyor, bunu nasıl yöneteceksiniz?", a: "Buybox takibini manuel değil, otomatik analiz araçlarıyla izliyoruz. Optimum kârlılık sınırlarında otomatik fiyat güncellemeleri veya Buybox uyarı sistemleri kurarak mağazanızın satış payını koruyoruz." }
    ]
  },
  design: {
    baseFee: 20000,
    title: "Dönüşüm Odaklı Web Tasarım",
    tagline: "Ultra Hızlı, Mobil Uyumlu ve Satış Dönüşümünü Katlayan Özel Yazılımlar",
    iconName: "fa-solid fa-laptop-code",
    description: "Sadece görsel olarak şık değil, aynı zamanda sayfa hızı yüksek, SEO uyumlu ve kullanıcı deneyimi (UX) test edilmiş web tasarımları yapıyoruz. Hedefimiz, sitenize giren ziyaretçileri en hızlı şekilde müşteriye veya forma dönüştürmektir.",
    features: [
      "Ultra Hızlı Kod Yapısı (Core Web Vitals Uyumlu)",
      "Mobil Cihazlar ve Tüm Ekranlar İçin Kusursuz Responsive Tasarım",
      "Kullanıcı Deneyimi (UX/UI) Analizi & Isı Haritası Kurulumları",
      "Dönüşüm Oranı Optimizasyonu (CRO) ve Rezervasyon Hunileri",
      "Güvenli Altyapı, Yönetim Paneli ve Kolay İçerik Güncelleme"
    ],
    caseStudy: {
      brand: "Dr. Hakan B. Klinik",
      industry: "Sağlık Turizmi & Estetik Klinik",
      challenge: "Eski web sitesinin yavaş açılması ve mobil cihazlarda randevu formunun zor doldurulması sebebiyle potansiyel hasta kaybı.",
      solution: "Modern, hızlı ve randevu odaklı özel landing pageler tasarlandı. Sayfa açılış hızı 3.8s'den 0.8s'ye çekildi.",
      metrics: [
        { label: "Yüklenme Süresi", val: "0.8s", icon: "fa-solid fa-bolt" },
        { label: "Dönüşüm Oranı", val: "%3.6", icon: "fa-solid fa-user-check" },
        { label: "Gelen Form Sayısı", val: "+120%", icon: "fa-solid fa-clipboard-list" }
      ]
    },
    testimonial: {
      name: "Dr. Hakan B.",
      company: "Ege Estetik Kliniği",
      role: "Kurucu & Başhekim",
      rating: 5,
      quote: "Yeni web sitemiz açıldıktan sonra gelen randevu formlarında çok ciddi bir artış oldu. Mobil uyumu harika ve randevu alma süresi çok kısaldı.",
      initials: "HB"
    },
    process: [
      { step: "01", title: "Kullanıcı Deneyimi (UX) Çizimi", desc: "Dönüşüm odaklı sayfa mimarisini (wireframe) çiziyor, buton yerleşimlerini ve kullanıcı yolculuğunu planlıyoruz." },
      { step: "02", title: "Özgün UI Arayüz Tasarımı", desc: "Begonvil pembesi ve turkuaz tonleriyle harmanlanmış, modern, parlayan cam efektli arayüz tasarımları hazırlıyoruz." },
      { step: "03", title: "Hızlı Kodlama & SEO Altyapısı", desc: "Web sitenizi en son HTML/CSS/JS standartlarında, mobil uyumlu ve Google Core Web Vitals testlerinden tam not alacak şekilde kodluyoruz." },
      { step: "04", title: "CRO & Lansman", desc: "Isı haritaları, dönüşüm takip kodları ve randevu/sipariş formlarının testlerini tamamlayarak sitenizi yayına alıyoruz." }
    ],
    faqs: [
      { q: "WordPress temalarını kurup bize 'özel tasarım' diye satmayacağınızı nasıl bileceğiz?", a: "Sektörün en büyük aldatmacası hazır şablonların üzerine logo basıp teslim edilmesidir. Projelerimizde arayüzü Figma üzerinde markanıza özel çizer, onay aldıktan sonra en hafif kodlama standartlarında (React, Tailwind veya saf HTML/CSS/JS) geliştiririz. Siteniz hiçbir hazır temanın yavaşlığını taşımaz." },
      { q: "Web sitemizin Google PageSpeed hız testlerinden yüksek puan alacağını garanti ediyor musunuz?", a: "Evet. Sitenizin Core Web Vitals (LCP, INP, CLS) skorlarının yeşil bölgede (90+ puan) açılmasını sağlıyoruz. Ağır kütüphaneler kullanmıyor, tüm görselleri Next-Gen formatında (WebP/AVIF) optimize ediyor ve 1 saniyenin altında açılış hızı sunuyoruz." },
      { q: "Tasarım bittikten sonra küçük bir değişiklik için size bağımlı kalacak mıyız?", a: "Kesinlikle hayır. Basitleştirilmiş yönetim paneli entegre ediyoruz. Kod bilmenize gerek kalmadan içerikleri güncelleyebilirsiniz. Ayrıca teslimat sonrasında size özel hazırladığımız video eğitim kütüphanesini teslim ediyoruz." },
      { q: "Sitedeki dönüşüm takip kodlarını (GA4, Facebook Pixel) kim kuracak?", a: "Birçok yazılımcı pazarlama kodlarından anlamaz ve pikselleri eksik kurar. Biz web sitenizi yaparken Google Tag Manager (GTM), GA4 e-ticaret dönüşümleri ve Meta CAPI entegrasyonlarını tasarım aşamasında kod içine gömerek pazarlamaya hazır teslim ederiz." }
    ]
  }
}

export const featuredStories = [
  {
    id: 1,
    title: "Alaçatı Ev Kurabiyecisi",
    category: "E-Ticaret & SEO",
    metric: "+280% Satış Artışı",
    quote: "Ajans Rota ile çıktığımız e-ticaret yolculuğunda, Alaçatı lezzetlerini tüm Türkiye'ye ulaştırdık. 6 ayda sipariş hacmimiz üçe katlandı.",
    manager: "Derya Karataş",
    role: "Kurucu Ortak"
  },
  {
    id: 2,
    title: "Ege Zeytinyağları A.Ş.",
    category: "Google Ads & İhracat",
    metric: "4.8x Reklam Getirisi (ROAS)",
    quote: "Hedef kitlemiz olan Avrupa ve Körfez ülkelerinde yürüttüğümüz Google Ads kampanyalarıyla ihracat hacmimizi rekor seviyede artırdık.",
    manager: "Mustafa Zeytinci",
    role: "İhracat Direktörü"
  },
  {
    id: 3,
    title: "Kordon Tıp Merkezi",
    category: "SEO & Yerel Büyüme",
    metric: "+145% Organik Trafik",
    quote: "İzmir'de sağlık turizmi ve yerel aramalarda görünürlüğümüzü tamamen Ajans Rota'nın planlı SEO çalışmalarına borçluyuz.",
    manager: "Dr. Selim Alsancak",
    role: "Başhekim"
  }
];

export const initialTeamMembers = [
    {
      role: "Performans ve Veri Zekası",
      name: "Nova AI",
      init: "NV",
      gradient: "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
      desc: "Google Ads ve Meta (Facebook/Instagram) kampanyalarında saniyede binlerce A/B testi uygulayan ve bütçenizi maksimum ROAS için optimize eden otonom performans ajanımız.",
      dept: "management",
      stars: 5,
      exp: "Sonsuz"
    },
    {
      role: "Semantik & SEO Mimarı",
      name: "Lexis AI",
      init: "LX",
      gradient: "linear-gradient(135deg, #10b981, #0ea5e9)",
      desc: "Sektörel anahtar kelime analizlerini ve rakip backlink profillerini 7/24 tarayan, arama motoru algoritmalarındaki değişimleri anında tespit edip uygulayan SEO ajanımız.",
      dept: "performance",
      stars: 5,
      exp: "Sonsuz"
    },
    {
      role: "Kreatif Algoritma",
      name: "Aura AI",
      init: "AR",
      gradient: "linear-gradient(135deg, #8b5cf6, #f43f5e)",
      desc: "Kullanıcıların hangi renklere, başlık tiplerine ve görsellere daha çok tıkladığını analiz ederek otonom statik ve dinamik reklam kreatifleri üreten dizayn algoritmamız.",
      dept: "creative",
      stars: 5,
      exp: "Sonsuz"
    }
  ];

export const initialBlogPosts = [
  {
    id: 1,
    category: 'google',
    title: "E-Ticarette ROAS Artırmanın 5 Altın Kuralı",
    excerpt: "Google Ads (PMax) campaigns'lerinizde bütçenizin boşa gitmesini engellemek ve reklam getirinizi (ROAS) katlamak için uygulamanız gereken en kritik 5 strateji.",
    date: "14 Haziran 2026",
    readTime: "5 dk okuma",
    author: "Mustafa Çelik",
    content: `Google Ads (PMax) kampanyalarında bütçe israfını önlemek ve dönüşümleri maksimum seviyeye çıkarmak, modern e-ticaret sitelerinin en büyük önceliğidir. Reklam yatırımlarının karşılığını almak (ROAS) sadece bütçeyi artırmakla değil, akıllı optimizasyon yöntemleriyle mümkündür.

İşte Ege Zeytin Evi vaka analiziyle de başarısını kanıtladığımız, e-ticarette reklam getirinizi artıracak 5 altın kural:

**1. PMax Kampanyalarını Segmentlere Ayırın**
Tüm ürünleri tek bir PMax (Performans Maksimum) kampanyasına yüklemek bütçenin dengesiz harcanmasına yol açar. Çok satanlar, düşük marjlılar ve yeni gelenler için ayrı kampanyalar kurgulayın. Böylece bütçeyi verimli dağıtabilirsiniz.

**2. Ürün Feed'inizi (Google Merchant Center) Optimize Edin**
Reklamlarınızın doğru aramalarda çıkması için ürün başlıklarını ve açıklamalarını arama hacmi yüksek anahtar kelimelerle güncelleyin. Örneğin; sadece "Organik Zeytinyağı" yerine "Soğuk Sıkım Sızma Organik Zeytinyağı 5L" gibi açıklayıcı başlıklar kullanın.

**3. Günlük Negatif Kelime Denetimi Yapın**
Arama terimleri raporunu her gün inceleyerek markanızla veya ürünlerinizle ilgisi olmayan, dönüşüm getirmeyen arama kelimelerini negatif olarak ekleyin. Bu sayede alakasız tıklamalar için ödediğiniz bütçeyi anında kurtarırsınız.

**4. Google Analytics 4 (GA4) Dönüşüm Entegrasyonunu Eksiksiz Kurun**
Hangi reklamın, hangi ürün grubunda, ne kadarlık ciro getirdiğini kuruşu kuruşuna ölçümleyin. Eksik dönüşüm izleme, Google yapay zekasının yanlış optimizasyon yapmasına neden olur.

**5. Birinci Taraf Müşteri Verilerini (First-Party Data) Kullanın**
Mevcut alıcı listelerinizi şifreli olarak Google paneline yükleyin. Algoritmaya "bu kişilere benzeyen yeni alıcılar bul" sinyali (Lookalike) göndererek dönüşüm maliyetlerinizi %30 oranında düşürün.`
  },
  {
    id: 2,
    category: 'meta',
    title: "Instagram Reels Reklamlarında Dönüşümü Uçuran Yaratıcı Sırlar",
    excerpt: "Kullanıcıların dikkat süresi 3 saniyeye düşmüşken, Reels videolarınızda doğru kancayı (hook) kullanarak izleyicileri satın alan müşterilere dönüştürmenin yolları.",
    date: "10 Haziran 2026",
    readTime: "4 dk okuma",
    author: "Derin Yılmaz",
    content: `Sosyal medyada rekabet her geçen gün artarken, reklam bütçelerinizin başarısı doğrudan kreatiflerinizin kalitesine bağlıdır. Instagram Reels formatında kullanıcıların ilgisini çekmek için yalnızca ilk 3 saniyeniz var. Bu sürede kullanıcıyı durduramazsanız bütçeniz eriyip gider.

Instagram Reels reklamlarında satışlarınızı katlayacak tasarım ve kurgu sırları:

**1. İlk 3 Saniyede Kanca (Hook) Kullanın**
Videolarınıza doğrudan ürünün adıyla başlamayın. Bunun yerine kullanıcının sorununu veya merakını tetikleyecek cümlelerle başlayın. Örneğin: "Instagram'da sürekli karşıma çıkan bu sandaletleri neden herkes satın alıyor?" veya "E-ticaret cironuzu düşüren o görünmez hata."

**2. UGC (Kullanıcı Tarafından Üretilen İçerik) Formatını Benimseyin**
Aşırı stüdyo kokan, yapay reklam filmleri yerine, sıradan bir kullanıcının cep telefonuyla evinde veya sokakta çektiği samimi kutu açılışı, inceleme videoları 3 kat daha fazla tıklama almaktadır. Ege'nin doğal ortamlarında çekilmiş, samimi UGC videoları her zaman en yüksek ROAS değerini getirir.

**3. Altyazı ve Büyük Metinleri İhmal Etmeyin**
Instagram kullanıcılarının %70'inden fazlası hikaye ve reels videolarını sessiz izlemektedir. Bu yüzden videodaki tüm konuşmaları renkli, hareketli altyazılarla destekleyin.

**4. Güçlü Bir Harekete Geçirici Mesaj (CTA) İle Bitirin**
Videonun sonunda kullanıcıya ne yapması gerektiğini net bir şekilde söyleyin: "Hemen profilimizdeki linkten inceleyin", "Sınırlı sayıdaki Ege serisi için yukarı kaydırın" vb.

**5. Haftalık Kreatif A/B Testi Uygulayın**
Her zaman aynı görseli yayınlamak "kreatif yorgunluğuna" yol açar. Her hafta 3 farklı video giriş kancasını test edin, en iyi sonuç getiren kombinasyonun bütçesini ölçekleyin.`
  },
  {
    id: 3,
    category: 'seo',
    title: "Yerel SEO Rehberi: İzmir'de Google Haritalar'da 1. Sıraya Yükselmek",
    excerpt: "Reklam vermeden, tamamen organik aramalarda ve özellikle Google Haritalar'da (Google My Business) üst sıralarda görünerek yerel müşteri trafiğinizi katlamanın yolları.",
    date: "05 Haziran 2026",
    readTime: "6 dk okuma",
    author: "Kaan Aras",
    content: `İzmir ve çevre illerdeki kurumsal firmalar, yerel esnaflar veya hizmet sağlayıcılar için en verimli trafik kaynağı Google Haritalar aramalarıdır. Bölgenizdeki bir kullanıcı "Alsancak diş hekimi" veya "İzmir hukuk bürosu" araması yaptığında ilk 3 harita kaydı arasında yer almanız, doğrudan organik telefon aramaları ve web sitesi ziyaretleri demektir.

Google Haritalar sıralamanızı yükseltecek temel adımlar:

**1. Google Harita (Google Business Profile) Kaydınızı Tam Metinle Optimize Edin**
Profil isminizin yanına sadece firma adınızı yazmakla kalmayın, ana uzmanlık alanınızı da ekleyin. Örneğin: "Ajans Rota | İzmir Performans & SEO Ajansı". Açıklama kısmında sunduğunuz hizmetleri ve bölgenizi net bir şekilde belirtin.

**2. Yerel Anahtar Kelimeleri Web Sitenizin Koduna Entegre Edin**
Web sitenizin başlık (Title), açıklama (Meta Description) ve başlık etiketlerinde (H1, H2, H3) bölgesel anahtar kelimelere yer verin. "İzmir web tasarım ajansı", "Bornova oto servis" gibi hedeflemeler Google'ın yerel otoritenizi anlamasını sağlar.

**3. Düzenli Müşteri Yorumu ve 5 Yıldız Toplayın**
Sıralama algoritmasının en güçlü sinyallerinden biri yorum sayısı ve kalitesidir. Memnun kalan müşterilerinize özel bir QR kod veya link göndererek Google haritanıza 5 yıldızlı, detaylı metin içeren yorumlar yazmalarını isteyin.

**4. Google Harita Profilinizde Düzenli Gönderiler ve Görseller Paylaşın**
Tıpkı bir sosyal medya hesabı gibi Google Business profilinizi de güncel tutun. Haftalık olarak sunduğunuz kampanyaları, yaptığınız işlerden fotoğrafları ve makaleleri profilinizde yayınlayın.`
  },
  {
    id: 4,
    category: 'social',
    title: "Ege Sıcaklığında Sosyal Medya Dili: Plaza Jargonundan Kaçış",
    excerpt: "Sosyal medyada markanız için samimi, cana yakın ve topluluk oluşturan bir marka sesi inşa ederek sadık takipçiler ve yüksek etkileşim oranları yakalamanın yolları.",
    date: "01 Haziran 2026",
    readTime: "4 dk okuma",
    author: "Begüm Şen",
    content: `Sosyal medya kullanıcıları artık kurumsal, soğuk ve aşırı mesafeli marka hesaplarından sıkıldı. Kullanıcılar karşılarında robotik şablonlar değil, kendileriyle empati kurabilen, konuşabilen gerçek insanlar görmek istiyor. Hele ki hedef kitleniz Ege bölgesindeyse veya Ege'nin samimiyetini arıyorsa, samimi bir marka sesi oluşturmak satışlarınızı doğrudan etkiler.

Sosyal medyada samimi ve başarılı bir topluluk dili kurmanın yöntemleri:

**1. Jargon ve Aşırı Teknik Terimlerden Arının**
"Sinerji oluşturmak", "optimizasyon süreçlerini konsolide etmek" gibi plaza terimlerini bir kenara bırakın. Müşterinizle tıpkı kordonda çay içerken veya Urla'da kahvaltı yaparken konuştuğunuz gibi doğal, açık ve anlaşılır bir Türkçe kullanın.

**2. Hikaye Anlatıcılığına (Storytelling) Odaklanın**
Ürününüzün sadece teknik özelliklerini yazmayın; o ürünün arkasındaki emeği, ekibinizin sabah kahvesini, ürünün paketlenme anındaki özeni paylaşın. İnsanlar hikayelerle bağ kurar, ürünlerle değil.

**3. Canva Şablonu Tekdüzeliğinden Kurtulun**
Her gün aynı renklerde, sadece metin değişen jenerik tasarımlar paylaşmak profilinizi sıkıcılaştırır. Özgün fotoğraflar, anlık çekilmiş reels videoları ve markanıza özel çizilmiş illüstrasyonlarla profilinize canlılık katın.

**4. Gelen Yorum ve Mesajlara Hızlı Yanıt Verin**
Sosyal medya çift yönlü bir iletişim aracıdır. Gönderilerinizin altına gelen yorumlara samimi, esprili ve yapıcı yanıtlar vererek kullanıcılarla aranızda bir bağ oluşturun. Mesaj atan potansiyel alıcılara kopyala-yapıştır cevaplar vermeyin.`
  },
  {
    id: 5,
    category: 'ecommerce',
    title: "E-Ticarette En Sık Yapılan Entegrasyon Hataları ve Çözümleri",
    excerpt: "Trendyol, Hepsiburada ve Amazon entegrasyonlarında stok eşitsizliği ve geciken gönderimlerden kaynaklanan puan kayıplarını önlemenin yolları.",
    date: "28 Mayıs 2026",
    readTime: "5 dk okuma",
    author: "Caner Efe",
    content: `E-ticaret markalarının en büyük büyüme kanallarından biri Trendyol, Hepsiburada, Çiçeksepeti ve Amazon gibi pazaryerleridir. Ancak aynı anda hem kendi e-ticaret sitenizde hem de 3 farklı pazaryerinde satış yaparken en büyük kabusunuz stok yönetimidir. Entegrasyon sisteminin doğru çalışmaması, mağaza puanınızın düşmesine ve hatta mağazanızın kapatılmasına yol açabilir.

Pazaryeri yönetiminde mağaza puanınızı zirvede tutacak çözümler:

**1. Gerçek Zamanlı (Real-Time) Stok Senkronizasyonu Kurun**
Kendi sitenizde satılan bir ürünün stoğu pazaryerlerinde de anlık olarak güncellenmelidir. Gecikmeli senkronizasyon, stoğu biten bir ürünün Trendyol'da satılmasına ve sipariş iptali yapmak zorunda kalmanıza neden olur. Bu durum mağaza puanınızı doğrudan baltalar.

**2. Buybox Fiyat Rekabetini Yapay Zeka Desteğiyle Yönetin**
Pazaryerlerinde aynı ürünü satan onlarca satıcı arasında öne çıkmak (Buybox'ı kazanmak) için fiyatı kuruşu kuruşuna takip etmek gerekir. Manuel fiyat değiştirmek yerine, belirlediğiniz alt kar limitine kadar otomatik fiyat kıran akıllı yazılımlar kullanın.

**3. Paketleme ve Kargo Hızını Optimize Edin**
Sipariş geldikten sonra 24 saat içinde kargoya verilmeyen ürünler müşteri memnuniyetsizliği yaratır. Kargo entegrasyonlarınızı tamamlayarak barkod basım ve paketleme süreçlerini minimum süreye indirin.

**4. Müşteri Sorularına Hızlı ve Yapıcı Dönüş Sağlayın**
Pazaryerlerinde sorulan müşteri sorularına verilen yanıt hızı mağaza puanı hesaplamasında önemli bir etkendir. Soruları en geç 30 dakika içinde, çözüm odaklı ve kibar bir dille yanıtlayın.`
  },
  {
    id: 6,
    category: 'design',
    title: "CRO (Dönüşüm Oranı Optimizasyonu): Sitenizi Satış Makinesine Dönüştürmek",
    excerpt: "Sitenize binlerce ziyaretçi çekmenize rağmen satışlarınızın düşük kalmasının nedenleri ve kullanıcı deneyimi (UX) dokunuşlarıyla ciroyu artırma formülleri.",
    date: "22 Mayıs 2026",
    readTime: "5 dk okuma",
    author: "Deniz Soykan",
    content: `Çoğu marka, sitelerine trafik çekmek için Google ve Instagram reklamlarına büyük bütçeler harcar. Ancak siteye gelen 100 kişiden sadece 1'i satın alma yapıyorsa, reklam bütçenizin büyük kısmı boşa gidiyor demektir. Sitenizin tasarımını ve kullanıcı deneyimini (UX) optimize ederek bu oranı %2 veya %3'e çıkarmak, bütçeyi artırmadan cironuzu 2-3 katına çıkarmanın en ucuz yoludur.

Sitenizin dönüşüm oranını (CRO) artıracak kritik tasarım iyileştirmeleri:

**1. Mobil Öncelikli (Mobile-First) Tasarım**
E-ticaret trafiğinin %85'ten fazlası akıllı telefonlardan gelmektedir. Sitenizin mobil sürümünde menülerin başparmakla kolayca ulaşılabilecek alanlarda ("thumb-zone") olduğundan, butonların tıklanabilecek büyüklükte (en az 48px) olduğundan emin olun.

**2. Ödeme (Checkout) Adımlarını Minimuma İndirin**
Ziyaretçiyi satın alma kararı vermeden önce onlarca form alanı doldurmaya zorlamayın. Üye olmadan (misafir alışverişi) satın alma seçeneği sunun. Adres bilgilerini otomatik tamamlayan API'lar kullanarak süreci hızlandırın.

**3. Core Web Vitals (Sayfa Yüklenme Hızı) İyileştirmesi Yapın**
Açılması 3 saniyeden uzun süren bir mobil site, ziyaretçilerinin %40'ını açılmadan kaybeder. Resimleri WebP formatına dönüştürün, kullanılmayan scriptleri erteleyin ve sunucu yanıt sürenizi optimize edin.

**4. Güven Unsurlarını (Social Proof) Öne Çıkarın**
Kullanıcılar bilmedikleri bir siteden alışveriş yaparken çekinirler. Ürün sayfalarında gerçek müşteri yorumlarını, puanlarını, SSL güvenlik sertifikalarını ve kolay iade/değişim garantilerini net bir şekilde gösterin.`
  }
];

export const categories = [
  { key: 'all', label: 'Hepsi', icon: 'fa-solid fa-list' },
  { key: 'google', label: 'Google Ads', icon: 'fa-brands fa-google' },
  { key: 'meta', label: 'Meta Ads', icon: 'fa-brands fa-meta' },
  { key: 'seo', label: 'SEO & İçerik', icon: 'fa-solid fa-magnifying-glass' },
  { key: 'social', label: 'Sosyal Medya', icon: 'fa-solid fa-hashtag' },
  { key: 'ecommerce', label: 'E-Ticaret', icon: 'fa-solid fa-cart-shopping' },
  { key: 'design', label: 'Web Tasarım', icon: 'fa-solid fa-laptop-code' }
];

export const whyAgencyData = [
  {
    icon: "fa-users-gear",
    title: "Kolektif Uzmanlık Aklı",
    text: "Dijital pazarlama çok yönlüdür. SEO, Google/Meta reklamları, sosyal medya ve tasarım konularında tek bir kişinin uzman olması imkansızdır. Ajans Rota'da her alanın kendi uzmanı vardır. Tek kişi maliyetine, 3 dijital pazarlama uzmanı, 2 grafiker, 1 videographer, 2 SEO uzmanı ve 2 sosyal medya yöneticisinden oluşan 360 derece bir ekiple çalışırsınız."
  },
  {
    icon: "fa-calculator-combined",
    title: "Sıfır Bütçe İsrafı ve Tecrübe",
    text: "Reklam panelleri sürekli güncelleniyor ve değişiyor. Kendi başınıza yapacağınız deneme-yanılmalar size ciddi bütçe kayıplarına mal olur. Biz, İzmir ve Ege genelinde onlarca farklı sektörden edindiğimiz reklam tecrübesiyle, bütçenizi deneme tahtası yapmıyoruz. Nelerin dönüşüm getireceğini bilerek doğrudan ciro odaklı adımlar atıyoruz."
  },
  {
    icon: "fa-laptop-code",
    title: "Premium Yazılım ve Araç Tasarrufu",
    text: "Profesyonel SEO analiz araçları, anahtar kelime bulucular, grafik tasarım programları ve raporlama yazılımlarının aylık lisans bedelleri tek bir marka için oldukça yüksektir. Ajans Rota bünyesinde kullandığımız tüm premium sektörel araçları ek bir lisans ücreti ödemeden markanızın hizmetine sunarak bütçenizden tasarruf ettiriyoruz."
  },
  {
    icon: "fa-receipt",
    title: "Kemeraltı Esnafı Şeffaflığı",
    text: "Bizde 'reklamlar yayında ama neden satış olmuyor?' sorusu cevapsız kalmaz. Kemeraltı esnafı bir aileden gelen kurucumuz, reklam bütçenizin her kuruşunu kendi parası gibi korur ve hesabını sorar. İki haftalık veya aylık periyotlarla hazırladığımız şeffaf raporlarla, bütçenizin tam olarak hangi dönüşümleri getirdiğini net bir şekilde görürsünüz."
  }
];

export const testimonials = [
    // 1. Google Ads (id: 1 - 9)
    {
      id: 1,
      name: 'Mustafa Çelik',
      company: 'Ege Zeytin Evi',
      role: 'Kurucu',
      category: 'google-ads',
      rating: 5,
      quote: 'Urla\'dan soğuk sıkım zeytinyağlarımızı tüm Türkiye\'ye ulaştırmak için Google Ads PMax bütçemizi optimize ettik. ROAS değerimiz 2.5x\'ten 8.4x seviyesine yükseldi, siparişlere yetişmekte zorlanıyoruz.',
      metric: '8.4x ROAS / PMax',
      initials: 'MÇ'
    },
    {
      id: 2,
      name: 'Hakan Demir',
      company: 'İzmir Endüstriyel Parça',
      role: 'Genel Müdür Yrd.',
      category: 'google-ads',
      rating: 5,
      quote: 'Avrupa imalat pazarına açılmak istiyorduk. Çiğli AOSB\'deki tesisimiz için kurguladığımız B2B ihracat kampanyaları ile Almanya ve İtalya\'dan gelen nitelikli form sayısı %180 arttı.',
      metric: '+180% Lead / B2B Export',
      initials: 'HD'
    },
    {
      id: 3,
      name: 'Cemil Öztürk',
      company: 'Ege Lift Asansör',
      role: 'Pazarlama Müdürü',
      category: 'google-ads',
      rating: 5,
      quote: 'Asansör kiralama ve B2B satış aramalarında boşa giden bütçeyi kurtardık. Ajans Rota ile sadece fabrika ve şantiyelerden gelen kurumsal çağrılara odaklandık. Reklam bütçemiz %40 optimize oldu.',
      metric: '-40% Boşa Giden Bütçe',
      initials: 'CÖ'
    },
    {
      id: 4,
      name: 'Dr. Melis Güler',
      company: 'Smyrna Dental',
      role: 'Kurucu Hekim',
      category: 'google-ads',
      rating: 5,
      quote: 'İngiltere\'den implant ve gülüş tasarımı hastası çekmek için Google Arama kampanyaları tasarladık. Hedefli reklamlarla Alsancak kliniğimize gelen yabancı hasta formu maliyetini %35 düşürdük.',
      metric: '-35% CPL / Sağlık Turizmi',
      initials: 'MG'
    },
    {
      id: 5,
      name: 'Selim Koral',
      company: 'Urla Şarapçılık Turları',
      role: 'Kurucu',
      category: 'google-ads',
      rating: 5,
      quote: 'Urla bağ yolu turlarımıza hafta içi katılımı artırmak için İzmir ve çevre illere yönelik lokal Google Ads kampanyaları açtık. Rezervasyonlerimiz ve turlarımız hafta içi %120 artış gösterdi.',
      metric: '+120% Hafta İçi Rezervasyon',
      initials: 'SK'
    },
    {
      id: 6,
      name: 'Ahmet Karadayı',
      company: 'Kemeraltı Baharatçısı',
      role: 'Sahibi',
      category: 'google-ads',
      rating: 5,
      quote: 'Tarihi Kemeraltı çarşısındaki dükkanımızın e-ticaret sitesine geçişinde Google Alışveriş reklamlarını kullandık. Aylık sipariş sayımız 400\'den 2.800\'e fırladı. Ege baharatlarını tüm Türkiye sipariş ediyor.',
      metric: '+600% Online Sipariş',
      initials: 'AK'
    },
    {
      id: 7,
      name: 'Orhan Yılmaz',
      company: 'Ege Solar Enerji',
      role: 'Genel Müdür',
      category: 'google-ads',
      rating: 5,
      quote: 'Fabrika çatılarına GES kurulumu için yürüttüğümüz Google Ads kampanyalarında hedef kitleyi tamamen sanayi bölgeleriyle sınırladık. Gelen teklif taleplerinin satışa dönüşüm oranı %12\'ye ulaştı.',
      metric: '%12 Satış Dönüşüm Oranı',
      initials: 'OY'
    },
    {
      id: 8,
      name: 'Aslı Bulut',
      company: 'Karşıyaka Dil Okulu',
      role: 'Kurum Müdürü',
      category: 'google-ads',
      rating: 5,
      quote: 'Karşıyaka şubemiz için yeni dönem kayıtlarında arama ağı reklamları kullandık. Doğru hedefleme ile bütçeyi aşmadan tüm kontenjanımızı 3 haftada doldurduk. Dönüşüm maliyetlerimiz harika.',
      metric: 'Full Kontenjan / 3 Hafta',
      initials: 'AB'
    },
    {
      id: 9,
      name: 'Levent Güneş',
      company: 'Kuşadası Yat Kiralama',
      role: 'Yönetici',
      category: 'google-ads',
      rating: 5,
      quote: 'Mavi tur ve özel yat kiralama kelimelerindeki gereksiz aramaları negatifleyerek sadece lüks segment müşterilere eriştik. Sezon boyu teknelerimizin doluluk oranını %95\'e çıkardık.',
      metric: '%95 Tekne Doluluk Oranı',
      initials: 'LG'
    },

    // 2. Meta Ads (id: 10 - 18)
    {
      id: 10,
      name: 'Derin Yılmaz',
      company: 'Bodrum Sandalet',
      role: 'Pazarlama Müdürü',
      category: 'meta-ads',
      rating: 5,
      quote: 'Meta reklamlarındaki kreatif testler ve dinamik hedef kitle kurgularıyla satışlarımız rekor kırdı. Begonvil esintili görsel şablonları tam kitlemize ulaştı. 2.4 kat ciro artışı yakaladık.',
      metric: '+240% Satış / Meta Ads',
      initials: 'DY'
    },
    {
      id: 11,
      name: 'Murat Efe',
      company: 'Alaçatı Concept',
      role: 'E-Ticaret Direktörü',
      category: 'meta-ads',
      rating: 5,
      quote: 'Özellikle Instagram katalog ve dinamik reklamlarını sitemizle entegre ederek harika çalışan dönüşüm hunileri kurdular. Sepette kalan müşteriyi geri kazanma oranımız %32 arttı.',
      metric: '-45% Sepet Terk Oranı',
      initials: 'ME'
    },
    {
      id: 12,
      name: 'Berna Tan',
      company: 'Smyrna Gümüş Tasarım',
      role: 'Tasarımcı & Kurucu',
      category: 'meta-ads',
      rating: 5,
      quote: 'Kendi tasarladığım gümüş takıları Instagram\'da satarken \'Gönderiyi Öne Çıkar\' tuşuyla bütçemi tüketiyordum. Rota ekibi profesyonel Meta hunisi kurdu, ilk ayda 5.6x ROAS ile satış yapmaya başladık.',
      metric: '5.6x ROAS / Takı E-Ticaret',
      initials: 'BT'
    },
    {
      id: 13,
      name: 'Halil Efe',
      company: 'Çeşme Butik Zeytinyağı',
      role: 'Kurucu',
      category: 'meta-ads',
      rating: 5,
      quote: 'Zeytinliklerimizden elde ettiğimiz butik yağları Instagram Reels reklamlarında hikayeleştirerek sattık. Ürünümüzün lezzetini ve doğallığını anlatan videolarla sitemize günlük sipariş akışı sağladık.',
      metric: '4.2x ROAS / Gıda',
      initials: 'HE'
    },
    {
      id: 14,
      name: 'Göksu Acar',
      company: 'Urla Seramik Atölyesi',
      role: 'Tasarımcı',
      category: 'meta-ads',
      rating: 5,
      quote: 'Hafta sonu seramik atölyelerimize katılımcı bulmak için Urla ve Karşıyaka bölgesini hedefleyen Instagram mesaj reklamları kullandık. DM kutumuz dolup taştı, kayıtlarımız bir ay önceden doluyor.',
      metric: '+210% Atölye Katılımı',
      initials: 'GA'
    },
    {
      id: 15,
      name: 'Yiğit Soylu',
      company: 'Ege Gurme Sosları',
      role: 'Kurucu',
      category: 'meta-ads',
      rating: 5,
      quote: 'Yeni geliştirdiğimiz Ege otlu sosları tanıtmak için Instagram ve TikTok video reklamlarına yüklendik. Sosyal medyada yarattığımız talep sayesinde 3 büyük yerel market zinciri rafına girmeyi başardık.',
      metric: '3 Market Zincirinde Raf',
      initials: 'YS'
    },
    {
      id: 16,
      name: 'Leyla Demirci',
      company: 'İzmir Wedding House',
      role: 'Yaratıcı Yönetmen',
      category: 'meta-ads',
      rating: 5,
      quote: 'Çankaya\'daki gelinlik mağazamız için randevu almakta zorlanıyorduk. Instagram üzerinde hazırladığımız \'Hayalindeki Gelinlik\' soru-cevap reklamlarıyla haftalık randevu sayımızı 8\'den 34\'e çıkardık.',
      metric: '+325% Gelinlik Randevusu',
      initials: 'LD'
    },
    {
      id: 17,
      name: 'Nazlı Hilal',
      company: 'Alaçatı Boho Style',
      role: 'Kurucu',
      category: 'meta-ads',
      rating: 5,
      quote: 'Keten elbise koleksiyonumuzun Meta reklamlarında beden uyumunu anlatan kısa videolar kullandık. Bu sayede hem sipariş adedimiz %180 arttı hem de beden hatası kaynaklı iade oranımız %65 azaldı.',
      metric: '-65% İade Oranı',
      initials: 'NH'
    },
    {
      id: 18,
      name: 'Turgut Arslan',
      company: 'Mavi Ege Gayrimenkul',
      role: 'Broker',
      category: 'meta-ads',
      rating: 5,
      quote: 'Urla\'da inşa ettiğimiz lüks villaların satışı için Facebook Form Reklamları kurduk. Formlardaki ön eleme soruları sayesinde gereksiz aramaları eledik, 3 ayda 4 adet villa satışını bu kampanyalarla kapattık.',
      metric: '4 Villa Satışı / Meta Leads',
      initials: 'TA'
    },

    // 3. SEO & Organik Büyüme (id: 19 - 27)
    {
      id: 19,
      name: 'Ayla Karaca',
      company: 'Smyrna Figs',
      role: 'İhracat Müdürü',
      category: 'seo',
      rating: 5,
      quote: 'İngilizce ve Almanca dillerinde yaptığımız teknik SEO çalışmaları ile yurt dışı organik trafiğimize ivme kazandırdık. Google organik aramalarında 45 kritik kelimede ilk 3 sıradayız, ihracat talepleri yağıyor.',
      metric: '+310% Organik Trafik',
      initials: 'AK'
    },
    {
      id: 20,
      name: 'Canan Şen',
      company: 'Urla Bağ Evleri',
      role: 'Genel Müdür',
      category: 'seo',
      rating: 5,
      quote: 'İzmir çevresinden butik otel ve tadım turları arayan kişilere Google Haritalar ve lokal SEO çalışmalarıyla ulaştık. Haritalardan gelen telefon aramalarımız ve komisyonsuz rezervasyonlarımız katlandı.',
      metric: '+150% Harita Araması',
      initials: 'CŞ'
    },
    {
      id: 21,
      name: 'Dt. Ömer Karasulu',
      company: 'Ege Diş Polikliniği',
      role: 'Başhekim',
      category: 'seo',
      rating: 5,
      quote: 'Diş eti tedavisi, implant gibi uzmanlık gerektiren konularda hazırladığımız rehber içerikler Google\'da üst sıraya yerleşti. Bornova kliniğimize her ay sadece blog yazılarımızdan 40\'ın üzerinde hasta başvuruyor.',
      metric: '40+ Yeni Hasta / Ay',
      initials: 'ÖK'
    },
    {
      id: 22,
      name: 'Berkay Yalçın',
      company: 'Çeşme Transfer Acentesi',
      role: 'Operasyon Müdürü',
      category: 'seo',
      rating: 5,
      quote: '\'Çeşme VIP transfer\' ve \'İzmir Havalimanı transfer\' kelimelerinde Google aramalarında ilk 3 sıraya yerleştik. Yaz sezonunda tık başına 40 TL reklam ücreti ödemekten kurtulduk, rezervasyonlar organik geliyor.',
      metric: '0 TL Reklam Maliyeti',
      initials: 'BY'
    },
    {
      id: 23,
      name: 'Hande Talu',
      company: 'Kozmetik E-Ticaret',
      role: 'Pazarlama Direktörü',
      category: 'seo',
      rating: 5,
      quote: 'Google güncellemesi sonrası organik trafiğimiz yarı yarıya düşmüştü. Rota ekibinin yaptığı E-E-A-T denetimi ve kategori optimizasyonu sayesinde trafiği geri kazanmakla kalmadık, eski zirvemizi %80 aştık.',
      metric: '+80% Trafik Kurtarma',
      initials: 'HT'
    },
    {
      id: 24,
      name: 'Bülent Tekin',
      company: 'Ege Karavan İmalat',
      role: 'Kurucu',
      category: 'seo',
      rating: 5,
      quote: 'Karavan almayı düşünenlerin arattığı \'çekme karavan limitleri\' gibi 30\'dan fazla rehber kelimede Google\'da 1. sıraya oturduk. Gaziemir\'deki atölyemize gelen siparişlerin %60\'ı bu organik yazılardan doğuyor.',
      metric: '%60 Organik Kaynaklı Satış',
      initials: 'BT'
    },
    {
      id: 25,
      name: 'Av. Serkan Aydın',
      company: 'İzmir Hukuk Bürosu',
      role: 'Ortak Avukat',
      category: 'seo',
      rating: 5,
      quote: 'Bayraklı\'da ticaret hukuku ve şirket danışmanlığı üzerine aramalarda yerel SEO sayesinde görünürlüğümüzü artırdık. Web sitemiz üzerinden gelen kurumsal danışmanlık talepleri aylık bazda %140 artış gösterdi.',
      metric: '+140% Kurumsal Talep',
      initials: 'SA'
    },
    {
      id: 26,
      name: 'Nuri Yıldız',
      company: 'Kemalpaşa B2B Makine',
      role: 'Yönetim Kurulu Üyesi',
      category: 'seo',
      rating: 5,
      quote: 'Kemalpaşa OSB\'deki gıda paketleme makinelerimizi dünya pazarına sunmak için \'industrial packaging machines Turkey\' aramasında Google ilk sayfaya çıktık. İlk büyük ihracat siparişimizi bu organik kanalla aldık.',
      metric: '$120k İhracat Siparişi',
      initials: 'NY'
    },
    {
      id: 27,
      name: 'Ceyda Soylu',
      company: 'Bodrum Luxury Villa',
      role: 'Satış Direktörü',
      category: 'seo',
      rating: 5,
      quote: 'Büyük ilan siteleri arasında kaybolmuştuk. Ajans Rota\'nın \'Bodrum lüks taş ev\' ve \'Yalıkavak deniz manzaralı villa\' aramalarında yaptığı niş SEO ile sitemize gelen yabancı yatırımcı sayısını 3 katına çıkardık.',
      metric: '3x Yabancı Yatırımcı',
      initials: 'CS'
    },

    // 4. Sosyal Medya Yönetimi (id: 28 - 36)
    {
      id: 28,
      name: 'Pelin Eser',
      company: 'Urla Zeytinliği Restoran',
      role: 'İşletmeci',
      category: 'social-media',
      rating: 5,
      quote: 'Urla\'daki gastronomik restoranımızın Instagram hesabını tamamen estetik ve hikaye odaklı yönettiler. Reels videolarımızın izlenme oranları ortalama 40 bine ulaştı, rezervasyon masalarımız haftalar öncesinden doluyor.',
      metric: '+250% Rezervasyon Talebi',
      initials: 'PE'
    },
    {
      id: 29,
      name: 'Merve Güngör',
      company: 'Bornova Butik Çiçek',
      role: 'Kurucu',
      category: 'social-media',
      rating: 5,
      quote: 'Çiçek aranjmanı hazırlarken çektiğimiz samimi Reels videoları sayesinde Karşıyaka ve Bornova\'dan yüzlerce yeni takipçi kazandık. Sosyal medyayı aktif yönetmeye başladıktan sonra dükkan ciromuz %80 arttı.',
      metric: '+80% Dükkan Cirosu',
      initials: 'MG'
    },
    {
      id: 30,
      name: 'Alperen Can',
      company: 'Ege Mimarlık Ofisi',
      role: 'Kurucu Mimar',
      category: 'social-media',
      rating: 5,
      quote: 'Alsancak\'taki ofisimizde tamamladığımız restorasyon ve modern daire projelerinin öncesi/sonrası videolarını paylaştık. Instagram\'dan gelen mesajlarla İzmir genelinde 5 büyük villa dekorasyon projesi imzaladık.',
      metric: '5 Yeni Villa Projesi',
      initials: 'AC'
    },
    {
      id: 31,
      name: 'Kaya Alp',
      company: 'Smyrna Coffee Co.',
      role: 'Kurucu',
      category: 'social-media',
      rating: 5,
      quote: 'Alsancak ve Bornova şubelerimiz için hazırlanan dinamik Reels içerikleri ve kahve demleme videoları genç kitlede viral etki yarattı. Kafelerimizdeki hafta sonu trafiğini %45 oranında artırmayı başardık.',
      metric: '+45% Kafe Trafiği',
      initials: 'KA'
    },
    {
      id: 32,
      name: 'Deniz Yılmaz',
      company: 'Urla Yoga Evi',
      role: 'Yoga Eğitmeni',
      category: 'social-media',
      rating: 5,
      quote: 'Urla\'daki yoga ve meditasyon kampımızın tanıtımı için hazırlanan huzur dolu Reels videoları binlerce kişiye ulaştı. 3 günlük kamp kontenjanımızı açtıktan sonra 2 saat içinde tamamen doldurmayı başardık.',
      metric: '2 Saatte Full Kayıt',
      initials: 'DY'
    },
    {
      id: 33,
      name: 'Figen Çelik',
      company: 'Ege Çocuk Akademi',
      role: 'Kurucu Müdür',
      category: 'social-media',
      rating: 5,
      quote: 'Velilerin çocuk gelişimiyle ilgili merak ettiği soruları yanıtladığımız mini video serileri Mavişehir ve Bostanlı\'da büyük ilgi gördü. Yeni dönem kayıt hedeflerimize %100 organik olarak ulaştık.',
      metric: '%100 Kayıt Doluluğu',
      initials: 'FÇ'
    },
    {
      id: 34,
      name: 'Tuğba Yıldız',
      company: 'İzmir Vintage Butik',
      role: 'Sahibi',
      category: 'social-media',
      rating: 5,
      quote: 'Kıyafet kombinlerimizi eğlenceli ve hızlı geçişli videolarla sunduk. Alsancak\'taki mağazamıza sadece Instagram\'dan görerek gelen müşteri sayımız katlanırken, online siparişlerimiz de tavan yaptı.',
      metric: '3.5x Instagram Siparişleri',
      initials: 'TY'
    },
    {
      id: 35,
      name: 'Dt. Aylin Mert',
      company: 'Ege Dental Estetik',
      role: 'Ortak Hekim',
      category: 'social-media',
      rating: 5,
      quote: 'Gülüş tasarımı tedavisi olan hastalarımızın değişim videolarını paylaştığımız günden beri DM kutumuz hiç boş kalmıyor. Sosyal medyanın samimi dili hastalarımızla aramızdaki güveni çok hızlı kurdu.',
      metric: '+190% DM Soru Talebi',
      initials: 'AM'
    },
    {
      id: 36,
      name: 'Kerem Arslan',
      company: 'Urla Gurme Peynirci',
      role: 'Kurucu',
      category: 'social-media',
      rating: 5,
      quote: 'Şarküteri tabakları hazırlama videolarımız ve zeytin hasadı paylaşımlarımız o kadar çok paylaşıldı ki, Türkiye\'nin dört bir yanından kargo ile yöresel peynir siparişleri almaya başladık.',
      metric: '+220% Online Sipariş',
      initials: 'KA'
    },

    // 5. E-Ticaret & Pazaryeri Yönetimi (id: 37 - 45)
    {
      id: 37,
      name: 'Volkan Can',
      company: 'Ege Deri Tasarım',
      role: 'Kurucu',
      category: 'ecommerce',
      rating: 5,
      quote: 'Trendyol ve Hepsiburada mağazalarımızın optimizasyonu ve entegrasyonu sayesinde aylık sipariş adetlerimiz 3 katına çıktı. Shopify sitemizle pazaryeri entegrasyonumuz kusursuz çalışıyor.',
      metric: '3x Sipariş / Pazaryeri',
      initials: 'VC'
    },
    {
      id: 38,
      name: 'Selin Şahin',
      company: 'Alaçatı Butik Kozmetik',
      role: 'Pazarlama Yöneticisi',
      category: 'ecommerce',
      rating: 5,
      quote: 'Shopify sitemizin sıfırdan kurulumu ve e-ticaret danışmanlığı ile satış kanallarımızı tek bir ekrandan yönetmeye başladık. Shopify sitemizle reklamlarla destekleyerek ciro hedeflerimize 6 ay erken ulaştık.',
      metric: '+180% Shopify Cirosu',
      initials: 'SŞ'
    },
    {
      id: 39,
      name: 'Emel Kurt',
      company: 'Ege Organik Pamuk',
      role: 'Kurucu',
      category: 'ecommerce',
      rating: 5,
      quote: 'Trendyol\'da fiyat odaklı rekabetin arasından markalaşarak sıyrıldık. Ajans Rota\'nın yaptığı mağaza tasarımı ve sepet kampanyaları ile Trendyol bebek kategorisinde en çok satan ilk 10 mağaza arasına girdik.',
      metric: 'Top 10 Trendyol Mağazası',
      initials: 'EK'
    },
    {
      id: 40,
      name: 'Tarık Koç',
      company: 'Smyrna Kahve Değirmeni',
      role: 'E-Ticaret Sorumlusu',
      category: 'ecommerce',
      rating: 5,
      quote: 'Kemalpaşa\'da ürettiğimiz ahşap el değirmenlerini Amazon Amerika ve Avrupa depolarına gönderdik. Listeleme hatalarını ve gümrük entegrasyonlarını Rota ile çözerek döviz kazanan bir marka olduk.',
      metric: '$45k Aylık Amazon İhracatı',
      initials: 'TK'
    },
    {
      id: 41,
      name: 'Ferit Kaya',
      company: 'Urla Soğuk Sıkım',
      role: 'Yönetici',
      category: 'ecommerce',
      rating: 5,
      quote: '3 farklı pazaryeri ile Woocommerce sitemiz arasındaki stok entegrasyonu kabusumuzdu. Stok senkronizasyonunu kurdular ve ilanlarımızı optimize ettiler. Artık sipariş iptali veya stok hatası yaşamıyoruz.',
      metric: '%0 Stok Senkronizasyon Hatası',
      initials: 'FK'
    },
    {
      id: 42,
      name: 'Şahin Mert',
      company: 'Ege Ayakkabı Dünyası',
      role: 'Genel Müdür',
      category: 'ecommerce',
      rating: 5,
      quote: 'Çamdibi\'ndeki ayakkabı üretim atölyemizin stok fazlasını Trendyol\'da eritmeyi başardık. Pazaryeri reklam yönetimi ve flaş ürün kampanyaları ile 3 ayda 12.000 çift ayakkabı satışı gerçekleştirdik.',
      metric: '12.000+ Çift Satış / 3 Ay',
      initials: 'ŞM'
    },
    {
      id: 43,
      name: 'Cansu Güler',
      company: 'Bodrum Tasarım Evi',
      role: 'Kurucu & Tasarımcı',
      category: 'ecommerce',
      rating: 5,
      quote: 'Etsy mağazamızın yanına Shopify sitemizi kurarak kendi müşteri kitlemizi oluşturduk. Rota\'nın e-ticaret danışmanlığı ile komisyonsuz satış yapmanın keyfini çıkarıyoruz. Aylık Shopify ciromuz 600 bin TL\'yi geçti.',
      metric: '600k+ ₺ Aylık Shopify Cirosu',
      initials: 'CG'
    },
    {
      id: 44,
      name: 'Rıfat Şen',
      company: 'Kemeraltı Çeyiz E-Ticaret',
      role: 'Yönetici',
      category: 'ecommerce',
      rating: 5,
      quote: 'Pazaryerlerinde kargo maliyetleri kârımızı eritiyordu. Ajans Rota\'nın geliştirdiği \'Birlikte Al\' kombinleri ve sepet barajı stratejileri ile ortalama sepet büyüklüğümüzü %110 oranında artırdık.',
      metric: '+110% Sepet Büyüklüğü',
      initials: 'RŞ'
    },
    {
      id: 45,
      name: 'Nihat Özkan',
      company: 'Smyrna Kuruyemiş',
      role: 'E-Ticaret Yöneticisi',
      category: 'ecommerce',
      rating: 5,
      quote: 'Taze kuruyemişlerimizi hızlı kargo entegrasyonuyla pazaryerlerinde satışa sunduk. Kargo teslim süremiz 1 güne indi, bu da müşteri memnuniyeti puanımızı 9.8\'e çıkardı ve satışlarımızı tetikledi.',
      metric: '9.8/10 Mağaza Puanı',
      initials: 'NÖ'
    },

    // 6. Dönüşüm Odaklı Web Tasarım (id: 46 - 54)
    {
      id: 46,
      name: 'Dr. Hakan B.',
      company: 'Dr. Hakan B. Klinik',
      role: 'Kurucu & Başhekim',
      category: 'web-design',
      rating: 5,
      quote: 'Yeni web sitemiz açıldıktan sonra gelen randevu formlarında çok ciddi bir artış oldu. Mobil uyumu harika ve randevu alma süresi çok kısaldı. Sayfa açılış hızı 3.8s\'den 0.8s\'ye çekildi.',
      metric: '0.8s Yüklenme / +120% Form',
      initials: 'HB'
    },
    {
      id: 47,
      name: 'Burak Yıldırım',
      company: 'Ege Yat Çarter',
      role: 'Kurucu',
      category: 'web-design',
      rating: 5,
      quote: 'Göcek\'teki lüks yat filomuz için yaptırdığımız özel web tasarımı markamızın kalitesini tam yansıttı. Yat detay sayfalarındaki rezervasyon motoru sayesinde site üzerinden gelen nitelikli kiralama talepleri %150 arttı.',
      metric: '+150% VIP Talep Artışı',
      initials: 'BY'
    },
    {
      id: 48,
      name: 'Av. Caner Şen',
      company: 'Smyrna Hukuk & Danışmanlık',
      role: 'Kurucu Ortak',
      category: 'web-design',
      rating: 5,
      quote: 'Bayraklı\'daki hukuk büromuz için tasarlanan modern ve profesyonel kurumsal web sitesi müvekkillerimiz nezdinde büyük güven yarattı. Sitenin mobil uyumu ve hızı mükemmel.',
      metric: '%100 Mobil Uyum Skoru',
      initials: 'CŞ'
    },
    {
      id: 49,
      name: 'Aylin Güneş',
      company: 'Çeşme Butik Oteller Derneği',
      role: 'Genel Sekreter',
      category: 'web-design',
      rating: 5,
      quote: 'Çeşme\'deki üye otellerimizi tanıttığımız web portalımızı baştan aşağı yenilediler. Sayfa geçişleri o kadar hızlı ki, ziyaretçilerin sitede kalma süresi ortalama 1.5 dakikadan 4.2 dakikaya yükseldi.',
      metric: '4.2 Dk Sitede Kalma Süresi',
      initials: 'AG'
    },
    {
      id: 50,
      name: 'Ahmet Çelik',
      company: 'Kemalpaşa Döküm Sanayi',
      role: 'Yönetim Kurulu Üyesi',
      category: 'web-design',
      rating: 5,
      quote: 'Kemalpaşa\'daki metal döküm fabrikamız için hazırlanan çok dilli B2B web sitesi sayesinde katalog ve teknik belgelerimizi yabancı müşteriler saniyeler içinde indirebiliyor. İhracat prestijimiz arttı.',
      metric: '+90% Hızlı Belge İndirme',
      initials: 'AÇ'
    },
    {
      id: 51,
      name: 'Vedat Yalçın',
      company: 'Ege Prefabrik Ev',
      role: 'Genel Müdür',
      category: 'web-design',
      rating: 5,
      quote: 'Torbalı\'daki fabrikamız için tasarlanan web sitesine entegre edilen \'Ev Fiyatı Hesaplama Modülü\' tam bir satış makinesine dönüştü. Siteden gelen sıcak telefon aramaları haftalık bazda %200 arttı.',
      metric: '+200% Sıcak Arama Artışı',
      initials: 'VY'
    },
    {
      id: 52,
      name: 'Sibel Karaca',
      company: 'Urla Gastronomi Okulu',
      role: 'Eğitim Direktörü',
      category: 'web-design',
      rating: 5,
      quote: 'Mutfak atölyelerimizin programını ve bilet satışlarını tek bir ekranda birleştiren harika bir site tasarladılar. Kurs kayıtlarımızı artık sıfır manuel iş yüküyle tamamen online alıyoruz.',
      metric: '%100 Online Kayıt Otomasyonu',
      initials: 'SK'
    },
    {
      id: 53,
      name: 'Murat Demir',
      company: 'İzmir Lojistik A.Ş.',
      role: 'Lojistik Müdürü',
      category: 'web-design',
      rating: 5,
      quote: 'Gaziemir merkezli nakliye firmamız için hazırlanan yeni web sitesiyle teklif sürecini dijitalleştirdik. Müşterilerimiz tek tıkla yük detaylarını girip fiyat alabiliyor. İş takibimiz %50 hızlandı.',
      metric: '%50 Hızlı Teklif Süreci',
      initials: 'MD'
    },
    {
      id: 54,
      name: 'Dr. Nazlı Can',
      company: 'Smyrna Dental Klinik',
      role: 'Kurucu Ortak',
      category: 'web-design',
      rating: 5,
      quote: 'Alsancak\'taki kliniğimizin İngilizce, Almanca ve Fransızca web tasarımını baştan yaptırdık. Yurt dışı reklamlarımızın ulaştığı bu site, sayfa hızı ve şık tasarımıyla hasta dönüşümümüzü ikiye katladı.',
      metric: '2x Yabancı Hasta Dönüşümü',
      initials: 'NC'
    }
  ]


export const initialAcademyCourses = [
  {
    id: 'beginner',
    title: "Dijital Pazarlamaya Giriş",
    level: "Başlangıç Seviyesi",
    price: "₺4.500",
    icon: "fa-solid fa-seedling",
    color: "#10b981", 
    duration: "4 Hafta / 16 Saat",
    targetAudience: "Sıfırdan dijital pazarlamaya adım atmak isteyenler ve yeni girişimciler.",
    features: [
      "Meta & Google Ads Arayüz Eğitimi",
      "Sosyal Medya Yönetimi Temelleri",
      "Kampanya Kurgulama Mantığı",
      "Temel Hedef Kitle Belirleme",
      "Eğitmen Destekli Soru-Cevap Grubu"
    ],
    syllabus: [
      { week: "Hafta 1", title: "Dijital Ekosisteme Giriş & Sosyal Medya Temelleri" },
      { week: "Hafta 2", title: "Meta Business Manager Kurulumu ve Arayüz" },
      { week: "Hafta 3", title: "Google Ads Arama Ağı (Search) Kampanyaları" },
      { week: "Hafta 4", title: "İlk Reklamımızı Çıkıyoruz & Raporlama" }
    ]
  },
  {
    id: 'intermediate',
    title: "Growth & E-Ticaret Dönüşüm",
    level: "Orta Seviye",
    price: "₺8.900",
    icon: "fa-solid fa-rocket",
    color: "var(--primary)", 
    duration: "6 Hafta / 30 Saat",
    targetAudience: "Temel reklam bilgisine sahip, satışlarını katlamak isteyen işletme sahipleri ve uzman adayları.",
    popular: true,
    features: [
      "İleri Düzey Meta & Google Ads Stratejileri",
      "Yeniden Pazarlama (Retargeting) Kurguları",
      "Dönüşüm Oranı Optimizasyonu (CRO)",
      "A/B Testleri ve Bütçe Yönetimi",
      "Sertifika & 1 Ay Birebir Mentörlük"
    ],
    syllabus: [
      { week: "Hafta 1-2", title: "İleri Düzey Meta (DPA, Lookalike, Custom Audiences)" },
      { week: "Hafta 3", title: "Google Performance Max (PMax) ve Shopping" },
      { week: "Hafta 4", title: "CRO: E-Ticarette Dönüşüm Artırma Taktikleri" },
      { week: "Hafta 5", title: "Dinamik Yeniden Pazarlama Hunileri" },
      { week: "Hafta 6", title: "Bütçe Ölçekleme (Scaling) ve ROAS Optimizasyonu" }
    ]
  },
  {
    id: 'master',
    title: "Ajans Eksperliği & Global Pazarlar",
    level: "Master Seviye",
    price: "₺18.500",
    icon: "fa-solid fa-crown",
    color: "#f59e0b", 
    duration: "8 Hafta / 40 Saat",
    targetAudience: "Kendi dijital ajansını kurmak isteyenler, global e-ihracat hedefleri olan vizyonerler.",
    features: [
      "Uluslararası E-İhracat (Amazon, Etsy, Shopify)",
      "Gelişmiş Veri Analitiği (GA4 & GTM Kurulumları)",
      "Sunucu Taraflı (Server-Side) Takip & CAPI",
      "Müşteri İlişkileri (Retention) Yönetimi",
      "Ömür Boyu Erişim & Ajans Kurulum Danışmanlığı"
    ],
    syllabus: [
      { week: "Hafta 1-2", title: "GTM ve GA4 ile İleri Düzey Veri Mimarisi" },
      { week: "Hafta 3", title: "Server-Side Tracking ve Conversion API" },
      { week: "Hafta 4-5", title: "E-İhracat: Yurt Dışı Pazar Yerleri & Global Reklam" },
      { week: "Hafta 6", title: "Müşteri Yaşam Boyu Değeri (LTV) ve Retention" },
      { week: "Hafta 7-8", title: "Ajans Süreçleri, Satış Kapama ve Kurumsallaşma" }
    ]
  }
];
