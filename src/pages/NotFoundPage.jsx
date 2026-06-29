import { motion } from 'framer-motion';

export default function NotFoundPage({ onGoHome }) {
  return (
    <div className="not-found-page">
      <div className="not-found-bg-glow"></div>
      <div className="container not-found-container">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated 404 Number */}
          <div className="not-found-number">
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >4</motion.span>
            <motion.div
              className="not-found-compass"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.25, type: 'spring', stiffness: 200 }}
            >
              <i className="fa-solid fa-compass"></i>
            </motion.div>
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >4</motion.span>
          </div>

          <motion.h1
            className="not-found-title"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Rota Kayboldu!
          </motion.h1>

          <motion.p
            className="not-found-desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            Aradığınız sayfa taşınmış, silinmiş ya da hiç var olmamış olabilir. 
            Endişelenmeyin, sizi doğru rotaya yönlendirelim.
          </motion.p>

          <motion.div
            className="not-found-actions"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <button className="btn btn-primary btn-glow" onClick={onGoHome}>
              <i className="fa-solid fa-house"></i>
              <span>Ana Sayfaya Dön</span>
            </button>
            <button className="btn btn-secondary" onClick={() => window.history.back()}>
              <i className="fa-solid fa-arrow-left"></i>
              <span>Geri Git</span>
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            className="not-found-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <span className="not-found-links-label">Popüler sayfalar:</span>
            <a href="/blog" onClick={(e) => { e.preventDefault(); onGoHome(); window.history.pushState({}, '', '/blog'); window.location.reload(); }}>Blog</a>
            <a href="/referanslar" onClick={(e) => { e.preventDefault(); onGoHome(); window.history.pushState({}, '', '/referanslar'); window.location.reload(); }}>Referanslar</a>
            <a href="/iletisim" onClick={(e) => { e.preventDefault(); onGoHome(); window.history.pushState({}, '', '/iletisim'); window.location.reload(); }}>İletişim</a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
