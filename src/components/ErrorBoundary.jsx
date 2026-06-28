import { Component } from 'react';

/**
 * Error Boundary component that catches JS errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}>
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '1.5rem',
            boxShadow: '0 8px 32px rgba(2,132,199,0.3)',
          }}>
            <i className="fa-solid fa-triangle-exclamation" style={{ color: '#fff', fontSize: '1.8rem' }}></i>
          </div>
          <h2 style={{ 
            fontSize: '1.5rem', fontWeight: 700, color: '#0f172a',
            margin: '0 0 0.75rem'
          }}>
            Bir Sorun Oluştu
          </h2>
          <p style={{ 
            fontSize: '1rem', color: '#64748b', maxWidth: '400px',
            margin: '0 0 1.5rem', lineHeight: 1.6
          }}>
            Bu bölüm yüklenirken beklenmeyen bir hata oluştu. Sayfayı yenileyerek tekrar deneyebilirsiniz.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '12px',
              border: 'none',
              background: 'linear-gradient(135deg, #0284c7, #7c3aed)',
              color: '#fff',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(2,132,199,0.3)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(2,132,199,0.4)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(2,132,199,0.3)';
            }}
          >
            <i className="fa-solid fa-rotate-right" style={{ marginRight: '8px' }}></i>
            Sayfayı Yenile
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
