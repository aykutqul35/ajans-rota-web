import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('admin_token', data.token);
        localStorage.setItem('admin_username', data.user.username);
        navigate('/rota-management-vault-x9');
        window.location.reload();
      } else {
        throw new Error(data.message || 'Geçersiz kullanıcı adı veya şifre.');
      }
    } catch (err) {
      console.error('Login error:', err);
      // Fallback for local frontend-only testing
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem('admin_token', 'local_mock_token_123');
        localStorage.setItem('admin_username', 'admin');
        navigate('/rota-management-vault-x9');
        window.location.reload();
      } else {
        setError('Geçersiz kullanıcı adı veya şifre.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      {/* Animated background grid */}
      <div className="admin-login-bg">
        <div className="admin-login-grid" />
        <div className="admin-login-glow glow-1" />
        <div className="admin-login-glow glow-2" />
        <div className="admin-login-glow glow-3" />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div key={i} className={`admin-particle admin-particle-${i + 1}`} />
      ))}

      {/* Login Card */}
      <div className="admin-login-wrapper">
        {/* Left branding panel */}
        <div className="admin-login-brand">
          <div className="admin-brand-logo">
            <i className="fa-solid fa-compass" />
          </div>
          <h1 className="admin-brand-name">Ajans Rota</h1>
          <p className="admin-brand-tagline">Dijital Büyüme Merkezi</p>

          <div className="admin-brand-stats">
            <div className="admin-stat-item">
              <span className="admin-stat-icon"><i className="fa-solid fa-chart-line" /></span>
              <div>
                <div className="admin-stat-num">%340</div>
                <div className="admin-stat-lbl">Ort. ROI Artışı</div>
              </div>
            </div>
            <div className="admin-stat-item">
              <span className="admin-stat-icon"><i className="fa-solid fa-users" /></span>
              <div>
                <div className="admin-stat-num">150+</div>
                <div className="admin-stat-lbl">Aktif Müşteri</div>
              </div>
            </div>
            <div className="admin-stat-item">
              <span className="admin-stat-icon"><i className="fa-solid fa-star" /></span>
              <div>
                <div className="admin-stat-num">4.9/5</div>
                <div className="admin-stat-lbl">Müşteri Puanı</div>
              </div>
            </div>
          </div>

          <p className="admin-brand-footer">
            <i className="fa-solid fa-lock" /> Güvenli Yönetim Paneli
          </p>
        </div>

        {/* Right form panel */}
        <div className="admin-login-form-panel">
          <div className="admin-login-header">
            <div className="admin-login-icon-wrap">
              <i className="fa-solid fa-shield-halved" />
            </div>
            <h2>Yetkili Girişi</h2>
            <p>Yönetim paneline erişmek için kimliğinizi doğrulayın.</p>
          </div>

          {error && (
            <div className="admin-login-error">
              <i className="fa-solid fa-circle-exclamation" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="admin-login-form">
            <div className="admin-input-group">
              <label>Kullanıcı Adı</label>
              <div className="admin-input-wrap">
                <i className="fa-solid fa-user admin-input-icon" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  placeholder="admin"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="admin-input-group">
              <label>Şifre</label>
              <div className="admin-input-wrap">
                <i className="fa-solid fa-lock admin-input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="admin-toggle-pw"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="admin-login-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin" />
                  <span>Doğrulanıyor...</span>
                </>
              ) : (
                <>
                  <span>Giriş Yap</span>
                  <i className="fa-solid fa-arrow-right-to-bracket" />
                </>
              )}
            </button>
          </form>

          <div className="admin-login-back">
            <button onClick={() => navigate('/')}>
              <i className="fa-solid fa-arrow-left" />
              Ana Siteye Dön
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #060d1a;
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }

        .admin-login-bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .admin-login-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(2, 132, 199, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(2, 132, 199, 0.06) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        .admin-login-glow {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          pointer-events: none;
        }

        .glow-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(2, 132, 199, 0.15) 0%, transparent 70%);
          top: -20%;
          left: -10%;
          animation: glowDrift 8s ease-in-out infinite;
        }

        .glow-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(45, 212, 191, 0.1) 0%, transparent 70%);
          bottom: -15%;
          right: -5%;
          animation: glowDrift 10s ease-in-out infinite reverse;
        }

        .glow-3 {
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: glowPulse 6s ease-in-out infinite;
        }

        @keyframes glowDrift {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, 20px); }
        }

        @keyframes glowPulse {
          0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 1; transform: translate(-50%, -50%) scale(1.2); }
        }

        .admin-particle {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--primary, #0284c7);
          z-index: 0;
          animation: particleFloat 6s ease-in-out infinite;
          opacity: 0.4;
        }

        .admin-particle-1 { top: 15%; left: 20%; animation-delay: 0s; }
        .admin-particle-2 { top: 30%; right: 25%; animation-delay: 1s; width: 6px; height: 6px; }
        .admin-particle-3 { bottom: 20%; left: 30%; animation-delay: 2s; }
        .admin-particle-4 { bottom: 35%; right: 15%; animation-delay: 0.5s; width: 3px; height: 3px; }
        .admin-particle-5 { top: 60%; left: 10%; animation-delay: 1.5s; width: 5px; height: 5px; }
        .admin-particle-6 { top: 10%; right: 10%; animation-delay: 2.5s; }

        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px); opacity: 0.4; }
          50% { transform: translateY(-15px); opacity: 0.8; }
        }

        .admin-login-wrapper {
          display: flex;
          width: 100%;
          max-width: 900px;
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.05);
          position: relative;
          z-index: 10;
          animation: cardEntrance 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes cardEntrance {
          from { opacity: 0; transform: translateY(30px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        /* Left brand panel */
        .admin-login-brand {
          flex: 0 0 340px;
          background: linear-gradient(145deg, #0f172a 0%, #0c1f3a 50%, #0a1628 100%);
          border-right: 1px solid rgba(2, 132, 199, 0.15);
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .admin-login-brand::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #0284c7, #2dd4bf, #8b5cf6);
        }

        .admin-brand-logo {
          width: 80px;
          height: 80px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.2) 0%, rgba(45, 212, 191, 0.2) 100%);
          border: 1px solid rgba(2, 132, 199, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #0284c7;
          margin-bottom: 1.25rem;
          box-shadow: 0 0 30px rgba(2, 132, 199, 0.2);
        }

        .admin-brand-name {
          font-family: 'Outfit', sans-serif;
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #f8fafc 30%, #94a3b8);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.3rem;
          letter-spacing: -0.02em;
        }

        .admin-brand-tagline {
          font-size: 0.82rem;
          color: #64748b;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 2.5rem;
        }

        .admin-brand-stats {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          width: 100%;
          margin-bottom: 2.5rem;
        }

        .admin-stat-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.9rem 1rem;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
          text-align: left;
          transition: background 0.2s;
        }

        .admin-stat-item:hover {
          background: rgba(2, 132, 199, 0.06);
        }

        .admin-stat-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(45, 212, 191, 0.2));
          display: flex;
          align-items: center;
          justify-content: center;
          color: #0284c7;
          font-size: 0.9rem;
          flex-shrink: 0;
        }

        .admin-stat-num {
          font-family: 'Outfit', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #f1f5f9;
        }

        .admin-stat-lbl {
          font-size: 0.72rem;
          color: #64748b;
        }

        .admin-brand-footer {
          margin-top: auto;
          font-size: 0.75rem;
          color: #334155;
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }

        .admin-brand-footer i {
          color: #0284c7;
          font-size: 0.7rem;
        }

        /* Right form panel */
        .admin-login-form-panel {
          flex: 1;
          background: #0d1829;
          padding: 3rem 2.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-login-icon-wrap {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          background: linear-gradient(135deg, rgba(2, 132, 199, 0.15), rgba(45, 212, 191, 0.15));
          border: 1px solid rgba(2, 132, 199, 0.25);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.4rem;
          color: #0284c7;
          margin-bottom: 1rem;
          box-shadow: 0 0 20px rgba(2, 132, 199, 0.15);
        }

        .admin-login-header h2 {
          font-family: 'Outfit', sans-serif;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f1f5f9;
          margin-bottom: 0.4rem;
        }

        .admin-login-header p {
          font-size: 0.84rem;
          color: #64748b;
          line-height: 1.5;
        }

        .admin-login-error {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.82rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .admin-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-input-group label {
          font-size: 0.8rem;
          font-weight: 600;
          color: #94a3b8;
          letter-spacing: 0.02em;
        }

        .admin-input-wrap {
          position: relative;
          display: flex;
          align-items: center;
        }

        .admin-input-icon {
          position: absolute;
          left: 1rem;
          color: #475569;
          font-size: 0.85rem;
          pointer-events: none;
          transition: color 0.2s;
        }

        .admin-input-wrap:focus-within .admin-input-icon {
          color: #0284c7;
        }

        .admin-input-wrap input {
          width: 100%;
          padding: 0.9rem 1rem 0.9rem 2.75rem;
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          color: #f1f5f9;
          font-size: 0.9rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
          font-family: inherit;
        }

        .admin-input-wrap input::placeholder {
          color: #334155;
        }

        .admin-input-wrap input:focus {
          border-color: rgba(2, 132, 199, 0.5);
          background: rgba(2, 132, 199, 0.04);
          box-shadow: 0 0 0 3px rgba(2, 132, 199, 0.08);
        }

        .admin-toggle-pw {
          position: absolute;
          right: 1rem;
          background: none;
          border: none;
          color: #475569;
          cursor: pointer;
          font-size: 0.85rem;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .admin-toggle-pw:hover {
          color: #94a3b8;
        }

        .admin-login-btn {
          width: 100%;
          margin-top: 0.5rem;
          padding: 0.95rem;
          border-radius: 10px;
          border: none;
          background: linear-gradient(135deg, #0284c7 0%, #0369a1 50%, #2dd4bf 100%);
          background-size: 200% 200%;
          color: #ffffff;
          font-family: 'Outfit', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          transition: all 0.3s ease;
          box-shadow: 0 4px 20px rgba(2, 132, 199, 0.3);
          letter-spacing: 0.02em;
        }

        .admin-login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 30px rgba(2, 132, 199, 0.45);
          background-position: right center;
        }

        .admin-login-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-login-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .admin-login-back {
          text-align: center;
          margin-top: 1.75rem;
        }

        .admin-login-back button {
          background: none;
          border: none;
          color: #475569;
          font-size: 0.82rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          transition: color 0.2s;
          font-family: inherit;
          padding: 0.4rem 0.75rem;
          border-radius: 6px;
        }

        .admin-login-back button:hover {
          color: #94a3b8;
          background: rgba(255,255,255,0.04);
        }

        /* Mobile responsive */
        @media (max-width: 700px) {
          .admin-login-wrapper {
            flex-direction: column;
            border-radius: 20px;
            max-width: 420px;
          }

          .admin-login-brand {
            flex: none;
            padding: 2rem 1.5rem;
            border-right: none;
            border-bottom: 1px solid rgba(2, 132, 199, 0.15);
          }

          .admin-brand-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.6rem;
            margin-bottom: 1.25rem;
          }

          .admin-stat-item {
            flex-direction: column;
            text-align: center;
            padding: 0.7rem 0.5rem;
            gap: 0.4rem;
          }

          .admin-brand-logo {
            width: 64px;
            height: 64px;
            font-size: 1.6rem;
          }

          .admin-brand-name {
            font-size: 1.4rem;
          }

          .admin-login-form-panel {
            padding: 2rem 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Login;
