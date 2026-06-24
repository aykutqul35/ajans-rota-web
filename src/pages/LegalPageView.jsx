import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // Dynamic Legal Pages View Component (Privacy, Terms, KVKK, Cookies)
function LegalPageView({
  pageKey,
  onBack,
  settingsData,
  currentPath
}) {
  const resolvedKey = pageKey || (currentPath === '/gizlilik-politikasi' ? 'privacy' : currentPath === '/kullanim-kosullari' ? 'terms' : currentPath === '/kvkk-aydinlatma-metni' ? 'kvkk' : currentPath === '/cerez-politikasi' ? 'cookies' : '');
  let title = "";
  let content = "";
  let breadcrumbName = "";
  if (resolvedKey === 'privacy') {
    title = settingsData?.privacy_policy_title || "Gizlilik Politikası";
    content = settingsData?.privacy_policy_content || "";
    breadcrumbName = "Gizlilik Politikası";
  } else if (resolvedKey === 'terms') {
    title = settingsData?.terms_of_use_title || "Kullanım Koşulları";
    content = settingsData?.terms_of_use_content || "";
    breadcrumbName = "Kullanım Koşulları";
  } else if (resolvedKey === 'kvkk') {
    title = settingsData?.kvkk_text_title || "KVKK Aydınlatma Metni";
    content = settingsData?.kvkk_text_content || "";
    breadcrumbName = "KVKK Aydınlatma Metni";
  } else if (resolvedKey === 'cookies') {
    title = settingsData?.cookies_policy_title || "Çerez Politikası";
    content = settingsData?.cookies_policy_content || "";
    breadcrumbName = "Çerez Politikası";
  }
  return <div className="legal-page-view container" style={{
    paddingTop: '6rem',
    paddingBottom: '4rem',
    minHeight: '100vh'
  }}>
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav" style={{
      marginBottom: '2.5rem'
    }}>
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">{breadcrumbName}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-card" style={{
      padding: '2.5rem',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.7) 0%, rgba(255, 255, 255, 0.45) 100%)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'var(--shadow-lg)'
    }}>
        <h1 style={{
        fontSize: '2rem',
        fontFamily: 'var(--font-heading)',
        fontWeight: '800',
        color: 'var(--text-light)',
        marginBottom: '2rem',
        borderBottom: '1px solid var(--glass-border)',
        paddingBottom: '1rem'
      }}>
          {title}
        </h1>
        <div className="legal-content" style={{
        color: 'var(--text-light)',
        lineHeight: '1.7',
        fontSize: '0.95rem'
      }} dangerouslySetInnerHTML={{
        __html: content
      }} />
      </div>
    </div>;
}

// Dedicated Team Page View Component
