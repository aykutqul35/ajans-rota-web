import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

const slugify = text => {
  if (!text) return "";
  return text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[ğĞ]/g, 'g').replace(/[üÜ]/g, 'u').replace(/[şŞ]/g, 's').replace(/[ıİ]/g, 'i').replace(/[öÖ]/g, 'o').replace(/[çÇ]/g, 'c').replace(/[^\w\-]+/g, '').replace(/\-\-+/g, '-').replace(/^-+/, '').replace(/-+$/, '');
};

const getCategoryLabel = (key) => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.label : key;
};

const getCategoryIcon = (key) => {
  const cat = categories.find(c => c.key === key);
  return cat ? cat.icon : 'fa-solid fa-file-lines';
};

export default function BlogPageView({
  onBack,
  onNavToContact,
  blogPosts = initialBlogPosts,
  initialSlug = null,
  setCurrentPath
}) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPost, setSelectedPost] = useState(() => {
    if (initialSlug) {
      return blogPosts.find(post => slugify(post.title) === initialSlug) || null;
    }
    return null;
  });
  const handleSelectPost = post => {
    setSelectedPost(post);
    const slug = slugify(post.title);
    if (setCurrentPath) {
      setCurrentPath(`/blog/${slug}`);
    }
    window.history.pushState({}, '', `/blog/${slug}`);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  const handleBackToList = () => {
    setSelectedPost(null);
    if (setCurrentPath) {
      setCurrentPath('/blog');
    }
    window.history.pushState({}, '', '/blog');
    window.scrollTo(0, 0);
  };
  const filteredPosts = activeCategory === 'all' ? blogPosts : blogPosts.filter(post => post.category === activeCategory);
  if (selectedPost) {
    // Find related posts (same category first, up to 3 posts, excluding the selected one)
    const relatedPosts = blogPosts.filter(post => post.id !== selectedPost.id).sort((a, b) => {
      if (a.category === selectedPost.category && b.category !== selectedPost.category) return -1;
      if (a.category !== selectedPost.category && b.category === selectedPost.category) return 1;
      return 0;
    }).slice(0, 3);
    const hasHTML = /<\/?[a-z][\s\S]*>/i.test(selectedPost.content);
    return <div className="blog-page-view container">
        <div className="service-page-nav">
          <button className="btn btn-secondary back-btn" onClick={handleBackToList}>
            <i className="fa-solid fa-arrow-left"></i> Blog Listesine Dön
          </button>
          <div className="breadcrumb">
            <span style={{
            cursor: 'pointer'
          }} onClick={onBack}>Ana Sayfa</span> &rarr;{' '}
            <span style={{
            cursor: 'pointer'
          }} onClick={handleBackToList}>Blog</span> &rarr;{' '}
            <span className="active">{getCategoryLabel(selectedPost.category)}</span>
          </div>
        </div>

        <div className="glass-card blog-detail-card">
          <div className={`blog-detail-hero-gradient bg-${selectedPost.category}`}>
            <i className={getCategoryIcon(selectedPost.category)}></i>
          </div>
          <div className="blog-detail-content">
            <span className="blog-detail-category-tag">{getCategoryLabel(selectedPost.category)}</span>
            <h1 className="blog-detail-title">{selectedPost.title}</h1>
            <div className="blog-detail-meta">
              <span><i className="fa-solid fa-calendar-days"></i> {selectedPost.date}</span>
              <span><i className="fa-solid fa-clock"></i> {selectedPost.readTime}</span>
              <span><i className="fa-solid fa-user"></i> {selectedPost.author}</span>
            </div>
            
            <div className="blog-detail-body">
              {hasHTML ? <div className="blog-content-preview" style={{
              fontSize: '1.05rem',
              lineHeight: '1.8',
              color: 'var(--text-main)'
            }} dangerouslySetInnerHTML={{
              __html: selectedPost.content
            }} /> : selectedPost.content.split('\n\n').map((para, idx) => {
              if (para.startsWith('**')) {
                return <h3 key={idx} style={{
                  marginTop: '2rem',
                  marginBottom: '1rem',
                  color: 'var(--text-light)',
                  fontSize: '1.4rem'
                }}>{para.replace(/\*\*/g, '')}</h3>;
              }
              if (para.startsWith('- ')) {
                return <ul key={idx} style={{
                  paddingLeft: '1.5rem',
                  marginBottom: '1.5rem',
                  listStyleType: 'disc'
                }}>
                        {para.split('\n').map((li, lidx) => <li key={lidx} style={{
                    marginBottom: '0.5rem',
                    color: 'var(--text-main)'
                  }}>{li.replace('- ', '')}</li>)}
                      </ul>;
              }
              return <p key={idx} style={{
                marginBottom: '1.25rem',
                lineHeight: '1.8',
                color: 'var(--text-main)'
              }}>{para}</p>;
            })}
            </div>
          </div>
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && <div className="related-blogs-section" style={{
        marginTop: '4rem',
        marginBottom: '2rem'
      }}>
            <h3 style={{
          fontSize: '1.5rem',
          fontWeight: '800',
          color: 'var(--text-light)',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
              <i className="fa-solid fa-layer-group" style={{
            color: 'var(--primary)',
            fontSize: '1.25rem'
          }}></i>
              Bu Kategoride İlginizi Çekebilecek Diğer Rehberler
            </h3>
            
            <div className="blog-grid">
              {relatedPosts.map(post => <div key={post.id} className="glass-card blog-card" onClick={() => handleSelectPost(post)} style={{
            cursor: 'pointer'
          }}>
                  <div className={`blog-card-gradient bg-${post.category}`}>
                    <i className={getCategoryIcon(post.category)}></i>
                  </div>
                  <div className="blog-card-content" style={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
                    <span className="blog-card-category-tag">{getCategoryLabel(post.category)}</span>
                    <h4 style={{
                fontSize: '1.1rem',
                fontWeight: '700',
                color: 'var(--text-light)',
                marginTop: '0.5rem',
                marginBottom: '0.75rem',
                lineHeight: '1.4'
              }}>{post.title}</h4>
                    <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)',
                lineHeight: '1.5',
                flexGrow: 1,
                marginBottom: '1rem'
              }}>{post.excerpt}</p>
                    <div className="blog-card-meta" style={{
                marginTop: 'auto'
              }}>
                      <span><i className="fa-solid fa-calendar-days"></i> {post.date}</span>
                      <span><i className="fa-solid fa-clock"></i> {post.readTime}</span>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>}

        <div className="glass-card service-bottom-cta" style={{
        marginBottom: '4rem',
        marginTop: '3rem'
      }}>
          <div className="cta-content">
            <h2>Bu Stratejileri Markanız İçin de Uygulayalım</h2>
            <p>Dijital pazarlamada Ege'nin bereketiyle büyüme hedeflerinize ulaşmak için ücretsiz analiz talebinde bulunun.</p>
            <div className="cta-action">
              <button className="btn btn-primary cta-btn" onClick={onNavToContact}>
                Ücretsiz Analiz Al <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>;
  }
  return <div className="blog-page-view container">
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span style={{
          cursor: 'pointer'
        }} onClick={onBack}>Ana Sayfa</span> &rarr; <span className="active">Blog</span>
        </div>
      </div>

      <div className="izmir-hero-header" style={{
      marginBottom: '2.5rem'
    }}>
        <h1 className="izmir-hero-title">Ajans Rota Blog <br /><span>Dijital Pusulanız ve Rehberler</span></h1>
        <p className="izmir-hero-desc">
          Google Ads, Sosyal Medya ve SEO konularında Ege sıcaklığında kaleme aldığımız güncel teknikler ve büyüme rehberleri.
        </p>
      </div>

      <div className="blog-category-bar">
        {categories.map(cat => <button key={cat.key} className={`blog-category-btn ${activeCategory === cat.key ? 'active' : ''}`} onClick={() => {
        setActiveCategory(cat.key);
        setSelectedPost(null);
      }}>
            <i className={cat.icon}></i> {cat.label}
          </button>)}
      </div>

      {filteredPosts.length > 0 ? <div className="blog-grid">
          {filteredPosts.map(post => <div key={post.id} className="glass-card blog-card" onClick={() => handleSelectPost(post)}>
              <div className={`blog-card-gradient bg-${post.category}`}>
                <i className={getCategoryIcon(post.category)}></i>
              </div>
              <div className="blog-card-content">
                <span className="blog-card-category-tag">{getCategoryLabel(post.category)}</span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <div className="blog-card-meta">
                  <span><i className="fa-solid fa-calendar-days"></i> {post.date}</span>
                  <span><i className="fa-solid fa-clock"></i> {post.readTime}</span>
                </div>
                <button className="btn btn-secondary blog-read-more" onClick={e => {
            e.stopPropagation();
            handleSelectPost(post);
          }}>
                  Devamını Oku <i className="fa-solid fa-arrow-right-long"></i>
                </button>
              </div>
            </div>)}
        </div> : <div className="glass-card" style={{
      padding: '3rem',
      textAlign: 'center',
      color: 'var(--text-muted)'
    }}>
          <i className="fa-solid fa-folder-open" style={{
        fontSize: '3rem',
        marginBottom: '1rem',
        color: 'var(--primary)'
      }}></i>
          <p>Seçilen kategoride henüz blog yazısı bulunmamaktadır.</p>
        </div>}
    </div>;
}

// Detects UTM/Traffic source from URL or referrer
