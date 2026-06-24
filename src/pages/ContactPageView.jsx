import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { budgetSteps, initialServicePagesData, featuredStories, initialTeamMembers, initialBlogPosts, categories, whyAgencyData, testimonials } from '../data/mockData';
import FadeIn from '../components/FadeIn';
import StaggerContainer, { StaggerItem } from '../components/StaggerContainer';
import ClientTransparencyPageView from '../components/ClientTransparencyPageView';

export default // Dedicated Contact Page View Component
function ContactPageView({
  onBack,
  settingsData
}) {
  return <div className="contact-page-view container">
      {/* Navigation & Breadcrumb */}
      <div className="service-page-nav">
        <button className="btn btn-secondary back-btn" onClick={onBack}>
          <i className="fa-solid fa-arrow-left"></i> Ana Sayfaya Dön
        </button>
        <div className="breadcrumb">
          <span>Ana Sayfa</span> &rarr; <span className="active">İletişim</span>
        </div>
      </div>

      {/* Hero Header */}
      <div className="izmir-hero-header">
        <h1 className="izmir-hero-title">
          {settingsData?.contact_title_top || "Bizimle"} <br />
          <span>{settingsData?.contact_title_span || "İletişime Geçin"}</span>
        </h1>
        <p className="izmir-hero-desc">
          {settingsData?.contact_desc || "Ege'nin samimiyetiyle dijital dünyada yanınızdayız. Ekibimizle hemen bir görüntülü toplantı planlayın veya dilediğiniz zaman İzmir'de yüz yüze kahve eşliğinde büyüme hedeflerinizi konuşalım."}
        </p>
      </div>
    </div>;
}

// Dedicated SEO Audit Page View Component
