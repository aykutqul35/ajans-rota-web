import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initialBlogPosts, categories } from '../data/mockData';
import toast from 'react-hot-toast';

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

// Estimate reading time from content
const getReadingTime = (content) => {
  if (!content) return '1 dk';
  const text = content.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ');
  const wordCount = text.split(' ').filter(w => w.length > 0).length;
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} dk okuma`;
};

// Extract headings from HTML content for Table of Contents
const extractHeadings = (content) => {
  if (!content) return [];
  const headings = [];
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].replace(/<[^>]*>/g, '').trim();
    if (text) {
      headings.push({ level, text, id: slugify(text) });
    }
  }
  return headings;
};

// Inject IDs into heading tags in HTML content
const injectHeadingIds = (content) => {
  if (!content) return content;
  return content.replace(/<h([23])([^>]*)>(.*?)<\/h\1>/gi, (match, level, attrs, text) => {
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    const id = slugify(cleanText);
    return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
  });
};

// Scroll Progress Bar Component
const ScrollProgressBar = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(100, Math.max(0, scrolled)));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="blog-scroll-progress-track">
      <div className="blog-scroll-progress-bar" style={{ width: `${progress}%` }} />
    </div>
  );
};

// Table of Contents Component
const TableOfContents = ({ headings }) => {
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter(e => e.isIntersecting);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 }
    );

    headings.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  return (
    <nav className="blog-toc">
      <div className="blog-toc-title">
        <i className="fa-solid fa-list-ul"></i>
        İçindekiler
      </div>
      <ul className="blog-toc-list">
        {headings.map((h, i) => (
          <li key={i} className={`blog-toc-item ${h.level === 3 ? 'blog-toc-sub' : ''} ${activeId === h.id ? 'active' : ''}`}>
            <a href={`#${h.id}`} onClick={(e) => {
              e.preventDefault();
              document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Social Share Buttons
const SocialShareButtons = ({ post }) => {
  const url = window.location.href;
  const title = post.title;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link kopyalandı!');
  };

  return (
    <div className="blog-share-buttons">
      <span className="blog-share-label">
        <i className="fa-solid fa-share-nodes"></i> Paylaş
      </span>
      <button onClick={handleCopyLink} className="blog-share-btn" title="Linki Kopyala" aria-label="Linki Kopyala">
        <i className="fa-solid fa-link"></i>
      </button>
      <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} target="_blank" rel="noopener noreferrer" className="blog-share-btn" title="Twitter'da Paylaş" aria-label="Twitter'da Paylaş">
        <i className="fa-brands fa-x-twitter"></i>
      </a>
      <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`} target="_blank" rel="noopener noreferrer" className="blog-share-btn" title="LinkedIn'de Paylaş" aria-label="LinkedIn'de Paylaş">
        <i className="fa-brands fa-linkedin-in"></i>
      </a>
      <a href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`} target="_blank" rel="noopener noreferrer" className="blog-share-btn" title="WhatsApp'ta Paylaş" aria-label="WhatsApp'ta Paylaş">
        <i className="fa-brands fa-whatsapp"></i>
      </a>
    </div>
  );
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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // ===================== BLOG DETAIL VIEW =====================
  if (selectedPost) {
    const relatedPosts = blogPosts
      .filter(post => post.id !== selectedPost.id)
      .sort((a, b) => {
        if (a.category === selectedPost.category && b.category !== selectedPost.category) return -1;
        if (a.category !== selectedPost.category && b.category === selectedPost.category) return 1;
        return 0;
      })
      .slice(0, 3);

    const hasHTML = /<\/?[a-z][\s\S]*>/i.test(selectedPost.content);
    const headings = hasHTML ? extractHeadings(selectedPost.content) : [];
    const processedContent = hasHTML ? injectHeadingIds(selectedPost.content) : selectedPost.content;
    const readingTime = getReadingTime(selectedPost.content);

    return (
      <>
        <ScrollProgressBar />
        <div className="blog-page-view container">
          <div className="service-page-nav">
            <button className="btn btn-secondary back-btn" onClick={handleBackToList}>
              <i className="fa-solid fa-arrow-left"></i> Blog Listesine Dön
            </button>
            <div className="breadcrumb">
              <span style={{ cursor: 'pointer' }} onClick={onBack}>Ana Sayfa</span> &rarr;{' '}
              <span style={{ cursor: 'pointer' }} onClick={handleBackToList}>Blog</span> &rarr;{' '}
              <span className="active">{getCategoryLabel(selectedPost.category)}</span>
            </div>
          </div>

          {/* Blog Detail Hero */}
          <motion.div
            className="glass-card blog-detail-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={`blog-detail-hero-gradient bg-${selectedPost.category}`}>
              <i className={getCategoryIcon(selectedPost.category)}></i>
            </div>
            <div className="blog-detail-content">
              <span className="blog-detail-category-tag">{getCategoryLabel(selectedPost.category)}</span>
              <h1 className="blog-detail-title">{selectedPost.title}</h1>
              <div className="blog-detail-meta">
                <span><i className="fa-solid fa-calendar-days"></i> {selectedPost.date}</span>
                <span><i className="fa-solid fa-clock"></i> {readingTime}</span>
                <span><i className="fa-solid fa-user"></i> {selectedPost.author}</span>
              </div>

              {/* Social Share */}
              <SocialShareButtons post={selectedPost} />
            </div>
          </motion.div>

          {/* Blog Body with optional TOC sidebar */}
          <div className="blog-detail-layout">
            {headings.length >= 2 && (
              <aside className="blog-detail-sidebar">
                <TableOfContents headings={headings} />
              </aside>
            )}
            <motion.article
              className={`blog-detail-article ${headings.length >= 2 ? 'has-toc' : ''}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="blog-detail-body glass-card">
                {hasHTML ? (
                  <div
                    className="blog-content-rendered"
                    dangerouslySetInnerHTML={{ __html: processedContent }}
                  />
                ) : (
                  selectedPost.content.split('\n\n').map((para, idx) => {
                    if (para.startsWith('**')) {
                      return <h3 key={idx} style={{ marginTop: '2rem', marginBottom: '1rem', color: 'var(--text-light)', fontSize: '1.4rem' }}>{para.replace(/\*\*/g, '')}</h3>;
                    }
                    if (para.startsWith('- ')) {
                      return (
                        <ul key={idx} style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', listStyleType: 'disc' }}>
                          {para.split('\n').map((li, lidx) => (
                            <li key={lidx} style={{ marginBottom: '0.5rem', color: 'var(--text-main)' }}>{li.replace('- ', '')}</li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={idx} style={{ marginBottom: '1.25rem', lineHeight: '1.8', color: 'var(--text-main)' }}>{para}</p>;
                  })
                )}
              </div>

              {/* Bottom Social Share */}
              <div className="blog-detail-bottom-share glass-card">
                <p style={{ margin: 0, fontWeight: 600, color: 'var(--text-light)' }}>Bu yazıyı faydalı buldunuz mu?</p>
                <SocialShareButtons post={selectedPost} />
              </div>
            </motion.article>
          </div>

          {/* Related Posts Section */}
          {relatedPosts.length > 0 && (
            <motion.div
              className="related-blogs-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{ marginTop: '4rem', marginBottom: '2rem' }}
            >
              <h3 style={{
                fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-light)',
                marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <i className="fa-solid fa-layer-group" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}></i>
                İlginizi Çekebilecek Diğer Yazılar
              </h3>
              <div className="blog-grid">
                {relatedPosts.map((post, i) => (
                  <motion.div
                    key={post.id}
                    className="glass-card blog-card"
                    onClick={() => handleSelectPost(post)}
                    style={{ cursor: 'pointer' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 * i }}
                  >
                    <div className={`blog-card-gradient bg-${post.category}`}>
                      <i className={getCategoryIcon(post.category)}></i>
                    </div>
                    <div className="blog-card-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <span className="blog-card-category-tag">{getCategoryLabel(post.category)}</span>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-light)', marginTop: '0.5rem', marginBottom: '0.75rem', lineHeight: '1.4' }}>{post.title}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', flexGrow: 1, marginBottom: '1rem' }}>{post.excerpt}</p>
                      <div className="blog-card-meta" style={{ marginTop: 'auto' }}>
                        <span><i className="fa-solid fa-calendar-days"></i> {post.date}</span>
                        <span><i className="fa-solid fa-clock"></i> {post.readTime}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="glass-card service-bottom-cta" style={{ marginBottom: '4rem', marginTop: '3rem' }}>
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
        </div>
      </>
    );
  }

  // ===================== BLOG LIST VIEW =====================
  return (
    <div className="blog-page-view container">
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span style={{ cursor: 'pointer' }} onClick={onBack}>Ana Sayfa</span> &rarr; <span className="active">Blog</span>
        </div>
      </div>

      <div className="izmir-hero-header" style={{ marginBottom: '2.5rem' }}>
        <h1 className="izmir-hero-title">Ajans Rota Blog <br /><span>Dijital Pusulanız ve Rehberler</span></h1>
        <p className="izmir-hero-desc">
          Google Ads, Sosyal Medya ve SEO konularında Ege sıcaklığında kaleme aldığımız güncel teknikler ve büyüme rehberleri.
        </p>
      </div>

      <div className="blog-category-bar">
        {categories.map(cat => (
          <button
            key={cat.key}
            className={`blog-category-btn ${activeCategory === cat.key ? 'active' : ''}`}
            onClick={() => { setActiveCategory(cat.key); setSelectedPost(null); }}
          >
            <i className={cat.icon}></i> {cat.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {filteredPosts.length > 0 ? (
          <motion.div
            key={activeCategory}
            className="blog-grid"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {filteredPosts.map((post, i) => (
              <motion.div
                key={post.id}
                className="glass-card blog-card"
                onClick={() => handleSelectPost(post)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.08, 0.4) }}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
              >
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
                  <button className="btn btn-secondary blog-read-more" onClick={e => { e.stopPropagation(); handleSelectPost(post); }}>
                    Devamını Oku <i className="fa-solid fa-arrow-right-long"></i>
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <i className="fa-solid fa-folder-open" style={{ fontSize: '3rem', marginBottom: '1rem', color: 'var(--primary)' }}></i>
            <p>Seçilen kategoride henüz blog yazısı bulunmamaktadır.</p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
