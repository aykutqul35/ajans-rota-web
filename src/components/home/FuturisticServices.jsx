import React from 'react';
import './FuturisticServices.css';

export default function FuturisticServices({ handleServiceClick }) {
  // Mapping the specific requested pods
  const pods = [
    {
      id: 'seo',
      key: 'seo', // Maps to the key in servicesData for routing
      title: 'SEO',
      desc: '3D yükselen bir grafik ve teknik kontrol noktaları.',
      icon: 'fa-solid fa-chart-line',
      cssClass: 'seo'
    },
    {
      id: 'meta',
      key: 'meta-ads',
      title: 'Meta Reklamları',
      desc: 'Gelişmiş veri ağı şeması içinde entegre reklam optimizasyonu.',
      icon: 'fa-brands fa-meta',
      cssClass: 'meta'
    },
    {
      id: 'web',
      key: 'web-design',
      title: 'Web Tasarım',
      desc: 'Minimalist ama sofistike web fikirleri arayüzü.',
      icon: 'fa-solid fa-wand-magic-sparkles',
      cssClass: 'web'
    },
    {
      id: 'google',
      key: 'google-ads',
      title: 'Google Ads',
      desc: 'Yüksek teknolojiye sahip, aydınlık performans yönetimi.',
      icon: 'fa-brands fa-google',
      cssClass: 'google'
    },
    {
      id: 'social',
      key: 'social-media',
      title: 'Sosyal Medya',
      desc: 'Dinamik strateji öğeleri ve veri akışları.',
      icon: 'fa-solid fa-hashtag',
      cssClass: 'social'
    },
    {
      id: 'ecom',
      key: 'ecommerce',
      title: 'E-Ticaret',
      desc: 'Modern 3D alışveriş sepeti ve anlık veri yolları.',
      icon: 'fa-solid fa-cart-shopping',
      cssClass: 'eticaret'
    }
  ];

  return (
    <section className="futuristic-services-container">
      <div className="container">
        <div className="fs-header">
          <span className="fs-tag">Deneyim Mühendisliği</span>
          <h2 className="fs-title">Dijital Ekosistem Podları</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Geleneksel sınırları aşan dinamik veri akışları ve holografik paneller ile 
            markanızın büyüme motorlarını fütüristik bir arayüzde kontrol edin.
          </p>
        </div>

        <div className="fs-ecosystem">
          {/* Orbital Rings */}
          <div className="fs-ring fs-ring-1"></div>
          <div className="fs-ring fs-ring-2"></div>

          {/* Center Core */}
          <div className="fs-core">
            <i className="fa-solid fa-compass fs-core-icon"></i>
            <span className="fs-core-text">AJANS ROTA</span>
          </div>

          {/* The 6 Pods */}
          {pods.map((pod, index) => (
            <div 
              key={pod.id} 
              className={`fs-pod ${pod.cssClass}`}
              onClick={() => handleServiceClick(pod.key)}
            >
              <div className="fs-pod-holo"></div>
              <div className="fs-icon-container">
                <i className={`fs-icon ${pod.icon}`}></i>
              </div>
              <h3 className="fs-pod-title">{pod.title}</h3>
              <p className="fs-pod-desc">{pod.desc}</p>
              <div className="fs-btn">
                <span>Detayları Gör & Planla</span>
                <i className="fa-solid fa-chevron-right text-[0.6rem]"></i>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
