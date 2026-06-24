import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // Dedicated About Page View Component
function AboutPageView({
  onBack,
  onNavToContact,
  settingsData
}) {
  return <div className="about-page-view container">
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">Hakkımızda</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">
          {settingsData?.about_title_top || "Biz Kimiz?"} <br />
          <span>{settingsData?.about_title_span || "Ege Sıcaklığı ve Dijital Performans"}</span>
        </h1>
        <p className="izmir-hero-desc">
          {settingsData?.about_desc || "Markalarımızı birer bütçe paneli olarak görmüyor; Ege toprağının bereketi ve samimiyetiyle, omuz omuza çalışarak büyütüyoruz."}
        </p>
      </div>

      {/* Sincere Story Card */}
      <div className="glass-card izmir-story-card" style={{
      marginBottom: '4rem'
    }}>
        <div className="story-content">
          <span className="story-tag">{settingsData?.about_story_tag || "BİZİM ANLAYIŞIMIZ"}</span>
          <h2>{settingsData?.about_story_title || "E-postalara ve Ofislere Hapsolmayan Özgürlük"}</h2>
          <p>
            {settingsData?.about_story_p1 || "Ajans Rota, tek bir plazanın gri duvarlarına ve tekdüze e-posta zincirlerine hapsolmuş geleneksel ajans modelini kırmak amacıyla kuruldu. Kurulma amacımız; Ege'nin özgür ruhunu, 360 derece dijital uzmanlık (Sosyal Medya, SEO, Web Tasarım ve Google/Meta Reklamcılığı) ile birleştirerek markalara tamamen şeffaf, samimi ve sonuç odaklı bir büyüme ortaklığı sunmaktır. Çeşme'den Bodrum'a, Urla'dan Karşıyaka'ya Ege'nin ilham veren noktalarından uzaktan (remote) çalışan kreatif ve teknik ekibimizle, fiziki ofislerin hantal maliyetlerini ortadan kaldırıyor; tüm enerjimizi ve tecrübemizi markanızın dijital varlığını güçlendirmeye odaklıyoruz."}
          </p>
          <p>
            {settingsData?.about_story_p2 || "Yıllara dayanan sektör tecrübemizle biliyoruz ki dijital büyüme tek yönlü olamaz. Sadece reklam panellerini yönetmiyor; markanızın kimliğini yansıtan Ege samimiyetinde Sosyal Medya Yönetimi yapıyor, Google'da en üst sıralara kalıcı olarak yerleşmenizi sağlayan semantik SEO Çalışmaları yürütüyor ve kullanıcıları müşteriye dönüştüren hızlı, modern ve özel Web Tasarım (CRO) projeleri geliştiriyoruz. Raporları anlaşılmaz PDF'lerle geçiştirmek yerine, Kemeraltı esnafının kadim dürüstlüğüyle her aşamayı şeffaflıkla ve yüz yüze güvenle paylaşıyoruz."}
          </p>
          <div className="story-quote">
            <i className="fa-solid fa-quote-left"></i>
            <span>{settingsData?.about_story_quote || "Ege'nin bereketiyle dijitalin gücünü birleştiriyor, markanızı yerelden küresele taşıyacak dijital rotayı birlikte çiziyoruz."}</span>
          </div>
        </div>
        <div className="story-visual">
          <div className="story-image-wrapper">
            <picture>
              {settingsData?.about_story_image_mobile && <source media="(max-width: 768px)" srcSet={settingsData.about_story_image_mobile} />}
              <img src={settingsData?.about_story_image || "/images/remote_freedom.png"} alt="Ajans Rota Uzaktan Çalışma Özgürlüğü" className="story-image" width="600" height="400" fetchPriority="high" decoding="async" />
            </picture>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="izmir-values-section" style={{
      marginBottom: '4rem'
    }}>
        <h2 style={{
        textAlign: 'center',
        fontFamily: 'var(--font-heading)',
        color: 'var(--text-light)',
        fontSize: '2rem',
        marginBottom: '2.5rem',
        fontWeight: 700
      }}>
          {settingsData?.about_culture_title || "Çalışma Kültürümüzün 3 Altın Kuralı"}
        </h2>
        <div className="izmir-values-grid">
          <div className="glass-card value-card">
            <div className="value-icon-wrapper text-primary">
              <i className={settingsData?.about_rule1_icon || "fa-solid fa-eye"}></i>
            </div>
            <h3>{settingsData?.about_rule1_title || "İncir Çekirdeği Detaycılığı"}</h3>
            <p>
              {settingsData?.about_rule1_desc || "Bizim için reklamlarda boşa giden tek bir kuruş bile kabul edilemez. Ege'nin ünlü deyiminden ilhamla; kampanyalarınızı en ince ayrıntısına kadar planlıyor, gereksiz arama terimlerini ve hatalı hedeflemeleri ayıklayarak sıfır bütçe israfı hedefliyoruz."}
            </p>
          </div>
          
          <div className="glass-card value-card">
            <div className="value-icon-wrapper text-secondary">
              <i className={settingsData?.about_rule2_icon || "fa-solid fa-bolt"}></i>
            </div>
            <h3>{settingsData?.about_rule2_title || "Sakin Planlama & Fırtınalı Aksiyon"}</h3>
            <p>
              {settingsData?.about_rule2_desc || "Stratejilerimizi ve veri analizlerimizi Seferihisar sakinliğiyle, derinlemesine düşünüp planlıyoruz. Ancak optimizasyon ve aksiyon vakti geldiğinde, en hızlı, çevik ve kararlı adımlarla rakiplerinizin önüne geçiyoruz."}
            </p>
          </div>

          <div className="glass-card value-card">
            <div className="value-icon-wrapper text-accent">
              <i className={settingsData?.about_rule3_icon || "fa-solid fa-spa"}></i>
            </div>
            <h3>{settingsData?.about_rule3_title || "Bağ Sinerjisi & Ortak Büyüme"}</h3>
            <p>
              {settingsData?.about_rule3_desc || "İşbirliğimizi sıradan bir müşteri-hizmet ilişkisi olarak görmüyoruz. Markanızı Ege'nin bereketli üzüm bağları gibi ele alıyor; sabırla, özenle ve doğru budamalarla işleyerek her sezon daha yüksek dijital rekolte ve ortak verim sağlıyoruz."}
            </p>
          </div>
        </div>
      </div>

            {/* Warm Boyoz Invitation */}
      <div className="glass-card izmir-coffee-card" style={{
      marginBottom: '4rem'
    }}>
        <div className="coffee-image">
          <div className="coffee-cup-visual">
            <i className="fa-solid fa-mug-saucer cup-icon"></i>
            <div className="steam-line steam-1"></div>
            <div className="steam-line steam-2"></div>
            <div className="steam-line steam-3"></div>
            <div className="olive-decor">
              <i className="fa-solid fa-seedling"></i>
              <i className="fa-solid fa-anchor"></i>
            </div>
          </div>
        </div>
        <div className="coffee-text">
          <h2>"{settingsData?.about_coffee_title || "Çevrimiçi ya da Yüz Yüze Bir Kahveye?"}"</h2>
          <p>
            {settingsData?.about_coffee_desc || "Her ne kadar uzaktan çalışsak da, İzmir ve çevresindeki markalarımızla yüz yüze buluşmayı çok seviyoruz. Dilediğiniz an görüntülü bir toplantı planlayalım ya da İzmir'in güzel bir kahve durağında, sıcak bir boyoz ve taze demlenmiş çay eşliğinde hedeflerinizi konuşalım."}
          </p>
          <button className="btn btn-primary" onClick={onNavToContact} style={{
          marginTop: '1rem'
        }}>
            {settingsData?.about_coffee_btn || "Bizimle Tanışın"} <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>;
}

// Dynamic Legal Pages View Component (Privacy, Terms, KVKK, Cookies)
