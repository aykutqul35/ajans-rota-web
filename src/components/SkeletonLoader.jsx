import './SkeletonLoader.css';

export default function SkeletonLoader() {
  return (
    <div className="skeleton-container">
      {/* Header Skeleton */}
      <div className="skeleton-header">
        <div className="skeleton-logo pulse"></div>
        <div className="skeleton-nav">
          <div className="skeleton-nav-item pulse"></div>
          <div className="skeleton-nav-item pulse"></div>
          <div className="skeleton-nav-item pulse"></div>
        </div>
      </div>
      
      {/* Hero Section Skeleton */}
      <div className="skeleton-hero">
        <div className="skeleton-title pulse"></div>
        <div className="skeleton-subtitle pulse"></div>
        <div className="skeleton-button pulse"></div>
      </div>

      {/* Grid Content Skeleton */}
      <div className="skeleton-grid">
        <div className="skeleton-card pulse"></div>
        <div className="skeleton-card pulse"></div>
        <div className="skeleton-card pulse"></div>
      </div>
    </div>
  );
}
